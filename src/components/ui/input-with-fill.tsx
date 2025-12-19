import React, { forwardRef, useCallback, useRef, useImperativeHandle } from "react"
import { Input } from "./input"
import { FieldFillButton } from "./field-fill-button"

interface InputWithFillProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  fieldId: string
  fieldLabel: string
  showFillButton?: boolean
}

/**
 * 带填充按钮的输入框组件
 * 在输入框右侧显示一个↗按钮，点击可将值注入到网页
 */
export const InputWithFill = forwardRef<HTMLInputElement, InputWithFillProps>(
  (
    { fieldId, fieldLabel, showFillButton = true, className, ...props },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)

    // 允许外部通过 ref 访问 input 元素
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

    // 获取当前输入框的值
    const getValue = useCallback(() => {
      return inputRef.current?.value || (props.value as string) || ""
    }, [props.value])

    return (
      <div className="plasmo-flex plasmo-items-center plasmo-gap-1.5">
        <Input
          ref={inputRef}
          className={`plasmo-flex-1 ${className || ""}`}
          {...props}
        />
        {showFillButton && (
          <FieldFillButton
            fieldId={fieldId}
            fieldLabel={fieldLabel}
            getValue={getValue}
          />
        )}
      </div>
    )
  }
)

InputWithFill.displayName = "InputWithFill"

/**
 * 带填充按钮的文本框组件
 */
interface TextareaWithFillProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  fieldId: string
  fieldLabel: string
  showFillButton?: boolean
}

export const TextareaWithFill = forwardRef<
  HTMLTextAreaElement,
  TextareaWithFillProps
>(
  (
    { fieldId, fieldLabel, showFillButton = true, className, ...props },
    ref
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement)

    const getValue = useCallback(() => {
      return textareaRef.current?.value || (props.value as string) || ""
    }, [props.value])

    return (
      <div className="plasmo-flex plasmo-items-start plasmo-gap-1.5">
        <textarea
          ref={textareaRef}
          className={`
            plasmo-flex plasmo-min-h-[80px] plasmo-w-full plasmo-rounded-md 
            plasmo-border plasmo-border-input plasmo-bg-background plasmo-px-3 
            plasmo-py-2 plasmo-text-sm plasmo-ring-offset-background 
            placeholder:plasmo-text-muted-foreground 
            focus-visible:plasmo-outline-none focus-visible:plasmo-ring-2 
            focus-visible:plasmo-ring-ring focus-visible:plasmo-ring-offset-2 
            disabled:plasmo-cursor-not-allowed disabled:plasmo-opacity-50
            plasmo-flex-1 plasmo-resize-none
            ${className || ""}
          `}
          {...props}
        />
        {showFillButton && (
          <FieldFillButton
            fieldId={fieldId}
            fieldLabel={fieldLabel}
            getValue={getValue}
          />
        )}
      </div>
    )
  }
)

TextareaWithFill.displayName = "TextareaWithFill"

/**
 * 带填充按钮的选择框组件
 */
interface SelectWithFillProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  fieldId: string
  fieldLabel: string
  showFillButton?: boolean
  children: React.ReactNode
}

export const SelectWithFill = forwardRef<HTMLSelectElement, SelectWithFillProps>(
  (
    { fieldId, fieldLabel, showFillButton = true, className, children, ...props },
    ref
  ) => {
    const selectRef = useRef<HTMLSelectElement>(null)

    useImperativeHandle(ref, () => selectRef.current as HTMLSelectElement)

    const getValue = useCallback(() => {
      const select = selectRef.current
      if (!select) return (props.value as string) || ""
      
      // 返回选中项的文本（而不是 value）
      const selectedOption = select.options[select.selectedIndex]
      return selectedOption?.text || select.value || ""
    }, [props.value])

    return (
      <div className="plasmo-flex plasmo-items-center plasmo-gap-1.5">
        <select
          ref={selectRef}
          className={`
            plasmo-flex plasmo-h-10 plasmo-w-full plasmo-rounded-md 
            plasmo-border plasmo-border-input plasmo-bg-background plasmo-px-3 
            plasmo-py-2 plasmo-text-sm plasmo-ring-offset-background 
            focus:plasmo-outline-none focus:plasmo-ring-2 
            focus:plasmo-ring-ring focus:plasmo-ring-offset-2 
            disabled:plasmo-cursor-not-allowed disabled:plasmo-opacity-50
            plasmo-flex-1
            ${className || ""}
          `}
          {...props}
        >
          {children}
        </select>
        {showFillButton && (
          <FieldFillButton
            fieldId={fieldId}
            fieldLabel={fieldLabel}
            getValue={getValue}
          />
        )}
      </div>
    )
  }
)

SelectWithFill.displayName = "SelectWithFill"

