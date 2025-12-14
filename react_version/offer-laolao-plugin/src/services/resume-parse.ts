/**
 * 简历解析 API 服务模块
 * 处理简历解析 API 的调用
 */

import type {
  ParseSettings,
  ResumeParseRawData,
  EducationObj,
  JobExpObj,
  ProjectExpObj,
  SkillObj,
  LanguageObj,
} from "~types/settings"

/**
 * 将文件转换为 Base64 编码
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = function (e) {
      // 移除 data:type;base64, 前缀，只保留 base64 数据
      const result = e.target?.result as string
      const base64 = result.split(",")[1]
      resolve(base64)
    }
    reader.onerror = function (error) {
      reject(error)
    }
    reader.readAsDataURL(file)
  })
}

/**
 * 调用简历解析 API
 */
export async function parseResumeByAPI(
  file: File,
  settings: ParseSettings
): Promise<ParsedResumeData> {
  console.log("开始调用简历解析API:", {
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
  })

  // 检查 API 配置
  if (!settings.url || !settings.appCode) {
    throw new Error("API配置不完整，请在设置中配置API URL和APP Code")
  }

  // 将文件转换为 Base64
  const base64Data = await fileToBase64(file)

  // 构建请求体（根据阿里云 API 文档格式）
  const requestBody = {
    file_name: file.name, // 简历文件名（需包含正确的后缀名）
    file_cont: base64Data, // 简历内容（base64编码的简历内容）
    need_avatar: 0, // 是否需要提取头像图片
    ocr_type: 1, // 1为高级ocr
  }

  console.log("API请求参数:", {
    url: settings.url,
    file_name: file.name,
    file_size: file.size,
    base64_length: base64Data.length,
    has_appcode: !!settings.appCode && settings.appCode.length > 0,
  })

  // 发送 API 请求
  const response = await fetch(settings.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: "APPCODE " + settings.appCode, // 阿里云API使用APPCODE认证
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("API请求失败:", {
      status: response.status,
      statusText: response.statusText,
      error: errorText,
      url: settings.url,
      has_appcode: !!settings.appCode,
    })

    // 401错误通常是认证问题
    if (response.status === 401) {
      throw new Error(
        "API认证失败（401），请检查APP Code是否正确。如果APP Code正确，可能是API服务未激活或已过期。"
      )
    }

    throw new Error(
      `API请求失败: ${response.status} ${response.statusText} - ${errorText}`
    )
  }

  const result = await response.json()
  console.log("API响应:", result)

  // 根据 API 返回的数据结构进行解析
  return parseAPIResponse(result)
}

/**
 * 解析后的简历数据结构
 */
export interface ParsedResumeData {
  personalInfo: {
    name: string
    gender: string
    phone: string
    email: string
    "political-status": string
    "expected-position": string
    "expected-salary": string
    "self-intro": string
    "expected-industry"?: string
    "expected-location"?: string
  }
  education: Record<string, string>[]
  workExperience: Record<string, string>[]
  projects: Record<string, string>[]
  skills: Record<string, string>[]
  languages: Record<string, string>[]
}

/**
 * 解析 API 响应数据，转换为表单数据格式
 */
export function parseAPIResponse(apiResponse: any): ParsedResumeData {
  const resumeData: ParsedResumeData = {
    personalInfo: {
      name: "",
      gender: "",
      phone: "",
      email: "",
      "political-status": "",
      "expected-position": "",
      "expected-salary": "",
      "self-intro": "",
    },
    education: [],
    workExperience: [],
    projects: [],
    skills: [],
    languages: [],
  }

  let rawData: ResumeParseRawData | null = null
  if (apiResponse && typeof apiResponse === "object") {
    if (apiResponse.result) {
      rawData = apiResponse.result
    } else if (apiResponse.data) {
      rawData = apiResponse.data
    } else if (apiResponse.body) {
      rawData = apiResponse.body
    } else {
      rawData = apiResponse
    }
  }

  if (!rawData) {
    console.warn("API返回数据为空，返回默认结构")
    return resumeData
  }

  // 基本信息
  resumeData.personalInfo = {
    name: rawData.name || rawData.fullname || "",
    gender: rawData.gender_inf || rawData.gender || "",
    phone: rawData.phone || rawData.mobile || "",
    email: rawData.email || "",
    "political-status": rawData.polit_status || rawData.political_status || "",
    "expected-position": rawData.work_pos_type_p || rawData.work_pos_type || "",
    "expected-salary":
      apiResponse.eval && apiResponse.eval.salary
        ? apiResponse.eval.salary
        : "",
    "self-intro":
      rawData.cont_basic_info ||
      rawData.cont_job_skill ||
      rawData.raw_text ||
      "",
  }

  if (rawData.work_pos_type) {
    resumeData.personalInfo["expected-industry"] = rawData.work_pos_type
  }
  if (rawData.work_city) {
    resumeData.personalInfo["expected-location"] = rawData.work_city
  }

  // 教育经历
  if (Array.isArray(rawData.education_objs)) {
    resumeData.education = rawData.education_objs.map(
      (edu: EducationObj, index: number) => {
        const item: Record<string, string> = {}
        item[`education[${index}][school]`] =
          edu.edu_college || edu.edu_school || ""
        item[`education[${index}][major]`] = edu.edu_major || ""
        item[`education[${index}][degree]`] =
          edu.edu_degree || edu.edu_degree_norm || ""
        item[`education[${index}][rank]`] =
          edu.edu_college_rank || edu.edu_college_rank_qs || ""
        item[`education[${index}][start-date]`] = normalizeDateValue(
          edu.start_date
        )
        item[`education[${index}][end-date]`] = normalizeDateValue(edu.end_date)
        return item
      }
    )
  }

  // 工作/实习经历
  if (Array.isArray(rawData.job_exp_objs)) {
    resumeData.workExperience = rawData.job_exp_objs.map(
      (job: JobExpObj, index: number) => {
        const item: Record<string, string> = {}
        item[`internship[${index}][company]`] =
          job.job_cpy || job.job_company || rawData?.work_company || ""
        item[`internship[${index}][position]`] =
          job.job_pos_type_p ||
          job.job_pos_type ||
          rawData?.work_pos_type_p ||
          ""
        item[`internship[${index}][start-date]`] = normalizeDateValue(
          job.start_date
        )
        item[`internship[${index}][end-date]`] = normalizeDateValue(job.end_date)
        item[`internship[${index}][description]`] = job.job_content || ""
        return item
      }
    )
  }

  // 项目经历
  if (Array.isArray(rawData.proj_exp_objs)) {
    resumeData.projects = rawData.proj_exp_objs.map(
      (proj: ProjectExpObj, index: number) => {
        const item: Record<string, string> = {}
        item[`project[${index}][project-name]`] = proj.proj_name || ""
        item[`project[${index}][role]`] =
          proj.proj_role || rawData?.work_pos_type_p || ""
        if (proj.start_date || proj.end_date) {
          item[`project[${index}][project-time]`] = [
            proj.start_date || "",
            proj.end_date || "",
          ]
            .filter(Boolean)
            .join(" - ")
        } else {
          item[`project[${index}][project-time]`] = ""
        }
        item[`project[${index}][project-desc]`] = proj.proj_content || ""
        item[`project[${index}][responsibilities]`] = proj.proj_resp || ""
        return item
      }
    )
  }

  // 技能
  if (Array.isArray(rawData.skills_objs)) {
    resumeData.skills = rawData.skills_objs.map(
      (skill: SkillObj, index: number) => {
        const item: Record<string, string> = {}
        item[`skills[${index}][name]`] = skill.skills_name || ""
        item[`skills[${index}][level]`] = mapSkillLevel(skill.skills_level)
        return item
      }
    )
  }

  // 语言能力
  if (Array.isArray(rawData.lang_objs)) {
    resumeData.languages = rawData.lang_objs.map(
      (lang: LanguageObj, index: number) => {
        const item: Record<string, string> = {}
        item[`language[${index}][name]`] = lang.lang_name || lang.language || ""
        item[`language[${index}][proficiency]`] =
          lang.lang_level || lang.level || ""
        item[`language[${index}][certificate]`] = lang.lang_cert || ""
        return item
      }
    )
  }

  return resumeData
}

/**
 * 将各种日期格式转换为 input[type="date"] 所需的 YYYY-MM-DD
 */
export function normalizeDateValue(dateStr?: string): string {
  if (!dateStr) return ""
  let str = String(dateStr).trim()
  if (!str) return ""

  str = str.replace(/年|\/|\./g, "-").replace(/月/g, "-").replace(/日/g, "")
  str = str.replace(/--+/g, "-")

  if (/^\d{4}$/.test(str)) {
    return str + "-01-01"
  }
  if (/^\d{4}-\d{1,2}$/.test(str)) {
    const parts = str.split("-")
    return parts[0] + "-" + parts[1].padStart(2, "0") + "-01"
  }
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(str)) {
    const segs = str.split("-")
    return segs[0] + "-" + segs[1].padStart(2, "0") + "-" + segs[2].padStart(2, "0")
  }
  return ""
}

/**
 * 将 API 中的技能等级映射到表单下拉框可选值
 */
export function mapSkillLevel(level?: string): string {
  if (!level) return ""
  const normalized = String(level).trim()
  const map: Record<string, string> = {
    入门: "初级",
    了解: "初级",
    一般: "初级",
    熟悉: "中级",
    良好: "中级",
    熟练: "高级",
    精通: "专家",
    专家: "专家",
    掌握: "高级",
  }
  return map[normalized] || normalized
}

