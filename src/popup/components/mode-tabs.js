// 模式切换组件模块
// 处理手动填写和设置模式的切换

/**
 * 初始化模式切换标签
 */
function initModeTabs() {
    var modeTabs = document.querySelectorAll('.mode-tabs button');
    
    // 初始化显示默认标签和内容面板
    if (modeTabs.length > 0) {
        modeTabs[0].classList.add('active');
        // 确保默认内容面板显示
        document.getElementById('manual-content').classList.remove('hidden');
        document.getElementById('settings-content').classList.add('hidden');
    }
    
    // 添加点击事件监听
    for (var i = 0; i < modeTabs.length; i++) {
        modeTabs[i].addEventListener('click', function() {
            // 移除所有活动状态
            for (var j = 0; j < modeTabs.length; j++) {
                modeTabs[j].classList.remove('active');
            }
            
            // 隐藏所有内容面板
            document.getElementById('manual-content').classList.add('hidden');
            document.getElementById('settings-content').classList.add('hidden');
            
            // 设置当前活动状态
            this.classList.add('active');
            
            // 显示对应内容面板
            var mode = this.getAttribute('data-mode');
            if (mode === 'manual') {
                document.getElementById('manual-content').classList.remove('hidden');
            } else if (mode === 'settings') {
                document.getElementById('settings-content').classList.remove('hidden');
            }
        });
    }
}

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initModeTabs };
}

