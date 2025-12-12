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

# 🚀 Offer Laolao - 이력서 자동 입력 어시스턴트 스마트 브라우저 플러그인

> 스마트한 이력서 분석과 수동 입력의 이중 모드를 지원하는 강력한 Chrome 브라우저 확장 프로그램으로, **AI 스마트 필드 매칭**과 **필드 수준의 정밀 입력** 기능을 제공하여 구직자가 주요 채용 사이트에서 빠르고 정확하게 이력서를 작성할 수 있도록 지원합니다.

![Version](https://img.shields.io/badge/Version-1.0-blue)
![Chrome](https://img.shields.io/badge/Chrome-Extension-green)
![Manifest](https://img.shields.io/badge/Manifest-V3-orange)

🌐 **온라인 액세스**：[https://offer-laolao-plugin.vercel.app](https://offer-laolao-plugin.vercel.app)

## ✨ 주요 기능 특성

### 📄 스마트 이력서 분석

- **다중 형식 지원**：PDF、DOCX、DOC、TXT、JSON 등의 주류 이력서 형식을 지원
- **클라우드 API 분석**：Alibaba Cloud 마켓플레이스의 이력서 분석 API를 통합하여 이력서 정보를 정확하게 추출
- **JSON 직접 가져오기**：JSON 형식의 이력서 데이터를 직접 가져와 데이터 백업 및 복원을 실현
- **드래그 앤 드롭 업로드**：파일의 드래그 앤 드롭 업로드를 지원하여 조작이 간편
- **스마트 필드 매핑**：분석 결과를 자동으로 해당 폼 필드에 매핑

### 📝 완전한 이력서 정보 관리

다음과 같은 이력서 모듈의 작성과 관리를 지원：

| 모듈              | 포함 필드                                                                     |
| ----------------- | ---------------------------------------------------------------------------- |
| **기본 정보**      | 이름、성별、생년월일、휴대폰 번호、이메일、신분증 번호、소재지、정치적 성격         |
| **구직 희망**      | 희망 직무、희망 업종、희망 급여、희망 근무지、인턴 기간、근무 가능 시간                 |
| **교육 경험**      | 학교 이름、전공、학위（전문/학사/석사/박사）、순위、입학/졸업 날짜（다중 항목 지원） |
| **직업/인턴 경험** | 회사 이름、직위、시작/종료 날짜、업무 설명（다중 항목 지원）                          |
| **프로젝트 경험**      | 프로젝트 이름、역할、프로젝트 기간、프로젝트 설명、책임 설명（다중 항목 지원）                 |
| **기술 정보**      | 기술 이름、기술 수준（초급/중급/고급/전문가）（다중 항목 지원）                        |
| **언어 능력**      | 언어 이름、숙련도（입문/기초/숙련/통달）、언어 자격증（다중 항목 지원）              |
| **사용자 정의 필드**    | 사용자 정의 필드 이름과 내용（다중 항목 지원）                                             |
| **자기 소개**      | 개인의 강점과 특징 표시                                                           |

### 🎯 스마트 폼 입력

#### 원클릭 사전 입력 기능

- 「📋 사전 입력」버튼을 클릭하여 이력서 데이터를 현재 채용 사이트의 폼에 자동으로 입력
- 폼 필드를 스마트하게 인식하고 해당 이력서 정보를 자동으로 매칭
- input、textarea、select、contenteditable 등 다양한 폼 요소를 지원
- 폼 이벤트（input、change、blur）를 자동으로 트리거하여 사이트 검증을 보장
- 입력 완료 후 시각적 피드백을 제공하고 입력된 필드를 강조 표시

#### 필드 수준의 정밀 입력（↗ 포인트 입력）

- 각 필드에는 「↗」버튼이 있어 **단일 필드 정밀 입력**을 지원
- 버튼을 클릭하면「포인트 입력 모드」에 진입：
  - 페이지 상단에操作 안내가 표시됩니다
  - 마우스가 입력 가능한 요소에 호버하면 강조 표시（파란색 테두리）가 됩니다
  - 대상 입력 상자를 클릭하면 해당 필드 값이 입력됩니다
  - `Esc` 키를 눌러操作를 취소할 수 있습니다
- input、textarea、select、contenteditable 요소에 대한 입력을 지원
- 폼 이벤트（input、change、blur）를 자동으로 트리거하여 사이트 검증을 보장
- 입력 성공 후 팝업이 자동으로 닫혀 연속操作이 용이

### 🤖 AI 대형 모델 통합

이력서 내용의 스마트 최적화와 필드 매칭을 위해 여러 국내 대형 모델 서비스 제공자를 지원：

| 서비스 제공자                | 지원 모델                                               |
| --------------------- | ------------------------------------------------------ |
| **DeepSeek**          | DeepSeek Chat、DeepSeek Coder                          |
| **Kimi (Moonshot)**   | Moonshot 8K/32K/128K                                   |
| **Tongyi Qianwen (Alibaba Cloud)** | Qwen Turbo/Plus/Max/Max 장 텍스트                         |
| **Volcano Engine (Doubao)**   | Doubao Seed 1.6、Doubao Seed 1.6 Lite、Doubao Seed 1.6 Flash |
| **Zhipu AI**           | GLM-4、GLM-4 Flash、GLM-3 Turbo                        |
| **Baichuan Intelligence**          | Baichuan 2 Turbo、Baichuan 2 Turbo 192K                        |
| **사용자 정의**            | 모든 OpenAI 호환 형식의 API를 지원                         |

**AI 기능 특성**：

- 원클릭 API 연결 테스트
- **✨ AI 원클릭 이력서 최적화**：자기 소개、업무 설명、프로젝트 설명 등의 내용을 스마트하게 최적화
- **🤖 AI 생성 이력서 소개**：이력서 데이터를 기반으로 전문적인 자기 소개를 스마트하게 생성（200-300 자）
  - 클립보드에 복사、자기 소개 필드에 입력、TXT 파일로 다운로드 지원
- STAR 법칙을 사용하여 업무와 프로젝트 설명을 최적화
- 정량적 데이터와 성과 설명을 자동으로 추가

### 📤 다중 형식 내보내기

- **JSON 내보내기**：완전한 이력서 데이터를 내보내 백업과 크로스 디바이스 동기화에 사용
- **LaTeX 내보내기**：전문적인 LaTeX 이력서 템플릿 생성
  - [Overleaf](https://www.overleaf.com/)에서 직접 컴파일 가능
  - 중국어 지원（ctex 패키지 사용）
  - 전문적인 배치로 학술 및 기술 채용에 적합합니다
  - 완전한 스타일 정의와 주석이 포함되어 있습니다
- **🤖 AI 생성 이력서 소개**：AI 모델을 호출하여 전문적인 자기 소개를 스마트하게 생성
  - 이력서의 교육 배경、직업 경험、프로젝트 경험、기술 특장을 기반으로 생성
  - 클립보드에 복사 지원
  - 자기 소개 필드에 원클릭 입력 지원
  - `.txt` 파일로 다운로드 지원
- **이력서 소개 프롬프트 내보내기**：구조화된 프롬프트 템플릿 내보내기，`.md`/`.txt` 지원
  - 개인 기본 정보 프롬프트 포함
  - 직업 경험 질문 템플릿
  - 프로젝트 경험 문의 프레임워크
  - 기술 평가 안내어

### 💾 데이터 영구 저장

- **Chrome Storage API**：브라우저의 네이티브 스토리지를 사용하여 데이터가 안전하고 신뢰할 수 있습니다
- **실시간 자동 저장**：폼 내용이 변경될 때 자동으로 저장되어 데이터 손실을 방지
- **수동 저장**：저장 버튼을 수동으로 클릭하여 저장을 확인할 수 있습니다
- **데이터 초기화**：원클릭으로 모든 이력서 데이터를 지우고 다시 시작
- **설정 자동 저장**：설정 페이지의 설정은 자동으로 저장됩니다

## 🏗️ 프로젝트 아키텍처

```
super_resume/
├── docs                       # 소개 페이지
├── manifest.json              # Chrome 확장 프로그램 설정 파일 (Manifest V3)
├── icons/                     # 확장 프로그램 아이콘
├── src/
│   ├── background/            # 백그라운드 서비스 스크립트
│   ├── content/               # 콘텐츠 스크립트（웹 페이지에 주입）
│   └── popup/                 # 팝업 페이지
└── README.md
```

## 📦 설치 가이드

### 방법 1：개발자 모드로 설치

1. **프로젝트 다운로드**

   ```bash
   git clone https://github.com/itxaiohanglover/offer-laolao-plugin.git
   ```

   또는 직접 ZIP을 다운로드하여 압축을 풉니다

2. **Chrome 확장 프로그램 관리 페이지 열기**

   - 주소 표시줄에 입력：`chrome://extensions/`
   - 또는 메뉴：더 많은 도구 → 확장 프로그램

3. **개발자 모드 활성화**

   - 오른쪽 상단의「개발자 모드」스위치를 클릭합니다

4. **확장 프로그램 로드**

   -「압축 해제된 확장 프로그램 로드」를 클릭합니다
   - 프로젝트의 루트 디렉토리（`manifest.json`이 포함된 폴더）를 선택합니다

5. **설치 완료**
   - 확장 프로그램 아이콘이 브라우저 도구 모음에 표시됩니다
   - 아이콘을 클릭하여 이력서 입력 어시스턴트를 엽니다

### 방법 2：Edge 브라우저에서 설치

Edge 브라우저도 Chrome 확장 프로그램을 지원합니다：

1. `edge://extensions/`를 엽니다
2.「개발자 모드」를 활성화합니다
3.「압축 해제된 확장 프로그램 로드」를 클릭합니다
4. 프로젝트 디렉토리를 선택합니다

## 🚀 사용 튜토리얼

### 단계 1：API 설정（선택 사항이지만 권장）

1. 확장 프로그램 아이콘을 클릭하고「⚙️ 설정」탭으로 전환합니다
2. **AI 모델 설정**（컨텐츠 최적화용，권장）
   - 모델 제공자를 선택합니다（DeepSeek、Kimi 등）
   - 해당 API Key를 입력합니다
   -「🔗 연결 테스트」버튼을 클릭하여 설정을 확인합니다
3. **이력서 분석 API 설정**（PDF/DOCX 형식의 이력서를 분석하기 위해）
   - [Alibaba Cloud Marketplace](https://market.aliyun.com/detail/cmapi034316)에서 이력서 분석 서비스를 구매합니다
   - API URL과 APP Code를 입력합니다

### 단계 2：이력서 작성 또는 가져오기

#### 방법 A：스마트 업로드 분석

1.「📝 이력서 작성」탭 상단에 있는 업로드 영역을 찾습니다
2. 이력서 파일을 드래그 앤 드롭하거나 파일을 선택합니다
3. 분석 완료를 기다리고「분석 데이터 사용」버튼을 클릭합니다
4. 이력서 정보가 폼에 자동으로 입력됩니다

#### 방법 B：수동 작성

1. 폼에 직접 각종 정보를 작성합니다
2.「+ 추가」버튼을 클릭하여 여러 경험을 추가할 수 있습니다
3. 데이터는 자동으로 저장되지만「💾 저장」을 클릭하여 수동으로 저장할 수도 있습니다

#### 방법 C：JSON 가져오기

1. 이전에 내보낸 JSON 파일이 있는 경우
2. 업로드 영역에 직접 드래그 앤 드롭하여 가져올 수 있습니다

### 단계 3：AI로 이력서 최적화（선택 사항）

1. AI 모델의 API Key가 설정되어 있는지 확인합니다
2. 이력서의 설명 내용（자기 소개、업무 설명、프로젝트 설명 등）을 작성합니다
3.「✨ AI 최적화」버튼을 클릭합니다
4. 시스템은 모든 설명 내용을 하나씩 최적화합니다
5. 최적화가 완료되면 내용이 폼에 자동으로 입력됩니다

### 단계 4：채용 사이트에서 이력서 입력

#### 원클릭 사전 입력（권장）

1. 대상 채용 사이트의 이력서 작성 페이지를 엽니다
2. 확장 프로그램 아이콘을 클릭하여 팝업을 엽니다
3.「📋 사전 입력」버튼을 클릭합니다
4. 확장 프로그램이 자동으로 폼 필드를 인식하고 입력합니다
5. 입력 완료 후 입력 세부 정보가 표시됩니다

#### 필드 수준의 정밀 입력

1. 입력할 필드를 찾고 옆에 있는「↗」버튼을 클릭합니다
2. 팝업이 자동으로 닫히고 페이지가「포인트 입력 모드」에 진입합니다
3. 웹 페이지에서 대상 입력 상자를 클릭합니다
4. 필드 값이 정밀하게 입력됩니다
5. `Esc` 키를 눌러操作를 취소할 수 있습니다

### 단계 5：내보내기 및 백업

1.「📤 내보내기」버튼을 클릭합니다
2. 내보내기 형식을 선택합니다：
   - **JSON**：데이터 백업 및 가져오기에 사용
   - **LaTeX**：Overleaf에서 편집 및 인쇄할 수 있는 전문적인 이력서 문서를 생성
   - **🤖 AI 생성 이력서 소개**：AI를 호출하여 전문적인 자기 소개를 스마트하게 생성
     - 생성 후 복사、자기 소개에 입력、또는 TXT 파일로 다운로드할 수 있습니다
   - **이력서 소개 프롬프트**：AI와 대화하기 위한 구조화된 프롬프트를 내보내기（`.md`/`.txt` 지원），파일 이름은 자동으로「사용자 이름_이력서 프롬프트_날짜」로 명명됩니다

## 🌐 지원되는 채용 사이트

이 확장 프로그램은 범용 폼 인식 기술을 사용하여 이론적으로 모든 채용 사이트를 지원합니다. 주요 예시는 다음과 같습니다：

- ✅ 지련 채용 (zhaopin.com)
- ✅ 51job (51job.com)
- ✅ Liepin (liepin.com)
- ✅ Boss 직접 채용 (zhipin.com)
- ✅ Lagou (lagou.com)
- ✅ 마이마이 (maimai.cn)
- ✅ 실습생 (shixiseng.com)
- ✅ Niuke.com (nowcoder.com)
- ✅ ByteDance 캠퍼스 채용 등 주요 기업 공식 채용 페이지

> 💡 팁：특정 사이트의 폼이 자동으로 인식되지 않는 경우「필드 수준의 정밀 입력」기능을 사용하여 수동으로 입력 위치를 지정할 수 있습니다.

## 🛠️ 기술 스택

- **프론트엔드 프레임워크**：네이티브 JavaScript (ES6+)
- **확장 프로그램 표준**：Chrome Extensions Manifest V3
- **스토리지 솔루션**：Chrome Storage API + localStorage
- **스타일 솔루션**：네이티브 CSS（CSS 변수、Flexbox、Grid）
- **문서 형식**：LaTeX（ctex 중국어 지원）
- **API 통합**：
  - Alibaba Cloud 이력서 분석 API
  - OpenAI 호환 형식의 대형 모델 API（DeepSeek、豆包（火山引擎）、通义千问 등）

## ⚠️ 주의 사항

1. **API 설정**：이력서 분석 기능에는 API 설정이 필요하며，그렇지 않으면 JSON 가져오기만 사용할 수 있습니다
2. **AI 최적화**：최적화 기능을 사용하려면 AI 모델의 API Key를 설정해야 합니다
3. **사이트 호환성**：일부 사이트에서는 특수 폼 구성 요소가 사용될 수 있으므로 필드 수준의 입력을 사용하는 것이 권장됩니다
4. **데이터 보안**：모든 데이터는 브라우저의 로컬에만 저장되며 어떤 서버에도 업로드되지 않습니다
5. **브라우저 권한**：확장 프로그램이 정상적으로 작동하려면 `activeTab`、`scripting`、`storage` 권한이 필요합니다
6. **특수 페이지**：`chrome://`、`edge://`、`about:` 등의 시스템 페이지에서는 콘텐츠 스크립트 주입이 지원되지 않습니다

## 📋 업데이트 기록

### v1.0（현재 버전）

## 📄 오픈 소스 라이선스

이 프로젝트는 [MIT License](LICENSE) 하에 라이선스가 부여됩니다.

## 🤝 기여 및 피드백

Issue와 Pull Request를 환영합니다！

- 🐛 버그를 발견하셨나요？[Issue](https://github.com/itxaiohanglover/offer-laolao-plugin/issues)를 제출해주세요
- 💡 새로운 아이디어가 있으신가요？[Feature Request](https://github.com/itxaiohanglover/offer-laolao-plugin/issues)를 제출해주세요
- 🔧 코드에 기여하고 싶으신가요？[Pull Request](https://github.com/itxaiohanglover/offer-laolao-plugin/pulls)를 제출해주세요

---

<p align="center">
  <strong>구직을 더 쉽게 만드세요 ✨</strong>
</p>