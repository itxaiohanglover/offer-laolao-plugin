/**
 * 模型提供商配置
 * 支持火山引擎、DeepSeek、Kimi、Qwen 等国产大模型
 */

import type { ModelProvider } from "~types/settings"

export const MODEL_PROVIDERS: Record<string, ModelProvider> = {
  // 火山引擎（字节跳动）
  volcengine: {
    id: "volcengine",
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
    id: "deepseek",
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
    id: "kimi",
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
    id: "qwen",
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
    id: "zhipu",
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
    id: "baichuan",
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
    id: "custom",
    name: "自定义 (OpenAI 兼容)",
    baseUrl: "",
    models: [],
    authHeader: "Authorization",
    authPrefix: "Bearer ",
  },
}

/**
 * 获取所有支持的模型提供商列表
 */
export function getModelProviders(): { id: string; name: string; models: { id: string; name: string }[] }[] {
  return Object.entries(MODEL_PROVIDERS).map(([key, value]) => ({
    id: key,
    name: value.name,
    models: value.models,
  }))
}

/**
 * 根据提供商 ID 获取模型列表
 */
export function getModelsByProvider(providerId: string): { id: string; name: string }[] {
  const provider = MODEL_PROVIDERS[providerId]
  return provider ? provider.models : []
}

/**
 * 获取提供商信息
 */
export function getProvider(providerId: string): ModelProvider | undefined {
  return MODEL_PROVIDERS[providerId]
}

