// ============================================================
// 📌 posts.ts — 콘텐츠 데이터 파일
// ============================================================
//
// 이 파일이 하는 일:
//   - 사이트에 표시할 게시물(채용/정보/템플릿) 데이터를 담습니다
//   - 카테고리, 국가 목록도 여기서 관리합니다
//
// ✏️ 게시물을 추가/수정하는 방법:
//   1. MOCK_POSTS 배열에서 원하는 항목을 복사합니다
//   2. { } 안의 값을 새 내용으로 바꿉니다
//   3. id는 겹치지 않는 숫자로 지정하세요 (예: '13', '14', ...)
//
// ✏️ 게시물을 삭제하는 방법:
//   - MOCK_POSTS 배열에서 해당 항목({ ... })을 통째로 지우세요
//   - 마지막 항목 뒤에는 쉼표(,)를 붙이지 않아도 됩니다
//
// ℹ️ 나중에 Supabase 등 DB를 연결하면 이 파일의 MOCK_POSTS를
//    API 호출로 교체하면 됩니다
//
// ============================================================

// ── 카테고리 타입 정의 ──
// 게시물이 가질 수 있는 카테고리 종류 (이 3가지만 사용 가능)
export type Category = 'jobs' | 'information' | 'template';

// ── 게시물 데이터 구조 정의 ──
// 각 게시물이 반드시 가져야 할 필드 목록입니다
export interface Post {
  id: string;           // 고유 번호 (겹치면 안 됨), 예: '1', '2', '13'
  title: string;        // 제목 (영어)
  titleKr: string;      // 제목 (한국어)
  excerpt: string;      // 요약 (영어)
  excerptKr: string;    // 요약 (한국어)
  category: Category;   // 카테고리: 'jobs' | 'information' | 'template'
  country: string;      // 국가 (COUNTRIES 배열의 id 값과 일치해야 필터 작동)
  date: string;         // 작성일 형식: 'YYYY-MM-DD' (예: '2025-04-28')
  author: string;       // 작성자 이름
  authorInitial: string; // 작성자 이니셜 (아바타에 표시), 예: 'S', 'M'
  image: string;        // 썸네일 이미지 URL (없으면 기본 아이콘 표시)
  readTime: number;     // 읽는 데 걸리는 시간 (분 단위)
  views: number;        // 조회수
  isNew?: boolean;      // NEW 뱃지 표시 여부 (true = 표시, 생략 = 미표시)
}

// ── 카테고리 표시 설정 ──
// 각 카테고리의 한국어/영어 이름과 색상 스타일을 지정합니다
// color: TailwindCSS 클래스 (배경색, 텍스트색, 테두리색)
export const CATEGORY_META: Record<Category, { labelEn: string; labelKr: string; color: string }> = {
  jobs:        { labelEn: 'Jobs',        labelKr: '채용',   color: 'bg-orange-50 text-orange-700 border-orange-200' },
  information: { labelEn: 'Information', labelKr: '정보',   color: 'bg-blue-50 text-blue-700 border-blue-200' },
  template:    { labelEn: 'Template',    labelKr: '템플릿', color: 'bg-purple-50 text-purple-700 border-purple-200' },
};

// ── 국가 목록 ──
// 사이드바 필터와 카드에서 사용하는 국가 목록입니다
// id: 게시물의 country 값과 반드시 일치해야 필터가 작동합니다
// ✏️ 국가를 추가하려면 이 배열에 항목을 추가하세요
export const COUNTRIES = [
  { id: 'USA',         flag: '🇺🇸', labelEn: 'USA',         labelKr: '미국' },
  { id: 'Canada',      flag: '🇨🇦', labelEn: 'Canada',      labelKr: '캐나다' },
  { id: 'UK',          flag: '🇬🇧', labelEn: 'UK',          labelKr: '영국' },
  { id: 'Australia',   flag: '🇦🇺', labelEn: 'Australia',   labelKr: '호주' },
  { id: 'Germany',     flag: '🇩🇪', labelEn: 'Germany',     labelKr: '독일' },
  { id: 'Japan',       flag: '🇯🇵', labelEn: 'Japan',       labelKr: '일본' },
  { id: 'Singapore',   flag: '🇸🇬', labelEn: 'Singapore',   labelKr: '싱가포르' },
  { id: 'Netherlands', flag: '🇳🇱', labelEn: 'Netherlands', labelKr: '네덜란드' },
  { id: 'Global',      flag: '🌐', labelEn: 'Global',      labelKr: '글로벌' },
];

// ── 게시물 목 데이터 ──
// ✏️ 아래 목록을 수정하면 사이트에 표시되는 카드가 바뀝니다
// ✏️ 새 게시물은 맨 위에 추가하고 id를 새 번호로 지정하세요
export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: 'How to Get a Tech Job Sponsorship in Canada',
    titleKr: '캐나다 IT 취업 비자 스폰서십 취득 가이드',
    excerpt: 'A comprehensive guide to securing employer sponsorship for your tech career in Canada, including networking tips, visa requirements, and how to stand out.',
    excerptKr: '캐나다 IT 취업 스폰서십을 받는 방법을 단계별로 안내합니다. 네트워킹, LMIA 요건, 지원 전략까지 총정리.',
    category: 'information',  // 'jobs' | 'information' | 'template' 중 선택
    country: 'Canada',         // COUNTRIES 배열의 id와 일치해야 합니다
    date: '2025-04-28',
    author: 'Sarah Kim',
    authorInitial: 'S',
    image: 'https://images.unsplash.com/photo-1618229234536-dd459d33ad73?w=800&q=80',
    readTime: 8,
    views: 1250,
    isNew: true,  // NEW 뱃지 표시
  },
  {
    id: '2',
    title: 'Top Companies Actively Hiring Sponsored Workers in the USA',
    titleKr: '미국 H-1B 스폰서 기업 TOP 30',
    excerpt: 'Discover which Fortune 500 companies are most likely to sponsor your H-1B visa and what skills they look for in international candidates.',
    excerptKr: 'H-1B 스폰서를 가장 활발히 진행하는 Fortune 500 기업과 원하는 스킬셋을 한눈에 정리했습니다.',
    category: 'jobs',
    country: 'USA',
    date: '2025-04-22',
    author: 'Michael Chen',
    authorInitial: 'M',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
    readTime: 6,
    views: 2100,
    isNew: true,
  },
  {
    id: '3',
    title: 'Understanding UK Skilled Worker Visa Sponsorship',
    titleKr: '영국 숙련 노동자 비자(Skilled Worker) 완벽 가이드',
    excerpt: 'Everything you need to know about the UK Skilled Worker visa, including salary thresholds, eligible occupation codes, and how employer sponsorship works.',
    excerptKr: '영국 Skilled Worker 비자의 급여 기준, 직종 코드, 스폰서 절차까지 모두 담았습니다.',
    category: 'information',
    country: 'UK',
    date: '2025-04-15',
    author: 'Emma Wilson',
    authorInitial: 'E',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
    readTime: 10,
    views: 980,
  },
  {
    id: '4',
    title: 'Free Resume Template for Sponsored Job Applications',
    titleKr: '해외 취업 지원용 무료 이력서 템플릿',
    excerpt: 'Download our professionally designed resume template optimized for international job applications, with ATS-friendly formatting and a visa status section.',
    excerptKr: '비자 상태 섹션 포함, ATS 최적화된 해외 취업 이력서 템플릿을 무료로 다운받으세요.',
    category: 'template',
    country: 'Global',
    date: '2025-03-30',
    author: 'HiSponsor',
    authorInitial: 'H',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80',
    readTime: 3,
    views: 3400,
  },
  {
    id: '5',
    title: 'How to Network Your Way to a Sponsorship Offer',
    titleKr: '네트워킹으로 스폰서 오퍼 받는 전략',
    excerpt: 'Strategic networking tips for job seekers targeting sponsored positions abroad — LinkedIn, conferences, and alumni networks that actually open doors.',
    excerptKr: '해외 스폰서 포지션을 노리는 구직자를 위한 실전 네트워킹 전략. LinkedIn부터 동문 네트워크까지.',
    category: 'information',
    country: 'Australia',
    date: '2025-03-20',
    author: 'James Park',
    authorInitial: 'J',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
    readTime: 7,
    views: 750,
  },
  {
    id: '6',
    title: 'Germany Blue Card: Sponsorship Guide for Skilled Workers',
    titleKr: '독일 블루카드 완벽 가이드 (EU Blue Card)',
    excerpt: 'The EU Blue Card makes Germany one of the most attractive destinations for skilled professionals. Learn salary requirements, the application process, and top hiring companies.',
    excerptKr: 'EU 블루카드로 독일 취업하는 방법. 급여 기준, 신청 절차, 주요 채용 기업까지 상세히 안내합니다.',
    category: 'jobs',
    country: 'Germany',
    date: '2025-03-12',
    author: 'Lisa Müller',
    authorInitial: 'L',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80',
    readTime: 9,
    views: 1100,
  },
  {
    id: '7',
    title: 'Sponsorship Cover Letter Template That Gets Results',
    titleKr: '스폰서 취업 지원용 커버레터 템플릿',
    excerpt: 'Use our customizable cover letter template to make a strong impression and clearly communicate your sponsorship needs and value to hiring managers.',
    excerptKr: '채용 담당자에게 강한 인상을 남기는 맞춤형 커버레터 템플릿. 비자 스폰서 필요성을 자연스럽게 전달하세요.',
    category: 'template',
    country: 'Canada',
    date: '2025-02-28',
    author: 'HiSponsor',
    authorInitial: 'H',
    image: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=800&q=80',
    readTime: 4,
    views: 2200,
  },
  {
    id: '8',
    title: 'Tech Careers in Australia: A Complete Sponsorship Roadmap',
    titleKr: '호주 IT 취업 완전 가이드 (TSS 비자 중심)',
    excerpt: "Australia's tech sector is booming and companies are actively sponsoring international talent. Learn about the TSS visa and which cities have the most opportunities.",
    excerptKr: '호주 IT 업계는 지금 국제 인재를 적극 채용 중입니다. TSS 비자와 기회가 많은 도시를 알아보세요.',
    category: 'information',
    country: 'Australia',
    date: '2025-02-15',
    author: 'Olivia Taylor',
    authorInitial: 'O',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80',
    readTime: 11,
    views: 870,
  },
  {
    id: '9',
    title: 'Japan Work Visa for IT Engineers: Step-by-Step Guide',
    titleKr: '일본 취업 비자 완전 정복 (IT 엔지니어 편)',
    excerpt: 'Japan is welcoming more international tech talent. This guide covers the Engineer/Specialist in Humanities visa, finding a sponsor company, and living in Japan.',
    excerptKr: '일본이 해외 IT 인재 유치에 적극 나서고 있습니다. 엔지니어 비자 취득부터 일본 생활 정착까지 안내합니다.',
    category: 'jobs',
    country: 'Japan',
    date: '2025-02-05',
    author: 'Kenji Tanaka',
    authorInitial: 'K',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
    readTime: 12,
    views: 640,
  },
  {
    id: '10',
    title: 'Singapore Employment Pass: Everything You Need to Know',
    titleKr: '싱가포르 EP(Employment Pass) 완전 가이드',
    excerpt: "Singapore is Asia's top destination for professionals seeking employer sponsorship. Find out how to qualify for the Employment Pass and which sectors are hiring.",
    excerptKr: '싱가포르 Employment Pass 자격 요건, 신청 방법, 주요 채용 업종을 한눈에 파악하세요.',
    category: 'information',
    country: 'Singapore',
    date: '2025-01-20',
    author: 'Priya Nair',
    authorInitial: 'P',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80',
    readTime: 8,
    views: 920,
  },
  {
    id: '11',
    title: 'LinkedIn Profile Template for Sponsored Job Seekers',
    titleKr: '해외 취업 특화 LinkedIn 프로필 최적화 템플릿',
    excerpt: 'Optimize your LinkedIn profile to attract recruiters and companies willing to sponsor international candidates. Includes keyword strategies and a profile checklist.',
    excerptKr: '스폰서 포지션 채용 담당자를 끌어당기는 LinkedIn 프로필 전략. 키워드와 체크리스트 포함.',
    category: 'template',
    country: 'Global',
    date: '2025-01-10',
    author: 'HiSponsor',
    authorInitial: 'H',
    image: 'https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=800&q=80',
    readTime: 5,
    views: 1850,
  },
  {
    id: '12',
    title: 'Netherlands Highly Skilled Migrant Program Explained',
    titleKr: '네덜란드 고숙련 이민 프로그램(HSMP) 가이드',
    excerpt: "The Netherlands offers Europe's most streamlined sponsorship route for highly skilled workers. Learn about salary requirements, the IND process, and top employers.",
    excerptKr: '유럽에서 가장 신속한 스폰서 루트를 자랑하는 네덜란드 HSMP 프로그램을 완벽 해설합니다.',
    category: 'information',
    country: 'Netherlands',
    date: '2024-12-18',
    author: 'Thomas van Berg',
    authorInitial: 'T',
    image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80',
    readTime: 9,
    views: 580,
  },
  // ──────────────────────────────────────────────
  // ✏️ 새 게시물을 추가하려면 아래 예시를 복사해서 사용하세요:
  // ──────────────────────────────────────────────
  // {
  //   id: '13',                          ← 이전 마지막 번호 + 1
  //   title: '영어 제목',
  //   titleKr: '한국어 제목',
  //   excerpt: 'English summary...',
  //   excerptKr: '한국어 요약...',
  //   category: 'jobs',                  ← 'jobs' | 'information' | 'template'
  //   country: 'USA',                    ← COUNTRIES 배열의 id와 일치
  //   date: '2025-05-01',               ← YYYY-MM-DD 형식
  //   author: '작성자 이름',
  //   authorInitial: 'A',               ← 이름 첫 글자
  //   image: 'https://이미지URL',
  //   readTime: 5,                       ← 분 단위
  //   views: 100,
  //   isNew: true,                       ← NEW 뱃지 원하면 추가, 없으면 이 줄 삭제
  // },
];
