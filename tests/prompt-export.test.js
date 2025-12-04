const assert = require('assert');
const path = require('path');
const prompt = require(path.join(__dirname, '..', 'src', 'popup', 'utils', 'prompt-export.js'));

function sampleData() {
  return {
    personalInfo: {
      name: '张三',
      gender: '男',
      'birth-date': '1998-05-12',
      phone: '13800000000',
      email: 'zhangsan@example.com',
      location: '北京',
      'expected-position': '前端工程师',
      'expected-industry': '互联网',
      'expected-location': '北京',
      'self-intro': '热爱前端开发，关注性能与用户体验。'
    },
    workExperience: [
      { company: '某科技公司', position: '前端实习生', 'start-date': '2020-07-01', 'end-date': '2020-12-31', description: '参与组件开发' }
    ],
    projects: [
      { 'project-name': '电商前台重构', role: '核心开发者', 'project-desc': '提升性能与转化' }
    ],
    skills: [
      { name: 'JavaScript' },
      { name: 'React' },
      { name: 'CSS' }
    ]
  };
}

function run() {
  const data = sampleData();
  const md = prompt.generatePromptContent(data, 'md');
  const txt = prompt.generatePromptContent(data, 'txt');

  assert(md.includes('张三'));
  assert(md.includes('个人基本信息提示'));
  assert(md.includes('工作经历提问模板'));
  assert(md.includes('项目经验询问框架'));
  assert(md.includes('技能评估引导词'));

  assert(txt.includes('张三'));
  assert(txt.includes('个人基本信息提示'));
  assert(txt.includes('工作经历提问模板'));
  assert(txt.includes('项目经验询问框架'));
  assert(txt.includes('技能评估引导词'));

  console.log('All prompt-export tests passed');
}

run();
