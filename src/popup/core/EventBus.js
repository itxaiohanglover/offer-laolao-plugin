/**
 * 事件总线（观察者模式）
 * 用于模块间解耦通信
 */
(function(global) {
  'use strict';

  class EventBus {
    constructor() {
      this.events = {};
      this.maxListeners = 50; // 防止内存泄漏
    }

    /**
     * 订阅事件
     * @param {string} event - 事件名称
     * @param {Function} callback - 回调函数
     * @param {object} options - 选项 { once: boolean, priority: number }
     * @returns {Function} 取消订阅函数
     */
    on(event, callback, options = {}) {
      if (typeof callback !== 'function') {
        console.warn(`EventBus.on: callback must be a function for event "${event}"`);
        return () => {};
      }

      if (!this.events[event]) {
        this.events[event] = [];
      }

      // 检查监听器数量限制
      if (this.events[event].length >= this.maxListeners) {
        console.warn(`EventBus: Too many listeners for event "${event}"`);
        return () => {};
      }

      const listener = {
        callback,
        once: options.once || false,
        priority: options.priority || 0,
        id: Date.now() + Math.random()
      };

      this.events[event].push(listener);
      // 按优先级排序
      this.events[event].sort((a, b) => b.priority - a.priority);

      // 返回取消订阅函数
      return () => this.off(event, callback);
    }

    /**
     * 订阅事件（只触发一次）
     */
    once(event, callback, options = {}) {
      return this.on(event, callback, { ...options, once: true });
    }

    /**
     * 取消订阅
     */
    off(event, callback) {
      if (!this.events[event]) return;

      if (callback) {
        this.events[event] = this.events[event].filter(
          listener => listener.callback !== callback
        );
      } else {
        // 如果没有指定 callback，移除所有监听器
        delete this.events[event];
      }
    }

    /**
     * 触发事件
     * @param {string} event - 事件名称
     * @param {*} data - 事件数据
     * @returns {boolean} 是否有监听器处理了事件
     */
    emit(event, data) {
      if (!this.events[event] || this.events[event].length === 0) {
        return false;
      }

      const listeners = [...this.events[event]]; // 复制数组，避免在执行过程中修改
      let handled = false;

      listeners.forEach(listener => {
        try {
          listener.callback(data);
          handled = true;

          // 如果是一次性监听器，移除
          if (listener.once) {
            this.off(event, listener.callback);
          }
        } catch (error) {
          console.error(`Error in event listener for "${event}":`, error);
        }
      });

      return handled;
    }

    /**
     * 获取事件监听器数量
     */
    listenerCount(event) {
      return this.events[event] ? this.events[event].length : 0;
    }

    /**
     * 移除所有事件监听器
     */
    removeAllListeners(event) {
      if (event) {
        delete this.events[event];
      } else {
        this.events = {};
      }
    }

    /**
     * 获取所有事件名称
     */
    eventNames() {
      return Object.keys(this.events);
    }
  }

  // 单例模式
  let instance = null;

  function getInstance() {
    if (!instance) {
      instance = new EventBus();
    }
    return instance;
  }

  // 导出
  if (typeof window !== 'undefined' && window.OfferLaolao) {
    window.OfferLaolao.Core.EventBus = getInstance();
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EventBus, getInstance };
  }
})(typeof window !== 'undefined' ? window : this);

