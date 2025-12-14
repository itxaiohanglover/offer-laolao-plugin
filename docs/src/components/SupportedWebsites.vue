<script setup>
// 支持的招聘网站数据
const websites = [
  { name: '智联招聘', icon: '🏢', desc: '支持职位搜索、简历投递、在线测评' },
  { name: '前程无忧', icon: '💼', desc: '支持简历上传、在线编辑、自动投递' },
  { name: 'BOSS直聘', icon: '👔', desc: '支持在线沟通、职位搜索、简历管理' },
  { name: '拉勾网', icon: '📊', desc: '支持互联网职位、简历投递、在线面试' },
  { name: '脉脉', icon: '🤝', desc: '支持职场社交、职位发现、人脉拓展' },
  { name: '实习僧', icon: '🎓', desc: '支持实习岗位、校园招聘、兼职信息' }
]
</script>

<template>
  <section class="section-block supported-websites-section">
    <div class="node-icon">
      <div class="node-dot"></div>
    </div>
    
    <div class="section-header">
       <h2 class="section-title">广泛的平台支持</h2>
       <p class="section-subtitle">兼容主流招聘网站，一键填写无障碍</p>
    </div>

    <div class="websites-container">
      <div class="website-card-wrapper" v-for="(website, index) in websites" :key="index">
        <div class="website-card">
          <div class="website-icon">{{ website.icon }}</div>
          <h3 class="website-name">{{ website.name }}</h3>
          <p class="website-desc">{{ website.desc }}</p>
        </div>
      </div>
    </div>
    
    <div class="connection-line-vertical short"></div>
  </section>
</template>

<style scoped>
/* 统一的section样式 - 白色背景，只保留蓝色系特效 */
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

.node-icon:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 24px rgba(24, 144, 255, 0.3);
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
  color: #6b7280;
  line-height: 1.6;
  background: linear-gradient(135deg, #4b5563, #6b7280);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 现代化的网站卡片容器 */
.websites-container {
  width: 100%;
  max-width: 1200px;
  margin-bottom: 40px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
}

/* 卡片包装器 */
.website-card-wrapper {
  flex: 0 0 calc(33.333% - 16px);
  max-width: calc(33.333% - 16px);
}

/* 现代化网站卡片设计 - 白色背景，只保留蓝色系特效 */
.website-card {
  background: #fff;
  border-radius: 16px;
  padding: 28px 20px;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  border: 1px solid rgba(24, 144, 255, 0.1);
  overflow: hidden;
}

/* 卡片顶部装饰条 - 蓝色渐变 */
.website-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #1890ff, #36cfc9);
  border-radius: 1.5px 1.5px 0 0;
}

/* 悬停效果 - 蓝色阴影 */
.website-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(24, 144, 255, 0.15);
  border-color: rgba(24, 144, 255, 0.2);
}

/* 网站图标 - 蓝色渐变背景 */
.website-icon {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #e6f7ff, #f0f9ff);
  border-radius: 50%;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.15);
  position: relative;
  z-index: 1;
  border: 3px solid rgba(255, 255, 255, 0.8);
}

/* 悬停时图标效果 - 蓝色变换 */
.website-card:hover .website-icon {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 8px 24px rgba(24, 144, 255, 0.25);
  background: linear-gradient(135deg, #f0f9ff, #e6f7ff);
}

/* 网站名称 - 彩色渐变文字 */
.website-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #1f2937, #4b5563, #6b7280);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.website-card:hover .website-name {
  background: linear-gradient(135deg, #1890ff, #36cfc9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transform: translateY(-2px);
}

/* 网站描述 - 深灰色文字 */
.website-desc {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  line-height: 1.6;
  position: relative;
  z-index: 1;
  transition: color 0.3s ease;
}

.website-card:hover .website-desc {
  color: #4b5563;
}

/* 垂直连接线 - 作为section之间的分界 - 彩色渐变 */
.connection-line-vertical.short {
  height: 60px;
  margin-top: 40px;
  margin-bottom: 0;
  background: linear-gradient(to bottom, rgba(24, 144, 255, 0.3), rgba(54, 207, 201, 0.2), rgba(114, 46, 209, 0.1), rgba(255, 255, 255, 0));
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
  background: linear-gradient(135deg, #1890ff, #36cfc9);
  box-shadow: 0 0 20px rgba(24, 144, 255, 0.4), 0 0 10px rgba(54, 207, 201, 0.3);
  border: 4px solid rgba(255, 255, 255, 0.9);
}



/* 响应式设计 */
@media (max-width: 1200px) {
  .websites-container {
    max-width: 90%;
  }
}

@media (max-width: 992px) {
  .website-card-wrapper {
    flex: 0 0 calc(50% - 12px);
    max-width: calc(50% - 12px);
  }
  
  /* 调整section样式 */
  .section-block {
    margin-bottom: 60px;
    padding: 40px 20px;
  }
}

@media (max-width: 768px) {
  .website-card-wrapper {
    flex: 0 0 100%;
    max-width: 100%;
  }
  
  .website-card {
    padding: 24px 16px;
  }
  
  .website-icon {
    width: 64px;
    height: 64px;
    font-size: 28px;
    margin-bottom: 16px;
  }
  
  .website-name {
    font-size: 16px;
  }
  
  .website-desc {
    font-size: 13px;
  }
}
</style>