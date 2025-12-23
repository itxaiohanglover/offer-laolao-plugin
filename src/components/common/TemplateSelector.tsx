import React, { useState, useCallback } from "react"
import { Button } from "~components/ui/button"
import { Input } from "~components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~components/ui/select"
import type { ResumeTemplate } from "~types/resume"

interface TemplateSelectorProps {
  templates: ResumeTemplate[]
  currentTemplateId: string
  onSwitch: (templateId: string) => void
  onAdd: (name: string, copyFromCurrent?: boolean) => string
  onRename: (templateId: string, newName: string) => void
  onDelete: (templateId: string) => boolean
  onDuplicate: (templateId: string) => string | null
  compact?: boolean
}

type DialogMode = "none" | "add" | "rename" | "delete"

/**
 * 简历模板选择器组件
 * 支持选择、添加、重命名、删除模板
 */
export function TemplateSelector({
  templates,
  currentTemplateId,
  onSwitch,
  onAdd,
  onRename,
  onDelete,
  onDuplicate,
  compact = false,
}: TemplateSelectorProps) {
  const [dialogMode, setDialogMode] = useState<DialogMode>("none")
  const [inputValue, setInputValue] = useState("")
  const [copyFromCurrent, setCopyFromCurrent] = useState(false)

  const currentTemplate = templates.find((t) => t.id === currentTemplateId)

  // 处理添加模板
  const handleAdd = useCallback(() => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim(), copyFromCurrent)
      setInputValue("")
      setCopyFromCurrent(false)
      setDialogMode("none")
    }
  }, [inputValue, copyFromCurrent, onAdd])

  // 处理重命名模板
  const handleRename = useCallback(() => {
    if (inputValue.trim() && currentTemplateId) {
      onRename(currentTemplateId, inputValue.trim())
      setInputValue("")
      setDialogMode("none")
    }
  }, [inputValue, currentTemplateId, onRename])

  // 处理删除模板
  const handleDelete = useCallback(() => {
    if (currentTemplateId) {
      const success = onDelete(currentTemplateId)
      if (!success) {
        alert("无法删除最后一个模板")
      }
      setDialogMode("none")
    }
  }, [currentTemplateId, onDelete])

  // 处理复制模板
  const handleDuplicate = useCallback(() => {
    if (currentTemplateId) {
      onDuplicate(currentTemplateId)
    }
  }, [currentTemplateId, onDuplicate])

  // 打开重命名对话框
  const openRenameDialog = useCallback(() => {
    setInputValue(currentTemplate?.name || "")
    setDialogMode("rename")
  }, [currentTemplate?.name])

  // 打开添加对话框
  const openAddDialog = useCallback(() => {
    setInputValue("")
    setCopyFromCurrent(false)
    setDialogMode("add")
  }, [])

  // 关闭对话框
  const closeDialog = useCallback(() => {
    setDialogMode("none")
    setInputValue("")
  }, [])

  // 渲染对话框内容
  const renderDialog = () => {
    if (dialogMode === "none") return null

    return (
      <div className="plasmo-fixed plasmo-inset-0 plasmo-bg-black/50 plasmo-flex plasmo-items-center plasmo-justify-center plasmo-z-[2147483647]">
        <div className="plasmo-bg-background plasmo-rounded-lg plasmo-p-4 plasmo-w-80 plasmo-shadow-xl plasmo-border plasmo-border-border">
          {dialogMode === "add" && (
            <>
              <h3 className="plasmo-text-sm plasmo-font-medium plasmo-mb-3">
                添加新模板
              </h3>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="输入模板名称"
                className="plasmo-mb-3"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
              <label className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-text-sm plasmo-text-muted-foreground plasmo-mb-4">
                <input
                  type="checkbox"
                  checked={copyFromCurrent}
                  onChange={(e) => setCopyFromCurrent(e.target.checked)}
                  className="plasmo-rounded"
                />
                复制当前模板内容
              </label>
              <div className="plasmo-flex plasmo-gap-2 plasmo-justify-end">
                <Button variant="outline" size="sm" onClick={closeDialog}>
                  取消
                </Button>
                <Button size="sm" onClick={handleAdd}>
                  添加
                </Button>
              </div>
            </>
          )}

          {dialogMode === "rename" && (
            <>
              <h3 className="plasmo-text-sm plasmo-font-medium plasmo-mb-3">
                重命名模板
              </h3>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="输入新名称"
                className="plasmo-mb-4"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleRename()}
              />
              <div className="plasmo-flex plasmo-gap-2 plasmo-justify-end">
                <Button variant="outline" size="sm" onClick={closeDialog}>
                  取消
                </Button>
                <Button size="sm" onClick={handleRename}>
                  确定
                </Button>
              </div>
            </>
          )}

          {dialogMode === "delete" && (
            <>
              <h3 className="plasmo-text-sm plasmo-font-medium plasmo-mb-3">
                确认删除
              </h3>
              <p className="plasmo-text-sm plasmo-text-muted-foreground plasmo-mb-4">
                确定要删除模板「{currentTemplate?.name}」吗？此操作不可恢复。
              </p>
              <div className="plasmo-flex plasmo-gap-2 plasmo-justify-end">
                <Button variant="outline" size="sm" onClick={closeDialog}>
                  取消
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                  删除
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`plasmo-flex plasmo-items-center plasmo-gap-2 ${compact ? "" : "plasmo-p-3 plasmo-bg-muted/30 plasmo-rounded-lg"}`}>
      {!compact && (
        <span className="plasmo-text-sm plasmo-font-medium plasmo-whitespace-nowrap">
          📄 模板：
        </span>
      )}

      {/* 模板选择器 */}
      <Select value={currentTemplateId} onValueChange={onSwitch}>
        <SelectTrigger className={compact ? "plasmo-w-32" : "plasmo-flex-1"}>
          <SelectValue placeholder="选择模板" />
        </SelectTrigger>
        <SelectContent>
          {templates.map((template) => (
            <SelectItem key={template.id} value={template.id}>
              {template.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 操作按钮 */}
      <div className="plasmo-flex plasmo-gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={openAddDialog}
          className="plasmo-h-8 plasmo-w-8 plasmo-p-0"
          title="添加模板"
        >
          +
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={openRenameDialog}
          className="plasmo-h-8 plasmo-w-8 plasmo-p-0"
          title="重命名"
        >
          ✏️
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDuplicate}
          className="plasmo-h-8 plasmo-w-8 plasmo-p-0"
          title="复制模板"
        >
          📋
        </Button>
        {templates.length > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDialogMode("delete")}
            className="plasmo-h-8 plasmo-w-8 plasmo-p-0 plasmo-text-destructive hover:plasmo-bg-destructive/10"
            title="删除模板"
          >
            🗑️
          </Button>
        )}
      </div>

      {/* 对话框 */}
      {renderDialog()}
    </div>
  )
}

