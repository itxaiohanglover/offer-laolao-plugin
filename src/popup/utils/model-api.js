// 模型 API 调用模块
// 支持火山引擎、DeepSeek、Kimi、Qwen 等国产大模型

/**
 * 支持的模型提供商配置
 */
const MODEL_PROVIDERS = {
  // 火山引擎（字节跳动）
  volcengine: {
    name: "火山引擎",
    baseUrl: "https://ark.cn-beijing.volces.com/api/v3",
    models: [
      { id: "doubao-seed-1-6-251015", name: "豆包 Seed 1.6" },
      { id: "doubao-seed-1-6-lite-251015", name: "豆包 Seed 1.6 Lite" },
      { id: "doubao-seed-1-6-flash-250828", name: "豆包 Seed 1.6 Flash" },
    ],
    authHeader: "Authorization",
    authPrefix: "Bearer ",
  },
  // DeepSeek
  deepseek: {
    name: "DeepSeek",
    baseUrl: "https://api.deepseek.com/v1",
    models: [
      { id: "deepseek-chat", name: "DeepSeek Chat" },
      { id: "deepseek-coder", name: "DeepSeek Coder" },
    ],
    authHeader: "Authorization",
    authPrefix: "Bearer ",
  },
  // Kimi（月之暗面）
  kimi: {
    name: "Kimi (月之暗面)",
    baseUrl: "https://api.moonshot.cn/v1",
    models: [
      { id: "moonshot-v1-8k", name: "Moonshot 8K" },
      { id: "moonshot-v1-32k", name: "Moonshot 32K" },
      { id: "moonshot-v1-128k", name: "Moonshot 128K" },
    ],
    authHeader: "Authorization",
    authPrefix: "Bearer ",
  },
  // 通义千问（阿里云）
  qwen: {
    name: "通义千问 (阿里云)",
    baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    models: [
      { id: "qwen-turbo", name: "Qwen Turbo" },
      { id: "qwen-plus", name: "Qwen Plus" },
      { id: "qwen-max", name: "Qwen Max" },
      { id: "qwen-max-longcontext", name: "Qwen Max 长文本" },
    ],
    authHeader: "Authorization",
    authPrefix: "Bearer ",
  },
  // 智谱 AI（GLM）
  zhipu: {
    name: "智谱 AI",
    baseUrl: "https://open.bigmodel.cn/api/paas/v4",
    models: [
      { id: "glm-4", name: "GLM-4" },
      { id: "glm-4-flash", name: "GLM-4 Flash" },
      { id: "glm-3-turbo", name: "GLM-3 Turbo" },
    ],
    authHeader: "Authorization",
    authPrefix: "Bearer ",
  },
  // 百川智能
  baichuan: {
    name: "百川智能",
    baseUrl: "https://api.baichuan-ai.com/v1",
    models: [
      { id: "Baichuan2-Turbo", name: "百川2 Turbo" },
      { id: "Baichuan2-Turbo-192k", name: "百川2 Turbo 192K" },
    ],
    authHeader: "Authorization",
    authPrefix: "Bearer ",
  },
  // 自定义/兼容 OpenAI 格式
  custom: {
    name: "自定义 (OpenAI 兼容)",
    baseUrl: "",
    models: [],
    authHeader: "Authorization",
    authPrefix: "Bearer ",
  },
};

/**
 * 获取所有支持的模型提供商列表
 * @returns {Array} 提供商列表
 */
function getModelProviders() {
  return Object.entries(MODEL_PROVIDERS).map(([key, value]) => ({
    id: key,
    name: value.name,
    models: value.models,
  }));
}

/**
 * 根据提供商 ID 获取模型列表
 * @param {string} providerId - 提供商 ID
 * @returns {Array} 模型列表
 */
function getModelsByProvider(providerId) {
  const provider = MODEL_PROVIDERS[providerId];
  return provider ? provider.models : [];
}

/**
 * 获取模型配置
 * @returns {object} 模型配置对象
 */
function getModelConfig() {
  if (typeof loadDataFromStorage !== "function") {
    console.error("loadDataFromStorage function not found");
    return {
      provider: "deepseek",
      apiKey: "",
      model: "",
      customUrl: "",
    };
  }

  const settings = loadDataFromStorage("modelSettings");
  if (!settings || typeof settings !== "object") {
    return {
      provider: "deepseek",
      apiKey: "",
      model: "",
      customUrl: "",
    };
  }

  return {
    provider: settings.provider || "deepseek",
    apiKey: settings.apiKey || "",
    model: settings.model || "",
    customUrl: settings.customUrl || settings.url || "",
  };
}

/**
 * 保存模型配置
 * @param {object} config - 配置对象
 */
function saveModelConfig(config) {
  if (typeof saveDataToStorage !== "function") {
    console.error("saveDataToStorage function not found");
    return false;
  }

  return saveDataToStorage(config, "modelSettings");
}

/**
 * 构建 API 请求 URL
 * @param {string} providerId - 提供商 ID
 * @param {string} customUrl - 自定义 URL
 * @returns {string} API URL
 */
function buildApiUrl(providerId, customUrl) {
  if (providerId === "custom" && customUrl) {
    // 自定义 URL，确保以 /chat/completions 结尾
    const url = customUrl.replace(/\/+$/, "");
    if (!url.endsWith("/chat/completions")) {
      return url + "/chat/completions";
    }
    return url;
  }

  const provider = MODEL_PROVIDERS[providerId];
  if (!provider) {
    throw new Error(`未知的模型提供商: ${providerId}`);
  }

  return provider.baseUrl + "/chat/completions";
}

/**
 * 调用大模型 API
 * @param {string} prompt - 提示词
 * @param {object} options - 可选配置
 * @returns {Promise<string>} 模型响应文本
 */
async function callModelAPI(prompt, options = {}) {
  const config = getModelConfig();

  if (!config.apiKey) {
    throw new Error("请先在设置中配置模型 API Key");
  }

  if (!config.model && config.provider !== "custom") {
    throw new Error("请先在设置中选择要使用的模型");
  }

  const providerId = config.provider || "deepseek";
  const provider = MODEL_PROVIDERS[providerId];

  if (!provider) {
    throw new Error(`未知的模型提供商: ${providerId}`);
  }

  const apiUrl = buildApiUrl(providerId, config.customUrl);
  const modelId = config.model || options.model || "deepseek-chat";

  console.log("调用模型 API:", {
    provider: providerId,
    model: modelId,
    url: apiUrl,
  });

  const requestBody = {
    model: modelId,
    messages: [
      {
        role: "system",
        content:
          options.systemPrompt ||
          "你是一个专业的简历填写助手，帮助用户优化和填写简历内容。请用中文回答。",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: options.temperature || 0.7,
    max_tokens: options.maxTokens || 2000,
    stream: false,
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [provider.authHeader]: provider.authPrefix + config.apiKey,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("模型 API 请求失败:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });

      if (response.status === 401) {
        throw new Error("API 认证失败，请检查 API Key 是否正确");
      }
      if (response.status === 429) {
        throw new Error("请求过于频繁，请稍后再试");
      }
      if (response.status === 400) {
        throw new Error("请求参数错误: " + errorText);
      }

      throw new Error(`API 请求失败: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log("模型 API 响应:", result);

    // 提取响应文本
    if (result.choices && result.choices.length > 0) {
      const message = result.choices[0].message;
      if (message && message.content) {
        return message.content;
      }
    }

    // 兼容不同的响应格式
    if (result.output && result.output.text) {
      return result.output.text;
    }
    if (result.result) {
      return result.result;
    }

    throw new Error("无法解析模型响应");
  } catch (error) {
    console.error("调用模型 API 失败:", error);
    throw error;
  }
}

/**
 * 使用模型优化简历内容
 * @param {string} fieldName - 字段名称
 * @param {string} currentValue - 当前值
 * @param {object} context - 上下文信息
 * @returns {Promise<string>} 优化后的内容
 */
async function optimizeResumeField(fieldName, currentValue, context = {}) {
  const fieldPrompts = {
    "self-intro": `请帮我优化以下自我介绍，使其更加专业和有吸引力：

当前内容：${currentValue || "（空）"}

${context.position ? `目标职位：${context.position}` : ""}
${context.industry ? `目标行业：${context.industry}` : ""}

请直接输出优化后的自我介绍，不要包含其他解释。字数控制在200-300字。`,

    "project-desc": `请帮我优化以下项目描述，使其更加专业和有条理：

项目名称：${context.projectName || ""}
当前描述：${currentValue || "（空）"}

请直接输出优化后的项目描述，使用 STAR 法则（情境-任务-行动-结果）来组织内容。`,

    responsibilities: `请帮我优化以下职责描述，使其更加专业：

职位：${context.position || ""}
当前描述：${currentValue || "（空）"}

请直接输出优化后的职责描述，使用动词开头，突出成果和数据。`,

    description: `请帮我优化以下工作/实习描述：

公司：${context.company || ""}
职位：${context.position || ""}
当前描述：${currentValue || "（空）"}

请直接输出优化后的描述，突出工作成果和个人贡献。`,
  };

  const prompt =
    fieldPrompts[fieldName] ||
    `请帮我优化以下简历内容（${fieldName}）：

当前内容：${currentValue || "（空）"}

请直接输出优化后的内容，使其更加专业和有吸引力。`;

  return await callModelAPI(prompt);
}

/**
 * 使用模型生成简历内容建议
 * @param {object} resumeData - 当前简历数据
 * @returns {Promise<object>} 建议内容
 */
async function generateResumeSuggestions(resumeData) {
  const personalInfo = resumeData.personalInfo || {};

  const prompt = `作为专业的简历顾问，请根据以下简历信息提供改进建议：

姓名：${personalInfo.name || "未填写"}
期望职位：${personalInfo["expected-position"] || "未填写"}
期望行业：${personalInfo["expected-industry"] || "未填写"}

教育经历数量：${(resumeData.education || []).length}
工作经历数量：${(resumeData.workExperience || []).length}
项目经历数量：${(resumeData.projects || []).length}
技能数量：${(resumeData.skills || []).length}

请提供以下方面的具体建议：
1. 简历完整性评估
2. 内容优化建议
3. 针对目标职位的建议

请以 JSON 格式返回，包含 completeness（完整性评分0-100）、suggestions（建议数组）、tips（小贴士数组）三个字段。`;

  try {
    const response = await callModelAPI(prompt);

    // 尝试解析 JSON
    try {
      // 提取 JSON 部分
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.warn("无法解析为 JSON，返回原始响应");
    }

    return {
      completeness: 0,
      suggestions: [response],
      tips: [],
    };
  } catch (error) {
    console.error("生成简历建议失败:", error);
    throw error;
  }
}

/**
 * 测试模型 API 连接
 * @returns {Promise<object>} 测试结果
 */
async function testModelConnection() {
  const config = getModelConfig();

  if (!config.apiKey) {
    return {
      success: false,
      message: "请先配置 API Key",
    };
  }

  try {
    const response = await callModelAPI("你好，请回复'连接成功'", {
      maxTokens: 50,
      temperature: 0,
    });

    return {
      success: true,
      message: "连接成功",
      response: response,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}

/**
 * 一键优化整份简历
 * @param {object} resumeData - 当前简历数据
 * @param {function} onProgress - 进度回调函数
 * @returns {Promise<object>} 优化后的简历数据
 */
async function optimizeEntireResume(resumeData, onProgress = () => {}) {
  const optimizedData = JSON.parse(JSON.stringify(resumeData)); // 深拷贝
  const personalInfo = resumeData.personalInfo || {};
  const targetPosition = personalInfo["expected-position"] || "";
  const targetIndustry = personalInfo["expected-industry"] || "";

  // 定义需要优化的内容及其顺序
  const optimizationTasks = [];

  // 1. 优化自我介绍
  if (personalInfo["self-intro"] && personalInfo["self-intro"].trim()) {
    optimizationTasks.push({
      type: "self-intro",
      name: "自我介绍",
      currentValue: personalInfo["self-intro"],
    });
  }

  // 2. 优化工作经历描述
  if (resumeData.workExperience && resumeData.workExperience.length > 0) {
    resumeData.workExperience.forEach((work, index) => {
      const descKey = Object.keys(work).find((k) => k.includes("description"));
      const companyKey = Object.keys(work).find((k) => k.includes("company"));
      const positionKey = Object.keys(work).find((k) => k.includes("position"));

      if (descKey && work[descKey] && String(work[descKey]).trim()) {
        const companyName = companyKey ? work[companyKey] || "" : "";
        const positionName = positionKey ? work[positionKey] || "" : "";

        optimizationTasks.push({
          type: "work-description",
          name: `工作经历 ${index + 1} - ${companyName}`,
          index: index,
          key: descKey,
          currentValue: work[descKey],
          context: {
            company: companyName,
            position: positionName,
          },
        });
      }
    });
  }

  // 3. 优化项目经历描述
  if (resumeData.projects && resumeData.projects.length > 0) {
    resumeData.projects.forEach((project, index) => {
      const descKey = Object.keys(project).find(
        (k) => k.includes("desc") || k.includes("description")
      );
      const respKey = Object.keys(project).find((k) =>
        k.includes("responsibilities")
      );
      const nameKey = Object.keys(project).find(
        (k) => k.includes("name") || k.includes("project-name")
      );
      const projectName = nameKey ? project[nameKey] || "" : "";

      if (descKey && project[descKey] && String(project[descKey]).trim()) {
        optimizationTasks.push({
          type: "project-desc",
          name: `项目描述 - ${projectName}`,
          index: index,
          key: descKey,
          currentValue: project[descKey],
          context: { projectName },
        });
      }

      if (respKey && project[respKey] && String(project[respKey]).trim()) {
        optimizationTasks.push({
          type: "project-responsibilities",
          name: `项目职责 - ${projectName}`,
          index: index,
          key: respKey,
          currentValue: project[respKey],
          context: { projectName },
        });
      }
    });
  }

  if (optimizationTasks.length === 0) {
    throw new Error("没有找到可优化的内容，请先填写简历的描述性内容");
  }

  const totalTasks = optimizationTasks.length;
  let completedTasks = 0;

  // 逐个优化
  for (const task of optimizationTasks) {
    onProgress({
      current: completedTasks,
      total: totalTasks,
      currentTask: task.name,
      status: "processing",
    });

    try {
      let optimizedContent = "";

      if (task.type === "self-intro") {
        optimizedContent = await optimizeSelfIntro(
          task.currentValue,
          targetPosition,
          targetIndustry
        );
        if (optimizedContent) {
          optimizedData.personalInfo["self-intro"] = optimizedContent;
        }
      } else if (task.type === "work-description") {
        optimizedContent = await optimizeWorkDescription(
          task.currentValue,
          task.context
        );
        if (optimizedContent && optimizedData.workExperience[task.index]) {
          optimizedData.workExperience[task.index][task.key] = optimizedContent;
        }
      } else if (task.type === "project-desc") {
        optimizedContent = await optimizeProjectDescription(
          task.currentValue,
          task.context
        );
        if (optimizedContent && optimizedData.projects[task.index]) {
          optimizedData.projects[task.index][task.key] = optimizedContent;
        }
      } else if (task.type === "project-responsibilities") {
        optimizedContent = await optimizeResponsibilities(
          task.currentValue,
          task.context
        );
        if (optimizedContent && optimizedData.projects[task.index]) {
          optimizedData.projects[task.index][task.key] = optimizedContent;
        }
      }

      completedTasks++;
      onProgress({
        current: completedTasks,
        total: totalTasks,
        currentTask: task.name,
        status: "completed",
        optimizedContent: optimizedContent,
      });

      // 添加延迟，避免 API 请求过于频繁
      if (completedTasks < totalTasks) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error(`优化 ${task.name} 失败:`, error);
      completedTasks++;
      onProgress({
        current: completedTasks,
        total: totalTasks,
        currentTask: task.name,
        status: "error",
        error: error.message,
      });
    }
  }

  return optimizedData;
}

/**
 * 优化自我介绍
 */
async function optimizeSelfIntro(content, position, industry) {
  const prompt = `作为专业的简历优化专家，请帮我优化以下自我介绍，使其更加专业、有吸引力且符合求职需求。

【当前自我介绍】
${content}

${position ? `【目标职位】${position}` : ""}
${industry ? `【目标行业】${industry}` : ""}

【优化要求】
1. 突出核心竞争力和个人优势
2. 使用量化数据和具体成果（如有）
3. 语言简洁有力，避免空洞的形容词
4. 控制在 150-250 字之间
5. 如果有目标职位，请针对该职位突出相关能力

请直接输出优化后的自我介绍，不要包含任何解释或标题。`;

  return await callModelAPI(prompt, { temperature: 0.7, maxTokens: 500 });
}

/**
 * 优化工作经历描述
 */
async function optimizeWorkDescription(content, context) {
  const prompt = `作为专业的简历优化专家，请帮我优化以下工作经历描述。

【公司】${context.company || "未知"}
【职位】${context.position || "未知"}
【当前描述】
${content}

【优化要求】
1. 使用 STAR 法则（情境-任务-行动-结果）组织内容
2. 每条职责以动词开头（如：负责、主导、优化、推动等）
3. 尽量添加量化数据（如：提升 30%、节省 50 万等）
4. 突出个人贡献和工作成果
5. 使用分点描述，每点 1-2 句话
6. 总字数控制在 100-200 字

请直接输出优化后的工作描述，不要包含任何解释或标题。`;

  return await callModelAPI(prompt, { temperature: 0.7, maxTokens: 600 });
}

/**
 * 优化项目描述
 */
async function optimizeProjectDescription(content, context) {
  const prompt = `作为专业的简历优化专家，请帮我优化以下项目描述。

【项目名称】${context.projectName || "未知"}
【当前描述】
${content}

【优化要求】
1. 清晰说明项目背景和目标
2. 描述使用的技术栈或方法论
3. 突出项目的创新点或难点
4. 量化项目成果和影响（如有）
5. 控制在 80-150 字

请直接输出优化后的项目描述，不要包含任何解释或标题。`;

  return await callModelAPI(prompt, { temperature: 0.7, maxTokens: 400 });
}

/**
 * 优化职责描述
 */
async function optimizeResponsibilities(content, context) {
  const prompt = `作为专业的简历优化专家，请帮我优化以下项目职责描述。

【项目名称】${context.projectName || "未知"}
【当前职责描述】
${content}

【优化要求】
1. 使用动词开头描述每项职责
2. 突出个人在项目中的角色和贡献
3. 强调解决的问题和达成的成果
4. 使用分点描述，条理清晰
5. 控制在 80-150 字

请直接输出优化后的职责描述，不要包含任何解释或标题。`;

  return await callModelAPI(prompt, { temperature: 0.7, maxTokens: 400 });
}

/**
 * AI 辅助字段匹配
 * 使用大模型来提高字段匹配的精度
 * @param {Array} pageFields - 页面字段列表
 * @param {Array} resumeFields - 简历字段列表
 * @returns {Promise<Array>} 匹配结果
 */
async function aiMatchFields(pageFields, resumeFields) {
  // 构建页面字段描述
  const pageFieldsDesc = pageFields.map((f, i) => ({
    index: i,
    label: f.label || f.placeholder || f.name || f.id || `字段${i}`,
    type: f.type,
  }));

  // 构建简历字段描述
  const resumeFieldsDesc = resumeFields.map((f, i) => ({
    index: i,
    key: f.key,
    keywords: f.keywords.slice(0, 3).join(", "),
    value: String(f.value).substring(0, 30),
  }));

  const prompt = `你是一个表单字段匹配专家。请帮我将简历数据字段与网页表单字段进行匹配。

【网页表单字段】
${JSON.stringify(pageFieldsDesc, null, 2)}

【简历数据字段】
${JSON.stringify(resumeFieldsDesc, null, 2)}

请返回一个 JSON 数组，每个元素包含：
- pageIndex: 网页字段索引
- resumeIndex: 匹配的简历字段索引
- confidence: 匹配置信度 (0-1)

只返回有较高置信度(>=0.5)的匹配。直接返回 JSON 数组，不要包含其他内容。`;

  try {
    const response = await callModelAPI(prompt, {
      temperature: 0.3,
      maxTokens: 1000,
    });

    // 解析 JSON 响应
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const matches = JSON.parse(jsonMatch[0]);
      return matches.filter(
        (m) =>
          typeof m.pageIndex === "number" &&
          typeof m.resumeIndex === "number" &&
          m.confidence >= 0.5
      );
    }
  } catch (error) {
    console.error("AI 字段匹配失败:", error);
  }

  return [];
}

// 绑定到全局作用域
if (typeof window !== "undefined") {
  window.MODEL_PROVIDERS = MODEL_PROVIDERS;
  window.getModelProviders = getModelProviders;
  window.getModelsByProvider = getModelsByProvider;
  window.getModelConfig = getModelConfig;
  window.saveModelConfig = saveModelConfig;
  window.callModelAPI = callModelAPI;
  window.optimizeResumeField = optimizeResumeField;
  window.generateResumeSuggestions = generateResumeSuggestions;
  window.testModelConnection = testModelConnection;
  window.optimizeEntireResume = optimizeEntireResume;
  window.aiMatchFields = aiMatchFields;
}

// 导出函数（Node.js 环境）
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    MODEL_PROVIDERS,
    getModelProviders,
    getModelsByProvider,
    getModelConfig,
    saveModelConfig,
    callModelAPI,
    optimizeResumeField,
    generateResumeSuggestions,
    testModelConnection,
    optimizeEntireResume,
    aiMatchFields,
  };
}
