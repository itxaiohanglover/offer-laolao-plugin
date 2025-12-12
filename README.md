<p align="center">
  <img src="./assets/laolao.gif" alt="Offer Laolao Logo" width="200">
</p>

<p align="center">
  <a href="./README.md"><img src="https://img.shields.io/badge/English-blue" alt="English"></a>
  <a href="./README.zh-CN.md"><img src="https://img.shields.io/badge/中文-red" alt="中文"></a>
  <a href="./README.zh-TW.md"><img src="https://img.shields.io/badge/中文繁体-orange" alt="中文繁体"></a>
  <a href="./README.fr.md"><img src="https://img.shields.io/badge/Français-green" alt="Français"></a>
  <a href="./README.ja.md"><img src="https://img.shields.io/badge/日本語-purple" alt="日本語"></a>
  <a href="./README.ko.md"><img src="https://img.shields.io/badge/한국어-pink" alt="한국어"></a>
  <a href="./README.ru.md"><img src="https://img.shields.io/badge/Русский-teal" alt="Русский"></a>
  <a href="./README.es.md"><img src="https://img.shields.io/badge/Español-yellow" alt="Español"></a>
  <a href="./README.ar.md"><img src="https://img.shields.io/badge/العربية-yellow" alt="العربية"></a>
  <a href="./README.id.md"><img src="https://img.shields.io/badge/Bahasa_Indonesia-yellow" alt="Bahasa Indonesia"></a>
</p>

# 🚀 Offer Laolao - Resume Auto-Fill Assistant Smart Browser Extension

> A powerful Chrome browser extension that supports both intelligent resume parsing and manual filling modes, with **AI intelligent field matching** and **field-level precise filling** capabilities, helping job seekers quickly and accurately complete resume filling on major recruitment websites.

![Version](https://img.shields.io/badge/Version-1.0-blue)
![Chrome](https://img.shields.io/badge/Chrome-Extension-green)
![Manifest](https://img.shields.io/badge/Manifest-V3-orange)

🌐 **Online Access**: [https://offer-laolao-plugin.vercel.app](https://offer-laolao-plugin.vercel.app)

## ✨ Core Features

### 📄 Intelligent Resume Parsing

- **Multi-format support**: Supports mainstream resume formats including PDF, DOCX, DOC, TXT, JSON
- **Cloud API parsing**: Integrates with Alibaba Cloud resume parsing API for accurate resume information extraction
- **JSON direct import**: Supports direct import of JSON format resume data for data backup and restoration
- **Drag-and-drop upload**: Supports file drag-and-drop upload for convenient operation
- **Intelligent field mapping**: Automatically maps parsing results to corresponding form fields

### 📝 Complete Resume Information Management

Supports filling and managing the following resume modules:

| Module              | Included Fields                                                                 |
| ------------------- | -------------------------------------------------------------------------------- |
| **Basic Information**      | Name, Gender, Date of Birth, Phone Number, Email, ID Number, Location, Political Status         |
| **Job Expectations**      | Desired Position, Desired Industry, Desired Salary, Desired Location, Internship Duration, Available Working Hours                 |
| **Education Experience**      | School Name, Major, Degree (Junior College/Bachelor/Master/PhD), Ranking, Enrollment/Graduation Date (supports multiple entries) |
| **Work/Internship Experience** | Company Name, Position, Start/End Date, Job Description (supports multiple entries)                          |
| **Project Experience**      | Project Name, Role, Project Duration, Project Description, Responsibility Description (supports multiple entries)                 |
| **Skills**      | Skill Name, Skill Level (Beginner/Intermediate/Advanced/Expert) (supports multiple entries)                        |
| **Language Proficiency**      | Language Name, Proficiency Level (Beginner/Basic/Proficient/Expert), Language Certificates (supports multiple entries)              |
| **Custom Fields**    | Custom field names and content (supports multiple entries)                                             |
| **Self-description**      | Personal strengths and characteristics                                                           |

### 🎯 Intelligent Form Filling

#### One-click Pre-fill Function

- Click the "📋 Pre-fill" button to automatically fill resume data into the current recruitment website form
- Intelligently identifies form fields and automatically matches corresponding resume information
- Supports multiple form elements including input, textarea, select, contenteditable
- Automatically triggers form events (input, change, blur) to ensure website validation passes
- Provides visual feedback after filling, highlighting filled fields

#### Field-level Precise Filling (↗ Point-and-Fill)

- Each field has a "↗" button for **single-field precise filling**
- Click the button to enter "Point-and-Fill Mode":
  - Operation tips will be displayed at the top of the page
  - Elements that can be filled will be highlighted with a blue border when hovering the mouse
  - Click the target input box to fill the field value
  - Press `Esc` to cancel the operation
- Supports filling into: input, textarea, select, contenteditable elements
- Automatically triggers form events (input, change, blur) to ensure website validation passes
- Automatically closes the popup after successful filling for convenient continuous operation

### 🤖 AI Large Model Integration

Supports multiple domestic large model service providers for intelligent resume content optimization and field matching:

| Service Provider                | Supported Models                                               |
| --------------------- | ------------------------------------------------------ |
| **DeepSeek**          | DeepSeek Chat, DeepSeek Coder                          |
| **Kimi (Moonshot)**   | Moonshot 8K/32K/128K                                   |
| **Tongyi Qianwen (Alibaba Cloud)** | Qwen Turbo/Plus/Max/Max Long Text                         |
| **Volcano Engine (Doubao)**   | Doubao Seed 1.6, Doubao Seed 1.6 Lite, Doubao Seed 1.6 Flash |
| **Zhipu AI**           | GLM-4, GLM-4 Flash, GLM-3 Turbo                        |
| **Baichuan Intelligence**          | Baichuan 2 Turbo, Baichuan 2 Turbo 192K                        |
| **Custom**            | Supports any OpenAI-compatible API                         |

**AI Function Features**:

- One-click API connection testing
- **✨ AI One-click Resume Optimization**: Intelligently optimizes self-introductions, job descriptions, project descriptions, etc.
- **🤖 AI-generated Resume Introduction**: Intelligently generates professional self-introductions (200-300 words) based on resume data
  - Supports copying to clipboard, filling into self-description field, downloading as TXT file
- Optimizes work and project descriptions using the STAR method
- Automatically adds quantitative data and achievement descriptions

### 📤 Multi-format Export

- **JSON Export**: Export complete resume data for backup and cross-device synchronization
- **LaTeX Export**: Generate professional LaTeX resume templates
  - Can be directly compiled on [Overleaf](https://www.overleaf.com/)
  - Supports Chinese (using ctex package)
  - Professional typesetting, suitable for academic and technical job applications
  - Includes complete style definitions and comments
- **🤖 AI-generated Resume Introduction**: Call AI models to intelligently generate professional self-introductions
  - Generated based on educational background, work experience, project experience, and skills in the resume
  - Supports copying to clipboard
  - Supports one-click filling into self-description field
  - Supports downloading as `.txt` file
- **Resume Introduction Prompt Export**: Export structured prompt templates, supporting `.md`/`.txt`
  - Includes personal basic information prompts
  - Work experience question templates
  - Project experience inquiry framework
  - Skill assessment guidance words

### 💾 Data Persistence

- **Chrome Storage API**: Uses browser-native storage for secure and reliable data
- **Real-time automatic saving**: Automatically saves when form content changes to prevent data loss
- **Manual saving**: Supports manual click of save button to confirm saving
- **Data reset**: One-click clearing of all resume data to start fresh
- **Automatic setting saving**: Settings page configurations are automatically saved

## 🏗️ Project Architecture

```
super_resume/
├── docs                       # Introduction pages
├── manifest.json              # Chrome extension configuration file (Manifest V3)
├── icons/                     # Extension icons
├── src/
│   ├── background/            # Background service scripts
│   ├── content/               # Content scripts (injected into webpages)
│   └── popup/                 # Popup pages
└── README.md
```

## 📦 Installation Guide

### Method 1: Install in Developer Mode

1. **Download the project**

   ```bash
   git clone https://github.com/itxaiohanglover/offer-laolao-plugin.git
   ```

   Or directly download the ZIP and extract it

2. **Open Chrome extension management page**

   - Enter in address bar: `chrome://extensions/`
   - Or through menu: More Tools → Extensions

3. **Enable Developer Mode**

   - Click the "Developer Mode" switch in the top right corner

4. **Load the extension**

   - Click "Load unpacked extension"
   - Select the project root directory (the folder containing `manifest.json`)

5. **Installation complete**
   - The extension icon will appear in the browser toolbar
   - Click the icon to open the resume filling assistant

### Method 2: Edge Browser Installation

Edge browser also supports Chrome extensions:

1. Open `edge://extensions/`
2. Enable "Developer Mode"
3. Click "Load unpacked extension"
4. Select the project directory

## 🚀 Usage Tutorial

### Step 1: Configure API (Optional but Recommended)

1. Click the extension icon, switch to the "⚙️ Settings" tab
2. **Configure AI Model** (for content optimization, recommended)
   - Select model provider (e.g., DeepSeek, Kimi, etc.)
   - Enter the corresponding API Key
   - Click "🔗 Test Connection" to verify the configuration
3. **Configure Resume Parsing API** (for parsing PDF/DOCX format resumes)
   - Purchase resume parsing service from [Alibaba Cloud Market](https://market.aliyun.com/detail/cmapi034316)
   - Enter API URL and APP Code

### Step 2: Fill or Import Resume

#### Method A: Intelligent Upload Parsing

1. Find the upload area at the top of the "📝 Resume Filling" tab
2. Drag and drop resume file or click to select file
3. Wait for parsing to complete, click "Use Parsed Data" button
4. Resume information will be automatically filled into the form

#### Method B: Manual Filling

1. Directly fill in all information in the form
2. Click the "+ Add" button to add multiple entries
3. Data is automatically saved, or you can click "💾 Save" to manually save

#### Method C: Import JSON

1. If you have a previously exported JSON file
2. Directly drag and drop it into the upload area to import

### Step 3: AI Resume Optimization (Optional)

1. Ensure AI model API Key is configured
2. Fill in descriptive content in the resume (self-introduction, job description, project description, etc.)
3. Click the "✨ AI Optimize" button
4. The system will optimize all descriptive content one by one
5. Optimized content will be automatically filled back into the form

### Step 4: Fill Resume on Recruitment Website

#### One-click Pre-fill (Recommended)

1. Open the resume filling page of the target recruitment website
2. Click the extension icon to open the popup
3. Click the "📋 Pre-fill" button
4. The extension will automatically identify and fill form fields
5. Filling details will be displayed after completion

#### Field-level Precise Filling

1. Find the field you want to fill, click the "↗" button next to it
2. The popup will automatically close, and the page enters "Point-and-Fill Mode"
3. Click the target input box on the webpage
4. The field value will be precisely filled in
5. Press `Esc` to cancel operation

### Step 5: Export Backup

1. Click the "📤 Export" button
2. Select export format:
   - **JSON**: For data backup and import
   - **LaTeX**: Generate professional resume documents that can be edited and printed on Overleaf
   - **🤖 AI-generated Resume Introduction**: Call AI to intelligently generate professional self-introductions
     - After generation, you can copy, fill into self-description, or download as TXT file
   - **Resume Introduction Prompts**: Export structured prompts for interacting with AI (supports `.md`/`.txt`), filename automatically named "Username_Resume_Prompt_Date"

## 🌐 Supported Recruitment Websites

This extension uses universal form recognition technology and theoretically supports all recruitment websites, including but not limited to:

- ✅ Zhaopin.com
- ✅ 51job.com
- ✅ Liepin.com
- ✅ Boss Zhipin (zhipin.com)
- ✅ Lagou.com
- ✅ Maimai.cn
- ✅ Shixiseng.com
- ✅ Nowcoder.com
- ✅ ByteDance campus recruitment and other major company official recruitment pages

> 💡 Tip: If the form on a website cannot be automatically recognized, you can use the "field-level precise filling" function to manually specify the filling position.

## 🛠️ Technology Stack

- **Frontend Framework**: Native JavaScript (ES6+)
- **Extension Standard**: Chrome Extensions Manifest V3
- **Storage Solution**: Chrome Storage API + localStorage
- **Styling Solution**: Native CSS (CSS variables, Flexbox, Grid)
- **Document Format**: LaTeX (ctex Chinese support)
- **API Integration**:
  - Alibaba Cloud resume parsing API
  - OpenAI-compatible large model APIs (DeepSeek, Doubao (Volcano Engine), Tongyi Qianwen, etc.)

## ⚠️ Notes

1. **API Configuration**: Resume parsing functionality requires API configuration, otherwise only JSON import can be used
2. **AI Optimization**: AI model API Key is required to use optimization features
3. **Website Compatibility**: Some websites may use special form components, it is recommended to use field-level filling
4. **Data Security**: All data is only stored locally in the browser and will not be uploaded to any server
5. **Browser Permissions**: The extension requires `activeTab`, `scripting`, and `storage` permissions to function properly
6. **Special Pages**: System pages like `chrome://`, `edge://`, `about:` do not support content script injection

## 📋 Changelog

### v1.0 (Current Version)

## 📄 Open Source License

This project is licensed under the [MIT License](LICENSE).

## 🤝 Contribution and Feedback

Welcome to submit Issues and Pull Requests!

- 🐛 Found a bug? Please submit an [Issue](https://github.com/itxaiohanglover/offer-laolao-plugin/issues)
- 💡 Have a new idea? Welcome to submit a [Feature Request](https://github.com/itxaiohanglover/offer-laolao-plugin/issues)
- 🔧 Want to contribute code? Welcome to submit a [Pull Request](https://github.com/itxaiohanglover/offer-laolao-plugin/pulls)

---

<p align="center">
  <strong>Make job hunting easier ✨</strong>
</p>