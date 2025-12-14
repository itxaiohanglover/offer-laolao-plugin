<script setup>
import { ref } from 'vue'

// FAQ数据
const faqData = [
  {
    question: '如何安装和使用这个扩展？',
    answer: [
      '1. 从浏览器扩展商店下载并安装本扩展；',
      '2. 安装完成后，访问支持的招聘网站；',
      '3. 当您浏览职位详情页时，扩展将自动识别并展示匹配度分析；',
      '4. 您可以通过扩展图标点击打开配置面板，调整匹配参数。'
    ]
  },
  {
    question: '该扩展支持哪些招聘网站？',
    answer: [
      '目前支持的招聘网站包括：智联招聘、前程无忧、BOSS直聘、拉勾网、猎聘网和大街网。我们正在不断扩展支持更多招聘平台。'
    ]
  },
  {
    question: '扩展会收集和存储我的个人信息吗？',
    answer: [
      '不会。所有数据处理都在您的本地浏览器中进行，不会上传到任何服务器。您的简历信息和浏览历史仅保存在本地，确保您的隐私安全。'
    ]
  },
  {
    question: '如何自定义匹配条件和评分规则？',
    answer: [
      '在扩展的配置面板中，您可以：',
      '1. 设置关键词权重，调整不同技能和经验在匹配中的重要性；',
      '2. 添加自定义关键词和行业术语；',
      '3. 设置经验年限匹配规则；',
      '4. 配置学历和专业匹配要求。'
    ]
  },
  {
    question: '扩展出现问题如何解决？',
    answer: [
      '如果遇到问题，请尝试以下方法：',
      '1. 重新加载页面；',
      '2. 在扩展设置中清除缓存数据；',
      '3. 更新到最新版本的扩展；',
      '4. 检查您的浏览器是否是最新版本。',
      '如果问题仍然存在，请在GitHub仓库提交Issue。'
    ]
  }
]

const faqOpen = ref(Array(faqData.length).fill(false))

const toggleFaq = (index) => {
  faqOpen.value[index] = !faqOpen.value[index]
  
  // 滚动到展开的FAQ项（如果需要）
  const faqItem = document.querySelector(`.faq-item:nth-child(${index + 1})`)
  if (faqItem && !faqOpen.value[index]) {
    faqItem.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <section class="section-block faq-section">
    <div class="node-icon">
      <div class="node-dot"></div>
    </div>
    
    <div class="section-header">
      <h2 class="section-title">常见问题</h2>
      <p class="section-subtitle">您可能想了解的问题和解答</p>
    </div>
    
    <div class="faq-container">
      <div 
      v-for="(faq, index) in faqData" 
      :key="index" 
      class="faq-item"
    >
        <div class="faq-question" @click="toggleFaq(index)">
          <span class="faq-title">{{ faq.question }}</span>
          <span class="faq-icon">{{ faqOpen[index] ? '−' : '+' }}</span>
        </div>
        <div class="faq-answer" :class="{ expanded: faqOpen[index] }">
          <p v-for="(paragraph, i) in faq.answer" :key="i">{{ paragraph }}</p>
        </div>
      </div>
    </div>
    
    <div class="connection-line-vertical short"></div>
  </section>
</template>

<style scoped>
.section-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 80px;
  padding: 100px 24px 60px;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(24, 144, 255, 0.1);
  position: relative;
  overflow: hidden;
  /* CSS 层面的滚动偏移保障，避免被导航栏遮挡 */
  scroll-margin-top: 100px;
}

/* 节点图标 */
/* 节点图标 - 作为section分界标识 - 蓝色边框 */
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

.node-dot { 
  width: 12px;
  height: 12px;
  background: #1890ff;
  border-radius: 50%;
  box-shadow: 0 0 12px #1890ff;
}

.section-header { 
  text-align: center; 
  margin-bottom: 32px; 
}

.section-title { 
  font-size: 28px; 
  font-weight: 700; 
  color: #111; 
  margin-bottom: 6px; 
  letter-spacing: -0.5px; 
  background: linear-gradient(135deg, #1890ff, #36cfc9); 
  -webkit-background-clip: text; 
  -webkit-text-fill-color: transparent; 
  background-clip: text; 
}

.section-subtitle { 
  font-size: 15px; 
  color: #666; 
  line-height: 1.5; 
}

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
  opacity: 1;
  transform: translateY(0);
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

/* 垂直连接线 */
.connection-line-vertical.short {
  height: 40px; 
  margin-top: 0; 
  margin-bottom: 40px; 
  background: rgba(24, 144, 255, 0.2); 
}



/* 响应式设计 */
@media (max-width: 768px) {
  .faq-container {
    max-width: 100%;
    padding: 12px;
  }
  
  .faq-question {
    padding: 16px 18px;
  }
  
  .faq-title {
    font-size: 15px;
  }
  
  .faq-answer {
    padding: 0 18px;
  }
  
  .faq-answer.expanded {
    padding: 18px;
  }
  
  .faq-answer p {
    font-size: 14px;
  }
}
</style>