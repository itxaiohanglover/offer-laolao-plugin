/**
 * 导出工具模块
 * 将简历数据导出为 JSON 和 LaTeX 格式
 */

import type { ResumeData } from "~types/resume"

// ============================================
// LaTeX 特殊字符转义
// ============================================

/**
 * 转义 LaTeX 特殊字符
 */
export function escapeLatex(text: string | undefined | null): string {
  if (!text || typeof text !== "string") return ""

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
    .replace(/>/g, "\\textgreater{}")
}

/**
 * 格式化日期显示
 * @param dateStr - 日期字符串 (YYYY-MM-DD 格式)
 * @returns 格式化后的日期 (YYYY.MM)
 */
function formatDateForLatex(dateStr: string | undefined | null): string {
  if (!dateStr) return ""

  const parts = dateStr.split("-")
  if (parts.length >= 2) {
    const year = parts[0]
    const month = parts[1]
    return `${year}.${month}`
  }
  return escapeLatex(dateStr)
}

// ============================================
// LaTeX 文档生成
// ============================================

/**
 * 生成 LaTeX 简历文档
 */
export function generateLatexResume(resumeData: ResumeData): string {
  if (!resumeData || typeof resumeData !== "object") {
    console.error("Invalid resume data for LaTeX export")
    return ""
  }

  const { personalInfo, jobExpectation, selfIntro, education, workExperience, projects, skills, languages, customFields } = resumeData

  // 提取个人信息
  const name = escapeLatex(personalInfo.name || "姓名")
  const phone = escapeLatex(personalInfo.phone || "")
  const email = escapeLatex(personalInfo.email || "")
  const location = escapeLatex(personalInfo.location || "")
  const gender = escapeLatex(personalInfo.gender || "")
  const politicalStatus = escapeLatex(personalInfo.politicalStatus || "")
  
  // 求职期望
  const expectedPosition = escapeLatex(jobExpectation.expectedPosition || "")
  const expectedSalary = escapeLatex(jobExpectation.expectedSalary || "")
  const expectedLocation = escapeLatex(jobExpectation.expectedLocation || "")
  
  // 自我介绍
  const selfIntroText = escapeLatex(selfIntro || "")

  // 构建 LaTeX 文档
  let latex = `% ============================================
% 简历 LaTeX 模板
% 由 Offer 捞捞 - 简历自动填写助手生成
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
    
`

  // 添加联系信息行
  const contactItems: string[] = []
  if (phone) contactItems.push(`\\faPhone\\ ${phone}`)
  if (email) contactItems.push(`\\faEnvelope\\ \\href{mailto:${email}}{${email}}`)
  if (location) contactItems.push(`\\faMapMarker*\\ ${location}`)

  if (contactItems.length > 0) {
    latex += `    ${contactItems.join(" \\quad | \\quad ")}\n`
  }

  // 添加其他个人信息
  const extraInfo: string[] = []
  if (gender) extraInfo.push(`性别: ${gender}`)
  if (politicalStatus) extraInfo.push(`政治面貌: ${politicalStatus}`)

  if (extraInfo.length > 0) {
    latex += `    
    \\vspace{0.3em}
    
    ${extraInfo.join(" \\quad | \\quad ")}
`
  }

  latex += `\\end{center}

\\vspace{0.5em}

`

  // ============================================
  // 求职期望
  // ============================================
  if (expectedPosition || expectedSalary || expectedLocation) {
    latex += `% ============================================
% 求职期望
% ============================================
\\section{求职期望}

\\begin{tabularx}{\\textwidth}{@{}X X X@{}}
`
    if (expectedPosition) latex += `    \\textbf{期望职位:} ${expectedPosition}`
    if (expectedSalary) latex += ` & \\textbf{期望薪资:} ${expectedSalary}`
    if (expectedLocation) latex += ` & \\textbf{期望地点:} ${expectedLocation}`
    latex += ` \\\\
\\end{tabularx}

\\vspace{0.5em}

`
  }

  // ============================================
  // 教育经历
  // ============================================
  if (education && education.length > 0) {
    latex += `% ============================================
% 教育经历
% ============================================
\\section{教育经历}

`
    education.forEach((edu) => {
      const school = escapeLatex(edu.school)
      const major = escapeLatex(edu.major)
      const degree = escapeLatex(edu.degree)
      const rank = escapeLatex(edu.rank)
      const startDate = formatDateForLatex(edu.startDate)
      const endDate = formatDateForLatex(edu.endDate)

      const dateRange = startDate && endDate
        ? `${startDate} -- ${endDate}`
        : startDate || endDate || ""
      const degreeAndMajor = [degree, major].filter(Boolean).join(" · ")

      latex += `\\resumeSubheading
    {${school || "学校名称"}}
    {${dateRange}}
    {${degreeAndMajor}}
    {${rank ? "排名: " + rank : ""}}

`
    })
  }

  // ============================================
  // 工作/实习经历
  // ============================================
  if (workExperience && workExperience.length > 0) {
    latex += `% ============================================
% 工作/实习经历
% ============================================
\\section{工作/实习经历}

`
    workExperience.forEach((work) => {
      const company = escapeLatex(work.company)
      const position = escapeLatex(work.position)
      const startDate = formatDateForLatex(work.startDate)
      const endDate = formatDateForLatex(work.endDate)
      const description = escapeLatex(work.description)

      const dateRange = startDate && endDate
        ? `${startDate} -- ${endDate}`
        : startDate || endDate || ""

      latex += `\\resumeSubheading
    {${company || "公司名称"}}
    {${dateRange}}
    {${position || "职位"}}
    {}

`
      if (description) {
        // 将描述分割成多行
        const descLines = description
          .split(/[;；。\n]+/)
          .filter((line) => line.trim())

        if (descLines.length > 0) {
          latex += `\\begin{itemize}
`
          descLines.forEach((line) => {
            latex += `    \\resumeItem{${escapeLatex(line.trim())}}
`
          })
          latex += `\\end{itemize}

`
        }
      }
    })
  }

  // ============================================
  // 项目经历
  // ============================================
  if (projects && projects.length > 0) {
    latex += `% ============================================
% 项目经历
% ============================================
\\section{项目经历}

`
    projects.forEach((project) => {
      const projectName = escapeLatex(project.projectName)
      const role = escapeLatex(project.role)
      const projectTime = escapeLatex(project.projectTime)
      const projectDesc = escapeLatex(project.projectDesc)
      const responsibilities = escapeLatex(project.responsibilities)

      latex += `\\resumeSubheading
    {${projectName || "项目名称"}}
    {${projectTime}}
    {${role || "角色"}}
    {}

`
      // 项目描述
      if (projectDesc) {
        latex += `\\textbf{项目描述:} ${projectDesc}

`
      }

      // 职责描述
      if (responsibilities) {
        const respLines = responsibilities
          .split(/[;；。\n]+/)
          .filter((line) => line.trim())

        if (respLines.length > 0) {
          latex += `\\textbf{主要职责:}
\\begin{itemize}
`
          respLines.forEach((line) => {
            latex += `    \\resumeItem{${escapeLatex(line.trim())}}
`
          })
          latex += `\\end{itemize}

`
        }
      }
    })
  }

  // ============================================
  // 技能信息
  // ============================================
  if (skills && skills.length > 0) {
    // 先收集有效的技能条目
    const skillItems: string[] = []
    skills.forEach((skill) => {
      const skillName = escapeLatex(skill.name)
      const level = escapeLatex(skill.level)

      if (skillName) {
        skillItems.push(`    \\item \\skillItem{${skillName}}{${level || "熟练"}}`)
      }
    })

    // 只有在有有效条目时才生成列表
    if (skillItems.length > 0) {
      latex += `% ============================================
% 技能信息
% ============================================
\\section{专业技能}

\\begin{itemize}
${skillItems.join("\n")}
\\end{itemize}

`
    }
  }

  // ============================================
  // 语言能力
  // ============================================
  if (languages && languages.length > 0) {
    // 先收集有效的语言条目
    const langItems: string[] = []
    languages.forEach((lang) => {
      const langName = escapeLatex(lang.name)
      const proficiency = escapeLatex(lang.proficiency)
      const certificate = escapeLatex(lang.certificate)

      if (langName) {
        let langStr = `\\skillItem{${langName}}{${proficiency || ""}}`
        if (certificate) {
          langStr += ` (${certificate})`
        }
        langItems.push(`    \\item ${langStr}`)
      }
    })

    // 只有在有有效条目时才生成列表
    if (langItems.length > 0) {
      latex += `% ============================================
% 语言能力
% ============================================
\\section{语言能力}

\\begin{itemize}
${langItems.join("\n")}
\\end{itemize}

`
    }
  }

  // ============================================
  // 自定义字段
  // ============================================
  if (customFields && customFields.length > 0) {
    customFields.forEach((field) => {
      const fieldName = escapeLatex(field.name)
      const fieldContent = escapeLatex(field.content)

      if (fieldName && fieldContent) {
        latex += `% ============================================
% ${fieldName}
% ============================================
\\section{${fieldName}}

${fieldContent}

`
      }
    })
  }

  // ============================================
  // 自我描述
  // ============================================
  if (selfIntroText) {
    latex += `% ============================================
% 自我描述
% ============================================
\\section{自我描述}

${selfIntroText}

`
  }

  // 文档结束
  latex += `% ============================================
% 文档结束
% ============================================
\\end{document}
`

  return latex
}

// ============================================
// 文件下载工具
// ============================================

/**
 * 下载文件
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * 获取当前日期字符串 (YYYY-MM-DD)
 */
function getCurrentDateString(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

/**
 * 清理文件名中的非法字符
 */
function sanitizeFilename(name: string): string {
  return (name || "未命名用户")
    .replace(/[\\/:*?"<>|\n\r]+/g, "_")
    .trim() || "未命名用户"
}

// ============================================
// 导出功能
// ============================================

/**
 * 导出简历为 JSON 格式
 * 用于数据备份和导入
 */
export function exportAsJSON(resumeData: ResumeData): boolean {
  try {
    const jsonStr = JSON.stringify(resumeData, null, 2)
    const dateStr = getCurrentDateString()
    const filename = `resume_data_${dateStr}.json`
    
    downloadFile(jsonStr, filename, "application/json;charset=utf-8")
    return true
  } catch (error) {
    console.error("Error exporting JSON:", error)
    return false
  }
}

/**
 * 导出简历为 LaTeX 格式
 * 可在 Overleaf 上直接打开编译
 */
export function exportAsLatex(resumeData: ResumeData): boolean {
  try {
    const latexContent = generateLatexResume(resumeData)

    if (!latexContent) {
      console.error("Failed to generate LaTeX content")
      return false
    }

    const dateStr = getCurrentDateString()
    const name = sanitizeFilename(resumeData.personalInfo?.name || "")
    const filename = name !== "未命名用户" 
      ? `${name}_resume_${dateStr}.tex`
      : `resume_${dateStr}.tex`

    downloadFile(latexContent, filename, "application/x-latex;charset=utf-8")
    return true
  } catch (error) {
    console.error("Error exporting LaTeX:", error)
    return false
  }
}

/**
 * 导入 JSON 文件并解析为简历数据
 * 用于数据恢复
 */
export function parseResumeFromJSON(jsonString: string): ResumeData | null {
  try {
    const data = JSON.parse(jsonString)
    // 基本验证
    if (data && typeof data === "object" && data.personalInfo) {
      return data as ResumeData
    }
    return null
  } catch (error) {
    console.error("Error parsing JSON:", error)
    return null
  }
}

