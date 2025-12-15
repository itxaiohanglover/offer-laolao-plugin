import React, { useState, useCallback } from "react"
import { Button } from "~components/ui/button"
import { exportAsJSON, exportAsLatex } from "~utils/export"
import type { ResumeData } from "~types/resume"

interface ExportDialogProps {
  isOpen: boolean
  onClose: () => void
  resumeData: ResumeData
}

type ExportStatus = "idle" | "success" | "error"

interface ExportMessage {
  type: ExportStatus
  text: string
}

/**
 * 导出对话框组件
 * 提供 JSON 和 LaTeX 两种导出格式选择
 */
export function ExportDialog({ isOpen, onClose, resumeData }: ExportDialogProps) {
  const [message, setMessage] = useState<ExportMessage | null>(null)

  // 处理 JSON 导出
  const handleExportJSON = useCallback(() => {
    const success = exportAsJSON(resumeData)
    if (success) {
      setMessage({ type: "success", text: "✓ JSON 简历数据已导出" })
      setTimeout(() => {
        setMessage(null)
        onClose()
      }, 1500)
    } else {
      setMessage({ type: "error", text: "✕ 导出 JSON 失败，请重试" })
      setTimeout(() => setMessage(null), 3000)
    }
  }, [resumeData, onClose])

  // 处理 LaTeX 导出
  const handleExportLatex = useCallback(() => {
    const success = exportAsLatex(resumeData)
    if (success) {
      setMessage({ type: "success", text: "✓ LaTeX 简历已导出，可在 Overleaf 上打开" })
      setTimeout(() => {
        setMessage(null)
        onClose()
      }, 1500)
    } else {
      setMessage({ type: "error", text: "✕ 导出 LaTeX 失败，请重试" })
      setTimeout(() => setMessage(null), 3000)
    }
  }, [resumeData, onClose])

  // 处理点击遮罩层关闭
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose()
      }
    },
    [onClose]
  )

  if (!isOpen) return null

  return (
    <div
      className="plasmo-fixed plasmo-inset-0 plasmo-bg-black/50 plasmo-flex plasmo-items-center plasmo-justify-center plasmo-z-50"
      onClick={handleOverlayClick}
    >
      <div className="plasmo-bg-background plasmo-rounded-lg plasmo-shadow-xl plasmo-w-[320px] plasmo-p-6 plasmo-animate-in plasmo-fade-in plasmo-zoom-in-95">
        {/* 标题 */}
        <h3 className="plasmo-text-lg plasmo-font-semibold plasmo-text-center plasmo-mb-5">
          选择导出格式
        </h3>

        {/* 导出选项 */}
        <div className="plasmo-flex plasmo-flex-col plasmo-gap-3">
          {/* JSON 导出 */}
          <button
            onClick={handleExportJSON}
            className="plasmo-w-full plasmo-p-4 plasmo-rounded-lg plasmo-bg-gradient-to-r plasmo-from-blue-500 plasmo-to-blue-600 hover:plasmo-from-blue-600 hover:plasmo-to-blue-700 plasmo-text-white plasmo-transition-all plasmo-duration-200 hover:plasmo-scale-[1.02] hover:plasmo-shadow-lg"
          >
            <div className="plasmo-flex plasmo-items-center plasmo-gap-3">
              <span className="plasmo-text-2xl">📄</span>
              <div className="plasmo-text-left">
                <div className="plasmo-font-semibold">导出为 JSON</div>
                <div className="plasmo-text-xs plasmo-text-white/80">
                  可用于数据备份和导入
                </div>
              </div>
            </div>
          </button>

          {/* LaTeX 导出 */}
          <button
            onClick={handleExportLatex}
            className="plasmo-w-full plasmo-p-4 plasmo-rounded-lg plasmo-bg-gradient-to-r plasmo-from-green-500 plasmo-to-green-600 hover:plasmo-from-green-600 hover:plasmo-to-green-700 plasmo-text-white plasmo-transition-all plasmo-duration-200 hover:plasmo-scale-[1.02] hover:plasmo-shadow-lg"
          >
            <div className="plasmo-flex plasmo-items-center plasmo-gap-3">
              <span className="plasmo-text-2xl">📝</span>
              <div className="plasmo-text-left">
                <div className="plasmo-font-semibold">导出为 LaTeX</div>
                <div className="plasmo-text-xs plasmo-text-white/80">
                  可在 Overleaf 上编辑打印
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* 状态消息 */}
        {message && (
          <div
            className={`plasmo-mt-4 plasmo-p-3 plasmo-rounded-md plasmo-text-center plasmo-text-sm ${
              message.type === "success"
                ? "plasmo-bg-green-100 plasmo-text-green-700"
                : "plasmo-bg-red-100 plasmo-text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* 取消按钮 */}
        <Button
          variant="outline"
          onClick={onClose}
          className="plasmo-w-full plasmo-mt-4"
        >
          取消
        </Button>
      </div>
    </div>
  )
}

