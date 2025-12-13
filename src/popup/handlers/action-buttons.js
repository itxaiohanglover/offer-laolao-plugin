// 操作按钮处理器模块
// 处理保存、重置、导出、自动填写等操作按钮
// 已迁移到新架构：使用 StorageService、NotificationService 和 EventBus

/**
 * 获取通知服务（统一辅助函数）
 * @returns {Function} 通知函数
 */
function getNotificationService() {
  const notification = window.OfferLaolao?.Services?.NotificationService;
  return notification 
    ? (msg, type) => notification.show(msg, type)
    : (typeof showNotification === 'function' ? showNotification : () => {});
}

/**
 * 初始化操作按钮
 */
function initActionButtons() {
  console.log("Initializing action buttons");

  // 使用新架构的服务
  const storage = window.OfferLaolao?.Services?.StorageService;
  const EventBus = window.OfferLaolao?.Core?.EventBus;
  const Constants = window.OfferLaolao?.Config?.Constants;
  const showNotify = getNotificationService();

  // 保存简历按钮
  var saveResumeBtn = document.getElementById("save-resume");
  if (saveResumeBtn) {
    saveResumeBtn.addEventListener("click", function () {
      if (typeof autoSaveFormData === 'function') {
        autoSaveFormData();
      }
      showNotify("简历已保存", "success");
      
      // 触发事件
      if (EventBus) {
        EventBus.emit('form:saved', { manual: true });
      }
    });
  }

  // 重置简历按钮
  var resetResumeBtn = document.getElementById("reset-resume");
  if (resetResumeBtn) {
    resetResumeBtn.addEventListener("click", function () {
      if (confirm("确定要重置所有简历数据吗？此操作不可恢复。")) {
        const storageKey = Constants?.STORAGE_KEYS?.RESUME_DATA || 'resumeData';
        
        // 使用新架构的存储服务
        if (storage) {
          storage.remove(storageKey);
        } else {
          // 兼容旧代码
          if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(storageKey);
          }
        }
        
        var inputs = document.querySelectorAll("input, select, textarea");
        for (var i = 0; i < inputs.length; i++) {
          inputs[i].value = "";
        }
        
        showNotify("简历数据已重置", "success");
        
        // 触发事件
        if (EventBus) {
          EventBus.emit('form:reset', {});
        }
      }
    });
  }

  // 导出简历按钮 - 显示导出格式选择弹窗
  var exportResumeBtn = document.getElementById("export-resume");
  if (exportResumeBtn) {
    exportResumeBtn.addEventListener("click", function () {
      showExportFormatDialog();
    });
  }

  // AI 优化简历按钮
  var optimizeResumeBtn = document.getElementById("optimize-resume");
  if (optimizeResumeBtn) {
    optimizeResumeBtn.addEventListener("click", function () {
      showOptimizeDialog();
    });
  }

  // 智能预填按钮
  var fillCurrentPageBtn = document.getElementById("fill-current-page");
  if (fillCurrentPageBtn) {
    fillCurrentPageBtn.addEventListener("click", function () {
      startSmartFill();
    });
  }

  // 保存设置按钮
  var saveSettingsBtn = document.getElementById("save-settings");
  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener("click", function () {
      saveAllSettings();
      showNotify("设置已保存", "success");
      
      // 触发事件
      if (EventBus) {
        EventBus.emit('settings:saved', {});
      }
    });
  }

  // 初始化模型设置相关功能
  initModelSettings();

  // 初始化设置页面的自动保存功能
  initSettingsAutoSave();

  console.log("Action buttons initialization completed");
}

/**
 * 初始化设置页面的自动保存功能
 */
function initSettingsAutoSave() {
  // 使用事件委托，监听设置页面的所有输入框和选择框
  var settingsContent = document.getElementById("settings-content");
  if (settingsContent) {
    // 为所有输入框添加自动保存监听
    settingsContent.addEventListener(
      "input",
      function (e) {
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
          // 延迟保存，避免频繁保存
          if (e.target._saveTimer) {
            clearTimeout(e.target._saveTimer);
          }
          e.target._saveTimer = setTimeout(function () {
            saveSettingsAuto();
          }, 1000);
        }
      },
      true
    );

    // 监听选择框变化
    settingsContent.addEventListener(
      "change",
      function (e) {
        if (e.target.tagName === "SELECT") {
          saveSettingsAuto();
        }
      },
      true
    );

    settingsContent.addEventListener(
      "blur",
      function (e) {
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
          // 失去焦点时立即保存
          if (e.target._saveTimer) {
            clearTimeout(e.target._saveTimer);
          }
          saveSettingsAuto();
        }
      },
      true
    );
  }
}

/**
 * 自动保存设置
 */
function saveSettingsAuto() {
  saveAllSettings();
  console.log("设置已自动保存");
}

/**
 * 保存所有设置
 * 已迁移到新架构：使用 StorageService
 */
function saveAllSettings() {
  // 使用新架构的存储服务
  const storage = window.OfferLaolao?.Services?.StorageService;
  const Constants = window.OfferLaolao?.Config?.Constants;
  const EventBus = window.OfferLaolao?.Core?.EventBus;
  
  // 兼容旧代码
  const saveData = storage 
    ? (data, key) => storage.saveSync(key, data)
    : (typeof saveDataToStorage === 'function' ? saveDataToStorage : () => false);

  // 保存模型配置
  var providerSelect = document.getElementById("model-provider");
  var modelSelect = document.getElementById("model-select");
  var modelKeyInput = document.getElementById("model-api-key");
  var customUrlInput = document.getElementById("model-custom-url");

  var modelSettings = {
    provider: providerSelect ? providerSelect.value : "deepseek",
    model: modelSelect ? modelSelect.value : "",
    apiKey: modelKeyInput ? modelKeyInput.value : "",
    customUrl: customUrlInput ? customUrlInput.value : "",
  };

  // 保存简历解析配置
  var parseUrlInput = document.getElementById("parse-api-url");
  var parseAppCodeInput = document.getElementById("parse-app-code");

  var parseSettings = {
    url: parseUrlInput ? parseUrlInput.value : "",
    appCode: parseAppCodeInput ? parseAppCodeInput.value : "",
  };

  // 分别保存两种配置
  const modelSettingsKey = Constants?.STORAGE_KEYS?.MODEL_SETTINGS || 'modelSettings';
  const parseSettingsKey = Constants?.STORAGE_KEYS?.PARSE_SETTINGS || 'parseSettings';
  
  saveData(modelSettings, modelSettingsKey);
  saveData(parseSettings, parseSettingsKey);
  
  // 触发设置变更事件
  if (EventBus) {
    EventBus.emit('settings:changed', { modelSettings, parseSettings });
  }

  // 同时保存到 chrome.storage.local 供 background script 使用
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    chrome.storage.local.set({ modelSettings: modelSettings }, function () {
      console.log("模型配置已同步到 chrome.storage");
    });
  }
}

/**
 * 初始化模型设置相关功能
 */
function initModelSettings() {
  var providerSelect = document.getElementById("model-provider");
  var modelSelect = document.getElementById("model-select");
  var customUrlGroup = document.getElementById("custom-url-group");
  var testBtn = document.getElementById("test-model-connection");
  var testResult = document.getElementById("model-test-result");

  // 加载已保存的设置
  loadModelSettings();

  // 监听提供商选择变化
  if (providerSelect) {
    providerSelect.addEventListener("change", function () {
      updateModelOptions(this.value);
      // 显示/隐藏自定义 URL 输入框
      if (customUrlGroup) {
        customUrlGroup.style.display =
          this.value === "custom" ? "block" : "none";
      }
      // 自动保存
      saveSettingsAuto();
    });
  }

  // 监听模型选择变化
  if (modelSelect) {
    modelSelect.addEventListener("change", function () {
      saveSettingsAuto();
    });
  }

  // 测试连接按钮
  if (testBtn) {
    testBtn.addEventListener("click", async function () {
      testBtn.disabled = true;
      testBtn.textContent = "⏳ 测试中...";

      if (testResult) {
        testResult.style.display = "block";
        testResult.style.background = "#f0f0f0";
        testResult.style.color = "#666";
        testResult.textContent = "正在测试连接...";
      }

      try {
        // 先保存当前设置
        saveAllSettings();

        // 调用测试函数
        var result;
        if (typeof testModelConnection === "function") {
          result = await testModelConnection();
        } else if (
          typeof window !== "undefined" &&
          typeof window.testModelConnection === "function"
        ) {
          result = await window.testModelConnection();
        } else {
          result = { success: false, message: "测试功能未加载" };
        }

        if (testResult) {
          if (result.success) {
            testResult.style.background = "#f6ffed";
            testResult.style.color = "#52c41a";
            testResult.innerHTML =
              "✅ " +
              result.message +
              "<br><small>响应: " +
              (result.response || "").substring(0, 50) +
              "</small>";
          } else {
            testResult.style.background = "#fff2f0";
            testResult.style.color = "#ff4d4f";
            testResult.textContent = "❌ " + result.message;
          }
        }
      } catch (error) {
        if (testResult) {
          testResult.style.background = "#fff2f0";
          testResult.style.color = "#ff4d4f";
          testResult.textContent = "❌ 测试失败: " + error.message;
        }
      } finally {
        testBtn.disabled = false;
        testBtn.textContent = "🔗 测试连接";
      }
    });
  }
}

/**
 * 加载模型设置
 * 已迁移到新架构：使用 StorageService
 */
function loadModelSettings() {
  // 使用新架构的存储服务
  const storage = window.OfferLaolao?.Services?.StorageService;
  const Constants = window.OfferLaolao?.Config?.Constants;
  
  // 兼容旧代码
  const loadData = storage 
    ? (key) => storage.loadSync(key, {})
    : (typeof loadDataFromStorage === 'function' ? loadDataFromStorage : () => ({}));
  const saveData = storage 
    ? (data, key) => storage.saveSync(key, data)
    : (typeof saveDataToStorage === 'function' ? saveDataToStorage : () => false);

  // 先从存储加载
  const modelSettingsKey = Constants?.STORAGE_KEYS?.MODEL_SETTINGS || 'modelSettings';
  var settings = loadData(modelSettingsKey);
  if (!settings || typeof settings !== "object") {
    settings = { provider: "deepseek", model: "", apiKey: "", customUrl: "" };
  }

  // 应用设置到 UI
  applyModelSettingsToUI(settings);

  // 同时从 chrome.storage.local 加载并同步
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(["modelSettings"], function (result) {
      if (result.modelSettings) {
        // 如果 chrome.storage 有更新的设置，使用它
        var chromeSettings = result.modelSettings;
        if (chromeSettings.apiKey || chromeSettings.model) {
          applyModelSettingsToUI(chromeSettings);
          // 同步到存储
          saveData(chromeSettings, modelSettingsKey);
        }
      } else if (settings.apiKey) {
        // 如果 chrome.storage 没有设置但 localStorage 有，同步过去
        chrome.storage.local.set({ modelSettings: settings });
      }
    });
  }
}

/**
 * 应用模型设置到 UI
 */
function applyModelSettingsToUI(settings) {
  var providerSelect = document.getElementById("model-provider");
  var modelKeyInput = document.getElementById("model-api-key");
  var customUrlInput = document.getElementById("model-custom-url");
  var customUrlGroup = document.getElementById("custom-url-group");

  // 设置提供商
  if (providerSelect && settings.provider) {
    providerSelect.value = settings.provider;
    // 更新模型选项
    updateModelOptions(settings.provider, settings.model);
  }

  // 设置 API Key
  if (modelKeyInput && settings.apiKey) {
    modelKeyInput.value = settings.apiKey;
  }

  // 设置自定义 URL
  if (customUrlInput && settings.customUrl) {
    customUrlInput.value = settings.customUrl;
  }

  // 显示/隐藏自定义 URL 输入框
  if (customUrlGroup) {
    customUrlGroup.style.display =
      settings.provider === "custom" ? "block" : "none";
  }
}

/**
 * 更新模型选项
 * @param {string} providerId - 提供商 ID
 * @param {string} selectedModel - 已选择的模型
 */
function updateModelOptions(providerId, selectedModel) {
  var modelSelect = document.getElementById("model-select");
  if (!modelSelect) return;

  // 清空现有选项
  modelSelect.innerHTML = "";

  // 获取模型列表
  var models = [];
  if (typeof getModelsByProvider === "function") {
    models = getModelsByProvider(providerId);
  } else if (
    typeof window !== "undefined" &&
    typeof window.getModelsByProvider === "function"
  ) {
    models = window.getModelsByProvider(providerId);
  }

  if (providerId === "custom") {
    // 自定义模式，添加一个输入提示
    var option = document.createElement("option");
    option.value = selectedModel || "";
    option.textContent = selectedModel || "请在下方输入模型名称";
    modelSelect.appendChild(option);

    // 让下拉框可编辑（通过添加一个输入框）
    modelSelect.style.display = "none";

    // 检查是否已有自定义模型输入框
    var customModelInput = document.getElementById("custom-model-input");
    if (!customModelInput) {
      customModelInput = document.createElement("input");
      customModelInput.type = "text";
      customModelInput.id = "custom-model-input";
      customModelInput.placeholder = "请输入模型名称（如 gpt-4）";
      customModelInput.style.cssText =
        "width: 95%; padding: 8px; margin-top: 5px;";
      customModelInput.value = selectedModel || "";
      modelSelect.parentNode.insertBefore(
        customModelInput,
        modelSelect.nextSibling
      );

      customModelInput.addEventListener("input", function () {
        modelSelect.value = this.value;
        saveSettingsAuto();
      });
    } else {
      customModelInput.style.display = "block";
      customModelInput.value = selectedModel || "";
    }
  } else {
    // 隐藏自定义模型输入框
    var customModelInput = document.getElementById("custom-model-input");
    if (customModelInput) {
      customModelInput.style.display = "none";
    }
    modelSelect.style.display = "block";

    if (models.length === 0) {
      var option = document.createElement("option");
      option.value = "";
      option.textContent = "暂无可用模型";
      modelSelect.appendChild(option);
    } else {
      models.forEach(function (model) {
        var option = document.createElement("option");
        option.value = model.id;
        option.textContent = model.name;
        if (model.id === selectedModel) {
          option.selected = true;
        }
        modelSelect.appendChild(option);
      });
    }
  }
}

/**
 * 确保 content script 已注入
 * 已迁移到新架构：使用 NotificationService
 */
function withContentScript(tabId, callback) {
  if (!tabId) {
    const notification = window.OfferLaolao?.Services?.NotificationService;
    const showNotify = notification 
      ? (msg, type) => notification.error(msg)
      : (typeof showNotification === 'function' ? showNotification : () => {});
    showNotify("未找到有效的标签页", "error");
    return;
  }

  try {
    chrome.tabs.sendMessage(tabId, { action: "ping" }, function (response) {
      if (chrome.runtime.lastError) {
        injectContentScript(tabId, callback);
      } else if (typeof callback === "function") {
        callback();
      }
    });
  } catch (error) {
    console.error("Error ensuring content script:", error);
    const notification = window.OfferLaolao?.Services?.NotificationService;
    const showNotify = notification 
      ? (msg, type) => notification.error(msg)
      : (typeof showNotification === 'function' ? showNotification : () => {});
    showNotify("无法连接到页面，请刷新页面后重试", "error");
  }
}

/**
 * 注入 content script
 */
function injectContentScript(tabId, callback) {
  if (chrome.scripting && chrome.scripting.executeScript) {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        files: ["src/content/content.js"],
      },
      function () {
        if (chrome.runtime.lastError) {
          console.error("Error injecting script:", chrome.runtime.lastError);
          getNotificationService()("无法注入脚本，请刷新页面后重试", "error");
        } else if (typeof callback === "function") {
          setTimeout(callback, 300);
        }
      }
    );
    } else {
      const notification = window.OfferLaolao?.Services?.NotificationService;
      const showNotify = notification 
        ? (msg, type) => notification.error(msg)
        : (typeof showNotification === 'function' ? showNotification : () => {});
      showNotify("请刷新页面后重试", "error");
    }
}

/**
 * 显示导出格式选择弹窗
 */
function showExportFormatDialog() {
  // 移除已存在的弹窗
  var existingDialog = document.getElementById("export-format-dialog");
  if (existingDialog) {
    existingDialog.remove();
  }

  // 创建弹窗遮罩层
  var overlay = document.createElement("div");
  overlay.id = "export-format-dialog";
  overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;

  // 创建弹窗内容
  var dialog = document.createElement("div");
  dialog.style.cssText = `
        background: white;
        border-radius: 8px;
        padding: 24px;
        width: 320px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    `;

  dialog.innerHTML = `
        <h3 style="margin: 0 0 20px 0; color: #333; font-size: 18px; text-align: center;">
            选择导出格式
        </h3>
        <div style="display: flex; flex-direction: column; gap: 12px;">
            <button id="export-json-btn" style="
                padding: 14px 20px;
                background: linear-gradient(135deg, #1890ff, #096dd9);
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                transition: transform 0.2s, box-shadow 0.2s;
            ">
                <span style="font-size: 18px;">📄</span>
                <span>
                    <strong>导出为 JSON</strong>
                    <br>
                    <small style="opacity: 0.9;">可用于数据备份和导入</small>
                </span>
            </button>
            <button id="export-latex-btn" style="
                padding: 14px 20px;
                background: linear-gradient(135deg, #52c41a, #389e0d);
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                transition: transform 0.2s, box-shadow 0.2s;
            ">
                <span style="font-size: 18px;">📝</span>
                <span>
                    <strong>导出为 LaTeX</strong>
                    <br>
                    <small style="opacity: 0.9;">可在 Overleaf 上编辑打印</small>
                </span>
            </button>
            <button id="export-ai-intro-btn" style="
                padding: 14px 20px;
                background: linear-gradient(135deg, #ec4899, #d946ef);
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                transition: transform 0.2s, box-shadow 0.2s;
                position: relative;
                overflow: hidden;
            ">
                <span style="font-size: 18px;">🤖</span>
                <span>
                    <strong>AI 生成简历介绍</strong>
                    <br>
                    <small style="opacity: 0.9;">智能生成专业自我介绍</small>
                </span>
            </button>
            <button id="export-prompt-md-btn" style="
                padding: 14px 20px;
                background: linear-gradient(135deg, #8b5cf6, #6366f1);
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                transition: transform 0.2s, box-shadow 0.2s;
            ">
                <span style="font-size: 18px;">🔖</span>
                <span>
                    <strong>导出提示词 (.md)</strong>
                    <br>
                    <small style="opacity: 0.9;">结构化简历介绍提示词</small>
                </span>
            </button>
            <button id="export-prompt-txt-btn" style="
                padding: 14px 20px;
                background: linear-gradient(135deg, #faad14, #f59e0b);
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                transition: transform 0.2s, box-shadow 0.2s;
            ">
                <span style="font-size: 18px;">📜</span>
                <span>
                    <strong>导出提示词 (.txt)</strong>
                    <br>
                    <small style="opacity: 0.9;">通用文本格式</small>
                </span>
            </button>
        </div>
        <button id="export-cancel-btn" style="
            margin-top: 16px;
            padding: 10px;
            background: #f0f0f0;
            color: #666;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            width: 100%;
            transition: background 0.2s;
        ">
            取消
        </button>
    `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  // 添加按钮悬停效果
  var jsonBtn = document.getElementById("export-json-btn");
  var latexBtn = document.getElementById("export-latex-btn");
  var aiIntroBtn = document.getElementById("export-ai-intro-btn");
  var promptMdBtn = document.getElementById("export-prompt-md-btn");
  var promptTxtBtn = document.getElementById("export-prompt-txt-btn");
  var cancelBtn = document.getElementById("export-cancel-btn");

  jsonBtn.addEventListener("mouseenter", function () {
    this.style.transform = "scale(1.02)";
    this.style.boxShadow = "0 4px 12px rgba(24, 144, 255, 0.4)";
  });
  jsonBtn.addEventListener("mouseleave", function () {
    this.style.transform = "scale(1)";
    this.style.boxShadow = "none";
  });

  latexBtn.addEventListener("mouseenter", function () {
    this.style.transform = "scale(1.02)";
    this.style.boxShadow = "0 4px 12px rgba(82, 196, 26, 0.4)";
  });
  latexBtn.addEventListener("mouseleave", function () {
    this.style.transform = "scale(1)";
    this.style.boxShadow = "none";
  });

  aiIntroBtn.addEventListener("mouseenter", function () {
    this.style.transform = "scale(1.02)";
    this.style.boxShadow = "0 4px 12px rgba(236, 72, 153, 0.4)";
  });
  aiIntroBtn.addEventListener("mouseleave", function () {
    this.style.transform = "scale(1)";
    this.style.boxShadow = "none";
  });

  promptMdBtn.addEventListener("mouseenter", function () {
    this.style.transform = "scale(1.02)";
    this.style.boxShadow = "0 4px 12px rgba(99, 102, 241, 0.4)";
  });
  promptMdBtn.addEventListener("mouseleave", function () {
    this.style.transform = "scale(1)";
    this.style.boxShadow = "none";
  });

  promptTxtBtn.addEventListener("mouseenter", function () {
    this.style.transform = "scale(1.02)";
    this.style.boxShadow = "0 4px 12px rgba(250, 173, 20, 0.4)";
  });
  promptTxtBtn.addEventListener("mouseleave", function () {
    this.style.transform = "scale(1)";
    this.style.boxShadow = "none";
  });

  cancelBtn.addEventListener("mouseenter", function () {
    this.style.background = "#e0e0e0";
  });
  cancelBtn.addEventListener("mouseleave", function () {
    this.style.background = "#f0f0f0";
  });

  // 导出 JSON
  jsonBtn.addEventListener("click", function () {
    overlay.remove();
    exportAsJSON();
  });

  // 导出 LaTeX
  latexBtn.addEventListener("click", function () {
    overlay.remove();
    exportAsLatex();
  });

  // AI 生成简历介绍
  aiIntroBtn.addEventListener("click", function () {
    overlay.remove();
    showAIIntroGenerateDialog();
  });

  promptMdBtn.addEventListener("click", function () {
    overlay.remove();
    var resumeData = collectFormData();
    if (typeof exportResumePromptAsMarkdown === "function") {
      exportResumePromptAsMarkdown(resumeData);
    } else if (
      typeof window !== "undefined" &&
      typeof window.exportResumePromptAsMarkdown === "function"
    ) {
      window.exportResumePromptAsMarkdown(resumeData);
    } else {
      getNotificationService()("提示词导出功能未加载，请刷新页面重试", "error");
    }
  });

  promptTxtBtn.addEventListener("click", function () {
    overlay.remove();
    var resumeData = collectFormData();
    if (typeof exportResumePromptAsText === "function") {
      exportResumePromptAsText(resumeData);
    } else if (
      typeof window !== "undefined" &&
      typeof window.exportResumePromptAsText === "function"
    ) {
      window.exportResumePromptAsText(resumeData);
    } else {
      getNotificationService()("提示词导出功能未加载，请刷新页面重试", "error");
    }
  });

  // 取消
  cancelBtn.addEventListener("click", function () {
    overlay.remove();
  });

  // 点击遮罩层关闭
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
}

/**
 * 导出为 JSON 格式
 */
function exportAsJSON() {
  var resumeData = collectFormData();
  var jsonStr = safeJSONStringify(resumeData);

  var blob = new Blob([jsonStr], { type: "application/json" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "resume_data_" + new Date().toISOString().slice(0, 10) + ".json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

      getNotificationService()("JSON 简历数据已导出", "success");
}

/**
 * 导出为 LaTeX 格式
 */
function exportAsLatex() {
  var resumeData = collectFormData();

  // 检查 exportResumeToLatex 函数是否可用
  if (typeof exportResumeToLatex === "function") {
    exportResumeToLatex(resumeData);
  } else if (
    typeof window !== "undefined" &&
    typeof window.exportResumeToLatex === "function"
  ) {
    window.exportResumeToLatex(resumeData);
  } else {
    console.error("exportResumeToLatex function not found");
    getNotificationService()("LaTeX 导出功能未加载，请刷新页面重试", "error");
  }
}

/**
 * 显示 AI 优化简历对话框
 */
function showOptimizeDialog() {
  // 检查是否配置了 API
  var config = null;
  if (typeof getModelConfig === "function") {
    config = getModelConfig();
  } else if (
    typeof window !== "undefined" &&
    typeof window.getModelConfig === "function"
  ) {
    config = window.getModelConfig();
  }

  if (!config || !config.apiKey) {
    getNotificationService()("请先在设置中配置 AI 模型 API Key", "warning");
    // 切换到设置页面
    var settingsTab = document.getElementById("mode-settings");
    if (settingsTab) {
      settingsTab.click();
    }
    return;
  }

  // 收集当前表单数据
  var resumeData = collectFormData();
  var personalInfo = resumeData.personalInfo || {};

  // 检查是否有可优化的内容
  var hasContent = false;
  if (personalInfo["self-intro"] && personalInfo["self-intro"].trim()) {
    hasContent = true;
  }
  if (resumeData.workExperience && resumeData.workExperience.length > 0) {
    resumeData.workExperience.forEach(function (work) {
      var descKey = Object.keys(work).find(function (k) {
        return k.includes("description");
      });
      if (descKey && work[descKey] && work[descKey].trim()) {
        hasContent = true;
      }
    });
  }
  if (resumeData.projects && resumeData.projects.length > 0) {
    resumeData.projects.forEach(function (project) {
      var descKey = Object.keys(project).find(function (k) {
        return k.includes("desc") || k.includes("description");
      });
      var respKey = Object.keys(project).find(function (k) {
        return k.includes("responsibilities");
      });
      if (
        (descKey && project[descKey] && project[descKey].trim()) ||
        (respKey && project[respKey] && project[respKey].trim())
      ) {
        hasContent = true;
      }
    });
  }

  if (!hasContent) {
    getNotificationService()(
      "请先填写简历的描述性内容（自我介绍、工作描述、项目描述等）",
      "warning"
    );
    return;
  }

  // 移除已存在的弹窗
  var existingDialog = document.getElementById("optimize-dialog");
  if (existingDialog) {
    existingDialog.remove();
  }

  // 创建弹窗遮罩层
  var overlay = document.createElement("div");
  overlay.id = "optimize-dialog";
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  `;

  // 创建弹窗内容
  var dialog = document.createElement("div");
  dialog.style.cssText = `
    background: white;
    border-radius: 12px;
    padding: 24px;
    width: 360px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  `;

  dialog.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <div style="font-size: 48px; margin-bottom: 12px;">✨</div>
      <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 20px;">
        AI 一键优化简历
      </h3>
      <p style="margin: 0; color: #6b7280; font-size: 14px;">
        使用 AI 智能优化您的简历内容
      </p>
    </div>
    
    <div id="optimize-preview" style="
      background: #f9fafb;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 20px;
      max-height: 200px;
      overflow-y: auto;
    ">
      <p style="margin: 0 0 12px 0; color: #374151; font-size: 14px; font-weight: 600;">
        将优化以下内容：
      </p>
      <ul id="optimize-items-list" style="
        margin: 0;
        padding-left: 20px;
        color: #6b7280;
        font-size: 13px;
        line-height: 1.8;
      "></ul>
    </div>
    
    <div id="optimize-progress" style="display: none; margin-bottom: 20px;">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
        <div class="spinner" style="
          width: 20px;
          height: 20px;
          border: 2px solid #e5e7eb;
          border-top-color: #2b5797;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        "></div>
        <span id="optimize-status" style="color: #374151; font-size: 14px;">正在优化...</span>
      </div>
      <div style="background: #e5e7eb; border-radius: 4px; height: 8px; overflow: hidden;">
        <div id="optimize-progress-bar" style="
          background: linear-gradient(135deg, #2b5797, #4a90d9);
          height: 100%;
          width: 0%;
          transition: width 0.3s ease;
        "></div>
      </div>
      <p id="optimize-current-task" style="
        margin: 8px 0 0 0;
        color: #6b7280;
        font-size: 12px;
      "></p>
    </div>
    
    <div id="optimize-result" style="display: none; margin-bottom: 20px;">
      <div style="
        background: #f0fdf4;
        border: 1px solid #86efac;
        border-radius: 8px;
        padding: 16px;
        text-align: center;
      ">
        <div style="font-size: 32px; margin-bottom: 8px;">🎉</div>
        <p style="margin: 0; color: #166534; font-weight: 600;">优化完成！</p>
        <p id="optimize-summary" style="margin: 8px 0 0 0; color: #15803d; font-size: 13px;"></p>
      </div>
    </div>
    
    <div id="optimize-buttons" style="display: flex; gap: 12px;">
      <button id="start-optimize-btn" style="
        flex: 1;
        padding: 12px 20px;
        background: linear-gradient(135deg, #2b5797, #4a90d9);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 15px;
        font-weight: 500;
        transition: transform 0.2s, box-shadow 0.2s;
      ">
        🚀 开始优化
      </button>
      <button id="cancel-optimize-btn" style="
        padding: 12px 20px;
        background: #f3f4f6;
        color: #374151;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 15px;
        transition: background 0.2s;
      ">
        取消
      </button>
    </div>
    
    <style>
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>
  `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  // 填充待优化项目列表
  var itemsList = document.getElementById("optimize-items-list");
  var itemCount = 0;

  if (personalInfo["self-intro"] && personalInfo["self-intro"].trim()) {
    var li = document.createElement("li");
    li.textContent = "自我介绍";
    itemsList.appendChild(li);
    itemCount++;
  }

  if (resumeData.workExperience && resumeData.workExperience.length > 0) {
    resumeData.workExperience.forEach(function (work, index) {
      var descKey = Object.keys(work).find(function (k) {
        return k.includes("description");
      });
      if (descKey && work[descKey] && work[descKey].trim()) {
        var companyKey = Object.keys(work).find(function (k) {
          return k.includes("company");
        });
        var li = document.createElement("li");
        li.textContent =
          "工作经历 " +
          (index + 1) +
          (companyKey && work[companyKey] ? " - " + work[companyKey] : "");
        itemsList.appendChild(li);
        itemCount++;
      }
    });
  }

  if (resumeData.projects && resumeData.projects.length > 0) {
    resumeData.projects.forEach(function (project, index) {
      var descKey = Object.keys(project).find(function (k) {
        return k.includes("desc") || k.includes("description");
      });
      var respKey = Object.keys(project).find(function (k) {
        return k.includes("responsibilities");
      });
      var nameKey = Object.keys(project).find(function (k) {
        return k.includes("name") || k.includes("project-name");
      });
      var projectName =
        nameKey && project[nameKey] ? project[nameKey] : "项目 " + (index + 1);

      if (descKey && project[descKey] && project[descKey].trim()) {
        var li = document.createElement("li");
        li.textContent = "项目描述 - " + projectName;
        itemsList.appendChild(li);
        itemCount++;
      }
      if (respKey && project[respKey] && project[respKey].trim()) {
        var li = document.createElement("li");
        li.textContent = "项目职责 - " + projectName;
        itemsList.appendChild(li);
        itemCount++;
      }
    });
  }

  // 按钮事件
  var startBtn = document.getElementById("start-optimize-btn");
  var cancelBtn = document.getElementById("cancel-optimize-btn");
  var progressDiv = document.getElementById("optimize-progress");
  var previewDiv = document.getElementById("optimize-preview");
  var resultDiv = document.getElementById("optimize-result");
  var buttonsDiv = document.getElementById("optimize-buttons");

  startBtn.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-2px)";
    this.style.boxShadow = "0 4px 12px rgba(43, 87, 151, 0.4)";
  });
  startBtn.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0)";
    this.style.boxShadow = "none";
  });

  cancelBtn.addEventListener("mouseenter", function () {
    this.style.background = "#e5e7eb";
  });
  cancelBtn.addEventListener("mouseleave", function () {
    this.style.background = "#f3f4f6";
  });

  // 开始优化
  startBtn.addEventListener("click", async function () {
    previewDiv.style.display = "none";
    progressDiv.style.display = "block";
    startBtn.disabled = true;
    startBtn.style.opacity = "0.6";
    startBtn.style.cursor = "not-allowed";
    cancelBtn.style.display = "none";

    var progressBar = document.getElementById("optimize-progress-bar");
    var statusText = document.getElementById("optimize-status");
    var currentTaskText = document.getElementById("optimize-current-task");

    try {
      var optimizeFunc =
        typeof optimizeEntireResume === "function"
          ? optimizeEntireResume
          : window.optimizeEntireResume || null;

      if (!optimizeFunc) {
        throw new Error("优化功能未加载，请刷新页面重试");
      }

      var optimizedData = await optimizeFunc(resumeData, function (progress) {
        var percent = Math.round((progress.current / progress.total) * 100);
        progressBar.style.width = percent + "%";
        statusText.textContent =
          "正在优化 (" + progress.current + "/" + progress.total + ")";
        currentTaskText.textContent =
          progress.status === "processing"
            ? "正在处理: " + progress.currentTask
            : progress.status === "completed"
            ? "已完成: " + progress.currentTask
            : "";
      });

      // 优化完成，填充表单
      if (typeof fillFormWithParsedData === "function") {
        fillFormWithParsedData(optimizedData);
      } else if (window.fillFormWithParsedData) {
        window.fillFormWithParsedData(optimizedData);
      }

      // 显示完成结果
      progressDiv.style.display = "none";
      resultDiv.style.display = "block";
      document.getElementById("optimize-summary").textContent =
        "已成功优化 " + itemCount + " 项内容，数据已自动填充到表单";

      // 更新按钮
      buttonsDiv.innerHTML = `
        <button id="close-optimize-btn" style="
          flex: 1;
          padding: 12px 20px;
          background: linear-gradient(135deg, #52c41a, #389e0d);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 500;
        ">
          ✓ 完成
        </button>
      `;

      document
        .getElementById("close-optimize-btn")
        .addEventListener("click", function () {
          overlay.remove();
        });

      getNotificationService()("简历优化完成！", "success");
    } catch (error) {
      console.error("优化失败:", error);
      progressDiv.style.display = "none";

      // 显示错误
      resultDiv.style.display = "block";
      resultDiv.innerHTML = `
        <div style="
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 16px;
          text-align: center;
        ">
          <div style="font-size: 32px; margin-bottom: 8px;">😞</div>
          <p style="margin: 0; color: #dc2626; font-weight: 600;">优化失败</p>
          <p style="margin: 8px 0 0 0; color: #b91c1c; font-size: 13px;">${error.message}</p>
        </div>
      `;

      buttonsDiv.innerHTML = `
        <button id="retry-optimize-btn" style="
          flex: 1;
          padding: 12px 20px;
          background: linear-gradient(135deg, #2b5797, #4a90d9);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 15px;
        ">
          重试
        </button>
        <button id="close-error-btn" style="
          padding: 12px 20px;
          background: #f3f4f6;
          color: #374151;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 15px;
        ">
          关闭
        </button>
      `;

      document
        .getElementById("retry-optimize-btn")
        .addEventListener("click", function () {
          overlay.remove();
          showOptimizeDialog();
        });
      document
        .getElementById("close-error-btn")
        .addEventListener("click", function () {
          overlay.remove();
        });

      getNotificationService()("优化失败: " + error.message, "error");
    }
  });

  // 取消
  cancelBtn.addEventListener("click", function () {
    overlay.remove();
  });

  // 点击遮罩层关闭
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
}

// ==========================================
// 智能预填功能
// ==========================================

/**
 * 启动智能预填流程
 */
function startSmartFill() {
  getNotificationService()("正在分析页面表单...", "info");

  // 收集简历数据
  var resumeData = collectFormData();

  // 检查是否有数据
  var hasData = false;
  if (resumeData.personalInfo) {
    for (var key in resumeData.personalInfo) {
      if (resumeData.personalInfo[key]) {
        hasData = true;
        break;
      }
    }
  }

  if (!hasData) {
    getNotificationService()("请先填写简历信息", "warning");
    return;
  }

  // 获取当前标签页并执行预填
  if (typeof chrome !== "undefined" && chrome.tabs) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs && tabs.length > 0 && tabs[0].id) {
        var tabId = tabs[0].id;
        var tabUrl = tabs[0].url || "";

        // 检查是否是支持的页面
        if (
          tabUrl.startsWith("chrome://") ||
          tabUrl.startsWith("chrome-extension://") ||
          tabUrl.startsWith("about:")
        ) {
          getNotificationService()("无法在此页面使用预填功能", "error");
          return;
        }

        // 显示预填进度对话框
        showSmartFillDialog(tabId, resumeData, tabUrl);
      } else {
        getNotificationService()("未找到活动标签页", "error");
      }
    });
  } else {
    getNotificationService()("浏览器扩展 API 不可用", "error");
  }
}

/**
 * 显示智能预填对话框
 */
function showSmartFillDialog(tabId, resumeData, tabUrl) {
  // 移除已存在的弹窗
  var existingDialog = document.getElementById("smart-fill-dialog");
  if (existingDialog) {
    existingDialog.remove();
  }

  // 创建弹窗
  var overlay = document.createElement("div");
  overlay.id = "smart-fill-dialog";
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  `;

  var dialog = document.createElement("div");
  dialog.style.cssText = `
    background: white;
    border-radius: 12px;
    padding: 24px;
    width: 380px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  `;

  dialog.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <div style="font-size: 48px; margin-bottom: 12px;">📋</div>
      <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 18px;">
        智能预填表单
      </h3>
      <p style="margin: 0; color: #6b7280; font-size: 13px;">
        正在分析页面并匹配字段...
      </p>
    </div>
    
    <div id="fill-progress" style="margin-bottom: 20px;">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
        <div class="spinner" style="
          width: 24px;
          height: 24px;
          border: 3px solid #e5e7eb;
          border-top-color: #2b5797;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        "></div>
        <span id="fill-status" style="color: #374151; font-size: 14px;">正在注入脚本...</span>
      </div>
    </div>
    
    <div id="fill-result" style="display: none;">
      <div id="fill-success" style="
        background: #f0fdf4;
        border: 1px solid #86efac;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
        display: none;
      ">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <span style="font-size: 20px;">✅</span>
          <span style="color: #166534; font-weight: 600;" id="fill-success-text">填充完成</span>
        </div>
        <div id="fill-details" style="font-size: 13px; color: #15803d;"></div>
      </div>
      
      <div id="fill-error" style="
        background: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
        display: none;
      ">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 20px;">❌</span>
          <span style="color: #dc2626; font-weight: 600;" id="fill-error-text">填充失败</span>
        </div>
      </div>
    </div>
    
    <div id="fill-buttons" style="display: flex; gap: 12px;">
      <button id="close-fill-btn" style="
        flex: 1;
        padding: 12px 20px;
        background: #f3f4f6;
        color: #374151;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        display: none;
      ">
        关闭
      </button>
    </div>
    
    <style>
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>
  `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  // 开始执行预填
  executeSmartFill(tabId, resumeData, overlay);
}

/**
 * 执行智能预填
 */
function executeSmartFill(tabId, resumeData, overlay) {
  var statusEl = document.getElementById("fill-status");
  var progressEl = document.getElementById("fill-progress");
  var resultEl = document.getElementById("fill-result");
  var successEl = document.getElementById("fill-success");
  var errorEl = document.getElementById("fill-error");
  var closeBtn = document.getElementById("close-fill-btn");

  // 确保 content script 已注入
  withContentScript(tabId, function () {
    if (statusEl) statusEl.textContent = "正在分析页面字段...";

    // 发送智能预填请求
    chrome.tabs.sendMessage(
      tabId,
      {
        action: "smartFillForm",
        data: resumeData,
        modelConfig: null, // 可以传入模型配置用于 AI 辅助匹配
      },
      function (response) {
        if (chrome.runtime.lastError) {
          console.error("预填失败:", chrome.runtime.lastError);
          showFillError("无法连接到页面，请刷新页面后重试");
          return;
        }

        if (response && response.success) {
          showFillSuccess(response);
        } else {
          showFillError(response ? response.message : "预填失败，请重试");
        }
      }
    );
  });

  function showFillSuccess(response) {
    if (progressEl) progressEl.style.display = "none";
    if (resultEl) resultEl.style.display = "block";
    if (successEl) successEl.style.display = "block";

    var successText = document.getElementById("fill-success-text");
    var detailsEl = document.getElementById("fill-details");

    if (successText) {
      successText.textContent = response.message || "填充完成";
    }

    if (detailsEl && response.details) {
      var details = response.details;
      var html = "<ul style='margin: 8px 0 0 0; padding-left: 20px;'>";

      if (details.details && details.details.length > 0) {
        details.details.slice(0, 5).forEach(function (item) {
          html +=
            "<li>" +
            escapeHtmlSafe(item.label || "字段") +
            ": " +
            escapeHtmlSafe(item.value || "") +
            "</li>";
        });

        if (details.details.length > 5) {
          html +=
            "<li>... 还有 " + (details.details.length - 5) + " 个字段</li>";
        }
      }

      html += "</ul>";
      detailsEl.innerHTML = html;
    }

    if (closeBtn) closeBtn.style.display = "block";
    getNotificationService()("预填完成！", "success");
  }

  function showFillError(message) {
    if (progressEl) progressEl.style.display = "none";
    if (resultEl) resultEl.style.display = "block";
    if (errorEl) {
      errorEl.style.display = "block";
      var errorText = document.getElementById("fill-error-text");
      if (errorText) errorText.textContent = message;
    }

    if (closeBtn) closeBtn.style.display = "block";
    getNotificationService()("预填失败: " + message, "error");
  }

  // 关闭按钮事件
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      overlay.remove();
    });
  }

  // 点击遮罩层关闭
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
}

/**
 * HTML 转义（安全版本）
 */
function escapeHtmlSafe(text) {
  if (!text) return "";
  var div = document.createElement("div");
  div.textContent = String(text);
  return div.innerHTML;
}

/**
 * 显示 AI 生成简历介绍对话框
 */
function showAIIntroGenerateDialog() {
  // 检查是否配置了 API
  var config = null;
  if (typeof getModelConfig === "function") {
    config = getModelConfig();
  } else if (
    typeof window !== "undefined" &&
    typeof window.getModelConfig === "function"
  ) {
    config = window.getModelConfig();
  }

  if (!config || !config.apiKey) {
    getNotificationService()("请先在设置中配置 AI 模型 API Key", "warning");
    // 切换到设置页面
    var settingsTab = document.getElementById("mode-settings");
    if (settingsTab) {
      settingsTab.click();
    }
    return;
  }

  // 收集当前表单数据
  var resumeData = collectFormData();

  // 检查是否有足够的数据
  var hasData = false;
  var personalInfo = resumeData.personalInfo || {};
  if (personalInfo.name || personalInfo["expected-position"]) {
    hasData = true;
  }
  if (resumeData.education && resumeData.education.length > 0) {
    hasData = true;
  }
  if (resumeData.workExperience && resumeData.workExperience.length > 0) {
    hasData = true;
  }
  if (resumeData.projects && resumeData.projects.length > 0) {
    hasData = true;
  }

  if (!hasData) {
    getNotificationService()(
      "请先填写一些简历信息（如姓名、期望职位、教育经历等）",
      "warning"
    );
    return;
  }

  // 移除已存在的弹窗
  var existingDialog = document.getElementById("ai-intro-dialog");
  if (existingDialog) {
    existingDialog.remove();
  }

  // 创建弹窗遮罩层
  var overlay = document.createElement("div");
  overlay.id = "ai-intro-dialog";
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  `;

  // 创建弹窗内容
  var dialog = document.createElement("div");
  dialog.style.cssText = `
    background: white;
    border-radius: 12px;
    padding: 24px;
    width: 400px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  `;

  dialog.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <div style="font-size: 48px; margin-bottom: 12px;">🤖</div>
      <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 20px;">
        AI 生成简历介绍
      </h3>
      <p style="margin: 0; color: #6b7280; font-size: 14px;">
        基于您的简历信息智能生成专业自我介绍
      </p>
    </div>
    
    <div id="ai-intro-initial" style="margin-bottom: 20px;">
      <div style="
        background: linear-gradient(135deg, #fdf4ff, #fae8ff);
        border: 1px solid #e879f9;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
      ">
        <p style="margin: 0 0 8px 0; color: #a21caf; font-size: 13px; font-weight: 600;">
          ✨ AI 将根据以下信息生成介绍：
        </p>
        <ul style="margin: 0; padding-left: 20px; color: #86198f; font-size: 12px; line-height: 1.8;">
          ${
            personalInfo.name
              ? "<li>姓名：" + escapeHtmlSafe(personalInfo.name) + "</li>"
              : ""
          }
          ${
            personalInfo["expected-position"]
              ? "<li>目标职位：" +
                escapeHtmlSafe(personalInfo["expected-position"]) +
                "</li>"
              : ""
          }
          ${
            resumeData.education && resumeData.education.length > 0
              ? "<li>教育经历：" + resumeData.education.length + " 条</li>"
              : ""
          }
          ${
            resumeData.workExperience && resumeData.workExperience.length > 0
              ? "<li>工作经历：" + resumeData.workExperience.length + " 条</li>"
              : ""
          }
          ${
            resumeData.projects && resumeData.projects.length > 0
              ? "<li>项目经历：" + resumeData.projects.length + " 条</li>"
              : ""
          }
          ${
            resumeData.skills && resumeData.skills.length > 0
              ? "<li>技能特长：" + resumeData.skills.length + " 项</li>"
              : ""
          }
        </ul>
      </div>
    </div>
    
    <div id="ai-intro-progress" style="display: none; margin-bottom: 20px;">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
        <div class="spinner" style="
          width: 24px;
          height: 24px;
          border: 3px solid #e5e7eb;
          border-top-color: #ec4899;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        "></div>
        <span id="ai-intro-status" style="color: #374151; font-size: 14px;">正在生成...</span>
      </div>
    </div>
    
    <div id="ai-intro-result" style="display: none; margin-bottom: 20px;">
      <div style="
        background: #f0fdf4;
        border: 1px solid #86efac;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 12px;
      ">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <span style="font-size: 18px;">✅</span>
          <span style="color: #166534; font-weight: 600; font-size: 14px;">生成完成！</span>
        </div>
      </div>
      <div style="
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 16px;
        max-height: 200px;
        overflow-y: auto;
      ">
        <p id="ai-intro-content" style="margin: 0; color: #374151; font-size: 14px; line-height: 1.8; white-space: pre-wrap;"></p>
      </div>
    </div>
    
    <div id="ai-intro-error" style="display: none; margin-bottom: 20px;">
      <div style="
        background: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: 8px;
        padding: 16px;
        text-align: center;
      ">
        <div style="font-size: 32px; margin-bottom: 8px;">😞</div>
        <p style="margin: 0; color: #dc2626; font-weight: 600;">生成失败</p>
        <p id="ai-intro-error-msg" style="margin: 8px 0 0 0; color: #b91c1c; font-size: 13px;"></p>
      </div>
    </div>
    
    <div id="ai-intro-buttons" style="display: flex; gap: 12px;">
      <button id="start-ai-intro-btn" style="
        flex: 1;
        padding: 12px 20px;
        background: linear-gradient(135deg, #ec4899, #d946ef);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 15px;
        font-weight: 500;
        transition: transform 0.2s, box-shadow 0.2s;
      ">
        🚀 开始生成
      </button>
      <button id="cancel-ai-intro-btn" style="
        padding: 12px 20px;
        background: #f3f4f6;
        color: #374151;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 15px;
        transition: background 0.2s;
      ">
        取消
      </button>
    </div>
    
    <style>
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>
  `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  // 按钮事件
  var startBtn = document.getElementById("start-ai-intro-btn");
  var cancelBtn = document.getElementById("cancel-ai-intro-btn");
  var initialDiv = document.getElementById("ai-intro-initial");
  var progressDiv = document.getElementById("ai-intro-progress");
  var resultDiv = document.getElementById("ai-intro-result");
  var errorDiv = document.getElementById("ai-intro-error");
  var buttonsDiv = document.getElementById("ai-intro-buttons");

  // 悬停效果
  startBtn.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-2px)";
    this.style.boxShadow = "0 4px 12px rgba(236, 72, 153, 0.4)";
  });
  startBtn.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0)";
    this.style.boxShadow = "none";
  });

  cancelBtn.addEventListener("mouseenter", function () {
    this.style.background = "#e5e7eb";
  });
  cancelBtn.addEventListener("mouseleave", function () {
    this.style.background = "#f3f4f6";
  });

  // 开始生成
  startBtn.addEventListener("click", async function () {
    initialDiv.style.display = "none";
    progressDiv.style.display = "block";
    startBtn.disabled = true;
    startBtn.style.opacity = "0.6";
    startBtn.style.cursor = "not-allowed";
    cancelBtn.style.display = "none";

    var statusText = document.getElementById("ai-intro-status");

    try {
      var generateFunc = null;
      if (typeof generateResumeIntroWithAI === "function") {
        generateFunc = generateResumeIntroWithAI;
      } else if (
        typeof window !== "undefined" &&
        typeof window.generateResumeIntroWithAI === "function"
      ) {
        generateFunc = window.generateResumeIntroWithAI;
      }

      if (!generateFunc) {
        throw new Error("AI 生成功能未加载，请刷新页面重试");
      }

      var intro = await generateFunc(resumeData, function (progress) {
        if (statusText) {
          statusText.textContent = progress.message || "正在生成...";
        }
      });

      // 显示结果
      progressDiv.style.display = "none";
      resultDiv.style.display = "block";
      var contentEl = document.getElementById("ai-intro-content");
      if (contentEl) {
        contentEl.textContent = intro;
      }

      // 更新按钮
      buttonsDiv.innerHTML = `
        <button id="copy-ai-intro-btn" style="
          flex: 1;
          padding: 12px 20px;
          background: linear-gradient(135deg, #2b5797, #4a90d9);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        ">
          📋 复制
        </button>
        <button id="fill-ai-intro-btn" style="
          flex: 1;
          padding: 12px 20px;
          background: linear-gradient(135deg, #52c41a, #389e0d);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        ">
          ✏️ 填入
        </button>
        <button id="download-ai-intro-txt-btn" style="
          flex: 1;
          padding: 12px 20px;
          background: linear-gradient(135deg, #faad14, #f59e0b);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        ">
          📥 下载
        </button>
        <button id="close-ai-intro-btn" style="
          padding: 12px 16px;
          background: #f3f4f6;
          color: #374151;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
        ">
          ✕
        </button>
      `;

      // 复制按钮
      document
        .getElementById("copy-ai-intro-btn")
        .addEventListener("click", function () {
          navigator.clipboard
            .writeText(intro)
            .then(function () {
              getNotificationService()("已复制到剪贴板", "success");
            })
            .catch(function () {
              getNotificationService()("复制失败，请手动复制", "error");
            });
        });

      // 填入自我描述
      document
        .getElementById("fill-ai-intro-btn")
        .addEventListener("click", function () {
          var selfIntroEl = document.getElementById("self-intro");
          if (selfIntroEl) {
            selfIntroEl.value = intro;
            // 触发自动保存
            if (typeof autoSaveFormData === "function") {
              autoSaveFormData();
            }
            getNotificationService()("已填入自我描述", "success");
            overlay.remove();
          } else {
            getNotificationService()("未找到自我描述输入框", "error");
          }
        });

      // 下载 TXT 文件
      document
        .getElementById("download-ai-intro-txt-btn")
        .addEventListener("click", function () {
          // 直接下载已生成的内容为 TXT 文件
          var name =
            (resumeData.personalInfo && resumeData.personalInfo.name) ||
            "未命名用户";
          name =
            String(name)
              .replace(/[\\/:*?"<>|\n\r]+/g, "_")
              .trim() || "未命名用户";
          var date = new Date();
          var dateStr =
            date.getFullYear() +
            "-" +
            String(date.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(date.getDate()).padStart(2, "0");

          var content = "AI 生成简历介绍 - " + name + "\n";
          content += "生成时间：" + dateStr + "\n\n";
          content += "=== 简历自我介绍 ===\n\n";
          content += intro;

          var blob = new Blob([content], {
            type: "text/plain;charset=utf-8",
          });
          var url = URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = name + "_AI简历介绍_" + dateStr + ".txt";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          getNotificationService()("AI 简历介绍已下载", "success");
        });

      // 关闭按钮
      document
        .getElementById("close-ai-intro-btn")
        .addEventListener("click", function () {
          overlay.remove();
        });

      getNotificationService()("简历介绍生成完成！", "success");
    } catch (error) {
      console.error("AI 生成失败:", error);
      progressDiv.style.display = "none";
      errorDiv.style.display = "block";
      var errorMsgEl = document.getElementById("ai-intro-error-msg");
      if (errorMsgEl) {
        errorMsgEl.textContent = error.message;
      }

      buttonsDiv.innerHTML = `
        <button id="retry-ai-intro-btn" style="
          flex: 1;
          padding: 12px 20px;
          background: linear-gradient(135deg, #ec4899, #d946ef);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 15px;
        ">
          重试
        </button>
        <button id="close-error-ai-intro-btn" style="
          padding: 12px 20px;
          background: #f3f4f6;
          color: #374151;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 15px;
        ">
          关闭
        </button>
      `;

      document
        .getElementById("retry-ai-intro-btn")
        .addEventListener("click", function () {
          overlay.remove();
          showAIIntroGenerateDialog();
        });
      document
        .getElementById("close-error-ai-intro-btn")
        .addEventListener("click", function () {
          overlay.remove();
        });

      getNotificationService()("生成失败: " + error.message, "error");
    }
  });

  // 取消
  cancelBtn.addEventListener("click", function () {
    overlay.remove();
  });

  // 点击遮罩层关闭
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
}
