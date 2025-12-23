import { useState, useEffect, useCallback, useMemo } from "react"
import { useStorage, STORAGE_KEYS } from "./useStorage"
import {
  type ResumeData,
  type ResumeTemplate,
  type ResumeTemplatesStorage,
  defaultResumeData,
  defaultResumeTemplatesStorage,
  createDefaultTemplate,
  generateTemplateId,
} from "~types/resume"

/**
 * 简历模板管理 Hook
 * 提供模板的 CRUD 操作和数据迁移逻辑
 */
export function useResumeTemplates() {
  // 模板存储
  const [templatesStorage, setTemplatesStorage, isLoadingTemplates] =
    useStorage<ResumeTemplatesStorage>(
      STORAGE_KEYS.RESUME_TEMPLATES,
      defaultResumeTemplatesStorage
    )

  // 旧版简历数据（用于迁移）
  const [legacyResumeData, setLegacyResumeData, isLoadingLegacy] =
    useStorage<ResumeData | null>(STORAGE_KEYS.RESUME_DATA, null)

  // 是否已完成迁移检查
  const [migrationChecked, setMigrationChecked] = useState(false)

  // 总体加载状态
  const isLoading = isLoadingTemplates || isLoadingLegacy || !migrationChecked

  // 数据迁移：将旧的 resumeData 迁移到新的模板格式
  useEffect(() => {
    if (isLoadingTemplates || isLoadingLegacy) return

    // 如果模板列表为空，检查是否有旧数据需要迁移
    if (templatesStorage.templates.length === 0) {
      if (legacyResumeData && hasResumeContent(legacyResumeData)) {
        // 迁移旧数据到新模板
        const migratedTemplate: ResumeTemplate = {
          id: generateTemplateId(),
          name: "我的简历",
          data: legacyResumeData,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }

        setTemplatesStorage({
          templates: [migratedTemplate],
          currentTemplateId: migratedTemplate.id,
        })

        console.log("已将旧简历数据迁移到新模板系统")
      } else {
        // 没有旧数据，创建默认模板
        const defaultTemplate = createDefaultTemplate("我的简历")
        setTemplatesStorage({
          templates: [defaultTemplate],
          currentTemplateId: defaultTemplate.id,
        })
      }
    } else if (!templatesStorage.currentTemplateId) {
      // 有模板但没有选中的模板，选中第一个
      setTemplatesStorage((prev) => ({
        ...prev,
        currentTemplateId: prev.templates[0]?.id || "",
      }))
    }

    setMigrationChecked(true)
  }, [
    isLoadingTemplates,
    isLoadingLegacy,
    templatesStorage,
    legacyResumeData,
    setTemplatesStorage,
  ])

  // 当前选中的模板
  const currentTemplate = useMemo(() => {
    return templatesStorage.templates.find(
      (t) => t.id === templatesStorage.currentTemplateId
    )
  }, [templatesStorage.templates, templatesStorage.currentTemplateId])

  // 当前模板的简历数据
  const currentResumeData = useMemo(() => {
    return currentTemplate?.data || defaultResumeData
  }, [currentTemplate])

  // 切换模板
  const switchTemplate = useCallback(
    (templateId: string) => {
      if (templatesStorage.templates.some((t) => t.id === templateId)) {
        setTemplatesStorage((prev) => ({
          ...prev,
          currentTemplateId: templateId,
        }))
      }
    },
    [templatesStorage.templates, setTemplatesStorage]
  )

  // 添加新模板
  const addTemplate = useCallback(
    (name: string, copyFromCurrent: boolean = false) => {
      const newTemplate: ResumeTemplate = {
        id: generateTemplateId(),
        name,
        data: copyFromCurrent && currentTemplate
          ? { ...currentTemplate.data }
          : { ...defaultResumeData },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      setTemplatesStorage((prev) => ({
        templates: [...prev.templates, newTemplate],
        currentTemplateId: newTemplate.id,
      }))

      return newTemplate.id
    },
    [currentTemplate, setTemplatesStorage]
  )

  // 重命名模板
  const renameTemplate = useCallback(
    (templateId: string, newName: string) => {
      setTemplatesStorage((prev) => ({
        ...prev,
        templates: prev.templates.map((t) =>
          t.id === templateId
            ? { ...t, name: newName, updatedAt: Date.now() }
            : t
        ),
      }))
    },
    [setTemplatesStorage]
  )

  // 删除模板
  const deleteTemplate = useCallback(
    (templateId: string) => {
      // 不允许删除最后一个模板
      if (templatesStorage.templates.length <= 1) {
        return false
      }

      setTemplatesStorage((prev) => {
        const newTemplates = prev.templates.filter((t) => t.id !== templateId)
        const needNewCurrent = prev.currentTemplateId === templateId

        return {
          templates: newTemplates,
          currentTemplateId: needNewCurrent
            ? newTemplates[0]?.id || ""
            : prev.currentTemplateId,
        }
      })

      return true
    },
    [templatesStorage.templates.length, setTemplatesStorage]
  )

  // 更新当前模板的简历数据
  const updateCurrentResumeData = useCallback(
    (newData: ResumeData | ((prev: ResumeData) => ResumeData)) => {
      if (!templatesStorage.currentTemplateId) return

      setTemplatesStorage((prev) => ({
        ...prev,
        templates: prev.templates.map((t) => {
          if (t.id !== prev.currentTemplateId) return t

          const updatedData =
            typeof newData === "function" ? newData(t.data) : newData

          return {
            ...t,
            data: updatedData,
            updatedAt: Date.now(),
          }
        }),
      }))
    },
    [templatesStorage.currentTemplateId, setTemplatesStorage]
  )

  // 复制模板
  const duplicateTemplate = useCallback(
    (templateId: string) => {
      const template = templatesStorage.templates.find((t) => t.id === templateId)
      if (!template) return null

      const newTemplate: ResumeTemplate = {
        id: generateTemplateId(),
        name: `${template.name} (副本)`,
        data: { ...template.data },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      setTemplatesStorage((prev) => ({
        templates: [...prev.templates, newTemplate],
        currentTemplateId: newTemplate.id,
      }))

      return newTemplate.id
    },
    [templatesStorage.templates, setTemplatesStorage]
  )

  return {
    // 状态
    isLoading,
    templates: templatesStorage.templates,
    currentTemplateId: templatesStorage.currentTemplateId,
    currentTemplate,
    currentResumeData,

    // 操作方法
    switchTemplate,
    addTemplate,
    renameTemplate,
    deleteTemplate,
    duplicateTemplate,
    updateCurrentResumeData,
  }
}

/**
 * 检查简历数据是否有内容
 */
function hasResumeContent(data: ResumeData): boolean {
  // 检查个人信息是否有内容
  const hasPersonalInfo = Object.values(data.personalInfo).some(
    (v) => v && v.trim() !== ""
  )

  // 检查其他字段
  const hasOtherContent =
    data.selfIntro.trim() !== "" ||
    data.education.length > 0 ||
    data.workExperience.length > 0 ||
    data.projects.length > 0 ||
    data.skills.length > 0 ||
    data.languages.length > 0 ||
    data.customFields.length > 0

  return hasPersonalInfo || hasOtherContent
}

