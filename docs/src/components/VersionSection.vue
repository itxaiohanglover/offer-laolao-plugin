<script setup>
import { Card } from 'ant-design-vue'

// 版本数据
const versions = [
  {
    version: '1.0.0',
    date: '2025-11-30',
    features: ['支持更多招聘网站', '优化自动填写算法']
  }
]
</script>

<template>
  <section class="section-block version-section">
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
  /* 移除overflow: hidden，避免节点图标被裁剪 */
  /* overflow: hidden; */
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

.section-header.small {
  margin-bottom: 24px;
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

.section-header.small .section-title {
  font-size: 24px;
  margin-bottom: 0;
  background: linear-gradient(135deg, #1890ff, #36cfc9); 
  -webkit-background-clip: text; 
  -webkit-text-fill-color: transparent; 
  background-clip: text; 
}

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
  background: #fff;
  border-radius: 16px;
  margin-bottom: 24px;
  border: 1px solid rgba(24, 144, 255, 0.1);
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

.stat-box strong {
  display: block;
  font-size: 28px;
  color: #1890ff;
  margin-bottom: 4px;
}

.stat-box span {
  font-size: 13px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-divider {
  width: 1px;
  height: 30px;
  background: rgba(0,0,0,0.05);
}

.version-list {
  padding: 0 20px 20px;
}

.v-item {
  padding-bottom: 20px;
  border-bottom: 1px dashed rgba(0,0,0,0.06);
  margin-bottom: 20px;
}

.v-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.v-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.v-tag {
  background: #eee;
  color: #555;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  font-family: monospace;
}

.v-tag.v-latest {
  background: rgba(24,144,255,0.1);
  color: #1890ff;
}

.v-date {
  color: #999;
  font-size: 13px;
}

.v-features {
  padding-left: 20px;
  margin: 0;
  color: #555;
  font-size: 14px;
}

.v-features li {
  margin-bottom: 6px;
}



/* 响应式设计 */
@media (max-width: 768px) {
  .stats-row {
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }
  
  .stat-divider {
    width: 100%;
    height: 1px;
  }
  
  .stat-box {
    width: 100%;
    max-width: 200px;
  }
}
</style>