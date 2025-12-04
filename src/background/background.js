// 简历自动填写助手 - Background Service Worker
// 处理 content script 和 popup 之间的消息传递

console.log("Background service worker 已启动");

// 存储模型配置
let modelConfig = null;

// 监听来自 content script 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Background 收到消息:", request.action);

  if (request.action === "aiMatchFieldsRequest") {
    // 处理 AI 字段匹配请求
    handleAIMatchRequest(request.pageFields, request.resumeFields)
      .then((result) => sendResponse(result))
      .catch((error) => {
        console.error("AI 匹配失败:", error);
        sendResponse({ success: false, message: error.message });
      });
    return true; // 保持消息通道开放
  }

  if (request.action === "updateModelConfig") {
    // 更新模型配置
    modelConfig = request.config;
    sendResponse({ success: true });
    return true;
  }

  if (request.action === "getModelConfig") {
    // 获取模型配置
    loadModelConfig().then((config) => {
      sendResponse({ success: true, config });
    });
    return true;
  }
});

/**
 * 加载模型配置
 */
async function loadModelConfig() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["modelSettings"], (result) => {
      resolve(result.modelSettings || null);
    });
  });
}

/**
 * 处理 AI 字段匹配请求
 */
async function handleAIMatchRequest(pageFields, resumeFields) {
  console.log("开始 AI 字段匹配...");
  console.log("页面字段数:", pageFields.length);
  console.log("简历字段数:", resumeFields.length);

  // 加载模型配置
  const config = await loadModelConfig();

  if (!config || !config.apiKey) {
    console.log("未配置 AI 模型，返回空匹配");
    return { success: false, message: "未配置 AI 模型" };
  }

  try {
    // 构建 prompt
    const prompt = buildMatchPrompt(pageFields, resumeFields);
    console.log("AI Prompt 长度:", prompt.length);

    // 调用 AI API
    const response = await callModelAPI(config, prompt);
    console.log("AI 响应:", response);

    // 解析响应
    const mappings = parseAIResponse(response);
    console.log("解析的匹配结果:", mappings);

    return {
      success: true,
      mappings: mappings,
    };
  } catch (error) {
    console.error("AI 匹配出错:", error);
    return { success: false, message: error.message };
  }
}

/**
 * 构建匹配 prompt
 */
function buildMatchPrompt(pageFields, resumeFields) {
  // 简化页面字段信息
  const pageFieldsSimple = pageFields.map((f) => {
    const desc = [f.label, f.placeholder, f.ariaLabel]
      .filter(Boolean)
      .join(" | ");
    return `[${f.index}] ${desc || f.name || f.id || "未知字段"} (${f.type})`;
  });

  // 简化简历字段信息
  const resumeFieldsSimple = resumeFields.map((f) => {
    const valuePreview = f.value ? f.value.substring(0, 50) : "";
    return `[${f.index}] ${f.keywords.join("/")} = "${valuePreview}"`;
  });

  return `你是一个表单字段匹配专家。请将简历数据字段与网页表单字段进行精确匹配。

【网页表单字段】（共${pageFields.length}个）
${pageFieldsSimple.join("\n")}

【简历数据字段】（共${resumeFields.length}个）
${resumeFieldsSimple.join("\n")}

【匹配规则】
1. 根据字段名称、标签、占位符等信息判断字段用途
2. 将简历数据匹配到对应的网页表单字段
3. 只返回确定的匹配，不确定的不要返回
4. 一个简历字段可以匹配多个页面字段（如姓名可能出现多次）
5. 注意区分不同的经历（教育经历1、教育经历2等）

【输出格式】
返回 JSON 数组，每个元素包含：
- pageIndex: 网页字段索引（数字）
- resumeIndex: 简历字段索引（数字）
- confidence: 匹配置信度（0-1的数字）

只返回 JSON 数组，不要有其他内容。示例：
[{"pageIndex":0,"resumeIndex":0,"confidence":0.9},{"pageIndex":1,"resumeIndex":2,"confidence":0.85}]`;
}

/**
 * 调用模型 API
 */
async function callModelAPI(config, prompt) {
  const MODEL_PROVIDERS = {
    volcengine: {
      baseUrl: "https://ark.cn-beijing.volces.com/api/v3",
      authPrefix: "Bearer ",
    },
    deepseek: {
      baseUrl: "https://api.deepseek.com/v1",
      authPrefix: "Bearer ",
    },
    kimi: {
      baseUrl: "https://api.moonshot.cn/v1",
      authPrefix: "Bearer ",
    },
    qwen: {
      baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
      authPrefix: "Bearer ",
    },
    zhipu: {
      baseUrl: "https://open.bigmodel.cn/api/paas/v4",
      authPrefix: "Bearer ",
    },
    baichuan: {
      baseUrl: "https://api.baichuan-ai.com/v1",
      authPrefix: "Bearer ",
    },
    custom: {
      baseUrl: "",
      authPrefix: "Bearer ",
    },
  };

  const provider = MODEL_PROVIDERS[config.provider] || MODEL_PROVIDERS.deepseek;
  let apiUrl = config.customUrl || provider.baseUrl;

  // 确保 URL 以 /chat/completions 结尾
  if (!apiUrl.endsWith("/chat/completions")) {
    apiUrl = apiUrl.replace(/\/+$/, "") + "/chat/completions";
  }

  const modelId = config.model || "deepseek-chat";

  console.log("调用 API:", apiUrl, "模型:", modelId);

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: provider.authPrefix + config.apiKey,
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        {
          role: "system",
          content:
            "你是一个精确的表单字段匹配助手。只返回 JSON 格式的匹配结果，不要有任何其他文字。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API 请求失败: ${response.status} - ${errorText}`);
  }

  const result = await response.json();

  // 提取响应文本
  if (result.choices && result.choices.length > 0) {
    return result.choices[0].message.content;
  }

  throw new Error("无法解析 API 响应");
}

/**
 * 解析 AI 响应
 */
function parseAIResponse(response) {
  try {
    // 尝试提取 JSON 数组
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      // 验证格式
      return parsed.filter(
        (m) =>
          typeof m.pageIndex === "number" &&
          typeof m.resumeIndex === "number" &&
          (!m.confidence || typeof m.confidence === "number")
      );
    }
  } catch (error) {
    console.error("解析 AI 响应失败:", error);
  }
  return [];
}

// 监听扩展安装/更新
chrome.runtime.onInstalled.addListener(() => {
  console.log("简历自动填写助手已安装/更新");
});
