import React, { useCallback, useState } from "react"

import { Button } from "~components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~components/ui/tabs"
import { TemplateSelector } from "~components/common/TemplateSelector"
import { ExportDialog } from "~features/popup/ExportDialog"
import { ResumeForm } from "~features/popup/ResumeForm"
import { ResumeUpload } from "~features/popup/ResumeUpload"
import {
  ModelSettingsForm,
  ParseSettingsForm,
  UISettingsForm
} from "~features/popup/settings"
import { useResumeTemplates } from "~hooks/useResumeTemplates"
import type { ParsedResumeData } from "~services/resume-parse"
import { defaultResumeData, type ResumeData } from "~types/resume"

import "~style.css"

import iconUrl from "url:~assets/icon.png"

/**
 * 将解析后的数据转换为存储格式
 */
function convertParsedDataToResumeData(
  parsedData: ParsedResumeData,
  existingData: ResumeData
): ResumeData {
  const result = { ...existingData }

  // 转换个人信息
  if (parsedData.personalInfo) {
    result.personalInfo = {
      name: parsedData.personalInfo.name || existingData.personalInfo.name,
      gender:
        parsedData.personalInfo.gender || existingData.personalInfo.gender,
      birthDate: existingData.personalInfo.birthDate, // 解析数据中通常没有出生日期
      phone: parsedData.personalInfo.phone || existingData.personalInfo.phone,
      email: parsedData.personalInfo.email || existingData.personalInfo.email,
      idCard: existingData.personalInfo.idCard,
      location: existingData.personalInfo.location,
      politicalStatus:
        parsedData.personalInfo["political-status"] ||
        existingData.personalInfo.politicalStatus
    }

    // 求职期望
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
        existingData.jobExpectation.expectedLocation
    }

    // 自我介绍
    if (parsedData.personalInfo["self-intro"]) {
      result.selfIntro = parsedData.personalInfo["self-intro"]
    }
  }

  // 转换教育经历
  if (parsedData.education && parsedData.education.length > 0) {
    result.education = parsedData.education.map((edu, index) => ({
      school: edu[`education[${index}][school]`] || "",
      major: edu[`education[${index}][major]`] || "",
      degree: edu[`education[${index}][degree]`] || "",
      rank: edu[`education[${index}][rank]`] || "",
      startDate: edu[`education[${index}][start-date]`] || "",
      endDate: edu[`education[${index}][end-date]`] || ""
    }))
  }

  // 转换工作/实习经历
  if (parsedData.workExperience && parsedData.workExperience.length > 0) {
    result.workExperience = parsedData.workExperience.map((work, index) => ({
      company: work[`internship[${index}][company]`] || "",
      position: work[`internship[${index}][position]`] || "",
      startDate: work[`internship[${index}][start-date]`] || "",
      endDate: work[`internship[${index}][end-date]`] || "",
      description: work[`internship[${index}][description]`] || ""
    }))
  }

  // 转换项目经历
  if (parsedData.projects && parsedData.projects.length > 0) {
    result.projects = parsedData.projects.map((proj, index) => ({
      projectName: proj[`project[${index}][project-name]`] || "",
      role: proj[`project[${index}][role]`] || "",
      projectTime: proj[`project[${index}][project-time]`] || "",
      projectDesc: proj[`project[${index}][project-desc]`] || "",
      responsibilities: proj[`project[${index}][responsibilities]`] || ""
    }))
  }

  // 转换技能
  if (parsedData.skills && parsedData.skills.length > 0) {
    result.skills = parsedData.skills.map((skill, index) => ({
      name: skill[`skills[${index}][name]`] || "",
      level: skill[`skills[${index}][level]`] || ""
    }))
  }

  // 转换语言能力
  if (parsedData.languages && parsedData.languages.length > 0) {
    result.languages = parsedData.languages.map((lang, index) => ({
      name: lang[`language[${index}][name]`] || "",
      proficiency: lang[`language[${index}][proficiency]`] || "",
      certificate: lang[`language[${index}][certificate]`] || ""
    }))
  }

  return result
}

function IndexPopup() {
  const [activeTab, setActiveTab] = useState("resume")
  const [saveMessage, setSaveMessage] = useState("")
  const [fillMessage, setFillMessage] = useState("")
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)

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

  // 处理解析数据填充
  const handleParsedData = useCallback(
    (parsedData: ParsedResumeData) => {
      const newResumeData = convertParsedDataToResumeData(
        parsedData,
        currentResumeData
      )
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

  return (
    <div className="plasmo-w-[400px] plasmo-min-h-[500px] plasmo-max-h-[600px] plasmo-overflow-auto plasmo-bg-background">
      {/* 导出对话框 */}
      <ExportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        resumeData={currentResumeData}
      />

      {/* Header */}
      <div className="plasmo-bg-gradient-to-r plasmo-from-primary plasmo-to-purple-600 plasmo-p-4">
        <div className="plasmo-flex plasmo-items-center plasmo-gap-3">
          <img
            src={iconUrl}
            alt="Offer 捞捞"
            className="plasmo-w-10 plasmo-h-10 plasmo-bg-white/20 plasmo-rounded-lg plasmo-flex plasmo-items-center plasmo-justify-center"
          />

          <div>
            <h1 className="plasmo-text-lg plasmo-font-bold plasmo-text-white">
              Offer 捞捞
            </h1>
            <p className="plasmo-text-xs plasmo-text-white/80">
              简历自动填写助手
            </p>
          </div>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="plasmo-px-4 plasmo-pt-4">
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
                  className="plasmo-w-full">
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


              {/* 使用说明 */}
              <div className="plasmo-mt-6 plasmo-p-4 plasmo-bg-muted/30 plasmo-rounded-lg">
                <h4 className="plasmo-text-sm plasmo-font-medium plasmo-mb-3">
                  📖 使用说明
                </h4>
                <ul className="plasmo-text-xs plasmo-text-muted-foreground plasmo-space-y-2">
                  <li className="plasmo-flex plasmo-gap-2">
                    <span className="plasmo-text-primary">1.</span>
                    填写简历信息，系统会<strong>自动保存</strong>您的输入
                  </li>
                  <li className="plasmo-flex plasmo-gap-2">
                    <span className="plasmo-text-primary">2.</span>
                    切换到目标网站页面，点击"预填"快速填充表单
                  </li>
                  <li className="plasmo-flex plasmo-gap-2">
                    <span className="plasmo-text-primary">3.</span>
                    配置"简历解析 API"以启用智能简历解析功能
                  </li>
                  <li className="plasmo-flex plasmo-gap-2">
                    <span className="plasmo-text-primary">4.</span>
                    配置"AI 模型"以启用简历内容优化功能（可选）
                  </li>
                  <li className="plasmo-flex plasmo-gap-2">
                    <span className="plasmo-text-primary">5.</span>
                    设置会自动保存，无需手动点击保存按钮
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default IndexPopup
