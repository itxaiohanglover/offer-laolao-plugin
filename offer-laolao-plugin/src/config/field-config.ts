import type {
  PersonalInfo,
  JobExpectation,
  Education,
  WorkExperience,
  Project,
  Skill,
  Language,
  CustomField,
} from "~types/resume"

/**
 * 表单字段配置类型
 */
export interface FieldConfig<T = string> {
  id: T
  label: string
  type: "text" | "tel" | "email" | "date" | "select" | "textarea"
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
}

/**
 * 动态项字段配置类型
 */
export interface DynamicFieldConfig<T = string> {
  name: T
  label: string
  type: "text" | "date" | "select" | "textarea"
  placeholder?: string
  options?: { value: string; label: string }[]
}

/**
 * 动态项配置类型
 */
export interface DynamicItemConfig<T = string> {
  listId: string
  addButtonId: string
  fields: DynamicFieldConfig<T>[]
  minItems: number
}

/**
 * 基本信息字段配置
 */
export const basicInfoFields: FieldConfig<keyof PersonalInfo>[] = [
  {
    id: "name",
    label: "姓名",
    type: "text",
    required: true,
    placeholder: "请输入姓名",
  },
  {
    id: "gender",
    label: "性别",
    type: "select",
    placeholder: "请选择",
    options: [
      { value: "", label: "请选择" },
      { value: "男", label: "男" },
      { value: "女", label: "女" },
    ],
  },
  {
    id: "birthDate",
    label: "出生日期",
    type: "date",
  },
  {
    id: "phone",
    label: "手机号码",
    type: "tel",
    required: true,
    placeholder: "请输入手机号码",
  },
  {
    id: "email",
    label: "电子邮箱",
    type: "email",
    required: true,
    placeholder: "请输入电子邮箱",
  },
  {
    id: "idCard",
    label: "身份证号",
    type: "text",
    placeholder: "请输入身份证号",
  },
  {
    id: "location",
    label: "所在地",
    type: "text",
    placeholder: "请输入所在地",
  },
  {
    id: "politicalStatus",
    label: "政治面貌",
    type: "select",
    placeholder: "请选择",
    options: [
      { value: "", label: "请选择" },
      { value: "群众", label: "群众" },
      { value: "团员", label: "团员" },
      { value: "党员", label: "党员" },
    ],
  },
]

/**
 * 求职期望字段配置
 */
export const jobExpectationFields: FieldConfig<keyof JobExpectation>[] = [
  {
    id: "expectedPosition",
    label: "期望职位",
    type: "text",
    placeholder: "请输入期望职位",
  },
  {
    id: "expectedIndustry",
    label: "期望行业",
    type: "text",
    placeholder: "请输入期望行业",
  },
  {
    id: "expectedSalary",
    label: "期望薪资",
    type: "text",
    placeholder: "请输入期望薪资",
  },
  {
    id: "expectedLocation",
    label: "期望地点",
    type: "text",
    placeholder: "请输入期望地点",
  },
]

/**
 * 技能字段配置
 */
export const skillFields: DynamicFieldConfig<keyof Skill>[] = [
  {
    name: "name",
    label: "技能名称",
    type: "text",
    placeholder: "请输入技能名称",
  },
  {
    name: "level",
    label: "技能水平",
    type: "select",
    placeholder: "请选择",
    options: [
      { value: "", label: "请选择" },
      { value: "初级", label: "初级" },
      { value: "中级", label: "中级" },
      { value: "高级", label: "高级" },
      { value: "专家", label: "专家" },
    ],
  },
]

/**
 * 教育经历字段配置
 */
export const educationFields: DynamicFieldConfig<keyof Education>[] = [
  {
    name: "school",
    label: "学校名称",
    type: "text",
    placeholder: "请输入学校名称",
  },
  {
    name: "major",
    label: "专业",
    type: "text",
    placeholder: "请输入专业",
  },
  {
    name: "degree",
    label: "学历",
    type: "select",
    placeholder: "请选择",
    options: [
      { value: "", label: "请选择" },
      { value: "专科", label: "专科" },
      { value: "本科", label: "本科" },
      { value: "硕士", label: "硕士" },
      { value: "博士", label: "博士" },
    ],
  },
  {
    name: "rank",
    label: "排名",
    type: "text",
    placeholder: "请输入排名（如：前5%）",
  },
  {
    name: "startDate",
    label: "入学时间",
    type: "date",
  },
  {
    name: "endDate",
    label: "毕业时间",
    type: "date",
  },
]

/**
 * 工作/实习经历字段配置
 */
export const workExperienceFields: DynamicFieldConfig<keyof WorkExperience>[] = [
  {
    name: "company",
    label: "公司名称",
    type: "text",
    placeholder: "请输入公司名称",
  },
  {
    name: "position",
    label: "职位",
    type: "text",
    placeholder: "请输入职位",
  },
  {
    name: "startDate",
    label: "开始时间",
    type: "date",
  },
  {
    name: "endDate",
    label: "结束时间",
    type: "date",
  },
  {
    name: "description",
    label: "工作描述",
    type: "textarea",
    placeholder: "请输入工作描述",
  },
]

/**
 * 项目经历字段配置
 */
export const projectFields: DynamicFieldConfig<keyof Project>[] = [
  {
    name: "projectName",
    label: "项目名称",
    type: "text",
    placeholder: "请输入项目名称",
  },
  {
    name: "role",
    label: "担任角色",
    type: "text",
    placeholder: "请输入担任角色",
  },
  {
    name: "projectTime",
    label: "项目时间",
    type: "text",
    placeholder: "请输入项目时间",
  },
  {
    name: "projectDesc",
    label: "项目描述",
    type: "textarea",
    placeholder: "请输入项目描述",
  },
  {
    name: "responsibilities",
    label: "职责描述",
    type: "textarea",
    placeholder: "请输入职责描述",
  },
]

/**
 * 语言能力字段配置
 */
export const languageFields: DynamicFieldConfig<keyof Language>[] = [
  {
    name: "name",
    label: "语言名称",
    type: "text",
    placeholder: "请输入语言名称（如：英语、日语）",
  },
  {
    name: "proficiency",
    label: "掌握程度",
    type: "select",
    placeholder: "请选择",
    options: [
      { value: "", label: "请选择" },
      { value: "入门", label: "入门" },
      { value: "基础", label: "基础" },
      { value: "熟练", label: "熟练" },
      { value: "精通", label: "精通" },
    ],
  },
  {
    name: "certificate",
    label: "证书",
    type: "text",
    placeholder: "请输入证书名称（如：大学英语六级）",
  },
]

/**
 * 自定义字段配置
 */
export const customFieldFields: DynamicFieldConfig<keyof CustomField>[] = [
  {
    name: "name",
    label: "字段名称",
    type: "text",
    placeholder: "请输入字段名称",
  },
  {
    name: "content",
    label: "字段内容",
    type: "textarea",
    placeholder: "请输入字段内容",
  },
]

/**
 * 动态项配置
 */
export const dynamicConfigs = {
  skill: {
    listId: "skills-list",
    addButtonId: "add-skill",
    fields: skillFields,
    minItems: 1,
  },
  education: {
    listId: "education-list",
    addButtonId: "add-education",
    fields: educationFields,
    minItems: 1,
  },
  workExperience: {
    listId: "internship-list",
    addButtonId: "add-internship",
    fields: workExperienceFields,
    minItems: 1,
  },
  project: {
    listId: "project-list",
    addButtonId: "add-project",
    fields: projectFields,
    minItems: 0,
  },
  language: {
    listId: "language-list",
    addButtonId: "add-language",
    fields: languageFields,
    minItems: 0,
  },
  customField: {
    listId: "custom-field-list",
    addButtonId: "add-custom-field",
    fields: customFieldFields,
    minItems: 0,
  },
}

/**
 * 字段名到标签的映射（用于动态项）
 */
export const fieldLabelMap: Record<string, string> = {
  school: "学校",
  major: "专业",
  degree: "学历",
  rank: "排名",
  startDate: "开始时间",
  endDate: "结束时间",
  company: "公司",
  position: "职位",
  description: "描述",
  projectName: "项目名称",
  role: "角色",
  projectTime: "项目时间",
  projectDesc: "项目描述",
  responsibilities: "职责",
  name: "名称",
  level: "水平",
  proficiency: "掌握程度",
  certificate: "证书",
  content: "内容",
}

