// 表单工具模块
// 处理表单数据的收集和填充

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
 * @returns {object} 表单数据对象
 */
function collectFormData() {
    var formData = {
        skills: collectDynamicItems('skills-list'),
        education: collectDynamicItems('education-list'),
        workExperience: collectDynamicItems('internship-list'),
        projects: collectDynamicItems('project-list'),
        languages: collectDynamicItems('language-list'),
        customFields: collectDynamicItems('custom-field-list'),
        personalInfo: {}
    };
    
    // 收集基本信息
    var basicInfoFields = ['name', 'gender', 'birth-date', 'phone', 'email', 'id-card', 'location', 'political-status'];
    for (var i = 0; i < basicInfoFields.length; i++) {
        var field = document.getElementById(basicInfoFields[i]);
        if (field) {
            formData.personalInfo[basicInfoFields[i]] = field.value || '';
        }
    }
    
    // 收集求职期望
    var jobExpectFields = ['expected-position', 'expected-industry', 'expected-salary', 'expected-location', 'internship-duration', 'available-time'];
    for (var i = 0; i < jobExpectFields.length; i++) {
        var field = document.getElementById(jobExpectFields[i]);
        if (field) {
            formData.personalInfo[jobExpectFields[i]] = field.value || '';
        }
    }
    
    // 收集自我描述
    var selfIntro = document.getElementById('self-intro');
    if (selfIntro) {
        formData.personalInfo['self-intro'] = selfIntro.value || '';
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
 * @param {object} data - 解析后的简历数据
 */
function fillFormWithParsedData(data) {
    if (!data || typeof data !== 'object') {
        if (typeof showNotification !== 'undefined') {
            showNotification('解析数据无效', 'error');
        }
        return;
    }
    
    console.log('Filling form with parsed data:', data);
    if (typeof showNotification !== 'undefined') {
        showNotification('正在填充表单数据...', 'info');
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
        
        // 填充教育经历
        if (data.education && Array.isArray(data.education) && data.education.length > 0) {
            const educationList = document.getElementById('education-list');
            if (educationList && typeof createEducationItem === 'function') {
                // 清空现有项
                while (educationList.firstChild) {
                    educationList.removeChild(educationList.firstChild);
                }
                // 添加解析的教育经历
                data.education.forEach(function(eduData, index) {
                    const eduItem = createEducationItem(index);
                    fillDynamicItem(eduItem, eduData);
                    educationList.appendChild(eduItem);
                });
            }
        }
        
        // 填充工作经历
        if (data.workExperience && Array.isArray(data.workExperience) && data.workExperience.length > 0) {
            const workList = document.getElementById('internship-list');
            if (workList && typeof createWorkExperienceItem === 'function') {
                while (workList.firstChild) {
                    workList.removeChild(workList.firstChild);
                }
                data.workExperience.forEach(function(workData, index) {
                    const workItem = createWorkExperienceItem(index);
                    fillDynamicItem(workItem, workData);
                    workList.appendChild(workItem);
                });
            }
        }
        
        // 填充项目经历
        if (data.projects && Array.isArray(data.projects) && data.projects.length > 0) {
            const projectList = document.getElementById('project-list');
            if (projectList && typeof createProjectItem === 'function') {
                while (projectList.firstChild) {
                    projectList.removeChild(projectList.firstChild);
                }
                data.projects.forEach(function(projectData, index) {
                    const projectItem = createProjectItem(index);
                    fillDynamicItem(projectItem, projectData);
                    projectList.appendChild(projectItem);
                });
            }
        }
        
        // 填充技能
        if (data.skills && Array.isArray(data.skills) && data.skills.length > 0) {
            const skillsList = document.getElementById('skills-list');
            if (skillsList && typeof createSkillItem === 'function') {
                while (skillsList.firstChild) {
                    skillsList.removeChild(skillsList.firstChild);
                }
                data.skills.forEach(function(skillData, index) {
                    const skillItem = createSkillItem(index);
                    fillDynamicItem(skillItem, skillData);
                    skillsList.appendChild(skillItem);
                });
            }
        }
        
        // 填充语言能力
        if (data.languages && Array.isArray(data.languages) && data.languages.length > 0) {
            const languageList = document.getElementById('language-list');
            if (languageList && typeof createLanguageItem === 'function') {
                while (languageList.firstChild) {
                    languageList.removeChild(languageList.firstChild);
                }
                data.languages.forEach(function(langData, index) {
                    const langItem = createLanguageItem(index);
                    fillDynamicItem(langItem, langData);
                    languageList.appendChild(langItem);
                });
            }
        }
        
        // 触发自动保存
        if (typeof autoSaveFormData === 'function') {
            autoSaveFormData();
        }
        
        if (typeof showNotification !== 'undefined') {
            showNotification('表单数据填充成功！', 'success');
        }
        
    } catch (error) {
        console.error('Error filling form:', error);
        if (typeof showNotification !== 'undefined') {
            showNotification('填充表单时发生错误：' + error.message, 'error');
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

