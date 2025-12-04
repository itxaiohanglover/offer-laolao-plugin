<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Button, Card, Typography, Space, Steps } from 'ant-design-vue'
import { DownloadOutlined, CheckCircleOutlined, RightOutlined } from '@ant-design/icons-vue'

const { Title, Paragraph, Text, Link } = Typography
const { Step } = Steps

// 导航菜单项
const navItems = [
  { id: 'intro', label: '核心功能', target: '.intro-section' },
  { id: 'guide', label: '使用指南', target: '.guide-section' },
  { id: 'target-users', label: '面向人群', target: '.target-users-section' },
  { id: 'version', label: '版本信息', target: '.version-section' }
]

const activeNav = ref('intro')
const faqOpen = ref([false, false, false, false, false])
let observer = null

const toggleFaq = (index) => {
  faqOpen.value[index] = !faqOpen.value[index]
  
  // 滚动到展开的FAQ项（如果需要）
  const faqItem = document.querySelector(`.faq-item:nth-child(${index + 1})`)
  if (faqItem && !faqOpen.value[index]) {
    faqItem.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const setupIntersectionObserver = () => {
  // 配置交叉观察器选项
  const options = {
    root: null, // 使用视口作为根
    rootMargin: '0px 0px -100px 0px', // 底部有100px的margin，使元素更早触发
    threshold: 0.1 // 当10%的元素可见时触发回调
  }
  
  // 创建观察器实例
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 元素进入视口，添加动画类
        entry.target.classList.add('visible')
        // 停止观察已处理的元素以提高性能
        observer.unobserve(entry.target)
      }
    })
  }, options)
  
  // 观察所有需要动画的元素
  const animateElements = document.querySelectorAll(
    '.feature-card, .website-card, .architecture-layer, .faq-item, .stat-box, .step-card'
  )
  
  animateElements.forEach(element => {
    // 初始化元素状态（隐藏）
    element.style.opacity = '0'
    element.style.transform = 'translateY(20px)'
    element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out'
    observer.observe(element)
  })
}

// 为按钮添加波纹效果
const addRippleEffect = (e) => {
  const button = e.currentTarget
  const ripple = document.createElement('span')
  const rect = button.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = e.clientX - rect.left - size / 2
  const y = e.clientY - rect.top - size / 2
  
  ripple.style.width = ripple.style.height = size + 'px'
  ripple.style.left = x + 'px'
  ripple.style.top = y + 'px'
  ripple.classList.add('ripple')
  
  // 移除已存在的波纹
  const existingRipple = button.querySelector('.ripple')
  if (existingRipple) existingRipple.remove()
  
  button.appendChild(ripple)
  
  // 动画结束后移除波纹
  setTimeout(() => {
    ripple.remove()
  }, 1000)
}

const handleNavClick = (targetSelector) => {
  const target = document.querySelector(targetSelector)
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' })
  }
}

const handleScroll = () => {
  const scrollPosition = window.scrollY + 100
  // 更新当前激活的导航项
  for (let i = navItems.length - 1; i >= 0; i--) {
    const item = navItems[i]
    const target = document.querySelector(item.target)
    if (target && target.offsetTop <= scrollPosition) {
      activeNav.value = item.id
      break
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  
  // 设置滚动观察器
  setupIntersectionObserver()
  
  // 为所有按钮添加波纹效果
  const buttons = document.querySelectorAll('button, .hero-btn')
  buttons.forEach(button => {
    button.addEventListener('click', addRippleEffect)
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  
  // 清理观察器和事件监听器
  if (observer) {
    observer.disconnect()
  }
  
  const buttons = document.querySelectorAll('button, .hero-btn')
  buttons.forEach(button => {
    button.removeEventListener('click', addRippleEffect)
  })
})

const downloadUrl = '/download/super_resume1512.zip'
const handleDownload = () => {
  const link = document.createElement('a')
  link.href = downloadUrl
  link.download = 'super_resume1512.zip'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
const handleGitHubClick = () => {
  window.open('https://github.com/itxaiohanglover/offer-laolao-plugin', '_blank')
}

const featureList = [
  {
    title: '双模式数据输入',
    desc: '支持文件上传（PDF、DOCX、JSON、TXT）和手动填写两种模式。',
    src: '1.gif',
    type: 'wide' 
  },
  {
    title: '多模型AI解析',
    desc: '支持DeepSeek、通义千问、Kimi等国产大模型智能提取。',
    src: 'model_change.gif',
    type: 'narrow' 
  },
  {
    title: '本地隐私加密',
    desc: '采用AES-GCM加密算法，数据仅存本地，拒绝云端上传。',
    src: '3.gif',
    type: 'narrow'
  },
  {
    title: '全栈简历管理',
    desc: '包含基本信息、教育、项目、技能等全维度模块管理。',
    src: '4.gif',
    type: 'wide'
  }
]

const versions = [
  {
    version: '1.0.0',
    date: '2025-11-30',
    features: ['支持更多招聘网站', '优化自动填写算法']
  }
]
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
    <nav class="floating-nav">
      <div class="nav-logo" @click="scrollToTop">
        <img src="/logo.png" alt="Logo" />
        <span>offer捞捞</span>
      </div>
      <div class="nav-links">
        <a 
          v-for="item in navItems" 
          :key="item.id"
          href="#"
          :class="{ active: activeNav === item.id }"
          @click.prevent="handleNavClick(item.target)"
        >
          {{ item.label }}
        </a>
      </div>
      
    </nav>

    <!-- 头部区域 (仿参考图布局) -->
    <header class="header-section fade-in-up">
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

    <main class="main-content">
      <!-- 核心功能区域 -->
      <section class="section-block intro-section fade-in-up delay-200">
        <!-- 节点图标 -->
        <div class="node-icon">
          <div class="node-dot"></div>
        </div>
        
        <div class="section-header">
           <h2 class="section-title">AI 驱动的核心能力</h2>
           <p class="section-subtitle">从解析到填写，全流程智能化辅助</p>
        </div>

        <div class="feature-grid">
          <div 
            v-for="(item, index) in featureList" 
            :key="index" 
            class="feature-card"
            :class="{ 
              'card-wide': index === 0 || index === 3, 
              'card-narrow': index === 1 || index === 2 
            }"
          >
            <div class="card-header">
              <h3 class="card-title">
                <span class="feature-emoji">
                  {{ index === 0 ? '📁' : index === 1 ? '🤖' : index === 2 ? '🔒' : '📋' }}
                </span>
                {{ item.title }}
              </h3>
              <p class="card-desc">{{ item.desc }}</p>
            </div>
            <div class="card-visual">
              <div class="visual-glow"></div>
              <img :src="item.src" :alt="item.title" class="card-img" />
            </div>
          </div>
        </div>
        
        <!-- 连接线 (继续向下) -->
        <div class="connection-line-vertical short"></div>
      </section>

      <!-- 使用指南 -->
      <section class="section-block guide-section fade-in-up delay-100">
        <div class="node-icon">
          <div class="node-dot"></div>
        </div>

        <div class="section-header">
           <h2 class="section-title">三步快速上手</h2>
           <p class="section-subtitle">简单配置，即刻享受自动化体验</p>
        </div>

        <div class="guide-container-enhanced">
          <!-- 步骤1: 安装扩展 -->
          <div class="guide-step-enhanced step-1">
            <div class="step-circle">
              <span class="step-number">1</span>
              <span class="step-emoji">🧩</span>
            </div>
            <div class="step-content">
              <div class="step-header">
                <h3 class="step-title">扩展安装</h3>
                <div class="step-tag">简单快速</div>
              </div>
              <p class="step-desc">下载压缩包后，只需开启Chrome开发者模式，将插件文件拖入即可完成安装。无需复杂配置，立即开始使用。</p>
              <ul class="step-details">
                <li><span class="step-check">✓</span> 支持最新版Chrome浏览器</li>
                <li><span class="step-check">✓</span> 安全可靠，无隐私风险</li>
                <li><span class="step-check">✓</span> 轻量化设计，不占用系统资源</li>
              </ul>
            </div>
          </div>
          
          <!-- 步骤2: 导入简历 -->
          <div class="guide-step-enhanced step-2">
            <div class="step-circle">
              <span class="step-number">2</span>
              <span class="step-emoji">📄</span>
            </div>
            <div class="step-content">
              <div class="step-header">
                <h3 class="step-title">简历导入</h3>
                <div class="step-tag">AI解析</div>
              </div>
              <p class="step-desc">支持多种格式简历导入，豆包AI大模型智能解析您的简历内容，自动识别并提取关键信息到本地数据库。</p>
              <ul class="step-details">
                <li><span class="step-check">✓</span> 支持PDF、Word、TXT等格式</li>
                <li><span class="step-check">✓</span> AI精准提取，准确率95%+</li>
                <li><span class="step-check">✓</span> 本地处理，数据安全无忧</li>
              </ul>
            </div>
          </div>
          
          <!-- 步骤3: 一键填写 -->
          <div class="guide-step-enhanced step-3">
            <div class="step-circle">
              <span class="step-number">3</span>
              <span class="step-emoji">🚀</span>
            </div>
            <div class="step-content">
              <div class="step-header">
                <h3 class="step-title">一键填写</h3>
                <div class="step-tag">高效投递</div>
              </div>
              <p class="step-desc">访问任何支持的招聘网站，点击插件图标即可自动填充所有表单字段。大幅提升投递效率，告别重复填写。</p>
              <ul class="step-details">
                <li><span class="step-check">✓</span> 支持20+主流招聘平台</li>
                <li><span class="step-check">✓</span> 智能适配不同网站表单</li>
                <li><span class="step-check">✓</span> 一键完成，节省80%时间</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="connection-line-vertical short"></div>
      </section>

      <!-- 支持的招聘网站 -->
      <section class="section-block supported-websites-section fade-in-up delay-300">
        <div class="node-icon">
          <div class="node-dot"></div>
        </div>
        
        <div class="section-header">
           <h2 class="section-title">广泛的平台支持</h2>
           <p class="section-subtitle">兼容主流招聘网站，一键填写无障碍</p>
        </div>

        <div class="websites-grid">
          <div class="website-card">
            <div class="website-icon">🏢</div>
            <h3 class="website-name">智联招聘</h3>
            <p class="website-desc">支持职位搜索、简历投递、在线测评</p>
          </div>
          <div class="website-card">
            <div class="website-icon">💼</div>
            <h3 class="website-name">前程无忧</h3>
            <p class="website-desc">支持简历上传、在线编辑、自动投递</p>
          </div>
          <div class="website-card">
            <div class="website-icon">👔</div>
            <h3 class="website-name">BOSS直聘</h3>
            <p class="website-desc">支持在线沟通、职位搜索、简历管理</p>
          </div>
          <div class="website-card">
            <div class="website-icon">📊</div>
            <h3 class="website-name">拉勾网</h3>
            <p class="website-desc">支持互联网职位、简历投递、在线面试</p>
          </div>
          <div class="website-card">
            <div class="website-icon">🤝</div>
            <h3 class="website-name">脉脉</h3>
            <p class="website-desc">支持职场社交、职位发现、人脉拓展</p>
          </div>
          <div class="website-card">
            <div class="website-icon">🎓</div>
            <h3 class="website-name">实习僧</h3>
            <p class="website-desc">支持实习岗位、校园招聘、兼职信息</p>
          </div>
        </div>
        
        <div class="connection-line-vertical short"></div>
      </section>

      <!-- 面向人群 -->
      <section class="section-block target-users-section fade-in-up delay-400">
        <div class="node-icon">
          <div class="node-dot"></div>
        </div>
        
        <div class="section-header">
           <h2 class="section-title">面向人群</h2>
           <p class="section-subtitle">为不同用户群体提供量身定制的简历管理解决方案</p>
        </div>

        <div class="target-users-container">
          <!-- 求职者 -->
          <div class="user-profile-card">
            <div class="profile-header">
              <div class="profile-icon">👨‍💼</div>
              <h3 class="profile-title">求职者</h3>
            </div>
            <div class="profile-content">
              <div class="pain-points">
                <h4 class="subsection-title">痛点问题</h4>
                <ul class="pain-point-list">
                  <li><span class="pain-point-icon">✗</span> 投递多个职位时需要手动修改简历内容</li>
                  <li><span class="pain-point-icon">✗</span> 无法快速定位招聘网站上的职位要求</li>
                  <li><span class="pain-point-icon">✗</span> 简历投递历史难以追踪和管理</li>
                  <li><span class="pain-point-icon">✗</span> 无法实时了解简历与职位的匹配度</li>
                </ul>
              </div>
              <div class="solutions">
                <h4 class="subsection-title">我们的解决方案</h4>
                <ul class="solution-list">
                  <li><span class="solution-icon">✓</span> 一键提取职位要求，智能匹配简历内容</li>
                  <li><span class="solution-icon">✓</span> 快速高亮关键技能，优化简历重点</li>
                  <li><span class="solution-icon">✓</span> 自动记录投递历史，便于跟踪管理</li>
                  <li><span class="solution-icon">✓</span> 实时生成简历匹配度报告和优化建议</li>
                </ul>
              </div>
            </div>
          </div>
          
          <!-- 学生 -->
          <div class="user-profile-card">
            <div class="profile-header">
              <div class="profile-icon">🎓</div>
              <h3 class="profile-title">学生</h3>
            </div>
            <div class="profile-content">
              <div class="pain-points">
                <h4 class="subsection-title">痛点问题</h4>
                <ul class="pain-point-list">
                  <li><span class="pain-point-icon">✗</span> 缺乏简历制作经验，不知如何突出优势</li>
                  <li><span class="pain-point-icon">✗</span> 实习机会众多，难以针对性准备简历</li>
                  <li><span class="pain-point-icon">✗</span> 对行业要求了解不足，简历内容把握不准</li>
                  <li><span class="pain-point-icon">✗</span> 简历版本管理混乱，不易追踪修改历史</li>
                </ul>
              </div>
              <div class="solutions">
                <h4 class="subsection-title">我们的解决方案</h4>
                <ul class="solution-list">
                  <li><span class="solution-icon">✓</span> 提供学生专属简历模板和指导</li>
                  <li><span class="solution-icon">✓</span> 针对不同实习岗位智能调整简历内容</li>
                  <li><span class="solution-icon">✓</span> 分析目标行业要求，提供个性化建议</li>
                  <li><span class="solution-icon">✓</span> 版本管理功能，方便追踪和对比修改</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div class="connection-line-vertical short"></div>
      </section>

      <!-- 常见问题FAQ部分 -->
      <section class="section-block faq-section fade-in-up delay-500">
        <div class="node-icon">
          <div class="node-dot"></div>
        </div>
        
        <div class="section-header">
          <h2 class="section-title">常见问题</h2>
          <p class="section-subtitle">您可能想了解的问题和解答</p>
        </div>
        
        <div class="faq-container">
          <div class="faq-item" :class="{ visible: faqOpen[0] }">
            <div class="faq-question" @click="toggleFaq(0)">
              <span class="faq-title">如何安装和使用这个扩展？</span>
              <span class="faq-icon">{{ faqOpen[0] ? '−' : '+' }}</span>
            </div>
            <div class="faq-answer" :class="{ expanded: faqOpen[0] }">
              <p>1. 从浏览器扩展商店下载并安装本扩展；</p>
              <p>2. 安装完成后，访问支持的招聘网站；</p>
              <p>3. 当您浏览职位详情页时，扩展将自动识别并展示匹配度分析；</p>
              <p>4. 您可以通过扩展图标点击打开配置面板，调整匹配参数。</p>
            </div>
          </div>
          
          <div class="faq-item" :class="{ visible: faqOpen[1] }">
            <div class="faq-question" @click="toggleFaq(1)">
              <span class="faq-title">该扩展支持哪些招聘网站？</span>
              <span class="faq-icon">{{ faqOpen[1] ? '−' : '+' }}</span>
            </div>
            <div class="faq-answer" :class="{ expanded: faqOpen[1] }">
              <p>目前支持的招聘网站包括：智联招聘、前程无忧、BOSS直聘、拉勾网、猎聘网和大街网。我们正在不断扩展支持更多招聘平台。</p>
            </div>
          </div>
          
          <div class="faq-item" :class="{ visible: faqOpen[2] }">
            <div class="faq-question" @click="toggleFaq(2)">
              <span class="faq-title">扩展会收集和存储我的个人信息吗？</span>
              <span class="faq-icon">{{ faqOpen[2] ? '−' : '+' }}</span>
            </div>
            <div class="faq-answer" :class="{ expanded: faqOpen[2] }">
              <p>不会。所有数据处理都在您的本地浏览器中进行，不会上传到任何服务器。您的简历信息和浏览历史仅保存在本地，确保您的隐私安全。</p>
            </div>
          </div>
          
          <div class="faq-item" :class="{ visible: faqOpen[3] }">
            <div class="faq-question" @click="toggleFaq(3)">
              <span class="faq-title">如何自定义匹配条件和评分规则？</span>
              <span class="faq-icon">{{ faqOpen[3] ? '−' : '+' }}</span>
            </div>
            <div class="faq-answer" :class="{ expanded: faqOpen[3] }">
              <p>在扩展的配置面板中，您可以：</p>
              <p>1. 设置关键词权重，调整不同技能和经验在匹配中的重要性；</p>
              <p>2. 添加自定义关键词和行业术语；</p>
              <p>3. 设置经验年限匹配规则；</p>
              <p>4. 配置学历和专业匹配要求。</p>
            </div>
          </div>
          
          <div class="faq-item" :class="{ visible: faqOpen[4] }">
            <div class="faq-question" @click="toggleFaq(4)">
              <span class="faq-title">扩展出现问题如何解决？</span>
              <span class="faq-icon">{{ faqOpen[4] ? '−' : '+' }}</span>
            </div>
            <div class="faq-answer" :class="{ expanded: faqOpen[4] }">
              <p>如果遇到问题，请尝试以下方法：</p>
              <p>1. 重新加载页面；</p>
              <p>2. 在扩展设置中清除缓存数据；</p>
              <p>3. 更新到最新版本的扩展；</p>
              <p>4. 检查您的浏览器是否是最新版本。</p>
              <p>如果问题仍然存在，请在GitHub仓库提交Issue。</p>
            </div>
          </div>
        </div>
        
        <div class="connection-line-vertical short"></div>
      </section>

      <!-- 版本信息 -->
      <section class="section-block version-section fade-in-up delay-500">
        <div class="node-icon">
          <div class="node-dot"></div>
        </div>
        
        <Card class="content-card version-card" :bordered="false">
          <div class="section-header small">
            <h2 class="section-title">迭代日志</h2>
          </div>
          
          <!-- 数据概览 -->
          <div class="stats-row">
             <div class="stat-box">
               <strong>10k+</strong>
               <span>活跃用户</span>
             </div>
             <div class="stat-divider"></div>
             <div class="stat-box">
               <strong>95%</strong>
               <span>填写准确率</span>
             </div>
             <div class="stat-divider"></div>
             <div class="stat-box">
               <strong>20+</strong>
               <span>支持平台</span>
             </div>
          </div>

          <div class="version-list">
            <div v-for="(version, index) in versions" :key="index" class="v-item">
              <div class="v-head">
                <span class="v-tag" :class="{ 'v-latest': index === 0 }">{{ version.version }}</span>
                <span class="v-date">{{ version.date }}</span>
              </div>
              <ul class="v-features">
                <li v-for="(f, i) in version.features" :key="i">{{ f }}</li>
              </ul>
            </div>
          </div>
        </Card>
      </section>
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
   1. 全局与背景 (增强版科技感)
   ========================================= */
.app-container {
  width: 100%;
  min-height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #f5f9ff 0%, #f0f7ff 50%, #e6f4ff 100%);
  color: #1f2937;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: hidden;
}

/* 增强版科技感网格背景 */


/* 增强版顶部光晕 */
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
  animation: glowPulse 8s ease-in-out infinite;
}

/* 底部光晕 */
.bottom-glow {
  position: absolute;
  bottom: -200px;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  max-width: 100vw;
  height: 600px;
  background: radial-gradient(50% 50% at 50% 50%, 
    rgba(120, 119, 198, 0.15) 0%, 
    rgba(24, 144, 255, 0.1) 40%, 
    rgba(255, 255, 255, 0) 70%);
  filter: blur(60px);
  z-index: 0;
  animation: glowPulse 6s ease-in-out infinite alternate;
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.6; transform: translateX(-50%) scale(1); }
  50% { opacity: 0.8; transform: translateX(-50%) scale(1.05); }
}

/* =========================================
   2. 悬浮胶囊导航栏 (Trae 风格)
   ========================================= */
.floating-nav {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  width: auto;
  min-width: 520px;
  min-height: 56px;
  padding: 12px 16px 12px 28px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 100px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(24, 144, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 9999;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.floating-nav:hover {
  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(24, 144, 255, 0.1);
  background: linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(248, 250, 252, 0.98) 100%);
  transform: translateX(-50%) translateY(-2px);
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  font-size: 18px;
  color: #111;
  margin-right: 24px;
  transition: all 0.3s ease;
}

.nav-logo:hover {
  transform: scale(1.05);
}

.nav-logo img { 
  width: 28px; 
  height: 28px; 
  border-radius: 8px; 
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2);
}

.nav-links {
  display: flex;
  gap: 8px;
  background: linear-gradient(135deg, rgba(24, 144, 255, 0.05) 0%, rgba(54, 207, 201, 0.03) 100%);
  padding: 6px;
  border-radius: 100px;
  border: 1px solid rgba(24, 144, 255, 0.1);
}

.nav-links a {
  text-decoration: none;
  color: #666;
  font-size: 14px;
  padding: 8px 20px;
  border-radius: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
  position: relative;
}

.nav-links a::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #1890ff, #36cfc9);
  transition: width 0.3s ease;
}

.nav-links a:hover { 
  color: #1890ff; 
  background: rgba(24, 144, 255, 0.05);
}

.nav-links a:hover::before {
  width: 100%;
}

.nav-links a.active {
  background: linear-gradient(135deg, rgba(24, 144, 255, 0.1) 0%, rgba(54, 207, 201, 0.08) 100%);
  color: #1890ff;
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.15);
}

.nav-btn {
  margin-left: 24px;
  background: linear-gradient(135deg, #111 0%, #333 100%);
  border-color: #111;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-btn:hover {
  background: linear-gradient(135deg, #333 0%, #555 100%) !important;
  border-color: #333 !important;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
}

/* =========================================
   3. Hero 区域 (增强版)
   ========================================= */
.header-section {
  position: relative;
  z-index: 1;
  padding-top: 180px;
  padding-bottom: 80px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: url('/banner1.png') center/contain no-repeat;
  background-attachment: fixed;
  margin: 0;
  border-radius: 0;
  overflow: hidden;
  height: auto;
  background-size: cover;
  height: 80vh;
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
  background: linear-gradient(135deg, rgba(24, 144, 255, 0.12) 0%, rgba(54, 207, 201, 0.08) 100%);
  border: 1px solid rgba(24, 144, 255, 0.25);
  border-radius: 100px;
  color: #1890ff;
  font-size: 14px;
  font-weight: 600;
  backdrop-filter: blur(10px);
  animation: badgeFloat 3s ease-in-out infinite;
}

@keyframes badgeFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
}

.hero-title {
  font-size: 64px;
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -1.5px;
  margin-bottom: 28px;
  color: #111;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.highlight-text {
  background: linear-gradient(135deg, #1890ff 0%, #36cfc9 50%, #722ed1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 200%;
  animation: gradientShift 4s ease infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.hero-desc {
  font-size: 22px;
  color: #666;
  line-height: 1.7;
  max-width: 680px;
  margin-bottom: 48px;
  font-weight: 400;
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
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 50%, #0050b3 100%);
  box-shadow: 0 12px 24px rgba(24, 144, 255, 0.25);
  border: none;
  position: relative;
  overflow: hidden;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 160px; /* 防止按钮宽度变化 */
  box-sizing: border-box; /* 确保尺寸计算正确 */
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
  box-shadow: 0 20px 40px rgba(24, 144, 255, 0.35);
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 60%, #0050b3 100%);
}

/* 防止下载按钮点击时异常 */


.hero-btn.primary-btn:hover::before {
  left: 100%;
}

.hero-btn.text-btn { 
  color: #666; 
  font-weight: 500; 
  font-size: 16px;
  transition: all 0.3s ease;
}

.hero-btn.text-btn:hover { 
  color: #1890ff; 
  background: transparent;
  transform: translateX(5px);
}

/* 垂直连接线 */
.connection-line-vertical {
  width: 1px;
  height: 80px;
  background: linear-gradient(to bottom, rgba(24, 144, 255, 0), rgba(24, 144, 255, 0.4));
  margin-top: 60px;
  position: relative;
}
.connection-line-vertical::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #1890ff;
}
.connection-line-vertical.short { height: 40px; margin-top: 0; margin-bottom: 40px; background: rgba(24, 144, 255, 0.2); }

/* =========================================
   4. 核心功能 (卡片风格)
   ========================================= */
.main-content {
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  padding-bottom: 60px;
  width: 100%;
  box-sizing: border-box;
  padding-left: 20px;
  padding-right: 20px;
}

.section-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 48px;
}

/* 节点图标 */
.node-icon {
  width: 32px;
  height: 32px;
  border: 1px solid rgba(24, 144, 255, 0.3);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f9ff;
  margin-bottom: 24px;
  position: relative;
  z-index: 2;
}
.node-dot { width: 8px; height: 8px; background: #1890ff; border-radius: 50%; box-shadow: 0 0 10px #1890ff; }

.section-header { text-align: center; margin-bottom: 32px; }
.section-title { font-size: 28px; font-weight: 700; color: #111; margin-bottom: 6px; letter-spacing: -0.5px; }
.section-subtitle { font-size: 15px; color: #666; line-height: 1.5; }

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  margin-bottom: 32px;
}

.card-wide { grid-column: span 2; }
.card-narrow { grid-column: span 1; }

.feature-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%);
  border: 1px solid rgba(24, 144, 255, 0.15);
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(15px);
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #1890ff, #36cfc9, #722ed1);
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.feature-card::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(24, 144, 255, 0.1) 0%, transparent 70%);
  transition: all 0.6s ease;
  transform: translate(-50%, -50%);
}

.feature-card:hover {
  transform: translateY(-8px) scale(1.03);
  border-color: rgba(24, 144, 255, 0.4);
  box-shadow: 0 25px 50px rgba(24, 144, 255, 0.2);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%);
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-card:hover::after {
  width: 200%;
  height: 200%;
}

.card-header { 
  padding: 32px 32px 16px; 
  position: relative; 
  z-index: 2; 
}

.card-title { 
  font-size: 20px; 
  font-weight: 700; 
  color: #111; 
  margin-bottom: 8px; 
  display: flex; 
  align-items: center; 
  gap: 12px; 
}

.feature-emoji {
  font-size: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, rgba(24,144,255,0.15) 0%, rgba(54,207,201,0.1) 100%);
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.1);
}

.feature-card:hover .feature-emoji {
  transform: scale(1.15) rotate(8deg);
  background: linear-gradient(135deg, rgba(24,144,255,0.2) 0%, rgba(54,207,201,0.15) 100%);
  box-shadow: 0 6px 20px rgba(24, 144, 255, 0.2);
}
.card-desc { 
  font-size: 15px; 
  color: #666; 
  line-height: 1.7; 
  font-weight: 400;
}

.card-visual {
  flex: 1;
  background: linear-gradient(135deg, #f8fbff 0%, #f0f7ff 100%);
  border-top: 1px solid rgba(24, 144, 255, 0.1);
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 24px 24px 0;
  overflow: hidden;
}

/* 视觉内部的光晕 */
.visual-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(24,144,255,0.08) 0%, transparent 70%);
  z-index: 0;
  transition: all 0.6s ease;
}

.feature-card:hover .visual-glow {
  background: radial-gradient(circle, rgba(24,144,255,0.12) 0%, transparent 70%);
}

.card-img {
  width: 100%;
  height: auto;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -6px 24px rgba(0,0,0,0.1);
  position: relative;
  z-index: 1;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.feature-card:hover .card-img {
  transform: scale(1.05) rotate(2deg);
  box-shadow: 0 -8px 32px rgba(0,0,0,0.15);
}

/* =========================================
   5. 使用指南部分 - 增强版
   ========================================= */
.guide-container-enhanced {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 40px;
  gap: 0;
  position: relative;
  background: linear-gradient(135deg, #f8faff 0%, #f0f7ff 100%);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(24, 144, 255, 0.1);
  border: 1px solid rgba(24, 144, 255, 0.1);
}

/* 步骤卡片样式 */
.guide-step-enhanced {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 48px 32px;
  background: #fff;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-right: 1px solid rgba(24, 144, 255, 0.05);
}

.guide-step-enhanced:last-child {
  border-right: none;
}

/* 步骤卡片悬浮效果 */
.guide-step-enhanced:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(24, 144, 255, 0.15);
  z-index: 2;
}

/* 每个步骤的渐变背景 */
.guide-step-enhanced::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.step-1::before { background: linear-gradient(to bottom, #1890ff, #36cfc9); }
.step-2::before { background: linear-gradient(to bottom, #722ed1, #eb2f96); }
.step-3::before { background: linear-gradient(to bottom, #fa8c16, #fadb14); }

.guide-step-enhanced:hover::before { opacity: 1; }

/* 圆形图标区域 */
.step-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  margin-bottom: 24px;
  transition: all 0.3s ease;
}

/* 每个步骤的圆形背景色 */
.step-1 .step-circle {
  background: linear-gradient(135deg, #e6f7ff, #bae7ff);
  box-shadow: 0 8px 32px rgba(24,144,255,0.15);
}
.step-2 .step-circle {
  background: linear-gradient(135deg, #f9f0ff, #efbbff);
  box-shadow: 0 8px 32px rgba(114,46,209,0.15);
}
.step-3 .step-circle {
  background: linear-gradient(135deg, #fff7e6, #ffd591);
  box-shadow: 0 8px 32px rgba(250,140,22,0.15);
}

.guide-step-enhanced:hover .step-circle {
  transform: scale(1.1);
}

/* 步骤数字和emoji */
.step-number {
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
  opacity: 0.8;
  margin-bottom: 1px;
}
.step-1 .step-number { color: #1890ff; }
.step-2 .step-number { color: #722ed1; }
.step-3 .step-number { color: #fa8c16; }

.step-emoji {
  font-size: 18px;
  line-height: 1;
}

/* 步骤内容区域 */
.step-content {
  flex: 1;
  width: 100%;
}

.step-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.step-title {
  font-size: 20px;
  font-weight: 700;
  color: #111;
  margin: 0;
  line-height: 1.3;
}

/* 标签样式 */
.step-tag {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  background: #1890ff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.step-1 .step-tag { background: #1890ff; }
.step-2 .step-tag { background: #722ed1; }
.step-3 .step-tag { background: #fa8c16; }

/* 步骤描述 */
.step-desc {
  font-size: 15px;
  line-height: 1.6;
  color: #444;
  margin: 0 0 10px 0;
}

/* 详细特性列表 */
.step-details {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.step-details li {
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 14px;
  background: #f7f7f7;
  border: 1px solid rgba(0,0,0,0.04);
  transition: all 0.3s ease;
}

.guide-step-enhanced:hover .step-details li {
  background: #f0f0f0;
  transform: translateY(-2px);
}

.step-1 .step-details li:hover { background: #e6f7ff; border-color: rgba(24,144,255,0.2); }
.step-2 .step-details li:hover { background: #f9f0ff; border-color: rgba(114,46,209,0.2); }
.step-3 .step-details li:hover { background: #fff7e6; border-color: rgba(250,140,22,0.2); }

.step-check {
  color: #52c41a;
  font-size: 14px;
  font-weight: 600;
}

/* 步骤连接线 - 水平排列 */
.step-connector {
  display: none; /* 水平布局不需要连接线 */
}

.connector-line {
  display: none;
}

.connector-arrow {
  display: none;
}

/* 响应式设计 - 移动端适配 */
@media (max-width: 992px) {
  .guide-container-enhanced {
    grid-template-columns: 1fr;
    max-width: 600px;
    gap: 0;
  }
  
  .guide-step-enhanced {
    border-right: none;
    border-bottom: 1px solid rgba(24, 144, 255, 0.05);
    padding: 32px 24px;
  }
  
  .guide-step-enhanced:last-child {
    border-bottom: none;
  }
  
  .guide-step-enhanced:hover {
    transform: translateY(-4px);
  }
}

@media (max-width: 768px) {
  .guide-container-enhanced {
    max-width: 100%;
    border-radius: 16px;
  }
  
  .guide-step-enhanced {
    padding: 24px 20px;
  }
  
  .step-circle {
    width: 64px;
    height: 64px;
    margin-bottom: 20px;
  }
  
  .step-title {
    font-size: 18px;
  }
  
  .step-desc {
    font-size: 14px;
  }
}

/* 添加动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(24, 144, 255, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(24, 144, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(24, 144, 255, 0);
  }
}

/* 波纹效果样式 */
.ripple {
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.6);
  transform: scale(0);
  animation: ripple-animation 1s ease-out;
  pointer-events: none;
  z-index: 1000;
  /* 防止波纹效果影响按钮布局 */
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
}

@keyframes ripple-animation {
  0% {
    transform: scale(0);
    opacity: 0.8;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

/* 按钮通用样式增强 */
button, .hero-btn, .hero-cta {
  position: relative;
  overflow: hidden;
}

/* 元素进入视口的可见性过渡 */
.feature-card, .website-card, .architecture-layer, .faq-item, .stat-box, .step-card {
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.feature-card.visible,
.website-card.visible,
.architecture-layer.visible,
.faq-item.visible,
.stat-box.visible,
.step-card.visible {
  opacity: 1;
  transform: translateY(0);
  animation: fadeInUp 0.6s ease-out forwards;
}

/* 滚动动画类 */
.fade-in-up {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease-out forwards;
}

.fade-in {
  opacity: 0;
  animation: fadeIn 0.6s ease-out forwards;
}

.scale-in {
  opacity: 0;
  transform: scale(0.95);
  animation: scaleIn 0.6s ease-out forwards;
}

.slide-in-left {
  opacity: 0;
  transform: translateX(-20px);
  animation: slideInLeft 0.6s ease-out forwards;
}

/* 延迟动画 */
.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }
.delay-300 { animation-delay: 0.3s; }
.delay-400 { animation-delay: 0.4s; }
.delay-500 { animation-delay: 0.5s; }

/* 步骤卡片动画 */
.guide-step-enhanced {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease-out forwards;
}

.step-1 { animation-delay: 0.1s; }
.step-2 { animation-delay: 0.2s; }
.step-3 { animation-delay: 0.3s; }

/* 脉冲动画 */
.pulse {
  animation: pulse 2s infinite;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .guide-step-enhanced {
    padding: 24px;
    gap: 20px;
  }
  
  .step-circle {
    width: 64px;
    height: 64px;
  }
  
  .step-number {
    font-size: 18px;
  }
  
  .step-emoji {
    font-size: 20px;
  }
  
  .step-title {
    font-size: 18px;
  }
  
  .step-details {
    flex-direction: column;
    gap: 8px;
  }
  
  .step-details li {
    font-size: 12px;
  }
}

/* =========================================
   6. 版本信息与页脚
   ========================================= */
.version-card {
  width: 100%;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 10px 40px rgba(0,0,0,0.04);
  border: 1px solid rgba(0,0,0,0.04);
}

.stats-row {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 24px;
  background: linear-gradient(to right, #f8fbff, #f0f7ff);
  border-radius: 16px;
  margin-bottom: 24px;
}
.stat-box { 
  text-align: center; 
  position: relative;
  padding: 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.3);
}

.stat-box:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(24, 144, 255, 0.1);
}
.stat-box strong { display: block; font-size: 28px; color: #1890ff; margin-bottom: 4px; }
.stat-box span { font-size: 13px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
.stat-divider { width: 1px; height: 30px; background: rgba(0,0,0,0.05); }

.version-list { padding: 0 20px 20px; }
.v-item { padding-bottom: 20px; border-bottom: 1px dashed rgba(0,0,0,0.06); margin-bottom: 20px; }
.v-item:last-child { border-bottom: none; margin-bottom: 0; }
.v-head { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.v-tag { background: #eee; color: #555; padding: 2px 8px; border-radius: 6px; font-size: 13px; font-weight: 600; font-family: monospace; }
.v-tag.v-latest { background: rgba(24,144,255,0.1); color: #1890ff; }
.v-date { color: #999; font-size: 13px; }
.v-features { padding-left: 20px; margin: 0; color: #555; font-size: 14px; }
.v-features li { margin-bottom: 6px; }

.footer-section {
  border-top: 1px solid rgba(0,0,0,0.05);
  background: #fff;
  padding: 40px 20px;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
}
.footer-links {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  gap: 24px;
}
.footer-links a { color: #666; text-decoration: none; font-size: 14px; transition: color 0.2s; }
.footer-links a:hover { color: #1890ff; }

/* =========================================
   7. 支持的招聘网站
   ========================================= */
.websites-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 100%;
  margin-bottom: 32px;
}

.website-card {
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 14px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.website-card:hover {
  transform: translateY(-5px) scale(1.03);
  border-color: rgba(24, 144, 255, 0.3);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.06);
  background: linear-gradient(180deg, #ffffff, #f8fbff);
}

.website-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #f0f7ff, #f8fbff);
  border-radius: 10px;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(24, 144, 255, 0.1);
  font-size: 24px;
  transition: transform 0.3s ease, background 0.3s ease;
}

.website-card:hover .website-icon {
  transform: scale(1.1) rotate(5deg);
  background: linear-gradient(135deg, #e6f7ff, #bae7ff);
}

.website-name {
  font-size: 18px;
  font-weight: 600;
  color: #111;
  margin-bottom: 8px;
}

.website-desc {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

/* 面向人群样式 */
.target-users-container {
  display: flex;
  gap: 40px;
  justify-content: center;
  margin-top: 30px;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.user-profile-card {
  background: #fff;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 30px;
  width: 100%;
  flex: 1;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-width: 0;
}

.user-profile-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #1890ff, #36cfc9);
}

.user-profile-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
  border-color: rgba(24, 144, 255, 0.3);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.profile-icon {
  font-size: 40px;
  width: 60px;
  height: 60px;
  background: #f5f9ff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.user-profile-card:hover .profile-icon {
  transform: scale(1.1) rotate(5deg);
  background: #e6f7ff;
}

.profile-title {
  font-size: 20px;
  font-weight: 600;
  color: #111;
  margin: 0;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pain-points,
.solutions {
  background: #fafafa;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
}

.user-profile-card:hover .pain-points,
.user-profile-card:hover .solutions {
  background: #f0f8ff;
}

.subsection-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.pain-point-list,
.solution-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pain-point-list li,
.solution-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  line-height: 1.5;
  color: #555;
  padding-left: 5px;
  position: relative;
  transition: all 0.2s ease;
}

.pain-point-list li:hover,
.solution-list li:hover {
  padding-left: 10px;
  color: #333;
}

.pain-point-icon {
  color: #ff4d4f;
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 2px;
}

.solution-icon {
  color: #52c41a;
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 2px;
}

/* 动画效果 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-profile-card {
  animation: slideIn 0.6s ease forwards;
  opacity: 0;
}

.user-profile-card:nth-child(1) {
  animation-delay: 0.1s;
}

.user-profile-card:nth-child(2) {
  animation-delay: 0.3s;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 列表项动画 - 页面加载时就显示 */
.pain-point-list li,
.solution-list li {
  opacity: 0;
  transform: translateY(10px);
  animation: slideInUp 0.5s ease forwards;
}

/* 为列表项添加延迟动画 */
.user-profile-card:nth-child(1) .pain-point-list li:nth-child(1),
.user-profile-card:nth-child(1) .solution-list li:nth-child(1) { animation-delay: 0.4s; }
.user-profile-card:nth-child(1) .pain-point-list li:nth-child(2),
.user-profile-card:nth-child(1) .solution-list li:nth-child(2) { animation-delay: 0.5s; }
.user-profile-card:nth-child(1) .pain-point-list li:nth-child(3),
.user-profile-card:nth-child(1) .solution-list li:nth-child(3) { animation-delay: 0.6s; }
.user-profile-card:nth-child(1) .pain-point-list li:nth-child(4),
.user-profile-card:nth-child(1) .solution-list li:nth-child(4) { animation-delay: 0.7s; }

.user-profile-card:nth-child(2) .pain-point-list li:nth-child(1),
.user-profile-card:nth-child(2) .solution-list li:nth-child(1) { animation-delay: 0.6s; }
.user-profile-card:nth-child(2) .pain-point-list li:nth-child(2),
.user-profile-card:nth-child(2) .solution-list li:nth-child(2) { animation-delay: 0.7s; }
.user-profile-card:nth-child(2) .pain-point-list li:nth-child(3),
.user-profile-card:nth-child(2) .solution-list li:nth-child(3) { animation-delay: 0.8s; }
.user-profile-card:nth-child(2) .pain-point-list li:nth-child(4),
.user-profile-card:nth-child(2) .solution-list li:nth-child(4) { animation-delay: 0.9s; }

/* 响应式设计 */
@media (max-width: 992px) {
  .target-users-container {
    flex-direction: column;
    gap: 25px;
    padding: 0 20px;
    max-width: 800px;
  }
  
  .user-profile-card {
    padding: 28px;
  }
}

@media (max-width: 768px) {
  .target-users-container {
    padding: 0 16px;
  }
  
  .user-profile-card {
    padding: 24px;
  }
  
  .profile-header {
    gap: 12px;
  }
  
  .profile-icon {
    font-size: 32px;
    width: 50px;
    height: 50px;
  }
  
  .profile-title {
    font-size: 18px;
  }
  
  .pain-point-list li,
  .solution-list li {
    font-size: 13px;
  }
}


/* =========================================
   9. 常见问题FAQ - 增强版
   ========================================= */
.faq-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  background: #fff;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.faq-item {
  margin-bottom: 16px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  background: white;
  opacity: 0;
  transform: translateY(20px);
}

/* 元素进入视口时的动画触发类 */
.faq-item.visible {
  opacity: 1;
  transform: translateY(0);
  animation: fadeInUp 0.6s ease-out forwards;
}

.faq-item:hover {
  border-color: rgba(24, 144, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.faq-item:last-child {
  margin-bottom: 0;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  color: #2c3e50;
  user-select: none;
  position: relative;
}

.faq-question:hover {
  background: #e6f4ff;
  border-color: rgba(24, 144, 255, 0.3);
  transform: translateX(2px);
}

.faq-question::after {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 60%;
  background: #1890ff;
  border-radius: 2px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.faq-item:hover .faq-question::after {
  opacity: 1;
}

.faq-title {
  font-size: 16px;
  line-height: 1.6;
}

.faq-icon {
  font-size: 20px;
  color: #1890ff;
  transition: all 0.3s ease;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.05);
}

.faq-answer {
  padding: 0 20px;
  max-height: 0;
  overflow: hidden;
  background: #fff;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.faq-answer.expanded {
  padding: 20px;
  max-height: 500px;
}

.faq-answer p {
  margin: 0 0 12px 0;
  font-size: 15px;
  line-height: 1.7;
  color: #495057;
}

.faq-answer p:last-child {
  margin-bottom: 0;
}

/* FAQ区域的连接线样式 */
.faq-section .connection-line-vertical.short {
  height: 60px;
}

/* 响应式调整 */
@media (max-width: 900px) {
  .feature-grid, .guide-container, .websites-grid { grid-template-columns: 1fr; display: flex; flex-direction: column; }
  .card-wide, .card-narrow { grid-column: span 1; }
  .guide-line { display: none; }
  .floating-nav { min-width: auto; width: 90%; }
  .hero-title { font-size: 36px; }
  .nav-links { display: none; } /* 移动端隐藏中间链接 */
}
</style>

<style>
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