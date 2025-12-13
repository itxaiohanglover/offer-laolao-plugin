// 表单工具模块
// 处理表单数据的收集和填充
// 已迁移到新架构：使用 EventBus 和配置

/**
 * 收集动态项目数据
 * @param {string} listId - 列表元素ID
 * @returns {Array} 收集到的数据数组
 */
function collectDynamicItems(listId) {
    var list = document.getElementById(listId);
    if (!list) return [];
    
    var items = list.querySelectorAll('.dynamic-item');
    var result = [];
    
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var data = {};
        
        // 收集所有输入字段的值
        var inputs = item.querySelectorAll('input, select, textarea');
        for (var j = 0; j < inputs.length; j++) {
            var input = inputs[j];
            var key = input.name || input.id;
            if (key) {
                data[key] = input.value;
            }
        }
        
        result.push(data);
    }
    
    return result;
}

/**
 * 收集表单数据
 * 已迁移到新架构：使用配置和事件总线
 * @returns {object} 表单数据对象
 */
function collectFormData() {
    // 使用新架构的配置
    const FieldConfig = window.OfferLaolao?.Config?.FieldConfig;
    const Constants = window.OfferLaolao?.Config?.Constants;
    const EventBus = window.OfferLaolao?.Core?.EventBus;
    
    // 使用配置中的列表ID
    const listIds = Constants?.LIST_IDS || {
        SKILLS: 'skills-list',
        EDUCATION: 'education-list',
        WORK_EXPERIENCE: 'internship-list',
        PROJECTS: 'project-list',
        LANGUAGES: 'language-list',
        CUSTOM_FIELDS: 'custom-field-list'
    };
    
    var formData = {
        skills: collectDynamicItems(listIds.SKILLS),
        education: collectDynamicItems(listIds.EDUCATION),
        workExperience: collectDynamicItems(listIds.WORK_EXPERIENCE),
        projects: collectDynamicItems(listIds.PROJECTS),
        languages: collectDynamicItems(listIds.LANGUAGES),
        customFields: collectDynamicItems(listIds.CUSTOM_FIELDS),
        personalInfo: {}
    };
    
    // 使用配置中的字段列表
    const basicFields = FieldConfig?.basic || [];
    const jobExpectFields = FieldConfig?.jobExpectation || [];
    
    // 收集基本信息
    basicFields.forEach(function(fieldConfig) {
        var field = document.getElementById(fieldConfig.id);
        if (field) {
            formData.personalInfo[fieldConfig.id] = field.value || '';
        }
    });
    
    // 收集求职期望
    jobExpectFields.forEach(function(fieldConfig) {
        if (!fieldConfig.hidden) {
            var field = document.getElementById(fieldConfig.id);
            if (field) {
                formData.personalInfo[fieldConfig.id] = field.value || '';
            }
        }
    });
    
    // 收集自我描述
    const selfIntroId = Constants?.FIELD_IDS?.SELF_INTRO || 'self-intro';
    var selfIntro = document.getElementById(selfIntroId);
    if (selfIntro) {
        formData.personalInfo['self-intro'] = selfIntro.value || '';
    }
    
    // 触发表单数据收集事件
    if (EventBus) {
        EventBus.emit('form:data:collected', { formData });
    }
    
    return formData;
}

/**
 * 填充动态项的数据
 * @param {HTMLElement} itemElement - 动态项元素
 * @param {object} itemData - 要填充的数据
 */
function fillDynamicItem(itemElement, itemData) {
    if (!itemElement || !itemData) return;
    
    for (var key in itemData) {
        if (itemData.hasOwnProperty(key)) {
            var value = itemData[key];
            if (value !== undefined && value !== null && value !== '') {
                // 尝试多种方式查找字段
                var inputs = itemElement.querySelectorAll('[name*="' + key + '"]');
                if (inputs.length === 0) {
                    // 尝试通过数组格式查找
                    var arrayKey = key.replace(/\[.*?\]/g, '');
                    inputs = itemElement.querySelectorAll('[name*="' + arrayKey + '"]');
                }
                
                if (inputs.length > 0) {
                    for (var i = 0; i < inputs.length; i++) {
                        var input = inputs[i];
                        if (input.tagName === 'SELECT') {
                            var option = input.querySelector('option[value="' + value + '"]');
                            if (option) {
                                input.value = String(value);
                            }
                        } else if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
                            input.value = String(value);
                        }
                    }
                }
            }
        }
    }
}

/**
 * 使用解析的数据填充表单
 * 已迁移到新架构：使用 NotificationService、EventBus 和 DynamicItemFactory
 * @param {object} data - 解析后的简历数据
 */
function fillFormWithParsedData(data) {
    // 使用新架构的服务
    const notification = window.OfferLaolao?.Services?.NotificationService;
    const EventBus = window.OfferLaolao?.Core?.EventBus;
    const DynamicItemFactory = window.OfferLaolao?.Factories?.DynamicItemFactory;
    const Constants = window.OfferLaolao?.Config?.Constants;
    
    // 兼容旧代码
    const showNotify = notification 
        ? (msg, type) => notification.show(msg, type)
        : (typeof showNotification === 'function' ? showNotification : () => {});
    
    if (!data || typeof data !== 'object') {
        showNotify('解析数据无效', 'error');
        return;
    }
    
    console.log('Filling form with parsed data:', data);
    showNotify('正在填充表单数据...', 'info');
    
    // 触发表单填充开始事件
    if (EventBus) {
        EventBus.emit('form:fill:start', { data });
    }
    
    try {
        // 填充基本信息
        if (data.name && document.getElementById('name')) {
            document.getElementById('name').value = data.name;
        }
        if (data.gender && document.getElementById('gender')) {
            document.getElementById('gender').value = data.gender;
        }
        if (data['birth-date'] && document.getElementById('birth-date')) {
            document.getElementById('birth-date').value = data['birth-date'];
        }
        if (data.phone && document.getElementById('phone')) {
            document.getElementById('phone').value = data.phone;
        }
        if (data.email && document.getElementById('email')) {
            document.getElementById('email').value = data.email;
        }
        if (data['id-card'] && document.getElementById('id-card')) {
            document.getElementById('id-card').value = data['id-card'];
        }
        if (data.location && document.getElementById('location')) {
            document.getElementById('location').value = data.location;
        }
        if (data['political-status'] && document.getElementById('political-status')) {
            document.getElementById('political-status').value = data['political-status'];
        }
        
        // 填充求职期望
        if (data['expected-position'] && document.getElementById('expected-position')) {
            document.getElementById('expected-position').value = data['expected-position'];
        }
        if (data['expected-industry'] && document.getElementById('expected-industry')) {
            document.getElementById('expected-industry').value = data['expected-industry'];
        }
        if (data['expected-salary'] && document.getElementById('expected-salary')) {
            document.getElementById('expected-salary').value = data['expected-salary'];
        }
        if (data['expected-location'] && document.getElementById('expected-location')) {
            document.getElementById('expected-location').value = data['expected-location'];
        }
        
        // 填充自我描述
        if (data['self-intro'] && document.getElementById('self-intro')) {
            document.getElementById('self-intro').value = data['self-intro'];
        }
        
        // 如果数据中有personalInfo对象，也填充
        if (data.personalInfo && typeof data.personalInfo === 'object') {
            for (var key in data.personalInfo) {
                if (data.personalInfo.hasOwnProperty(key)) {
                    var field = document.getElementById(key);
                    if (field) {
                        field.value = data.personalInfo[key] || '';
                    }
                }
            }
        }
        
        // 使用新架构的工厂模式创建动态项
        const listIds = Constants?.LIST_IDS || {
            EDUCATION: 'education-list',
            WORK_EXPERIENCE: 'internship-list',
            PROJECTS: 'project-list',
            SKILLS: 'skills-list',
            LANGUAGES: 'language-list',
            CUSTOM_FIELDS: 'custom-field-list'
        };
        
        // 创建函数映射（优先使用工厂模式）
        const createItem = (type, index) => {
            if (DynamicItemFactory) {
                return DynamicItemFactory.create(type, index);
            }
            // 兼容旧代码
            const funcMap = {
                education: typeof createEducationItem === 'function' ? createEducationItem : null,
                workExperience: typeof createWorkExperienceItem === 'function' ? createWorkExperienceItem : null,
                project: typeof createProjectItem === 'function' ? createProjectItem : null,
                skill: typeof createSkillItem === 'function' ? createSkillItem : null,
                language: typeof createLanguageItem === 'function' ? createLanguageItem : null,
                customField: typeof createCustomFieldItem === 'function' ? createCustomFieldItem : null
            };
            const func = funcMap[type];
            return func ? func(index) : null;
        };
        
        // 填充教育经历
        if (data.education && Array.isArray(data.education) && data.education.length > 0) {
            const educationList = document.getElementById(listIds.EDUCATION);
            if (educationList) {
                // 清空现有项
                while (educationList.firstChild) {
                    educationList.removeChild(educationList.firstChild);
                }
                // 添加解析的教育经历
                data.education.forEach(function(eduData, index) {
                    const eduItem = createItem('education', index);
                    if (eduItem) {
                        fillDynamicItem(eduItem, eduData);
                        educationList.appendChild(eduItem);
                    }
                });
            }
        }
        
        // 填充工作经历
        if (data.workExperience && Array.isArray(data.workExperience) && data.workExperience.length > 0) {
            const workList = document.getElementById(listIds.WORK_EXPERIENCE);
            if (workList) {
                while (workList.firstChild) {
                    workList.removeChild(workList.firstChild);
                }
                data.workExperience.forEach(function(workData, index) {
                    const workItem = createItem('workExperience', index);
                    if (workItem) {
                        fillDynamicItem(workItem, workData);
                        workList.appendChild(workItem);
                    }
                });
            }
        }
        
        // 填充项目经历
        if (data.projects && Array.isArray(data.projects) && data.projects.length > 0) {
            const projectList = document.getElementById(listIds.PROJECTS);
            if (projectList) {
                while (projectList.firstChild) {
                    projectList.removeChild(projectList.firstChild);
                }
                data.projects.forEach(function(projectData, index) {
                    const projectItem = createItem('project', index);
                    if (projectItem) {
                        fillDynamicItem(projectItem, projectData);
                        projectList.appendChild(projectItem);
                    }
                });
            }
        }
        
        // 填充技能
        if (data.skills && Array.isArray(data.skills) && data.skills.length > 0) {
            const skillsList = document.getElementById(listIds.SKILLS);
            if (skillsList) {
                while (skillsList.firstChild) {
                    skillsList.removeChild(skillsList.firstChild);
                }
                data.skills.forEach(function(skillData, index) {
                    const skillItem = createItem('skill', index);
                    if (skillItem) {
                        fillDynamicItem(skillItem, skillData);
                        skillsList.appendChild(skillItem);
                    }
                });
            }
        }
        
        // 填充语言能力
        if (data.languages && Array.isArray(data.languages) && data.languages.length > 0) {
            const languageList = document.getElementById(listIds.LANGUAGES);
            if (languageList) {
                while (languageList.firstChild) {
                    languageList.removeChild(languageList.firstChild);
                }
                data.languages.forEach(function(langData, index) {
                    const langItem = createItem('language', index);
                    if (langItem) {
                        fillDynamicItem(langItem, langData);
                        languageList.appendChild(langItem);
                    }
                });
            }
        }
        
        // 触发自动保存
        if (typeof autoSaveFormData === 'function') {
            autoSaveFormData();
        }
        
        showNotify('表单数据填充成功！', 'success');
        
        // 触发表单填充完成事件
        if (EventBus) {
            EventBus.emit('form:fill:completed', { data });
        }
        
    } catch (error) {
        console.error('Error filling form:', error);
        showNotify('填充表单时发生错误：' + error.message, 'error');
        
        // 触发表单填充错误事件
        if (EventBus) {
            EventBus.emit('form:fill:error', { error });
        }
    }
}

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        collectFormData, 
        collectDynamicItems, 
        fillDynamicItem,
        fillFormWithParsedData 
    };
}

