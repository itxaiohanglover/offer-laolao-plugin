/**
 * Background Service Worker
 * 处理扩展图标点击事件，根据用户设置选择打开 popup 或悬浮窗
 */

import { STORAGE_KEYS } from "~hooks/useStorage"
import type { UISettings } from "~types/settings"
import { defaultUISettings } from "~types/settings"

// 监听扩展图标点击事件
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return

  // 获取用户的界面模式设置
  const result = await chrome.storage.local.get(STORAGE_KEYS.UI_SETTINGS)
  const uiSettings: UISettings = result[STORAGE_KEYS.UI_SETTINGS] || defaultUISettings

  if (uiSettings.mode === "floating") {
    // 悬浮窗模式：向 content script 发送消息切换悬浮窗显示状态
    try {
      await chrome.tabs.sendMessage(tab.id, { action: "toggleFloatingPanel" })
    } catch (error) {
      console.log("Content script not ready, showing popup instead")
      // 如果 content script 未加载，回退到 popup 模式
      // Plasmo 会自动处理 popup，这里不需要额外操作
    }
  }
  // popup 模式：Plasmo 会自动显示 popup，不需要额外处理
})

// 监听来自 content script 或 popup 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getUIMode") {
    // 获取当前 UI 模式
    chrome.storage.local.get(STORAGE_KEYS.UI_SETTINGS).then((result) => {
      const uiSettings: UISettings = result[STORAGE_KEYS.UI_SETTINGS] || defaultUISettings
      sendResponse({ mode: uiSettings.mode })
    })
    return true // 表示将异步发送响应
  }

  if (request.action === "setUIMode") {
    // 设置 UI 模式
    chrome.storage.local.get(STORAGE_KEYS.UI_SETTINGS).then((result) => {
      const uiSettings: UISettings = result[STORAGE_KEYS.UI_SETTINGS] || defaultUISettings
      const newSettings: UISettings = { ...uiSettings, mode: request.mode }
      chrome.storage.local.set({ [STORAGE_KEYS.UI_SETTINGS]: newSettings }).then(() => {
        // 根据新模式更新 popup 行为
        updatePopupBehavior(request.mode)
        sendResponse({ success: true })
      })
    })
    return true
  }

  return false
})

/**
 * 根据 UI 模式更新 popup 行为
 */
function updatePopupBehavior(mode: "popup" | "floating") {
  if (mode === "floating") {
    // 悬浮窗模式：移除默认 popup，让点击事件触发 onClicked
    chrome.action.setPopup({ popup: "" })
  } else {
    // popup 模式：恢复默认 popup
    chrome.action.setPopup({ popup: "popup.html" })
  }
}

// 初始化时设置正确的 popup 行为
chrome.storage.local.get(STORAGE_KEYS.UI_SETTINGS).then((result) => {
  const uiSettings: UISettings = result[STORAGE_KEYS.UI_SETTINGS] || defaultUISettings
  updatePopupBehavior(uiSettings.mode)
})

export {}

