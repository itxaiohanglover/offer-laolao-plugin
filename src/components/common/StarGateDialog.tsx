import React from "react"
import { Button } from "~components/ui/button"
import { GITHUB_REPO } from "~hooks/useStarGate"

interface StarGateDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  featureName?: string
}

/**
 * Star Gate 弹窗组件
 * 提示用户 Star GitHub 项目以解锁高级功能
 */
export function StarGateDialog({
  isOpen,
  onClose,
  onConfirm,
  featureName = "高级功能",
}: StarGateDialogProps) {
  if (!isOpen) return null

  const handleStarClick = () => {
    // 打开 GitHub 仓库页面
    window.open(GITHUB_REPO.url, "_blank")
  }

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <div className="plasmo-fixed plasmo-inset-0 plasmo-bg-black/60 plasmo-flex plasmo-items-center plasmo-justify-center plasmo-z-[2147483647]">
      <div className="plasmo-bg-background plasmo-rounded-xl plasmo-p-6 plasmo-w-96 plasmo-shadow-2xl plasmo-border plasmo-border-border plasmo-animate-in plasmo-fade-in plasmo-zoom-in-95">
        {/* 标题区域 */}
        <div className="plasmo-text-center plasmo-mb-6">
          <div className="plasmo-text-5xl plasmo-mb-3">⭐</div>
          <h2 className="plasmo-text-xl plasmo-font-bold plasmo-text-foreground plasmo-mb-2">
            解锁{featureName}
          </h2>
          <p className="plasmo-text-sm plasmo-text-muted-foreground">
            感谢您使用 Offer 捞捞！
          </p>
        </div>

        {/* 内容区域 */}
        <div className="plasmo-bg-muted/30 plasmo-rounded-lg plasmo-p-4 plasmo-mb-6">
          <p className="plasmo-text-sm plasmo-text-foreground plasmo-mb-3">
            我们的项目完全开源免费，如果您觉得有帮助，请花 1 秒钟为我们的 GitHub 项目点个 ⭐ Star！
          </p>
          <p className="plasmo-text-xs plasmo-text-muted-foreground">
            您的支持是我们持续改进的动力 💪
          </p>
        </div>

        {/* GitHub 仓库信息 - 可点击 */}
        <button
          onClick={handleStarClick}
          className="plasmo-w-full plasmo-flex plasmo-items-center plasmo-justify-center plasmo-gap-2 plasmo-mb-6 plasmo-p-3 plasmo-bg-gray-900 hover:plasmo-bg-gray-800 plasmo-rounded-lg plasmo-transition-colors plasmo-cursor-pointer"
        >
          <svg
            className="plasmo-w-5 plasmo-h-5 plasmo-text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
          <span className="plasmo-text-white plasmo-text-sm plasmo-font-medium">
            {GITHUB_REPO.owner}/{GITHUB_REPO.repo}
          </span>
          <span className="plasmo-text-white/60 plasmo-text-xs">点击打开 →</span>
        </button>

        {/* 按钮区域 - 同时显示两个主要按钮 */}
        <div className="plasmo-space-y-3">
          <Button
            onClick={handleConfirm}
            className="plasmo-w-full plasmo-bg-gradient-to-r plasmo-from-green-500 plasmo-to-emerald-500 hover:plasmo-from-green-600 hover:plasmo-to-emerald-600 plasmo-text-white plasmo-font-medium"
          >
            ✓ 我已完成 Star，解锁功能
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            className="plasmo-w-full plasmo-text-muted-foreground"
          >
            稍后再说
          </Button>
        </div>

        {/* 底部提示 */}
        <p className="plasmo-text-center plasmo-text-xs plasmo-text-muted-foreground plasmo-mt-4">
          解锁后可永久使用所有高级功能
        </p>
      </div>
    </div>
  )
}

