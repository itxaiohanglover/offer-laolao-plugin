// 字段级自动填充按钮
// 允许用户为单个字段触发「指向网页填写」模式

const FIELD_AUTOFILL_CONFIGS = [
  { id: "name", label: "姓名" },
  { id: "gender", label: "性别" },
  { id: "birth-date", label: "出生日期" },
  { id: "phone", label: "手机号码" },
  { id: "email", label: "电子邮箱" },
  { id: "id-card", label: "身份证号" },
  { id: "location", label: "所在地" },
  { id: "political-status", label: "政治面貌" },
  { id: "expected-position", label: "期望职位" },
  { id: "expected-industry", label: "期望行业" },
  { id: "expected-salary", label: "期望薪资" },
  { id: "expected-location", label: "期望地点" },
  { id: "internship-duration", label: "实习周期" },
  { id: "available-time", label: "到岗时间" },
  { id: "self-intro", label: "自我介绍" },
];

/**
 * 初始化字段填充按钮
 */
function initFieldFillButtons() {
  if (!FIELD_AUTOFILL_CONFIGS || !Array.isArray(FIELD_AUTOFILL_CONFIGS)) {
    return;
  }

  // 为静态字段添加按钮
  FIELD_AUTOFILL_CONFIGS.forEach(function (config) {
    var field = document.getElementById(config.id);
    if (field) {
      ensureFieldWrapper(field, config);
    }
  });

  // 为动态项中的所有字段添加按钮
  initDynamicItemFieldButtons();

  attachFieldFillButtonListeners();

  // 监听动态项的添加，为新添加的项也添加按钮
  observeDynamicItems();
}

/**
 * 为字段添加按钮容器
 */
function ensureFieldWrapper(field, config) {
  if (!field || !field.parentNode) return;

  var parent = field.parentNode;
  var wrapper;

  if (parent.classList && parent.classList.contains("input-with-button")) {
    wrapper = parent;
  } else {
    wrapper = document.createElement("div");
    wrapper.className = "input-with-button";
    parent.insertBefore(wrapper, field);
    wrapper.appendChild(field);
  }

  if (
    wrapper.querySelector('.field-fill-btn[data-field-id="' + config.id + '"]')
  ) {
    return;
  }

  var button = document.createElement("button");
  button.type = "button";
  button.className = "field-fill-btn";
  button.dataset.fieldId = config.id;
  button.dataset.fieldLabel = config.label || config.id;
  button.title = "在网页中填入此字段";
  button.textContent = "↗";

  wrapper.appendChild(button);
}

/**
 * 绑定按钮点击事件
 */
function attachFieldFillButtonListeners() {
  var buttons = document.querySelectorAll(".field-fill-btn");
  buttons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      var fieldId = this.dataset.fieldId;
      var fieldLabel = this.dataset.fieldLabel || fieldId;
      startSingleFieldFill(fieldId, fieldLabel);
    });
  });
}

/**
 * 启动单字段填充流程
 */
function startSingleFieldFill(fieldId, fieldLabel) {
  var fieldElement = document.getElementById(fieldId);
  if (!fieldElement) {
    showNotification("未找到字段: " + fieldLabel, "error");
    return;
  }

  var fieldValue = getFieldValueForAutofill(fieldElement);
  if (fieldValue === "") {
    showNotification("请先在弹窗中填写 " + fieldLabel, "warning");
    return;
  }

  if (typeof chrome === "undefined" || !chrome.tabs) {
    showNotification("当前环境不支持自动填充", "error");
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (!tabs || tabs.length === 0 || !tabs[0].id) {
      showNotification("未找到活动标签页", "error");
      return;
    }

    var tab = tabs[0];
    var tabId = tab.id;
    var tabUrl = tab.url || "";

    // 检查URL是否支持注入（chrome://、chrome-extension://等页面不支持）
    if (
      tabUrl.startsWith("chrome://") ||
      tabUrl.startsWith("chrome-extension://") ||
      tabUrl.startsWith("edge://") ||
      tabUrl.startsWith("about:")
    ) {
      showNotification("当前页面不支持此功能，请在普通网页上使用", "error");
      return;
    }

    var payload = {
      fieldId: fieldId,
      fieldLabel: fieldLabel,
      value: fieldValue,
    };

    console.log("Starting field fill for:", {
      fieldId,
      fieldLabel,
      tabId,
      tabUrl,
    });

    // 先尝试ping，检查content script是否已加载
    chrome.tabs.sendMessage(tabId, { action: "ping" }, function (pingResponse) {
      if (chrome.runtime.lastError) {
        // Content script未加载，需要注入
        console.log(
          "Content script not loaded, injecting...",
          chrome.runtime.lastError
        );

        // 检查是否有注入权限
        if (!chrome.scripting || !chrome.scripting.executeScript) {
          showNotification("浏览器不支持脚本注入，请刷新页面后重试", "error");
          return;
        }

        chrome.scripting.executeScript(
          {
            target: { tabId: tabId },
            files: ["src/content/content.js"],
          },
          function (injectResult) {
            if (chrome.runtime.lastError) {
              console.error(
                "Error injecting script:",
                chrome.runtime.lastError
              );
              var errorMsg = chrome.runtime.lastError.message || "未知错误";
              showNotification(
                "无法注入脚本: " + errorMsg + "。请刷新页面后重试",
                "error"
              );
              return;
            }

            console.log(
              "Script injected successfully, waiting before sending message..."
            );
            // 等待脚本加载完成，增加等待时间
            setTimeout(function () {
              sendFieldFillMessage(tabId, payload, fieldLabel);
            }, 800);
          }
        );
      } else {
        // Content script已加载，直接发送消息
        console.log(
          "Content script already loaded, sending message...",
          pingResponse
        );
        sendFieldFillMessage(tabId, payload, fieldLabel);
      }
    });
  });
}

/**
 * 发送字段填充消息（带重试机制）
 */
function sendFieldFillMessage(tabId, payload, fieldLabel, retryCount) {
  retryCount = retryCount || 0;
  var maxRetries = 2;

  console.log(
    "Sending field fill message (attempt " + (retryCount + 1) + "):",
    { tabId, payload }
  );
  var hasShownInstruction = false;

  function showInstructionOnce() {
    if (hasShownInstruction) return;
    hasShownInstruction = true;
    showNotification(
      '请在网页中点击要填入 "' + fieldLabel + '" 的位置，按 Esc 可取消。',
      "info"
    );
    schedulePopupMinimize();
  }

  chrome.tabs.sendMessage(
    tabId,
    {
      action: "startFieldFillMode",
      fieldData: payload,
    },
    function (response) {
      if (chrome.runtime.lastError) {
        console.error(
          "Error sending field fill message (attempt " +
            (retryCount + 1) +
            "):",
          chrome.runtime.lastError
        );

        // 如果是连接错误且还有重试次数，先等待再重试
        var errorMsg = chrome.runtime.lastError.message || "";
        // 某些情况下（如 popup 很快关闭）会出现 message port closed，这是正常现象
        if (
          errorMsg.includes(
            "The message port closed before a response was received."
          )
        ) {
          console.warn(
            "Message port closed before response, but command was likely delivered. Treating as success."
          );
          showInstructionOnce();
          return;
        }

        if (
          retryCount < maxRetries &&
          (errorMsg.includes("Could not establish connection") ||
            errorMsg.includes("Receiving end does not exist") ||
            errorMsg.includes("message port closed"))
        ) {
          console.log("Retrying in 500ms...");
          setTimeout(function () {
            sendFieldFillMessage(tabId, payload, fieldLabel, retryCount + 1);
          }, 500);
          return;
        }

        // 提供更友好的错误提示
        if (errorMsg.includes("Could not establish connection")) {
          showNotification("无法连接到页面，请刷新页面后重试", "error");
        } else if (errorMsg.includes("Receiving end does not exist")) {
          showNotification("页面脚本未加载，请刷新页面后重试", "error");
        } else if (errorMsg.includes("message port closed")) {
          showNotification("消息通道已关闭，请刷新页面后重试", "error");
        } else {
          showNotification("连接失败: " + errorMsg + "，请刷新后重试", "error");
        }
        return;
      }

      console.log("Field fill message response:", response);
      if (response && response.success) {
        showInstructionOnce();
      } else {
        var errorMsg =
          response && response.message ? response.message : "未知错误";
        showNotification("无法启动字段填充模式: " + errorMsg, "error");
        return;
      }

      // 如果没有返回响应（某些站点会阻断响应），也给出指引
      showInstructionOnce();
    }
  );
}

/**
 * 成功启动指向填充后，自动关闭/最小化弹窗
 */
function schedulePopupMinimize() {
  if (schedulePopupMinimize._scheduled) return;
  schedulePopupMinimize._scheduled = true;

  setTimeout(function () {
    try {
      if (window && window.close) {
        window.close();
      }
    } catch (error) {
      console.warn("自动关闭弹窗失败:", error);
    } finally {
      schedulePopupMinimize._scheduled = false;
    }
  }, 400);
}

/**
 * 获取字段值
 */
function getFieldValueForAutofill(fieldElement) {
  if (!fieldElement) return "";

  if (fieldElement.tagName === "SELECT") {
    if (fieldElement.value) {
      return fieldElement.value;
    }
    var selectedOption = fieldElement.options[fieldElement.selectedIndex];
    return selectedOption ? selectedOption.text : "";
  }

  if (fieldElement.type === "checkbox") {
    return fieldElement.checked ? fieldElement.value || "已勾选" : "";
  }

  if (fieldElement.type === "radio") {
    if (fieldElement.checked) {
      return fieldElement.value || "已选择";
    }
    // 如果是同名单选组，尝试找到被选中的
    if (fieldElement.name) {
      var checked = document.querySelector(
        'input[name="' + fieldElement.name + '"]:checked'
      );
      return checked ? checked.value || "已选择" : "";
    }
    return "";
  }

  var value = fieldElement.value || "";
  return value.trim();
}

/**
 * 为动态项中的所有字段添加填充按钮
 */
function initDynamicItemFieldButtons() {
  // 为所有动态项中的输入框、选择框、文本区域添加按钮
  var dynamicItems = document.querySelectorAll(".dynamic-item");
  dynamicItems.forEach(function (item) {
    var inputs = item.querySelectorAll("input, select, textarea");
    inputs.forEach(function (input) {
      // 跳过文件输入和按钮
      if (
        input.type === "file" ||
        input.type === "button" ||
        input.type === "submit"
      ) {
        return;
      }

      // 如果已经有按钮了，跳过
      if (
        input.parentNode &&
        input.parentNode.querySelector(
          '.field-fill-btn[data-field-id="' + input.id + '"]'
        )
      ) {
        return;
      }

      // 获取字段标签
      var label = getFieldLabel(input);
      var fieldId = input.id || input.name || "field-" + Date.now();

      // 确保有唯一的ID
      if (!input.id) {
        input.id = fieldId;
      }

      var config = {
        id: input.id,
        label: label,
      };

      ensureFieldWrapper(input, config);
    });
  });
}

/**
 * 获取字段的标签文本
 */
function getFieldLabel(field) {
  // 尝试从关联的label获取
  if (field.id) {
    var label = document.querySelector('label[for="' + field.id + '"]');
    if (label) {
      return label.textContent.trim();
    }
  }

  // 尝试从父元素中的label获取
  var parentLabel = field.closest(".form-group")?.querySelector("label");
  if (parentLabel) {
    return parentLabel.textContent.trim();
  }

  // 尝试从name属性推断
  if (field.name) {
    var nameParts = field.name.match(/\[(\d+)\]\[([^\]]+)\]/);
    if (nameParts) {
      var fieldName = nameParts[2];
      // 将字段名转换为中文标签
      var labelMap = {
        school: "学校",
        major: "专业",
        degree: "学历",
        rank: "排名",
        "start-date": "开始时间",
        "end-date": "结束时间",
        company: "公司",
        position: "职位",
        description: "描述",
        "project-name": "项目名称",
        role: "角色",
        "project-time": "项目时间",
        "project-desc": "项目描述",
        responsibilities: "职责",
        name: "技能名称",
        level: "技能水平",
        proficiency: "掌握程度",
        certificate: "证书",
      };
      return labelMap[fieldName] || fieldName;
    }
  }

  // 使用placeholder
  if (field.placeholder) {
    return field.placeholder;
  }

  return "字段";
}

/**
 * 监听动态项的添加
 */
function observeDynamicItems() {
  // 使用MutationObserver监听动态项的添加
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeType === 1) {
          // Element node
          // 如果是动态项，为其添加按钮
          if (node.classList && node.classList.contains("dynamic-item")) {
            var inputs = node.querySelectorAll("input, select, textarea");
            inputs.forEach(function (input) {
              if (
                input.type === "file" ||
                input.type === "button" ||
                input.type === "submit"
              ) {
                return;
              }

              if (!input.id) {
                input.id =
                  "field-" +
                  Date.now() +
                  "-" +
                  Math.random().toString(36).substr(2, 9);
              }

              var label = getFieldLabel(input);
              var config = {
                id: input.id,
                label: label,
              };

              ensureFieldWrapper(input, config);
            });

            // 重新绑定事件监听器
            attachFieldFillButtonListeners();
          }
        }
      });
    });
  });

  // 观察所有动态列表
  var lists = document.querySelectorAll(".dynamic-list");
  lists.forEach(function (list) {
    observer.observe(list, {
      childList: true,
      subtree: true,
    });
  });
}
