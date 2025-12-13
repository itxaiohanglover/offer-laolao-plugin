<script setup>
// 使用指南步骤数据
const guideSteps = [
  {
    step: 1,
    emoji: '🧩',
    title: '扩展安装',
    tag: '简单快速',
    desc: '下载压缩包后，只需开启Chrome开发者模式，将插件文件拖入即可完成安装。无需复杂配置，立即开始使用。',
    details: [
      '支持最新版Chrome浏览器',
      '安全可靠，无隐私风险',
      '轻量化设计，不占用系统资源'
    ]
  },
  {
    step: 2,
    emoji: '📄',
    title: '简历导入',
    tag: 'AI解析',
    desc: '支持多种格式简历导入，豆包AI大模型智能解析您的简历内容，自动识别并提取关键信息到本地数据库。',
    details: [
      '支持PDF、Word、TXT等格式',
      'AI精准提取，准确率95%+',
      '本地处理，数据安全无忧'
    ]
  },
  {
    step: 3,
    emoji: '🚀',
    title: '一键填写',
    tag: '高效投递',
    desc: '访问任何支持的招聘网站，点击插件图标即可自动填充所有表单字段。大幅提升投递效率，告别重复填写。',
    details: [
      '支持20+主流招聘平台',
      '智能适配不同网站表单',
      '一键完成，节省80%时间'
    ]
  }
]
</script>

<template>
  <section class="section-block guide-section">
    <div class="node-icon">
      <div class="node-dot"></div>
    </div>

    <div class="section-header">
       <h2 class="section-title">三步快速上手</h2>
       <p class="section-subtitle">简单配置，即刻享受自动化体验</p>
    </div>

    <div class="guide-container">
      <!-- 步骤卡片 -->
      <div 
        v-for="(step, index) in guideSteps" 
        :key="index" 
        class="guide-step"
      >
        <div class="step-circle">
          <span class="step-number">{{ step.step }}</span>
          <span class="step-emoji">{{ step.emoji }}</span>
        </div>
        <div class="step-content">
          <div class="step-header">
            <h3 class="step-title">{{ step.title }}</h3>
            <div class="step-tag">{{ step.tag }}</div>
          </div>
          <p class="step-desc">{{ step.desc }}</p>
          <ul class="step-details">
            <li v-for="(detail, i) in step.details" :key="i">
              <span class="step-check">✓</span> {{ detail }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    
    <div class="connection-line-vertical short"></div>
  </section>
</template>

<style scoped>
/* 统一的section样式 - 保留原来的背景色，只修改边框和阴影 */
.section-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 80px;
  padding: 100px 24px 60px;
  /* 恢复原来的背景色 */
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(24, 144, 255, 0.05);
  position: relative;
  /* 移除overflow: hidden，避免节点图标被裁剪 */
  /* overflow: hidden; */
}

/* 节点图标 - 作为section分界标识 - 只使用蓝色边框 */
.node-icon {
  width: 40px;
  height: 40px;
  border: 2px solid #1890ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  margin-bottom: 32px;
  position: relative;
  z-index: 2;
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.15);
  transition: all 0.3s ease;
}

.node-icon:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 24px rgba(24, 144, 255, 0.25);
}

.node-dot { 
  width: 12px;
  height: 12px;
  background: #1890ff;
  border-radius: 50%;
  box-shadow: 0 0 12px #1890ff;
}

.section-header { 
  text-align: center;
  margin-bottom: 48px;
  max-width: 600px;
  padding: 0 20px;
}

.section-title { 
  font-size: 36px;
  font-weight: 700;
  color: #111;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #1890ff, #36cfc9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle { 
  font-size: 16px;
  color: #666;
  line-height: 1.6;
}

/* 三步上手指南容器 */
.guide-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 60px;
  gap: 32px;
}

/* 步骤卡片样式 - 恢复原来的背景色 */
.guide-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 32px;
  /* 恢复原来的背景色 */
  background: #fff;
  position: relative;
  transition: all 0.3s ease;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(24, 144, 255, 0.05);
  z-index: 1;
  min-height: 400px;
  cursor: pointer;
}

/* 卡片顶部装饰条 - 只使用蓝色渐变 */
.guide-step::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #1890ff, #36cfc9);
  border-radius: 2px 2px 0 0;
}

/* 悬停时效果 - 只使用蓝色阴影 */
.guide-step:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(24, 144, 255, 0.15);
  border-color: rgba(24, 144, 255, 0.15);
}

/* 圆形图标区域 - 只使用蓝色渐变背景 */
.step-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  margin-bottom: 28px;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #f5f9ff, #e6f4ff);
  box-shadow: 0 8px 32px rgba(24, 144, 255, 0.15);
  border: 3px solid #fff;
}

.guide-step:hover .step-circle {
  transform: scale(1.05);
  box-shadow: 0 12px 40px rgba(24, 144, 255, 0.25);
}

/* 步骤数字 - 只使用蓝色渐变 */
.step-number {
  font-size: 24px;
  font-weight: 800;
  line-height: 1;
  background: linear-gradient(135deg, #1890ff, #36cfc9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
  text-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
}

.step-emoji {
  font-size: 32px;
  line-height: 1;
  transition: all 0.3s ease;
}

.guide-step:hover .step-emoji {
  transform: scale(1.1);
}

/* 步骤内容区域 */
.step-content {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
}

.step-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.step-title {
  font-size: 24px;
  font-weight: 700;
  /* 恢复原来的文字色 */
  color: #111;
  margin: 0;
  line-height: 1.3;
}

/* 标签样式 - 只使用蓝色渐变背景 */
.step-tag {
  padding: 8px 20px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #1890ff, #36cfc9);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.2);
  transition: all 0.3s ease;
  border: none;
}

.guide-step:hover .step-tag {
  transform: scale(1.05);
  box-shadow: 0 6px 24px rgba(24, 144, 255, 0.3);
}

/* 步骤描述 - 恢复原来的文字色 */
.step-desc {
  font-size: 16px;
  line-height: 1.7;
  color: #444;
  margin: 0 0 24px 0;
  padding: 0 16px;
}

/* 详细特性列表 */
.step-details {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 280px;
}

.step-details li {
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  /* 恢复原来的背景色 */
  background: #f8fafc;
  border: 1px solid rgba(24, 144, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.step-details li:hover {
  background: #e6f7ff;
  border-color: #1890ff;
  transform: translateX(8px);
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.1);
}

/* 不同的check颜色 */
.step-check {
  color: #52c41a;
  font-size: 18px;
  font-weight: 600;
  flex-shrink: 0;
}

/* 垂直连接线 - 作为section之间的分界 - 只使用蓝色渐变 */
.connection-line-vertical.short {
  height: 60px;
  margin-top: 40px;
  margin-bottom: 0;
  background: linear-gradient(to bottom, rgba(24, 144, 255, 0.3), rgba(24, 144, 255, 0));
  position: relative;
  width: 2px;
}

.connection-line-vertical.short::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #1890ff;
  box-shadow: 0 0 20px rgba(24, 144, 255, 0.4);
  border: 4px solid #fff;
}

/* 响应式设计 - 移动端适配 */
@media (max-width: 1024px) {
  .guide-container {
    grid-template-columns: 1fr;
    max-width: 500px;
    gap: 40px;
  }
  
  /* 调整section样式 */
  .section-block {
    margin-bottom: 60px;
    padding: 40px 0;
  }
  
  .section-title {
    font-size: 28px;
  }
}

@media (max-width: 768px) {
  .guide-step {
    padding: 32px 24px;
    min-height: auto;
  }
  
  .step-circle {
    width: 80px;
    height: 80px;
    margin-bottom: 24px;
  }
  
  .step-number {
    font-size: 20px;
  }
  
  .step-emoji {
    font-size: 24px;
  }
  
  .step-title {
    font-size: 20px;
  }
  
  .step-desc {
    font-size: 14px;
    padding: 0;
  }
  
  .step-details {
    max-width: 100%;
  }
  
  .step-details li {
    font-size: 13px;
    padding: 10px 14px;
  }
}
</style>