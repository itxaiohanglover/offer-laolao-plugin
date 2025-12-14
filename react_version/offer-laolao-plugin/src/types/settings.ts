/**
 * API 配置相关类型定义
 */

// 模型信息
export interface ModelInfo {
  id: string
  name: string
}

// 模型提供商配置
export interface ModelProvider {
  id: string
  name: string
  baseUrl: string
  models: ModelInfo[]
  authHeader: string
  authPrefix: string
}

// 模型设置
export interface ModelSettings {
  provider: string
  model: string
  customUrl?: string
  // 每个提供商独立存储 API Key
  apiKeys: Record<string, string>
  // 兼容旧版本的单一 apiKey 字段
  apiKey?: string
}

// 简历解析设置
export interface ParseSettings {
  url: string
  appCode: string
}

// 默认模型设置
export const defaultModelSettings: ModelSettings = {
  provider: "deepseek",
  model: "",
  customUrl: "",
  apiKeys: {},
}

/**
 * 获取当前提供商的 API Key
 */
export function getApiKeyForProvider(settings: ModelSettings, providerId?: string): string {
  const provider = providerId || settings.provider
  // 优先从 apiKeys 中获取（使用 in 操作符检查键是否存在，而不是检查值是否 truthy）
  if (settings.apiKeys && provider in settings.apiKeys) {
    return settings.apiKeys[provider]
  }
  // 兼容旧版本：如果 apiKeys 中没有，尝试使用旧的 apiKey 字段
  if (settings.apiKey) {
    return settings.apiKey
  }
  return ""
}

/**
 * 设置指定提供商的 API Key
 */
export function setApiKeyForProvider(
  settings: ModelSettings,
  providerId: string,
  apiKey: string
): ModelSettings {
  return {
    ...settings,
    apiKeys: {
      ...settings.apiKeys,
      [providerId]: apiKey,
    },
  }
}

// 默认简历解析设置
export const defaultParseSettings: ParseSettings = {
  url: "",
  appCode: "",
}

// API 调用选项
export interface CallModelOptions {
  systemPrompt?: string
  temperature?: number
  maxTokens?: number
  model?: string
}

// 测试连接结果
export interface TestConnectionResult {
  success: boolean
  message: string
  response?: string
}

// 简历解析 API 响应原始数据
export interface ResumeParseRawData {
  name?: string
  fullname?: string
  gender_inf?: string
  gender?: string
  phone?: string
  mobile?: string
  email?: string
  polit_status?: string
  political_status?: string
  work_pos_type_p?: string
  work_pos_type?: string
  work_city?: string
  work_company?: string
  cont_basic_info?: string
  cont_job_skill?: string
  raw_text?: string
  education_objs?: EducationObj[]
  job_exp_objs?: JobExpObj[]
  proj_exp_objs?: ProjectExpObj[]
  skills_objs?: SkillObj[]
  lang_objs?: LanguageObj[]
}

export interface EducationObj {
  edu_college?: string
  edu_school?: string
  edu_major?: string
  edu_degree?: string
  edu_degree_norm?: string
  edu_college_rank?: string
  edu_college_rank_qs?: string
  start_date?: string
  end_date?: string
}

export interface JobExpObj {
  job_cpy?: string
  job_company?: string
  job_pos_type_p?: string
  job_pos_type?: string
  start_date?: string
  end_date?: string
  job_content?: string
}

export interface ProjectExpObj {
  proj_name?: string
  proj_role?: string
  start_date?: string
  end_date?: string
  proj_content?: string
  proj_resp?: string
}

export interface SkillObj {
  skills_name?: string
  skills_level?: string
}

export interface LanguageObj {
  lang_name?: string
  language?: string
  lang_level?: string
  level?: string
  lang_cert?: string
}

