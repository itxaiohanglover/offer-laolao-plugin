/**
 * 个人基本信息
 */
export interface PersonalInfo {
  name: string
  gender: string
  birthDate: string
  phone: string
  email: string
  idCard: string
  location: string
  politicalStatus: string
}

/**
 * 求职期望
 */
export interface JobExpectation {
  expectedPosition: string
  expectedIndustry: string
  expectedSalary: string
  expectedLocation: string
  internshipDuration?: string
  availableTime?: string
}

/**
 * 教育经历
 */
export interface Education {
  school: string
  major: string
  degree: string
  rank?: string
  startDate: string
  endDate: string
}

/**
 * 工作/实习经历
 */
export interface WorkExperience {
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
}

/**
 * 项目经历
 */
export interface Project {
  projectName: string
  role: string
  projectTime: string
  projectDesc: string
  responsibilities: string
}

/**
 * 技能
 */
export interface Skill {
  name: string
  level: string
}

/**
 * 语言能力
 */
export interface Language {
  name: string
  proficiency: string
  certificate?: string
}

/**
 * 自定义字段
 */
export interface CustomField {
  name: string
  content: string
}

/**
 * 完整简历数据
 */
export interface ResumeData {
  personalInfo: PersonalInfo
  jobExpectation: JobExpectation
  selfIntro: string
  education: Education[]
  workExperience: WorkExperience[]
  projects: Project[]
  skills: Skill[]
  languages: Language[]
  customFields: CustomField[]
}

/**
 * 简历数据的默认值
 */
export const defaultPersonalInfo: PersonalInfo = {
  name: "",
  gender: "",
  birthDate: "",
  phone: "",
  email: "",
  idCard: "",
  location: "",
  politicalStatus: "",
}

export const defaultJobExpectation: JobExpectation = {
  expectedPosition: "",
  expectedIndustry: "",
  expectedSalary: "",
  expectedLocation: "",
  internshipDuration: "",
  availableTime: "",
}

export const defaultResumeData: ResumeData = {
  personalInfo: defaultPersonalInfo,
  jobExpectation: defaultJobExpectation,
  selfIntro: "",
  education: [],
  workExperience: [],
  projects: [],
  skills: [],
  languages: [],
  customFields: [],
}

/**
 * AI优化进度信息
 */
export interface OptimizeProgress {
  current: number
  total: number
  currentTask: string
  status: "processing" | "completed" | "error"
  optimizedContent?: string
  error?: string
}

/**
 * AI优化任务
 */
export interface OptimizeTask {
  type:
    | "self-intro"
    | "work-description"
    | "project-desc"
    | "project-responsibilities"
  name: string
  index?: number
  key?: string
  currentValue: string
  context?: Record<string, string>
}

