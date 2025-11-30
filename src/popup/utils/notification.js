// 通知工具模块
// 显示通知消息

/**
 * 显示通知消息
 * @param {string} message - 通知消息内容
 * @param {string} type - 通知类型：success, error, warning, info
 * @param {number} autoHideTime - 自动隐藏时间（毫秒），默认3000
 * @returns {HTMLElement} 通知元素
 */
function showNotification(message, type, autoHideTime = 3000) {
    try {
        var notification = document.getElementById('notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification';
            document.body.appendChild(notification);
        }
        
        // 清除任何现有的计时器
        if (notification._hideTimer) {
            clearTimeout(notification._hideTimer);
            if (notification._fadeOutTimer) {
                clearTimeout(notification._fadeOutTimer);
            }
        }
        
        // 设置通知类型和内容
        var notificationType = type || 'info';
        // 确保类型是有效的CSS类名
        if (!['success', 'error', 'warning', 'info'].includes(notificationType)) {
            notificationType = 'info';
        }
        notification.className = 'notification ' + notificationType;
        notification.textContent = message;
        notification.style.display = 'block';
        
        // 添加动画效果
        setTimeout(function() {
            notification.classList.add('show');
        }, 10);
        
        // 在指定时间后自动隐藏
        notification._hideTimer = setTimeout(function() {
            notification.classList.remove('show');
            notification._fadeOutTimer = setTimeout(function() {
                notification.style.display = 'none';
            }, 300);
        }, autoHideTime);
        
        return notification;
    } catch (error) {
        console.error('Error in showNotification:', error);
    }
}

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { showNotification };
}

