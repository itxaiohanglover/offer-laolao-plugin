import React, { useState, useEffect, useCallback, useRef } from "react"
import { Input } from "~components/ui/input"
import { Label } from "~components/ui/label"
import { Button } from "~components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~components/ui/select"
import { DatePicker } from "~components/ui/date-picker"
import { FieldFillButton } from "~components/ui/field-fill-button"
import {
  basicInfoFields,
  jobExpectationFields,
  skillFields,
  educationFields,
  workExperienceFields,
  projectFields,
  languageFields,
  customFieldFields,
  type FieldConfig,
  type DynamicFieldConfig,
} from "~config/field-config"
import {
  type ResumeData,
  type PersonalInfo,
  type JobExpectation,
  type Education,
  type WorkExperience,
  type Project,
  type Skill,
  type Language,
  type CustomField,
  defaultResumeData,
} from "~types/resume"
import { useResumeTemplates } from "~hooks/useResumeTemplates"
import { OptimizeDialog } from "./OptimizeDialog"

/**
 * 可折叠的表单区域
 */
function FormSection({
  title,
  icon,
  children,
  defaultOpen = true,
}: {
  title: string
  icon: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="plasmo-border plasmo-border-border plasmo-rounded-lg plasmo-overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="plasmo-w-full plasmo-flex plasmo-items-center plasmo-justify-between plasmo-p-3 plasmo-bg-muted/30 hover:plasmo-bg-muted/50 plasmo-transition-colors"
      >
        <div className="plasmo-flex plasmo-items-center plasmo-gap-2">
          <span>{icon}</span>
          <span className="plasmo-font-medium plasmo-text-sm">{title}</span>
        </div>
        <span className="plasmo-text-muted-foreground">
          {isOpen ? "▼" : "▶"}
        </span>
      </button>
      {isOpen && <div className="plasmo-p-3 plasmo-space-y-3">{children}</div>}
    </div>
  )
}

/**
 * 动态列表项组件
 */
function DynamicListItem<T extends Record<string, any>>({
  item,
  index,
  fields,
  onChange,
  onRemove,
  canRemove,
  listType = "item",
}: {
  item: T
  index: number
  fields: DynamicFieldConfig<keyof T>[]
  onChange: (index: number, field: keyof T, value: string) => void
  onRemove: (index: number) => void
  canRemove: boolean
  listType?: string
}) {
  const renderField = (field: DynamicFieldConfig<keyof T>) => {
    const value = (item[field.name] as string) || ""
    const fieldId = `${listType}[${index}][${String(field.name)}]`
    const fieldLabel = field.label

    switch (field.type) {
      case "select":
        return (
          <div className="plasmo-flex plasmo-items-center plasmo-gap-1.5">
          <Select
            value={value || "empty"}
            onValueChange={(v) =>
              onChange(index, field.name, v === "empty" ? "" : v)
            }
          >
              <SelectTrigger className="plasmo-flex-1">
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem
                  key={option.value || "empty"}
                  value={option.value || "empty"}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
            <FieldFillButton
              fieldId={fieldId}
              fieldLabel={fieldLabel}
              getValue={() => {
                // 对于select，返回选中项的文本
                const opt = field.options?.find(o => o.value === value)
                return opt?.label || value
              }}
            />
          </div>
        )

      case "date":
        return (
          <div className="plasmo-flex plasmo-items-center plasmo-gap-1.5">
            <div className="plasmo-flex-1">
          <DatePicker
            value={value}
            onChange={(v) => onChange(index, field.name, v)}
            placeholder={field.placeholder || "选择日期"}
          />
            </div>
            <FieldFillButton
              fieldId={fieldId}
              fieldLabel={fieldLabel}
              getValue={() => value}
            />
          </div>
        )

      case "textarea":
        return (
          <div className="plasmo-flex plasmo-items-start plasmo-gap-1.5">
          <textarea
            value={value}
            onChange={(e) => onChange(index, field.name, e.target.value)}
            placeholder={field.placeholder}
              className="plasmo-flex-1 plasmo-min-h-[60px] plasmo-px-3 plasmo-py-2 plasmo-text-sm plasmo-border plasmo-border-input plasmo-rounded-md plasmo-bg-background plasmo-resize-y focus:plasmo-outline-none focus:plasmo-ring-2 focus:plasmo-ring-ring"
          />
            <FieldFillButton
              fieldId={fieldId}
              fieldLabel={fieldLabel}
              getValue={() => value}
            />
          </div>
        )

      default:
        return (
          <div className="plasmo-flex plasmo-items-center plasmo-gap-1.5">
          <Input
            value={value}
            onChange={(e) => onChange(index, field.name, e.target.value)}
            placeholder={field.placeholder}
              className="plasmo-flex-1"
            />
            <FieldFillButton
              fieldId={fieldId}
              fieldLabel={fieldLabel}
              getValue={() => value}
          />
          </div>
        )
    }
  }

  return (
    <div className="plasmo-p-3 plasmo-bg-muted/20 plasmo-rounded-lg plasmo-space-y-2">
      <div className="plasmo-flex plasmo-justify-between plasmo-items-center plasmo-mb-2">
        <span className="plasmo-text-xs plasmo-text-muted-foreground">
          #{index + 1}
        </span>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            className="plasmo-h-6 plasmo-w-6 plasmo-p-0 plasmo-text-destructive hover:plasmo-bg-destructive/10"
          >
            ✕
          </Button>
        )}
      </div>
      <div className="plasmo-grid plasmo-gap-2">
        {fields.map((field) => (
          <div key={String(field.name)} className="plasmo-space-y-1">
            <Label className="plasmo-text-xs">{field.label}</Label>
            {renderField(field)}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * 完整简历表单
 */
export function ResumeForm() {
  const formRef = useRef<HTMLDivElement>(null)

  // 使用模板系统
  const {
    isLoading,
    currentResumeData,
    currentTemplateId,
    updateCurrentResumeData,
  } = useResumeTemplates()

  // 本地表单状态
  const [formData, setFormData] = useState<ResumeData>(defaultResumeData)
  const [isDirty, setIsDirty] = useState(false)

  // 优化对话框状态
  const [isOptimizeDialogOpen, setIsOptimizeDialogOpen] = useState(false)

  // 重置消息状态
  const [resetMessage, setResetMessage] = useState("")

  // 从存储加载数据 - 与默认值合并以确保所有字段存在
  useEffect(() => {
    if (!isLoading && currentResumeData) {
      // 深度合并存储数据和默认值，确保所有字段都存在
      setFormData({
        personalInfo: { ...defaultResumeData.personalInfo, ...currentResumeData.personalInfo },
        jobExpectation: { ...defaultResumeData.jobExpectation, ...currentResumeData.jobExpectation },
        selfIntro: currentResumeData.selfIntro ?? defaultResumeData.selfIntro,
        education: currentResumeData.education ?? defaultResumeData.education,
        workExperience: currentResumeData.workExperience ?? defaultResumeData.workExperience,
        projects: currentResumeData.projects ?? defaultResumeData.projects,
        skills: currentResumeData.skills ?? defaultResumeData.skills,
        languages: currentResumeData.languages ?? defaultResumeData.languages,
        customFields: currentResumeData.customFields ?? defaultResumeData.customFields,
      })
      // 切换模板时重置 dirty 状态
      setIsDirty(false)
    }
  }, [isLoading, currentResumeData, currentTemplateId])

  // 自动保存
  useEffect(() => {
    if (isDirty && !isLoading) {
      const timer = setTimeout(() => {
        updateCurrentResumeData(formData)
        setIsDirty(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [formData, isDirty, isLoading, updateCurrentResumeData])

  // 更新个人信息
  const updatePersonalInfo = useCallback(
    (field: keyof PersonalInfo, value: string) => {
      setFormData((prev) => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, [field]: value },
      }))
      setIsDirty(true)
    },
    []
  )

  // 更新求职期望
  const updateJobExpectation = useCallback(
    (field: keyof JobExpectation, value: string) => {
      setFormData((prev) => ({
        ...prev,
        jobExpectation: { ...prev.jobExpectation, [field]: value },
      }))
      setIsDirty(true)
    },
    []
  )

  // 更新自我介绍
  const updateSelfIntro = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, selfIntro: value }))
    setIsDirty(true)
  }, [])

  // 处理优化后的简历数据
  const handleOptimized = useCallback((optimizedData: ResumeData) => {
    setFormData(optimizedData)
    setIsDirty(true)
    setIsOptimizeDialogOpen(false)
  }, [])

  // 重置简历数据
  const handleReset = useCallback(() => {
    if (window.confirm("确定要重置所有简历数据吗？此操作不可恢复。")) {
      setFormData(defaultResumeData)
      setIsDirty(true)
      setResetMessage("✓ 简历数据已重置")
      setTimeout(() => setResetMessage(""), 3000)
    }
  }, [])

  // 通用动态列表更新函数
  const createListHandlers = <T extends Record<string, any>>(
    key: keyof ResumeData,
    defaultItem: T
  ) => ({
    update: (index: number, field: keyof T, value: string) => {
      setFormData((prev) => {
        const list = [...(prev[key] as T[])]
        list[index] = { ...list[index], [field]: value }
        return { ...prev, [key]: list }
      })
      setIsDirty(true)
    },
    add: () => {
      setFormData((prev) => ({
        ...prev,
        [key]: [...(prev[key] as T[]), { ...defaultItem }],
      }))
      setIsDirty(true)
    },
    remove: (index: number) => {
      setFormData((prev) => ({
        ...prev,
        [key]: (prev[key] as T[]).filter((_, i) => i !== index),
      }))
      setIsDirty(true)
    },
  })

  // 各类动态列表处理函数
  const educationHandlers = createListHandlers<Education>("education", {
    school: "",
    major: "",
    degree: "",
    rank: "",
    startDate: "",
    endDate: "",
  })

  const workHandlers = createListHandlers<WorkExperience>("workExperience", {
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
  })

  const projectHandlers = createListHandlers<Project>("projects", {
    projectName: "",
    role: "",
    projectTime: "",
    projectDesc: "",
    responsibilities: "",
  })

  const skillHandlers = createListHandlers<Skill>("skills", {
    name: "",
    level: "",
  })

  const languageHandlers = createListHandlers<Language>("languages", {
    name: "",
    proficiency: "",
    certificate: "",
  })

  const customFieldHandlers = createListHandlers<CustomField>("customFields", {
    name: "",
    content: "",
  })

  // 渲染静态字段（带填充按钮）
  const renderStaticField = (
    field: FieldConfig<string>,
    value: string,
    onChange: (value: string) => void
  ) => {
    const fieldId = field.id
    const fieldLabel = field.label

    switch (field.type) {
      case "select":
        return (
          <div className="plasmo-flex plasmo-items-center plasmo-gap-1.5">
          <Select
            value={value || "empty"}
            onValueChange={(v) => onChange(v === "empty" ? "" : v)}
          >
              <SelectTrigger className="plasmo-flex-1">
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem
                  key={option.value || "empty"}
                  value={option.value || "empty"}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
            <FieldFillButton
              fieldId={fieldId}
              fieldLabel={fieldLabel}
              getValue={() => {
                const opt = field.options?.find(o => o.value === value)
                return opt?.label || value
              }}
            />
          </div>
        )

      case "date":
        return (
          <div className="plasmo-flex plasmo-items-center plasmo-gap-1.5">
            <div className="plasmo-flex-1">
          <DatePicker
            value={value}
            onChange={onChange}
            placeholder={field.placeholder || "选择日期"}
          />
            </div>
            <FieldFillButton
              fieldId={fieldId}
              fieldLabel={fieldLabel}
              getValue={() => value}
            />
          </div>
        )

      case "textarea":
        return (
          <div className="plasmo-flex plasmo-items-start plasmo-gap-1.5">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
              className="plasmo-flex-1 plasmo-min-h-[80px] plasmo-px-3 plasmo-py-2 plasmo-text-sm plasmo-border plasmo-border-input plasmo-rounded-md plasmo-bg-background plasmo-resize-y focus:plasmo-outline-none focus:plasmo-ring-2 focus:plasmo-ring-ring"
          />
            <FieldFillButton
              fieldId={fieldId}
              fieldLabel={fieldLabel}
              getValue={() => value}
            />
          </div>
        )

      default:
        return (
          <div className="plasmo-flex plasmo-items-center plasmo-gap-1.5">
          <Input
            type={field.type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
              className="plasmo-flex-1"
            />
            <FieldFillButton
              fieldId={fieldId}
              fieldLabel={fieldLabel}
              getValue={() => value}
          />
          </div>
        )
    }
  }

  if (isLoading) {
    return (
      <div className="plasmo-flex plasmo-items-center plasmo-justify-center plasmo-py-8">
        <div className="plasmo-text-muted-foreground">加载中...</div>
      </div>
    )
  }

  return (
    <div ref={formRef} className="plasmo-space-y-3">
      {/* 基本信息 */}
      <FormSection title="基本信息" icon="👤" defaultOpen={true}>
        <div className="plasmo-grid plasmo-gap-3">
          {basicInfoFields.map((field) => (
            <div key={field.id} className="plasmo-space-y-1">
              <Label className="plasmo-text-xs">
                {field.label}
                {field.required && (
                  <span className="plasmo-text-destructive plasmo-ml-1">*</span>
                )}
              </Label>
              {renderStaticField(
                field as FieldConfig<string>,
                formData.personalInfo[field.id] || "",
                (value) => updatePersonalInfo(field.id, value)
              )}
            </div>
          ))}
        </div>
      </FormSection>

      {/* 求职期望 */}
      <FormSection title="求职期望" icon="🎯" defaultOpen={false}>
        <div className="plasmo-grid plasmo-gap-3">
          {jobExpectationFields.map((field) => (
            <div key={field.id} className="plasmo-space-y-1">
              <Label className="plasmo-text-xs">{field.label}</Label>
              {renderStaticField(
                field as FieldConfig<string>,
                formData.jobExpectation[field.id] || "",
                (value) => updateJobExpectation(field.id, value)
              )}
            </div>
          ))}
        </div>
      </FormSection>

      {/* 自我介绍 */}
      <FormSection title="自我介绍" icon="📝" defaultOpen={false}>
        <div className="plasmo-flex plasmo-items-start plasmo-gap-1.5">
        <textarea
          value={formData.selfIntro}
          onChange={(e) => updateSelfIntro(e.target.value)}
          placeholder="请输入自我介绍..."
            className="plasmo-flex-1 plasmo-min-h-[100px] plasmo-px-3 plasmo-py-2 plasmo-text-sm plasmo-border plasmo-border-input plasmo-rounded-md plasmo-bg-background plasmo-resize-y focus:plasmo-outline-none focus:plasmo-ring-2 focus:plasmo-ring-ring"
        />
          <FieldFillButton
            fieldId="self-intro"
            fieldLabel="自我介绍"
            getValue={() => formData.selfIntro}
          />
        </div>
      </FormSection>

      {/* 教育经历 */}
      <FormSection title="教育经历" icon="🎓" defaultOpen={false}>
        <div className="plasmo-space-y-2">
          {formData.education.map((item, index) => (
            <DynamicListItem
              key={index}
              item={item}
              index={index}
              fields={educationFields}
              onChange={educationHandlers.update}
              onRemove={educationHandlers.remove}
              canRemove={formData.education.length > 1}
              listType="education"
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={educationHandlers.add}
            className="plasmo-w-full"
          >
            + 添加教育经历
          </Button>
        </div>
      </FormSection>

      {/* 工作/实习经历 */}
      <FormSection title="工作/实习经历" icon="💼" defaultOpen={false}>
        <div className="plasmo-space-y-2">
          {formData.workExperience.map((item, index) => (
            <DynamicListItem
              key={index}
              item={item}
              index={index}
              fields={workExperienceFields}
              onChange={workHandlers.update}
              onRemove={workHandlers.remove}
              canRemove={formData.workExperience.length > 1}
              listType="internship"
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={workHandlers.add}
            className="plasmo-w-full"
          >
            + 添加工作/实习经历
          </Button>
        </div>
      </FormSection>

      {/* 项目经历 */}
      <FormSection title="项目经历" icon="🚀" defaultOpen={false}>
        <div className="plasmo-space-y-2">
          {formData.projects.map((item, index) => (
            <DynamicListItem
              key={index}
              item={item}
              index={index}
              fields={projectFields}
              onChange={projectHandlers.update}
              onRemove={projectHandlers.remove}
              canRemove={true}
              listType="project"
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={projectHandlers.add}
            className="plasmo-w-full"
          >
            + 添加项目经历
          </Button>
        </div>
      </FormSection>

      {/* 技能 */}
      <FormSection title="专业技能" icon="⚡" defaultOpen={false}>
        <div className="plasmo-space-y-2">
          {formData.skills.map((item, index) => (
            <DynamicListItem
              key={index}
              item={item}
              index={index}
              fields={skillFields}
              onChange={skillHandlers.update}
              onRemove={skillHandlers.remove}
              canRemove={formData.skills.length > 1}
              listType="skills"
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={skillHandlers.add}
            className="plasmo-w-full"
          >
            + 添加技能
          </Button>
        </div>
      </FormSection>

      {/* 语言能力 */}
      <FormSection title="语言能力" icon="🌐" defaultOpen={false}>
        <div className="plasmo-space-y-2">
          {formData.languages.map((item, index) => (
            <DynamicListItem
              key={index}
              item={item}
              index={index}
              fields={languageFields}
              onChange={languageHandlers.update}
              onRemove={languageHandlers.remove}
              canRemove={true}
              listType="language"
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={languageHandlers.add}
            className="plasmo-w-full"
          >
            + 添加语言
          </Button>
        </div>
      </FormSection>

      {/* 自定义字段 */}
      <FormSection title="其他信息" icon="📋" defaultOpen={false}>
        <div className="plasmo-space-y-2">
          {formData.customFields.map((item, index) => (
            <DynamicListItem
              key={index}
              item={item}
              index={index}
              fields={customFieldFields}
              onChange={customFieldHandlers.update}
              onRemove={customFieldHandlers.remove}
              canRemove={true}
              listType="custom"
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={customFieldHandlers.add}
            className="plasmo-w-full"
          >
            + 添加自定义字段
          </Button>
        </div>
      </FormSection>

      {/* 操作按钮区域 */}
      <div className="plasmo-pt-2 plasmo-space-y-2">
        <div className="plasmo-flex plasmo-gap-2">
          <Button
            type="button"
            onClick={() => setIsOptimizeDialogOpen(true)}
            className="plasmo-flex-1 plasmo-bg-gradient-to-r plasmo-from-purple-600 plasmo-to-blue-600 hover:plasmo-from-purple-700 hover:plasmo-to-blue-700"
          >
            ✨ AI 一键优化简历
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleReset}
            className="plasmo-px-4"
          >
            🗑️ 重置
          </Button>
        </div>
        {resetMessage && (
          <p className="plasmo-text-center plasmo-text-sm plasmo-text-green-600">
            {resetMessage}
          </p>
        )}
      </div>

      {/* 优化对话框 */}
      <OptimizeDialog
        isOpen={isOptimizeDialogOpen}
        onClose={() => setIsOptimizeDialogOpen(false)}
        resumeData={formData}
        onOptimized={handleOptimized}
      />
    </div>
  )
}

