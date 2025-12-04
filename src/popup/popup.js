// 简历自动填写助手 - 主入口文件
// 整合所有功能模块

// ============================================
// 模块加载顺序（通过HTML中的script标签按顺序加载）
// 1. utils/helpers.js - 辅助工具
// 2. utils/notification.js - 通知工具
// 3. utils/storage.js - 存储工具
// 4. utils/form.js - 表单工具
// 5. components/mode-tabs.js - 模式切换
// 6. components/dynamic-items.js - 动态项组件
// 7. handlers/auto-save.js - 自动保存
// 8. handlers/remove-buttons.js - 删除按钮
// 9. handlers/action-buttons.js - 操作按钮
// 10. handlers/add-buttons.js - 添加按钮
// 11. components/resume-upload.js - 简历上传
// 12. data-loader.js - 数据加载
// 13. popup.js (本文件) - 主初始化
// ============================================

/**
 * 初始化删除按钮事件
 */
function initRemoveButtons() {
    // 使用事件委托为删除按钮添加事件监听
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-btn')) {
            e.preventDefault();
            var parent = e.target.closest('.dynamic-item');
            if (parent && parent.parentNode) {
                var list = parent.parentNode;
                var listId = list.id;
                
                // 检查项是否为空
                var isEmpty = isItemEmpty(parent);
                
                // 检查是否至少保留一个项
                var itemCount = list.querySelectorAll('.dynamic-item').length;
                
                // 如果项为空，或者有多个项，允许删除
                if (isEmpty || itemCount > 1) {
                    // 确认删除
                    if (confirm('确定要删除此项吗？')) {
                        list.removeChild(parent);
                        // 更新索引
                        updateItemIndices(listId);
                        // 触发自动保存
                        autoSaveFormData();
                        showNotification('已删除该项', 'info');
                    }
                } else {
                    showNotification('至少需要保留一个非空项', 'warning');
                }
            }
        }
    });
}

/**
 * 清理多余的空项
 * @param {string} listId - 列表ID
 */
function cleanupEmptyItems(listId) {
    var list = document.getElementById(listId);
    if (!list) {
        console.warn(`List ${listId} not found`);
        return;
    }
    
    var items = list.querySelectorAll('.dynamic-item');
    var itemCount = items.length;
    console.log(`Checking ${listId}: found ${itemCount} items`);
    
    if (itemCount <= 1) {
        console.log(`${listId}: Only ${itemCount} item(s), no cleanup needed`);
        return; // 只有一个或没有项，不需要清理
    }
    
    // 检查是否所有项都是空的
    var allEmpty = true;
    for (var k = 0; k < items.length; k++) {
        if (!isItemEmpty(items[k])) {
            allEmpty = false;
            break;
        }
    }
    
    // 只有在所有项都为空时才清理，保留第一个
    if (allEmpty) {
        var removedCount = 0;
        for (var i = items.length - 1; i > 0; i--) {
            var item = items[i];
            if (item && item.parentNode === list) {
                list.removeChild(item);
                removedCount++;
                console.log(`Removed empty item at index ${i} from ${listId}, keeping only the first empty item`);
            }
        }
        
        // 更新索引
        if (removedCount > 0) {
            updateItemIndices(listId);
            console.log(`${listId}: Cleanup completed, removed ${removedCount} empty items`);
        }
    } else {
        console.log(`${listId}: Found non-empty items, skipping cleanup to preserve user data`);
    }
}

/**
 * 立即清理所有指定模块的多余项
 */
function cleanupAllSingleItemSections() {
    console.log('Starting immediate cleanup of all single-item sections...');
    var sections = [
        'education-list',
        'internship-list',
        'project-list',
        'skills-list',
        'language-list',
        'custom-field-list'
    ];
    
    sections.forEach(function(listId) {
        cleanupEmptyItems(listId);
    });
    
    console.log('Immediate cleanup completed');
}

/**
 * 加载设置
 */
function loadSettings() {
    // 加载模型配置
    var modelSettings = loadDataFromStorage('modelSettings');
    if (modelSettings && typeof modelSettings === 'object') {
        if (document.getElementById('model-api-url')) {
            document.getElementById('model-api-url').value = modelSettings.url || '';
        }
        if (document.getElementById('model-api-key')) {
            document.getElementById('model-api-key').value = modelSettings.apiKey || '';
        }
        if (document.getElementById('model-name')) {
            document.getElementById('model-name').value = modelSettings.model || '';
        }
    }
    
    // 加载简历解析配置
    var parseSettings = loadDataFromStorage('parseSettings');
    if (parseSettings && typeof parseSettings === 'object') {
        if (document.getElementById('parse-api-url')) {
            document.getElementById('parse-api-url').value = parseSettings.url || '';
        }
        if (document.getElementById('parse-app-code')) {
            document.getElementById('parse-app-code').value = parseSettings.appCode || '';
        }
    }
    
    // 兼容旧版本配置（如果存在）
    var oldSettings = loadDataFromStorage('appSettings');
    if (oldSettings && typeof oldSettings === 'object' && oldSettings.url) {
        // 如果有旧配置，迁移到新的配置结构
        if (!modelSettings || !modelSettings.url) {
            // 如果模型配置为空，使用旧配置
            var migratedModelSettings = {
                url: oldSettings.url || '',
                apiKey: oldSettings.apiKey || '',
                model: oldSettings.model || ''
            };
            saveDataToStorage(migratedModelSettings, 'modelSettings');
            if (document.getElementById('model-api-url')) {
                document.getElementById('model-api-url').value = migratedModelSettings.url;
            }
            if (document.getElementById('model-api-key')) {
                document.getElementById('model-api-key').value = migratedModelSettings.apiKey;
            }
            if (document.getElementById('model-name')) {
                document.getElementById('model-name').value = migratedModelSettings.model;
            }
        }
        
        if (!parseSettings || !parseSettings.url) {
            // 如果解析配置为空，使用旧配置
            var migratedParseSettings = {
                url: oldSettings.url || '',
                appCode: oldSettings.apiKey || ''
            };
            saveDataToStorage(migratedParseSettings, 'parseSettings');
            if (document.getElementById('parse-api-url')) {
                document.getElementById('parse-api-url').value = migratedParseSettings.url;
            }
            if (document.getElementById('parse-app-code')) {
                document.getElementById('parse-app-code').value = migratedParseSettings.appCode;
            }
        }
    }
}

/**
 * 初始化所有功能
 */
function initApp() {
    console.log('Starting application initialization with safety wrappers');
    
    // 使用安全执行包装整个初始化流程
    safeExecute(function() {
        // 1. 首先初始化标签切换，确保UI正确显示
        safeExecute(function() {
            console.log('Step 1: Initializing mode tabs');
            initModeTabs();
        }, null, [], false);
        
        // 2. 加载设置数据（需要在初始化按钮之前加载，以便设置输入框有值）
        safeExecute(function() {
            console.log('Step 2: Loading settings');
            loadSettings();
        }, null, [], false);
        
        // 3. 初始化防抖自动保存函数
        safeExecute(function() {
            console.log('Step 2.5: Initializing debounced auto-save');
            if (typeof initDebouncedAutoSave === 'function') {
                initDebouncedAutoSave();
            }
        }, null, [], false);
        
        // 4. 初始化删除按钮功能
        safeExecute(function() {
            console.log('Step 3: Initializing remove buttons');
            initRemoveButtons();
        }, null, [], false);
        
        // 5. 加载表单数据
        safeExecute(function() {
            console.log('Step 4: Loading form data with safety measures');
            if (typeof loadFormData === 'function') {
                loadFormData();
            }
        }, null, [], false);
        
        // 6. 初始化操作按钮功能
        safeExecute(function() {
            console.log('Step 5: Initializing action buttons');
            if (typeof initActionButtons === 'function') {
                initActionButtons();
            }
        }, null, [], false);
        
        // 6.5 初始化字段级填充按钮
        safeExecute(function() {
            console.log('Step 5.5: Initializing field fill buttons');
            if (typeof initFieldFillButtons === 'function') {
                initFieldFillButtons();
            }
        }, null, [], false);
        
        // 7. 初始化简历上传功能
        safeExecute(function() {
            console.log('Step 7: Initializing resume upload functionality');
            if (typeof initResumeUpload === 'function') {
                initResumeUpload();
            }
        }, null, [], false);
        
        // 8. 初始化添加按钮功能
        safeExecute(function() {
            console.log('Step 7: Initializing add buttons functionality');
            if (typeof initAddButtons === 'function') {
                initAddButtons();
            }
        }, null, [], false);
        
        // 8.5 在动态项加载后，再次初始化字段填充按钮（确保动态项中的字段也有按钮）
        safeExecute(function() {
            console.log('Step 7.5: Re-initializing field fill buttons for dynamic items');
            setTimeout(function() {
                if (typeof initDynamicItemFieldButtons === 'function') {
                    initDynamicItemFieldButtons();
                }
                if (typeof attachFieldFillButtonListeners === 'function') {
                    attachFieldFillButtonListeners();
                }
            }, 500);
        }, null, [], false);
        
        // 9. 最后初始化自动保存系统
        safeExecute(function() {
            console.log('Step 8: Initializing auto-save system');
            initAutoSaveSystem();
        }, null, [], false);
        
        // 10. 最终清理：只在没有保存数据时清理多余的空项
        safeExecute(function() {
            console.log('Step 9: Final cleanup check');
            // 检查是否有保存的数据
            var resumeData = safeExecute(loadDataFromStorage, null, ['resumeData'], {});
            // 只有在没有保存数据时才清理多余的空项
            if (!resumeData || typeof resumeData !== 'object' || Object.keys(resumeData).length === 0) {
                setTimeout(function() {
                    cleanupAllSingleItemSections();
                    console.log('Final cleanup completed for empty sections');
                }, 800);
            } else {
                console.log('Found saved data, skipping cleanup to preserve user items');
            }
        }, null, [], false);
        
        console.log('Application initialization completed successfully');
    }, this);
}

/**
 * 安全的页面加载完成后初始化应用
 */
function safeInit() {
    // 等待DOM完全加载
    if (document.readyState === 'loading') {
        console.log('Waiting for DOM to load...');
        document.addEventListener('DOMContentLoaded', function() {
            // 延迟一小段时间以确保所有DOM元素都已渲染
            setTimeout(initApp, 100);
        });
    } else {
        // 已经加载完成
        console.log('DOM already loaded, initializing...');
        // 稍微延迟后初始化以确保稳定性
        setTimeout(initApp, 100);
    }
}

// 开始安全初始化应用
safeInit();

