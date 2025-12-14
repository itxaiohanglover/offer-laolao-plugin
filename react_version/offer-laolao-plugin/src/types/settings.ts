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
  apiKey: string
  model: string
  customUrl?: string
}

// 简历解析设置
export interface ParseSettings {
  url: string
  appCode: string
}

// 默认模型设置
export const defaultModelSettings: ModelSettings = {
  provider: "deepseek",
  apiKey: "",
  model: "",
  customUrl: "",
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

