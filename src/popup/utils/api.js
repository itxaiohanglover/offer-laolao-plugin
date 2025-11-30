// API调用工具模块
// 处理简历解析API的调用

// 确保函数在全局作用域中可用（浏览器扩展环境）
// 在浏览器扩展的popup环境中，需要显式地将函数绑定到全局作用域
var globalScope = (function() {
    if (typeof window !== 'undefined') {
        return window;
    } else if (typeof global !== 'undefined') {
        return global;
    } else {
        return this;
    }
})();

/**
 * 将文件转换为Base64编码
 * @param {File} file - 要转换的文件
 * @returns {Promise<string>} Base64编码的字符串
 */
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            // 移除data:type;base64,前缀，只保留base64数据
            const base64 = e.target.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = function(error) {
            reject(error);
        };
        reader.readAsDataURL(file);
    });
}

/**
 * 调用简历解析API
 * @param {File} file - 简历文件
 * @param {string} apiUrl - API地址
 * @param {string} apiKey - API密钥（AppCode）
 * @returns {Promise<object>} 解析后的简历数据
 */
async function parseResumeByAPI(file, apiUrl, apiKey) {
    try {
        console.log('开始调用简历解析API:', { fileName: file.name, fileType: file.type, fileSize: file.size });
        
        // 检查API配置
        if (!apiUrl || !apiKey) {
            throw new Error('API配置不完整，请在设置中配置API URL和API Key');
        }
        
        // 将文件转换为Base64
        // fileToBase64已经返回了纯base64数据（没有前缀）
        const base64Data = await fileToBase64(file);
        
        // 构建请求体（根据阿里云API文档格式）
        const requestBody = {
            file_name: file.name,           // 简历文件名（需包含正确的后缀名）
            file_cont: base64Data,          // 简历内容（base64编码的简历内容）
            need_avatar: 0,                 // 是否需要提取头像图片
            ocr_type: 1                     // 1为高级ocr
        };
        
        console.log('API请求参数:', {
            url: apiUrl,
            file_name: file.name,
            file_size: file.size,
            base64_length: base64Data.length,
            has_appcode: !!apiKey && apiKey.length > 0
        });
        
        // 发送API请求
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': 'APPCODE ' + apiKey  // 阿里云API使用APPCODE认证
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API请求失败:', {
                status: response.status,
                statusText: response.statusText,
                error: errorText,
                url: apiUrl,
                has_appcode: !!apiKey
            });
            
            // 401错误通常是认证问题
            if (response.status === 401) {
                throw new Error('API认证失败（401），请检查APP Code是否正确。如果APP Code正确，可能是API服务未激活或已过期。');
            }
            
            throw new Error(`API请求失败: ${response.status} ${response.statusText} - ${errorText}`);
        }
        
        const result = await response.json();
        console.log('API响应:', result);
        
        // 根据API返回的数据结构进行解析
        // 这里需要根据实际API返回格式进行调整
        return parseAPIResponse(result);
        
    } catch (error) {
        console.error('调用简历解析API失败:', error);
        throw error;
    }
}

/**
 * 解析API响应数据，转换为表单数据格式
 * @param {object} apiResponse - API返回的原始数据
 * @returns {object} 格式化后的简历数据
 */
function parseAPIResponse(apiResponse) {
    const resumeData = {
        personalInfo: {},
        education: [],
        workExperience: [],
        projects: [],
        skills: [],
        languages: []
    };

    let rawData = null;
    if (apiResponse && typeof apiResponse === 'object') {
        if (apiResponse.result) {
            rawData = apiResponse.result;
        } else if (apiResponse.data) {
            rawData = apiResponse.data;
        } else if (apiResponse.body) {
            rawData = apiResponse.body;
        } else {
            rawData = apiResponse;
        }
    }

    if (!rawData) {
        console.warn('API返回数据为空，返回默认结构');
        return resumeData;
    }

    // 基本信息
    resumeData.name = rawData.name || rawData.fullname || '';
    resumeData.gender = rawData.gender_inf || rawData.gender || '';
    resumeData.phone = rawData.phone || rawData.mobile || '';
    resumeData.email = rawData.email || '';
    resumeData['political-status'] = rawData.polit_status || rawData.political_status || '';
    resumeData['expected-position'] = rawData.work_pos_type_p || rawData.work_pos_type || '';
    resumeData['expected-salary'] = (apiResponse.eval && apiResponse.eval.salary) ? apiResponse.eval.salary : '';
    resumeData['self-intro'] = rawData.cont_basic_info || rawData.cont_job_skill || rawData.raw_text || '';

    resumeData.personalInfo = {
        name: resumeData.name || '',
        gender: resumeData.gender || '',
        phone: resumeData.phone || '',
        email: resumeData.email || '',
        'political-status': resumeData['political-status'] || '',
        'expected-position': resumeData['expected-position'] || '',
        'expected-salary': resumeData['expected-salary'] || '',
        'self-intro': resumeData['self-intro'] || ''
    };

    if (rawData.work_pos_type) {
        resumeData.personalInfo['expected-industry'] = rawData.work_pos_type;
    }
    if (rawData.work_city) {
        resumeData.personalInfo['expected-location'] = rawData.work_city;
    }

    // 教育经历
    if (Array.isArray(rawData.education_objs)) {
        resumeData.education = rawData.education_objs.map(function(edu, index) {
            var item = {};
            item['education[' + index + '][school]'] = edu.edu_college || edu.edu_school || '';
            item['education[' + index + '][major]'] = edu.edu_major || '';
            item['education[' + index + '][degree]'] = edu.edu_degree || edu.edu_degree_norm || '';
            item['education[' + index + '][rank]'] = edu.edu_college_rank || edu.edu_college_rank_qs || '';
            item['education[' + index + '][start-date]'] = normalizeDateValue(edu.start_date);
            item['education[' + index + '][end-date]'] = normalizeDateValue(edu.end_date);
            return item;
        });
    }

    // 工作/实习经历
    if (Array.isArray(rawData.job_exp_objs)) {
        resumeData.workExperience = rawData.job_exp_objs.map(function(job, index) {
            var item = {};
            item['internship[' + index + '][company]'] = job.job_cpy || job.job_company || rawData.work_company || '';
            item['internship[' + index + '][position]'] = job.job_pos_type_p || job.job_pos_type || rawData.work_pos_type_p || '';
            item['internship[' + index + '][start-date]'] = normalizeDateValue(job.start_date);
            item['internship[' + index + '][end-date]'] = normalizeDateValue(job.end_date);
            item['internship[' + index + '][description]'] = job.job_content || '';
            return item;
        });
    }

    // 项目经历
    if (Array.isArray(rawData.proj_exp_objs)) {
        resumeData.projects = rawData.proj_exp_objs.map(function(proj, index) {
            var item = {};
            item['project[' + index + '][project-name]'] = proj.proj_name || '';
            item['project[' + index + '][role]'] = proj.proj_role || rawData.work_pos_type_p || '';
            if (proj.start_date || proj.end_date) {
                item['project[' + index + '][project-time]'] = [proj.start_date || '', proj.end_date || ''].filter(Boolean).join(' - ');
            } else {
                item['project[' + index + '][project-time]'] = '';
            }
            item['project[' + index + '][project-desc]'] = proj.proj_content || '';
            item['project[' + index + '][responsibilities]'] = proj.proj_resp || '';
            return item;
        });
    }

    // 技能
    if (Array.isArray(rawData.skills_objs)) {
        resumeData.skills = rawData.skills_objs.map(function(skill, index) {
            var item = {};
            item['skills[' + index + '][name]'] = skill.skills_name || '';
            item['skills[' + index + '][level]'] = mapSkillLevel(skill.skills_level);
            return item;
        });
    }

    // 语言能力
    if (Array.isArray(rawData.lang_objs)) {
        resumeData.languages = rawData.lang_objs.map(function(lang, index) {
            var item = {};
            item['language[' + index + '][name]'] = lang.lang_name || lang.language || '';
            item['language[' + index + '][proficiency]'] = lang.lang_level || lang.level || '';
            item['language[' + index + '][certificate]'] = lang.lang_cert || '';
            return item;
        });
    }

    return resumeData;
}

/**
 * 将各种日期格式转换为 input[type="date"] 所需的 YYYY-MM-DD
 */
function normalizeDateValue(dateStr) {
    if (!dateStr) return '';
    var str = String(dateStr).trim();
    if (!str) return '';

    str = str.replace(/年|\/|\./g, '-').replace(/月/g, '-').replace(/日/g, '');
    str = str.replace(/--+/g, '-');

    if (/^\d{4}$/.test(str)) {
        return str + '-01-01';
    }
    if (/^\d{4}-\d{1,2}$/.test(str)) {
        var parts = str.split('-');
        return parts[0] + '-' + parts[1].padStart(2, '0') + '-01';
    }
    if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(str)) {
        var segs = str.split('-');
        return segs[0] + '-' + segs[1].padStart(2, '0') + '-' + segs[2].padStart(2, '0');
    }
    return '';
}

/**
 * 将API中的技能等级映射到表单下拉框可选值
 */
function mapSkillLevel(level) {
    if (!level) return '';
    var normalized = String(level).trim();
    var map = {
        '入门': '初级',
        '了解': '初级',
        '一般': '初级',
        '熟悉': '中级',
        '良好': '中级',
        '熟练': '高级',
        '精通': '专家',
        '专家': '专家',
        '掌握': '高级'
    };
    return map[normalized] || normalized;
}

/**
 * 获取简历解析API配置
 * @returns {object} 简历解析API配置对象
 */
function getParseAPIConfig() {
    // 检查依赖函数是否存在
    if (typeof loadDataFromStorage !== 'function') {
        console.error('loadDataFromStorage function not found');
        return {
            url: '',
            appCode: ''
        };
    }
    
    const settings = loadDataFromStorage('parseSettings');
    if (!settings || typeof settings !== 'object') {
        return {
            url: '',
            appCode: ''
        };
    }
    
    return {
        url: settings.url || '',
        appCode: settings.appCode || ''
    };
}

/**
 * 获取模型API配置
 * @returns {object} 模型API配置对象
 */
function getModelAPIConfig() {
    // 检查依赖函数是否存在
    if (typeof loadDataFromStorage !== 'function') {
        console.error('loadDataFromStorage function not found');
        return {
            url: '',
            apiKey: '',
            model: ''
        };
    }
    
    const settings = loadDataFromStorage('modelSettings');
    if (!settings || typeof settings !== 'object') {
        return {
            url: '',
            apiKey: '',
            model: ''
        };
    }
    
    return {
        url: settings.url || '',
        apiKey: settings.apiKey || '',
        model: settings.model || ''
    };
}

/**
 * 获取API配置（兼容旧版本）
 * @returns {object} API配置对象
 * @deprecated 请使用 getParseAPIConfig() 或 getModelAPIConfig()
 */
function getAPIConfig() {
    // 优先使用简历解析配置
    const parseSettings = getParseAPIConfig();
    if (parseSettings.url && parseSettings.appCode) {
        return {
            url: parseSettings.url,
            apiKey: parseSettings.appCode,
            model: ''
        };
    }
    // 如果没有，尝试使用模型配置
    const modelSettings = getModelAPIConfig();
    return {
        url: modelSettings.url || '',
        apiKey: modelSettings.apiKey || '',
        model: modelSettings.model || ''
    };
}

// 显式地将函数绑定到全局作用域（确保在浏览器扩展popup中可用）
if (typeof globalScope !== 'undefined') {
    globalScope.parseResumeByAPI = parseResumeByAPI;
    globalScope.parseAPIResponse = parseAPIResponse;
    globalScope.fileToBase64 = fileToBase64;
    globalScope.getParseAPIConfig = getParseAPIConfig;
    globalScope.getModelAPIConfig = getModelAPIConfig;
    globalScope.getAPIConfig = getAPIConfig;
    console.log('API functions bound to global scope:', {
        parseResumeByAPI: typeof globalScope.parseResumeByAPI,
        getParseAPIConfig: typeof globalScope.getParseAPIConfig
    });
} else {
    console.warn('globalScope is undefined, functions may not be available globally');
}

// 导出函数（Node.js环境）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        parseResumeByAPI, 
        parseAPIResponse, 
        fileToBase64,
        getParseAPIConfig,
        getModelAPIConfig,
        getAPIConfig
    };
}

