import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"
import { useState, useEffect } from "react"
import { FloatingPanel } from "~components/floating/FloatingPanel"

// 使用 url: 导入 CSS，资源会被正确复制到包中
import cssUrl from "url:~style.css"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

/**
 * Generates a style element with adjusted CSS to work correctly within a Shadow DOM.
 * 通过 url: 导入 CSS 文件，然后在运行时获取并处理
 */
export const getStyle: PlasmoGetStyle = async () => {
  const baseFontSize = 16
  
  // 获取 CSS 内容
  const response = await fetch(cssUrl)
  let cssText = await response.text()

  // 处理 CSS 以适应 Shadow DOM
  cssText = cssText.replaceAll(":root", ":host(plasmo-csui)")
  const remRegex = /([\d.]+)rem/g
  cssText = cssText.replace(remRegex, (match, remValue) => {
    const pixelsValue = parseFloat(remValue) * baseFontSize
    return `${pixelsValue}px`
  })

  const styleElement = document.createElement("style")
  styleElement.textContent = cssText
  return styleElement
}

// ==========================================
// 字段填充模式 - 全局状态
// ==========================================

let isFieldFillMode = false
let pendingFieldFill: {
  fieldId: string
  fieldLabel: string
  value: string
} | null = null
let fieldFillHighlight: HTMLElement | null = null
let fieldFillTooltip: HTMLDivElement | null = null

// 悬浮窗显示状态（全局）
let floatingPanelVisible = false
let setFloatingPanelVisibleCallback: ((visible: boolean) => void) | null = null

// ==========================================
// 消息监听器
// ==========================================

console.log("简历自动填写助手 - React Content Script 已加载")

// 监听来自悬浮窗的自定义事件（悬浮窗模式下直接调用）
window.addEventListener("offerlaolao:startFieldFillMode", ((event: CustomEvent) => {
  console.log("收到悬浮窗的 startFieldFillMode 事件:", event.detail)
  try {
    startFieldFillMode(event.detail)
  } catch (error) {
    console.error("启动字段填充模式失败:", error)
  }
}) as EventListener)

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // ping 检测 content script 是否已加载
  if (request.action === "ping") {
    sendResponse({ status: "ok" })
    return true
  }

  // 切换悬浮窗显示状态
  if (request.action === "toggleFloatingPanel") {
    floatingPanelVisible = !floatingPanelVisible
    if (setFloatingPanelVisibleCallback) {
      setFloatingPanelVisibleCallback(floatingPanelVisible)
    }
    sendResponse({ success: true, visible: floatingPanelVisible })
    return true
  }

  // 显示悬浮窗
  if (request.action === "showFloatingPanel") {
    floatingPanelVisible = true
    if (setFloatingPanelVisibleCallback) {
      setFloatingPanelVisibleCallback(true)
    }
    sendResponse({ success: true })
    return true
  }

  // 隐藏悬浮窗
  if (request.action === "hideFloatingPanel") {
    floatingPanelVisible = false
    if (setFloatingPanelVisibleCallback) {
      setFloatingPanelVisibleCallback(false)
    }
    sendResponse({ success: true })
    return true
  }

  // 字段填充模式
  if (request.action === "startFieldFillMode") {
    console.log("收到 startFieldFillMode 请求:", request.fieldData)
    try {
      const result = startFieldFillMode(request.fieldData)
      sendResponse(result)
    } catch (error) {
      sendResponse({
        success: false,
        message: error instanceof Error ? error.message : "未知错误"
      })
    }
    return true
  }

  return false
})

// ==========================================
// 悬浮窗 UI 组件
// ==========================================

function ContentUI() {
  const [isVisible, setIsVisible] = useState(floatingPanelVisible)

  useEffect(() => {
    // 注册回调函数，用于从消息监听器更新状态
    setFloatingPanelVisibleCallback = setIsVisible
    return () => {
      setFloatingPanelVisibleCallback = null
    }
  }, [])

  const handleClose = () => {
    floatingPanelVisible = false
    setIsVisible(false)
  }

  if (!isVisible) {
    return null
  }

  return <FloatingPanel onClose={handleClose} />
}

export default ContentUI

// ==========================================
// 字段填充模式核心函数
// ==========================================

interface FieldData {
  fieldId: string
  fieldLabel: string
  value: string
}

/**
 * 启动字段填充模式
 */
function startFieldFillMode(fieldData: FieldData): { success: boolean; message?: string } {
  if (!fieldData || typeof fieldData !== "object") {
    return { success: false, message: "字段数据缺失" }
  }

  if (!Object.prototype.hasOwnProperty.call(fieldData, "value")) {
    return { success: false, message: "字段值无效" }
  }

  // 保存字段数据
  const newFieldFill = {
    fieldId: fieldData.fieldId || "",
    fieldLabel: fieldData.fieldLabel || fieldData.fieldId || "该字段",
    value: fieldData.value
  }

  // 如果已经在填充模式，先停止
  if (isFieldFillMode) {
    stopFieldFillModeCleanup()
  }

  // 设置新的待填充字段
  pendingFieldFill = newFieldFill

  enableFieldFillMode()
  return { success: true }
}

/**
 * 启用字段填充模式
 */
function enableFieldFillMode(): void {
  if (!pendingFieldFill) {
    console.error("enableFieldFillMode: pendingFieldFill 为空")
    return
  }

  isFieldFillMode = true
  document.addEventListener("mouseover", handleFieldFillMouseOver, true)
  document.addEventListener("mouseout", handleFieldFillMouseOut, true)
  document.addEventListener("click", handleFieldFillClick, true)
  document.addEventListener("keydown", handleFieldFillKeyDown, true)

  document.body.style.cursor = "crosshair"

  const label = pendingFieldFill.fieldLabel || "该字段"
  showFieldFillTooltip(
    `正在为「${label}」选择目标输入框，点击要填入的位置，按 Esc 取消`
  )
}

/**
 * 停止字段填充模式（仅清理事件监听器和 UI）
 */
function stopFieldFillModeCleanup(): void {
  isFieldFillMode = false

  document.removeEventListener("mouseover", handleFieldFillMouseOver, true)
  document.removeEventListener("mouseout", handleFieldFillMouseOut, true)
  document.removeEventListener("click", handleFieldFillClick, true)
  document.removeEventListener("keydown", handleFieldFillKeyDown, true)

  if (fieldFillHighlight) {
    fieldFillHighlight.style.outline = ""
    fieldFillHighlight = null
  }

  document.body.style.cursor = ""
  hideFieldFillTooltip()
}

/**
 * 完全停止字段填充模式
 */
function stopFieldFillMode(): void {
  stopFieldFillModeCleanup()
  pendingFieldFill = null
}

/**
 * 鼠标悬停高亮处理
 */
function handleFieldFillMouseOver(event: MouseEvent): void {
  const target = event.target as HTMLElement
  if (isFillableElement(target)) {
    target.style.outline = "2px solid #1890ff"
    fieldFillHighlight = target
  }
}

/**
 * 鼠标离开取消高亮
 */
function handleFieldFillMouseOut(event: MouseEvent): void {
  const target = event.target as HTMLElement
  if (target === fieldFillHighlight) {
    target.style.outline = ""
    fieldFillHighlight = null
  }
}

/**
 * 点击填充处理
 */
function handleFieldFillClick(event: MouseEvent): void {
  event.preventDefault()
  event.stopPropagation()

  const target = event.target as HTMLElement
  const fillableElement = findFillableElement(target)

  if (fillableElement && pendingFieldFill) {
    const success = fillElement(fillableElement, pendingFieldFill.value)
    if (success) {
      highlightFilledField(fillableElement)
      showFieldFillTooltip("✓ 填充成功！", "success")
    } else {
      showFieldFillTooltip("✗ 填充失败，请重试", "error")
    }
  }

  setTimeout(() => stopFieldFillMode(), 1000)
}

/**
 * ESC键取消
 */
function handleFieldFillKeyDown(event: KeyboardEvent): void {
  if (event.key === "Escape") {
    stopFieldFillMode()
  }
}

/**
 * 查找可填充元素（向上遍历）
 */
function findFillableElement(startElement: HTMLElement | null): HTMLElement | null {
  let element = startElement
  for (let i = 0; i < 5 && element; i++) {
    if (isFillableElement(element)) {
      return element
    }
    element = element.parentElement
  }
  return null
}

/**
 * 判断元素是否可填充
 */
function isFillableElement(element: HTMLElement | null): boolean {
  if (!element) return false
  const tagName = element.tagName.toLowerCase()
  return (
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    element.getAttribute("contenteditable") === "true" ||
    element.getAttribute("role") === "textbox" ||
    element.getAttribute("role") === "combobox" ||
    element.getAttribute("role") === "searchbox"
  )
}

/**
 * 填充元素值
 */
function fillElement(element: HTMLElement, value: string): boolean {
  try {
    const tagName = element.tagName.toLowerCase()

    if (tagName === "input" || tagName === "textarea") {
      const inputElement = element as HTMLInputElement | HTMLTextAreaElement
      
      // 设置值
      inputElement.value = value
      
      // 触发事件以确保框架能检测到变化
      inputElement.dispatchEvent(new Event("input", { bubbles: true }))
      inputElement.dispatchEvent(new Event("change", { bubbles: true }))
      inputElement.dispatchEvent(new Event("blur", { bubbles: true }))
      
      // 对于 React 受控组件，需要设置原生属性
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      )?.set
      if (nativeInputValueSetter && tagName === "input") {
        nativeInputValueSetter.call(element, value)
        inputElement.dispatchEvent(new Event("input", { bubbles: true }))
      }
      
      return true
    }

    if (tagName === "select") {
      const selectElement = element as HTMLSelectElement
      selectElement.value = value
      selectElement.dispatchEvent(new Event("change", { bubbles: true }))
      return true
    }

    if (element.getAttribute("contenteditable") === "true") {
      element.textContent = value
      element.dispatchEvent(new Event("input", { bubbles: true }))
      return true
    }

    return false
  } catch (error) {
    console.error("填充元素失败:", error)
    return false
  }
}

/**
 * 高亮已填充的字段
 */
function highlightFilledField(element: HTMLElement): void {
  const originalOutline = element.style.outline
  const originalBackground = element.style.backgroundColor

  element.style.outline = "2px solid #52c41a"
  element.style.backgroundColor = "rgba(82, 196, 26, 0.1)"

  setTimeout(() => {
    element.style.outline = originalOutline
    element.style.backgroundColor = originalBackground
  }, 1500)
}

/**
 * 显示字段填充提示
 */
function showFieldFillTooltip(
  message: string,
  type: "info" | "success" | "error" = "info"
): void {
  hideFieldFillTooltip()

  fieldFillTooltip = document.createElement("div")
  
  const bgColor =
    type === "success" ? "#52c41a" : type === "error" ? "#ff4d4f" : "#1890ff"

  fieldFillTooltip.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 24px;
    background: ${bgColor};
    color: white;
    border-radius: 8px;
    font-size: 14px;
    z-index: 2147483647;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    animation: slideDown 0.3s ease;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  `
  fieldFillTooltip.textContent = message

  // 添加动画样式
  const style = document.createElement("style")
  style.id = "field-fill-tooltip-style"
  style.textContent = `
    @keyframes slideDown {
      from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
  `

  if (!document.getElementById("field-fill-tooltip-style")) {
    document.head.appendChild(style)
  }

  document.body.appendChild(fieldFillTooltip)
}

/**
 * 隐藏字段填充提示
 */
function hideFieldFillTooltip(): void {
  if (fieldFillTooltip) {
    fieldFillTooltip.remove()
    fieldFillTooltip = null
  }
}
