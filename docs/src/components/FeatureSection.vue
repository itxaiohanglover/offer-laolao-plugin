<script setup>
// 核心功能列表
const featureList = [
  {
    title: '自动解析简历',
    desc: '支持文件上传（PDF、DOCX、JSON、TXT）和手动填写两种模式。',
    src: 'offerLaoLao/autoParse.gif',
    type: 'wide',
    emoji: '📁'
  },
  {
    title: '多模型AI解析',
    desc: '支持DeepSeek、通义千问、Kimi等国产大模型智能提取。',
    src: 'offerLaoLao/modelChange.gif',
    type: 'narrow',
    emoji: '🤖'
  },
  {
    title: 'AI一键优化简历',
    desc: '一键优化简历，求职无忧',
    src: 'offerLaoLao/autoUpgrade.gif',
    type: 'narrow',
    emoji: '🔒'
  },
  {
    title: '页面识别自动填写',
    desc: 'AI智能算法匹配，精准识别',
    src: 'offerLaoLao/autoAdd.gif',
    type: 'wide',
    emoji: '📋'
  }
]
</script>

<template>
  <section class="section-block intro-section">
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
          'card-wide': item.type === 'wide', 
          'card-narrow': item.type === 'narrow' 
        }"
      >
        <div class="card-header">
          <h3 class="card-title">
            <span class="feature-emoji">
              {{ item.emoji }}
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
</template>

<style scoped>
/* =========================================
   容器通用样式
   ========================================= */
.section-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 80px;
  padding: 100px 24px 60px; /* 增加左右内边距防止窄屏贴边 */
  background: #ffffff;
  position: relative;
  /* 移除边框，改用更通透的背景 */
}

/* 装饰背景光（可选，增加氛围感） */
.section-block::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 1200px;
  height: 600px;
  background: radial-gradient(circle at 50% 0%, rgba(24, 144, 255, 0.04) 0%, transparent 70%);
  z-index: 0;
  pointer-events: none;
}

/* 顶部节点图标 - 保持原样但更精致 */
.node-icon {
  width: 44px;
  height: 44px;
  border: 2px solid #e6f7ff; /* 更淡的边框 */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  margin-bottom: 32px;
  position: relative;
  z-index: 2;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
}

.node-dot { 
  width: 14px;
  height: 14px;
  background: #1890ff;
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(24, 144, 255, 0.2); /* 光晕效果 */
}

/* 标题区域 */
.section-header { 
  text-align: center;
  margin-bottom: 56px;
  max-width: 640px;
  position: relative;
  z-index: 1;
}

.section-title { 
  font-size: 38px; 
  font-weight: 800; 
  margin-bottom: 16px; 
  letter-spacing: -1px; 
  color: #1890ff; /* 统一主色调，简约大气 */
}

.section-subtitle { 
  font-size: 16px;
  color: #64748b;
  line-height: 1.6;
  font-weight: 500;
}

/* =========================================
   网格布局 (核心布局不动)
   ========================================= */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px; /* 稍微拉大间距 */
  width: 100%;
  max-width: 1200px;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
}

.card-wide { grid-column: span 2; }
.card-narrow { grid-column: span 1; }

/* =========================================
   卡片样式 (美化重点)
   ========================================= */
.feature-card {
  background: #fff;
  border: 1px solid #edf2f7; /* 极淡的边框 */
  border-radius: 24px;       /* 更大的圆角 */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: pointer;
  
  /* 默认阴影：柔和且有多层层次 */
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.02), 
    0 2px 4px -1px rgba(0, 0, 0, 0.02),
    0 10px 15px -3px rgba(0, 0, 0, 0.02);
  
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* 悬停效果：上浮 + 阴影加深 + 边框高亮 */
.feature-card:hover {
  transform: translateY(-6px);
  border-color: rgba(24, 144, 255, 0.3);
  box-shadow: 
    0 20px 25px -5px rgba(24, 144, 255, 0.08), 
    0 10px 10px -5px rgba(24, 144, 255, 0.04);
}

/* 移除之前的顶部装饰线条，改用更现代的微光效果（可选） */
.feature-card::before {
  display: none;
}

/* 卡片文本区域 */
.card-header { 
  padding: 36px 36px 20px; 
  position: relative; 
  z-index: 2; 
}

/* 标题样式 */
.card-title { 
  font-size: 20px; 
  font-weight: 700; 
  color: #1e293b;
  margin-bottom: 12px; 
  display: flex; 
  align-items: center; 
  gap: 14px; 
}

/* Emoji 图标容器美化 */
.feature-emoji {
  font-size: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  
  /* 渐变背景 */
  background: linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%);
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  
  /* 阴影让图标浮起来 */
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.12);
  transition: transform 0.4s ease;

  /* === 修复图标消失的关键代码 === */
  -webkit-text-fill-color: initial;
  background-clip: border-box;
}

.feature-card:hover .feature-emoji {
  transform: scale(1.1) rotate(6deg);
  background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
}

/* 描述文本 */
.card-desc { 
  font-size: 15px; 
  color: #64748b; /* 更舒适的阅读灰度 */
  line-height: 1.6; 
  margin-left: 62px; /* 与标题文字对齐，避开图标 */
}

/* =========================================
   图片展示区域 (Card Visual)
   ========================================= */
/* =========================================
   图片展示区域 (Card Visual) - 重点修改
   ========================================= */
.card-visual { 
  flex: 1; 
  /* 1. 修改背景：从纯白改为【灰蓝渐变】，强力衬托白底图片 */
  background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
  
  /* 2. 增加内阴影：让图片区域看起来像是凹进去的展示台 */
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.03);
  
  border-top: 1px solid #e2e8f0; /* 顶部增加分割线 */
  position: relative; 
  display: flex; 
  align-items: flex-end; 
  justify-content: center; 
  padding: 24px 36px 0; /* 稍微增加底部留白 */
  overflow: hidden; 
  min-height: 240px; 
}

/* 图片容器内的光晕（调整透明度，适配深色背景） */
.visual-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  /* 改为白色高光，增加质感 */
  background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.card-img { 
  width: 100%; 
  height: auto; 
  border-radius: 8px 8px 0 0; /* 稍微减小圆角，看起来更硬朗 */
  
  /* 3. 核心修改：增加“双层边框”效果 */
  /* 第一层：1px 深灰细线，勾勒轮廓 */
  /* 第二层：4px 半透明白边，模拟软件窗口/照片的白框 */
  border: 1px solid rgba(20, 30, 50, 0.08);
  outline: 4px solid rgba(255, 255, 255, 0.5);
  
  /* 4. 加深投影：让图片彻底“浮”起来 */
  box-shadow: 
    0 -10px 40px -5px rgba(0, 0, 0, 0.1), /* 大范围柔光 */
    0 -2px 10px -2px rgba(0, 0, 0, 0.05); /* 贴边阴影 */
  
  position: relative; 
  z-index: 1; 
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.5s ease;
  transform-origin: bottom center;
}

/* 悬停时的交互增强 */
.feature-card:hover .card-img {
  /* 上浮幅度加大 */
  transform: scale(1.02) translateY(-8px);
  /* 悬停时投影变蓝，增加科技感 */
  box-shadow: 
    0 -15px 40px -5px rgba(24, 144, 255, 0.15),
    0 -4px 12px -2px rgba(24, 144, 255, 0.1);
  border-color: rgba(24, 144, 255, 0.2);
}


/* 连接线 */
.connection-line-vertical.short {
  height: 40px; 
  margin-top: 40px; 
  width: 2px;
  background: linear-gradient(to bottom, rgba(24, 144, 255, 0.2), transparent);
}

/* =========================================
   响应式适配 (保持原有逻辑)
   ========================================= */
@media (max-width: 1200px) {
  .feature-grid { max-width: 100%; }
}

@media (max-width: 992px) {
  .feature-grid {
    grid-template-columns: 1fr;
    display: flex;
    flex-direction: column;
    padding: 0 20px;
  }
  
  .card-wide, .card-narrow { grid-column: span 1; }
  .card-desc { margin-left: 0; margin-top: 12px; }
  .card-visual { padding: 20px 20px 0; min-height: 200px; }
}
</style>