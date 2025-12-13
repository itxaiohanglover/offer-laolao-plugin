/**
 * 存储服务（单例模式）
 * 统一管理数据存储，提供重试机制和错误处理
 */
(function(global) {
  'use strict';

  class StorageService {
    constructor() {
      this.storage = typeof localStorage !== 'undefined' ? localStorage : null;
      this.maxRetries = 3;
      this.retryDelay = 500;
    }

    /**
     * 安全的 JSON 序列化
     */
    _safeStringify(data) {
      try {
        return JSON.stringify(data);
      } catch (e) {
        console.error('StorageService: JSON stringify error', e);
        return '{}';
      }
    }

    /**
     * 安全的 JSON 解析
     */
    _safeParse(jsonStr) {
      if (jsonStr === null || jsonStr === undefined) {
        return {};
      }

      if (typeof jsonStr !== 'string') {
        return typeof jsonStr === 'object' ? jsonStr : {};
      }

      const trimmed = jsonStr.trim();
      if (!trimmed || (!trimmed.startsWith('{') && !trimmed.startsWith('['))) {
        return {};
      }

      try {
        return JSON.parse(trimmed);
      } catch (error) {
        console.error('StorageService: JSON parse error', error);
        return {};
      }
    }

    /**
     * 保存数据
     * @param {string} key - 存储键
     * @param {*} data - 要保存的数据
     * @param {object} options - 选项 { maxRetries, retryDelay }
     * @returns {Promise<boolean>} 是否保存成功
     */
    async save(key, data, options = {}) {
      if (!this.storage) {
        console.warn('StorageService: localStorage not available');
        return false;
      }

      const maxRetries = options.maxRetries || this.maxRetries;
      const retryDelay = options.retryDelay || this.retryDelay;
      const serialized = this._safeStringify(data);

      if (!serialized) {
        console.error('StorageService: Failed to serialize data');
        return false;
      }

      // 尝试保存
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          this.storage.setItem(key, serialized);
          
          // 验证保存是否成功
          const saved = this.storage.getItem(key);
          if (saved === serialized) {
            return true;
          }
        } catch (error) {
          console.warn(`StorageService: Save attempt ${attempt + 1} failed`, error);
          
          if (attempt < maxRetries - 1) {
            await this._delay(retryDelay);
          }
        }
      }

      // 所有重试都失败，尝试使用 sessionStorage 作为降级方案
      try {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem(key, serialized);
          console.warn('StorageService: Fallback to sessionStorage');
          return true;
        }
      } catch (e) {
        console.error('StorageService: Fallback also failed', e);
      }

      return false;
    }

    /**
     * 加载数据
     * @param {string} key - 存储键
     * @param {*} defaultValue - 默认值
     * @returns {Promise<*>} 加载的数据
     */
    async load(key, defaultValue = null) {
      if (!this.storage) {
        return defaultValue;
      }

      try {
        const jsonStr = this.storage.getItem(key);
        
        if (jsonStr === null || jsonStr === '') {
          return defaultValue;
        }

        const data = this._safeParse(jsonStr);
        return data !== null && typeof data === 'object' ? data : defaultValue;
      } catch (error) {
        console.error(`StorageService: Load error for key "${key}"`, error);
        return defaultValue;
      }
    }

    /**
     * 同步版本的保存（为了兼容现有代码）
     */
    saveSync(key, data, options = {}) {
      if (!this.storage) return false;

      const serialized = this._safeStringify(data);
      if (!serialized) return false;

      try {
        this.storage.setItem(key, serialized);
        return true;
      } catch (error) {
        console.error('StorageService: Save sync failed', error);
        return false;
      }
    }

    /**
     * 同步版本的加载（为了兼容现有代码）
     */
    loadSync(key, defaultValue = null) {
      if (!this.storage) return defaultValue;

      try {
        const jsonStr = this.storage.getItem(key);
        if (jsonStr === null || jsonStr === '') {
          return defaultValue;
        }
        return this._safeParse(jsonStr) || defaultValue;
      } catch (error) {
        console.error(`StorageService: Load sync error for key "${key}"`, error);
        return defaultValue;
      }
    }

    /**
     * 删除数据
     */
    remove(key) {
      if (!this.storage) return false;

      try {
        this.storage.removeItem(key);
        return true;
      } catch (error) {
        console.error(`StorageService: Remove error for key "${key}"`, error);
        return false;
      }
    }

    /**
     * 清空所有数据
     */
    clear() {
      if (!this.storage) return false;

      try {
        this.storage.clear();
        return true;
      } catch (error) {
        console.error('StorageService: Clear error', error);
        return false;
      }
    }

    /**
     * 延迟函数
     */
    _delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }

  // 单例模式
  let instance = null;

  function getInstance() {
    if (!instance) {
      instance = new StorageService();
    }
    return instance;
  }

  // 导出
  if (typeof window !== 'undefined' && window.OfferLaolao) {
    window.OfferLaolao.Services.StorageService = getInstance();
  }

  // 兼容旧代码：提供全局函数
  if (typeof window !== 'undefined') {
    // 这些函数将在后续重构中逐步替换
    window.saveDataToStorage = function(data, key) {
      return getInstance().saveSync(key, data);
    };

    window.loadDataFromStorage = function(key) {
      return getInstance().loadSync(key, {});
    };
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StorageService, getInstance };
  }
})(typeof window !== 'undefined' ? window : this);

