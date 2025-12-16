/**
 * 界面设置表单
 * 用于选择界面模式（弹窗/悬浮窗）
 */

import { useState } from "react"
import { Label } from "~components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~components/ui/select"
import { useStorage, STORAGE_KEYS } from "~hooks/useStorage"
import type { UISettings, UIMode } from "~types/settings"
import { defaultUISettings } from "~types/settings"

export function UISettingsForm() {
  const [settings, setSettings, isLoading] = useStorage<UISettings>(
    STORAGE_KEYS.UI_SETTINGS,
    defaultUISettings
  )
  const [switchMessage, setSwitchMessage] = useState<string>("")

  // 当模式改变时，通知 background script 更新 popup 行为
  const handleModeChange = async (mode: UIMode) => {
    const previousMode = settings.mode
    setSettings((prev) => ({ ...prev, mode }))

    // 通知 background script 更新 popup 行为
    try {
      await chrome.runtime.sendMessage({ action: "setUIMode", mode })
      
      // 显示切换提示
      if (mode === "popup" && previousMode === "floating") {
        setSwitchMessage("已切换到弹窗模式，请关闭此窗口后重新点击扩展图标")
      } else if (mode === "floating" && previousMode === "popup") {
        setSwitchMessage("已切换到悬浮窗模式，下次点击扩展图标将显示悬浮窗")
      }
      setTimeout(() => setSwitchMessage(""), 5000)
    } catch (error) {
      console.error("Failed to update UI mode:", error)
    }
  }

  if (isLoading) {
    return <div className="plasmo-text-sm plasmo-text-muted-foreground">加载中...</div>
  }

  return (
    <div className="plasmo-space-y-4">
      <div className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-mb-3">
        <span className="plasmo-text-lg">🖥️</span>
        <h3 className="plasmo-text-sm plasmo-font-semibold">界面设置</h3>
      </div>

      <div className="plasmo-space-y-2">
        <Label className="plasmo-text-xs">界面模式</Label>
        <Select
          value={settings.mode}
          onValueChange={(value) => handleModeChange(value as UIMode)}
        >
          <SelectTrigger>
            <SelectValue placeholder="选择界面模式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popup">
              <div className="plasmo-flex plasmo-items-center plasmo-gap-2">
                <span>📋</span>
                <span>弹窗模式</span>
              </div>
            </SelectItem>
            <SelectItem value="floating">
              <div className="plasmo-flex plasmo-items-center plasmo-gap-2">
                <span>🪟</span>
                <span>悬浮窗模式</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="plasmo-text-xs plasmo-text-muted-foreground plasmo-mt-1">
          {settings.mode === "popup"
            ? "点击扩展图标时显示弹窗"
            : "点击扩展图标时在页面上显示可拖拽的悬浮窗"}
        </p>
      </div>

      {/* 切换提示 */}
      {switchMessage && (
        <div className="plasmo-p-3 plasmo-bg-green-50 plasmo-rounded-lg plasmo-border plasmo-border-green-200">
          <p className="plasmo-text-xs plasmo-text-green-700">
            ✓ {switchMessage}
          </p>
        </div>
      )}

      {settings.mode === "floating" && (
        <div className="plasmo-p-3 plasmo-bg-blue-50 plasmo-rounded-lg plasmo-border plasmo-border-blue-200">
          <p className="plasmo-text-xs plasmo-text-blue-700">
            💡 <strong>悬浮窗模式说明：</strong>
          </p>
          <ul className="plasmo-text-xs plasmo-text-blue-600 plasmo-mt-1 plasmo-space-y-1 plasmo-list-disc plasmo-list-inside">
            <li>点击扩展图标可显示/隐藏悬浮窗</li>
            <li>拖拽标题栏可移动窗口位置</li>
            <li>点击 "─" 可最小化窗口</li>
            <li>窗口位置会自动保存</li>
          </ul>
        </div>
      )}
    </div>
  )
}

