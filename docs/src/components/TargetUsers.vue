<script setup>
// 面向人群数据
const targetUsers = [
  {
    role: '求职者',
    icon: '👨‍💼',
    painPoints: [
      '投递多个职位时需要手动修改简历内容',
      '无法快速定位招聘网站上的职位要求',
      '简历投递历史难以追踪和管理',
      '无法实时了解简历与职位的匹配度'
    ],
    solutions: [
      '一键提取职位要求，智能匹配简历内容',
      '快速高亮关键技能，优化简历重点',
      '自动记录投递历史，便于跟踪管理',
      '实时生成简历匹配度报告和优化建议'
    ]
  },
  {
    role: '学生',
    icon: '🎓',
    painPoints: [
      '缺乏简历制作经验，不知如何突出优势',
      '实习机会众多，难以针对性准备简历',
      '对行业要求了解不足，简历内容把握不准',
      '简历版本管理混乱，不易追踪修改历史'
    ],
    solutions: [
      '提供学生专属简历模板和指导',
      '针对不同实习岗位智能调整简历内容',
      '分析目标行业要求，提供个性化建议',
      '版本管理功能，方便追踪和对比修改'
    ]
  }
]
</script>

<template>
  <section class="section-block target-users-section">
    <div class="node-icon">
      <div class="node-dot"></div>
    </div>
    
    <div class="section-header">
       <h2 class="section-title">面向人群</h2>
       <p class="section-subtitle">为不同用户群体提供量身定制的简历管理解决方案</p>
    </div>

    <div class="target-users-container">
      <!-- 用户卡片 -->
      <div class="user-profile-card" v-for="(user, index) in targetUsers" :key="index">
        <div class="profile-header">
          <div class="profile-icon">{{ user.icon }}</div>
          <h3 class="profile-title">{{ user.role }}</h3>
        </div>
        <div class="profile-content">
          <div class="pain-points">
            <h4 class="subsection-title">痛点问题</h4>
            <ul class="pain-point-list">
              <li v-for="(point, i) in user.painPoints" :key="i">
                <span class="pain-point-icon">✗</span> {{ point }}
              </li>
            </ul>
          </div>
          <div class="solutions">
            <h4 class="subsection-title">我们的解决方案</h4>
            <ul class="solution-list">
              <li v-for="(solution, i) in user.solutions" :key="i">
                <span class="solution-icon">✓</span> {{ solution }}
              </li>
            </ul>
          </div>
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
  /* 移除overflow: hidden，避免节点图标被裁剪 */
  /* overflow: hidden; */
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

/* 垂直连接线 */
.connection-line-vertical.short {
  height: 40px; 
  margin-top: 0; 
  margin-bottom: 40px; 
  background: rgba(24, 144, 255, 0.2); 
}



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
</style>