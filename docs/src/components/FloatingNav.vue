<script setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  // 仍然接收外部传入的初始值，但主要由内部逻辑接管
  defaultActive: {
    type: String,
    default: 'home'
  }
})

const emit = defineEmits(['scroll-to-top'])

// 1. 导航配置
// 请确保您的页面 HTML 中包含这些 class 的 div
const navItems = [
  { id: 'home', label: '首页', target: '.header-section' },
  { id: 'intro', label: '核心功能', target: '.intro-section' },
  { id: 'guide', label: '使用指南', target: '.guide-section' },
  { id: 'platform', label: '平台支持', target: '.supported-websites-section' },
  { id: 'users', label: '面向人群', target: '.target-users-section' },
  { id: 'faq', label: '常见问题', target: '.faq-section' },
  { id: 'version', label: '版本信息', target: '.version-section' }
]

// 2. 状态管理
const navState = reactive({
  isVisible: true,
  isScrolled: false
})

// 当前激活的菜单 ID (默认使用传入的 props 或 home)
const currentActiveId = ref(props.defaultActive)

let lastScrollTop = 0
let ticking = false

// 3. 点击跳转 (带偏移量)
const handleNavClick = (item) => {
  // 点击时立即手动设置为激活状态，提升响应速度
  currentActiveId.value = item.id
  
  const element = document.querySelector(item.target)
  if (element) {
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - 85 // 85px 偏移，留出一点呼吸感
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

const handleScrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  currentActiveId.value = 'home'
  emit('scroll-to-top')
}

// 4. 核心：计算当前应该激活哪个 Section (ScrollSpy 逻辑)
const checkActiveSection = () => {
  const scrollY = window.scrollY
  const windowHeight = window.innerHeight
  // 文档总高度
  const docHeight = document.documentElement.scrollHeight

  // 4.1 特殊处理：如果滚动到了页面最底部，强制激活最后一个
  if (scrollY + windowHeight >= docHeight - 50) {
    const lastItem = navItems[navItems.length - 1]
    if (currentActiveId.value !== lastItem.id) {
      currentActiveId.value = lastItem.id
    }
    return
  }

  // 4.2 特殊处理：如果滚动在顶部 (首页)
  if (scrollY < 100) {
    currentActiveId.value = 'home'
    return
  }

  // 4.3 遍历所有板块，寻找当前视口中的板块
  // 这里的 offset 150 表示：当板块顶部距离视口顶部 150px 时，就认为进入了该板块
  const offset = 150 
  
  // 倒序遍历，找到第一个满足条件的（即最下方的符合条件的）
  // 这样可以避免重叠时总是选中第一个
  for (let i = navItems.length - 1; i >= 0; i--) {
    const item = navItems[i]
    const element = document.querySelector(item.target)
    
    if (element) {
      // 获取元素相对于文档顶部的绝对位置
      const elementTop = element.getBoundingClientRect().top + window.scrollY
      
      // 如果当前滚动位置超过了元素的顶部（减去偏移量）
      if (scrollY >= elementTop - offset) {
        if (currentActiveId.value !== item.id) {
          currentActiveId.value = item.id
        }
        break // 找到了就停止，因为我们是倒序的，找到的就是当前所在的最高层级板块
      }
    }
  }
}

// 5. 滚动监听聚合函数
const onScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      // 执行导航栏显隐逻辑
      updateNavVisibility()
      // 执行高亮检测逻辑
      checkActiveSection()
      
      ticking = false
    })
    ticking = true
  }
}

// 导航栏显隐逻辑 (保持原样)
const updateNavVisibility = () => {
  const currentScrollTop = window.scrollY || document.documentElement.scrollTop || 0
  if (currentScrollTop < 0) return

  if (currentScrollTop < 60) {
    navState.isVisible = true
    navState.isScrolled = false
    lastScrollTop = currentScrollTop
    return
  }

  navState.isScrolled = true
  const diff = currentScrollTop - lastScrollTop

  if (Math.abs(diff) > 10) {
    navState.isVisible = diff <= 0
    lastScrollTop = currentScrollTop
  }
}

onMounted(() => {
  checkActiveSection() // 初始化检测一次
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <nav class="floating-nav" :class="{ 'nav-hidden': !navState.isVisible, 'scrolled': navState.isScrolled }">
    <div class="nav-container">
      <div class="nav-logo" @click="handleScrollToTop">
        <img src="/logo.png" alt="Logo" />
        <span>offer捞捞</span>
      </div>
      <div class="nav-links">
        <a 
          v-for="item in navItems" 
          :key="item.id"
          href="#"
          :class="{ active: currentActiveId === item.id }" 
          @click.prevent="handleNavClick(item)"
        >
          {{ item.label }}
        </a>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* 导航栏 - 铺满宽度，固定在顶部 */
.floating-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 80px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(24, 144, 255, 0.1);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  z-index: 9999;
  transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  box-sizing: border-box;
  overflow: hidden;
  transform: translateY(0);
  /* 确保导航栏不会导致页面布局偏移 */
  will-change: transform;
}

/* 导航栏内容容器 */
.nav-container {
  width: 100%;
  height: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

/* 导航栏隐藏状态 */
.floating-nav.nav-hidden {
  transform: translateY(-100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

/* 滚动时导航栏样式变化 */
.floating-nav.scrolled {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
}

.floating-nav:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 1);
  transform: translateY(0);
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  font-size: 20px;
  margin-right: auto;
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  background: linear-gradient(135deg, #1890ff, #36cfc9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.nav-logo::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(24, 144, 255, 0.1);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.nav-logo:hover::before {
  width: 300px;
  height: 300px;
}

.nav-logo:hover {
  transform: scale(1.08) translateY(-2px);
}

.nav-logo img { 
  width: 36px; 
  height: 36px; 
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2);
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  z-index: 1;
  position: relative;
}

.nav-logo:hover img {
  box-shadow: 0 6px 20px rgba(24, 144, 255, 0.3);
  transform: scale(1.1);
}

.nav-links {
  display: flex;
  gap: 8px;
  margin: 0 auto;
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.nav-links a {
  text-decoration: none;
  font-size: 15px;
  padding: 10px 20px;
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  font-weight: 500;
  position: relative;
  color: #4b5563;
  background: transparent;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  z-index: 1;
}

.nav-links a::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #36cfc9);
  transition: width 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  z-index: -1;
}

.nav-links a::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(24, 144, 255, 0.05);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
  z-index: -1;
}

.nav-links a:hover::after {
  width: 200px;
  height: 200px;
}

.nav-links a:hover {
  color: #1890ff;
  background: rgba(24, 144, 255, 0.08);
  transform: translateY(-3px);
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.1);
}

.nav-links a:hover::before {
  width: 100%;
}

.nav-links a.active {
  color: #1890ff;
  background: linear-gradient(135deg, rgba(24, 144, 255, 0.12) 0%, rgba(54, 207, 201, 0.1) 50%, rgba(114, 46, 209, 0.1) 100%);
  box-shadow: 0 6px 20px rgba(24, 144, 255, 0.2), 0 3px 10px rgba(114, 46, 209, 0.15);
  border: 1px solid rgba(24, 144, 255, 0.2);
  transform: translateY(-2px);
}

.nav-links a.active::before {
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .nav-container {
    padding: 0 20px;
  }
  
  .nav-links a {
    padding: 8px 16px;
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 16px;
  }
  
  .nav-links {
    display: none; /* 移动端隐藏中间链接 */
  }
  
  .nav-logo {
    font-size: 18px;
  }
  
  .nav-logo img {
    width: 32px;
    height: 32px;
  }
}

@media (max-width: 480px) {
  .floating-nav {
    height: 70px;
  }
  
  .nav-container {
    padding: 0 12px;
  }
  
  .nav-logo {
    font-size: 16px;
    gap: 8px;
  }
  
  .nav-logo img {
    width: 28px;
    height: 28px;
  }
}
</style>