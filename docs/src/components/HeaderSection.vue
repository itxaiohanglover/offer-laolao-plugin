<script setup>
import { Button } from 'ant-design-vue'
import { DownloadOutlined, RightOutlined } from '@ant-design/icons-vue'

const emit = defineEmits(['download', 'github-click'])

const handleDownload = () => {
  emit('download')
}

const handleGitHubClick = () => {
  emit('github-click')
}
</script>

<template>
  <header class="header-section">
    <div class="badge-container">
      
    </div>
    
    <h1 class="hero-title">
      简历自动填写助手<br>
      <span class="highlight-text">让求职回归简单</span>
    </h1>
    
    <p class="hero-desc">
      一款高效的 Chrome 浏览器扩展，集成 豆包 等大模型能力，
      <br>一键解析、自动填充，保护隐私，提升效率。
    </p>
    
    <div class="hero-actions">
      <Button 
        type="primary" 
        size="large" 
        class="hero-btn primary-btn"
        @click="handleDownload"
      >
        <template #icon><DownloadOutlined /></template>
        免费下载 v1.0
      </Button>
      <Button type="text" size="large" class="hero-btn text-btn" @click="handleGitHubClick">
        github直达 <RightOutlined />
      </Button>
    </div>

    <!-- 视觉连接线 (向下延伸) -->
    <div class="connection-line-vertical"></div>
  </header>
</template>

<style scoped>
.header-section {
  position: relative;
  z-index: 1;
  padding-top: 120px;
  padding-bottom: 80px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: url('/banner1.png') center/cover no-repeat;
  margin: 0;
  width: 100%;
  border-radius: 0;
  overflow: hidden;
  min-height: 100vh;
  height: auto;
  box-sizing: border-box;
  /* 确保绝对不会出现内部滚动条 */
  overflow-y: hidden;
  flex-shrink: 0;
  /* 确保Banner区域始终在导航栏下方 */
  margin-top: 0;
  /* 添加顶部边框，确保视觉上与导航栏分离 */
  border-top: 1px solid transparent;
}

.header-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  z-index: -1;
}

.badge-container {
  margin-bottom: 28px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: linear-gradient(135deg, rgba(24, 144, 255, 0.12) 0%, rgba(54, 207, 201, 0.08) 50%, rgba(114, 46, 209, 0.08) 100%);
  border: 1px solid rgba(24, 144, 255, 0.25);
  border-radius: 100px;
  color: #1890ff;
  font-size: 14px;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.hero-title {
  font-size: 64px;
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -1.5px;
  margin-bottom: 28px;
  color: #111;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  text-align: center;
  width: 100%;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.highlight-text {
  background: linear-gradient(135deg, #1890ff 0%, #36cfc9 30%, #722ed1 60%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% 200%;
}

.hero-desc {
  font-size: 22px;
  color: #6b7280;
  line-height: 1.7;
  max-width: 680px;
  margin-bottom: 48px;
  font-weight: 400;
  background: linear-gradient(135deg, #4b5563, #6b7280);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-actions {
  display: flex;
  gap: 20px;
  align-items: center;
}

.hero-btn.primary-btn {
  height: 56px;
  padding: 0 36px;
  border-radius: 16px;
  font-size: 17px;
  background: linear-gradient(135deg, #1890ff 0%, #36cfc9 50%, #722ed1 100%);
  box-shadow: 0 12px 24px rgba(24, 144, 255, 0.25), 0 8px 16px rgba(114, 46, 209, 0.15);
  border: none;
  position: relative;
  overflow: hidden;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 160px;
  box-sizing: border-box;
}

.hero-btn.primary-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.6s ease;
}

.hero-btn.primary-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 20px 40px rgba(24, 144, 255, 0.35), 0 12px 24px rgba(114, 46, 209, 0.25);
  background: linear-gradient(135deg, #722ed1 0%, #36cfc9 50%, #1890ff 100%);
}

.hero-btn.primary-btn:hover::before {
  left: 100%;
}

.hero-btn.text-btn { 
  color: #6b7280;
  font-weight: 500;
  font-size: 16px;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #4b5563, #6b7280);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-btn.text-btn:hover { 
  color: #1890ff;
  background: linear-gradient(135deg, #1890ff, #722ed1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-color: transparent;
  transform: translateX(5px);
}

/* 视觉连接线 (向下延伸) */
.connection-line-vertical {
  height: 100px;
  width: 2px;
  background: linear-gradient(to bottom, rgba(24, 144, 255, 0.3), rgba(54, 207, 201, 0.2), rgba(114, 46, 209, 0.1), rgba(255, 255, 255, 0));
  position: relative;
  margin-top: 80px;
  margin-bottom: 40px;
}

.connection-line-vertical::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1890ff, #36cfc9);
  box-shadow: 0 0 20px rgba(24, 144, 255, 0.4), 0 0 10px rgba(54, 207, 201, 0.3);
  border: 4px solid rgba(255, 255, 255, 0.9);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-section {
    padding-top: 100px;
    padding-bottom: 60px;
    min-height: 500px;
  }
  
  .hero-title {
    font-size: 48px;
    line-height: 1.1;
  }
  
  .hero-desc {
    font-size: 18px;
    padding: 0 20px;
  }
  
  .hero-actions {
    flex-direction: column;
    width: 90%;
  }
  
  .hero-btn {
    width: 100%;
  }
}
</style>