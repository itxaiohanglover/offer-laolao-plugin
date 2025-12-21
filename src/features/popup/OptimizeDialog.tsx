import React, { useState, useEffect, useMemo } from "react"
import { Button } from "~components/ui/button"
import { optimizeEntireResume } from "~services/model-api"
import { useStorage, STORAGE_KEYS } from "~hooks/useStorage"
import type { ResumeData, OptimizeProgress } from "~types/resume"
import type { ModelSettings } from "~types/settings"

interface OptimizeDialogProps {
  isOpen: boolean
  onClose: () => void
  resumeData: ResumeData
  onOptimized: (optimizedData: ResumeData) => void
}

export function OptimizeDialog({
  isOpen,
  onClose,
  resumeData,
  onOptimized,
}: OptimizeDialogProps) {
  const [optimizing, setOptimizing] = useState(false)
  const [progress, setProgress] = useState<OptimizeProgress | null>(null)
  const [result, setResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const [modelSettings] = useStorage<ModelSettings>(
    STORAGE_KEYS.MODEL_SETTINGS,
    {
      provider: "deepseek",
      model: "deepseek-chat",
      apiKey: "",
      customUrl: "",
    }
  )

  // 计算待优化项目列表
  const itemsList = useMemo(() => {
    const items: string[] = []

    // 自我介绍
    if (resumeData.selfIntro && resumeData.selfIntro.trim()) {
      items.push("自我介绍")
    }

    // 工作经历
    if (resumeData.workExperience && resumeData.workExperience.length > 0) {
      resumeData.workExperience.forEach((work, index) => {
        if (work.description && work.description.trim()) {
          items.push(
            `工作经历 ${index + 1}${work.company ? ` - ${work.company}` : ""}`
          )
        }
      })
    }

    // 项目经历
    if (resumeData.projects && resumeData.projects.length > 0) {
      resumeData.projects.forEach((project, index) => {
        const projectName =
          project.projectName || `项目 ${index + 1}`

        if (project.projectDesc && project.projectDesc.trim()) {
          items.push(`项目描述 - ${projectName}`)
        }
        if (project.responsibilities && project.responsibilities.trim()) {
          items.push(`项目职责 - ${projectName}`)
        }
      })
    }

    return items
  }, [resumeData])

  // 检查是否有可优化内容
  const hasContent = itemsList.length > 0

  // 检查API配置
  const hasApiConfig = Boolean(
    modelSettings.apiKey ||
      modelSettings.apiKeys?.[modelSettings.provider]
  )

  // 重置状态
  useEffect(() => {
    if (!isOpen) {
      setOptimizing(false)
      setProgress(null)
      setResult(null)
    }
  }, [isOpen])

  // 开始优化
  const handleStartOptimize = async () => {
    if (!hasApiConfig) {
      setResult({
        success: false,
        message: "请先在设置中配置 AI 模型 API Key",
      })
      return
    }

    if (!hasContent) {
      setResult({
        success: false,
        message: "请先填写简历的描述性内容（自我介绍、工作描述、项目描述等）",
      })
      return
    }

    setOptimizing(true)
    setResult(null)

    try {
      const optimizedData = await optimizeEntireResume(
        resumeData,
        modelSettings,
        (progressInfo) => {
          setProgress(progressInfo)
        }
      )

      setResult({
        success: true,
        message: `已成功优化 ${itemsList.length} 项内容`,
      })

      // 通知父组件更新数据
      onOptimized(optimizedData)
    } catch (error) {
      console.error("优化失败:", error)
      setResult({
        success: false,
        message:
          error instanceof Error ? error.message : "优化失败，请重试",
      })
    } finally {
      setOptimizing(false)
    }
  }

  // 重试
  const handleRetry = () => {
    setResult(null)
    handleStartOptimize()
  }

  if (!isOpen) return null

  return (
    <div
      className="plasmo-fixed plasmo-inset-0 plasmo-bg-black/60 plasmo-flex plasmo-items-center plasmo-justify-center plasmo-z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget && !optimizing) {
          onClose()
        }
      }}
    >
      <div className="plasmo-bg-white plasmo-rounded-xl plasmo-p-6 plasmo-w-[360px] plasmo-max-h-[80vh] plasmo-overflow-y-auto plasmo-shadow-2xl">
        {/* Header */}
        <div className="plasmo-text-center plasmo-mb-5">
          <div className="plasmo-text-5xl plasmo-mb-3">✨</div>
          <h3 className="plasmo-text-xl plasmo-font-semibold plasmo-text-gray-900 plasmo-mb-2">
            AI 一键优化简历
          </h3>
          <p className="plasmo-text-sm plasmo-text-gray-600">
            使用 AI 智能优化您的简历内容
          </p>
        </div>

        {/* Preview - 待优化内容列表 */}
        {!optimizing && !result && (
          <div className="plasmo-bg-gray-50 plasmo-rounded-lg plasmo-p-4 plasmo-mb-5 plasmo-max-h-[200px] plasmo-overflow-y-auto">
            <p className="plasmo-text-sm plasmo-font-semibold plasmo-text-gray-800 plasmo-mb-3">
              将优化以下内容：
            </p>
            <ul className="plasmo-list-disc plasmo-pl-5 plasmo-text-sm plasmo-text-gray-600 plasmo-space-y-1.5">
              {itemsList.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            {itemsList.length === 0 && (
              <p className="plasmo-text-sm plasmo-text-gray-500 plasmo-text-center">
                暂无可优化内容
              </p>
            )}
          </div>
        )}

        {/* Progress - 优化进度 */}
        {optimizing && progress && (
          <div className="plasmo-mb-5">
            <div className="plasmo-flex plasmo-items-center plasmo-gap-3 plasmo-mb-3">
              <div className="plasmo-w-5 plasmo-h-5 plasmo-border-2 plasmo-border-gray-200 plasmo-border-t-blue-600 plasmo-rounded-full plasmo-animate-spin" />
              <span className="plasmo-text-sm plasmo-text-gray-800">
                正在优化 ({progress.current}/{progress.total})
              </span>
            </div>
            <div className="plasmo-bg-gray-200 plasmo-rounded plasmo-h-2 plasmo-overflow-hidden">
              <div
                className="plasmo-bg-gradient-to-r plasmo-from-blue-600 plasmo-to-blue-400 plasmo-h-full plasmo-transition-all plasmo-duration-300"
                style={{
                  width: `${Math.round((progress.current / progress.total) * 100)}%`,
                }}
              />
            </div>
            <p className="plasmo-text-xs plasmo-text-gray-600 plasmo-mt-2">
              {progress.status === "processing" && `正在处理: ${progress.currentTask}`}
              {progress.status === "completed" && `已完成: ${progress.currentTask}`}
            </p>
          </div>
        )}

        {/* Result - 优化结果 */}
        {result && (
          <div className="plasmo-mb-5">
            <div
              className={`plasmo-rounded-lg plasmo-p-4 plasmo-text-center ${
                result.success
                  ? "plasmo-bg-green-50 plasmo-border plasmo-border-green-200"
                  : "plasmo-bg-red-50 plasmo-border plasmo-border-red-200"
              }`}
            >
              <div className="plasmo-text-3xl plasmo-mb-2">
                {result.success ? "🎉" : "😞"}
              </div>
              <p
                className={`plasmo-font-semibold plasmo-mb-2 ${
                  result.success ? "plasmo-text-green-800" : "plasmo-text-red-800"
                }`}
              >
                {result.success ? "优化完成！" : "优化失败"}
              </p>
              <p
                className={`plasmo-text-sm ${
                  result.success ? "plasmo-text-green-700" : "plasmo-text-red-700"
                }`}
              >
                {result.message}
              </p>
            </div>
          </div>
        )}

        {/* Actions - 按钮组 */}
        <div className="plasmo-flex plasmo-gap-3">
          {!optimizing && !result && (
            <>
              <Button
                onClick={handleStartOptimize}
                disabled={!hasContent || !hasApiConfig}
                className="plasmo-flex-1 plasmo-bg-gradient-to-r plasmo-from-blue-600 plasmo-to-blue-500 hover:plasmo-from-blue-700 hover:plasmo-to-blue-600"
              >
                🚀 开始优化
              </Button>
              <Button onClick={onClose} variant="outline">
                取消
              </Button>
            </>
          )}

          {optimizing && (
            <Button disabled className="plasmo-flex-1" variant="outline">
              正在优化中...
            </Button>
          )}

          {result && result.success && (
            <Button
              onClick={onClose}
              className="plasmo-flex-1 plasmo-bg-gradient-to-r plasmo-from-green-600 plasmo-to-green-500 hover:plasmo-from-green-700 hover:plasmo-to-green-600"
            >
              ✓ 完成
            </Button>
          )}

          {result && !result.success && (
            <>
              <Button
                onClick={handleRetry}
                className="plasmo-flex-1 plasmo-bg-gradient-to-r plasmo-from-blue-600 plasmo-to-blue-500 hover:plasmo-from-blue-700 hover:plasmo-to-blue-600"
              >
                重试
              </Button>
              <Button onClick={onClose} variant="outline">
                关闭
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

