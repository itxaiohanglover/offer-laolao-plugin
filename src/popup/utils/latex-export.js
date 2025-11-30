// LaTeX 导出工具模块
// 将简历数据转换为 LaTeX 格式，支持在 Overleaf 上使用

/**
 * 转义 LaTeX 特殊字符
 * @param {string} text - 原始文本
 * @returns {string} 转义后的文本
 */
function escapeLatex(text) {
  if (!text || typeof text !== "string") return "";

  // LaTeX 特殊字符转义
  return text
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}")
    .replace(/</g, "\\textless{}")
    .replace(/>/g, "\\textgreater{}");
}

/**
 * 格式化日期显示
 * @param {string} dateStr - 日期字符串 (YYYY-MM-DD 格式)
 * @returns {string} 格式化后的日期
 */
function formatDateForLatex(dateStr) {
  if (!dateStr) return "";

  // 处理 YYYY-MM-DD 格式
  const parts = dateStr.split("-");
  if (parts.length >= 2) {
    const year = parts[0];
    const month = parts[1];
    return `${year}.${month}`;
  }
  return escapeLatex(dateStr);
}

/**
 * 从动态项数据中提取字段值
 * @param {object} itemData - 动态项数据对象
 * @param {string} fieldName - 字段名
 * @returns {string} 字段值
 */
function extractFieldValue(itemData, fieldName) {
  if (!itemData || typeof itemData !== "object") return "";

  // 直接匹配
  if (itemData[fieldName] !== undefined) {
    return itemData[fieldName] || "";
  }

  // 遍历查找包含字段名的键
  for (var key in itemData) {
    if (itemData.hasOwnProperty(key)) {
      // 匹配类似 education[0][school] 的格式
      if (key.includes("[" + fieldName + "]") || key.endsWith(fieldName)) {
        return itemData[key] || "";
      }
    }
  }

  return "";
}

/**
 * 生成 LaTeX 简历文档
 * @param {object} resumeData - 简历数据对象
 * @returns {string} LaTeX 文档内容
 */
function generateLatexResume(resumeData) {
  if (!resumeData || typeof resumeData !== "object") {
    console.error("Invalid resume data for LaTeX export");
    return "";
  }

  const personalInfo = resumeData.personalInfo || {};
  const education = resumeData.education || [];
  const workExperience = resumeData.workExperience || [];
  const projects = resumeData.projects || [];
  const skills = resumeData.skills || [];
  const languages = resumeData.languages || [];
  const customFields = resumeData.customFields || [];

  // 提取个人信息
  const name = escapeLatex(personalInfo.name || "姓名");
  const phone = escapeLatex(personalInfo.phone || "");
  const email = escapeLatex(personalInfo.email || "");
  const location = escapeLatex(personalInfo.location || "");
  const gender = escapeLatex(personalInfo.gender || "");
  const politicalStatus = escapeLatex(personalInfo["political-status"] || "");
  const expectedPosition = escapeLatex(personalInfo["expected-position"] || "");
  const expectedSalary = escapeLatex(personalInfo["expected-salary"] || "");
  const expectedLocation = escapeLatex(personalInfo["expected-location"] || "");
  const selfIntro = escapeLatex(personalInfo["self-intro"] || "");

  // 构建 LaTeX 文档
  let latex = `% ============================================
% 简历 LaTeX 模板
% 由简历自动填写助手生成
% 可直接在 Overleaf 上编译使用
% ============================================

\\documentclass[11pt,a4paper]{article}

% 页面设置
\\usepackage[top=1.5cm, bottom=1.5cm, left=2cm, right=2cm]{geometry}

% 中文支持
\\usepackage[UTF8]{ctex}

% 其他必要的包
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage{xcolor}
\\usepackage{hyperref}
\\usepackage{fontawesome5}
\\usepackage{tabularx}
\\usepackage{array}

% 颜色定义
\\definecolor{primary}{RGB}{0, 90, 156}
\\definecolor{secondary}{RGB}{64, 64, 64}
\\definecolor{accent}{RGB}{52, 152, 219}

% 超链接设置
\\hypersetup{
    colorlinks=true,
    linkcolor=primary,
    urlcolor=accent
}

% 段落设置
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0.5em}

% 节标题格式
\\titleformat{\\section}{\\Large\\bfseries\\color{primary}}{}{0em}{}[\\titlerule]
\\titlespacing{\\section}{0pt}{1em}{0.5em}

% 列表设置
\\setlist[itemize]{leftmargin=1.5em, itemsep=0.2em, topsep=0.3em}

% 自定义命令
\\newcommand{\\resumeSubheading}[4]{
    \\noindent
    \\begin{tabularx}{\\textwidth}{@{}X r@{}}
        \\textbf{#1} & \\textit{#2} \\\\
        \\textit{#3} & #4 \\\\
    \\end{tabularx}
    \\vspace{0.3em}
}

\\newcommand{\\resumeItem}[1]{
    \\item #1
}

\\newcommand{\\skillItem}[2]{
    \\textbf{#1}: #2
}

% ============================================
% 文档开始
% ============================================
\\begin{document}

% ============================================
% 个人信息区域
% ============================================
\\begin{center}
    {\\Huge\\bfseries\\color{primary} ${name}}
    
    \\vspace{0.5em}
    
`;

  // 添加联系信息行
  const contactItems = [];
  if (phone) contactItems.push(`\\faPhone\\ ${phone}`);
  if (email)
    contactItems.push(`\\faEnvelope\\ \\href{mailto:${email}}{${email}}`);
  if (location) contactItems.push(`\\faMapMarker*\\ ${location}`);

  if (contactItems.length > 0) {
    latex += `    ${contactItems.join(" \\quad | \\quad ")}\n`;
  }

  // 添加其他个人信息
  const extraInfo = [];
  if (gender) extraInfo.push(`性别: ${gender}`);
  if (politicalStatus) extraInfo.push(`政治面貌: ${politicalStatus}`);

  if (extraInfo.length > 0) {
    latex += `    
    \\vspace{0.3em}
    
    ${extraInfo.join(" \\quad | \\quad ")}
`;
  }

  latex += `\\end{center}

\\vspace{0.5em}

`;

  // ============================================
  // 求职期望
  // ============================================
  if (expectedPosition || expectedSalary || expectedLocation) {
    latex += `% ============================================
% 求职期望
% ============================================
\\section{求职期望}

\\begin{tabularx}{\\textwidth}{@{}X X X@{}}
`;
    if (expectedPosition)
      latex += `    \\textbf{期望职位:} ${expectedPosition}`;
    if (expectedSalary) latex += ` & \\textbf{期望薪资:} ${expectedSalary}`;
    if (expectedLocation) latex += ` & \\textbf{期望地点:} ${expectedLocation}`;
    latex += ` \\\\
\\end{tabularx}

\\vspace{0.5em}

`;
  }

  // ============================================
  // 教育经历
  // ============================================
  if (education.length > 0) {
    latex += `% ============================================
% 教育经历
% ============================================
\\section{教育经历}

`;
    education.forEach(function (edu) {
      const school = escapeLatex(extractFieldValue(edu, "school"));
      const major = escapeLatex(extractFieldValue(edu, "major"));
      const degree = escapeLatex(extractFieldValue(edu, "degree"));
      const rank = escapeLatex(extractFieldValue(edu, "rank"));
      const startDate = formatDateForLatex(
        extractFieldValue(edu, "start-date")
      );
      const endDate = formatDateForLatex(extractFieldValue(edu, "end-date"));

      const dateRange =
        startDate && endDate
          ? `${startDate} -- ${endDate}`
          : startDate || endDate || "";
      const degreeAndMajor = [degree, major].filter(Boolean).join(" · ");

      latex += `\\resumeSubheading
    {${school || "学校名称"}}
    {${dateRange}}
    {${degreeAndMajor}}
    {${rank ? "排名: " + rank : ""}}

`;
    });
  }

  // ============================================
  // 工作/实习经历
  // ============================================
  if (workExperience.length > 0) {
    latex += `% ============================================
% 工作/实习经历
% ============================================
\\section{工作/实习经历}

`;
    workExperience.forEach(function (work) {
      const company = escapeLatex(extractFieldValue(work, "company"));
      const position = escapeLatex(extractFieldValue(work, "position"));
      const startDate = formatDateForLatex(
        extractFieldValue(work, "start-date")
      );
      const endDate = formatDateForLatex(extractFieldValue(work, "end-date"));
      const description = escapeLatex(extractFieldValue(work, "description"));

      const dateRange =
        startDate && endDate
          ? `${startDate} -- ${endDate}`
          : startDate || endDate || "";

      latex += `\\resumeSubheading
    {${company || "公司名称"}}
    {${dateRange}}
    {${position || "职位"}}
    {}

`;
      if (description) {
        // 将描述分割成多行
        const descLines = description
          .split(/[;；。\n]+/)
          .filter(function (line) {
            return line.trim();
          });

        if (descLines.length > 0) {
          latex += `\\begin{itemize}
`;
          descLines.forEach(function (line) {
            latex += `    \\resumeItem{${escapeLatex(line.trim())}}
`;
          });
          latex += `\\end{itemize}

`;
        }
      }
    });
  }

  // ============================================
  // 项目经历
  // ============================================
  if (projects.length > 0) {
    latex += `% ============================================
% 项目经历
% ============================================
\\section{项目经历}

`;
    projects.forEach(function (project) {
      const projectName = escapeLatex(
        extractFieldValue(project, "project-name")
      );
      const role = escapeLatex(extractFieldValue(project, "role"));
      const projectTime = escapeLatex(
        extractFieldValue(project, "project-time")
      );
      const projectDesc = escapeLatex(
        extractFieldValue(project, "project-desc")
      );
      const responsibilities = escapeLatex(
        extractFieldValue(project, "responsibilities")
      );

      latex += `\\resumeSubheading
    {${projectName || "项目名称"}}
    {${projectTime}}
    {${role || "角色"}}
    {}

`;
      // 项目描述
      if (projectDesc) {
        latex += `\\textbf{项目描述:} ${projectDesc}

`;
      }

      // 职责描述
      if (responsibilities) {
        const respLines = responsibilities
          .split(/[;；。\n]+/)
          .filter(function (line) {
            return line.trim();
          });

        if (respLines.length > 0) {
          latex += `\\textbf{主要职责:}
\\begin{itemize}
`;
          respLines.forEach(function (line) {
            latex += `    \\resumeItem{${escapeLatex(line.trim())}}
`;
          });
          latex += `\\end{itemize}

`;
        }
      }
    });
  }

  // ============================================
  // 技能信息
  // ============================================
  if (skills.length > 0) {
    // 先收集有效的技能条目
    const skillItems = [];
    skills.forEach(function (skill) {
      const skillName = escapeLatex(extractFieldValue(skill, "name"));
      const level = escapeLatex(extractFieldValue(skill, "level"));

      if (skillName) {
        skillItems.push(
          `    \\item \\skillItem{${skillName}}{${level || "熟练"}}`
        );
      }
    });

    // 只有在有有效条目时才生成列表
    if (skillItems.length > 0) {
      latex += `% ============================================
% 技能信息
% ============================================
\\section{专业技能}

\\begin{itemize}
${skillItems.join("\n")}
\\end{itemize}

`;
    }
  }

  // ============================================
  // 语言能力
  // ============================================
  if (languages.length > 0) {
    // 先收集有效的语言条目
    const langItems = [];
    languages.forEach(function (lang) {
      const langName = escapeLatex(extractFieldValue(lang, "name"));
      const proficiency = escapeLatex(extractFieldValue(lang, "proficiency"));
      const certificate = escapeLatex(extractFieldValue(lang, "certificate"));

      if (langName) {
        let langStr = `\\skillItem{${langName}}{${proficiency || ""}}`;
        if (certificate) {
          langStr += ` (${certificate})`;
        }
        langItems.push(`    \\item ${langStr}`);
      }
    });

    // 只有在有有效条目时才生成列表
    if (langItems.length > 0) {
      latex += `% ============================================
% 语言能力
% ============================================
\\section{语言能力}

\\begin{itemize}
${langItems.join("\n")}
\\end{itemize}

`;
    }
  }

  // ============================================
  // 自定义字段
  // ============================================
  if (customFields.length > 0) {
    customFields.forEach(function (field) {
      const fieldName = escapeLatex(extractFieldValue(field, "name"));
      const fieldContent = escapeLatex(extractFieldValue(field, "content"));

      if (fieldName && fieldContent) {
        latex += `% ============================================
% ${fieldName}
% ============================================
\\section{${fieldName}}

${fieldContent}

`;
      }
    });
  }

  // ============================================
  // 自我描述
  // ============================================
  if (selfIntro) {
    latex += `% ============================================
% 自我描述
% ============================================
\\section{自我描述}

${selfIntro}

`;
  }

  // 文档结束
  latex += `% ============================================
% 文档结束
% ============================================
\\end{document}
`;

  return latex;
}

/**
 * 导出简历为 LaTeX 文件
 * @param {object} resumeData - 简历数据对象
 * @param {string} filename - 文件名（可选）
 */
function exportResumeToLatex(resumeData, filename) {
  try {
    const latexContent = generateLatexResume(resumeData);

    if (!latexContent) {
      if (typeof showNotification === "function") {
        showNotification("生成 LaTeX 文档失败", "error");
      }
      return false;
    }

    // 创建 Blob 并下载
    const blob = new Blob([latexContent], {
      type: "application/x-latex;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download =
      filename || "resume_" + new Date().toISOString().slice(0, 10) + ".tex";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (typeof showNotification === "function") {
      showNotification("LaTeX 简历已导出，可在 Overleaf 上打开", "success");
    }

    return true;
  } catch (error) {
    console.error("Error exporting LaTeX resume:", error);
    if (typeof showNotification === "function") {
      showNotification("导出 LaTeX 失败: " + error.message, "error");
    }
    return false;
  }
}

// 绑定到全局作用域
if (typeof window !== "undefined") {
  window.generateLatexResume = generateLatexResume;
  window.exportResumeToLatex = exportResumeToLatex;
  window.escapeLatex = escapeLatex;
}

// 导出函数（Node.js 环境）
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    generateLatexResume,
    exportResumeToLatex,
    escapeLatex,
  };
}
