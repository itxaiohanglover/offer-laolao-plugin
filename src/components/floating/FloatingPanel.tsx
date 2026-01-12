/**
 * 悬浮窗面板组件
 * 可拖拽、可最小化、可关闭
 */

import React, { useState, useEffect, useRef, useCallback } from "react"
import { ResumeForm } from "~features/popup/ResumeForm"
import { ResumeUpload } from "~features/popup/ResumeUpload"
import { ExportDialog } from "~features/popup/ExportDialog"
import { ModelSettingsForm, ParseSettingsForm, UISettingsForm } from "~features/popup/settings"
import { TemplateSelector } from "~components/common/TemplateSelector"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~components/ui/tabs"
import { Button } from "~components/ui/button"
import { useStorage, STORAGE_KEYS } from "~hooks/useStorage"
import { useResumeTemplates } from "~hooks/useResumeTemplates"
import { defaultResumeData, type ResumeData } from "~types/resume"
import { defaultUISettings, type UISettings, type FloatingPosition } from "~types/settings"
import type { ParsedResumeData } from "~services/resume-parse"
import iconUrl from "url:~/assets/icon.png"

interface FloatingPanelProps {
  onClose: () => void
}

/**
 * 将解析后的数据转换为存储格式
 */
function convertParsedDataToResumeData(
  parsedData: ParsedResumeData,
  existingData: ResumeData
): ResumeData {
  const result = { ...existingData }

  if (parsedData.personalInfo) {
    result.personalInfo = {
      name: parsedData.personalInfo.name || existingData.personalInfo.name,
      gender: parsedData.personalInfo.gender || existingData.personalInfo.gender,
      birthDate: existingData.personalInfo.birthDate,
      phone: parsedData.personalInfo.phone || existingData.personalInfo.phone,
      email: parsedData.personalInfo.email || existingData.personalInfo.email,
      idCard: existingData.personalInfo.idCard,
      location: existingData.personalInfo.location,
      politicalStatus:
        parsedData.personalInfo["political-status"] ||
        existingData.personalInfo.politicalStatus,
    }

    result.jobExpectation = {
      ...existingData.jobExpectation,
      expectedPosition:
        parsedData.personalInfo["expected-position"] ||
        existingData.jobExpectation.expectedPosition,
      expectedIndustry:
        parsedData.personalInfo["expected-industry"] ||
        existingData.jobExpectation.expectedIndustry,
      expectedSalary:
        parsedData.personalInfo["expected-salary"] ||
        existingData.jobExpectation.expectedSalary,
      expectedLocation:
        parsedData.personalInfo["expected-location"] ||
        existingData.jobExpectation.expectedLocation,
    }

    if (parsedData.personalInfo["self-intro"]) {
      result.selfIntro = parsedData.personalInfo["self-intro"]
    }
  }

  if (parsedData.education && parsedData.education.length > 0) {
    result.education = parsedData.education.map((edu, index) => ({
      school: edu[`education[${index}][school]`] || "",
      major: edu[`education[${index}][major]`] || "",
      degree: edu[`education[${index}][degree]`] || "",
      rank: edu[`education[${index}][rank]`] || "",
      startDate: edu[`education[${index}][start-date]`] || "",
      endDate: edu[`education[${index}][end-date]`] || "",
    }))
  }

  if (parsedData.workExperience && parsedData.workExperience.length > 0) {
    result.workExperience = parsedData.workExperience.map((work, index) => ({
      company: work[`internship[${index}][company]`] || "",
      position: work[`internship[${index}][position]`] || "",
      startDate: work[`internship[${index}][start-date]`] || "",
      endDate: work[`internship[${index}][end-date]`] || "",
      description: work[`internship[${index}][description]`] || "",
    }))
  }

  if (parsedData.projects && parsedData.projects.length > 0) {
    result.projects = parsedData.projects.map((proj, index) => ({
      projectName: proj[`project[${index}][project-name]`] || "",
      role: proj[`project[${index}][role]`] || "",
      projectTime: proj[`project[${index}][project-time]`] || "",
      projectDesc: proj[`project[${index}][project-desc]`] || "",
      responsibilities: proj[`project[${index}][responsibilities]`] || "",
    }))
  }

  if (parsedData.skills && parsedData.skills.length > 0) {
    result.skills = parsedData.skills.map((skill, index) => ({
      name: skill[`skills[${index}][name]`] || "",
      level: skill[`skills[${index}][level]`] || "",
    }))
  }

  if (parsedData.languages && parsedData.languages.length > 0) {
    result.languages = parsedData.languages.map((lang, index) => ({
      name: lang[`language[${index}][name]`] || "",
      proficiency: lang[`language[${index}][proficiency]`] || "",
      certificate: lang[`language[${index}][certificate]`] || "",
    }))
  }

  return result
}

export function FloatingPanel({ onClose }: FloatingPanelProps) {
  const [activeTab, setActiveTab] = useState("resume")
  const [saveMessage, setSaveMessage] = useState("")
  const [fillMessage, setFillMessage] = useState("")
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  // 拖拽相关状态
  const [position, setPosition] = useState<FloatingPosition>({ x: 20, y: 20 })
  const [isDragging, setIsDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const panelRef = useRef<HTMLDivElement>(null)

  // 使用模板系统
  const {
    isLoading: isTemplatesLoading,
    templates,
    currentTemplateId,
    currentResumeData,
    switchTemplate,
    addTemplate,
    renameTemplate,
    deleteTemplate,
    duplicateTemplate,
    updateCurrentResumeData,
  } = useResumeTemplates()

  // UI 设置存储
  const [uiSettings, setUISettings] = useStorage<UISettings>(
    STORAGE_KEYS.UI_SETTINGS,
    defaultUISettings
  )

  // 从存储加载位置
  useEffect(() => {
    if (uiSettings.floatingPosition) {
      setPosition(uiSettings.floatingPosition)
    }
    if (uiSettings.floatingMinimized !== undefined) {
      setIsMinimized(uiSettings.floatingMinimized)
    }
  }, [uiSettings])

  // 保存位置到存储
  const savePosition = useCallback(
    (newPosition: FloatingPosition) => {
      setUISettings((prev) => ({
        ...prev,
        floatingPosition: newPosition,
      }))
    },
    [setUISettings]
  )

  // 拖拽开始
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest(".no-drag")) return
      setIsDragging(true)
      dragOffset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      }
    },
    [position]
  )

  // 拖拽移动
  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const newX = Math.max(0, Math.min(window.innerWidth - 420, e.clientX - dragOffset.current.x))
      const newY = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragOffset.current.y))
      setPosition({ x: newX, y: newY })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      savePosition(position)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, position, savePosition])

  // 处理解析数据填充
  const handleParsedData = useCallback(
    (parsedData: ParsedResumeData) => {
      const newResumeData = convertParsedDataToResumeData(parsedData, currentResumeData)
      updateCurrentResumeData(newResumeData)
      setFillMessage("✓ 数据已填充到表单")
      setTimeout(() => setFillMessage(""), 3000)
    },
    [currentResumeData, updateCurrentResumeData]
  )

  // 处理保存设置
  const handleSaveSettings = () => {
    setSaveMessage("✓ 设置已保存")
    setTimeout(() => setSaveMessage(""), 2000)
  }

  // 最小化/展开
  const toggleMinimize = () => {
    const newMinimized = !isMinimized
    setIsMinimized(newMinimized)
    setUISettings((prev) => ({
      ...prev,
      floatingMinimized: newMinimized,
    }))
  }

  // 最小化状态
  if (isMinimized) {
    return (
      <div
        ref={panelRef}
        style={{
          position: "fixed",
          left: position.x,
          top: position.y,
          zIndex: 2147483647,
        }}
        className="plasmo-bg-gradient-to-r plasmo-from-primary plasmo-to-purple-600 plasmo-rounded-full plasmo-shadow-2xl plasmo-cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-p-3">
          <span className="plasmo-text-xl">🎯</span>
          <button
            onClick={toggleMinimize}
            className="no-drag plasmo-text-white hover:plasmo-bg-white/20 plasmo-rounded plasmo-p-1 plasmo-transition-colors"
            title="展开"
          >
            ▢
          </button>
          <button
            onClick={onClose}
            className="no-drag plasmo-text-white hover:plasmo-bg-white/20 plasmo-rounded plasmo-p-1 plasmo-transition-colors"
            title="关闭"
          >
            ✕
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        zIndex: 2147483647,
      }}
      className="plasmo-w-[400px] plasmo-max-h-[600px] plasmo-bg-background plasmo-rounded-lg plasmo-shadow-2xl plasmo-border plasmo-border-border plasmo-overflow-hidden"
    >
      {/* 导出对话框 */}
      <ExportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        resumeData={currentResumeData}
      />

      {/* 可拖拽的标题栏 */}
      <div
        className="plasmo-bg-gradient-to-r plasmo-from-primary plasmo-to-purple-600 plasmo-p-3 plasmo-cursor-move plasmo-select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="plasmo-flex plasmo-items-center plasmo-justify-between">
          <div className="plasmo-flex plasmo-items-center plasmo-gap-2">
            <img
              src={iconUrl}
              alt="Offer 捞捞"
              className="plasmo-w-10 plasmo-h-10 plasmo-bg-white/20 plasmo-rounded-lg plasmo-flex plasmo-items-center plasmo-justify-center"
            />
            <h1 className="plasmo-text-sm plasmo-font-bold plasmo-text-white">
              Offer 捞捞
            </h1>
          </div>
          <div className="plasmo-flex plasmo-items-center plasmo-gap-1">
            <button
              onClick={toggleMinimize}
              className="no-drag plasmo-text-white hover:plasmo-bg-white/20 plasmo-rounded plasmo-p-1.5 plasmo-transition-colors"
              title="最小化"
            >
              ─
            </button>
            <button
              onClick={onClose}
              className="no-drag plasmo-text-white hover:plasmo-bg-white/20 plasmo-rounded plasmo-p-1.5 plasmo-transition-colors"
              title="关闭"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="plasmo-px-3 plasmo-pt-3 plasmo-overflow-auto plasmo-max-h-[520px]">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="resume">📝 简历填写</TabsTrigger>
            <TabsTrigger value="settings">⚙️ 设置</TabsTrigger>
          </TabsList>

          {/* Resume Content */}
          <TabsContent value="resume">
            <div className="plasmo-py-2 plasmo-space-y-4">
              {/* 模板选择器 */}
              {isTemplatesLoading ? (
                <div className="plasmo-p-3 plasmo-bg-muted/30 plasmo-rounded-lg plasmo-text-center plasmo-text-sm plasmo-text-muted-foreground">
                  加载模板中...
                </div>
              ) : (
                <TemplateSelector
                  templates={templates}
                  currentTemplateId={currentTemplateId}
                  onSwitch={switchTemplate}
                  onAdd={addTemplate}
                  onRename={renameTemplate}
                  onDelete={deleteTemplate}
                  onDuplicate={duplicateTemplate}
                />
              )}

              {/* 简历上传区域 */}
              <div className="plasmo-p-3 plasmo-bg-muted/30 plasmo-rounded-lg">
                <h4 className="plasmo-text-sm plasmo-font-medium plasmo-mb-3 plasmo-flex plasmo-items-center plasmo-gap-2">
                  📤 上传简历
                </h4>
                <ResumeUpload onParsedData={handleParsedData} />
                {fillMessage && (
                  <p className="plasmo-text-center plasmo-text-sm plasmo-text-green-600 plasmo-mt-2">
                    {fillMessage}
                  </p>
                )}
              </div>

              {/* 表单区域 */}
              <ResumeForm />

              {/* 导出按钮 */}
              <div className="plasmo-pt-2 plasmo-pb-4">
                <Button
                  onClick={() => setIsExportDialogOpen(true)}
                  variant="outline"
                  className="plasmo-w-full"
                >
                  📥 导出简历
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Settings Content */}
          <TabsContent value="settings">
            <div className="plasmo-py-2 plasmo-space-y-6">
              {/* 界面设置 */}
              <UISettingsForm />

              {/* 分隔线 */}
              <div className="plasmo-border-t plasmo-border-border" />

              {/* AI 模型配置 */}
              <ModelSettingsForm />

              {/* 分隔线 */}
              <div className="plasmo-border-t plasmo-border-border" />

              {/* 简历解析配置 */}
              <ParseSettingsForm />


              {/* 提示 */}
              <div className="plasmo-mt-4 plasmo-p-3 plasmo-bg-muted/30 plasmo-rounded-lg">
                <p className="plasmo-text-xs plasmo-text-muted-foreground">
                  💡 提示：如需切换回弹窗模式，请在设置页面更改界面模式
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

