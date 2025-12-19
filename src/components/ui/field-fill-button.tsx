import React, { useState, useCallback } from "react"
import { startSingleFieldFill } from "~services/field-fill"

interface FieldFillButtonProps {
  fieldId: string
  fieldLabel: string
  getValue: () => string
  className?: string
}

/**
 * 字段填充按钮组件
 * 点击后将字段值注入到网页的输入框中
 */
export function FieldFillButton({
  fieldId,
  fieldLabel,
  getValue,
  className = ""
}: FieldFillButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info"
    text: string
  } | null>(null)

  const handleClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const value = getValue()

      if (!value || value.trim() === "") {
        setMessage({
          type: "error",
          text: `请先填写${fieldLabel}`
        })
        setTimeout(() => setMessage(null), 2000)
        return
      }

      setIsLoading(true)
      setMessage(null)

      try {
        const result = await startSingleFieldFill(fieldId, fieldLabel, value)

        if (result.success) {
          setMessage({
            type: "info",
            text: result.message || "请在网页中点击目标位置"
          })
        } else {
          setMessage({
            type: "error",
            text: result.message || "填充失败"
          })
          setTimeout(() => setMessage(null), 3000)
        }
      } catch (error) {
        setMessage({
          type: "error",
          text: error instanceof Error ? error.message : "操作失败"
        })
        setTimeout(() => setMessage(null), 3000)
      } finally {
        setIsLoading(false)
      }
    },
    [fieldId, fieldLabel, getValue]
  )

  return (
    <div className="plasmo-relative plasmo-inline-flex plasmo-items-center">
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        title={`在网页中填入${fieldLabel}`}
        className={`
          plasmo-bg-primary/10 plasmo-border plasmo-border-primary/30 
          plasmo-text-primary plasmo-rounded plasmo-px-2 plasmo-h-9 
          plasmo-min-w-[32px] plasmo-text-sm plasmo-cursor-pointer 
          plasmo-transition-all plasmo-flex plasmo-items-center plasmo-justify-center
          hover:plasmo-bg-primary hover:plasmo-text-white 
          hover:plasmo-transform hover:plasmo--translate-y-0.5 hover:plasmo-shadow
          disabled:plasmo-opacity-50 disabled:plasmo-cursor-not-allowed
          ${className}
        `}
      >
        {isLoading ? (
          <span className="plasmo-animate-spin">⏳</span>
        ) : (
          <span>↗</span>
        )}
      </button>

      {/* 消息提示 */}
      {message && (
        <div
          className={`
            plasmo-absolute plasmo-left-full plasmo-ml-2 plasmo-px-2 plasmo-py-1 
            plasmo-text-xs plasmo-rounded plasmo-whitespace-nowrap plasmo-z-50
            ${
              message.type === "error"
                ? "plasmo-bg-red-100 plasmo-text-red-700"
                : message.type === "success"
                ? "plasmo-bg-green-100 plasmo-text-green-700"
                : "plasmo-bg-blue-100 plasmo-text-blue-700"
            }
          `}
        >
          {message.text}
        </div>
      )}
    </div>
  )
}

