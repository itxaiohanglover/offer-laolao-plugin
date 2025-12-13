/**
 * 字段配置
 * 集中管理所有表单字段配置
 */
(function(global) {
  'use strict';

  const FieldConfig = {
    // 基本信息字段配置
    basic: [
      { id: 'name', label: '姓名', type: 'text', required: true, placeholder: '请输入姓名' },
      { id: 'gender', label: '性别', type: 'select', options: ['', '男', '女'], placeholder: '请选择' },
      { id: 'birth-date', label: '出生日期', type: 'date' },
      { id: 'phone', label: '手机号码', type: 'tel', required: true, placeholder: '请输入手机号码' },
      { id: 'email', label: '电子邮箱', type: 'email', required: true, placeholder: '请输入电子邮箱' },
      { id: 'id-card', label: '身份证号', type: 'text', placeholder: '请输入身份证号' },
      { id: 'location', label: '所在地', type: 'text', placeholder: '请输入所在地' },
      { id: 'political-status', label: '政治面貌', type: 'select', options: ['', '群众', '团员', '党员'], placeholder: '请选择' }
    ],

    // 求职期望字段配置
    jobExpectation: [
      { id: 'expected-position', label: '期望职位', type: 'text', placeholder: '请输入期望职位' },
      { id: 'expected-industry', label: '期望行业', type: 'text', placeholder: '请输入期望行业' },
      { id: 'expected-salary', label: '期望薪资', type: 'text', placeholder: '请输入期望薪资' },
      { id: 'expected-location', label: '期望地点', type: 'text', placeholder: '请输入期望地点' },
      { id: 'internship-duration', label: '实习时长', type: 'text', placeholder: '请输入实习时长', hidden: true },
      { id: 'available-time', label: '可工作时间', type: 'text', placeholder: '请输入可工作时间', hidden: true }
    ],

    // 动态项字段配置
    dynamic: {
      skill: {
        listId: 'skills-list',
        addButtonId: 'add-skill',
        fields: [
          { name: 'name', label: '技能名称', type: 'text', placeholder: '请输入技能名称' },
          { name: 'level', label: '技能水平', type: 'select', options: ['', '初级', '中级', '高级', '专家'], placeholder: '请选择' }
        ],
        minItems: 1
      },
      education: {
        listId: 'education-list',
        addButtonId: 'add-education',
        fields: [
          { name: 'school', label: '学校名称', type: 'text', placeholder: '请输入学校名称' },
          { name: 'major', label: '专业', type: 'text', placeholder: '请输入专业' },
          { name: 'degree', label: '学历', type: 'select', options: ['', '专科', '本科', '硕士', '博士'], placeholder: '请选择' },
          { name: 'rank', label: '排名', type: 'text', placeholder: '请输入排名（如：前5%）' },
          { name: 'start-date', label: '入学时间', type: 'date' },
          { name: 'end-date', label: '毕业时间', type: 'date' }
        ],
        minItems: 1
      },
      workExperience: {
        listId: 'internship-list',
        addButtonId: 'add-internship',
        fields: [
          { name: 'company', label: '公司名称', type: 'text', placeholder: '请输入公司名称' },
          { name: 'position', label: '职位', type: 'text', placeholder: '请输入职位' },
          { name: 'start-date', label: '开始时间', type: 'date' },
          { name: 'end-date', label: '结束时间', type: 'date' },
          { name: 'description', label: '工作描述', type: 'textarea', placeholder: '请输入工作描述' }
        ],
        minItems: 1
      },
      project: {
        listId: 'project-list',
        addButtonId: 'add-project',
        fields: [
          { name: 'project-name', label: '项目名称', type: 'text', placeholder: '请输入项目名称' },
          { name: 'role', label: '担任角色', type: 'text', placeholder: '请输入担任角色' },
          { name: 'project-time', label: '项目时间', type: 'text', placeholder: '请输入项目时间' },
          { name: 'project-desc', label: '项目描述', type: 'textarea', placeholder: '请输入项目描述' },
          { name: 'responsibilities', label: '职责描述', type: 'textarea', placeholder: '请输入职责描述' }
        ],
        minItems: 0
      },
      language: {
        listId: 'language-list',
        addButtonId: 'add-language',
        fields: [
          { name: 'name', label: '语言名称', type: 'text', placeholder: '请输入语言名称（如：英语、日语）' },
          { name: 'proficiency', label: '掌握程度', type: 'select', options: ['', '入门', '基础', '熟练', '精通'], placeholder: '请选择' },
          { name: 'certificate', label: '证书', type: 'text', placeholder: '请输入证书名称（如：大学英语六级）' },
          { name: 'certificate-file', label: '证书文件', type: 'file', accept: '.pdf,.jpg,.png' }
        ],
        minItems: 0
      },
      customField: {
        listId: 'custom-field-list',
        addButtonId: 'add-custom-field',
        fields: [
          { name: 'name', label: '字段名称', type: 'text', placeholder: '请输入字段名称' },
          { name: 'content', label: '字段内容', type: 'textarea', placeholder: '请输入字段内容' }
        ],
        minItems: 0
      }
    },

    // 字段级填充配置
    fieldFill: [
      { id: 'name', label: '姓名' },
      { id: 'gender', label: '性别' },
      { id: 'birth-date', label: '出生日期' },
      { id: 'phone', label: '手机号码' },
      { id: 'email', label: '电子邮箱' },
      { id: 'id-card', label: '身份证号' },
      { id: 'location', label: '所在地' },
      { id: 'political-status', label: '政治面貌' },
      { id: 'expected-position', label: '期望职位' },
      { id: 'expected-industry', label: '期望行业' },
      { id: 'expected-salary', label: '期望薪资' },
      { id: 'expected-location', label: '期望地点' },
      { id: 'internship-duration', label: '实习周期' },
      { id: 'available-time', label: '到岗时间' },
      { id: 'self-intro', label: '自我介绍' }
    ],

    // 字段名到标签的映射（用于动态项）
    fieldLabelMap: {
      school: '学校',
      major: '专业',
      degree: '学历',
      rank: '排名',
      'start-date': '开始时间',
      'end-date': '结束时间',
      company: '公司',
      position: '职位',
      description: '描述',
      'project-name': '项目名称',
      role: '角色',
      'project-time': '项目时间',
      'project-desc': '项目描述',
      responsibilities: '职责',
      name: '名称',
      level: '水平',
      proficiency: '掌握程度',
      certificate: '证书'
    }
  };

  // 导出
  if (typeof window !== 'undefined' && window.OfferLaolao) {
    window.OfferLaolao.Config = window.OfferLaolao.Config || {};
    window.OfferLaolao.Config.FieldConfig = FieldConfig;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = FieldConfig;
  }
})(typeof window !== 'undefined' ? window : this);

