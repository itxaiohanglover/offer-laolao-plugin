/**
 * 常量定义
 * 集中管理所有常量，避免硬编码
 */
(function(global) {
  'use strict';

  const Constants = {
    // 存储键名
    STORAGE_KEYS: {
      RESUME_DATA: 'resumeData',
      MODEL_SETTINGS: 'modelSettings',
      PARSE_SETTINGS: 'parseSettings',
      APP_SETTINGS: 'appSettings' // 兼容旧版本
    },

    // 通知类型
    NOTIFICATION_TYPES: {
      SUCCESS: 'success',
      ERROR: 'error',
      WARNING: 'warning',
      INFO: 'info'
    },

    // 通知默认时长（毫秒）
    NOTIFICATION_DURATION: {
      SUCCESS: 3000,
      ERROR: 5000,
      WARNING: 4000,
      INFO: 3000,
      SHORT: 2000
    },

    // 自动保存延迟（毫秒）
    AUTO_SAVE_DELAY: 300,

    // 防抖延迟（毫秒）
    DEBOUNCE_DELAY: {
      AUTO_SAVE: 300,
      SEARCH: 500,
      INPUT: 300
    },

    // 重试配置
    RETRY_CONFIG: {
      MAX_RETRIES: 3,
      DELAY: 500
    },

    // 动态项类型
    DYNAMIC_ITEM_TYPES: {
      SKILL: 'skill',
      EDUCATION: 'education',
      WORK_EXPERIENCE: 'workExperience',
      PROJECT: 'project',
      LANGUAGE: 'language',
      CUSTOM_FIELD: 'customField'
    },

    // 列表ID映射
    LIST_IDS: {
      SKILLS: 'skills-list',
      EDUCATION: 'education-list',
      WORK_EXPERIENCE: 'internship-list',
      PROJECTS: 'project-list',
      LANGUAGES: 'language-list',
      CUSTOM_FIELDS: 'custom-field-list'
    },

    // 字段ID映射
    FIELD_IDS: {
      // 基本信息
      NAME: 'name',
      GENDER: 'gender',
      BIRTH_DATE: 'birth-date',
      PHONE: 'phone',
      EMAIL: 'email',
      ID_CARD: 'id-card',
      LOCATION: 'location',
      POLITICAL_STATUS: 'political-status',
      // 求职期望
      EXPECTED_POSITION: 'expected-position',
      EXPECTED_INDUSTRY: 'expected-industry',
      EXPECTED_SALARY: 'expected-salary',
      EXPECTED_LOCATION: 'expected-location',
      INTERNSHIP_DURATION: 'internship-duration',
      AVAILABLE_TIME: 'available-time',
      // 自我描述
      SELF_INTRO: 'self-intro'
    },

    // 支持的文件类型
    SUPPORTED_FILE_TYPES: {
      JSON: ['.json', 'application/json'],
      PDF: ['.pdf', 'application/pdf'],
      DOCX: ['.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      DOC: ['.doc', 'application/msword'],
      TXT: ['.txt', 'text/plain']
    },

    // 内容脚本注入延迟（毫秒）
    CONTENT_SCRIPT_INJECT_DELAY: 800,

    // 字段填充模式提示
    FIELD_FILL_MODE_MESSAGES: {
      START: '请在网页中点击要填入 "{label}" 的位置，按 Esc 可取消',
      SUCCESS: '✓ 填充成功！',
      FAILED: '✗ 填充失败，请重试',
      CANCELLED: '已取消填充操作'
    },

    // 事件名称
    EVENTS: {
      // 表单事件
      FORM_CHANGED: 'form:changed',
      FORM_SAVED: 'form:saved',
      FORM_LOADED: 'form:loaded',
      FORM_RESET: 'form:reset',
      // 动态项事件
      ITEM_ADDED: 'item:added',
      ITEM_REMOVED: 'item:removed',
      ITEM_UPDATED: 'item:updated',
      // 字段填充事件
      FIELD_FILL_START: 'field:fill:start',
      FIELD_FILL_SUCCESS: 'field:fill:success',
      FIELD_FILL_FAILED: 'field:fill:failed',
      // 设置事件
      SETTINGS_CHANGED: 'settings:changed',
      SETTINGS_SAVED: 'settings:saved',
      // API 事件
      API_CALL_START: 'api:call:start',
      API_CALL_SUCCESS: 'api:call:success',
      API_CALL_FAILED: 'api:call:failed'
    }
  };

  // 导出
  if (typeof window !== 'undefined' && window.OfferLaolao) {
    window.OfferLaolao.Config = window.OfferLaolao.Config || {};
    window.OfferLaolao.Config.Constants = Constants;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Constants;
  }
})(typeof window !== 'undefined' ? window : this);

