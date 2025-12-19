/**
 * 字段填充服务
 * 用于将插件中的字段值注入到网站的输入框中
 */

interface FieldFillPayload {
  fieldId: string
  fieldLabel: string
  value: string
}

interface FillResult {
  success: boolean
  message?: string
}

/**
 * 检测当前是否运行在 content script 环境中
 */
function isContentScriptContext(): boolean {
  // Content script 中没有 chrome.tabs API
  return typeof chrome !== "undefined" && 
         typeof chrome.runtime !== "undefined" && 
         (!chrome.tabs || typeof chrome.tabs.query !== "function")
}

/**
 * 在 content script 中直接启动字段填充模式
 */
function startFieldFillModeDirectly(payload: FieldFillPayload): FillResult {
  // 触发自定义事件，让 content script 处理
  const event = new CustomEvent("offerlaolao:startFieldFillMode", {
    detail: payload
  })
  window.dispatchEvent(event)
  
  return {
    success: true,
    message: `请在网页中点击要填入「${payload.fieldLabel}」的位置`
  }
}

/**
 * 启动单字段填充流程
 */
export async function startSingleFieldFill(
  fieldId: string,
  fieldLabel: string,
  fieldValue: string
): Promise<FillResult> {
  // 检查字段值是否为空
  if (!fieldValue || fieldValue.trim() === "") {
    return {
      success: false,
      message: `请先在弹窗中填写 ${fieldLabel}`
    }
  }

  const payload: FieldFillPayload = {
    fieldId,
    fieldLabel,
    value: fieldValue
  }

  // 如果在 content script 环境中（悬浮窗模式），直接调用本地函数
  if (isContentScriptContext()) {
    console.log("Running in content script context, using direct method")
    return startFieldFillModeDirectly(payload)
  }

  // 检查 Chrome API 是否可用（popup 模式）
  if (typeof chrome === "undefined" || !chrome.tabs) {
    return {
      success: false,
      message: "当前环境不支持自动填充"
    }
  }

  try {
    // 获取当前活动标签页
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })

    if (!tabs || tabs.length === 0 || !tabs[0].id) {
      return {
        success: false,
        message: "未找到活动标签页"
      }
    }

    const tab = tabs[0]
    const tabId = tab.id!
    const tabUrl = tab.url || ""

    // 检查URL是否支持注入
    if (
      tabUrl.startsWith("chrome://") ||
      tabUrl.startsWith("chrome-extension://") ||
      tabUrl.startsWith("edge://") ||
      tabUrl.startsWith("about:") ||
      tabUrl.startsWith("moz-extension://")
    ) {
      return {
        success: false,
        message: "当前页面不支持此功能，请在普通网页上使用"
      }
    }

    console.log("Starting field fill for:", {
      fieldId,
      fieldLabel,
      tabId,
      tabUrl
    })

    // 先 ping 检查 content script 是否已加载
    const pingResult = await pingContentScript(tabId)

    if (!pingResult) {
      // Plasmo 框架通过 manifest 自动注入 content script（文件名带动态哈希）
      // 如果 ping 失败，说明页面需要刷新才能加载 content script
      return {
        success: false,
        message: "页面脚本未就绪，请刷新当前网页后重试"
      }
    }

    // 发送填充消息
    return await sendFieldFillMessage(tabId, payload, fieldLabel)
  } catch (error) {
    console.error("startSingleFieldFill error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "未知错误"
    }
  }
}

/**
 * Ping content script 检查是否已加载
 */
async function pingContentScript(tabId: number): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      chrome.tabs.sendMessage(tabId, { action: "ping" }, (response) => {
        if (chrome.runtime.lastError) {
          console.log("Content script not loaded:", chrome.runtime.lastError)
          resolve(false)
        } else {
          console.log("Content script is loaded:", response)
          resolve(true)
        }
      })
    } catch {
      resolve(false)
    }
  })
}

/**
 * 发送字段填充消息（带重试机制）
 */
async function sendFieldFillMessage(
  tabId: number,
  payload: FieldFillPayload,
  fieldLabel: string,
  retryCount: number = 0
): Promise<FillResult> {
  const maxRetries = 2

  return new Promise((resolve) => {
    console.log(
      `Sending field fill message (attempt ${retryCount + 1}):`,
      { tabId, payload }
    )

    chrome.tabs.sendMessage(
      tabId,
      {
        action: "startFieldFillMode",
        fieldData: payload
      },
      (response) => {
        if (chrome.runtime.lastError) {
          const errorMsg = chrome.runtime.lastError.message || ""
          console.error(
            `Error sending field fill message (attempt ${retryCount + 1}):`,
            chrome.runtime.lastError
          )

          // 某些情况下 popup 快速关闭会出现这个错误，但命令已经发送成功
          if (
            errorMsg.includes(
              "The message port closed before a response was received"
            )
          ) {
            console.warn(
              "Message port closed before response, treating as success"
            )
            resolve({
              success: true,
              message: `请在网页中点击要填入「${fieldLabel}」的位置`
            })
            return
          }

          // 重试逻辑
          if (
            retryCount < maxRetries &&
            (errorMsg.includes("Could not establish connection") ||
              errorMsg.includes("Receiving end does not exist") ||
              errorMsg.includes("message port closed"))
          ) {
            console.log("Retrying in 500ms...")
            setTimeout(() => {
              sendFieldFillMessage(tabId, payload, fieldLabel, retryCount + 1)
                .then(resolve)
            }, 500)
            return
          }

          // 提供友好的错误提示
          if (errorMsg.includes("Could not establish connection")) {
            resolve({
              success: false,
              message: "无法连接到页面，请刷新页面后重试"
            })
          } else if (errorMsg.includes("Receiving end does not exist")) {
            resolve({
              success: false,
              message: "页面脚本未加载，请刷新页面后重试"
            })
          } else {
            resolve({
              success: false,
              message: `连接失败: ${errorMsg}，请刷新后重试`
            })
          }
          return
        }

        console.log("Field fill message response:", response)

        if (response && response.success) {
          // 不再自动关闭 popup，让用户可以连续填充多个字段
          resolve({
            success: true,
            message: `请在网页中点击要填入「${fieldLabel}」的位置`
          })
        } else {
          const errMsg = response?.message || "未知错误"
          resolve({
            success: false,
            message: `无法启动字段填充模式: ${errMsg}`
          })
        }
      }
    )
  })
}
