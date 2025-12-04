// 存储工具模块
// 处理数据的保存和加载

/**
 * 安全的JSON字符串化
 * @param {any} data - 要序列化的数据
 * @returns {string} JSON字符串
 */
function safeJSONStringify(data) {
    try {
        return JSON.stringify(data);
    } catch (e) {
        console.error('JSON stringify error:', e);
        return '{}';
    }
}

/**
 * 安全的JSON解析
 * @param {string} jsonStr - JSON字符串
 * @returns {object} 解析后的对象
 */
function safeJSONParse(jsonStr) {
    // 参数验证
    if (jsonStr === null || jsonStr === undefined) {
        console.warn('Attempted to parse null/undefined JSON');
        return {};
    }
    
    if (typeof jsonStr !== 'string') {
        console.warn('JSON parse called with non-string value:', typeof jsonStr);
        // 如果输入已经是对象，直接返回
        if (typeof jsonStr === 'object') {
            return jsonStr;
        }
        return {};
    }
    
    // 去除首尾空白字符
    const trimmedStr = jsonStr.trim();
    if (trimmedStr === '') {
        console.warn('Attempted to parse empty JSON string');
        return {};
    }
    
    // 快速验证JSON格式（检查首尾字符）
    if (!((trimmedStr.startsWith('{') && trimmedStr.endsWith('}')) ||
         (trimmedStr.startsWith('[') && trimmedStr.endsWith(']')))) {
        console.warn('String does not appear to be valid JSON (missing braces)');
        return {};
    }
    
    try {
        // 尝试解析JSON
        const result = JSON.parse(trimmedStr);
        console.debug('JSON parsed successfully');
        return result;
    } catch (error) {
        console.error('JSON parse error:', error.message);
        // 提供更详细的错误信息
        console.error('Failed to parse string:', trimmedStr.substring(0, 100) + (trimmedStr.length > 100 ? '...' : ''));
        return {};
    }
}

/**
 * 保存数据到存储
 * @param {any} data - 要保存的数据
 * @param {string} key - 存储键名
 * @param {number} maxRetries - 最大重试次数，默认3
 * @param {number} retryDelay - 重试延迟（毫秒），默认500
 * @returns {boolean} 是否保存成功
 */
function saveDataToStorage(data, key, maxRetries = 3, retryDelay = 500) {
    let retries = 0;
    let saveSuccessful = false;
    
    // 首先尝试直接保存
    try {
        // 确保数据序列化安全
        const serializedData = safeJSONStringify(data);
        if (serializedData) {
            localStorage.setItem(key, serializedData);
            saveSuccessful = true;
            console.log(`Successfully saved data for key: ${key}`);
            return true;
        } else {
            console.error('Failed to serialize data for saving');
        }
    } catch (error) {
        console.error('Initial storage save error:', error);
    }
    
    // 如果直接保存失败，进行重试
    while (retries < maxRetries && !saveSuccessful) {
        retries++;
        console.log(`Retry attempt ${retries}/${maxRetries} for saving data`);
        
        try {
            // 添加短暂延迟以避免立即重试
            const startTime = Date.now();
            while (Date.now() - startTime < retryDelay) {
                // 简单的同步等待
            }
            
            const serializedData = safeJSONStringify(data);
            if (serializedData) {
                localStorage.setItem(key, serializedData);
                saveSuccessful = true;
                console.log(`Retry ${retries} successful for key: ${key}`);
                break;
            }
        } catch (retryError) {
            console.error(`Retry ${retries} failed:`, retryError);
        }
    }
    
    // 最终检查保存是否成功
    if (saveSuccessful) {
        return true;
    } else {
        // 作为最后的备选方案，尝试使用sessionStorage
        try {
            const serializedData = safeJSONStringify(data);
            if (serializedData) {
                sessionStorage.setItem(key, serializedData);
                console.log(`Fallback to sessionStorage successful for key: ${key}`);
                return true;
            }
        } catch (fallbackError) {
            console.error('Fallback to sessionStorage failed:', fallbackError);
        }
        
        console.error(`All save attempts failed for key: ${key}`);
        return false;
    }
}

/**
 * 从存储加载数据
 * @param {string} key - 存储键名
 * @param {number} maxRetries - 最大重试次数，默认3
 * @param {number} retryDelay - 重试延迟（毫秒），默认500
 * @returns {object} 加载的数据，失败时返回默认结构
 */
function loadDataFromStorage(key, maxRetries = 3, retryDelay = 500) {
    // 参数验证
    if (!key || typeof key !== 'string') {
        console.error('Invalid storage key provided');
        return {}; // 返回空对象而不是简历数据结构
    }
    
    // 检查localStorage是否可用
    try {
        if (typeof localStorage === 'undefined' || !localStorage) {
            console.warn('localStorage is not available');
            return {}; // 返回空对象
        }
    } catch (storageCheckError) {
        console.error('Error checking localStorage availability:', storageCheckError);
        return {}; // 返回空对象
    }
    
    // 使用立即执行的函数进行加载尝试
    for (let retries = 0; retries < maxRetries; retries++) {
        try {
            console.log(`Loading data from storage, attempt ${retries + 1}/${maxRetries}, key: ${key}`);
            
            // 安全地获取数据
            const jsonStr = localStorage.getItem(key);
            
            // 处理null或空字符串
            if (jsonStr === null || jsonStr === '') {
                console.log(`No data found for key: ${key}`);
                return {}; // 返回空对象
            }
            
            // 使用增强的解析函数
            const data = safeJSONParse(jsonStr);
            
            // 验证解析结果
            if (data === null || typeof data !== 'object') {
                console.warn(`Failed to parse valid JSON data for key: ${key}`);
                return {}; // 返回空对象
            }
            
            // 如果是简历数据，确保数据结构完整
            if (key === 'resumeData') {
                const safeData = {
                    skills: Array.isArray(data.skills) ? data.skills : [],
                    education: Array.isArray(data.education) ? data.education : [],
                    workExperience: Array.isArray(data.workExperience) ? data.workExperience : [],
                    projects: Array.isArray(data.projects) ? data.projects : [],
                    languages: Array.isArray(data.languages) ? data.languages : [],
                    customFields: Array.isArray(data.customFields) ? data.customFields : [],
                    personalInfo: typeof data.personalInfo === 'object' && data.personalInfo !== null ? data.personalInfo : {}
                };
                console.log(`Successfully loaded data for key: ${key}`);
                return safeData;
            }
            
            // 对于其他类型的数据（如设置），直接返回
            console.log(`Successfully loaded data for key: ${key}`);
            return data;
            
        } catch (error) {
            console.error(`Error loading data from storage (attempt ${retries + 1}/${maxRetries}):`, error);
            
            // 如果不是最后一次尝试，可以添加短暂延迟
            // 注意：我们不使用同步延迟阻塞UI，而是直接进入下一次循环
            if (retries < maxRetries - 1) {
                console.log(`Retrying next attempt...`);
            }
        }
    }
    
    // 如果所有尝试都失败，记录详细错误
    console.error(`Failed to load data from storage after ${maxRetries} attempts for key: ${key}`);
    
    // 返回空对象（对于设置数据）或默认简历数据结构
    if (key === 'resumeData') {
        return {
            skills: [],
            education: [],
            workExperience: [],
            projects: [],
            languages: [],
            customFields: [],
            personalInfo: {}
        };
    }
    return {}; // 对于其他类型的数据，返回空对象
}

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        saveDataToStorage, 
        loadDataFromStorage, 
        safeJSONStringify, 
        safeJSONParse 
    };
}

