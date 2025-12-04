// 动态项组件模块
// 创建和管理各种动态表单项

/**
 * 更新项目索引
 * @param {string} listId - 列表元素ID
 */
function updateItemIndices(listId) {
    var list = document.getElementById(listId);
    if (!list) return;
    
    var items = list.querySelectorAll('.dynamic-item');
    for (var i = 0; i < items.length; i++) {
        var index = i;
        // 更新输入字段的名称
        var inputs = items[i].querySelectorAll('input, select, textarea');
        for (var j = 0; j < inputs.length; j++) {
            var input = inputs[j];
            if (input.name) {
                // 处理数组格式的name属性 (如 skills[0][name], education[0][school])
                // 匹配格式: name[数字][key] 或 name[数字]
                if (input.name.match(/\[(\d+)\]/)) {
                    input.name = input.name.replace(/\[(\d+)\]/, '[' + index + ']');
                }
            }
        }
    }
}

/**
 * 创建技能项
 * @param {number} index - 项目索引
 * @returns {HTMLElement} 技能项元素
 */
function createSkillItem(index) {
    var div = document.createElement('div');
    div.className = 'dynamic-item';
    div.style.position = 'relative';
    
    // 创建表单内容容器
    div.innerHTML = 
        '<button class="remove-btn">删除</button>' +
        '<div class="form-group">' +
            '<label>技能名称</label>' +
            '<input type="text" name="skills[' + index + '][name]" placeholder="请输入技能名称">' +
        '</div>' +
        '<div class="form-group">' +
            '<label>技能水平</label>' +
            '<select name="skills[' + index + '][level]">' +
                '<option value="">请选择</option>' +
                '<option value="初级">初级</option>' +
                '<option value="中级">中级</option>' +
                '<option value="高级">高级</option>' +
                '<option value="专家">专家</option>' +
            '</select>' +
        '</div>';
    
    // 添加删除按钮事件
    var removeBtn = div.querySelector('.remove-btn');
    if (removeBtn) {
        removeBtn.addEventListener('click', function() {
            var parent = this.closest('.dynamic-item');
            var list = parent ? parent.parentNode : null;
            if (parent && list) {
                var isEmpty = isItemEmpty(parent);
                var itemCount = list.querySelectorAll('.dynamic-item').length;
                
                if (isEmpty || itemCount > 1) {
                    if (confirm('确定要删除此项吗？')) {
                        list.removeChild(parent);
                        updateItemIndices('skills-list');
                        if (typeof autoSaveFormData === 'function') {
                            autoSaveFormData();
                        }
                    }
                } else {
                    if (typeof showNotification === 'function') {
                        showNotification('至少需要保留一个非空技能项', 'warning');
                    }
                }
            }
        });
    }
    
    // 添加自动保存事件监听
    if (typeof addAutoSaveListenersToSkillItem === 'function') {
        addAutoSaveListenersToSkillItem(div);
    }
    
    return div;
}

/**
 * 创建教育经历项
 * @param {number} index - 项目索引
 * @returns {HTMLElement} 教育经历项元素
 */
function createEducationItem(index) {
    var div = document.createElement('div');
    div.className = 'dynamic-item';
    div.style.position = 'relative';
    
    div.innerHTML = 
        '<button class="remove-btn">删除</button>' +
        '<div class="form-group">' +
            '<label>学校名称</label>' +
            '<input type="text" name="education[' + index + '][school]" placeholder="请输入学校名称">' +
        '</div>' +
        '<div class="form-group">' +
            '<label>专业</label>' +
            '<input type="text" name="education[' + index + '][major]" placeholder="请输入专业">' +
        '</div>' +
        '<div class="form-group">' +
            '<label>学历</label>' +
            '<select name="education[' + index + '][degree]">' +
                '<option value="">请选择</option>' +
                '<option value="专科">专科</option>' +
                '<option value="本科">本科</option>' +
                '<option value="硕士">硕士</option>' +
                '<option value="博士">博士</option>' +
            '</select>' +
        '</div>' +
        '<div class="form-group">' +
            '<label>排名</label>' +
            '<input type="text" name="education[' + index + '][rank]" placeholder="请输入排名（如：前5%）">' +
        '</div>' +
        '<div class="form-group-inline">' +
            '<div>' +
                '<label>入学时间</label>' +
                '<input type="date" name="education[' + index + '][start-date]">' +
            '</div>' +
            '<div>' +
                '<label>毕业时间</label>' +
                '<input type="date" name="education[' + index + '][end-date]">' +
            '</div>' +
        '</div>';
    
    // 添加删除按钮事件
    var removeBtn = div.querySelector('.remove-btn');
    if (removeBtn) {
        removeBtn.addEventListener('click', function() {
            var parent = this.closest('.dynamic-item');
            var list = parent ? parent.parentNode : null;
            if (parent && list) {
                var isEmpty = isItemEmpty(parent);
                var itemCount = list.querySelectorAll('.dynamic-item').length;
                
                if (isEmpty || itemCount > 1) {
                    if (confirm('确定要删除此项吗？')) {
                        list.removeChild(parent);
                        updateItemIndices('education-list');
                        if (typeof autoSaveFormData === 'function') {
                            autoSaveFormData();
                        }
                    }
                } else {
                    if (typeof showNotification === 'function') {
                        showNotification('至少需要保留一个非空教育经历项', 'warning');
                    }
                }
            }
        });
    }
    
    // 为所有输入字段添加ID（如果还没有）
    const inputs = div.querySelectorAll('input, textarea, select');
    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        // 跳过文件输入和按钮
        if (input.type === 'file' || input.type === 'button' || input.type === 'submit') {
            continue;
        }
        
        // 如果没有ID，根据name属性生成
        if (!input.id && input.name) {
            // 从name中提取字段名，如 education[0][school] -> education-0-school
            var idFromName = input.name.replace(/\[/g, '-').replace(/\]/g, '').replace(/--/g, '-');
            input.id = idFromName;
        } else if (!input.id) {
            // 如果既没有ID也没有name，生成一个唯一ID
            input.id = 'field-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        }
        
        // 添加自动保存事件监听
        if (typeof debouncedAutoSave === 'function') {
            input.addEventListener('input', debouncedAutoSave);
            input.addEventListener('change', debouncedAutoSave);
        }
    }
    
    // 为动态项中的字段添加填充按钮
    if (typeof initDynamicItemFieldButtons === 'function') {
        // 延迟一下，确保DOM已完全插入
        setTimeout(function() {
            initDynamicItemFieldButtons();
            if (typeof attachFieldFillButtonListeners === 'function') {
                attachFieldFillButtonListeners();
            }
        }, 50);
    }
    
    return div;
}

/**
 * 创建工作经历项
 * @param {number} index - 项目索引
 * @returns {HTMLElement} 工作经历项元素
 */
function createWorkExperienceItem(index) {
    var div = document.createElement('div');
    div.className = 'dynamic-item';
    div.style.position = 'relative';
    
    div.innerHTML = 
        '<button class="remove-btn">删除</button>' +
        '<div class="form-group">' +
            '<label>公司名称</label>' +
            '<input type="text" name="internship[' + index + '][company]" placeholder="请输入公司名称">' +
        '</div>' +
        '<div class="form-group">' +
            '<label>职位</label>' +
            '<input type="text" name="internship[' + index + '][position]" placeholder="请输入职位">' +
        '</div>' +
        '<div class="form-group-inline">' +
            '<div>' +
                '<label>开始时间</label>' +
                '<input type="date" name="internship[' + index + '][start-date]">' +
            '</div>' +
            '<div>' +
                '<label>结束时间</label>' +
                '<input type="date" name="internship[' + index + '][end-date]">' +
            '</div>' +
        '</div>' +
        '<div class="form-group">' +
            '<label>实习/工作描述</label>' +
            '<textarea name="internship[' + index + '][description]" placeholder="请输入实习/工作描述"></textarea>' +
        '</div>';
    
    // 添加删除按钮事件
    var removeBtn = div.querySelector('.remove-btn');
    if (removeBtn) {
        removeBtn.addEventListener('click', function() {
            var parent = this.closest('.dynamic-item');
            var list = parent ? parent.parentNode : null;
            if (parent && list) {
                var isEmpty = isItemEmpty(parent);
                var itemCount = list.querySelectorAll('.dynamic-item').length;
                
                if (isEmpty || itemCount > 1) {
                    if (confirm('确定要删除此项吗？')) {
                        list.removeChild(parent);
                        updateItemIndices('internship-list');
                        if (typeof autoSaveFormData === 'function') {
                            autoSaveFormData();
                        }
                    }
                } else {
                    if (typeof showNotification === 'function') {
                        showNotification('至少需要保留一个非空实习/工作经历项', 'warning');
                    }
                }
            }
        });
    }
    
    // 为所有输入字段添加ID（如果还没有）
    const inputs = div.querySelectorAll('input, textarea, select');
    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        // 跳过文件输入和按钮
        if (input.type === 'file' || input.type === 'button' || input.type === 'submit') {
            continue;
        }
        
        // 如果没有ID，根据name属性生成
        if (!input.id && input.name) {
            // 从name中提取字段名，如 education[0][school] -> education-0-school
            var idFromName = input.name.replace(/\[/g, '-').replace(/\]/g, '').replace(/--/g, '-');
            input.id = idFromName;
        } else if (!input.id) {
            // 如果既没有ID也没有name，生成一个唯一ID
            input.id = 'field-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        }
        
        // 添加自动保存事件监听
        if (typeof debouncedAutoSave === 'function') {
            input.addEventListener('input', debouncedAutoSave);
            input.addEventListener('change', debouncedAutoSave);
        }
    }
    
    // 为动态项中的字段添加填充按钮
    if (typeof initDynamicItemFieldButtons === 'function') {
        // 延迟一下，确保DOM已完全插入
        setTimeout(function() {
            initDynamicItemFieldButtons();
            if (typeof attachFieldFillButtonListeners === 'function') {
                attachFieldFillButtonListeners();
            }
        }, 50);
    }
    
    return div;
}

/**
 * 创建项目经历项
 * @param {number} index - 项目索引
 * @returns {HTMLElement} 项目经历项元素
 */
function createProjectItem(index) {
    var div = document.createElement('div');
    div.className = 'dynamic-item';
    div.style.position = 'relative';
    
    div.innerHTML = 
        '<button class="remove-btn">删除</button>' +
        '<div class="form-group">' +
            '<label>项目名称</label>' +
            '<input type="text" name="project[' + index + '][project-name]" placeholder="请输入项目名称">' +
        '</div>' +
        '<div class="form-group">' +
            '<label>担任角色</label>' +
            '<input type="text" name="project[' + index + '][role]" placeholder="请输入担任角色">' +
        '</div>' +
        '<div class="form-group">' +
            '<label>项目时间</label>' +
            '<input type="text" name="project[' + index + '][project-time]" placeholder="请输入项目时间">' +
        '</div>' +
        '<div class="form-group">' +
            '<label>项目描述</label>' +
            '<textarea name="project[' + index + '][project-desc]" placeholder="请输入项目描述"></textarea>' +
        '</div>' +
        '<div class="form-group">' +
            '<label>职责描述</label>' +
            '<textarea name="project[' + index + '][responsibilities]" placeholder="请输入职责描述"></textarea>' +
        '</div>';
    
    // 添加删除按钮事件
    var removeBtn = div.querySelector('.remove-btn');
    if (removeBtn) {
        removeBtn.addEventListener('click', function() {
            var parent = this.closest('.dynamic-item');
            var list = parent ? parent.parentNode : null;
            if (parent && list) {
                var isEmpty = isItemEmpty(parent);
                var itemCount = list.querySelectorAll('.dynamic-item').length;
                
                if (isEmpty || itemCount > 1) {
                    if (confirm('确定要删除此项吗？')) {
                        list.removeChild(parent);
                        updateItemIndices('project-list');
                        if (typeof autoSaveFormData === 'function') {
                            autoSaveFormData();
                        }
                    }
                } else {
                    if (typeof showNotification === 'function') {
                        showNotification('至少需要保留一个非空项目经历项', 'warning');
                    }
                }
            }
        });
    }
    
    // 为所有输入字段添加ID（如果还没有）
    const inputs = div.querySelectorAll('input, textarea, select');
    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        // 跳过文件输入和按钮
        if (input.type === 'file' || input.type === 'button' || input.type === 'submit') {
            continue;
        }
        
        // 如果没有ID，根据name属性生成
        if (!input.id && input.name) {
            // 从name中提取字段名，如 education[0][school] -> education-0-school
            var idFromName = input.name.replace(/\[/g, '-').replace(/\]/g, '').replace(/--/g, '-');
            input.id = idFromName;
        } else if (!input.id) {
            // 如果既没有ID也没有name，生成一个唯一ID
            input.id = 'field-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        }
        
        // 添加自动保存事件监听
        if (typeof debouncedAutoSave === 'function') {
            input.addEventListener('input', debouncedAutoSave);
            input.addEventListener('change', debouncedAutoSave);
        }
    }
    
    // 为动态项中的字段添加填充按钮
    if (typeof initDynamicItemFieldButtons === 'function') {
        // 延迟一下，确保DOM已完全插入
        setTimeout(function() {
            initDynamicItemFieldButtons();
            if (typeof attachFieldFillButtonListeners === 'function') {
                attachFieldFillButtonListeners();
            }
        }, 50);
    }
    
    return div;
}

/**
 * 创建语言能力项
 * @param {number} index - 项目索引
 * @returns {HTMLElement} 语言能力项元素
 */
function createLanguageItem(index) {
    var div = document.createElement('div');
    div.className = 'dynamic-item';
    div.style.position = 'relative';
    
    div.innerHTML = 
        '<button class="remove-btn">删除</button>' +
        '<div class="form-group">' +
            '<label>语言名称</label>' +
            '<input type="text" name="language[' + index + '][name]" placeholder="请输入语言名称（如：英语、日语）">' +
        '</div>' +
        '<div class="form-group">' +
            '<label>掌握程度</label>' +
            '<select name="language[' + index + '][proficiency]">' +
                '<option value="">请选择</option>' +
                '<option value="入门">入门</option>' +
                '<option value="基础">基础</option>' +
                '<option value="熟练">熟练</option>' +
                '<option value="精通">精通</option>' +
            '</select>' +
        '</div>' +
        '<div class="form-group">' +
            '<label>证书</label>' +
            '<input type="text" name="language[' + index + '][certificate]" placeholder="请输入证书名称（如：大学英语六级）">' +
            '<input type="file" name="language[' + index + '][certificate-file]" accept=".pdf,.jpg,.png">' +
        '</div>';
    
    // 添加删除按钮事件
    var removeBtn = div.querySelector('.remove-btn');
    if (removeBtn) {
        removeBtn.addEventListener('click', function() {
            var parent = this.closest('.dynamic-item');
            var list = parent ? parent.parentNode : null;
            if (parent && list) {
                var isEmpty = isItemEmpty(parent);
                var itemCount = list.querySelectorAll('.dynamic-item').length;
                
                if (isEmpty || itemCount > 1) {
                    if (confirm('确定要删除此项吗？')) {
                        list.removeChild(parent);
                        updateItemIndices('language-list');
                        if (typeof autoSaveFormData === 'function') {
                            autoSaveFormData();
                        }
                    }
                } else {
                    if (typeof showNotification === 'function') {
                        showNotification('至少需要保留一个非空语言能力项', 'warning');
                    }
                }
            }
        });
    }
    
    // 添加自动保存事件监听
    const inputs = div.querySelectorAll('input, select');
    if (typeof debouncedAutoSave === 'function') {
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('input', debouncedAutoSave);
            inputs[i].addEventListener('change', debouncedAutoSave);
        }
    }
    
    return div;
}

/**
 * 创建自定义字段项
 * @param {number} index - 项目索引
 * @returns {HTMLElement} 自定义字段项元素
 */
function createCustomFieldItem(index) {
    var div = document.createElement('div');
    div.className = 'dynamic-item';
    div.style.position = 'relative';
    
    div.innerHTML = 
        '<button class="remove-btn">删除</button>' +
        '<div class="form-group">' +
            '<label>字段名称</label>' +
            '<input type="text" name="custom[' + index + '][name]" placeholder="请输入字段名称">' +
        '</div>' +
        '<div class="form-group">' +
            '<label>字段内容</label>' +
            '<textarea name="custom[' + index + '][content]" placeholder="请输入字段内容"></textarea>' +
        '</div>';
    
    // 添加删除按钮事件
    var removeBtn = div.querySelector('.remove-btn');
    if (removeBtn) {
        removeBtn.addEventListener('click', function() {
            var parent = this.closest('.dynamic-item');
            var list = parent ? parent.parentNode : null;
            if (parent && list) {
                var isEmpty = isItemEmpty(parent);
                var itemCount = list.querySelectorAll('.dynamic-item').length;
                
                if (isEmpty || itemCount > 1) {
                    if (confirm('确定要删除此项吗？')) {
                        list.removeChild(parent);
                        updateItemIndices('custom-field-list');
                        if (typeof autoSaveFormData === 'function') {
                            autoSaveFormData();
                        }
                    }
                } else {
                    if (typeof showNotification === 'function') {
                        showNotification('至少需要保留一个非空自定义字段项', 'warning');
                    }
                }
            }
        });
    }
    
    // 添加自动保存事件监听
    const inputs = div.querySelectorAll('input, textarea');
    if (typeof debouncedAutoSave === 'function') {
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('input', debouncedAutoSave);
            inputs[i].addEventListener('change', debouncedAutoSave);
        }
    }
    
    return div;
}

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        updateItemIndices,
        createSkillItem,
        createEducationItem,
        createWorkExperienceItem,
        createProjectItem,
        createLanguageItem,
        createCustomFieldItem
    };
}

