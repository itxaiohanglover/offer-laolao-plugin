// 简历自动填写助手 - 内容脚本
// 专门针对招聘网站（如字节跳动校招）优化的智能预填功能

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

/**
 * 提取页面所有可填充字段
 */
function extractPageFields() {
  const fields = [];
  const processedElements = new Set();

  // 选择所有可能的输入元素
  const selectors = [
    'input[type="text"]',
    'input[type="tel"]',
    'input[type="email"]',
    'input[type="number"]',
    'input[type="date"]',
    'input[type="url"]',
    "input:not([type])",
    "textarea",
    "select",
    '[contenteditable="true"]',
    '[role="textbox"]',
    '[role="combobox"]',
  ];

  const elements = document.querySelectorAll(selectors.join(","));

  elements.forEach((element, index) => {
    // 跳过隐藏元素
    if (!isElementVisible(element)) return;
    // 跳过已处理的元素
    if (processedElements.has(element)) return;
    processedElements.add(element);

    const fieldInfo = extractFieldInfo(element, index);
    if (fieldInfo) {
      fields.push(fieldInfo);
    }
  });

  // 特殊处理：检测字节跳动等网站的自定义组件
  const customInputs = detectCustomInputComponents();
  customInputs.forEach((field) => {
    if (!fields.some((f) => f.element === field.element)) {
      fields.push(field);
    }
  });

  return fields;
}

/**
 * 提取单个字段的信息
 */
function extractFieldInfo(element, index) {
  // 获取字段标签
  // 优先使用 data-form-field-i18n-name 属性，因为它是明确的字段名称
  let label =
    element.getAttribute("data-form-field-i18n-name") ||
    findFieldLabel(element);

  // 获取字段的各种属性
  const info = {
    index: index,
    element: element,
    tagName: element.tagName.toLowerCase(),
    type: element.type || element.getAttribute("type") || "text",
    // 增强 name 和 id 的获取逻辑，支持 data-form-field-* 属性
    name:
      element.name ||
      element.getAttribute("data-form-field-name") ||
      element.getAttribute("data-name") ||
      "",
    id: element.id || element.getAttribute("data-form-field-id") || "",
    placeholder:
      element.placeholder || element.getAttribute("placeholder") || "",
    label: label,
    ariaLabel: element.getAttribute("aria-label") || "",
    dataField:
      element.getAttribute("data-field") ||
      element.getAttribute("data-name") ||
      element.getAttribute("data-test") || // 增加 data-test
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
 * 查找字段的标签
 */
function findFieldLabel(element) {
  // 1. 通过 for 属性关联的 label
  if (element.id) {
    const label = document.querySelector(`label[for="${element.id}"]`);
    if (label) return label.textContent.trim();
  }

  // 2. 父级 label 元素
  const parentLabel = element.closest("label");
  if (parentLabel) {
    const text = parentLabel.textContent
      .replace(element.value || "", "")
      .trim();
    if (text) return text;
  }

  // 3. 前面的兄弟元素或父元素中的文本
  let sibling = element.previousElementSibling;
  while (sibling) {
    const text = sibling.textContent.trim();
    if (text && text.length < 50) return text;
    sibling = sibling.previousElementSibling;
  }

  // 4. 父元素中查找标签类元素
  const parent = element.parentElement;
  if (parent) {
    // 查找常见的标签类名
    const labelSelectors = [
      ".label",
      ".form-label",
      ".field-label",
      ".input-label",
      '[class*="label"]',
      "span",
      "div",
    ];

    for (const selector of labelSelectors) {
      const labelEl = parent.querySelector(selector);
      if (labelEl && labelEl !== element) {
        const text = labelEl.textContent.trim();
        if (text && text.length < 50 && !text.includes(element.value || "")) {
          return text;
        }
      }
    }

    // 查找父元素的前一个兄弟元素
    const parentSibling = parent.previousElementSibling;
    if (parentSibling) {
      const text = parentSibling.textContent.trim();
      if (text && text.length < 50) return text;
    }
  }

  // 5. 向上查找更多层级
  let ancestor = parent;
  for (let i = 0; i < 3 && ancestor; i++) {
    const labelEl = ancestor.querySelector(
      '[class*="label"], [class*="title"]'
    );
    if (labelEl && labelEl.textContent.trim().length < 50) {
      return labelEl.textContent.trim();
    }
    ancestor = ancestor.parentElement;
  }

  return "";
}

/**
 * 检测自定义输入组件（如字节跳动的组件）
 */
function detectCustomInputComponents() {
  const customFields = [];

  // 字节跳动校招网站的特殊处理
  if (
    window.location.hostname.includes("bytedance.com") ||
    window.location.hostname.includes("jobs.bytedance")
  ) {
    // 检测 React/Vue 组件包装的输入框
    const wrappers = document.querySelectorAll(
      '[class*="input"], [class*="Input"], [class*="field"], [class*="Field"], ' +
        '[class*="form-item"], [class*="FormItem"], [data-testid]'
    );

    wrappers.forEach((wrapper, index) => {
      // 查找内部的实际输入元素
      const input = wrapper.querySelector("input, textarea, [contenteditable]");
      if (input && isElementVisible(input)) {
        // 查找标签
        const labelEl = wrapper.querySelector(
          '[class*="label"], [class*="Label"], [class*="title"], [class*="Title"]'
        );
        const label = labelEl ? labelEl.textContent.trim() : "";

        customFields.push({
          index: 1000 + index,
          element: input,
          tagName: input.tagName.toLowerCase(),
          type: input.type || "text",
          name: input.name || "",
          id: input.id || "",
          placeholder: input.placeholder || "",
          label: label,
          ariaLabel: input.getAttribute("aria-label") || "",
          dataField: wrapper.getAttribute("data-field") || "",
          className: wrapper.className,
          currentValue: input.value || "",
          keywords: generateFieldKeywords({
            label,
            placeholder: input.placeholder,
          }),
          xpath: getElementXPath(input),
        });
      }
    });

    // 检测下拉选择器
    const selectors = document.querySelectorAll(
      '[class*="select"], [class*="Select"], [class*="dropdown"], [class*="Dropdown"]'
    );

    selectors.forEach((selector, index) => {
      const triggerEl = selector.querySelector(
        '[class*="trigger"], [class*="value"], [role="button"], [role="combobox"]'
      );
      if (triggerEl && isElementVisible(triggerEl)) {
        const labelEl = selector
          .closest('[class*="form-item"], [class*="field"]')
          ?.querySelector('[class*="label"]');

        customFields.push({
          index: 2000 + index,
          element: triggerEl,
          tagName: "custom-select",
          type: "select",
          label: labelEl ? labelEl.textContent.trim() : "",
          currentValue: triggerEl.textContent.trim(),
          keywords: generateFieldKeywords({
            label: labelEl?.textContent || "",
          }),
          isCustomSelect: true,
          xpath: getElementXPath(triggerEl),
        });
      }
    });
  }

  return customFields;
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
    name: ["姓名", "name", "fullname", "真实姓名"],
    gender: ["性别", "gender", "sex"],
    "birth-date": ["出生日期", "生日", "birthday", "birthdate", "出生年月"],
    phone: ["手机", "电话", "phone", "mobile", "tel", "联系电话", "手机号"],
    email: ["邮箱", "email", "电子邮箱", "邮件"],
    "id-card": ["身份证", "idcard", "身份证号"],
    location: ["所在地", "地址", "address", "location", "现居地", "居住地"],
    "political-status": ["政治面貌", "political"],
    "expected-position": ["期望职位", "目标职位", "应聘职位", "position"],
    "expected-industry": ["期望行业", "目标行业", "industry"],
    "expected-salary": ["期望薪资", "薪资要求", "salary"],
    "expected-location": ["期望地点", "工作地点", "work location"],
    "self-intro": ["自我介绍", "个人简介", "自我评价", "introduction", "about"],
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
        keywords: ["技能", "skills", "专业技能", "技术栈"],
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
        keywords: ["语言", "language", "外语", "语言能力"],
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
    school: ["学校", "院校", "school", "university", "college", "毕业院校"],
    major: ["专业", "major", "专业名称"],
    degree: ["学历", "学位", "degree", "education"],
    rank: ["排名", "rank", "gpa", "成绩"],
    "start-date": ["入学时间", "开始时间", "start"],
    "end-date": ["毕业时间", "结束时间", "end", "graduation"],
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
    company: ["公司", "企业", "company", "employer", "单位"],
    position: ["职位", "岗位", "position", "title", "职务"],
    "start-date": ["入职时间", "开始时间", "start"],
    "end-date": ["离职时间", "结束时间", "end"],
    description: ["工作描述", "工作内容", "职责", "description", "duties"],
  };

  return keywordMap[fieldKey] || [fieldKey];
}

/**
 * 获取项目经历字段关键词
 */
function getProjectKeywords(fieldKey, index) {
  const keywordMap = {
    "project-name": ["项目名称", "project", "项目"],
    role: ["角色", "role", "担任角色"],
    "project-time": ["项目时间", "时间"],
    "project-desc": ["项目描述", "description", "项目介绍"],
    responsibilities: ["职责", "responsibilities", "负责内容"],
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
  const pageKeywords = pageField.keywords || [];
  const resumeKeywords = resumeField.keywords || [];

  // 1. 关键词匹配
  const pageText = [
    pageField.label,
    pageField.placeholder,
    pageField.name,
    pageField.id,
    pageField.ariaLabel,
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
    ["姓名", "name"],
    ["手机", "phone", "tel", "mobile"],
    ["邮箱", "email"],
    ["性别", "gender"],
    ["学校", "school", "university"],
    ["专业", "major"],
    ["公司", "company"],
    ["职位", "position"],
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
 * 填充单个元素
 */
function fillElement(element, value) {
  if (!element || value === undefined || value === null) return false;

  const tagName = element.tagName.toLowerCase();
  const type = element.type || "";

  try {
    // 处理 select 元素
    if (tagName === "select") {
      return fillSelectElement(element, value);
    }

    // 处理 contenteditable 元素
    if (element.getAttribute("contenteditable") === "true") {
      element.textContent = value;
      element.dispatchEvent(new Event("input", { bubbles: true }));
      element.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    }

    // 处理普通 input 和 textarea
    if (tagName === "input" || tagName === "textarea") {
      // 聚焦元素
      element.focus();

      // 清空并设置值
      element.value = "";
      element.value = value;

      // 触发各种事件以确保框架能够捕获
      element.dispatchEvent(new Event("focus", { bubbles: true }));
      element.dispatchEvent(new Event("input", { bubbles: true }));
      element.dispatchEvent(new Event("change", { bubbles: true }));
      element.dispatchEvent(new Event("blur", { bubbles: true }));

      // 对于 React 等框架，可能需要模拟原生输入
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      )?.set;

      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(element, value);
        element.dispatchEvent(new Event("input", { bubbles: true }));
      }

      return true;
    }

    // 处理自定义组件
    if (
      element.getAttribute("role") === "textbox" ||
      element.getAttribute("role") === "combobox"
    ) {
      element.textContent = value;
      element.dispatchEvent(new Event("input", { bubbles: true }));
      return true;
    }

    return false;
  } catch (error) {
    console.error("填充元素失败:", error);
    return false;
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

  element.style.transition = "background-color 0.3s ease";
  element.style.backgroundColor = "#d4edda";

  setTimeout(() => {
    element.style.backgroundColor = "#c3e6cb";
    setTimeout(() => {
      element.style.backgroundColor = originalBg;
      element.style.transition = originalTransition;
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
    element.getAttribute("role") === "textbox"
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
  style.textContent = `
    @keyframes slideDown {
      from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
  `;
  document.head.appendChild(style);
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
}

/**
 * 获取元素的 XPath
 */
function getElementXPath(element) {
  if (!element) return "";

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
}

// ==========================================
// 初始化
// ==========================================

console.log("简历自动填写助手 - 内容脚本加载完成");
console.log("当前页面:", window.location.href);

// 页面加载完成后检测表单
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    console.log(
      "页面DOM加载完成，检测到",
      extractPageFields().length,
      "个可填充字段"
    );
  });
} else {
  console.log("页面已加载，检测到", extractPageFields().length, "个可填充字段");
}
