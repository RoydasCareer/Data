# HiSponsor — 커스텀 및 운영 가이드 (한국어)

> 한국어/영어 이중 언어 글로벌 비자 스폰서 채용 플랫폼  
> React + Vite + TailwindCSS 기반. 초기에는 백엔드 없이도 바로 배포 가능합니다.

---

## 📁 프로젝트 파일 구조

```
hisponsor/
├── index.html                  ← 브라우저 탭 제목 & SEO 메타 태그
├── package.json                ← 의존성 패키지 목록 (직접 수정하지 마세요)
├── vite.config.ts              ← 빌드 도구 설정 (직접 수정하지 마세요)
├── tsconfig.json               ← TypeScript 설정 (직접 수정하지 마세요)
│
└── src/
    ├── main.tsx                ← 앱 시작 진입점 (수정 불필요)
    ├── styles/
    │   └── index.css           ← 전역 CSS (폰트, 배경, 스크롤바)
    └── app/
        ├── App.tsx             ← 최상위 레이아웃 (Header + Catalogue + Footer 조립)
        ├── config.ts           ★ 메인 커스텀 파일 — 여기부터 수정하세요!
        ├── data/
        │   └── posts.ts        ★ 모든 게시물 데이터가 여기에 있습니다
        └── components/
            ├── Header.tsx      ← 상단 네비게이션 바
            ├── PostCatalogue.tsx ← 히어로 배너 + 카테고리 탭 + 카드 그리드
            ├── PostCard.tsx    ← 개별 카드 (그리드/리스트 뷰)
            ├── FilterPanel.tsx ← 사이드바 필터 (카테고리 + 국가)
            └── Footer.tsx      ← 뉴스레터 + 링크 + 소셜 + 저작권
```

---

## ✏️ 커스텀 방법 — 빠른 참조

### 1. 사이트 이름, 연락처, 소셜 링크 변경
**수정 파일:** `src/app/config.ts`

```ts
siteName: 'HiSponsor',          // ← 브랜드 이름으로 변경
contact: {
  email: 'hello@hisponsor.com', // ← 내 이메일
  phone: '+82 02-000-0000',     // ← 내 전화번호
},
social: {
  linkedin: 'https://...',      // ← 내 LinkedIn URL
},
```

### 2. 메인 배너(히어로) 텍스트 변경
**수정 파일:** `src/app/config.ts` → `hero` 섹션

```ts
hero: {
  badgeText: '비자 스폰서십 전문 플랫폼',   // ← 배너 상단 뱃지 텍스트
  headlineEn: 'Find Your Path to\nInternational Career Growth',  // ← 영어 제목
  subtitleKr: '해외 취업에 필요한...',        // ← 한국어 부제목
}
```

### 3. 게시물 카드 추가 / 수정 / 삭제
**수정 파일:** `src/app/data/posts.ts` → `MOCK_POSTS` 배열

**카드 추가:** 아래 예시를 복사해서 `MOCK_POSTS` 배열 맨 위에 붙여넣기

```ts
{
  id: '13',                        // 고유 번호 (마지막 번호 + 1)
  title: '영어 제목',
  titleKr: '한국어 제목',
  excerpt: '영어 요약...',
  excerptKr: '한국어 요약...',
  category: 'jobs',                // 'jobs' | 'information' | 'template' 중 선택
  country: 'USA',                  // COUNTRIES 배열의 id와 반드시 일치
  date: '2025-05-01',             // YYYY-MM-DD 형식
  author: '작성자 이름',
  authorInitial: 'A',              // 이름 첫 글자 (아바타에 표시)
  image: 'https://이미지URL.jpg',
  readTime: 5,                     // 읽는 시간 (분)
  views: 100,                      // 조회수
  isNew: true,                     // NEW 뱃지. 필요 없으면 이 줄 삭제
},
```

**카드 삭제:** 해당 `{ ... }` 블록 전체를 지우세요.

**카드 수정:** 해당 블록의 값을 원하는 내용으로 바꾸세요.

---

### 4. 카테고리 색상 변경
**수정 파일:** `src/app/data/posts.ts` → `CATEGORY_META`

```ts
jobs: { color: 'bg-orange-50 text-orange-700 border-orange-200' },
//  'orange' 부분을 원하는 색으로 변경:
//  red, green, yellow, pink, indigo, violet, emerald 등 사용 가능
```

### 5. 국가 필터 목록 추가/삭제
**수정 파일:** `src/app/data/posts.ts` → `COUNTRIES` 배열

```ts
// 추가 예시:
{ id: 'France', flag: '🇫🇷', labelEn: 'France', labelKr: '프랑스' },
// id는 게시물의 country 값과 반드시 일치해야 합니다
```

### 6. 푸터 인기 국가 링크 변경
**수정 파일:** `src/app/config.ts` → `topDestinations` 배열

### 7. 통계 숫자 변경 (배너 하단 카드)
**수정 파일:** `src/app/config.ts` → `stats` 배열

```ts
stats: [
  { value: '94+', labelKr: '채용 공고', labelEn: 'Job Posts' },
  // value 값을 원하는 숫자로 바꾸세요
],
```

---

## 🖼️ 이미지 에셋

위치: `src/assets/`

| 파일명 | 사용 위치 |
|--------|---------|
| `Horizontal_Logo.png` | 헤더(데스크탑), 푸터 |
| `Vertical_Logo.png` | 헤더(모바일) |
| `Web_Header_Banner.png` | 히어로 섹션 배경 |
| `favicon-32x32.png` | 브라우저 탭 아이콘 |

로고를 교체하려면 **같은 파일명으로** 새 이미지를 덮어쓰면 됩니다.  
파일명을 바꾸려면 `Header.tsx`와 `Footer.tsx`의 import 경로도 함께 수정해야 합니다.

---

## 🚀 로컬에서 실행하는 방법

```bash
# 1단계: 의존성 설치 (처음 한 번만)
cd E:\jobcollect\Antigravity\hisponsor
npm install

# 2단계: 개발 서버 시작
npm run dev

# 3단계: 브라우저에서 http://localhost:5173 접속
```

## 📦 Cloudflare Pages 배포 방법

```bash
# 빌드 파일 생성
npm run build
# dist/ 폴더가 생성됩니다
# Cloudflare Pages에서 이 폴더를 업로드하거나
# GitHub 저장소와 연결하면 자동 배포됩니다
```

---

## 🔧 컴포넌트별 역할 정리

| 컴포넌트 | 파일 | 담당하는 것 |
|---------|------|-----------|
| 헤더 | `Header.tsx` | 로고, 네비게이션, 검색창, 버튼 |
| 히어로 배너 | `PostCatalogue.tsx` 상단 | 배경 이미지, 제목, 검색창 |
| 카테고리 탭 | `PostCatalogue.tsx` 중간 | 전체/채용/정보/템플릿 탭 |
| 카드 그리드 | `PostCatalogue.tsx` 하단 | 카드 정렬, 뷰 전환 |
| 개별 카드 | `PostCard.tsx` | 카드 디자인, 북마크 버튼 |
| 사이드바 필터 | `FilterPanel.tsx` | 카테고리/국가 체크박스 |
| 푸터 | `Footer.tsx` | 뉴스레터, 링크, 소셜, 저작권 |

---

## ❓ 자주 묻는 질문

**Q: 검색이 안 돼요**  
A: 게시물의 `title`, `titleKr`, `excerptKr` 필드에 검색어가 포함되어야 합니다.

**Q: 필터에서 국가가 안 나와요**  
A: `posts.ts`의 `COUNTRIES` 배열에 해당 국가가 있는지 확인하세요.  
게시물의 `country` 필드 값과 `COUNTRIES`의 `id` 값이 정확히 일치해야 합니다.

**Q: 이미지가 안 보여요**  
A: 이미지 URL이 올바른지 확인하세요. URL이 잘못되면 자동으로 기본 아이콘이 표시됩니다.

**Q: Supabase DB는 어떻게 연결하나요?**  
A: `HiSponsor-완전정복-가이드.md` 파일에 전체 DB 스키마와 연결 방법이 안내되어 있습니다.  
DB를 연결하면 `posts.ts`의 `MOCK_POSTS`를 Supabase API 호출로 교체하면 됩니다.

---

*이 README는 HiSponsor 프로젝트를 위해 작성되었습니다.*
