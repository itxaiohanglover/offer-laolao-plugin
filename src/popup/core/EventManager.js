/**
 * 事件管理器
 * 统一管理 DOM 事件监听器，防止内存泄漏
 */
(function(global) {
  'use strict';

  class EventManager {
    constructor() {
      this.listeners = new WeakMap();
      this.globalListeners = [];
    }

    /**
     * 添加事件监听器
     * @param {HTMLElement} element - 目标元素
     * @param {string} event - 事件类型
     * @param {Function} handler - 处理函数
     * @param {object} options - 选项（useCapture, once, passive等）
     * @returns {Function} 移除函数
     */
    on(element, event, handler, options = {}) {
      if (!element || typeof handler !== 'function') {
        console.warn('EventManager.on: Invalid element or handler');
        return () => {};
      }

      // 添加事件监听器
      element.addEventListener(event, handler, options);

      // 记录监听器
      if (!this.listeners.has(element)) {
        this.listeners.set(element, []);
      }
      const elementListeners = this.listeners.get(element);
      elementListeners.push({ event, handler, options });

      // 返回移除函数
      return () => this.off(element, event, handler);
    }

    /**
     * 移除事件监听器
     */
    off(element, event, handler) {
      if (!element || !this.listeners.has(element)) {
        return;
      }

      const elementListeners = this.listeners.get(element);
      const index = elementListeners.findIndex(
        listener => listener.event === event && listener.handler === handler
      );

      if (index !== -1) {
        const listener = elementListeners[index];
        element.removeEventListener(event, handler, listener.options);
        elementListeners.splice(index, 1);
      }
    }

    /**
     * 添加全局事件监听器（document, window等）
     */
    onGlobal(event, handler, options = {}) {
      const target = options.target || document;
      target.addEventListener(event, handler, options);

      this.globalListeners.push({ target, event, handler, options });

      return () => this.offGlobal(event, handler, options.target);
    }

    /**
     * 移除全局事件监听器
     */
    offGlobal(event, handler, target = document) {
      const index = this.globalListeners.findIndex(
        listener => listener.event === event && 
                   listener.handler === handler && 
                   listener.target === target
      );

      if (index !== -1) {
        const listener = this.globalListeners[index];
        listener.target.removeEventListener(event, handler, listener.options);
        this.globalListeners.splice(index, 1);
      }
    }

    /**
     * 移除元素的所有事件监听器
     */
    removeAll(element) {
      if (!this.listeners.has(element)) {
        return;
      }

      const elementListeners = this.listeners.get(element);
      elementListeners.forEach(({ event, handler, options }) => {
        element.removeEventListener(event, handler, options);
      });

      this.listeners.delete(element);
    }

    /**
     * 清理所有事件监听器
     */
    cleanup() {
      // 清理元素监听器
      // WeakMap 会自动清理，但我们可以手动移除事件
      // 注意：WeakMap 无法遍历，所以需要在添加时记录

      // 清理全局监听器
      this.globalListeners.forEach(({ target, event, handler, options }) => {
        target.removeEventListener(event, handler, options);
      });
      this.globalListeners = [];
    }

    /**
     * 使用事件委托
     * @param {HTMLElement} container - 容器元素
     * @param {string} selector - 选择器
     * @param {string} event - 事件类型
     * @param {Function} handler - 处理函数
     * @returns {Function} 移除函数
     */
    delegate(container, selector, event, handler) {
      const wrappedHandler = (e) => {
        const target = e.target.closest(selector);
        if (target && container.contains(target)) {
          handler.call(target, e);
        }
      };

      return this.on(container, event, wrappedHandler);
    }
  }

  // 单例模式
  let instance = null;

  function getInstance() {
    if (!instance) {
      instance = new EventManager();
    }
    return instance;
  }

  // 导出
  if (typeof window !== 'undefined' && window.OfferLaolao) {
    window.OfferLaolao.Core.EventManager = getInstance();
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EventManager, getInstance };
  }
})(typeof window !== 'undefined' ? window : this);

