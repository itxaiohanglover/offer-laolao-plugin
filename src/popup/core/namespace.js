/**
 * 核心命名空间定义
 * 提供统一的命名空间，避免全局变量污染
 */
(function(global) {
  'use strict';

  // 创建主命名空间
  const OfferLaolao = {
    // 核心模块
    Core: {},
    // 服务模块（单例）
    Services: {},
    // 工厂模块
    Factories: {},
    // 策略模块
    Strategies: {},
    // 组件模块
    Components: {},
    // 处理器模块
    Handlers: {},
    // 工具模块
    Utils: {},
    // 配置
    Config: {},
    // 版本信息
    version: '1.0.0'
  };

  // 导出到全局（浏览器环境）
  if (typeof window !== 'undefined') {
    window.OfferLaolao = OfferLaolao;
  }

  // 导出到 Node.js 环境
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = OfferLaolao;
  }

  // 兼容旧代码：创建全局别名（逐步废弃）
  if (typeof window !== 'undefined') {
    // 这些将在后续重构中逐步移除
    window.OfferLaolao = OfferLaolao;
  }

  console.log('OfferLaolao namespace initialized');
})(typeof window !== 'undefined' ? window : this);

