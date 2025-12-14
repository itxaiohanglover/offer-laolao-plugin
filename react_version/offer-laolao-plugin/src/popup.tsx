import { useState } from "react"
import { BasicInfoForm } from "~features/popup/BasicInfoForm"
import { ModelSettingsForm, ParseSettingsForm } from "~features/popup/settings"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~components/ui/tabs"

import "~style.css"

function IndexPopup() {
  const [activeTab, setActiveTab] = useState("resume")

  return (
    <div className="plasmo-w-[400px] plasmo-min-h-[500px] plasmo-bg-background">
      {/* Header */}
      <div className="plasmo-bg-gradient-to-r plasmo-from-primary plasmo-to-purple-600 plasmo-p-4">
        <div className="plasmo-flex plasmo-items-center plasmo-gap-3">
          <div className="plasmo-w-10 plasmo-h-10 plasmo-bg-white/20 plasmo-rounded-lg plasmo-flex plasmo-items-center plasmo-justify-center">
            <span className="plasmo-text-2xl">🎯</span>
          </div>
          <div>
            <h1 className="plasmo-text-lg plasmo-font-bold plasmo-text-white">
              Offer 捞捞
            </h1>
            <p className="plasmo-text-xs plasmo-text-white/80">
              简历自动填写助手
            </p>
          </div>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="plasmo-px-4 plasmo-pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="resume">📝 简历填写</TabsTrigger>
            <TabsTrigger value="settings">⚙️ 设置</TabsTrigger>
          </TabsList>

          {/* Resume Content */}
          <TabsContent value="resume">
            <div className="plasmo-py-2">
              <BasicInfoForm />
            </div>
          </TabsContent>

          {/* Settings Content */}
          <TabsContent value="settings">
            <div className="plasmo-py-2 plasmo-space-y-6">
              {/* AI 模型配置 */}
              <ModelSettingsForm />

              {/* 分隔线 */}
              <div className="plasmo-border-t plasmo-border-border" />

              {/* 简历解析配置 */}
              <ParseSettingsForm />

              {/* 使用说明 */}
              <div className="plasmo-mt-6 plasmo-p-4 plasmo-bg-muted/30 plasmo-rounded-lg">
                <h4 className="plasmo-text-sm plasmo-font-medium plasmo-mb-3">
                  📖 使用说明
                </h4>
                <ul className="plasmo-text-xs plasmo-text-muted-foreground plasmo-space-y-2">
                  <li className="plasmo-flex plasmo-gap-2">
                    <span className="plasmo-text-primary">1.</span>
                    填写简历信息，系统会<strong>自动保存</strong>您的输入
                  </li>
                  <li className="plasmo-flex plasmo-gap-2">
                    <span className="plasmo-text-primary">2.</span>
                    切换到目标网站页面，点击"预填"快速填充表单
                  </li>
                  <li className="plasmo-flex plasmo-gap-2">
                    <span className="plasmo-text-primary">3.</span>
                    配置"简历解析 API"以启用智能简历解析功能
                  </li>
                  <li className="plasmo-flex plasmo-gap-2">
                    <span className="plasmo-text-primary">4.</span>
                    配置"AI 模型"以启用简历内容优化功能（可选）
                  </li>
                  <li className="plasmo-flex plasmo-gap-2">
                    <span className="plasmo-text-primary">5.</span>
                    设置会自动保存，无需手动点击保存按钮
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default IndexPopup
