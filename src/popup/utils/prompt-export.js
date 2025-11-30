function sanitizeFileName(name) {
  var s = String(name || "未命名用户").replace(/[\\/:*?"<>|\n\r]+/g, "_");
  s = s.trim();
  if (!s) s = "未命名用户";
  return s;
}

function formatDate(date) {
  var d = date || new Date();
  var y = d.getFullYear();
  var m = String(d.getMonth() + 1).padStart(2, "0");
  var day = String(d.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + day;
}

function getName(resumeData) {
  var p = (resumeData && resumeData.personalInfo) || {};
  return p.name || "未命名用户";
}

function buildHeader(resumeData) {
  var p = resumeData.personalInfo || {};
  var lines = [];
  lines.push("目标：生成一段200-300字的中文简历介绍，强调量化成果与岗位匹配。");
  lines.push("已知信息：");
  if (p.name) lines.push("- 姓名：" + p.name);
  if (p.gender) lines.push("- 性别：" + p.gender);
  if (p["birth-date"]) lines.push("- 出生日期：" + p["birth-date"]);
  if (p.phone) lines.push("- 电话：" + p.phone);
  if (p.email) lines.push("- 邮箱：" + p.email);
  if (p.location) lines.push("- 所在地：" + p.location);
  if (p["expected-position"])
    lines.push("- 期望职位：" + p["expected-position"]);
  if (p["expected-industry"])
    lines.push("- 期望行业：" + p["expected-industry"]);
  if (p["expected-location"])
    lines.push("- 期望地点：" + p["expected-location"]);
  if (p["self-intro"]) lines.push("- 自我描述：" + p["self-intro"].trim());
  return lines.join("\n");
}

function buildWorkQuestions(resumeData) {
  var items = Array.isArray(resumeData.workExperience)
    ? resumeData.workExperience
    : [];
  var lines = [];
  lines.push("工作经历提问模板：");
  if (items.length === 0) {
    lines.push("- 公司/岗位/起止时间？核心职责？");
    lines.push("- 采用了哪些方法或技术？遇到的挑战是什么？");
    lines.push("- 关键成果及量化指标（提升%、减少%、人效、营收等）？");
    lines.push("- 与目标岗位的匹配点是什么？");
  } else {
    for (var i = 0; i < items.length; i++) {
      var w = items[i];
      var company = "";
      var role = "";
      var start = "";
      var end = "";
      for (var k in w) {
        if (k.includes("company")) company = w[k];
        if (k.includes("position") || k.includes("role")) role = w[k];
        if (k.includes("start")) start = w[k];
        if (k.includes("end")) end = w[k];
      }
      lines.push(
        "- 经历" +
          (i + 1) +
          "：" +
          [company, role].filter(Boolean).join(" / ") +
          (start || end
            ? " (" + [start, end].filter(Boolean).join(" - ") + ")"
            : "")
      );
      lines.push("  · 核心职责是什么？");
      lines.push("  · 使用了哪些技术/方法，为解决何种问题？");
      lines.push("  · 取得何种可量化成果（提升%、降低%、时长、成本等）？");
      lines.push("  · 与目标岗位的匹配点与可迁移能力？");
    }
  }
  return lines.join("\n");
}

function buildProjectFramework(resumeData) {
  var items = Array.isArray(resumeData.projects) ? resumeData.projects : [];
  var lines = [];
  lines.push("项目经验询问框架：");
  var base = [
    "- 背景与目标是什么？角色与职责是什么？",
    "- 关键技术栈与理由？",
    "- 难点与解决方案（含设计/算法/工程实践）？",
    "- 具体贡献与结果（含数据/指标/业务影响）？",
    "- 复盘与改进建议？",
  ];
  if (items.length === 0) {
    lines = lines.concat(base);
  } else {
    for (var i = 0; i < items.length; i++) {
      var p = items[i];
      var name = "";
      for (var k in p) {
        if (k.includes("name") || k.includes("project-name")) name = p[k];
      }
      lines.push("- 项目" + (i + 1) + (name ? "：" + name : ""));
      lines.push("  · 背景与目标？角色与职责？");
      lines.push("  · 技术栈选择与权衡？");
      lines.push("  · 难点与解决方案？");
      lines.push("  · 贡献与结果（用数据说明）？");
      lines.push("  · 复盘与改进？");
    }
  }
  return lines.join("\n");
}

function buildSkillGuide(resumeData) {
  var items = Array.isArray(resumeData.skills) ? resumeData.skills : [];
  var lines = [];
  lines.push("技能评估引导词：");
  if (items.length > 0) {
    var names = [];
    for (var i = 0; i < items.length; i++) {
      var s = items[i];
      var nameKey = Object.keys(s).find(function (k) {
        return k.includes("name") || k.includes("skill");
      });
      if (nameKey && s[nameKey]) names.push(s[nameKey]);
    }
    if (names.length > 0) lines.push("- 已具备：" + names.join("、"));
  }
  lines.push("- 熟练度与实际应用场景？举例说明项目或工作中的使用。");
  lines.push("- 与岗位JD的匹配度与可提升方向？");
  lines.push("- 证书/竞赛/论文/开源贡献等佐证材料？");
  return lines.join("\n");
}

function generatePromptContent(resumeData, format) {
  var name = getName(resumeData);
  var parts = [];
  if (format === "md") {
    parts.push("# 简历介绍提示词 - " + name);
    parts.push("");
    parts.push("## 使用方式");
    parts.push(
      "逐步提问并汇总为一段200-300字中文简介，突出量化成果与岗位匹配。"
    );
    parts.push("");
    parts.push("## 个人基本信息提示");
    parts.push(buildHeader(resumeData));
    parts.push("");
    parts.push("## 工作经历提问模板");
    parts.push(buildWorkQuestions(resumeData));
    parts.push("");
    parts.push("## 项目经验询问框架");
    parts.push(buildProjectFramework(resumeData));
    parts.push("");
    parts.push("## 技能评估引导词");
    parts.push(buildSkillGuide(resumeData));
  } else {
    parts.push("简历介绍提示词 - " + name);
    parts.push(
      "使用方式：逐步提问并汇总为一段200-300字中文简介，突出量化成果与岗位匹配。"
    );
    parts.push("个人基本信息提示：");
    parts.push(buildHeader(resumeData));
    parts.push("工作经历提问模板：");
    parts.push(buildWorkQuestions(resumeData));
    parts.push("项目经验询问框架：");
    parts.push(buildProjectFramework(resumeData));
    parts.push("技能评估引导词：");
    parts.push(buildSkillGuide(resumeData));
  }
  return parts.join("\n");
}

function downloadPrompt(resumeData, format) {
  var name = sanitizeFileName(getName(resumeData));
  var date = formatDate();
  var content = generatePromptContent(resumeData, format);
  var isMd = format === "md";
  var blob = new Blob([content], {
    type: isMd ? "text/markdown;charset=utf-8" : "text/plain;charset=utf-8",
  });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = name + "_简历提示词_" + date + (isMd ? ".md" : ".txt");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  if (typeof showNotification !== "undefined") {
    showNotification("提示词已导出", "success");
  }
}

function exportResumePromptAsMarkdown(resumeData) {
  try {
    downloadPrompt(resumeData, "md");
  } catch (e) {
    if (typeof showNotification !== "undefined") {
      showNotification("提示词导出失败: " + e.message, "error");
    }
  }
}

function exportResumePromptAsText(resumeData) {
  try {
    downloadPrompt(resumeData, "txt");
  } catch (e) {
    if (typeof showNotification !== "undefined") {
      showNotification("提示词导出失败: " + e.message, "error");
    }
  }
}

/**
 * 使用 AI 模型生成简历介绍
 * @param {object} resumeData - 简历数据
 * @param {function} onProgress - 进度回调
 * @returns {Promise<string>} 生成的简历介绍
 */
async function generateResumeIntroWithAI(resumeData, onProgress = () => {}) {
  // 检查模型配置
  var config = null;
  if (typeof getModelConfig === "function") {
    config = getModelConfig();
  } else if (
    typeof window !== "undefined" &&
    typeof window.getModelConfig === "function"
  ) {
    config = window.getModelConfig();
  }

  if (!config || !config.apiKey) {
    throw new Error("请先在设置中配置 AI 模型 API Key");
  }

  onProgress({ status: "preparing", message: "正在准备简历数据..." });

  // 构建提示词
  var prompt = buildAIPrompt(resumeData);

  onProgress({ status: "generating", message: "正在调用 AI 生成简历介绍..." });

  // 调用模型 API
  var callAPI = null;
  if (typeof callModelAPI === "function") {
    callAPI = callModelAPI;
  } else if (
    typeof window !== "undefined" &&
    typeof window.callModelAPI === "function"
  ) {
    callAPI = window.callModelAPI;
  }

  if (!callAPI) {
    throw new Error("模型 API 功能未加载，请刷新页面重试");
  }

  var systemPrompt =
    "你是一位专业的简历撰写顾问，擅长根据求职者的背景信息撰写简洁有力的简历自我介绍。请用中文回答，直接输出介绍内容，不要包含任何额外的解释或标题。";

  var response = await callAPI(prompt, {
    systemPrompt: systemPrompt,
    temperature: 0.7,
    maxTokens: 800,
  });

  onProgress({ status: "completed", message: "简历介绍生成完成！" });

  return response;
}

/**
 * 构建 AI 生成简历介绍的提示词
 * @param {object} resumeData - 简历数据
 * @returns {string} 提示词
 */
function buildAIPrompt(resumeData) {
  var p = resumeData.personalInfo || {};
  var parts = [];

  parts.push("请根据以下简历信息，生成一段200-300字的专业简历自我介绍。要求：");
  parts.push("1. 突出核心竞争力和个人优势");
  parts.push("2. 使用量化数据和具体成果（如有）");
  parts.push("3. 语言简洁有力，避免空洞的形容词");
  parts.push("4. 如果有目标职位，请针对该职位突出相关能力");
  parts.push("");
  parts.push("【个人信息】");

  if (p.name) parts.push("- 姓名：" + p.name);
  if (p["expected-position"])
    parts.push("- 目标职位：" + p["expected-position"]);
  if (p["expected-industry"])
    parts.push("- 目标行业：" + p["expected-industry"]);
  if (p["expected-location"])
    parts.push("- 期望地点：" + p["expected-location"]);

  // 教育经历
  var eduItems = Array.isArray(resumeData.education)
    ? resumeData.education
    : [];
  if (eduItems.length > 0) {
    parts.push("");
    parts.push("【教育背景】");
    for (var i = 0; i < eduItems.length; i++) {
      var edu = eduItems[i];
      var school = "";
      var major = "";
      var degree = "";
      for (var k in edu) {
        if (k.includes("school")) school = edu[k];
        if (k.includes("major")) major = edu[k];
        if (k.includes("degree")) degree = edu[k];
      }
      if (school || major || degree) {
        parts.push("- " + [school, major, degree].filter(Boolean).join(" / "));
      }
    }
  }

  // 工作经历
  var workItems = Array.isArray(resumeData.workExperience)
    ? resumeData.workExperience
    : [];
  if (workItems.length > 0) {
    parts.push("");
    parts.push("【工作经历】");
    for (var i = 0; i < workItems.length; i++) {
      var w = workItems[i];
      var company = "";
      var role = "";
      var desc = "";
      for (var k in w) {
        if (k.includes("company")) company = w[k];
        if (k.includes("position") || k.includes("role")) role = w[k];
        if (k.includes("description")) desc = w[k];
      }
      if (company || role) {
        parts.push("- " + [company, role].filter(Boolean).join(" / "));
        if (desc) parts.push("  工作内容：" + desc.substring(0, 200));
      }
    }
  }

  // 项目经历
  var projItems = Array.isArray(resumeData.projects) ? resumeData.projects : [];
  if (projItems.length > 0) {
    parts.push("");
    parts.push("【项目经历】");
    for (var i = 0; i < projItems.length; i++) {
      var proj = projItems[i];
      var projName = "";
      var projRole = "";
      var projDesc = "";
      for (var k in proj) {
        if (k.includes("name") || k.includes("project-name"))
          projName = proj[k];
        if (k.includes("role")) projRole = proj[k];
        if (k.includes("desc") || k.includes("description")) projDesc = proj[k];
      }
      if (projName) {
        parts.push("- " + projName + (projRole ? "（" + projRole + "）" : ""));
        if (projDesc) parts.push("  项目描述：" + projDesc.substring(0, 200));
      }
    }
  }

  // 技能
  var skillItems = Array.isArray(resumeData.skills) ? resumeData.skills : [];
  if (skillItems.length > 0) {
    parts.push("");
    parts.push("【技能特长】");
    var skillNames = [];
    for (var i = 0; i < skillItems.length; i++) {
      var s = skillItems[i];
      for (var k in s) {
        if (k.includes("name") || k.includes("skill")) {
          if (s[k]) skillNames.push(s[k]);
        }
      }
    }
    if (skillNames.length > 0) {
      parts.push("- " + skillNames.join("、"));
    }
  }

  // 现有自我介绍（作为参考）
  if (p["self-intro"] && p["self-intro"].trim()) {
    parts.push("");
    parts.push("【现有自我介绍（仅供参考，请重新撰写）】");
    parts.push(p["self-intro"].trim());
  }

  parts.push("");
  parts.push("请直接输出生成的简历自我介绍，不要包含任何标题或额外解释。");

  return parts.join("\n");
}

/**
 * 导出 AI 生成的简历介绍
 * @param {object} resumeData - 简历数据
 * @param {string} format - 导出格式 (md/txt)
 * @param {function} onProgress - 进度回调
 */
async function exportAIGeneratedIntro(
  resumeData,
  format,
  onProgress = () => {}
) {
  try {
    var intro = await generateResumeIntroWithAI(resumeData, onProgress);

    var name = sanitizeFileName(getName(resumeData));
    var date = formatDate();
    var isMd = format === "md";

    var content = "";
    if (isMd) {
      content = "# AI 生成简历介绍 - " + name + "\n\n";
      content += "> 生成时间：" + date + "\n\n";
      content += "## 简历自我介绍\n\n";
      content += intro;
    } else {
      content = "AI 生成简历介绍 - " + name + "\n";
      content += "生成时间：" + date + "\n\n";
      content += "简历自我介绍：\n\n";
      content += intro;
    }

    var blob = new Blob([content], {
      type: isMd ? "text/markdown;charset=utf-8" : "text/plain;charset=utf-8",
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = name + "_AI简历介绍_" + date + (isMd ? ".md" : ".txt");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (typeof showNotification !== "undefined") {
      showNotification("AI 简历介绍已导出", "success");
    }

    return intro;
  } catch (e) {
    if (typeof showNotification !== "undefined") {
      showNotification("AI 简历介绍生成失败: " + e.message, "error");
    }
    throw e;
  }
}

if (typeof window !== "undefined") {
  window.exportResumePromptAsMarkdown = exportResumePromptAsMarkdown;
  window.exportResumePromptAsText = exportResumePromptAsText;
  window.generateResumeIntroWithAI = generateResumeIntroWithAI;
  window.exportAIGeneratedIntro = exportAIGeneratedIntro;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    generatePromptContent,
    exportResumePromptAsMarkdown,
    exportResumePromptAsText,
    generateResumeIntroWithAI,
    exportAIGeneratedIntro,
  };
}
