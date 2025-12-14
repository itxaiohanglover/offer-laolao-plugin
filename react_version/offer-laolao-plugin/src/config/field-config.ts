import type { PersonalInfo, JobExpectation } from "~types/resume"

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

