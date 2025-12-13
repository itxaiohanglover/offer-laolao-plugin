/**
 * 通知服务（单例模式）
 * 统一管理通知显示
 */
(function(global) {
  'use strict';

  class NotificationService {
    constructor() {
      this.container = null;
      this.notifications = new Map();
      this.defaultDuration = 3000;
      this.maxNotifications = 5;
    }

    /**
     * 初始化通知容器
     */
    _initContainer() {
      if (this.container) return;

      this.container = document.getElementById('notification');
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.id = 'notification';
        document.body.appendChild(this.container);
      }
    }

    /**
     * 显示通知
     * @param {string} message - 消息内容
     * @param {string} type - 类型：success, error, warning, info
     * @param {number} duration - 显示时长（毫秒）
     * @returns {string} 通知ID
     */
    show(message, type = 'info', duration = null) {
      this._initContainer();

      const notificationId = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const actualDuration = duration !== null ? duration : this.defaultDuration;
      const validType = ['success', 'error', 'warning', 'info'].includes(type) ? type : 'info';

      // 清理现有计时器
      if (this.container._hideTimer) {
        clearTimeout(this.container._hideTimer);
        if (this.container._fadeOutTimer) {
          clearTimeout(this.container._fadeOutTimer);
        }
      }

      // 设置通知类型和内容
      this.container.className = `notification ${validType}`;
      this.container.textContent = message;
      this.container.style.display = 'block';

      // 添加动画效果
      setTimeout(() => {
        this.container.classList.add('show');
      }, 10);

      // 记录通知
      this.notifications.set(notificationId, {
        message,
        type: validType,
        startTime: Date.now()
      });

      // 限制通知数量
      if (this.notifications.size > this.maxNotifications) {
        const oldestId = Array.from(this.notifications.keys())[0];
        this.notifications.delete(oldestId);
      }

      // 自动隐藏
      this.container._hideTimer = setTimeout(() => {
        this.container.classList.remove('show');
        this.container._fadeOutTimer = setTimeout(() => {
          this.container.style.display = 'none';
          this.notifications.delete(notificationId);
        }, 300);
      }, actualDuration);

      return notificationId;
    }

    /**
     * 成功通知
     */
    success(message, duration = null) {
      return this.show(message, 'success', duration);
    }

    /**
     * 错误通知
     */
    error(message, duration = null) {
      return this.show(message, 'error', duration);
    }

    /**
     * 警告通知
     */
    warning(message, duration = null) {
      return this.show(message, 'warning', duration);
    }

    /**
     * 信息通知
     */
    info(message, duration = null) {
      return this.show(message, 'info', duration);
    }

    /**
     * 手动隐藏通知
     */
    hide() {
      if (this.container) {
        if (this.container._hideTimer) {
          clearTimeout(this.container._hideTimer);
        }
        if (this.container._fadeOutTimer) {
          clearTimeout(this.container._fadeOutTimer);
        }
        this.container.classList.remove('show');
        setTimeout(() => {
          this.container.style.display = 'none';
        }, 300);
      }
    }

    /**
     * 清除所有通知
     */
    clear() {
      this.hide();
      this.notifications.clear();
    }
  }

  // 单例模式
  let instance = null;

  function getInstance() {
    if (!instance) {
      instance = new NotificationService();
    }
    return instance;
  }

  // 导出
  if (typeof window !== 'undefined' && window.OfferLaolao) {
    window.OfferLaolao.Services.NotificationService = getInstance();
  }

  // 兼容旧代码：提供全局函数
  if (typeof window !== 'undefined') {
    window.showNotification = function(message, type, duration) {
      return getInstance().show(message, type, duration);
    };
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NotificationService, getInstance };
  }
})(typeof window !== 'undefined' ? window : this);

