/**
 * 简历解析 API 配置表单
 */

import { Input } from "~components/ui/input"
import { Label } from "~components/ui/label"
import { useStorage, STORAGE_KEYS } from "~hooks/useStorage"
import type { ParseSettings } from "~types/settings"
import { defaultParseSettings } from "~types/settings"

export function ParseSettingsForm() {
  const [settings, setSettings, isLoading] = useStorage<ParseSettings>(
    STORAGE_KEYS.PARSE_SETTINGS,
    defaultParseSettings
  )

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
        <div className="plasmo-w-1 plasmo-h-5 plasmo-bg-blue-500 plasmo-rounded" />
        <h3 className="plasmo-text-base plasmo-font-semibold plasmo-text-foreground">
          简历解析 API 配置
        </h3>
      </div>
      <p className="plasmo-text-sm plasmo-text-muted-foreground plasmo--mt-2">
        用于解析 PDF/DOCX 格式的简历文件
      </p>

      {/* API URL */}
      <div className="plasmo-space-y-2">
        <Label htmlFor="parse-api-url">API URL</Label>
        <Input
          id="parse-api-url"
          type="text"
          placeholder="请输入简历解析 API 的 URL 地址"
          value={settings.url}
          onChange={(e) =>
            setSettings((prev) => ({ ...prev, url: e.target.value }))
          }
        />
        <p className="plasmo-text-xs plasmo-text-muted-foreground">
          示例：https://xxx.cn-hangzhou.aliyuncs.com/resume/parse
        </p>
      </div>

      {/* APP Code */}
      <div className="plasmo-space-y-2">
        <Label htmlFor="parse-app-code">APP Code</Label>
        <Input
          id="parse-app-code"
          type="password"
          placeholder="请输入 APP Code"
          value={settings.appCode}
          onChange={(e) =>
            setSettings((prev) => ({ ...prev, appCode: e.target.value }))
          }
        />
        <p className="plasmo-text-xs plasmo-text-muted-foreground">
          购买 API 服务后获取的 APP Code
        </p>
        <p className="plasmo-text-xs plasmo-text-muted-foreground">
          参考：
          <a
            href="https://market.aliyun.com/detail/cmapi034316"
            target="_blank"
            rel="noopener noreferrer"
            className="plasmo-text-primary hover:plasmo-underline"
          >
            简历解析 API
          </a>
        </p>
      </div>

      {/* 使用说明 */}
      <div className="plasmo-mt-4 plasmo-p-3 plasmo-bg-muted/50 plasmo-rounded-md">
        <p className="plasmo-text-sm plasmo-font-medium plasmo-mb-2">
          💡 使用说明
        </p>
        <ul className="plasmo-text-xs plasmo-text-muted-foreground plasmo-space-y-1 plasmo-list-disc plasmo-list-inside">
          <li>简历解析 API 用于自动识别 PDF/DOCX 格式的简历文件</li>
          <li>解析后的数据会自动填充到表单中</li>
          <li>推荐使用阿里云市场的简历解析服务</li>
          <li>APP Code 即为购买服务后获取的 APPCODE</li>
        </ul>
      </div>
    </div>
  )
}

