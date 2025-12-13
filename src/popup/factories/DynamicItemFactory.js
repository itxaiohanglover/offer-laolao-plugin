/**
 * 动态项工厂（工厂模式）
 * 统一创建各种类型的动态表单项，消除代码重复
 */
(function(global) {
  'use strict';

  class DynamicItemFactory {
    /**
     * 创建动态项
     * @param {string} type - 类型：skill, education, workExperience, project, language, customField
     * @param {number} index - 项目索引
     * @param {object} options - 选项
     * @returns {HTMLElement} 动态项元素
     */
    static create(type, index, options = {}) {
      const config = this._getConfig(type);
      if (!config) {
        console.error(`DynamicItemFactory: Unknown type "${type}"`);
        return null;
      }

      const item = this._createBaseItem(type, index, config);
      this._attachCommonEvents(item, type, index, config);
      this._attachAutoSave(item);
      this._attachFieldFillButtons(item);

      return item;
    }

    /**
     * 获取配置
     */
    static _getConfig(type) {
      if (typeof window === 'undefined' || !window.OfferLaolao) {
        console.warn('OfferLaolao namespace not available, using fallback');
        return null;
      }

      const fieldConfig = window.OfferLaolao.Config?.FieldConfig;
      if (!fieldConfig || !fieldConfig.dynamic) {
        return null;
      }

      const typeMap = {
        skill: 'skill',
        education: 'education',
        workExperience: 'workExperience',
        work: 'workExperience',
        internship: 'workExperience',
        project: 'project',
        language: 'language',
        customField: 'customField',
        custom: 'customField'
      };

      const configKey = typeMap[type];
      return configKey ? fieldConfig.dynamic[configKey] : null;
    }

    /**
     * 创建基础项元素
     */
    static _createBaseItem(type, index, config) {
      const div = document.createElement('div');
      div.className = 'dynamic-item';
      div.style.position = 'relative';
      div.dataset.itemType = type;
      div.dataset.itemIndex = index;

      // 创建删除按钮
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.textContent = '删除';
      div.appendChild(removeBtn);

      // 创建表单字段
      const fieldsContainer = document.createElement('div');
      config.fields.forEach(field => {
        const fieldElement = this._createFieldElement(field, type, index);
        if (fieldElement) {
          fieldsContainer.appendChild(fieldElement);
        }
      });
      div.appendChild(fieldsContainer);

      return div;
    }

    /**
     * 创建字段元素
     */
    static _createFieldElement(field, type, index) {
      const formGroup = document.createElement('div');
      formGroup.className = 'form-group';

      // 创建标签
      if (field.label) {
        const label = document.createElement('label');
        label.textContent = field.label;
        formGroup.appendChild(label);
      }

      // 创建输入元素
      let input;
      if (field.type === 'select') {
        input = document.createElement('select');
        if (field.options && Array.isArray(field.options)) {
          field.options.forEach(option => {
            const optionEl = document.createElement('option');
            optionEl.value = option;
            optionEl.textContent = option || field.placeholder || '请选择';
            input.appendChild(optionEl);
          });
        }
      } else if (field.type === 'textarea') {
        input = document.createElement('textarea');
        if (field.placeholder) {
          input.placeholder = field.placeholder;
        }
      } else if (field.type === 'file') {
        input = document.createElement('input');
        input.type = 'file';
        if (field.accept) {
          input.accept = field.accept;
        }
        if (field.placeholder) {
          input.title = field.placeholder;
        }
      } else {
        input = document.createElement('input');
        input.type = field.type || 'text';
        if (field.placeholder) {
          input.placeholder = field.placeholder;
        }
      }

      // 设置 name 属性
      const namePattern = this._getNamePattern(type, field.name, index);
      input.name = namePattern;

      // 生成 ID（如果还没有）
      if (!input.id) {
        input.id = `${type}-${index}-${field.name}`.replace(/[\[\]]/g, '-');
      }

      formGroup.appendChild(input);

      // 处理内联布局（日期字段等）
      if (field.inline) {
        const wrapper = document.createElement('div');
        wrapper.className = 'form-group-inline';
        wrapper.appendChild(formGroup);
        return wrapper;
      }

      return formGroup;
    }

    /**
     * 生成 name 属性模式
     */
    static _getNamePattern(type, fieldName, index) {
      const typeMap = {
        skill: 'skills',
        education: 'education',
        workExperience: 'internship',
        work: 'internship',
        internship: 'internship',
        project: 'project',
        language: 'language',
        customField: 'custom',
        custom: 'custom'
      };

      const prefix = typeMap[type] || type;
      return `${prefix}[${index}][${fieldName}]`;
    }

    /**
     * 附加通用事件（删除按钮等）
     */
    static _attachCommonEvents(item, type, index, config) {
      const removeBtn = item.querySelector('.remove-btn');
      if (!removeBtn) return;

      const listId = config.listId;
      const minItems = config.minItems || 0;

      removeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        const parent = this.closest('.dynamic-item');
        const list = parent ? parent.parentNode : null;
        if (!parent || !list) return;

        // 检查是否为空
        const isEmpty = typeof isItemEmpty === 'function' 
          ? isItemEmpty(parent) 
          : this._isItemEmpty(parent);

        // 检查最小数量
        const itemCount = list.querySelectorAll('.dynamic-item').length;

        if (isEmpty || itemCount > minItems) {
          if (confirm('确定要删除此项吗？')) {
            list.removeChild(parent);
            
            // 更新索引
            if (typeof updateItemIndices === 'function') {
              updateItemIndices(listId);
            } else {
              this._updateItemIndices(list, listId);
            }

            // 触发事件
            if (window.OfferLaolao?.Core?.EventBus) {
              window.OfferLaolao.Core.EventBus.emit('item:removed', {
                type,
                index,
                listId
              });
            }

            // 自动保存
            if (typeof autoSaveFormData === 'function') {
              autoSaveFormData();
            } else if (window.OfferLaolao?.Services?.StorageService) {
              // 使用新架构的自动保存
              const formData = typeof collectFormData === 'function' 
                ? collectFormData() 
                : {};
              window.OfferLaolao.Services.StorageService.saveSync(
                window.OfferLaolao.Config.Constants.STORAGE_KEYS.RESUME_DATA,
                formData
              );
            }
          }
        } else {
          const notification = window.OfferLaolao?.Services?.NotificationService || 
                              (typeof showNotification === 'function' ? { show: showNotification } : null);
          if (notification) {
            notification.warning(`至少需要保留 ${minItems} 个非空项`);
          }
        }
      }.bind(this));
    }

    /**
     * 附加自动保存事件
     */
    static _attachAutoSave(item) {
      const inputs = item.querySelectorAll('input, select, textarea');
      const debouncedSave = typeof debouncedAutoSave === 'function' 
        ? debouncedAutoSave 
        : (typeof debounce === 'function' && typeof autoSaveFormData === 'function'
          ? debounce(autoSaveFormData, 300)
          : null);

      if (debouncedSave) {
        inputs.forEach(input => {
          if (input.type !== 'file' && input.type !== 'button' && input.type !== 'submit') {
            input.addEventListener('input', debouncedSave);
            input.addEventListener('change', debouncedSave);
          }
        });
      }
    }

    /**
     * 附加字段填充按钮
     */
    static _attachFieldFillButtons(item) {
      // 延迟执行，确保 DOM 已插入
      setTimeout(() => {
        if (typeof initDynamicItemFieldButtons === 'function') {
          initDynamicItemFieldButtons();
        }
        if (typeof attachFieldFillButtonListeners === 'function') {
          attachFieldFillButtonListeners();
        }
      }, 50);
    }

    /**
     * 检查项是否为空（备用方法）
     */
    static _isItemEmpty(item) {
      if (!item) return true;

      const inputs = item.querySelectorAll('input, select, textarea');
      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        if (input.type === 'file') {
          if (input.files && input.files.length > 0) {
            return false;
          }
          continue;
        }
        const value = input.value;
        if (value !== null && value !== undefined && value !== '') {
          return false;
        }
      }
      return true;
    }

    /**
     * 更新项索引（备用方法）
     */
    static _updateItemIndices(list, listId) {
      if (!list) return;

      const items = list.querySelectorAll('.dynamic-item');
      items.forEach((item, newIndex) => {
        const inputs = item.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
          if (input.name) {
            input.name = input.name.replace(/\[(\d+)\]/, `[${newIndex}]`);
          }
        });
        item.dataset.itemIndex = newIndex;
      });
    }
  }

  // 导出
  if (typeof window !== 'undefined' && window.OfferLaolao) {
    window.OfferLaolao.Factories = window.OfferLaolao.Factories || {};
    window.OfferLaolao.Factories.DynamicItemFactory = DynamicItemFactory;
  }

  // 兼容旧代码：提供全局函数
  if (typeof window !== 'undefined') {
    // 这些函数将在后续重构中逐步替换
    window.createSkillItem = function(index) {
      return DynamicItemFactory.create('skill', index);
    };
    window.createEducationItem = function(index) {
      return DynamicItemFactory.create('education', index);
    };
    window.createWorkExperienceItem = function(index) {
      return DynamicItemFactory.create('workExperience', index);
    };
    window.createProjectItem = function(index) {
      return DynamicItemFactory.create('project', index);
    };
    window.createLanguageItem = function(index) {
      return DynamicItemFactory.create('language', index);
    };
    window.createCustomFieldItem = function(index) {
      return DynamicItemFactory.create('customField', index);
    };
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = DynamicItemFactory;
  }
})(typeof window !== 'undefined' ? window : this);

