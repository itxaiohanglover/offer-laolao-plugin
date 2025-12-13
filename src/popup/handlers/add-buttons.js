// 添加按钮处理器模块
// 处理各种动态项的添加按钮
// 已迁移到新架构：使用 DynamicItemFactory、NotificationService 和 EventBus

/**
 * 初始化添加按钮功能
 */
function initAddButtons() {
    safeExecute(function() {
        console.log('Initializing add buttons functionality');
        
        // 使用新架构的服务
        const DynamicItemFactory = window.OfferLaolao?.Factories?.DynamicItemFactory;
        const notification = window.OfferLaolao?.Services?.NotificationService;
        const EventBus = window.OfferLaolao?.Core?.EventBus;
        const FieldConfig = window.OfferLaolao?.Config?.FieldConfig;
        
        // 兼容旧代码
        const createItem = (type, index) => {
            if (DynamicItemFactory) {
                return DynamicItemFactory.create(type, index);
            }
            // 兼容旧函数
            const funcMap = {
                skill: typeof createSkillItem === 'function' ? createSkillItem : null,
                education: typeof createEducationItem === 'function' ? createEducationItem : null,
                workExperience: typeof createWorkExperienceItem === 'function' ? createWorkExperienceItem : null,
                project: typeof createProjectItem === 'function' ? createProjectItem : null,
                language: typeof createLanguageItem === 'function' ? createLanguageItem : null,
                customField: typeof createCustomFieldItem === 'function' ? createCustomFieldItem : null
            };
            const func = funcMap[type];
            return func ? func(index) : null;
        };
        
        const showNotify = notification 
            ? (msg, type) => notification.success(msg)
            : (typeof showNotification === 'function' ? showNotification : () => {});
        
        // 添加技能按钮
        var addSkillBtn = document.getElementById('add-skill');
        if (addSkillBtn) {
            addSkillBtn.addEventListener('click', function() {
                var skillsList = document.getElementById('skills-list');
                if (skillsList) {
                    var newIndex = skillsList.querySelectorAll('.dynamic-item').length;
                    var newSkillItem = createItem('skill', newIndex);
                    if (newSkillItem) {
                        skillsList.appendChild(newSkillItem);
                        if (typeof addAutoSaveListenersToSkillItem === 'function') {
                            addAutoSaveListenersToSkillItem(newSkillItem);
                        }
                        showNotify('已添加新技能项', 'success');
                        
                        // 触发事件
                        if (EventBus) {
                            EventBus.emit('item:added', { type: 'skill', index: newIndex });
                        }
                        
                        if (typeof autoSaveFormData === 'function') {
                            autoSaveFormData();
                        }
                    }
                }
            });
        }
        
        // 添加教育经历按钮
        const addEducationBtn = document.getElementById('add-education');
        if (addEducationBtn) {
            addEducationBtn.addEventListener('click', function() {
                const educationList = document.getElementById('education-list');
                if (educationList) {
                    const currentItems = educationList.querySelectorAll('.dynamic-item');
                    const newIndex = currentItems.length;
                    const newEducationItem = createItem('education', newIndex);
                    if (newEducationItem) {
                        educationList.appendChild(newEducationItem);
                        
                        const inputs = newEducationItem.querySelectorAll('input, textarea, select');
                        if (typeof debouncedAutoSave === 'function') {
                            inputs.forEach(input => {
                                input.addEventListener('input', debouncedAutoSave);
                            });
                        }
                        
                        showNotify('已添加新的教育经历', 'success');
                        
                        // 触发事件
                        if (EventBus) {
                            EventBus.emit('item:added', { type: 'education', index: newIndex });
                        }
                        
                        if (typeof autoSaveFormData === 'function') {
                            autoSaveFormData();
                        }
                    }
                }
            });
        }
        
        // 添加实习/工作经历按钮
        const addWorkExperienceBtn = document.getElementById('add-internship');
        if (addWorkExperienceBtn) {
            addWorkExperienceBtn.addEventListener('click', function() {
                const workExperienceList = document.getElementById('internship-list');
                if (workExperienceList) {
                    const currentItems = workExperienceList.querySelectorAll('.dynamic-item');
                    const newIndex = currentItems.length;
                    const newWorkExperienceItem = createItem('workExperience', newIndex);
                    if (newWorkExperienceItem) {
                        workExperienceList.appendChild(newWorkExperienceItem);
                        
                        const inputs = newWorkExperienceItem.querySelectorAll('input, textarea, select');
                        if (typeof debouncedAutoSave === 'function') {
                            inputs.forEach(input => {
                                input.addEventListener('input', debouncedAutoSave);
                            });
                        }
                        
                        showNotify('已添加新的实习/工作经历', 'success');
                        
                        // 触发事件
                        if (EventBus) {
                            EventBus.emit('item:added', { type: 'workExperience', index: newIndex });
                        }
                        
                        if (typeof autoSaveFormData === 'function') {
                            autoSaveFormData();
                        }
                    }
                }
            });
        }
        
        // 添加项目经历按钮
        const addProjectBtn = document.getElementById('add-project');
        if (addProjectBtn) {
            addProjectBtn.addEventListener('click', function() {
                const projectsList = document.getElementById('project-list');
                if (projectsList) {
                    const currentItems = projectsList.querySelectorAll('.dynamic-item');
                    const newIndex = currentItems.length;
                    const newProjectItem = createItem('project', newIndex);
                    if (newProjectItem) {
                        projectsList.appendChild(newProjectItem);
                        
                        const inputs = newProjectItem.querySelectorAll('input, textarea, select');
                        if (typeof debouncedAutoSave === 'function') {
                            inputs.forEach(input => {
                                input.addEventListener('input', debouncedAutoSave);
                            });
                        }
                        
                        showNotify('已添加新项目经历', 'success');
                        
                        // 触发事件
                        if (EventBus) {
                            EventBus.emit('item:added', { type: 'project', index: newIndex });
                        }
                        
                        if (typeof autoSaveFormData === 'function') {
                            autoSaveFormData();
                        }
                    }
                }
            });
        }
        
        // 添加语言能力按钮
        const addLanguageBtn = document.getElementById('add-language');
        if (addLanguageBtn) {
            addLanguageBtn.addEventListener('click', function() {
                const languagesList = document.getElementById('language-list');
                if (languagesList) {
                    const currentItems = languagesList.querySelectorAll('.dynamic-item');
                    const newIndex = currentItems.length;
                    const newLanguageItem = createItem('language', newIndex);
                    if (newLanguageItem) {
                        languagesList.appendChild(newLanguageItem);
                        
                        const inputs = newLanguageItem.querySelectorAll('input, select');
                        if (typeof debouncedAutoSave === 'function') {
                            inputs.forEach(input => {
                                input.addEventListener('input', debouncedAutoSave);
                                input.addEventListener('change', debouncedAutoSave);
                            });
                        }
                        
                        showNotify('已添加新的语言能力', 'success');
                        
                        // 触发事件
                        if (EventBus) {
                            EventBus.emit('item:added', { type: 'language', index: newIndex });
                        }
                        
                        if (typeof autoSaveFormData === 'function') {
                            autoSaveFormData();
                        }
                    }
                }
            });
        }
        
        // 添加自定义字段按钮
        const addCustomFieldBtn = document.getElementById('add-custom-field');
        if (addCustomFieldBtn) {
            addCustomFieldBtn.addEventListener('click', function() {
                const customFieldList = document.getElementById('custom-field-list');
                if (customFieldList) {
                    const currentItems = customFieldList.querySelectorAll('.dynamic-item');
                    const newIndex = currentItems.length;
                    const newFieldDiv = createItem('customField', newIndex);
                    if (newFieldDiv) {
                        customFieldList.appendChild(newFieldDiv);
                        
                        const inputs = newFieldDiv.querySelectorAll('input, textarea');
                        if (typeof debouncedAutoSave === 'function') {
                            inputs.forEach(input => {
                                input.addEventListener('input', debouncedAutoSave);
                                input.addEventListener('change', debouncedAutoSave);
                            });
                        }
                        
                        showNotify('已添加新的自定义字段', 'success');
                        
                        // 触发事件
                        if (EventBus) {
                            EventBus.emit('item:added', { type: 'customField', index: newIndex });
                        }
                        
                        if (typeof autoSaveFormData === 'function') {
                            autoSaveFormData();
                        }
                    }
                }
            });
        }
        
        console.log('Add buttons initialization completed');
    }, this);
}

