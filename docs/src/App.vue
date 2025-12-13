<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 导入组件
import FloatingNav from './components/FloatingNav.vue'
import HeaderSection from './components/HeaderSection.vue'
import FeatureSection from './components/FeatureSection.vue'
import GuideSection from './components/GuideSection.vue'
import SupportedWebsites from './components/SupportedWebsites.vue'
import TargetUsers from './components/TargetUsers.vue'
import FAQSection from './components/FAQSection.vue'
import VersionSection from './components/VersionSection.vue'

const activeNav = ref('home')

const handleNavClick = (targetSelector) => {
  const target = document.querySelector(targetSelector)
  if (target) {
    // 针对header部分特殊处理，确保能滚动到最顶部
    if (targetSelector === '.header-section') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
      return
    }
    
    // 计算滚动位置，考虑导航栏高度
    const navHeight = 80 // 导航栏高度
    const targetPosition = target.offsetTop - navHeight
    
    // 使用window.scrollTo而不是scrollIntoView，精确控制滚动位置
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    })
  }
}

const handleScroll = () => {
  const scrollPosition = window.scrollY
  // 更新当前激活的导航项
  
  // 页面中的实际section顺序（从上到下），包含所有section
  const sections = [
    { id: 'home', target: '.header-section' },
    { id: 'intro', target: '.intro-section' },
    { id: 'guide', target: '.guide-section' },
    { id: null, target: '.supported-websites-section' }, // 没有对应导航项
    { id: 'target-users', target: '.target-users-section' },
    { id: null, target: '.faq-section' }, // 没有对应导航项
    { id: 'version', target: '.version-section' }
  ]
  
  // 当滚动到顶部（header区域）时，激活home导航项
  if (scrollPosition < 300) {
    activeNav.value = 'home'
    return
  }
  
  // 从下往上检查每个section
  for (let i = sections.length - 1; i >= 0; i--) {
    const item = sections[i]
    const target = document.querySelector(item.target)
    
    if (target) {
      const sectionTop = target.offsetTop
      
      // 只处理有对应导航项的section
      if (item.id) {
        // 调整激活阈值，确保导航项不会错位
        // 给每个section添加一个安全区域，避免激活状态提前切换
        if (sectionTop <= scrollPosition + 200) {
          activeNav.value = item.id
          break
        }
      }
    }
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const downloadUrl = '/download/super_resume1512.zip'
const handleDownload = () => {
  const link = document.createElement('a')
  link.href = downloadUrl
  link.download = 'super_resume1512.zip'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const handleGitHubClick = () => {
  window.open('https://github.com/itxaiohanglover/offer-laolao-plugin', '_blank')
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="app-container">
    <!-- 增强版科技感网格背景 -->
    <div class="grid-background"></div>
    
    <!-- 顶部光晕 -->
    <div class="hero-glow"></div>
    
    <!-- 底部光晕 -->
    <div class="bottom-glow"></div>

    <!-- 悬浮胶囊导航栏 -->
    <FloatingNav 
      :active-nav="activeNav"
      @nav-click="handleNavClick"
      @scroll-to-top="scrollToTop"
    />

    <!-- 头部区域 -->
    <HeaderSection 
      @download="handleDownload"
      @github-click="handleGitHubClick"
    />

    <main class="main-content">
      <!-- 核心功能区域 -->
      <FeatureSection />
      
      <!-- 使用指南 -->
      <GuideSection />
      
      <!-- 支持的招聘网站 -->
      <SupportedWebsites />
      
      <!-- 面向人群 -->
      <TargetUsers />
      
      <!-- 常见问题FAQ部分 -->
      <FAQSection />
      
      <!-- 版本信息 -->
      <VersionSection />
    </main>

    <footer class="footer-section">
      <div class="footer-content">
        <p>© 2025 简历自动填写助手 Resume Helper</p>
        <div class="footer-links">
          <a href="#">隐私协议</a>
          <a href="#">使用文档</a>
          <a href="#">GitHub</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* =========================================
   全局样式 - 只修改特效颜色，保留原来的背景色
   ========================================= */
.app-container {
  width: 100%;
  position: relative;
  /* 恢复原来的背景色 */
  background: #fff;
  color: #1f2937;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  box-sizing: border-box;
  /* 禁止内部滚动，只允许body滚动 */
  overflow: hidden;
  /* 使用min-height确保容器至少占满视口高度，但不限制内容高度 */
  min-height: 100vh;
  height: auto;
}

/* 增强版科技感网格背景 - 只使用蓝色网格 */
.grid-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(24, 144, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(24, 144, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  z-index: 0;
  opacity: 0.3;
}

/* 增强版顶部光晕 - 只使用蓝色系 */
.hero-glow {
  position: absolute;
  top: -300px;
  left: 50%;
  transform: translateX(-50%);
  width: 1000px;
  max-width: 100vw;
  height: 800px;
  background: radial-gradient(50% 50% at 50% 50%, 
    rgba(24, 144, 255, 0.2) 0%, 
    rgba(120, 119, 198, 0.1) 30%, 
    rgba(255, 255, 255, 0) 70%);
  filter: blur(80px);
  z-index: 0;
}

/* 底部光晕 - 只使用蓝色系 */
.bottom-glow {
  position: absolute;
  bottom: -200px;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  max-width: 100vw;
  height: 600px;
  background: radial-gradient(50% 50% at 50% 50%, 
    rgba(24, 144, 255, 0.15) 0%, 
    rgba(120, 119, 198, 0.1) 40%, 
    rgba(255, 255, 255, 0) 70%);
  filter: blur(60px);
  z-index: 0;
}

/* 主内容区样式 */
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  padding-bottom: 60px;
  width: 100%;
  box-sizing: border-box;
  padding-left: 20px;
  padding-right: 20px;
  height: auto;
}

/* 页脚样式 - 只修改边框和文字特效 */
.footer-section {
  border-top: 2px solid rgba(24, 144, 255, 0.2);
  /* 恢复原来的背景色 */
  background: #fff;
  padding: 40px 20px;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  /* 添加底部阴影 */
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-links {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  gap: 24px;
}

.footer-links a {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
  padding: 8px 16px;
  border-radius: 20px;
}

.footer-links a:hover {
  /* 渐变文字效果 */
  background: linear-gradient(135deg, #1890ff 0%, #722ed1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  /* 添加背景色 */
  background-color: rgba(24, 144, 255, 0.1);
  transform: translateY(-2px);
}
</style>

<style>
/* 全局样式 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  overflow-x: hidden;
  /* 确保body是唯一的滚动容器 */
  overflow-y: auto;
  width: 100%;
  height: auto;
  /* 确保body可以自由扩展高度 */
  min-height: 100vh;
}

/* 波纹效果必须写在全局样式中，因为它是通过 JS 动态创建的，无法继承 Scoped ID */
.ripple {
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.6);
  transform: scale(0);
  animation: ripple-animation 0.6s linear;
  pointer-events: none;
  z-index: 1000;
  /* 关键：防止波纹元素占据布局空间 */
  margin: 0;
  padding: 0;
  border: none;
}

@keyframes ripple-animation {
  from {
    transform: scale(0);
    opacity: 0.6;
  }
  to {
    transform: scale(4);
    opacity: 0;
  }
}
</style>