// 自动保存处理器模块
// 处理表单数据的自动保存功能
// 已迁移到新架构：使用 StorageService、NotificationService 和 EventBus

/**
 * 自动保存表单数据
 * @returns {boolean} 是否保存成功
 */
function autoSaveFormData() {
    try {
        console.log('Starting auto-save process...');
        
        // 使用新架构的服务
        const storage = window.OfferLaolao?.Services?.StorageService;
        const notification = window.OfferLaolao?.Services?.NotificationService;
        const EventBus = window.OfferLaolao?.Core?.EventBus;
        const Constants = window.OfferLaolao?.Config?.Constants;
        
        // 兼容旧代码
        const saveData = storage 
            ? (data, key) => storage.saveSync(key, data)
            : (typeof saveDataToStorage === 'function' ? saveDataToStorage : () => false);
        const showNotify = notification 
            ? (msg, type, duration) => notification.show(msg, type, duration)
            : (typeof showNotification === 'function' ? showNotification : () => {});
        
        // 收集表单数据
        const formData = typeof collectFormData === 'function' ? collectFormData() : {};
        
        // 添加时间戳以跟踪最后保存时间
        const dataToSave = {
            skills: formData.skills || [],
            education: formData.education || [],
            workExperience: formData.workExperience || [],
            projects: formData.projects || [],
            languages: formData.languages || [],
            customFields: formData.customFields || [],
            personalInfo: formData.personalInfo || {},
            lastSaved: new Date().toISOString()
        };
        
        console.log('Form data collected for saving, size:', JSON.stringify(dataToSave).length);
        
        // 触发保存开始事件
        if (EventBus) {
            EventBus.emit('form:saving', { data: dataToSave });
        }
        
        // 尝试保存数据
        const storageKey = Constants?.STORAGE_KEYS?.RESUME_DATA || 'resumeData';
        const success = saveData(dataToSave, storageKey);
        
        if (success) {
            console.log('Auto-save completed successfully');
            // 添加自动消失的通知，避免频繁打扰用户
            const duration = Constants?.NOTIFICATION_DURATION?.SHORT || 2000;
            showNotify('数据已自动保存', 'success', duration);
            
            // 触发保存成功事件
            if (EventBus) {
                EventBus.emit('form:saved', { data: dataToSave });
            }
        } else {
            console.error('Auto-save failed');
            showNotify('自动保存失败，请手动保存', 'error');
            
            // 触发保存失败事件
            if (EventBus) {
                EventBus.emit('form:save:failed', { error: 'Save failed' });
            }
        }
        
        return success;
    } catch (error) {
        console.error('Error in autoSaveFormData:', error);
        const notification = window.OfferLaolao?.Services?.NotificationService;
        const showNotify = notification 
            ? (msg, type) => notification.error(msg)
            : (typeof showNotification === 'function' ? showNotification : () => {});
        showNotify('自动保存过程中发生错误', 'error');
        
        // 触发错误事件
        if (window.OfferLaolao?.Core?.EventBus) {
            window.OfferLaolao.Core.EventBus.emit('form:save:error', { error });
        }
        
        return false;
    }
}

/**
 * 为技能项添加自动保存事件监听
 * @param {HTMLElement} skillItem - 技能项元素
 */
function addAutoSaveListenersToSkillItem(skillItem) {
    // 为所有输入字段添加自动保存事件
    var inputs = skillItem.querySelectorAll('input, select, textarea');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('input', debounce(autoSaveFormData, 500));
        inputs[i].addEventListener('change', debounce(autoSaveFormData, 500));
    }
}

/**
 * 设置全局自动保存监听器
 */
function setupGlobalAutoSaveListeners() {
    console.log('Setting up global auto-save listeners');
    
    // 为所有动态列表添加通用的自动保存事件监听
    const dynamicLists = [
        'skills-list', 
        'education-list', 
        'internship-list', 
        'project-list', 
        'language-list', 
        'custom-field-list'
    ];
    
    dynamicLists.forEach(listId => {
        const list = document.getElementById(listId);
        if (list) {
            // 使用事件委托，监听所有输入和选择变化
            list.addEventListener('input', function(e) {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
                    console.log(`Auto-saving triggered by input in ${listId}`);
                    debouncedAutoSave();
                }
            });
            
            list.addEventListener('change', function(e) {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
                    console.log(`Auto-saving triggered by change in ${listId}`);
                    autoSaveFormData();
                }
            });
        }
    });
    
    // 为所有文件上传添加自动保存事件
    const fileInputs = document.querySelectorAll('input[type="file"]');
    for (let i = 0; i < fileInputs.length; i++) {
        fileInputs[i].addEventListener('change', function() {
            console.log('Auto-saving triggered by file upload');
            autoSaveFormData();
        });
    }
    
    // 为初始技能项的输入字段添加自动保存事件监听
    const skillItems = document.querySelectorAll('#skills-list .dynamic-item');
    for (let i = 0; i < skillItems.length; i++) {
        addAutoSaveListenersToSkillItem(skillItems[i]);
    }
    
    // 添加全局表单监听作为额外保障
    const allInputs = document.querySelectorAll('input, select, textarea');
    for (let i = 0; i < allInputs.length; i++) {
        allInputs[i].addEventListener('blur', function() {
            console.log('Auto-saving triggered by blur event');
            debouncedAutoSave();
        });
    }
}

/**
 * 初始化自动保存系统
 * 已迁移到新架构：使用 EventManager
 */
function initAutoSaveSystem() {
    console.log('Initializing auto-save system');
    
    // 使用新架构的事件管理器（如果可用）
    const EventManager = window.OfferLaolao?.Core?.EventManager;
    const EventBus = window.OfferLaolao?.Core?.EventBus;
    
    // 添加全局键盘快捷键
    const keydownHandler = function(e) {
        // Ctrl/Cmd + S 保存
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            console.log('Manual save triggered by keyboard shortcut');
            autoSaveFormData();
        }
    };
    
    if (EventManager) {
        // 使用事件管理器
        EventManager.onGlobal('keydown', keydownHandler);
    } else {
        // 兼容旧代码
        document.addEventListener('keydown', keydownHandler);
    }
    
    // 监听表单变化事件（如果使用事件总线）
    if (EventBus) {
        EventBus.on('form:changed', () => {
            if (typeof debouncedAutoSave === 'function') {
                debouncedAutoSave();
            }
        });
    }
    
    // 设置全局事件监听器
    setupGlobalAutoSaveListeners();
    
    console.log('Auto-save system initialized');
}

// 创建全局防抖版本的自动保存函数（需要在helpers.js加载后定义）
var debouncedAutoSave;

// 初始化防抖函数（在helpers.js加载后调用）
function initDebouncedAutoSave() {
    if (typeof debounce === 'function') {
        debouncedAutoSave = debounce(autoSaveFormData, 300);
    }
}

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        autoSaveFormData,
        addAutoSaveListenersToSkillItem,
        setupGlobalAutoSaveListeners,
        initAutoSaveSystem,
        initDebouncedAutoSave
    };
}

