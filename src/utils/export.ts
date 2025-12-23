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
 * 生成 LaTeX 简历文档（使用新模板样式）
 * 基于 ICBlue 主题，使用 XeLaTeX 编译
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
  const email = personalInfo.email || ""
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
% 使用 XeLaTeX 编译（推荐在 Overleaf 上使用）
% ============================================

\\documentclass[11pt]{article}

% ============================================
% 页面设置
% ============================================
\\setlength{\\parindent}{0pt}

\\usepackage{hyperref}
\\usepackage{url}
\\hypersetup{hidelinks}
\\urlstyle{tt}

% tikz 用于页面装饰
\\usepackage{graphicx}
\\usepackage{tikz}
\\usetikzlibrary{calc}

\\RequirePackage{xltxtra}
\\RequirePackage{xifthen}
% FontAwesome5 图标
\\RequirePackage[fixed]{fontawesome5}
% 颜色
\\RequirePackage{xcolor}
\\RequirePackage[super]{nth}

% IC Blue 主题色
\\definecolor{ICBlue}{RGB}{0,62,116}

\\usepackage{calc}

% 字体设置
\\usepackage{fontspec}
\\usepackage{xeCJK}
\\CJKsetecglue{}

% 使用系统字体（可根据需要修改）
\\setmainfont{Times New Roman}
\\setCJKmainfont{SimSun}[BoldFont=黑体-简]

\\usepackage[
  a4paper,
  left=1.2cm,
  right=1.2cm,
  top=1cm,
  bottom=1cm,
  nohead
]{geometry}
\\renewcommand{\\baselinestretch}{1.2}

\\usepackage{titlesec}
\\usepackage{enumitem}
\\setlist{noitemsep}
\\setlist[itemize]{topsep=0em, leftmargin=*}
\\setlist[enumerate]{topsep=0.25em, leftmargin=*}

% 节标题样式
\\titleformat{\\section}
  {\\large\\bfseries\\raggedright}
  {}{0em}
  {}
  [{\\color{ICBlue}\\titlerule[1pt]}]
\\titlespacing*{\\section}{0cm}{*1.6}{*1.2}

\\titleformat{\\subsection}
  {\\large\\raggedright}
  {}{0em}
  {}
\\titlespacing*{\\subsection}{0cm}{*1}{*0.5}

% ============================================
% 自定义命令
% ============================================

% 带图标的节标题
\\newcommand{\\logosection}[2]{%
  \\section{\\texorpdfstring{\\makebox[\\widthof{\\faGraduationCap}][c]{\\color{ICBlue}#1}\\ }{} #2}
}

% 日期范围
\\newcommand{\\dateRange}[2]{
  {#1 -- \\makebox[\\widthof{#1}][s]{#2}}
}

% 带日期的行
\\newcommand{\\datedline}[2]{%
  {\\par #1 \\hfill #2 \\par}%
}

% 姓名
\\newcommand{\\name}[1]{
  \\centerline{\\LARGE\\bfseries{#1}}
  \\vspace{1.2ex}
}

% 联系信息
\\newcommand{\\contactInfo}[3]{
  \\centerline{
    \\normalsize{
      {\\color{ICBlue}\\faPhone*}\\ {#1} \\quad
      {\\color{ICBlue}\\faEnvelope}\\ \\href{mailto:{#2}}{#2} \\quad
      {\\color{ICBlue}\\faMapMarker*}\\ {#3}
    }
  }
}

% 简单联系信息
\\newcommand{\\basicContactInfo}[2]{
  \\centerline{
    \\normalsize{
      {\\color{ICBlue}\\faPhone*}\\ {#1} \\quad
      {\\color{ICBlue}\\faEnvelope}\\ \\href{mailto:{#2}}{#2}
    }
  }
}

% 双栏信息
\\newcommand{\\biInfo}[2]{
  {#1 \\quad #2}
}

% 三栏信息
\\newcommand{\\tripleInfo}[3]{
  {#1 \\quad #2 \\quad #3}
}

\\renewcommand{\\baselinestretch}{1.05}

% ============================================
% 文档开始
% ============================================
\\begin{document}
\\pagenumbering{gobble}

% ============================================
% 个人信息
% ============================================
\\name{${name}}
`

  // 联系信息
  if (phone && email && location) {
    latex += `\\contactInfo{${phone}}{${email}}{${location}}
`
  } else if (phone && email) {
    latex += `\\basicContactInfo{${phone}}{${email}}
`
  } else if (phone || email) {
    latex += `\\centerline{\\normalsize{`
    if (phone) latex += `{\\color{ICBlue}\\faPhone*}\\ ${phone}`
    if (phone && email) latex += ` \\quad `
    if (email) latex += `{\\color{ICBlue}\\faEnvelope}\\ \\href{mailto:${email}}{${escapeLatex(email)}}`
    latex += `}}
`
  }

  // 额外信息行
  const extraInfo: string[] = []
  if (gender) extraInfo.push(`性别: ${gender}`)
  if (politicalStatus) extraInfo.push(`政治面貌: ${politicalStatus}`)
  if (expectedPosition) extraInfo.push(`求职意向: ${expectedPosition}`)

  if (extraInfo.length > 0) {
    latex += `\\vspace{0.5ex}
\\centerline{\\normalsize{${extraInfo.join(" \\quad | \\quad ")}}}
`
  }

  latex += `
`

  // ============================================
  // 教育经历
  // ============================================
  if (education && education.length > 0) {
    latex += `% ============================================
% 教育经历
% ============================================
\\logosection{\\faGraduationCap}{教育经历}

`
    education.forEach((edu) => {
      const school = escapeLatex(edu.school)
      const major = escapeLatex(edu.major)
      const degree = escapeLatex(edu.degree)
      const rank = escapeLatex(edu.rank)
      const startDate = formatDateForLatex(edu.startDate)
      const endDate = formatDateForLatex(edu.endDate) || "至今"

      latex += `\\datedline{\\textbf{${school || "学校名称"}}}{\\dateRange{${startDate}}{${endDate}}}
`
      if (degree || major) {
        latex += `\\datedline{\\tripleInfo{${major || ""}}{${degree || ""}}{${rank ? "排名: " + rank : ""}}}{${location || ""}}
`
      }
      latex += `
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
\\logosection{\\faSuitcase}{工作/实习经历}

`
    workExperience.forEach((work) => {
      const company = escapeLatex(work.company)
      const position = escapeLatex(work.position)
      const startDate = formatDateForLatex(work.startDate)
      const endDate = formatDateForLatex(work.endDate) || "至今"
      const description = work.description || ""

      latex += `\\datedline{\\textbf{${company || "公司名称"}}}{\\dateRange{${startDate}}{${endDate}}}
\\datedline{${position || "职位"}}{}

`
      if (description) {
        const descLines = description
          .split(/[;；。\n]+/)
          .filter((line) => line.trim())

        if (descLines.length > 0) {
          latex += `\\begin{itemize}
`
          descLines.forEach((line) => {
            latex += `  \\item ${escapeLatex(line.trim())}
`
          })
          latex += `\\end{itemize}
`
        }
      }
      latex += `
`
    })
  }

  // ============================================
  // 项目经历
  // ============================================
  if (projects && projects.length > 0) {
    latex += `% ============================================
% 项目经历
% ============================================
\\logosection{\\faWrench}{项目经历}

`
    projects.forEach((project) => {
      const projectName = escapeLatex(project.projectName)
      const role = escapeLatex(project.role)
      const projectTime = escapeLatex(project.projectTime)
      const projectDesc = project.projectDesc || ""
      const responsibilities = project.responsibilities || ""

      latex += `\\datedline{\\textbf{${projectName || "项目名称"}}}{${projectTime}}
\\datedline{\\biInfo{${role || "角色"}}{}}{}

`
      if (projectDesc) {
        latex += `${escapeLatex(projectDesc)}

`
      }

      if (responsibilities) {
        const respLines = responsibilities
          .split(/[;；。\n]+/)
          .filter((line) => line.trim())

        if (respLines.length > 0) {
          latex += `\\begin{itemize}
`
          respLines.forEach((line) => {
            latex += `  \\item ${escapeLatex(line.trim())}
`
          })
          latex += `\\end{itemize}
`
        }
      }
      latex += `
`
    })
  }

  // ============================================
  // 专业技能
  // ============================================
  if (skills && skills.length > 0) {
    // 按技能等级排序（假设等级越高越重要）
    const sortedSkills = [...skills].sort((a, b) => {
      const levelOrder = { "精通": 4, "熟练": 3, "了解": 2, "入门": 1 }
      const levelA = levelOrder[a.level as keyof typeof levelOrder] || 0
      const levelB = levelOrder[b.level as keyof typeof levelOrder] || 0
      return levelB - levelA // 降序排列
    })

    // 提取技能名称
    const skillNames = sortedSkills
      .map(skill => escapeLatex(skill.name))
      .filter(name => name)

    if (skillNames.length > 0) {
      // 将技能名称连接成一行或多行
      const skillsText = skillNames.join("、")
      
      latex += `% ============================================
% 专业技能
% ============================================
\\logosection{\\faCogs}{专业技能}

${skillsText}




`
    }
  }

  // ============================================
  // 语言能力
  // ============================================
  if (languages && languages.length > 0) {
    const langItems: string[] = []
    languages.forEach((lang) => {
      const langName = escapeLatex(lang.name)
      const proficiency = escapeLatex(lang.proficiency)
      const certificate = escapeLatex(lang.certificate)

      if (langName) {
        let langStr = langName
        if (proficiency) langStr += ` - ${proficiency}`
        if (certificate) langStr += ` (${certificate})`
        langItems.push(`  \\item ${langStr}`)
      }
    })

    if (langItems.length > 0) {
      latex += `% ============================================
% 语言能力
% ============================================
\\logosection{\\faLanguage}{语言能力}
\\begin{itemize}[parsep=0.5ex]
${langItems.join("\n")}
\\end{itemize}

`
    }
  }

  // ============================================
  // 自我描述
  // ============================================
  if (selfIntroText) {
    latex += `% ============================================
% 自我描述
% ============================================
\\logosection{\\faUser}{自我描述}

${selfIntroText}

`
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
\\logosection{\\faInfo}{${fieldName}}

${fieldContent}

`
      }
    })
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

