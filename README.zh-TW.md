<p align="center">
  <img src="./assets/laolao.gif" alt="Offer 撈撈 Logo" width="200">
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

# 🚀 Offer 撈撈 - 簡歷自動填寫助手智能瀏覽器插件

> 一款功能強大的 Chrome 瀏覽器擴展，支持智能解析簡歷、手動填寫雙模式，並提供 **AI 智能字段匹配** 和 **字段級精準填充** 功能，幫助求職者在各大招聘網站上快速、準確地完成簡歷填寫。

![版本](https://img.shields.io/badge/版本-1.0-blue)
![Chrome](https://img.shields.io/badge/Chrome-Extension-green)
![Manifest](https://img.shields.io/badge/Manifest-V3-orange)

🌐 **線上訪問**：[https://offer-laolao-plugin.vercel.app](https://offer-laolao-plugin.vercel.app)

## ✨ 核心功能特性

### 📄 智能簡歷解析

- **多格式支持**：支持 PDF、DOCX、DOC、TXT、JSON 等主流簡歷格式
- **雲端 API 解析**：集成阿里雲市場簡歷解析 API，精準提取簡歷資訊
- **JSON 直接導入**：支持直接導入 JSON 格式的簡歷數據，實現數據備份與恢復
- **拖拽上傳**：支持文件拖放上傳，操作便捷
- **智能字段映射**：自動將解析結果映射到對應表單字段

### 📝 完整的簡歷資訊管理

支持填寫和管理以下簡歷模組：

| 模組              | 包含字段                                                                     |
| ----------------- | ---------------------------------------------------------------------------- |
| **基本資訊**      | 姓名、性別、出生日期、手機號碼、電子郵箱、身份證號、所在地、政治面貌         |
| **求職期望**      | 期望職位、期望行業、期望薪資、期望地點、實習時長、可工作時間                 |
| **教育經歷**      | 學校名稱、專業、學歷（專科/本科/碩士/博士）、排名、入學/畢業時間（支持多條） |
| **工作/實習經歷** | 公司名稱、職位、開始/結束時間、工作描述（支持多條）                          |
| **專案經歷**      | 專案名稱、擔任角色、專案時間、專案描述、職責描述（支持多條）                 |
| **技能資訊**      | 技能名稱、技能水平（初級/中級/高級/專家）（支持多條）                        |
| **語言能力**      | 語言名稱、掌握程度（入門/基礎/熟練/精通）、語言證書（支持多條）              |
| **自定義字段**    | 自定義字段名稱和內容（支持多條）                                             |
| **自我描述**      | 個人優勢和特點展示                                                           |

### 🎯 智能表單填充

#### 一鍵預填功能

- 點擊「📋 預填」按鈕，自動將簡歷數據填充到當前招聘網站的表單中
- 智能識別表單字段，自動匹配對應的簡歷資訊
- 支持 input、textarea、select、contenteditable 等多種表單元素
- 自動觸發表單事件（input、change、blur），確保網站驗證通過
- 填充完成後提供視覺反饋，高亮顯示已填充字段

#### 字段級精準填充（↗ 指向填充）

- 每個字段旁都有「↗」按鈕，支持**單字段精準填充**
- 點擊按鈕後進入「指向填充模式」：
  - 頁面頂部會顯示操作提示
  - 滑鼠懸停在可填充元素上時會高亮顯示（藍色邊框）
  - 點擊目標輸入框即可將該字段值填入
  - 按 `Esc` 鍵可取消操作
- 支持填充到：input、textarea、select、contenteditable 元素
- 自動觸發表單事件（input、change、blur），確保網站驗證通過
- 填充成功後自動關閉彈窗，方便連續操作

### 🤖 AI 大模型集成

支持多家國產大模型服務商，用於簡歷內容智能優化和字段匹配：

| 服務商                | 支持模型                                               |
| --------------------- | ------------------------------------------------------ |
| **DeepSeek**          | DeepSeek Chat、DeepSeek Coder                          |
| **Kimi (月之暗面)**   | Moonshot 8K/32K/128K                                   |
| **通義千問 (阿里雲)** | Qwen Turbo/Plus/Max/Max 長文本                         |
| **火山引擎 (豆包)**   | 豆包 Seed 1.6、豆包 Seed 1.6 Lite、豆包 Seed 1.6 Flash |
| **智譜 AI**           | GLM-4、GLM-4 Flash、GLM-3 Turbo                        |
| **百川智能**          | 百川 2 Turbo、百川 2 Turbo 192K                        |
| **自定義**            | 支持任意 OpenAI 兼容格式的 API                         |

**AI 功能特性**：

- 一鍵測試 API 連接
- **✨ AI 一鍵優化簡歷**：智能優化自我介紹、工作描述、專案描述等內容
- **🤖 AI 生成簡歷介紹**：基於簡歷數據智能生成專業的自我介紹（200-300 字）
  - 支持複製到剪貼板、填入自我描述字段、下載為 TXT 文件
- 使用 STAR 法則優化工作和專案描述
- 自動添加量化數據和成果描述

### 📤 多格式導出

- **JSON 導出**：導出完整簡歷數據，可用於備份和跨設備同步
- **LaTeX 導出**：生成專業的 LaTeX 簡歷模板
  - 可直接在 [Overleaf](https://www.overleaf.com/) 上編譯
  - 支持中文（使用 ctex 巨集包）
  - 專業排版，適合學術和技術崗位求職
  - 包含完整的樣式定義和註釋
- **🤖 AI 生成簡歷介紹**：調用 AI 模型智能生成專業自我介紹
  - 基於簡歷中的教育背景、工作經歷、專案經歷、技能特長生成
  - 支持複製到剪貼板
  - 支持一鍵填入自我描述字段
  - 支持下載為 `.txt` 文件
- **簡歷介紹提示詞導出**：導出結構化提示詞模板，支持 `.md`/`.txt`
  - 包含個人基本資訊提示
  - 工作經歷提問模板
  - 專案經驗詢問框架
  - 技能評估引導詞

### 💾 數據持久化

- **Chrome Storage API**：使用瀏覽器原生存儲，數據安全可靠
- **實時自動保存**：表單內容變化時自動保存，防止數據丟失
- **手動保存**：支持手動點擊保存按鈕確認保存
- **數據重置**：一鍵清空所有簡歷數據，重新開始
- **設定自動保存**：設定頁面的配置會自動保存

## 🏗️ 專案架構

```
super_resume/
├── docs                       # 介紹頁
├── manifest.json              # Chrome 擴展配置文件 (Manifest V3)
├── icons/                     # 擴展圖標
├── src/
│   ├── background/            # 後臺服務腳本
│   ├── content/               # 內容腳本（注入到網頁）
│   └── popup/                 # 彈出頁面
└── README.md
```

## 📦 安裝指南

### 方式一：開發者模式安裝

1. **下載專案**

   ```bash
   git clone https://github.com/itxaiohanglover/offer-laolao-plugin.git
   ```

   或直接下載 ZIP 並解壓

2. **開啟 Chrome 擴展管理頁面**

   - 在地址欄輸入：`chrome://extensions/`
   - 或通過菜單：更多工具 → 擴展程序

3. **開啟開發者模式**

   - 點擊右上角的「開發者模式」開關

4. **載入擴展**

   - 點擊「載入已解壓的擴展程序」
   - 選擇專案根目錄（包含 `manifest.json` 的文件夾）

5. **完成安裝**
   - 擴展圖標將出現在瀏覽器工具欄
   - 點擊圖標即可打開簡歷填寫助手

### 方式二：Edge 瀏覽器安裝

Edge 瀏覽器同樣支持 Chrome 擴展：

1. 開啟 `edge://extensions/`
2. 開啟「開發人員模式」
3. 點擊「載入解壓縮的擴展」
4. 選擇專案目錄

## 🚀 使用教程

### 第一步：配置 API（可選但推薦）

1. 點擊擴展圖標，切換到「⚙️ 設定」標籤頁
2. **配置 AI 模型**（用於內容優化，推薦）
   - 選擇模型提供商（如 DeepSeek、Kimi 等）
   - 填入對應的 API Key
   - 點擊「🔗 測試連接」驗證配置
3. **配置簡歷解析 API**（用於解析 PDF/DOCX 格式簡歷）
   - 在 [阿里雲市場](https://market.aliyun.com/detail/cmapi034316) 購買簡歷解析服務
   - 填入 API URL 和 APP Code

### 第二步：填寫或導入簡歷

#### 方式 A：智能上傳解析

1. 在「📝 簡歷填寫」標籤頁頂部找到上傳區域
2. 拖放簡歷文件或點擊選擇文件
3. 等待解析完成，點擊「使用解析數據」按鈕
4. 簡歷資訊將自動填充到表單中

#### 方式 B：手動填寫

1. 直接在表單中填寫各項資訊
2. 點擊「+ 添加」按鈕可添加多條經歷
3. 數據會自動保存，也可點擊「💾 保存」手動保存

#### 方式 C：導入 JSON

1. 如果有之前導出的 JSON 文件
2. 直接拖放到上傳區域即可導入

### 第三步：AI 優化簡歷（可選）

1. 確保已配置 AI 模型 API Key
2. 填寫好簡歷的描述性內容（自我介紹、工作描述、專案描述等）
3. 點擊「✨ AI 優化」按鈕
4. 系統會逐個優化所有描述性內容
5. 優化完成後自動填充回表單

### 第四步：在招聘網站填充簡歷

#### 一鍵預填（推薦）

1. 打開目標招聘網站的簡歷填寫頁面
2. 點擊擴展圖標打開彈窗
3. 點擊「📋 預填」按鈕
4. 擴展會自動識別並填充表單字段
5. 填充完成後會顯示填充詳情

#### 字段級精準填充

1. 找到需要填充的字段，點擊旁邊的「↗」按鈕
2. 彈窗會自動關閉，頁面進入「指向填充模式」
3. 在網頁中點擊目標輸入框
4. 字段值將被精準填入
5. 按 `Esc` 鍵可取消操作

### 第五步：導出備份

1. 點擊「📤 導出」按鈕
2. 選擇導出格式：
   - **JSON**：用於數據備份和導入
   - **LaTeX**：生成專業簡歷文檔，可在 Overleaf 編輯列印
   - **🤖 AI 生成簡歷介紹**：調用 AI 智能生成專業自我介紹
     - 生成完成後可複製、填入自我描述、或下載為 TXT 文件
   - **簡歷介紹提示詞**：導出用於與 AI 交互的結構化提示詞（支持 `.md`/`.txt`），文件名自動命名為"用戶姓名_簡歷提示詞_日期"

## 🌐 支持的招聘網站

本擴展採用通用表單識別技術，理論上支持所有招聘網站，包括但不限於：

- ✅ 智聯招聘 (zhaopin.com)
- ✅ 前程無憂 (51job.com)
- ✅ 獵聘網 (liepin.com)
- ✅ Boss 直聘 (zhipin.com)
- ✅ 拉勾網 (lagou.com)
- ✅ 脈脈 (maimai.cn)
- ✅ 實習僧 (shixiseng.com)
- ✅ 牛客網 (nowcoder.com)
- ✅ 字節跳動校招等各大公司官方招聘頁面

> 💡 提示：如果某個網站的表單無法自動識別，可以使用「字段級精準填充」功能手動指定填充位置。

## 🛠️ 技術棧

- **前端框架**：原生 JavaScript (ES6+)
- **擴展標準**：Chrome Extensions Manifest V3
- **存儲方案**：Chrome Storage API + localStorage
- **樣式方案**：原生 CSS（CSS 變數、Flexbox、Grid）
- **文檔格式**：LaTeX（ctex 中文支持）
- **API 集成**：
  - 阿里雲簡歷解析 API
  - OpenAI 兼容格式的大模型 API（DeepSeek、豆包（火山引擎）、通義千問等）

## ⚠️ 注意事項

1. **API 配置**：簡歷解析功能需要配置 API，否則只能使用 JSON 導入
2. **AI 優化**：需要配置 AI 模型 API Key 才能使用優化功能
3. **網站兼容性**：部分網站可能使用特殊的表單組件，建議使用字段級填充
4. **數據安全**：所有數據僅存儲在本地瀏覽器中，不會上傳到任何服務器
5. **瀏覽器權限**：擴展需要 `activeTab`、`scripting`、`storage` 權限才能正常工作
6. **特殊頁面**：`chrome://`、`edge://`、`about:` 等系統頁面不支持內容腳本注入

## 📋 更新日誌

### v1.0（當前版本）

## 📄 開源許可

本專案採用 [MIT License](LICENSE) 開源許可證。

## 🤝 貢獻與反饋

歡迎提交 Issue 和 Pull Request！

- 🐛 發現 Bug？請提交 [Issue](https://github.com/itxaiohanglover/offer-laolao-plugin/issues)
- 💡 有新想法？歡迎提交 [Feature Request](https://github.com/itxaiohanglover/offer-laolao-plugin/issues)
- 🔧 想貢獻代碼？歡迎提交 [Pull Request](https://github.com/itxaiohanglover/offer-laolao-plugin/pulls)

---

<p align="center">
  <strong>讓求職更輕鬆 ✨</strong>
</p>