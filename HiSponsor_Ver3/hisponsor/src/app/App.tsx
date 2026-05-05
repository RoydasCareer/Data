// ============================================================
// 📌 App.tsx — 사이트의 최상위 루트 컴포넌트
// ============================================================
//
// 이 파일이 하는 일:
//   - Header, PostCatalogue, Footer 컴포넌트를 한 페이지에 조립합니다
//   - 검색어(searchQuery)와 활성 카테고리(activeCat) 상태를 관리합니다
//   - Header에서 검색하면 PostCatalogue에 전달되어 필터링됩니다
//   - Header 네비게이션 클릭 시 카테고리 탭이 자동으로 전환됩니다
//
// ✏️ 페이지 구조를 바꾸고 싶다면:
//   - 컴포넌트 순서를 바꾸거나 (Header → PostCatalogue → Footer)
//   - 새 컴포넌트를 추가하세요
//
// ============================================================

import { useState } from 'react';          // React 상태 관리 훅
import { Header } from './components/Header';              // 상단 헤더
import { PostCatalogue } from './components/PostCatalogue'; // 콘텐츠 목록
import { Footer } from './components/Footer';              // 하단 푸터

export default function App() {
  // searchQuery: 헤더 검색창에서 입력한 검색어 (초기값: 빈 문자열)
  const [searchQuery, setSearchQuery] = useState('');

  // activeCat: 현재 선택된 카테고리 탭 ('all' | 'jobs' | 'information' | 'template')
  const [activeCat, setActiveCat] = useState('all');

  return (
    // id="top" → 네비게이션 "홈" 클릭 시 맨 위로 스크롤됩니다
    <div id="top" className="min-h-screen bg-slate-50">

      {/* ─── 헤더: 로고, 네비게이션, 검색창 ─── */}
      <Header
        onSearch={setSearchQuery}   // 검색창 입력값을 searchQuery에 저장
        onNavCat={setActiveCat}     // 네비게이션 클릭 시 카테고리 변경
      />

      {/* ─── 메인 콘텐츠: 배너 + 필터 + 카드 목록 ─── */}
      <main>
        <PostCatalogue
          searchQuery={searchQuery}   // 헤더에서 받은 검색어 전달
          activeCat={activeCat}       // 현재 활성 카테고리 전달
          onActiveCat={setActiveCat}  // 탭 클릭 시 카테고리 변경 함수 전달
        />
      </main>

      {/* ─── 문의 섹션 앵커 (빈 div, href="#contact" 링크의 도착점) ─── */}
      <div id="contact" />

      {/* ─── 푸터: 뉴스레터, 링크, 소셜, 저작권 ─── */}
      <Footer />

    </div>
  );
}
