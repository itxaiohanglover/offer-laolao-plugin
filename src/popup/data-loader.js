// 数据加载器模块
// 负责从存储加载数据并填充到表单

/**
 * 加载表单数据
 * 已迁移到新架构：使用 StorageService 和 NotificationService
 */
function loadFormData() {
    return safeExecute(function() {
        console.log('Starting to load form data...');
        
        // 使用新架构的存储服务
        const storage = window.OfferLaolao?.Services?.StorageService;
        const notification = window.OfferLaolao?.Services?.NotificationService;
        const Constants = window.OfferLaolao?.Config?.Constants;
        const FieldConfig = window.OfferLaolao?.Config?.FieldConfig;
        
        // 兼容旧代码：如果新架构未加载，使用旧方法
        const loadData = storage 
            ? (key) => storage.loadSync(key, {})
            : (typeof loadDataFromStorage === 'function' ? loadDataFromStorage : () => ({}));
        const showNotify = notification 
            ? (msg, type) => notification.show(msg, type)
            : (typeof showNotification === 'function' ? showNotification : () => {});
        
        const storageKey = Constants?.STORAGE_KEYS?.RESUME_DATA || 'resumeData';
        var resumeData = safeExecute(loadData, null, [storageKey], {});
        
        // 确保resumeData是对象且不为null
        if (!resumeData || typeof resumeData !== 'object' || Object.keys(resumeData).length === 0) {
            console.log('No valid resume data found in storage');
            showNotify('没有找到保存的简历数据', 'info');
            // 首次打开且没有数据时，清理多余的空项
            setTimeout(function() {
                if (typeof cleanupEmptyItems === 'function') {
                    cleanupEmptyItems('education-list');
                    cleanupEmptyItems('internship-list');
                    cleanupEmptyItems('project-list');
                    cleanupEmptyItems('skills-list');
                    cleanupEmptyItems('language-list');
                    cleanupEmptyItems('custom-field-list');
                }
            }, 300);
            return;
        }
        
        console.log('Loading form data, available sections:', Object.keys(resumeData).join(', '));
        
        // 定义要加载的动态项目类型
        // 使用新架构的工厂模式（如果可用）
        const DynamicItemFactory = window.OfferLaolao?.Factories?.DynamicItemFactory;
        const useNewFactory = !!DynamicItemFactory;
        
        // 创建函数映射（兼容新旧架构）
        const createItemFunc = (type) => {
            if (useNewFactory) {
                return (index) => DynamicItemFactory.create(type, index);
            }
            // 兼容旧代码
            const funcMap = {
                skill: typeof createSkillItem === 'function' ? createSkillItem : null,
                education: typeof createEducationItem === 'function' ? createEducationItem : null,
                workExperience: typeof createWorkExperienceItem === 'function' ? createWorkExperienceItem : null,
                project: typeof createProjectItem === 'function' ? createProjectItem : null,
                language: typeof createLanguageItem === 'function' ? createLanguageItem : null,
                customField: typeof createCustomFieldItem === 'function' ? createCustomFieldItem : null
            };
            return funcMap[type] || null;
        };
        
        const dynamicSections = [
            { key: 'skills', type: 'skill', listId: 'skills-list', title: '技能' },
            { key: 'education', type: 'education', listId: 'education-list', title: '教育经历' },
            { key: 'workExperience', type: 'workExperience', listId: 'internship-list', title: '工作经验' },
            { key: 'projects', type: 'project', listId: 'project-list', title: '项目经验' },
            { key: 'languages', type: 'language', listId: 'language-list', title: '语言能力' },
            { key: 'customFields', type: 'customField', listId: 'custom-field-list', title: '自定义字段' }
        ];
        
        // 为每个section添加createFunc
        dynamicSections.forEach(section => {
            section.createFunc = createItemFunc(section.type);
        });
        
        // 加载各个动态项目部分
        dynamicSections.forEach(section => {
            try {
                console.log(`Processing section: ${section.title}`);
                
                // 检查该部分数据是否存在且为数组
                if (!resumeData[section.key] || !Array.isArray(resumeData[section.key])) {
                    console.log(`No valid ${section.title} data found, skipping...`);
                    return;
                }
                
                // 获取对应的列表元素
                const listElement = safeQuerySelector(document, '#' + section.listId);
                if (!listElement) {
                    console.warn(`${section.title} list element not found: #${section.listId}`);
                    return;
                }
                
                // 添加保存的数据项
                const itemsData = resumeData[section.key];
                console.log(`Found ${itemsData.length} ${section.title} items to load`);
                
                // 如果有数据，先清空现有项目，然后加载保存的数据
                if (itemsData.length > 0) {
                    // 清空列表
                    while (listElement.firstChild) {
                        listElement.removeChild(listElement.firstChild);
                    }
                    
                    // 加载所有保存的数据项
                    for (var i = 0; i < itemsData.length; i++) {
                        try {
                            const itemData = itemsData[i];
                            
                            // 确保itemData是有效的对象
                            if (!itemData || typeof itemData !== 'object') {
                                console.warn(`${section.title} data at index ${i} is invalid, skipping...`);
                                continue;
                            }
                            
                            // 创建新的项目元素
                            let newItem;
                            if (section.createFunc) {
                                newItem = section.createFunc(i);
                            } else {
                                console.error(`No create function defined for ${section.title}, cannot load item ${i}`);
                                continue;
                            }
                            
                            // 填充数据到表单字段
                            let fieldsFound = 0;
                            for (var key in itemData) {
                                if (itemData.hasOwnProperty(key)) {
                                    try {
                                        const fieldValue = itemData[key];
                                        if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
                                            // 构建选择器
                                            var selector = '[name*="' + key + '"]';
                                            
                                            // 使用安全的DOM查询函数
                                            let inputs = newItem.querySelectorAll(selector);
                                            
                                            // 如果找到输入字段，设置值
                                            if (inputs.length > 0) {
                                                for (var j = 0; j < inputs.length; j++) {
                                                    var input = inputs[j];
                                                    if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA' || input.tagName === 'SELECT') {
                                                        if (input.tagName === 'SELECT') {
                                                            var option = input.querySelector('option[value="' + fieldValue + '"]');
                                                            if (option) {
                                                                input.value = String(fieldValue);
                                                                fieldsFound++;
                                                            }
                                                        } else {
                                                            input.value = String(fieldValue);
                                                            fieldsFound++;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    } catch (fieldError) {
                                        console.warn(`Error setting field "${key}" in ${section.title} item ${i}:`, fieldError.message);
                                    }
                                }
                            }
                            
                            // 如果成功填充了字段，才添加到列表中
                            if (fieldsFound > 0 || itemsData.length > 0) {
                                listElement.appendChild(newItem);
                            }
                        } catch (itemError) {
                            console.error(`Error processing ${section.title} item ${i}:`, itemError);
                        }
                    }
                    
                    console.log(`Successfully loaded ${section.title} data (${itemsData.length} items)`);
                }
                
            } catch (sectionError) {
                console.error(`Error loading ${section.title} section:`, sectionError);
            }
        });
        
        // 加载个人信息部分（非动态列表）
        try {
            if (resumeData.personalInfo && typeof resumeData.personalInfo === 'object') {
                console.log('Loading personal info...');
                const personalInfo = resumeData.personalInfo;
                
                for (var key in personalInfo) {
                    if (personalInfo.hasOwnProperty(key)) {
                        try {
                            const field = safeQuerySelector(document, '#' + key) || 
                                         safeQuerySelector(document, '[name="' + key.replace(/"/g, '\\"') + '"]');
                            if (field && (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA' || field.tagName === 'SELECT')) {
                                field.value = String(personalInfo[key]);
                            }
                        } catch (error) {
                            console.warn(`Error setting personal info field "${key}":`, error.message);
                        }
                    }
                }
            }
        } catch (personalInfoError) {
            console.error('Error loading personal info:', personalInfoError);
        }
        
        console.log('Form data loading completed successfully');
        showNotify('简历数据加载成功', 'success');
        
        // 触发事件总线事件（如果可用）
        if (window.OfferLaolao?.Core?.EventBus) {
            window.OfferLaolao.Core.EventBus.emit('form:loaded', { resumeData });
        }
        
    }, this);
}

