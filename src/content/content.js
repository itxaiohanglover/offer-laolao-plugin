// 简历自动填写助手 - 内容脚本
// 支持多种招聘网站的智能预填功能

console.log("简历自动填写助手 - 内容脚本已加载");

// ==========================================
// 全局变量
// ==========================================

// 字段级填充模式变量
let isFieldFillMode = false;
let pendingFieldFill = null;
let fieldFillHighlight = null;
let fieldFillTooltip = null;
let fieldFillOverlay = null;

// ==========================================
// 网站适配器配置
// ==========================================

/**
 * 网站适配器配置
 * 为不同招聘网站提供特定的选择器和提取逻辑
 */
const siteAdapters = {
  // 字节跳动
  "bytedance.com": {
    name: "ByteDance",
    selectors: {
      formItem:
        '[class*="form-item"], [class*="FormItem"], [class*="field-wrapper"], [class*="ud__"]',
      label:
        '[class*="label"], [class*="Label"], [class*="title"], [data-form-field-i18n-name]',
      // 字节跳动使用 ud__native-input 类和 data-form-field-* 属性
      input:
        '.ud__native-input, input[data-form-field-id], input[data-form-field-name], input, textarea, [contenteditable="true"]',
    },
    customSelectors: {
      // 字节跳动的自定义输入组件
      wrapper:
        '[class*="ud__"], [class*="input"], [class*="Input"], [class*="field"], [class*="Field"], [data-testid], [data-form-field-id]',
      select:
        '[class*="select"], [class*="Select"], [class*="dropdown"], [class*="Dropdown"], [class*="ud__select"]',
    },
    // 字节跳动特有的属性映射
    dataAttributes: {
      fieldId: "data-form-field-id",
      fieldName: "data-form-field-name",
      fieldLabel: "data-form-field-i18n-name",
    },
  },

  // 阿里巴巴
  "alibaba.com": {
    name: "Alibaba",
    selectors: {
      formItem: '.next-form-item, [class*="form-item"], [class*="FormItem"]',
      label: '.next-form-item-label, [class*="label"], label',
      input: ".next-input input, input, textarea",
    },
  },

  // 腾讯
  "tencent.com": {
    name: "Tencent",
    selectors: {
      formItem: '[class*="form-item"], [class*="form-group"], [class*="field"]',
      label: '[class*="label"], [class*="title"], label',
      input: 'input, textarea, [contenteditable="true"]',
    },
  },

  // 美团
  "meituan.com": {
    name: "Meituan",
    selectors: {
      formItem: '[class*="form-item"], [class*="form-group"]',
      label: '[class*="label"], [class*="title"]',
      input: "input, textarea",
    },
  },

  // 拉勾
  "lagou.com": {
    name: "Lagou",
    selectors: {
      formItem:
        '.resume-form-item, [class*="form-item"], [class*="form-group"]',
      label: '.form-label, [class*="label"], label',
      input: "input, textarea",
    },
  },

  // Boss直聘
  "zhipin.com": {
    name: "Boss直聘",
    selectors: {
      formItem: '[class*="form-item"], [class*="form-group"], [class*="field"]',
      label: '[class*="label"], [class*="title"], label',
      input: "input, textarea",
    },
  },

  // 智联招聘
  "zhaopin.com": {
    name: "智联招聘",
    selectors: {
      formItem: '[class*="form-item"], [class*="form-group"]',
      label: '[class*="label"], label',
      input: "input, textarea, select",
    },
  },

  // 前程无忧
  "51job.com": {
    name: "前程无忧",
    selectors: {
      formItem: '[class*="form-item"], [class*="form-group"], .form-group',
      label: '[class*="label"], label, .form-label',
      input: "input, textarea, select",
    },
  },

  // 猎聘
  "liepin.com": {
    name: "猎聘",
    selectors: {
      formItem: '[class*="form-item"], [class*="form-group"]',
      label: '[class*="label"], label',
      input: "input, textarea, select",
    },
  },

  // 脉脉
  "maimai.cn": {
    name: "脉脉",
    selectors: {
      formItem: '[class*="form-item"], [class*="field"]',
      label: '[class*="label"], [class*="title"]',
      input: "input, textarea",
    },
  },

  // LinkedIn
  "linkedin.com": {
    name: "LinkedIn",
    selectors: {
      formItem: '.artdeco-text-input, [class*="form-component"]',
      label: 'label, [class*="label"]',
      input: 'input, textarea, [contenteditable="true"]',
    },
  },

  // Indeed
  "indeed.com": {
    name: "Indeed",
    selectors: {
      formItem: '[class*="form-group"], [class*="input-group"]',
      label: 'label, [class*="label"]',
      input: "input, textarea, select",
    },
  },

  // 默认适配器（通用）
  default: {
    name: "Default",
    selectors: {
      formItem:
        '[class*="form-item"], [class*="form-group"], [class*="form-field"], [class*="field-wrapper"], [class*="input-wrapper"]',
      label: '[class*="label"], label, [class*="title"], [class*="caption"]',
      input: 'input, textarea, select, [contenteditable="true"]',
    },
  },
};

/**
 * 获取当前网站的适配器
 */
function getSiteAdapter() {
  const hostname = window.location.hostname;

  for (const [domain, adapter] of Object.entries(siteAdapters)) {
    if (domain !== "default" && hostname.includes(domain)) {
      console.log(`使用 ${adapter.name} 适配器`);
      return adapter;
    }
  }

  console.log("使用默认适配器");
  return siteAdapters.default;
}

// ==========================================
// 消息监听器
// ==========================================

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("收到来自popup的消息:", request);

  // 心跳检测
  if (request.action === "ping") {
    sendResponse({ success: true, message: "content script loaded" });
    return true;
  }

  // 智能预填表单
  if (request.action === "smartFillForm") {
    console.log("开始智能预填表单...", request.data);
    handleSmartFill(request.data, request.modelConfig)
      .then((result) => sendResponse(result))
      .catch((error) =>
        sendResponse({ success: false, message: error.message })
      );
    return true; // 保持消息通道开放
  }

  // 获取页面所有可填充字段
  if (request.action === "getPageFields") {
    console.log("获取页面字段...");
    const fields = extractPageFields();
    sendResponse({ success: true, fields: fields });
    return true;
  }

  // 执行字段填充
  if (request.action === "fillFields") {
    console.log("执行字段填充...", request.fieldMappings);
    const result = executeFieldFill(request.fieldMappings);
    sendResponse(result);
    return true;
  }

  // 字段级填充模式
  if (request.action === "startFieldFillMode") {
    console.log("收到 startFieldFillMode 请求:", request.fieldData);
    try {
      const result = startFieldFillMode(request.fieldData);
      sendResponse(result);
    } catch (error) {
      sendResponse({ success: false, message: error.message });
    }
    return true;
  }

  // 兼容旧的 fillForm 动作
  if (request.action === "fillForm") {
    console.log("收到旧版 fillForm 请求，转为智能预填...");
    handleSmartFill(request.data, null)
      .then((result) => sendResponse(result))
      .catch((error) =>
        sendResponse({ success: false, message: error.message })
      );
    return true;
  }

  // 获取页面信息
  if (request.action === "getPageInfo") {
    sendResponse({
      url: window.location.href,
      title: document.title,
      hostname: window.location.hostname,
    });
    return true;
  }
});

// ==========================================
// 智能预填核心逻辑
// ==========================================

// 存储页面字段信息，供后续填充使用
let cachedPageFields = [];
let cachedResumeFields = [];

/**
 * 智能预填表单 - 使用 AI 模型匹配
 * @param {object} resumeData - 简历数据
 * @param {object} modelConfig - AI模型配置（可选）
 */
async function handleSmartFill(resumeData, modelConfig) {
  console.log("开始智能预填...");

  try {
    // 1. 提取页面所有可填充字段
    const pageFields = extractPageFields();
    console.log("检测到页面字段:", pageFields.length, "个");
    console.log("页面字段:", pageFields);

    if (pageFields.length === 0) {
      return { success: false, message: "未检测到可填充的表单字段" };
    }

    // 2. 将简历数据扁平化为键值对
    const resumeFields = flattenResumeData(resumeData);
    console.log("简历数据字段:", resumeFields.length, "个");

    if (resumeFields.length === 0) {
      return { success: false, message: "简历数据为空" };
    }

    // 缓存字段信息
    cachedPageFields = pageFields;
    cachedResumeFields = resumeFields;

    // 3. 准备发送给 AI 的字段信息
    const pageFieldsForAI = pageFields.map((f, i) => ({
      index: i,
      label: f.label || "",
      placeholder: f.placeholder || "",
      name: f.name || "",
      id: f.id || "",
      type: f.type || "text",
      ariaLabel: f.ariaLabel || "",
    }));

    const resumeFieldsForAI = resumeFields.map((f, i) => ({
      index: i,
      key: f.key,
      value: String(f.value).substring(0, 100), // 限制长度
      type: f.type,
      keywords: f.keywords.slice(0, 5),
    }));

    console.log("准备发送给 AI 的页面字段:", pageFieldsForAI);
    console.log("准备发送给 AI 的简历字段:", resumeFieldsForAI);

    // 4. 请求 popup 使用 AI 进行匹配
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        {
          action: "aiMatchFieldsRequest",
          pageFields: pageFieldsForAI,
          resumeFields: resumeFieldsForAI,
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error("AI 匹配请求失败:", chrome.runtime.lastError);
            // 降级到本地匹配
            const localMappings = matchFields(pageFields, resumeFields);
            const fillResult = executeFieldFill(localMappings);
            resolve({
              success: true,
              message: `成功填充 ${fillResult.filledCount} 个字段（本地匹配）`,
              details: fillResult,
            });
            return;
          }

          if (response && response.success && response.mappings) {
            console.log("AI 匹配结果:", response.mappings);
            // 将 AI 匹配结果转换为可执行的映射
            const fieldMappings = response.mappings
              .filter((m) => m.pageIndex >= 0 && m.resumeIndex >= 0)
              .map((m) => ({
                pageField: cachedPageFields[m.pageIndex],
                resumeField: cachedResumeFields[m.resumeIndex],
                score: m.confidence || 0.8,
              }))
              .filter((m) => m.pageField && m.resumeField);

            console.log("转换后的映射:", fieldMappings);
            const fillResult = executeFieldFill(fieldMappings);
            resolve({
              success: true,
              message: `成功填充 ${fillResult.filledCount} 个字段`,
              details: fillResult,
            });
          } else {
            // 降级到本地匹配
            console.log("AI 匹配失败，使用本地匹配");
            const localMappings = matchFields(pageFields, resumeFields);
            const fillResult = executeFieldFill(localMappings);
            resolve({
              success: true,
              message: `成功填充 ${fillResult.filledCount} 个字段（本地匹配）`,
              details: fillResult,
            });
          }
        }
      );
    });
  } catch (error) {
    console.error("智能预填失败:", error);
    return { success: false, message: error.message };
  }
}

// ==========================================
// 字段提取 - 增强版
// ==========================================

/**
 * 提取页面所有可填充字段 - 增强版
 * 支持多种招聘网站和现代前端框架
 */
function extractPageFields() {
  const fields = [];
  const processedElements = new Set();

  // 1. 扩展选择器覆盖更多元素类型
  const selectors = [
    // 标准 input 类型
    'input[type="text"]',
    'input[type="tel"]',
    'input[type="email"]',
    'input[type="number"]',
    'input[type="date"]',
    'input[type="url"]',
    'input[type="search"]',
    'input[type="datetime-local"]',
    'input[type="month"]',
    'input[type="week"]',
    'input[type="time"]',
    "input:not([type])",
    // 隐藏类型通常不需要，但某些情况下可能需要
    // 'input[type="hidden"]',
    "textarea",
    "select",
    // ARIA 角色
    '[contenteditable="true"]',
    '[role="textbox"]',
    '[role="combobox"]',
    '[role="searchbox"]',
    '[role="spinbutton"]',
    // 常见的自定义输入组件特征
    '[data-testid*="input"]',
    '[data-testid*="field"]',
    '[data-testid*="text"]',
    // 带有 tabindex 的可交互元素
    '[class*="input"][tabindex]:not([tabindex="-1"])',
    '[class*="editor"][tabindex]:not([tabindex="-1"])',
    // 字节跳动特有的选择器
    ".ud__native-input",
    "input[data-form-field-id]",
    "input[data-form-field-name]",
    "[data-form-field-i18n-name]",
  ];

  const elements = document.querySelectorAll(selectors.join(","));

  elements.forEach((element, index) => {
    // 跳过隐藏元素
    if (!isElementVisible(element)) return;
    // 跳过已处理的元素
    if (processedElements.has(element)) return;
    // 跳过禁用的元素
    if (element.disabled || element.readOnly) return;

    processedElements.add(element);

    const fieldInfo = extractFieldInfo(element, index);
    if (fieldInfo) {
      fields.push(fieldInfo);
    }
  });

  // 2. 通用自定义组件检测（不再限制域名）
  const customInputs = detectCustomInputComponentsUniversal(processedElements);
  customInputs.forEach((field) => {
    if (!processedElements.has(field.element)) {
      fields.push(field);
      processedElements.add(field.element);
    }
  });

  // 3. 使用网站适配器提取字段
  const adapterFields = extractFieldsWithAdapter(processedElements);
  adapterFields.forEach((field) => {
    if (!processedElements.has(field.element)) {
      fields.push(field);
      processedElements.add(field.element);
    }
  });

  // 4. 尝试从 Shadow DOM 中提取字段
  const shadowFields = extractFieldsFromShadowDOM(processedElements);
  shadowFields.forEach((field) => {
    if (!processedElements.has(field.element)) {
      fields.push(field);
      processedElements.add(field.element);
    }
  });

  console.log(`总共提取到 ${fields.length} 个字段`);
  return fields;
}

/**
 * 使用网站适配器提取字段
 */
function extractFieldsWithAdapter(processedElements) {
  const adapter = getSiteAdapter();
  const fields = [];
  const { formItem, label, input } = adapter.selectors;

  // 从表单项容器中提取
  try {
    document.querySelectorAll(formItem).forEach((container, index) => {
      const inputEl = container.querySelector(input);
      if (
        !inputEl ||
        !isElementVisible(inputEl) ||
        processedElements.has(inputEl)
      ) {
        return;
      }
      if (inputEl.disabled || inputEl.readOnly) return;

      const labelEl = container.querySelector(label);
      const labelText = labelEl ? getCleanText(labelEl) : "";

      const fieldInfo = createFieldInfo(inputEl, 500 + index, labelText);
      if (fieldInfo) {
        fields.push(fieldInfo);
      }
    });
  } catch (e) {
    console.warn("适配器字段提取出错:", e);
  }

  return fields;
}

/**
 * 提取单个字段的信息 - 增强版
 */
function extractFieldInfo(element, index) {
  // 获取字段标签 - 使用增强的标签查找
  let label = findFieldLabelEnhanced(element);

  // 获取字段的各种属性
  const info = {
    index: index,
    element: element,
    tagName: element.tagName.toLowerCase(),
    type: element.type || element.getAttribute("type") || "text",
    // 增强 name 和 id 的获取逻辑
    name:
      element.name ||
      element.getAttribute("data-form-field-name") ||
      element.getAttribute("data-name") ||
      element.getAttribute("data-field-name") ||
      "",
    id:
      element.id ||
      element.getAttribute("data-form-field-id") ||
      element.getAttribute("data-id") ||
      "",
    placeholder:
      element.placeholder ||
      element.getAttribute("placeholder") ||
      element.getAttribute("data-placeholder") ||
      "",
    label: label,
    ariaLabel: element.getAttribute("aria-label") || "",
    ariaLabelledBy: element.getAttribute("aria-labelledby") || "",
    dataField:
      element.getAttribute("data-field") ||
      element.getAttribute("data-name") ||
      element.getAttribute("data-test") ||
      element.getAttribute("data-testid") ||
      "",
    className: element.className || "",
    currentValue: element.value || element.textContent || "",
    xpath: getElementXPath(element),
  };

  // 生成字段的描述性关键词
  info.keywords = generateFieldKeywords(info);

  return info;
}

/**
 * 创建字段信息对象
 */
function createFieldInfo(element, index, label = "") {
  const finalLabel = label || findFieldLabelEnhanced(element);

  return {
    index: index,
    element: element,
    tagName: element.tagName.toLowerCase(),
    type: element.type || element.getAttribute("type") || "text",
    // 支持字节跳动的 data-form-field-* 属性
    name:
      element.name ||
      element.getAttribute("data-form-field-name") ||
      element.getAttribute("data-name") ||
      "",
    id: element.id || element.getAttribute("data-form-field-id") || "",
    placeholder: element.placeholder || "",
    label: finalLabel,
    ariaLabel: element.getAttribute("aria-label") || "",
    dataField:
      element.getAttribute("data-field") ||
      element.getAttribute("data-form-field-name") ||
      "",
    className: element.className || "",
    currentValue: element.value || element.textContent || "",
    keywords: generateFieldKeywords({
      label: finalLabel,
      placeholder: element.placeholder,
      name: element.getAttribute("data-form-field-name"),
      id: element.getAttribute("data-form-field-id"),
    }),
    xpath: getElementXPath(element),
    // 字节跳动特有属性
    bytedanceFieldId: element.getAttribute("data-form-field-id") || "",
    bytedanceFieldName: element.getAttribute("data-form-field-name") || "",
    bytedanceFieldLabel:
      element.getAttribute("data-form-field-i18n-name") || "",
  };
}

// ==========================================
// 标签查找 - 增强版
// ==========================================

/**
 * 查找字段的标签 - 增强版
 * 支持现代前端框架的多种标签定义方式
 */
function findFieldLabelEnhanced(element) {
  // 1. 优先使用 data 属性（很多现代框架会用这个）
  const dataLabel =
    element.getAttribute("data-form-field-i18n-name") ||
    element.getAttribute("data-label") ||
    element.getAttribute("data-field-label") ||
    element.getAttribute("data-name") ||
    element.getAttribute("data-title");
  if (dataLabel && dataLabel.length < 100) return dataLabel;

  // 2. aria-labelledby 属性
  const labelledBy = element.getAttribute("aria-labelledby");
  if (labelledBy) {
    const labelEl = document.getElementById(labelledBy);
    if (labelEl) {
      const text = getCleanText(labelEl);
      if (text && text.length < 100) return text;
    }
  }

  // 3. aria-label 属性
  const ariaLabel = element.getAttribute("aria-label");
  if (ariaLabel && ariaLabel.length < 100) return ariaLabel;

  // 4. 通过 for 属性关联的 label
  if (element.id) {
    const label = document.querySelector(
      `label[for="${CSS.escape(element.id)}"]`
    );
    if (label) {
      const text = getCleanText(label);
      if (text && text.length < 100) return text;
    }
  }

  // 5. 父级 label 元素
  const parentLabel = element.closest("label");
  if (parentLabel) {
    const clone = parentLabel.cloneNode(true);
    const inputs = clone.querySelectorAll("input, textarea, select, button");
    inputs.forEach((input) => input.remove());
    const text = clone.textContent.trim().replace(/\s+/g, " ");
    if (text && text.length < 100) return text;
  }

  // 6. 查找最近的表单项容器并提取标签
  const formItemLabel = findFormItemLabel(element);
  if (formItemLabel) return formItemLabel;

  // 7. 前面的兄弟元素
  let sibling = element.previousElementSibling;
  for (let i = 0; i < 3 && sibling; i++) {
    if (!containsInput(sibling)) {
      const text = getCleanText(sibling);
      if (text && text.length > 0 && text.length < 50) {
        return text;
      }
    }
    sibling = sibling.previousElementSibling;
  }

  // 8. 父元素中查找标签类元素
  const parent = element.parentElement;
  if (parent) {
    const labelSelectors = [
      "label",
      ".label",
      ".form-label",
      ".field-label",
      ".input-label",
      '[class*="label"]',
      '[class*="title"]',
    ];

    for (const selector of labelSelectors) {
      try {
        const labelEl = parent.querySelector(selector);
        if (labelEl && labelEl !== element && !labelEl.contains(element)) {
          const text = getCleanText(labelEl);
          if (text && text.length > 0 && text.length < 50) {
            return text;
          }
        }
      } catch (e) {
        // 忽略无效选择器错误
      }
    }

    // 查找父元素的前一个兄弟元素
    const parentSibling = parent.previousElementSibling;
    if (parentSibling && !containsInput(parentSibling)) {
      const text = getCleanText(parentSibling);
      if (text && text.length > 0 && text.length < 50) return text;
    }
  }

  // 9. 向上查找更多层级
  let ancestor = parent;
  for (let i = 0; i < 5 && ancestor; i++) {
    try {
      const labelEl = ancestor.querySelector(
        '[class*="label"]:not(input):not(textarea):not(select), [class*="title"]:not(input):not(textarea):not(select)'
      );
      if (labelEl && !labelEl.contains(element)) {
        const text = getCleanText(labelEl);
        if (text && text.length > 0 && text.length < 50) {
          return text;
        }
      }
    } catch (e) {
      // 忽略错误
    }
    ancestor = ancestor.parentElement;
  }

  // 10. 使用 placeholder 作为备选
  if (element.placeholder && element.placeholder.length < 50) {
    return element.placeholder;
  }

  return "";
}

/**
 * 查找表单项容器中的标签
 */
function findFormItemLabel(element) {
  // 常见的表单项容器类名模式
  const containerPatterns = [
    /form[-_]?item/i,
    /form[-_]?group/i,
    /form[-_]?field/i,
    /field[-_]?wrapper/i,
    /input[-_]?wrapper/i,
    /control[-_]?group/i,
    /form[-_]?control/i,
  ];

  // 常见的标签类名模式
  const labelPatterns = [
    /label/i,
    /title/i,
    /caption/i,
    /field[-_]?name/i,
    /form[-_]?name/i,
  ];

  let container = element.parentElement;
  for (let i = 0; i < 6 && container; i++) {
    const className = container.className || "";
    const isFormItem = containerPatterns.some((p) => p.test(className));

    if (isFormItem) {
      // 在容器中查找标签元素
      const children = container.querySelectorAll("*");
      for (const child of children) {
        if (child.contains(element) || child === element) continue;

        const childClass = child.className || "";
        const childTag = child.tagName.toLowerCase();
        const isLabel =
          labelPatterns.some((p) => p.test(childClass)) || childTag === "label";

        if (isLabel && !containsInput(child)) {
          const text = getCleanText(child);
          if (text && text.length > 0 && text.length < 50) {
            return text;
          }
        }
      }
    }
    container = container.parentElement;
  }

  return "";
}

// ==========================================
// 自定义组件检测 - 通用版本
// ==========================================

/**
 * 检测自定义输入组件 - 通用版本
 * 不再限制特定域名，适用于所有网站
 */
function detectCustomInputComponentsUniversal(processedElements) {
  const customFields = [];

  // 通用的表单项容器选择器
  const wrapperSelectors = [
    // 类名模式
    '[class*="form-item"]',
    '[class*="form-group"]',
    '[class*="form-field"]',
    '[class*="FormItem"]',
    '[class*="FormField"]',
    '[class*="FormGroup"]',
    '[class*="field-wrapper"]',
    '[class*="input-wrapper"]',
    '[class*="input-container"]',
    // data 属性
    "[data-form-item]",
    "[data-field]",
    '[data-testid*="field"]',
    '[data-testid*="input"]',
    '[data-testid*="form"]',
    // ARIA 属性
    '[role="group"]',
  ];

  try {
    document
      .querySelectorAll(wrapperSelectors.join(","))
      .forEach((wrapper, index) => {
        // 查找内部的输入元素
        const input = wrapper.querySelector(
          'input:not([type="hidden"]):not([type="submit"]):not([type="button"]), ' +
            "textarea, " +
            '[contenteditable="true"], ' +
            '[role="textbox"], ' +
            '[role="combobox"]'
        );

        if (
          !input ||
          !isElementVisible(input) ||
          processedElements.has(input)
        ) {
          return;
        }
        if (input.disabled || input.readOnly) return;

        // 查找标签
        const label = findLabelInWrapper(wrapper, input);

        customFields.push({
          index: 1000 + index,
          element: input,
          tagName: input.tagName.toLowerCase(),
          type: input.type || "text",
          name: input.name || input.getAttribute("data-name") || "",
          id: input.id || "",
          placeholder: input.placeholder || "",
          label: label,
          ariaLabel: input.getAttribute("aria-label") || "",
          dataField:
            wrapper.getAttribute("data-field") ||
            wrapper.getAttribute("data-name") ||
            "",
          className: wrapper.className,
          currentValue: input.value || input.textContent || "",
          keywords: generateFieldKeywords({
            label,
            placeholder: input.placeholder,
          }),
          xpath: getElementXPath(input),
        });
      });
  } catch (e) {
    console.warn("自定义组件检测出错:", e);
  }

  // 检测自定义下拉选择组件
  detectCustomSelectComponents(customFields, processedElements);

  return customFields;
}

/**
 * 在容器中查找标签
 */
function findLabelInWrapper(wrapper, inputElement) {
  // 标签选择器优先级
  const labelSelectors = [
    "label",
    '[class*="label"]',
    '[class*="Label"]',
    '[class*="title"]',
    '[class*="Title"]',
    '[class*="caption"]',
    '[class*="name"]',
  ];

  for (const selector of labelSelectors) {
    try {
      const elements = wrapper.querySelectorAll(selector);
      for (const labelEl of elements) {
        if (!labelEl.contains(inputElement) && labelEl !== inputElement) {
          const text = getCleanText(labelEl);
          // 清理必填标记
          const cleanText = text
            .replace(/[*\s必填（）()]/g, " ")
            .trim()
            .replace(/\s+/g, " ");
          if (cleanText && cleanText.length > 0 && cleanText.length < 50) {
            return cleanText;
          }
        }
      }
    } catch (e) {
      // 忽略无效选择器
    }
  }

  return "";
}

/**
 * 检测自定义下拉选择组件
 */
function detectCustomSelectComponents(customFields, processedElements) {
  const selectSelectors = [
    '[class*="select"]:not(select)',
    '[class*="Select"]:not(select)',
    '[class*="dropdown"]',
    '[class*="Dropdown"]',
    '[class*="picker"]',
    '[class*="Picker"]',
    '[role="listbox"]',
    '[aria-haspopup="listbox"]',
  ];

  try {
    document
      .querySelectorAll(selectSelectors.join(","))
      .forEach((selector, index) => {
        // 跳过原生 select 元素
        if (selector.tagName.toLowerCase() === "select") return;

        const triggerEl =
          selector.querySelector(
            '[class*="trigger"], [class*="value"], [class*="placeholder"], ' +
              '[role="button"], [role="combobox"], [tabindex]:not([tabindex="-1"])'
          ) || selector;

        if (!isElementVisible(triggerEl) || processedElements.has(triggerEl)) {
          return;
        }

        // 向上查找标签
        const container = selector.closest(
          '[class*="form-item"], [class*="form-group"], [class*="field"], [class*="FormItem"]'
        );
        const label = container ? findLabelInWrapper(container, selector) : "";

        customFields.push({
          index: 2000 + index,
          element: triggerEl,
          tagName: "custom-select",
          type: "select",
          label: label,
          name: selector.getAttribute("data-name") || "",
          id: selector.id || "",
          currentValue: triggerEl.textContent.trim(),
          keywords: generateFieldKeywords({ label }),
          isCustomSelect: true,
          xpath: getElementXPath(triggerEl),
        });
      });
  } catch (e) {
    console.warn("自定义下拉组件检测出错:", e);
  }
}

// ==========================================
// Shadow DOM 支持
// ==========================================

/**
 * 从 Shadow DOM 中提取字段
 */
function extractFieldsFromShadowDOM(processedElements) {
  const fields = [];

  try {
    // 查找所有可能带有 Shadow Root 的元素
    const allElements = document.querySelectorAll("*");

    allElements.forEach((host) => {
      if (host.shadowRoot) {
        const shadowFields = extractFieldsFromRoot(
          host.shadowRoot,
          processedElements
        );
        fields.push(...shadowFields);
      }
    });
  } catch (e) {
    console.warn("Shadow DOM 字段提取出错:", e);
  }

  return fields;
}

/**
 * 从指定根节点提取字段
 */
function extractFieldsFromRoot(root, processedElements) {
  const fields = [];
  const selectors = [
    'input[type="text"]',
    'input[type="tel"]',
    'input[type="email"]',
    'input[type="number"]',
    'input[type="date"]',
    "input:not([type])",
    "textarea",
    "select",
    '[contenteditable="true"]',
    '[role="textbox"]',
  ];

  try {
    const elements = root.querySelectorAll(selectors.join(","));

    elements.forEach((element, index) => {
      if (isElementVisible(element) && !processedElements.has(element)) {
        if (!element.disabled && !element.readOnly) {
          const fieldInfo = extractFieldInfo(element, 3000 + index);
          if (fieldInfo) {
            fields.push(fieldInfo);
          }
        }
      }
    });
  } catch (e) {
    console.warn("从 Shadow Root 提取字段出错:", e);
  }

  return fields;
}

// ==========================================
// 工具函数 - 增强版
// ==========================================

/**
 * 获取元素的干净文本（排除子输入元素的内容）
 */
function getCleanText(element) {
  if (!element) return "";

  try {
    const clone = element.cloneNode(true);
    clone
      .querySelectorAll("input, textarea, select, button, script, style")
      .forEach((el) => el.remove());
    return clone.textContent.trim().replace(/\s+/g, " ");
  } catch (e) {
    return element.textContent ? element.textContent.trim() : "";
  }
}

/**
 * 检查元素是否包含输入框
 */
function containsInput(element) {
  if (!element) return false;
  return element.querySelector("input, textarea, select") !== null;
}

/**
 * 生成字段关键词
 */
function generateFieldKeywords(fieldInfo) {
  const keywords = [];

  // 从各个属性中提取关键词
  const sources = [
    fieldInfo.label,
    fieldInfo.placeholder,
    fieldInfo.name,
    fieldInfo.id,
    fieldInfo.ariaLabel,
    fieldInfo.dataField,
  ];

  sources.forEach((source) => {
    if (source) {
      // 分词并添加
      const words = source
        .toLowerCase()
        .replace(/[_-]/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2") // 驼峰转空格
        .split(/\s+/)
        .filter((w) => w.length > 0);
      keywords.push(...words);
    }
  });

  return [...new Set(keywords)];
}

/**
 * 将简历数据扁平化
 */
function flattenResumeData(resumeData) {
  const fields = [];

  // 处理个人信息
  const personalInfo = resumeData.personalInfo || {};

  // 基本信息映射
  const basicFieldMappings = {
    name: ["姓名", "name", "fullname", "真实姓名", "full name", "姓 名"],
    gender: ["性别", "gender", "sex"],
    "birth-date": [
      "出生日期",
      "生日",
      "birthday",
      "birthdate",
      "出生年月",
      "birth date",
    ],
    phone: [
      "手机",
      "电话",
      "phone",
      "mobile",
      "tel",
      "联系电话",
      "手机号",
      "telephone",
      "cell",
    ],
    email: ["邮箱", "email", "电子邮箱", "邮件", "e-mail", "mail"],
    "id-card": ["身份证", "idcard", "身份证号", "id card", "identity"],
    location: [
      "所在地",
      "地址",
      "address",
      "location",
      "现居地",
      "居住地",
      "city",
      "城市",
    ],
    "political-status": ["政治面貌", "political", "党员"],
    "expected-position": [
      "期望职位",
      "目标职位",
      "应聘职位",
      "position",
      "job title",
      "职位",
    ],
    "expected-industry": ["期望行业", "目标行业", "industry", "行业"],
    "expected-salary": ["期望薪资", "薪资要求", "salary", "薪资", "薪酬"],
    "expected-location": ["期望地点", "工作地点", "work location", "期望城市"],
    "self-intro": [
      "自我介绍",
      "个人简介",
      "自我评价",
      "introduction",
      "about",
      "summary",
      "简介",
    ],
  };

  Object.entries(basicFieldMappings).forEach(([key, keywords]) => {
    const value = personalInfo[key];
    if (value) {
      fields.push({
        key: key,
        value: value,
        keywords: keywords,
        type: "basic",
      });
    }
  });

  // 处理教育经历
  if (resumeData.education && resumeData.education.length > 0) {
    resumeData.education.forEach((edu, index) => {
      const prefix = `education_${index}`;
      Object.entries(edu).forEach(([key, value]) => {
        if (value) {
          const cleanKey = key
            .replace(/\[\d+\]\[|\]/g, "")
            .replace(/education\[\d+\]/, "");
          fields.push({
            key: `${prefix}_${cleanKey}`,
            value: value,
            keywords: getEducationKeywords(cleanKey, index),
            type: "education",
            index: index,
          });
        }
      });
    });
  }

  // 处理工作经历
  if (resumeData.workExperience && resumeData.workExperience.length > 0) {
    resumeData.workExperience.forEach((work, index) => {
      const prefix = `work_${index}`;
      Object.entries(work).forEach(([key, value]) => {
        if (value) {
          const cleanKey = key
            .replace(/\[\d+\]\[|\]/g, "")
            .replace(/internship\[\d+\]/, "");
          fields.push({
            key: `${prefix}_${cleanKey}`,
            value: value,
            keywords: getWorkKeywords(cleanKey, index),
            type: "work",
            index: index,
          });
        }
      });
    });
  }

  // 处理项目经历
  if (resumeData.projects && resumeData.projects.length > 0) {
    resumeData.projects.forEach((project, index) => {
      const prefix = `project_${index}`;
      Object.entries(project).forEach(([key, value]) => {
        if (value) {
          const cleanKey = key
            .replace(/\[\d+\]\[|\]/g, "")
            .replace(/project\[\d+\]/, "");
          fields.push({
            key: `${prefix}_${cleanKey}`,
            value: value,
            keywords: getProjectKeywords(cleanKey, index),
            type: "project",
            index: index,
          });
        }
      });
    });
  }

  // 处理技能
  if (resumeData.skills && resumeData.skills.length > 0) {
    const skillNames = resumeData.skills
      .map((s) => {
        const nameKey = Object.keys(s).find((k) => k.includes("name"));
        return nameKey ? s[nameKey] : null;
      })
      .filter(Boolean);

    if (skillNames.length > 0) {
      fields.push({
        key: "skills",
        value: skillNames.join(", "),
        keywords: ["技能", "skills", "专业技能", "技术栈", "skill"],
        type: "skills",
      });
    }
  }

  // 处理语言能力
  if (resumeData.languages && resumeData.languages.length > 0) {
    const langInfo = resumeData.languages
      .map((l) => {
        const nameKey = Object.keys(l).find((k) => k.includes("name"));
        const levelKey = Object.keys(l).find(
          (k) => k.includes("proficiency") || k.includes("level")
        );
        const name = nameKey ? l[nameKey] : "";
        const level = levelKey ? l[levelKey] : "";
        return name ? `${name}${level ? "(" + level + ")" : ""}` : null;
      })
      .filter(Boolean);

    if (langInfo.length > 0) {
      fields.push({
        key: "languages",
        value: langInfo.join(", "),
        keywords: ["语言", "language", "外语", "语言能力", "languages"],
        type: "languages",
      });
    }
  }

  return fields;
}

/**
 * 获取教育经历字段关键词
 */
function getEducationKeywords(fieldKey, index) {
  const keywordMap = {
    school: [
      "学校",
      "院校",
      "school",
      "university",
      "college",
      "毕业院校",
      "学校名称",
    ],
    major: ["专业", "major", "专业名称", "所学专业"],
    degree: ["学历", "学位", "degree", "education", "学历/学位"],
    rank: ["排名", "rank", "gpa", "成绩", "绩点"],
    "start-date": ["入学时间", "开始时间", "start", "入学"],
    "end-date": ["毕业时间", "结束时间", "end", "graduation", "毕业"],
  };

  const baseKeywords = keywordMap[fieldKey] || [fieldKey];
  if (index === 0) {
    return [...baseKeywords, "最高学历", "第一学历"];
  }
  return baseKeywords;
}

/**
 * 获取工作经历字段关键词
 */
function getWorkKeywords(fieldKey, index) {
  const keywordMap = {
    company: [
      "公司",
      "企业",
      "company",
      "employer",
      "单位",
      "公司名称",
      "实习单位",
    ],
    position: ["职位", "岗位", "position", "title", "职务", "担任职位"],
    "start-date": ["入职时间", "开始时间", "start", "入职"],
    "end-date": ["离职时间", "结束时间", "end", "离职"],
    description: [
      "工作描述",
      "工作内容",
      "职责",
      "description",
      "duties",
      "工作职责",
    ],
  };

  return keywordMap[fieldKey] || [fieldKey];
}

/**
 * 获取项目经历字段关键词
 */
function getProjectKeywords(fieldKey, index) {
  const keywordMap = {
    "project-name": ["项目名称", "project", "项目", "project name"],
    role: ["角色", "role", "担任角色", "项目角色"],
    "project-time": ["项目时间", "时间", "项目周期"],
    "project-desc": ["项目描述", "description", "项目介绍", "项目简介"],
    responsibilities: ["职责", "responsibilities", "负责内容", "主要职责"],
  };

  return keywordMap[fieldKey] || [fieldKey];
}

/**
 * 智能匹配字段
 */
function matchFields(pageFields, resumeFields) {
  const mappings = [];
  const usedResumeFields = new Set();

  pageFields.forEach((pageField) => {
    let bestMatch = null;
    let bestScore = 0;

    resumeFields.forEach((resumeField) => {
      if (usedResumeFields.has(resumeField.key)) return;

      const score = calculateMatchScore(pageField, resumeField);
      if (score > bestScore && score >= 0.3) {
        bestScore = score;
        bestMatch = resumeField;
      }
    });

    if (bestMatch) {
      mappings.push({
        pageField: pageField,
        resumeField: bestMatch,
        score: bestScore,
      });
      // 基本信息字段可以重复使用（如姓名可能在多处出现）
      if (bestMatch.type !== "basic") {
        usedResumeFields.add(bestMatch.key);
      }
    }
  });

  // 按匹配分数排序
  mappings.sort((a, b) => b.score - a.score);

  return mappings;
}

/**
 * 计算匹配分数
 */
function calculateMatchScore(pageField, resumeField) {
  let score = 0;
  const resumeKeywords = resumeField.keywords || [];

  // 1. 关键词匹配
  const pageText = [
    pageField.label,
    pageField.placeholder,
    pageField.name,
    pageField.id,
    pageField.ariaLabel,
    pageField.dataField,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  resumeKeywords.forEach((keyword) => {
    if (pageText.includes(keyword.toLowerCase())) {
      score += 0.3;
    }
  });

  // 2. 精确匹配加分
  const exactMatches = [
    ["姓名", "name", "fullname"],
    ["手机", "phone", "tel", "mobile", "telephone"],
    ["邮箱", "email", "mail"],
    ["性别", "gender", "sex"],
    ["学校", "school", "university", "college"],
    ["专业", "major"],
    ["公司", "company", "employer"],
    ["职位", "position", "title"],
    ["地址", "address", "location", "city"],
  ];

  exactMatches.forEach((group) => {
    const pageHas = group.some((k) => pageText.includes(k));
    const resumeHas = group.some((k) =>
      resumeField.key.toLowerCase().includes(k)
    );
    if (pageHas && resumeHas) {
      score += 0.5;
    }
  });

  // 3. 字段类型匹配
  if (pageField.type === "email" && resumeField.key.includes("email")) {
    score += 0.4;
  }
  if (
    pageField.type === "tel" &&
    (resumeField.key.includes("phone") || resumeField.key.includes("tel"))
  ) {
    score += 0.4;
  }
  if (
    pageField.type === "date" &&
    (resumeField.key.includes("date") || resumeField.key.includes("time"))
  ) {
    score += 0.3;
  }

  return Math.min(score, 1);
}

/**
 * 执行字段填充
 */
function executeFieldFill(fieldMappings) {
  let filledCount = 0;
  let failedCount = 0;
  const details = [];

  fieldMappings.forEach((mapping) => {
    const { pageField, resumeField, score } = mapping;

    try {
      const element = pageField.element;
      const value = resumeField.value;

      if (!element || !value) {
        failedCount++;
        return;
      }

      // 根据元素类型执行填充
      const success = fillElement(element, value);

      if (success) {
        filledCount++;
        details.push({
          label: pageField.label || pageField.placeholder || pageField.name,
          value: value.substring(0, 50) + (value.length > 50 ? "..." : ""),
          score: score,
        });

        // 添加视觉反馈
        highlightFilledField(element);
      } else {
        failedCount++;
      }
    } catch (error) {
      console.error("填充字段失败:", error);
      failedCount++;
    }
  });

  return {
    filledCount,
    failedCount,
    details,
  };
}

/**
 * 填充单个元素 - 增强版
 * 支持更多类型的输入元素和现代前端框架
 */
function fillElement(element, value) {
  if (!element || value === undefined || value === null) return false;

  const tagName = element.tagName.toLowerCase();
  const isBytedance = window.location.hostname.includes("bytedance.com");

  console.log("fillElement 被调用:", { tagName, value, isBytedance, element });

  try {
    // 处理 select 元素
    if (tagName === "select") {
      return fillSelectElement(element, value);
    }

    // 处理 contenteditable 元素
    if (element.getAttribute("contenteditable") === "true") {
      element.focus();
      element.textContent = value;
      element.dispatchEvent(new Event("input", { bubbles: true }));
      element.dispatchEvent(new Event("change", { bubbles: true }));
      element.dispatchEvent(new Event("blur", { bubbles: true }));
      return true;
    }

    // 处理普通 input 和 textarea
    if (tagName === "input" || tagName === "textarea") {
      return fillInputElement(element, value);
    }

    // 处理自定义组件（字节跳动等网站可能使用）
    if (
      element.getAttribute("role") === "textbox" ||
      element.getAttribute("role") === "combobox" ||
      element.getAttribute("role") === "searchbox"
    ) {
      // 对于字节跳动网站，尝试查找内部的真实 input 元素
      if (isBytedance) {
        const innerInput = element.querySelector(
          "input, textarea, .ud__native-input"
        );
        if (innerInput) {
          console.log("找到内部输入元素，使用它进行填充");
          return fillInputElement(innerInput, value);
        }
      }

      element.focus();
      element.textContent = value;
      element.dispatchEvent(new Event("input", { bubbles: true }));
      element.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    }

    // 字节跳动特殊处理：检查是否是 ud__ 组件的包装器
    if (
      isBytedance &&
      element.className &&
      element.className.includes("ud__")
    ) {
      const innerInput = element.querySelector(
        "input, textarea, .ud__native-input"
      );
      if (innerInput) {
        console.log("在 ud__ 组件中找到内部输入元素");
        return fillInputElement(innerInput, value);
      }
    }

    return false;
  } catch (error) {
    console.error("填充元素失败:", error);
    return false;
  }
}

/**
 * 填充 input/textarea 元素
 * 针对 React/Vue/Angular 等框架优化
 */
function fillInputElement(element, value) {
  try {
    console.log("开始填充元素:", element, "值:", value);

    // 检测是否是字节跳动网站
    const isBytedance = window.location.hostname.includes("bytedance.com");

    // 对于字节跳动等使用 React 的网站，使用特殊的填充方法
    if (isBytedance) {
      return fillReactInput(element, value);
    }

    // 聚焦元素
    element.focus();

    // 对于 React 等框架，使用原生属性设置器
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    )?.set;

    const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value"
    )?.set;

    const setter =
      element.tagName.toLowerCase() === "textarea"
        ? nativeTextareaValueSetter
        : nativeInputValueSetter;

    if (setter) {
      setter.call(element, value);
    } else {
      element.value = value;
    }

    // 触发各种事件以确保框架能够捕获
    // 模拟用户输入的完整事件序列
    element.dispatchEvent(new Event("focus", { bubbles: true }));
    element.dispatchEvent(new Event("focusin", { bubbles: true }));

    // Input 事件
    element.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        cancelable: true,
        inputType: "insertText",
        data: value,
      })
    );

    // Change 事件
    element.dispatchEvent(new Event("change", { bubbles: true }));

    // Blur 事件
    element.dispatchEvent(new Event("blur", { bubbles: true }));
    element.dispatchEvent(new Event("focusout", { bubbles: true }));

    // 对于某些框架，可能需要再次触发 input 事件
    setTimeout(() => {
      element.dispatchEvent(new Event("input", { bubbles: true }));
    }, 0);

    return true;
  } catch (error) {
    console.error("填充 input 元素失败:", error);

    // 降级方案：直接设置 value
    try {
      element.value = value;
      element.dispatchEvent(new Event("input", { bubbles: true }));
      element.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    } catch (e) {
      return false;
    }
  }
}

/**
 * 针对 React 受控组件的特殊填充方法
 * 字节跳动等使用 React 的网站需要特殊处理
 */
function fillReactInput(element, value) {
  try {
    console.log("使用 React 专用填充方法");

    const tagName = element.tagName.toLowerCase();

    // 1. 首先聚焦元素
    element.focus();

    // 2. 模拟点击以确保元素被激活
    element.click();

    // 3. 获取原生的 value setter
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    )?.set;

    const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value"
    )?.set;

    const setter =
      tagName === "textarea"
        ? nativeTextareaValueSetter
        : nativeInputValueSetter;

    // 4. 使用原生 setter 设置值
    if (setter) {
      setter.call(element, value);
    } else {
      element.value = value;
    }

    // 5. 触发 React 能够捕获的事件
    // React 16+ 使用 SyntheticEvent，需要触发原生事件

    // 触发 focus 相关事件
    element.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
    element.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));

    // 关键：触发 input 事件，React 会监听这个事件来更新状态
    // 使用 InputEvent 而不是普通 Event
    const inputEvent = new InputEvent("input", {
      bubbles: true,
      cancelable: true,
      inputType: "insertText",
      data: value,
    });
    element.dispatchEvent(inputEvent);

    // 6. 触发 compositionend 事件（对于中文输入法支持）
    element.dispatchEvent(
      new CompositionEvent("compositionend", {
        bubbles: true,
        data: value,
      })
    );

    // 7. 触发 change 事件
    element.dispatchEvent(new Event("change", { bubbles: true }));

    // 8. 尝试通过 React 内部属性触发更新
    // React 会在 DOM 元素上挂载一些内部属性
    triggerReactUpdate(element, value);

    // 9. 触发 blur 事件（某些表单验证依赖这个）
    setTimeout(() => {
      element.dispatchEvent(new FocusEvent("blur", { bubbles: true }));
      element.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));

      // 再次触发 change 事件
      element.dispatchEvent(new Event("change", { bubbles: true }));
    }, 50);

    // 10. 延迟后再次触发 input 事件（某些 React 组件需要）
    setTimeout(() => {
      if (setter) {
        setter.call(element, value);
      }
      element.dispatchEvent(
        new InputEvent("input", {
          bubbles: true,
          cancelable: true,
          inputType: "insertText",
          data: value,
        })
      );
    }, 100);

    console.log("React 填充完成，当前值:", element.value);

    // 11. 最后验证填充是否成功，如果失败则使用模拟键盘输入
    setTimeout(() => {
      if (element.value !== value) {
        console.log("检测到值未更新，尝试模拟键盘输入");
        simulateKeyboardInput(element, value);
      }
    }, 200);

    return true;
  } catch (error) {
    console.error("React 填充失败:", error);

    // 降级方案：模拟键盘输入
    try {
      console.log("尝试降级方案：模拟键盘输入");
      return simulateKeyboardInput(element, value);
    } catch (e) {
      // 最后的降级方案
      try {
        element.value = value;
        element.dispatchEvent(new Event("input", { bubbles: true }));
        element.dispatchEvent(new Event("change", { bubbles: true }));
        return true;
      } catch (e2) {
        return false;
      }
    }
  }
}

/**
 * 模拟键盘输入
 * 这是最强力的填充方法，模拟用户逐字符输入
 */
function simulateKeyboardInput(element, value) {
  try {
    // 聚焦元素
    element.focus();
    element.click();

    // 清空现有内容
    element.value = "";
    element.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        inputType: "deleteContentBackward",
      })
    );

    // 获取原生 setter
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    )?.set;

    const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value"
    )?.set;

    const setter =
      element.tagName.toLowerCase() === "textarea"
        ? nativeTextareaValueSetter
        : nativeInputValueSetter;

    // 直接设置完整值
    if (setter) {
      setter.call(element, value);
    } else {
      element.value = value;
    }

    // 触发 compositionstart（模拟中文输入法开始）
    element.dispatchEvent(
      new CompositionEvent("compositionstart", {
        bubbles: true,
        data: "",
      })
    );

    // 触发 compositionupdate
    element.dispatchEvent(
      new CompositionEvent("compositionupdate", {
        bubbles: true,
        data: value,
      })
    );

    // 触发 beforeinput 事件
    element.dispatchEvent(
      new InputEvent("beforeinput", {
        bubbles: true,
        cancelable: true,
        inputType: "insertText",
        data: value,
      })
    );

    // 触发 input 事件
    element.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        cancelable: false,
        inputType: "insertText",
        data: value,
      })
    );

    // 触发 compositionend（模拟中文输入法结束）
    element.dispatchEvent(
      new CompositionEvent("compositionend", {
        bubbles: true,
        data: value,
      })
    );

    // 再次触发 input 事件（compositionend 后的 input）
    element.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        cancelable: false,
        inputType: "insertCompositionText",
        data: value,
      })
    );

    // 触发 change 事件
    element.dispatchEvent(new Event("change", { bubbles: true }));

    // 尝试触发 React 更新
    triggerReactUpdate(element, value);

    console.log("模拟键盘输入完成，当前值:", element.value);
    return true;
  } catch (error) {
    console.error("模拟键盘输入失败:", error);
    return false;
  }
}

/**
 * 尝试触发 React 内部更新
 * React 会在 DOM 元素上挂载一些以 __reactProps$ 或 __reactFiber$ 开头的属性
 */
function triggerReactUpdate(element, value) {
  try {
    // 查找 React 的内部属性
    const reactPropsKey = Object.keys(element).find(
      (key) =>
        key.startsWith("__reactProps$") ||
        key.startsWith("__reactEventHandlers$")
    );

    if (reactPropsKey) {
      const reactProps = element[reactPropsKey];
      console.log("找到 React 属性:", reactPropsKey);

      // 尝试调用 onChange 处理器
      if (reactProps && typeof reactProps.onChange === "function") {
        console.log("调用 React onChange 处理器");
        // 创建模拟的 React 事件对象
        const syntheticEvent = {
          target: element,
          currentTarget: element,
          type: "change",
          bubbles: true,
          cancelable: true,
          defaultPrevented: false,
          eventPhase: 2,
          isTrusted: true,
          nativeEvent: new Event("change", { bubbles: true }),
          preventDefault: () => {},
          stopPropagation: () => {},
          persist: () => {},
        };
        reactProps.onChange(syntheticEvent);
      }

      // 尝试调用 onInput 处理器
      if (reactProps && typeof reactProps.onInput === "function") {
        console.log("调用 React onInput 处理器");
        const syntheticEvent = {
          target: element,
          currentTarget: element,
          type: "input",
          bubbles: true,
          cancelable: true,
          defaultPrevented: false,
          eventPhase: 2,
          isTrusted: true,
          nativeEvent: new InputEvent("input", { bubbles: true, data: value }),
          preventDefault: () => {},
          stopPropagation: () => {},
          persist: () => {},
        };
        reactProps.onInput(syntheticEvent);
      }
    }

    // 尝试查找 React Fiber 节点
    const reactFiberKey = Object.keys(element).find(
      (key) =>
        key.startsWith("__reactFiber$") ||
        key.startsWith("__reactInternalInstance$")
    );

    if (reactFiberKey) {
      console.log("找到 React Fiber:", reactFiberKey);
      // Fiber 节点存在，说明是 React 管理的元素
      // 此时原生事件应该能够被 React 捕获
    }
  } catch (error) {
    console.warn("触发 React 更新失败:", error);
  }
}

/**
 * 填充 select 元素
 */
function fillSelectElement(selectElement, value) {
  const options = Array.from(selectElement.options);
  const valueStr = String(value).toLowerCase();

  // 尝试精确匹配
  let matchedOption = options.find(
    (opt) =>
      opt.value.toLowerCase() === valueStr ||
      opt.text.toLowerCase() === valueStr
  );

  // 尝试包含匹配
  if (!matchedOption) {
    matchedOption = options.find(
      (opt) =>
        opt.value.toLowerCase().includes(valueStr) ||
        opt.text.toLowerCase().includes(valueStr) ||
        valueStr.includes(opt.value.toLowerCase()) ||
        valueStr.includes(opt.text.toLowerCase())
    );
  }

  if (matchedOption) {
    selectElement.value = matchedOption.value;
    selectElement.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }

  return false;
}

/**
 * 高亮已填充的字段
 */
function highlightFilledField(element) {
  const originalBg = element.style.backgroundColor;
  const originalTransition = element.style.transition;
  const originalBoxShadow = element.style.boxShadow;

  element.style.transition = "all 0.3s ease";
  element.style.backgroundColor = "#d4edda";
  element.style.boxShadow = "0 0 0 2px #28a745";

  setTimeout(() => {
    element.style.backgroundColor = "#c3e6cb";
    setTimeout(() => {
      element.style.backgroundColor = originalBg;
      element.style.transition = originalTransition;
      element.style.boxShadow = originalBoxShadow;
    }, 500);
  }, 300);
}

// ==========================================
// 字段级填充模式
// ==========================================

function startFieldFillMode(fieldData) {
  if (!fieldData || typeof fieldData !== "object") {
    return { success: false, message: "字段数据缺失" };
  }

  if (!Object.prototype.hasOwnProperty.call(fieldData, "value")) {
    return { success: false, message: "字段值无效" };
  }

  // 先保存字段数据
  const newFieldFill = {
    fieldId: fieldData.fieldId || "",
    fieldLabel: fieldData.fieldLabel || fieldData.fieldId || "该字段",
    value: fieldData.value,
  };

  // 如果已经在填充模式，先停止（但不清除 pendingFieldFill）
  if (isFieldFillMode) {
    stopFieldFillModeCleanup();
  }

  // 设置新的待填充字段
  pendingFieldFill = newFieldFill;

  enableFieldFillMode();
  return { success: true };
}

function enableFieldFillMode() {
  if (!pendingFieldFill) {
    console.error("enableFieldFillMode: pendingFieldFill 为空");
    return;
  }

  isFieldFillMode = true;
  document.addEventListener("mouseover", handleFieldFillMouseOver, true);
  document.addEventListener("mouseout", handleFieldFillMouseOut, true);
  document.addEventListener("click", handleFieldFillClick, true);
  document.addEventListener("keydown", handleFieldFillKeyDown, true);

  document.body.style.cursor = "crosshair";

  const label = pendingFieldFill.fieldLabel || "该字段";
  showFieldFillTooltip(
    `正在为「${label}」选择目标输入框，点击要填入的位置，按 Esc 取消`
  );
}

/**
 * 停止字段填充模式（仅清理事件监听器和 UI）
 */
function stopFieldFillModeCleanup() {
  isFieldFillMode = false;

  document.removeEventListener("mouseover", handleFieldFillMouseOver, true);
  document.removeEventListener("mouseout", handleFieldFillMouseOut, true);
  document.removeEventListener("click", handleFieldFillClick, true);
  document.removeEventListener("keydown", handleFieldFillKeyDown, true);

  if (fieldFillHighlight) {
    fieldFillHighlight.style.outline = "";
    fieldFillHighlight = null;
  }

  document.body.style.cursor = "";
  hideFieldFillTooltip();
}

function stopFieldFillMode() {
  stopFieldFillModeCleanup();
  pendingFieldFill = null;
}

function handleFieldFillMouseOver(event) {
  const target = event.target;
  if (isFillableElement(target)) {
    target.style.outline = "2px solid #1890ff";
    fieldFillHighlight = target;
  }
}

function handleFieldFillMouseOut(event) {
  const target = event.target;
  if (target === fieldFillHighlight) {
    target.style.outline = "";
    fieldFillHighlight = null;
  }
}

function handleFieldFillClick(event) {
  event.preventDefault();
  event.stopPropagation();

  const target = event.target;
  const fillableElement = findFillableElement(target);

  if (fillableElement && pendingFieldFill) {
    const success = fillElement(fillableElement, pendingFieldFill.value);
    if (success) {
      highlightFilledField(fillableElement);
      showFieldFillTooltip("✓ 填充成功！", "success");
    } else {
      showFieldFillTooltip("✗ 填充失败，请重试", "error");
    }
  }

  setTimeout(() => stopFieldFillMode(), 1000);
}

function handleFieldFillKeyDown(event) {
  if (event.key === "Escape") {
    stopFieldFillMode();
  }
}

function findFillableElement(startElement) {
  let element = startElement;
  for (let i = 0; i < 5 && element; i++) {
    if (isFillableElement(element)) {
      return element;
    }
    element = element.parentElement;
  }
  return null;
}

function isFillableElement(element) {
  if (!element) return false;
  const tagName = element.tagName.toLowerCase();
  return (
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    element.getAttribute("contenteditable") === "true" ||
    element.getAttribute("role") === "textbox" ||
    element.getAttribute("role") === "combobox" ||
    element.getAttribute("role") === "searchbox"
  );
}

function showFieldFillTooltip(message, type = "info") {
  hideFieldFillTooltip();

  fieldFillTooltip = document.createElement("div");
  fieldFillTooltip.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 24px;
    background: ${
      type === "success" ? "#52c41a" : type === "error" ? "#ff4d4f" : "#1890ff"
    };
    color: white;
    border-radius: 8px;
    font-size: 14px;
    z-index: 999999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    animation: slideDown 0.3s ease;
  `;
  fieldFillTooltip.textContent = message;

  // 添加动画样式
  const style = document.createElement("style");
  style.id = "field-fill-tooltip-style";
  style.textContent = `
    @keyframes slideDown {
      from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
  `;

  // 避免重复添加样式
  if (!document.getElementById("field-fill-tooltip-style")) {
    document.head.appendChild(style);
  }

  document.body.appendChild(fieldFillTooltip);
}

function hideFieldFillTooltip() {
  if (fieldFillTooltip) {
    fieldFillTooltip.remove();
    fieldFillTooltip = null;
  }
}

// ==========================================
// 工具函数
// ==========================================

/**
 * 检查元素是否可见
 */
function isElementVisible(element) {
  if (!element) return false;

  try {
    const style = window.getComputedStyle(element);
    if (
      style.display === "none" ||
      style.visibility === "hidden" ||
      style.opacity === "0"
    ) {
      return false;
    }

    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  } catch (e) {
    return false;
  }
}

/**
 * 获取元素的 XPath
 */
function getElementXPath(element) {
  if (!element) return "";

  try {
    const paths = [];
    for (
      ;
      element && element.nodeType === Node.ELEMENT_NODE;
      element = element.parentNode
    ) {
      let index = 0;
      let hasFollowingSiblings = false;

      for (
        let sibling = element.previousSibling;
        sibling;
        sibling = sibling.previousSibling
      ) {
        if (sibling.nodeType === Node.DOCUMENT_TYPE_NODE) continue;
        if (sibling.nodeName === element.nodeName) ++index;
      }

      for (
        let sibling = element.nextSibling;
        sibling && !hasFollowingSiblings;
        sibling = sibling.nextSibling
      ) {
        if (sibling.nodeName === element.nodeName) hasFollowingSiblings = true;
      }

      const tagName = element.nodeName.toLowerCase();
      const pathIndex = index || hasFollowingSiblings ? `[${index + 1}]` : "";
      paths.unshift(tagName + pathIndex);
    }

    return paths.length ? "/" + paths.join("/") : "";
  } catch (e) {
    return "";
  }
}

// ==========================================
// 滚动检测预填功能
// ==========================================

// 滚动预填模式状态
let scrollPrefillEnabled = false;
let scrollPrefillUI = null;
let cachedResumeData = null;
let lastVisibleFields = [];
let scrollDebounceTimer = null;
let aiMatchingInProgress = false;
let currentMatchResults = [];

/**
 * 启用滚动预填模式
 */
function enableScrollPrefill(resumeData) {
  if (scrollPrefillEnabled) {
    console.log("滚动预填模式已启用");
    return;
  }

  scrollPrefillEnabled = true;
  cachedResumeData = resumeData;

  // 创建预填UI
  createScrollPrefillUI();

  // 添加滚动事件监听
  window.addEventListener("scroll", handleScrollForPrefill, { passive: true });
  window.addEventListener("wheel", handleWheelForPrefill, { passive: true });

  // 初始检测
  detectVisibleFieldsAndMatch();

  console.log("滚动预填模式已启用");
  showScrollPrefillToast("🔍 智能预填已启动，滚动页面自动检测表单");
}

/**
 * 禁用滚动预填模式
 */
function disableScrollPrefill() {
  scrollPrefillEnabled = false;
  cachedResumeData = null;
  lastVisibleFields = [];
  currentMatchResults = [];

  // 移除事件监听
  window.removeEventListener("scroll", handleScrollForPrefill);
  window.removeEventListener("wheel", handleWheelForPrefill);

  // 移除UI
  removeScrollPrefillUI();

  console.log("滚动预填模式已禁用");
}

/**
 * 处理滚动事件（带防抖）
 */
function handleScrollForPrefill() {
  if (!scrollPrefillEnabled) return;

  clearTimeout(scrollDebounceTimer);
  scrollDebounceTimer = setTimeout(() => {
    detectVisibleFieldsAndMatch();
  }, 300);
}

/**
 * 处理滚轮事件
 */
function handleWheelForPrefill(event) {
  if (!scrollPrefillEnabled) return;

  // 滚轮事件也触发检测（防抖处理）
  clearTimeout(scrollDebounceTimer);
  scrollDebounceTimer = setTimeout(() => {
    detectVisibleFieldsAndMatch();
  }, 300);
}

/**
 * 检测可见区域内的表单元素并进行AI匹配
 */
async function detectVisibleFieldsAndMatch() {
  if (!scrollPrefillEnabled || !cachedResumeData) return;
  if (aiMatchingInProgress) return;

  // 获取可见区域内的表单字段
  const visibleFields = getVisibleFormFields();

  if (visibleFields.length === 0) {
    updatePrefillUI([], "当前视图内没有检测到表单字段");
    return;
  }

  // 检查是否有新字段需要匹配
  const newFields = visibleFields.filter(
    (vf) => !lastVisibleFields.some((lf) => lf.element === vf.element)
  );

  if (newFields.length === 0 && currentMatchResults.length > 0) {
    // 没有新字段，保持当前匹配结果
    return;
  }

  lastVisibleFields = visibleFields;

  // 显示匹配中状态
  updatePrefillUI([], `正在分析 ${visibleFields.length} 个表单字段...`);

  // 调用AI匹配
  aiMatchingInProgress = true;
  try {
    const matchResults = await performAIFieldMatch(
      visibleFields,
      cachedResumeData
    );
    currentMatchResults = matchResults;
    updatePrefillUI(matchResults, null);
  } catch (error) {
    console.error("AI匹配失败:", error);
    updatePrefillUI([], `匹配失败: ${error.message}`);
  } finally {
    aiMatchingInProgress = false;
  }
}

/**
 * 获取当前可见区域内的表单字段
 */
function getVisibleFormFields() {
  const allFields = extractPageFields();
  const viewportHeight = window.innerHeight;
  const viewportTop = window.scrollY;
  const viewportBottom = viewportTop + viewportHeight;

  // 筛选可见区域内的字段（带一定的缓冲区）
  const buffer = 100; // 缓冲区像素
  const visibleFields = allFields.filter((field) => {
    if (!field.element) return false;

    const rect = field.element.getBoundingClientRect();
    const elementTop = rect.top + window.scrollY;
    const elementBottom = elementTop + rect.height;

    // 元素在可见区域内（包含缓冲区）
    return (
      elementBottom >= viewportTop - buffer &&
      elementTop <= viewportBottom + buffer
    );
  });

  console.log(
    `检测到 ${visibleFields.length}/${allFields.length} 个可见表单字段`
  );
  return visibleFields;
}

/**
 * 执行AI字段匹配
 */
async function performAIFieldMatch(pageFields, resumeData) {
  // 将简历数据扁平化
  const resumeFields = flattenResumeData(resumeData);

  if (resumeFields.length === 0) {
    return [];
  }

  // 准备发送给AI的字段信息
  const pageFieldsForAI = pageFields.map((f, i) => ({
    index: i,
    label: f.label || "",
    placeholder: f.placeholder || "",
    name: f.name || "",
    id: f.id || "",
    type: f.type || "text",
    ariaLabel: f.ariaLabel || "",
  }));

  const resumeFieldsForAI = resumeFields.map((f, i) => ({
    index: i,
    key: f.key,
    value: String(f.value).substring(0, 100),
    type: f.type,
    keywords: f.keywords.slice(0, 5),
  }));

  // 请求AI匹配
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      {
        action: "aiMatchFieldsRequest",
        pageFields: pageFieldsForAI,
        resumeFields: resumeFieldsForAI,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error("AI匹配请求失败:", chrome.runtime.lastError);
          // 降级到本地匹配
          const localMappings = matchFields(pageFields, resumeFields);
          resolve(
            localMappings.map((m) => ({
              pageField: m.pageField,
              resumeField: m.resumeField,
              confidence: m.score,
            }))
          );
          return;
        }

        if (response && response.success && response.mappings) {
          // 将AI匹配结果转换为可用格式
          const matchResults = response.mappings
            .filter((m) => m.pageIndex >= 0 && m.resumeIndex >= 0)
            .map((m) => ({
              pageField: pageFields[m.pageIndex],
              resumeField: resumeFields[m.resumeIndex],
              confidence: m.confidence || 0.8,
            }))
            .filter((m) => m.pageField && m.resumeField);

          resolve(matchResults);
        } else {
          // 降级到本地匹配
          const localMappings = matchFields(pageFields, resumeFields);
          resolve(
            localMappings.map((m) => ({
              pageField: m.pageField,
              resumeField: m.resumeField,
              confidence: m.score,
            }))
          );
        }
      }
    );
  });
}

/**
 * 创建滚动预填UI
 */
function createScrollPrefillUI() {
  if (scrollPrefillUI) return;

  scrollPrefillUI = document.createElement("div");
  scrollPrefillUI.id = "offer-laolao-scroll-prefill";
  scrollPrefillUI.innerHTML = `
    <style>
      #offer-laolao-scroll-prefill {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 360px;
        max-height: 450px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.15);
        z-index: 999998;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        overflow: hidden;
        transition: all 0.3s ease;
      }
      
      #offer-laolao-scroll-prefill.minimized {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        cursor: pointer;
      }
      
      #offer-laolao-scroll-prefill.minimized .prefill-content {
        display: none;
      }
      
      #offer-laolao-scroll-prefill.minimized .prefill-mini-icon {
        display: flex;
      }
      
      .prefill-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 14px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .prefill-header h4 {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .prefill-header-actions {
        display: flex;
        gap: 8px;
      }
      
      .prefill-header-actions button {
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        width: 28px;
        height: 28px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.2s;
      }
      
      .prefill-header-actions button:hover {
        background: rgba(255,255,255,0.3);
      }
      
      .prefill-content {
        max-height: 350px;
        overflow-y: auto;
      }
      
      .prefill-status {
        padding: 12px 16px;
        background: #f8f9fa;
        color: #666;
        font-size: 13px;
        text-align: center;
        border-bottom: 1px solid #eee;
      }
      
      .prefill-list {
        padding: 8px;
      }
      
      .prefill-item {
        display: flex;
        align-items: center;
        padding: 10px 12px;
        background: #f9f9f9;
        border-radius: 8px;
        margin-bottom: 8px;
        cursor: pointer;
        transition: all 0.2s;
        border: 1px solid transparent;
      }
      
      .prefill-item:hover {
        background: #e6f7ff;
        border-color: #91d5ff;
      }
      
      .prefill-item.filled {
        background: #f6ffed;
        border-color: #b7eb8f;
      }
      
      .prefill-item-info {
        flex: 1;
        min-width: 0;
      }
      
      .prefill-item-label {
        font-size: 13px;
        font-weight: 500;
        color: #333;
        margin-bottom: 2px;
      }
      
      .prefill-item-value {
        font-size: 12px;
        color: #666;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .prefill-item-confidence {
        font-size: 11px;
        color: #999;
        margin-left: 8px;
      }
      
      .prefill-item-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 12px;
        cursor: pointer;
        white-space: nowrap;
        transition: transform 0.2s;
      }
      
      .prefill-item-btn:hover {
        transform: scale(1.05);
      }
      
      .prefill-item-btn.filled {
        background: #52c41a;
      }
      
      .prefill-footer {
        padding: 12px 16px;
        background: #f8f9fa;
        border-top: 1px solid #eee;
        display: flex;
        gap: 10px;
      }
      
      .prefill-footer button {
        flex: 1;
        padding: 10px;
        border-radius: 8px;
        font-size: 13px;
        cursor: pointer;
        border: none;
        transition: all 0.2s;
      }
      
      .btn-fill-all {
        background: linear-gradient(135deg, #52c41a, #389e0d);
        color: white;
      }
      
      .btn-fill-all:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(82, 196, 26, 0.4);
      }
      
      .btn-close-prefill {
        background: #f0f0f0;
        color: #666;
      }
      
      .btn-close-prefill:hover {
        background: #e0e0e0;
      }
      
      .prefill-mini-icon {
        display: none;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
        font-size: 28px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }
      
      .prefill-empty {
        padding: 30px 20px;
        text-align: center;
        color: #999;
      }
      
      .prefill-empty-icon {
        font-size: 48px;
        margin-bottom: 12px;
      }
    </style>
    
    <div class="prefill-header">
      <h4>🎯 智能预填</h4>
      <div class="prefill-header-actions">
        <button id="prefill-minimize" title="最小化">−</button>
        <button id="prefill-close" title="关闭">×</button>
      </div>
    </div>
    
    <div class="prefill-content">
      <div class="prefill-status" id="prefill-status">
        正在检测表单字段...
      </div>
      <div class="prefill-list" id="prefill-list">
      </div>
    </div>
    
    <div class="prefill-footer">
      <button class="btn-fill-all" id="prefill-fill-all">✨ 一键填充全部</button>
      <button class="btn-close-prefill" id="prefill-stop">关闭预填</button>
    </div>
    
    <div class="prefill-mini-icon">🎯</div>
  `;

  document.body.appendChild(scrollPrefillUI);

  // 绑定事件
  document.getElementById("prefill-minimize").addEventListener("click", () => {
    scrollPrefillUI.classList.toggle("minimized");
  });

  scrollPrefillUI.addEventListener("click", (e) => {
    if (
      scrollPrefillUI.classList.contains("minimized") &&
      !e.target.closest("button")
    ) {
      scrollPrefillUI.classList.remove("minimized");
    }
  });

  document.getElementById("prefill-close").addEventListener("click", () => {
    scrollPrefillUI.classList.add("minimized");
  });

  document.getElementById("prefill-fill-all").addEventListener("click", () => {
    fillAllMatchedFields();
  });

  document.getElementById("prefill-stop").addEventListener("click", () => {
    disableScrollPrefill();
  });
}

/**
 * 更新预填UI
 */
function updatePrefillUI(matchResults, statusMessage) {
  if (!scrollPrefillUI) return;

  const statusEl = document.getElementById("prefill-status");
  const listEl = document.getElementById("prefill-list");

  if (statusMessage) {
    statusEl.textContent = statusMessage;
    statusEl.style.display = "block";
  } else if (matchResults.length > 0) {
    statusEl.textContent = `检测到 ${matchResults.length} 个可填充字段`;
    statusEl.style.display = "block";
  } else {
    statusEl.style.display = "none";
  }

  // 清空列表
  listEl.innerHTML = "";

  if (matchResults.length === 0 && !statusMessage) {
    listEl.innerHTML = `
      <div class="prefill-empty">
        <div class="prefill-empty-icon">📋</div>
        <div>滚动页面以检测更多表单字段</div>
      </div>
    `;
    return;
  }

  // 渲染匹配结果
  matchResults.forEach((match, index) => {
    const { pageField, resumeField, confidence } = match;
    const isFilled = pageField.element && pageField.element.value === resumeField.value;

    const item = document.createElement("div");
    item.className = `prefill-item ${isFilled ? "filled" : ""}`;
    item.innerHTML = `
      <div class="prefill-item-info">
        <div class="prefill-item-label">${escapeHtml(
          pageField.label || pageField.placeholder || pageField.name || "未知字段"
        )}</div>
        <div class="prefill-item-value">${escapeHtml(
          String(resumeField.value).substring(0, 40)
        )}${resumeField.value.length > 40 ? "..." : ""}</div>
      </div>
      <span class="prefill-item-confidence">${Math.round(
        confidence * 100
      )}%</span>
      <button class="prefill-item-btn ${isFilled ? "filled" : ""}" data-index="${index}">
        ${isFilled ? "✓ 已填" : "填充"}
      </button>
    `;

    // 点击填充按钮
    item.querySelector(".prefill-item-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      const success = fillElement(pageField.element, resumeField.value);
      if (success) {
        item.classList.add("filled");
        item.querySelector(".prefill-item-btn").textContent = "✓ 已填";
        item.querySelector(".prefill-item-btn").classList.add("filled");
        highlightFilledField(pageField.element);
      }
    });

    // 点击整行定位到字段
    item.addEventListener("click", () => {
      if (pageField.element) {
        pageField.element.scrollIntoView({ behavior: "smooth", block: "center" });
        pageField.element.focus();
        pageField.element.style.outline = "3px solid #667eea";
        setTimeout(() => {
          pageField.element.style.outline = "";
        }, 2000);
      }
    });

    listEl.appendChild(item);
  });
}

/**
 * 填充所有匹配的字段
 */
function fillAllMatchedFields() {
  let filledCount = 0;

  currentMatchResults.forEach((match) => {
    const { pageField, resumeField } = match;
    if (pageField.element && resumeField.value) {
      const success = fillElement(pageField.element, resumeField.value);
      if (success) {
        filledCount++;
        highlightFilledField(pageField.element);
      }
    }
  });

  showScrollPrefillToast(`✅ 成功填充 ${filledCount} 个字段`);

  // 更新UI
  updatePrefillUI(currentMatchResults, null);
}

/**
 * 移除预填UI
 */
function removeScrollPrefillUI() {
  if (scrollPrefillUI) {
    scrollPrefillUI.remove();
    scrollPrefillUI = null;
  }
}

/**
 * 显示预填提示Toast
 */
function showScrollPrefillToast(message) {
  const toast = document.createElement("div");
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 14px 28px;
    border-radius: 30px;
    font-size: 14px;
    font-weight: 500;
    z-index: 999999;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
    animation: slideDown 0.4s ease;
  `;
  toast.textContent = message;

  // 添加动画样式
  if (!document.getElementById("prefill-toast-style")) {
    const style = document.createElement("style");
    style.id = "prefill-toast-style";
    style.textContent = `
      @keyframes slideDown {
        from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideDown 0.3s ease reverse";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * HTML转义
 */
function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = String(text);
  return div.innerHTML;
}

// 监听启动滚动预填的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "startScrollPrefill") {
    console.log("收到启动滚动预填请求:", request.resumeData);
    enableScrollPrefill(request.resumeData);
    sendResponse({ success: true });
    return true;
  }

  if (request.action === "stopScrollPrefill") {
    disableScrollPrefill();
    sendResponse({ success: true });
    return true;
  }
});

// ==========================================
// 初始化
// ==========================================

console.log("简历自动填写助手 - 内容脚本加载完成");
console.log("当前页面:", window.location.href);
console.log("使用的适配器:", getSiteAdapter().name);

// 页面加载完成后检测表单
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    const fieldCount = extractPageFields().length;
    console.log(`页面DOM加载完成，检测到 ${fieldCount} 个可填充字段`);
  });
} else {
  const fieldCount = extractPageFields().length;
  console.log(`页面已加载，检测到 ${fieldCount} 个可填充字段`);
}
