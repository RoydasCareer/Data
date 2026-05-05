// ============================================================
// 📌 Footer.tsx — 사이트 하단 푸터 컴포넌트
// ============================================================
//
// 이 컴포넌트가 담당하는 것:
//   1. 뉴스레터 구독 입력폼 (이메일 입력 + 버튼)
//   2. 사이트 링크 모음 (탐색 / 인기 국가 / 회사 정보)
//   3. 소셜 미디어 아이콘 링크
//   4. 저작권 문구
//
// ✏️ 텍스트 수정 방법:
//   → src/app/config.ts 파일에서 수정하면 이 파일을 건드리지 않아도 됩니다!
//
// ============================================================

import { Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useState } from 'react';
import { SITE_CONFIG } from '../config';           // 커스텀 설정 불러오기
import horizontalLogo from '../../assets/Horizontal_Logo.png'; // 로고 이미지

// 푸터 탐색 링크 목록
// labelKr: 한국어, labelEn: 영어, href: 이동할 위치(# = 같은 페이지 내)
const EXPLORE_LINKS = [
  { labelKr: '홈',    labelEn: 'Home',        href: '#top' },
  { labelKr: '정보',  labelEn: 'Information', href: '#catalogue' },
  { labelKr: '채용',  labelEn: 'Jobs',        href: '#catalogue' },
  { labelKr: '템플릿', labelEn: 'Template',   href: '#catalogue' },
  { labelKr: '문의',  labelEn: 'Contact',     href: '#contact' },
];

// 회사 정보 링크 목록 (실제 페이지가 생기면 href를 URL로 바꾸세요)
const COMPANY_LINKS = [
  { labelKr: '소개',      labelEn: 'About Us' },
  { labelKr: '채용공고',  labelEn: 'Careers' },
  { labelKr: '블로그',    labelEn: 'Blog' },
  { labelKr: '파트너',    labelEn: 'Partners' },
];

// 소셜 미디어 아이콘 목록
// SITE_CONFIG.social 에서 링크를 가져옵니다
const SOCIAL_ICONS = [
  { Icon: Linkedin,  key: 'linkedin'  as const, label: 'LinkedIn' },
  { Icon: Twitter,   key: 'twitter'   as const, label: 'Twitter' },
  { Icon: Facebook,  key: 'facebook'  as const, label: 'Facebook' },
  { Icon: Instagram, key: 'instagram' as const, label: 'Instagram' },
];

export function Footer() {
  // email: 사용자가 입력한 이메일 주소를 저장하는 상태값
  const [email, setEmail] = useState('');
  // submitted: 구독 버튼을 눌렀는지 여부
  const [submitted, setSubmitted] = useState(false);

  // 뉴스레터 구독 버튼 클릭 시 실행되는 함수
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault(); // 페이지 새로고침 방지
    if (!email.trim()) return; // 이메일이 비어있으면 무시
    setSubmitted(true);  // 구독 완료 상태로 변경
    setEmail('');        // 입력창 초기화
    // ⚠️ 실제 이메일 수집 서비스(Mailchimp, ConvertKit 등)를 연결할 때
    //    이 부분에 API 호출 코드를 추가하면 됩니다
    setTimeout(() => setSubmitted(false), 4000); // 4초 후 메시지 숨기기
  };

  return (
    <footer className="bg-gray-900 text-gray-300">

      {/* ─── 뉴스레터 구독 스트립 ─── */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            {/* 뉴스레터 소개 텍스트 */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-1">
                {SITE_CONFIG.newsletter.titleKr}
              </h3>
              <p className="text-gray-400 text-sm">
                {SITE_CONFIG.newsletter.subtitleKr}
              </p>
            </div>

            {/* 이메일 입력 폼 */}
            <form
              onSubmit={handleSubscribe}
              className="flex gap-2 w-full md:w-auto md:min-w-96"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={SITE_CONFIG.newsletter.inputPlaceholder}
                className="flex-1 px-4 py-2.5 text-sm bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex-shrink-0"
              >
                <Mail className="h-3.5 w-3.5" />
                {SITE_CONFIG.newsletter.buttonText}
              </button>
            </form>

          </div>

          {/* 구독 완료 메시지 (이메일 입력 후 표시) */}
          {submitted && (
            <p className="mt-3 text-sm text-green-400 text-center md:text-right">
              ✅ 구독해 주셔서 감사합니다! Thanks for subscribing!
            </p>
          )}
        </div>
      </div>

      {/* ─── 메인 푸터 ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">

          {/* 브랜드 컬럼 (로고 + 소개 + 연락처 + 소셜) */}
          <div className="lg:col-span-2 space-y-4">

            {/* 로고 이미지 (어두운 배경이라 brightness-200으로 밝게 표시) */}
            <img
              src={horizontalLogo}
              alt={SITE_CONFIG.siteName}
              className="h-9 w-auto object-contain brightness-200 opacity-90"
            />

            {/* 사이트 소개 문구 */}
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              {SITE_CONFIG.siteName}는 비자 스폰서십 글로벌 채용 정보를 한 곳에서 제공하는 플랫폼입니다.
              <span className="block mt-1 text-gray-500 text-xs">{SITE_CONFIG.siteTaglineEn}</span>
            </p>

            {/* 연락처 정보 */}
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
                <span>{SITE_CONFIG.contact.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
                <span>{SITE_CONFIG.contact.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
                <span>{SITE_CONFIG.contact.phone}</span>
              </div>
            </div>

            {/* 소셜 미디어 아이콘 */}
            <div className="flex gap-2 pt-1">
              {SOCIAL_ICONS.map(({ Icon, key, label }) => (
                <a
                  key={key}
                  href={SITE_CONFIG.social[key]} // config.ts에서 링크를 가져옴
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors duration-200"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* 탐색 링크 */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm">
              탐색 <span className="text-gray-500 font-normal">Explore</span>
            </h4>
            <nav className="flex flex-col space-y-2.5">
              {EXPLORE_LINKS.map((item) => (
                <a
                  key={item.labelKr}
                  href={item.href}
                  className="text-sm text-gray-400 hover:text-white transition-colors hover:translate-x-0.5 inline-block duration-150"
                >
                  {item.labelKr} <span className="text-gray-600 text-xs">{item.labelEn}</span>
                </a>
              ))}
            </nav>
          </div>

          {/* 인기 국가 */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm">
              인기 국가 <span className="text-gray-500 font-normal">Top Destinations</span>
            </h4>
            <nav className="flex flex-col space-y-2.5">
              {SITE_CONFIG.topDestinations.map((c) => (
                <a
                  key={c.labelEn}
                  href="#catalogue"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-150"
                >
                  {c.flag} {c.labelKr} <span className="text-gray-600 text-xs">{c.labelEn}</span>
                </a>
              ))}
            </nav>
          </div>

          {/* 회사 정보 */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm">
              회사 <span className="text-gray-500 font-normal">Company</span>
            </h4>
            <nav className="flex flex-col space-y-2.5">
              {COMPANY_LINKS.map((item) => (
                <a
                  key={item.labelEn}
                  href="#"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-150"
                >
                  {item.labelKr} <span className="text-gray-600 text-xs">{item.labelEn}</span>
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* 구분선 */}
        <div className="my-8 border-t border-gray-800" />

        {/* 하단 저작권 바 */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">{SITE_CONFIG.copyright}</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            {['개인정보처리방침 Privacy', '이용약관 Terms', '쿠키정책 Cookies', '사이트맵'].map((item) => (
              <a key={item} href="#" className="hover:text-gray-300 transition-colors">{item}</a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
