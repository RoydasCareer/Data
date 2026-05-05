# 🔥 HiSponsor 완전 구축 가이드
> 프로그래밍 경험 없어도 "따라만 하면" 서비스 런칭까지 가능한 완전 가이드

**예산: $0 (완전 무료)** | **예상 소요 시간: 2~3일 (집중 시)**

---

## 📋 전체 로드맵

```
PHASE 1 (Day 1): 기반 세팅 (GitHub + Supabase + Cloudflare)
PHASE 2 (Day 2): 홈페이지 완성 + 배포
PHASE 3 (Day 3): AI 에이전트 연결
PHASE 4 (Week 2+): 채용 공고 자동화 + 성장
```

---

## 🛠️ 사용할 무료 도구 전체 목록

| 도구 | 역할 | 무료 한도 |
|------|------|----------|
| **GitHub** | 코드 저장소 | 무제한 |
| **Cloudflare Pages** | 웹사이트 호스팅 | 무제한 |
| **Supabase** | 데이터베이스 + 로그인 | 500MB DB, 1GB 파일 |
| **Claude (claude.ai)** | AI 코드 작성 도우미 | 무료 플랜 사용 |
| **ChatGPT** | 콘텐츠 작성 보조 | 무료 플랜 사용 |
| **Gemini** | 검색 + 번역 보조 | 무료 플랜 사용 |
| **n8n (cloud)** | AI 에이전트 자동화 | 무료 플랜 사용 |
| **Vercel** | (Cloudflare 대안) | 무료 플랜 사용 |

---

# PHASE 1: 기반 세팅

## ✅ STEP 1: GitHub 계정 만들기 (5분)

**GitHub = 코드를 저장하고 관리하는 곳**

1. 브라우저에서 `github.com` 접속
2. 오른쪽 상단 **"Sign up"** 클릭
3. 이메일 주소 입력 → **"Continue"** 클릭
4. 비밀번호 설정 (영문+숫자+특수문자)
5. 사용자명 입력 (예: `hisponsor` 또는 본인 이름)
6. **"Continue"** → 이메일 인증 완료
7. 요금제 선택: **"Free"** 선택 (맨 왼쪽) → **"Continue for free"**

> ✅ **확인**: 대시보드 화면이 보이면 완료

---

## ✅ STEP 2: 코드 저장소(Repository) 만들기 (3분)

1. GitHub 로그인 후 오른쪽 상단 **"+"** 버튼 클릭
2. **"New repository"** 클릭
3. 다음과 같이 입력:
   - **Repository name**: `hisponsor-web`
   - **Description**: `HiSponsor Global Job Platform`
   - **Public** 선택 (라디오 버튼)
   - **"Add a README file"** 체크 ✓
4. **"Create repository"** 클릭

> ✅ **확인**: 초록색 코드 버튼이 있는 저장소 페이지가 보이면 완료

---

## ✅ STEP 3: Supabase 설정 (10분)

**Supabase = 데이터베이스 + 사용자 로그인 + 파일 저장소**

### 3-1. 계정 만들기
1. `supabase.com` 접속
2. **"Start your project"** 클릭
3. **"Continue with GitHub"** 클릭
4. GitHub 로그인 허용 → 자동으로 계정 연결됨

### 3-2. 프로젝트 만들기
1. **"New project"** 클릭
2. 다음 입력:
   - **Name**: `hisponsor`
   - **Database Password**: 강력한 비밀번호 설정 (기록해두기!)
   - **Region**: `Northeast Asia (Tokyo)` 선택
3. **"Create new project"** 클릭
4. ⏳ 프로젝트 생성 완료까지 약 1~2분 대기

### 3-3. 데이터베이스 테이블 만들기
1. 왼쪽 메뉴에서 **"SQL Editor"** 클릭
2. **"+ New query"** 클릭
3. 아래 SQL 코드를 복사해서 붙여넣기:

```sql
-- 채용 공고 테이블
create table jobs (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  company text not null,
  company_logo text,
  location text,
  country text,
  category text,
  description text,
  requirements text,
  visa_sponsored boolean default true,
  visa_types text[],
  salary_min integer,
  salary_max integer,
  salary_currency text default 'USD',
  employment_type text default 'full-time',
  experience_level text,
  apply_url text,
  slug text unique,
  thumbnail text,
  is_featured boolean default false,
  is_active boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- 회사 테이블
create table companies (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  logo text,
  website text,
  description text,
  country text,
  size text,
  created_at timestamp default now()
);

-- 보안 설정 (RLS)
alter table jobs enable row level security;
alter table companies enable row level security;

create policy "누구나 채용공고 조회 가능"
on jobs for select using (true);

create policy "누구나 회사 조회 가능"
on companies for select using (true);

create policy "인증된 사용자만 공고 등록"
on jobs for insert with check (auth.role() = 'authenticated');
```

4. 오른쪽 위 **"Run"** 버튼 클릭
5. 하단에 "Success. No rows returned" 메시지 확인

### 3-4. API 키 복사하기
1. 왼쪽 메뉴 **"Settings"** (톱니바퀴 아이콘) 클릭
2. **"API"** 클릭
3. 다음 두 가지를 메모장에 복사:
   - **Project URL**: `https://xxxxx.supabase.co` 형태
   - **anon public** key: `eyJ...` 로 시작하는 긴 문자열

> ⚠️ **중요**: 이 키들은 나중에 홈페이지 코드에 넣을 예정

---

## ✅ STEP 4: 홈페이지 파일 Cloudflare Pages에 배포 (10분)

**Cloudflare Pages = 무료로 웹사이트를 전 세계에 배포하는 서비스**

1. `pages.cloudflare.com` 접속
2. **"Sign up"** → 이메일로 계정 생성
3. 이메일 인증 완료
4. 대시보드에서 **"Workers & Pages"** 클릭
5. **"Create application"** 클릭
6. **"Pages"** 탭 선택
7. **"Connect to Git"** 클릭
8. **"Connect GitHub"** → GitHub 로그인 허용
9. `hisponsor-web` 저장소 선택
10. **"Begin setup"** 클릭
11. 설정:
    - **Project name**: `hisponsor`
    - **Production branch**: `main`
    - **Framework preset**: `None`
    - **Build command**: (비워둠)
    - **Build output directory**: `/`
12. **"Save and Deploy"** 클릭
13. 배포 완료 후 `hisponsor.pages.dev` 주소로 접속 가능

---

# PHASE 2: 홈페이지 커스텀 & 완성

## ✅ STEP 5: Claude로 홈페이지 수정하기

**Claude = AI 코딩 도우미 (코드를 대신 짜줌)**

### 홈페이지 파일 GitHub에 올리기
1. GitHub에서 `hisponsor-web` 저장소 접속
2. **"Add file"** → **"Upload files"** 클릭
3. 제공받은 `hisponsor-homepage.html` 파일을 드래그 앤 드롭
4. 파일명을 `index.html`로 변경 (파일 이름 클릭 후 수정)
5. **"Commit changes"** 클릭

### Claude에게 수정 요청하는 방법
`claude.ai` 접속 후 다음과 같이 요청:

```
[Claude에게 보낼 메시지 예시]

내 HiSponsor 홈페이지 HTML 파일이 있어.
여기에 다음을 추가해줘:
1. 채용 공고를 Supabase DB에서 불러오는 JavaScript 코드
2. Supabase URL: [여기에 복사한 URL 붙여넣기]
3. Supabase Key: [여기에 복사한 Key 붙여넣기]

[HTML 코드 전체 붙여넣기]
```

---

## ✅ STEP 6: 채용 공고 추가하기 (Supabase 직접 입력)

1. Supabase 대시보드 → 왼쪽 **"Table Editor"** 클릭
2. `jobs` 테이블 클릭
3. **"+ Insert row"** 클릭
4. 다음 필드 입력:
   - `title`: 직무명 (예: "Senior Software Engineer")
   - `company`: 회사명 (예: "Google")
   - `location`: 위치 (예: "San Francisco, CA")
   - `country`: 국가 (예: "USA")
   - `category`: 직군 (예: "Software Engineering")
   - `description`: 직무 설명
   - `visa_sponsored`: `true` 선택
   - `apply_url`: 지원 링크
   - `slug`: URL용 이름 (예: "google-senior-swe-2025")
   - `is_active`: `true` 선택
5. **"Save"** 클릭

---

# PHASE 3: AI 에이전트 구성

## 🤖 AI 에이전트 전체 구조도

```
┌─────────────────────────────────────────────────────────────┐
│                    HiSponsor AI 에이전트 팀                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📡 에이전트 1: 공고 수집봇 (n8n + Claude)                    │
│  → 매일 새벽 3시 자동으로 비자 스폰서 공고 크롤링               │
│                                                             │
│  ✍️ 에이전트 2: 콘텐츠 작성봇 (Claude API)                    │
│  → 각 공고의 한국어 설명, SEO 텍스트 자동 생성                  │
│                                                             │
│  📊 에이전트 3: 분석봇 (Gemini + Supabase)                    │
│  → 어떤 공고가 인기인지, 어떤 국가가 핫한지 분석                 │
│                                                             │
│  📧 에이전트 4: 알림봇 (n8n + 이메일)                         │
│  → 구직자 조건에 맞는 새 공고 이메일 자동 발송                   │
│                                                             │
│  🗺️ 에이전트 5: 비자 가이드봇 (Claude)                        │
│  → 어떤 비자가 필요한지 AI가 설명해주는 채팅                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ STEP 7: n8n으로 공고 자동 수집 설정 (30분)

**n8n = 코드 없이 자동화 워크플로우 만드는 도구**

### 7-1. n8n Cloud 계정 만들기
1. `n8n.io` 접속
2. **"Get started free"** 클릭
3. 이메일로 계정 생성
4. 무료 플랜 선택 (workflows 5개, 실행 5000회/월)

### 7-2. 공고 자동 수집 워크플로우 만들기
1. n8n 대시보드 → **"New workflow"** 클릭
2. **"+"** 버튼 클릭 → 첫 번째 노드 추가

**노드 연결 순서:**

```
[Schedule] → [HTTP Request] → [Claude AI] → [Supabase] → [Done]
  매일 3시     공고 사이트 크롤   한국어 변환    DB 저장
```

### 7-3. Schedule 노드 설정
- **노드 타입**: "Schedule Trigger"
- **Rule**: Every Day
- **At Hour**: 3 (새벽 3시)

### 7-4. HTTP Request 노드 설정 (공고 가져오기)
- **노드 타입**: "HTTP Request"
- **Method**: GET
- **URL**: `https://remoteok.com/api` (무료 API)

> 💡 **더 많은 무료 공고 API:**
> - `https://www.arbeitnow.com/api/job-board-api` (유럽 취업, 비자 포함)
> - `https://remotive.com/api/remote-jobs` (리모트 공고)
> - `https://jobicy.com/api/v2/remote-jobs` (글로벌 공고)

### 7-5. Claude AI 노드 설정 (한국어 번역 + 설명 추가)
- **노드 타입**: "HTTP Request" (Claude API 호출)
- **URL**: `https://api.anthropic.com/v1/messages`
- **Method**: POST
- **Headers**:
  - `x-api-key`: Claude API 키 (다음 단계에서 발급)
  - `anthropic-version`: `2023-06-01`
  - `content-type`: `application/json`
- **Body (JSON)**:

```json
{
  "model": "claude-haiku-4-5-20251001",
  "max_tokens": 500,
  "messages": [{
    "role": "user",
    "content": "다음 채용 공고를 한국어로 번역하고 간결하게 요약해줘. JSON으로 반환: {title_kr, description_kr, requirements_kr}. 공고: {{$json.title}} - {{$json.description}}"
  }]
}
```

### 7-6. Supabase 노드 설정 (DB 저장)
- **노드 타입**: "Supabase"
- **Credential**: Supabase URL + Service Role Key 입력
- **Operation**: Insert
- **Table**: `jobs`

---

## ✅ STEP 8: Claude API 키 발급 (5분)

1. `console.anthropic.com` 접속
2. 구글 계정으로 로그인
3. 왼쪽 **"API Keys"** 클릭
4. **"Create Key"** 클릭
5. 이름 입력: `hisponsor-automation`
6. 생성된 키 (`sk-ant-...`) 메모장에 복사

> ⚠️ **중요**: 키는 한 번만 보여줌. 반드시 저장!
> 💰 **비용**: Claude Haiku 모델은 매우 저렴. 공고 1000개 번역 = 약 $0.10 (130원)

---

## ✅ STEP 9: 비자 가이드 AI 챗봇 추가

홈페이지에 "비자 상담 AI" 챗봇을 추가합니다.

### Claude에게 요청:
```
내 홈페이지에 플로팅 채팅 버튼을 추가해줘.
버튼 클릭하면 채팅창이 열리고,
Anthropic Claude API를 사용해서
사용자가 입력한 비자 관련 질문에 답변하는 챗봇을 만들어줘.

시스템 프롬프트:
"당신은 HiSponsor의 글로벌 취업 비자 전문 AI 어시스턴트입니다.
H1B, O1, EU 블루카드, 취업비자, 워킹홀리데이 등
다양한 비자 정보를 친절하게 안내합니다."

Anthropic API Key: [여기에 키 입력]
```

---

# PHASE 4: 성장 전략 (1인 AI 기업 구조)

## 🏢 AI 에이전트로 구성된 1인 기업 구조

```
나 (CEO + 전략)
    │
    ├── 📡 공고 수집 에이전트 (n8n + Claude)
    │       └── 매일 새로운 비자 스폰서 공고 자동 추가
    │
    ├── ✍️ 콘텐츠 에이전트 (Claude + Gemini)
    │       └── SEO 블로그 포스트 자동 작성
    │       └── 소셜미디어 포스팅 자동화
    │
    ├── 📊 분석 에이전트 (n8n + 데이터)
    │       └── 인기 공고 / 국가 / 직군 트렌드 분석
    │       └── 주간 리포트 자동 생성
    │
    ├── 📧 고객 소통 에이전트 (Claude + 이메일)
    │       └── 구직자 알림 이메일 자동화
    │       └── 기업 문의 자동 응답
    │
    └── 💰 수익화 에이전트 (나중에 추가)
            └── 유료 공고 등록 처리
            └── 프리미엄 회원 관리
```

---

## 📈 수익화 로드맵 (무료 → 유료)

### Phase 1: 트래픽 확보 (0~3개월)
- 무료로 공고 데이터 축적
- SEO 최적화 (Claude로 자동 작성)
- 커뮤니티 빌딩 (취업 성공 스토리)

### Phase 2: 수익화 시작 (3~6개월)
- **채용 기업 유료 등록**: 공고 1건당 $50~200
- **프리미엄 구직자**: 월 $9.99 (AI 매칭 + 비자 상담)
- **LinkedIn 스타일 광고**: CPM 기반

### Phase 3: 스케일업 (6개월+)
- API 제공 (다른 채용 사이트에 데이터 판매)
- B2B 채용 솔루션
- 비자 대행 업체 파트너십

---

## 🤖 각 AI 도구 활용 방법 상세

### Claude (claude.ai) 사용법
```
✅ 코드 작성/수정: "이 HTML에 검색 필터 기능 추가해줘"
✅ 공고 번역: "이 영어 공고를 SEO를 고려해 한국어로 번역해줘"
✅ 블로그 작성: "H1B 비자 취득 방법 SEO 블로그 포스트 2000자로 써줘"
✅ 오류 해결: "이 코드에서 오류가 나는데 이유와 해결법 알려줘"
```

### ChatGPT 사용법
```
✅ 마케팅 카피: "HiSponsor 홈페이지 캐치프레이즈 10개 만들어줘"
✅ 이메일 템플릿: "기업에게 공고 등록 요청하는 이메일 작성해줘"
✅ FAQ 작성: "글로벌 취업 관련 자주 묻는 질문 30개와 답변 만들어줘"
```

### Gemini 사용법
```
✅ 시장 조사: "2025년 H1B 스폰서십 현황 조사해줘"
✅ 경쟁사 분석: "Glassdoor, LinkedIn Jobs 대비 HiSponsor 차별화 포인트"
✅ 번역 검수: "이 한국어가 자연스러운지 확인해줘"
```

---

## 🔧 자주 사용하는 Claude 프롬프트 모음

### 공고 추가할 때
```
Supabase jobs 테이블에 다음 채용 공고를 추가하는 SQL을 작성해줘:
회사: [회사명]
직무: [직무명]
국가: [국가]
급여: [급여]
비자: H1B 스폰서 가능
지원링크: [URL]
```

### 새 기능 추가할 때
```
내 HiSponsor 홈페이지(아래 코드)에 [기능명]을 추가해줘.
요구사항:
- [요구사항 1]
- [요구사항 2]

[기존 코드 붙여넣기]
```

### 오류 해결할 때
```
아래 코드에서 [어떤 오류]가 발생해.
오류 메시지: [오류 메시지 복사]
원인과 해결방법을 알려줘.

[오류가 있는 코드]
```

---

## 📁 파일 구조 (최종 완성 시)

```
hisponsor-web/
├── index.html          ← 홈페이지 (메인)
├── jobs/
│   └── index.html      ← 채용 공고 목록
├── jobs/[slug]/
│   └── index.html      ← 채용 공고 상세
├── about.html          ← 소개 페이지
├── visa-guide.html     ← 비자 가이드
├── assets/
│   ├── logo-horizontal.png
│   ├── logo-vertical.png
│   └── favicon.ico
└── _redirects          ← Cloudflare 라우팅 설정
```

---

## ⚡ 자주 하는 실수 & 해결법

| 문제 | 원인 | 해결법 |
|------|------|--------|
| 홈페이지가 안 보임 | 파일명이 index.html이 아님 | 파일명 확인 |
| 공고가 안 불러와짐 | Supabase 키가 틀림 | 키 재확인 |
| AI 채팅이 안 됨 | Claude API 키 오류 | 키 재발급 |
| 이미지가 안 보임 | 파일 경로 오류 | 상대경로 확인 |

---

## 🎯 이번 주 할 일 체크리스트

```
□ GitHub 계정 만들기
□ hisponsor-web 저장소 만들기
□ Supabase 프로젝트 생성
□ DB 테이블 생성 (SQL 실행)
□ Cloudflare Pages 연결
□ index.html 업로드
□ 채용 공고 10개 수동 입력
□ n8n 계정 만들기
□ 공고 자동 수집 워크플로우 설정
□ Claude API 키 발급
□ 비자 챗봇 추가
```

---

## 💬 막힐 때 Claude에게 물어보는 방법

### 정확한 도움을 받는 팁:
1. **상황 설명**: "HiSponsor라는 채용 플랫폼을 Cloudflare Pages + Supabase로 만들고 있어"
2. **구체적 목표**: "채용 공고 카드에 필터 기능을 추가하고 싶어"
3. **현재 코드**: 관련 코드 전체 붙여넣기
4. **오류가 있다면**: 오류 메시지도 함께

**좋은 예시:**
```
HiSponsor 채용 플랫폼 개발 중이야.
Supabase에서 jobs 테이블 데이터를 가져와서
country 필드로 필터링하는 기능을 추가하고 싶어.
현재 코드는 아래와 같아:
[코드 붙여넣기]
```

---

*이 가이드는 HiSponsor를 위해 Claude가 작성했습니다. 막히는 부분이 있으면 언제든 claude.ai에서 질문하세요! 🔥*
