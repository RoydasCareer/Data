// ============================================================
// ✏️ HiSponsor 사이트 커스텀 설정 파일
// ============================================================
//
// ▶ 이 파일만 수정하면 사이트 전체가 바뀝니다!
// ▶ 프로그래밍을 몰라도 아래 값들만 바꾸면 됩니다.
// ▶ 주석(// 로 시작하는 줄)은 삭제하거나 수정해도 괜찮습니다.
// ▶ 문자열(텍스트)은 반드시 작은따옴표('') 또는 큰따옴표("") 안에 넣으세요.
//
// 📁 이 파일의 위치: src/app/config.ts
// ============================================================

export const SITE_CONFIG = {

  // ──────────────────────────────────────────────
  // 🏷️ 사이트 기본 정보
  // ──────────────────────────────────────────────
  siteName: 'HiSponsor',                             // 사이트 이름 (탭, 헤더에 표시)
  siteTaglineKr: '글로벌 비자 스폰서 채용 플랫폼',       // 한국어 슬로건
  siteTaglineEn: 'Global Visa Sponsorship Platform',  // 영어 슬로건

  // ──────────────────────────────────────────────
  // 📬 연락처 정보 (푸터에 표시됩니다)
  // ──────────────────────────────────────────────
  contact: {
    email: 'hello@hisponsor.com',       // 이메일 주소
    phone: '+82 02-000-0000',           // 전화번호
    address: 'Seoul, South Korea',      // 주소
  },

  // ──────────────────────────────────────────────
  // 🔗 소셜 미디어 링크 (푸터 아이콘에 연결됩니다)
  // 링크가 없으면 '#' 그대로 두세요
  // ──────────────────────────────────────────────
  social: {
    linkedin:  'https://linkedin.com/company/hisponsor',
    twitter:   'https://twitter.com/hisponsor',
    instagram: 'https://instagram.com/hisponsor',
    facebook:  'https://facebook.com/hisponsor',
  },

  // ──────────────────────────────────────────────
  // 🌟 메인 배너 (히어로 섹션) 설정
  // 사이트 맨 위의 큰 배너 이미지 위에 표시되는 텍스트입니다
  // ──────────────────────────────────────────────
  hero: {
    badgeText: '비자 스폰서십 전문 플랫폼',            // 배너 상단 뱃지 텍스트
    headlineEn: 'Find Your Path to\nInternational Career Growth', // 영어 제목 (\n = 줄바꿈)
    subtitleKr: '해외 취업에 필요한 채용 공고, 비자 가이드, 이력서 템플릿을 한 곳에서.',  // 한국어 부제목
    searchPlaceholder: '검색어를 입력하세요 / Search...',  // 검색창 안내 문구
    searchButtonText: '검색',                           // 검색 버튼 텍스트
  },

  // ──────────────────────────────────────────────
  // 📊 사이트 통계 (배너 아래 숫자 카드)
  // value: 표시할 숫자, labelKr: 한국어 설명, labelEn: 영어 설명
  // ──────────────────────────────────────────────
  stats: [
    { value: '94+', labelKr: '채용 공고',  labelEn: 'Job Posts' },
    { value: '38+', labelKr: '비자 가이드', labelEn: 'Visa Guides' },
    { value: '21+', labelKr: '템플릿',     labelEn: 'Templates' },
    { value: '9',   labelKr: '지원 국가',  labelEn: 'Countries' },
  ],

  // ──────────────────────────────────────────────
  // 📧 뉴스레터 구독 섹션 (푸터 상단)
  // ──────────────────────────────────────────────
  newsletter: {
    titleKr: '스폰서십 최신 정보를 이메일로 받아보세요',
    titleEn: 'Stay ahead in your sponsorship journey',
    subtitleKr: '최신 채용 공고, 비자 업데이트, 가이드를 메일로 받으세요.',
    inputPlaceholder: '이메일 주소를 입력하세요 / your@email.com',
    buttonText: '구독하기 Subscribe',
  },

  // ──────────────────────────────────────────────
  // 🌍 푸터 - 인기 국가 바로가기 링크
  // flag: 국기 이모지, labelKr: 한국어, labelEn: 영어
  // ──────────────────────────────────────────────
  topDestinations: [
    { flag: '🇺🇸', labelKr: '미국',     labelEn: 'USA' },
    { flag: '🇨🇦', labelKr: '캐나다',   labelEn: 'Canada' },
    { flag: '🇬🇧', labelKr: '영국',     labelEn: 'UK' },
    { flag: '🇦🇺', labelKr: '호주',     labelEn: 'Australia' },
    { flag: '🇩🇪', labelKr: '독일',     labelEn: 'Germany' },
    { flag: '🇸🇬', labelKr: '싱가포르', labelEn: 'Singapore' },
  ],

  // ──────────────────────────────────────────────
  // ©️ 저작권 문구 (푸터 맨 아래)
  // ──────────────────────────────────────────────
  copyright: '© 2026 HiSponsor. All rights reserved.',

  // ──────────────────────────────────────────────
  // 🎨 브랜드 색상 (CSS 클래스 이름으로 지정)
  // TailwindCSS 색상 이름을 사용합니다
  // 예: 'blue', 'indigo', 'violet', 'emerald', 'orange', 'rose'
  // → 바꾸면 버튼, 뱃지, 링크 색상이 모두 바뀝니다
  // ──────────────────────────────────────────────
  brandColor: 'blue',  // 현재: 파란색 계열
};
