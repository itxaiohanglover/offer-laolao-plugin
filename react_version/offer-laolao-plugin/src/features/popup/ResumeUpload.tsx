import { useState, useRef, useCallback } from "react"
import { Button } from "~components/ui/button"
import { parseResumeByAPI, type ParsedResumeData } from "~services/resume-parse"
import { useStorage, STORAGE_KEYS } from "~hooks/useStorage"
import { defaultParseSettings, type ParseSettings } from "~types/settings"

// 允许的文件扩展名
const ALLOWED_EXTENSIONS = [".json", ".pdf", ".doc", ".docx", ".txt", ".html"]

// 上传状态类型
type UploadStatus = "idle" | "parsing" | "success" | "error"

interface ResumeUploadProps {
  onParsedData?: (data: ParsedResumeData) => void
}

export function ResumeUpload({ onParsedData }: ResumeUploadProps) {
  const [parseSettings] = useStorage<ParseSettings>(
    STORAGE_KEYS.PARSE_SETTINGS,
    defaultParseSettings
  )
  const [status, setStatus] = useState<UploadStatus>("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [fileName, setFileName] = useState("")
  const [isDragOver, setIsDragOver] = useState(false)
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null)
  const [progress, setProgress] = useState(0)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // 检查文件扩展名
  const isValidExtension = (filename: string): boolean => {
    const ext = filename.toLowerCase().substring(filename.lastIndexOf("."))
    return ALLOWED_EXTENSIONS.includes(ext)
  }

  // 处理文件解析
  const handleFile = useCallback(
    async (file: File) => {
      const ext = file.name.toLowerCase().substring(file.name.lastIndexOf("."))

      if (!isValidExtension(file.name)) {
        setStatus("error")
        setErrorMessage("不支持的文件格式，请上传 PDF、Word、JSON 或文本文档。")
        return
      }

      setFileName(file.name)
      setStatus("parsing")
      setProgress(0)
      setErrorMessage("")

      try {
        // JSON 文件直接解析
        if (ext === ".json" || file.type === "application/json") {
          const text = await file.text()
          const jsonData = JSON.parse(text)
          setProgress(100)
          setParsedData(jsonData)
          setStatus("success")
          return
        }

        // 其他格式调用 API 解析
        if (!parseSettings.url || !parseSettings.appCode) {
          setStatus("error")
          setErrorMessage("请先在设置中配置简历解析 API URL 和 APP Code")
          return
        }

        // 模拟进度
        const progressInterval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 10, 90))
        }, 300)

        const result = await parseResumeByAPI(file, parseSettings)
        clearInterval(progressInterval)
        setProgress(100)
        setParsedData(result)
        setStatus("success")
      } catch (error) {
        console.error("解析失败:", error)
        setStatus("error")
        setErrorMessage(
          error instanceof Error ? error.message : "解析失败，请稍后重试"
        )
      }
    },
    [parseSettings]
  )

  // 处理拖放
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  // 处理文件选择
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
    // 清空 input 以便再次选择同一文件
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // 点击上传区域
  const handleClick = () => {
    fileInputRef.current?.click()
  }

  // 使用解析数据
  const handleUseData = () => {
    if (parsedData && onParsedData) {
      onParsedData(parsedData)
    }
  }

  // 重置状态
  const handleReset = () => {
    setStatus("idle")
    setParsedData(null)
    setFileName("")
    setErrorMessage("")
    setProgress(0)
  }

  return (
    <div className="plasmo-space-y-3">
      {/* 上传区域 */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          plasmo-border-2 plasmo-border-dashed plasmo-rounded-lg plasmo-p-4
          plasmo-text-center plasmo-cursor-pointer plasmo-transition-all
          ${
            isDragOver
              ? "plasmo-border-primary plasmo-bg-primary/5"
              : "plasmo-border-border hover:plasmo-border-primary/50"
          }
          ${status === "parsing" ? "plasmo-pointer-events-none plasmo-opacity-70" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.pdf,.doc,.docx,.txt,.html"
          onChange={handleFileSelect}
          className="plasmo-hidden"
        />

        {status === "idle" && (
          <>
            <div className="plasmo-text-3xl plasmo-mb-2">📄</div>
            <p className="plasmo-text-sm plasmo-text-muted-foreground">
              拖拽文件到此处或点击上传
            </p>
            <p className="plasmo-text-xs plasmo-text-muted-foreground/70 plasmo-mt-1">
              支持 PDF、Word、JSON、TXT、HTML 格式
            </p>
          </>
        )}

        {status === "parsing" && (
          <>
            <div className="plasmo-text-3xl plasmo-mb-2 plasmo-animate-pulse">⏳</div>
            <p className="plasmo-text-sm plasmo-text-muted-foreground">
              正在解析：{fileName}
            </p>
            {/* 进度条 */}
            <div className="plasmo-mt-3 plasmo-w-full plasmo-h-1.5 plasmo-bg-muted plasmo-rounded-full plasmo-overflow-hidden">
              <div
                className="plasmo-h-full plasmo-bg-primary plasmo-rounded-full plasmo-transition-all plasmo-duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div className="plasmo-text-3xl plasmo-mb-2">✅</div>
            <p className="plasmo-text-sm plasmo-text-green-600">
              解析成功：{fileName}
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="plasmo-text-3xl plasmo-mb-2">❌</div>
            <p className="plasmo-text-sm plasmo-text-red-600">{errorMessage}</p>
          </>
        )}
      </div>

      {/* 操作按钮 */}
      {status === "success" && parsedData && (
        <div className="plasmo-flex plasmo-gap-2">
          <Button
            onClick={handleUseData}
            className="plasmo-flex-1 plasmo-bg-green-600 hover:plasmo-bg-green-700"
          >
            ✓ 使用解析数据
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="plasmo-flex-none"
          >
            重新上传
          </Button>
        </div>
      )}

      {status === "error" && (
        <Button
          onClick={handleReset}
          variant="outline"
          className="plasmo-w-full"
        >
          重试
        </Button>
      )}

      {/* API 配置提示 */}
      {status === "idle" && !parseSettings.url && (
        <p className="plasmo-text-xs plasmo-text-amber-600 plasmo-text-center">
          ⚠️ 请先在"设置"中配置简历解析 API，才能解析 PDF/Word 文件
        </p>
      )}
    </div>
  )
}

