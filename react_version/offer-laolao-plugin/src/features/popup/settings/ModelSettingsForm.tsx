/**
 * AI 模型配置表单
 */

import { useState, useEffect } from "react"
import { Input } from "~components/ui/input"
import { Label } from "~components/ui/label"
import { Button } from "~components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~components/ui/select"
import { useStorage, STORAGE_KEYS } from "~hooks/useStorage"
import { getModelProviders, getModelsByProvider } from "~config/model-providers"
import { testModelConnection } from "~services/model-api"
import type { ModelSettings } from "~types/settings"
import { defaultModelSettings } from "~types/settings"

export function ModelSettingsForm() {
  const [settings, setSettings, isLoading] = useStorage<ModelSettings>(
    STORAGE_KEYS.MODEL_SETTINGS,
    defaultModelSettings
  )

  const [models, setModels] = useState<{ id: string; name: string }[]>([])
  const [testResult, setTestResult] = useState<{
    success: boolean
    message: string
  } | null>(null)
  const [isTesting, setIsTesting] = useState(false)

  const providers = getModelProviders()

  // 当提供商变化时，更新模型列表
  useEffect(() => {
    if (settings.provider) {
      const providerModels = getModelsByProvider(settings.provider)
      setModels(providerModels)
      // 如果当前选择的模型不在新的模型列表中，重置模型选择
      if (
        settings.model &&
        !providerModels.find((m) => m.id === settings.model)
      ) {
        setSettings((prev) => ({ ...prev, model: "" }))
      }
    }
  }, [settings.provider])

  // 处理测试连接
  const handleTestConnection = async () => {
    setIsTesting(true)
    setTestResult(null)

    try {
      const result = await testModelConnection(settings)
      setTestResult(result)
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : "测试失败",
      })
    } finally {
      setIsTesting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="plasmo-flex plasmo-items-center plasmo-justify-center plasmo-py-4">
        <span className="plasmo-text-muted-foreground">加载中...</span>
      </div>
    )
  }

  return (
    <div className="plasmo-space-y-4">
      {/* 标题 */}
      <div className="plasmo-flex plasmo-items-center plasmo-gap-2">
        <div className="plasmo-w-1 plasmo-h-5 plasmo-bg-purple-500 plasmo-rounded" />
        <h3 className="plasmo-text-base plasmo-font-semibold plasmo-text-foreground">
          AI 模型配置
        </h3>
      </div>
      <p className="plasmo-text-sm plasmo-text-muted-foreground plasmo--mt-2">
        用于简历内容智能优化
      </p>

      {/* 模型提供商 */}
      <div className="plasmo-space-y-2">
        <Label htmlFor="model-provider">模型提供商</Label>
        <Select
          value={settings.provider}
          onValueChange={(value) =>
            setSettings((prev) => ({ ...prev, provider: value, model: "" }))
          }
        >
          <SelectTrigger id="model-provider">
            <SelectValue placeholder="选择模型提供商" />
          </SelectTrigger>
          <SelectContent>
            {providers.map((provider) => (
              <SelectItem key={provider.id} value={provider.id}>
                {provider.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="plasmo-text-xs plasmo-text-muted-foreground">
          选择您要使用的 AI 模型服务商
        </p>
      </div>

      {/* 模型选择 */}
      <div className="plasmo-space-y-2">
        <Label htmlFor="model-select">选择模型</Label>
        <Select
          value={settings.model}
          onValueChange={(value) =>
            setSettings((prev) => ({ ...prev, model: value }))
          }
          disabled={settings.provider === "custom" || models.length === 0}
        >
          <SelectTrigger id="model-select">
            <SelectValue
              placeholder={
                settings.provider === "custom"
                  ? "自定义模式无需选择"
                  : models.length === 0
                    ? "请先选择模型提供商"
                    : "选择模型"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="plasmo-text-xs plasmo-text-muted-foreground">
          不同模型有不同的能力和价格
        </p>
      </div>

      {/* API Key */}
      <div className="plasmo-space-y-2">
        <Label htmlFor="model-api-key">API Key</Label>
        <Input
          id="model-api-key"
          type="password"
          placeholder="请输入模型 API 密钥"
          value={settings.apiKey}
          onChange={(e) =>
            setSettings((prev) => ({ ...prev, apiKey: e.target.value }))
          }
        />
        <p className="plasmo-text-xs plasmo-text-muted-foreground">
          在对应平台的控制台获取 API Key
        </p>
      </div>

      {/* 自定义 URL（仅 custom 模式显示） */}
      {settings.provider === "custom" && (
        <div className="plasmo-space-y-2">
          <Label htmlFor="model-custom-url">自定义 API URL</Label>
          <Input
            id="model-custom-url"
            type="text"
            placeholder="请输入自定义 API 地址（OpenAI 兼容格式）"
            value={settings.customUrl || ""}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, customUrl: e.target.value }))
            }
          />
          <p className="plasmo-text-xs plasmo-text-muted-foreground">
            例如：https://your-api.com/v1
          </p>
        </div>
      )}

      {/* 测试连接按钮 */}
      <div className="plasmo-pt-2">
        <Button
          variant="outline"
          onClick={handleTestConnection}
          disabled={isTesting || !settings.apiKey}
          className="plasmo-w-full"
        >
          {isTesting ? "测试中..." : "🔗 测试连接"}
        </Button>
      </div>

      {/* 测试结果 */}
      {testResult && (
        <div
          className={`plasmo-p-3 plasmo-rounded-md plasmo-text-sm ${
            testResult.success
              ? "plasmo-bg-green-50 plasmo-text-green-700 plasmo-border plasmo-border-green-200"
              : "plasmo-bg-red-50 plasmo-text-red-700 plasmo-border plasmo-border-red-200"
          }`}
        >
          {testResult.success ? "✓ " : "✗ "}
          {testResult.message}
        </div>
      )}

      {/* API 获取指南 */}
      <div className="plasmo-mt-4 plasmo-p-3 plasmo-bg-muted/50 plasmo-rounded-md">
        <p className="plasmo-text-sm plasmo-font-medium plasmo-mb-2">
          📚 API Key 获取指南
        </p>
        <ul className="plasmo-text-xs plasmo-text-muted-foreground plasmo-space-y-1">
          <li>
            <a
              href="https://platform.deepseek.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="plasmo-text-primary hover:plasmo-underline"
            >
              DeepSeek 开放平台
            </a>
          </li>
          <li>
            <a
              href="https://platform.moonshot.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="plasmo-text-primary hover:plasmo-underline"
            >
              Kimi 开放平台
            </a>
          </li>
          <li>
            <a
              href="https://dashscope.console.aliyun.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="plasmo-text-primary hover:plasmo-underline"
            >
              阿里云百炼 (通义千问)
            </a>
          </li>
          <li>
            <a
              href="https://console.volcengine.com/ark"
              target="_blank"
              rel="noopener noreferrer"
              className="plasmo-text-primary hover:plasmo-underline"
            >
              火山引擎方舟平台
            </a>
          </li>
          <li>
            <a
              href="https://open.bigmodel.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="plasmo-text-primary hover:plasmo-underline"
            >
              智谱 AI 开放平台
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

