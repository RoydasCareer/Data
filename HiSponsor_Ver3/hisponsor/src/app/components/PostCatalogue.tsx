// ============================================================
// 📌 PostCatalogue.tsx — 메인 콘텐츠 영역 컴포넌트
// ============================================================
//
// 이 컴포넌트가 담당하는 것:
//   1. 히어로 배너 (배경 이미지 + 텍스트 + 검색창)
//   2. 카테고리 탭 (전체 / 채용 / 정보 / 템플릿)
//   3. 사이드바 필터 + 게시물 카드 그리드
//   4. 정렬 드롭다운 + 그리드/리스트 뷰 전환
//   5. 모바일용 필터 오버레이 (필터 버튼 클릭 시)
//
// ✏️ 히어로 배너 텍스트 수정:
//   → src/app/config.ts 의 hero 섹션을 수정하세요
//
// ✏️ 게시물 목록 수정:
//   → src/app/data/posts.ts 의 MOCK_POSTS를 수정하세요
//
// ============================================================

import { useState, useMemo } from 'react';
import { Search, Grid, LayoutList, Filter, ChevronRight } from 'lucide-react';
import { MOCK_POSTS, type Category } from '../data/posts';
import { SITE_CONFIG } from '../config';          // 커스텀 설정 (히어로 텍스트 등)
import { PostCard } from './PostCard';
import { FilterPanel } from './FilterPanel';
import bannerImage from '../../assets/Web_Header_Banner.png'; // 배너 배경 이미지

type SortOption = 'latest' | 'popular' | 'name-asc';

interface FilterState {
  categories: Category[];
  countries: string[];
}

const SORT_OPTIONS: { value: SortOption; labelKr: string; labelEn: string }[] = [
  { value: 'latest',   labelKr: '최신순',  labelEn: 'Latest' },
  { value: 'popular',  labelKr: '인기순',  labelEn: 'Popular' },
  { value: 'name-asc', labelKr: '이름순',  labelEn: 'A–Z' },
];

const CAT_TABS = [
  { id: 'all',         labelKr: '전체',    labelEn: 'All' },
  { id: 'jobs',        labelKr: '채용',    labelEn: 'Jobs' },
  { id: 'information', labelKr: '정보',    labelEn: 'Info' },
  { id: 'template',    labelKr: '템플릿',  labelEn: 'Template' },
] as const;

interface PostCatalogueProps {
  searchQuery: string;
  activeCat: string;
  onActiveCat: (cat: string) => void;
}

export function PostCatalogue({ searchQuery, activeCat, onActiveCat }: PostCatalogueProps) {
  const [filters, setFilters] = useState<FilterState>({ categories: [], countries: [] });
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync active cat tab → filter
  const activeCatForFilter = activeCat !== 'all' ? activeCat as Category : null;

  const posts = useMemo(() => {
    let result = [...MOCK_POSTS];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.titleKr.includes(q) ||
        p.excerptKr.includes(q) ||
        p.author.toLowerCase().includes(q)
      );
    }

    // Tab filter
    if (activeCatForFilter) {
      result = result.filter((p) => p.category === activeCatForFilter);
    }

    // Sidebar category filter (overrides tab when set)
    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category));
    }

    // Country filter
    if (filters.countries.length > 0) {
      result = result.filter((p) => filters.countries.includes(p.country));
    }

    // Sort
    switch (sortBy) {
      case 'latest':   result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); break;
      case 'popular':  result.sort((a, b) => b.views - a.views); break;
      case 'name-asc': result.sort((a, b) => a.title.localeCompare(b.title)); break;
    }

    return result;
  }, [searchQuery, activeCatForFilter, filters, sortBy]);

  const clearAll = () => {
    setFilters({ categories: [], countries: [] });
    onActiveCat('all');
  };

  return (
    <div id="catalogue">
      {/* ─── 히어로 배너 ───
           텍스트는 src/app/config.ts → hero 섹션에서 수정하세요 */}
      <div className="relative w-full overflow-hidden" style={{ height: 300 }}>
        {/* 배너 배경 이미지: src/assets/Web_Header_Banner.png */}
        <img src={bannerImage} alt={SITE_CONFIG.siteName + ' Banner'} className="w-full h-full object-cover object-center" />
        {/* 배너 위 반투명 파란 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/75 via-blue-800/50 to-transparent" />
        {/* 배너 텍스트 영역 */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 max-w-3xl">
          {/* 상단 뱃지 텍스트 → config.ts hero.badgeText */}
          <span className="inline-block mb-3 bg-blue-500/30 text-blue-100 text-xs px-3 py-1 rounded-full border border-blue-400/40 w-fit">
            {SITE_CONFIG.hero.badgeText}
          </span>
          {/* 영어 메인 제목 → config.ts hero.headlineEn (\n = 줄바꿈) */}
          <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-3">
            {SITE_CONFIG.hero.headlineEn.split('\n').map((line, i) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </h1>
          {/* 한국어 부제목 → config.ts hero.subtitleKr */}
          <p className="text-blue-100/90 text-sm mb-5 max-w-lg">
            {SITE_CONFIG.hero.subtitleKr}
          </p>
          {/* 검색창 (실제 검색은 헤더 검색창에서 이루어집니다) */}
          <div className="flex gap-2 max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                defaultValue={searchQuery}
                placeholder={SITE_CONFIG.hero.searchPlaceholder}
                readOnly
                className="w-full pl-9 pr-4 h-11 rounded-xl bg-white border-white text-sm text-gray-900 focus:outline-none shadow-md"
              />
            </div>
            <button className="h-11 px-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-md transition-colors flex-shrink-0">
              {SITE_CONFIG.hero.searchButtonText}
            </button>
          </div>
        </div>
      </div>

      {/* ─── 카테고리 탭 ───
           탭 목록을 수정하려면 이 파일 상단의 CAT_TABS 배열을 바꾸세요 */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 py-3 overflow-x-auto scrollbar-none">
            {CAT_TABS.map((tab) => {
              const isActive = activeCat === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { onActiveCat(tab.id); setFilters({ categories: [], countries: [] }); }}
                  className={`flex-shrink-0 flex items-center gap-1 px-4 py-1.5 rounded-full text-sm transition-all duration-200 border ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600 bg-white'
                  }`}
                >
                  <span className="font-medium">{tab.labelKr}</span>
                  <span className="opacity-60 text-xs">{tab.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block flex-shrink-0">
            <FilterPanel filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* Articles */}
          <div className="flex-1 min-w-0">
            {/* Controls bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm text-gray-500">
                  <span className="text-gray-900 font-semibold">{posts.length}</span>개의 콘텐츠
                </span>

                {/* Mobile filter button */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 px-3 py-1.5 rounded-full hover:border-blue-300 hover:text-blue-600 transition-colors"
                >
                  <Filter className="h-3.5 w-3.5" />
                  필터
                  {(filters.categories.length + filters.countries.length) > 0 && (
                    <span className="bg-blue-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                      {filters.categories.length + filters.countries.length}
                    </span>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-white focus:outline-none focus:border-blue-400"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.labelKr} {o.labelEn}</option>
                  ))}
                </select>

                {/* View toggle */}
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                    aria-label="그리드 보기"
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                    aria-label="리스트 보기"
                  >
                    <LayoutList className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Empty state */}
            {posts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-7 w-7 text-blue-300" />
                </div>
                <p className="text-gray-500 mb-1">검색 결과가 없습니다.</p>
                <p className="text-gray-400 text-sm mb-5">No results found. Try adjusting your filters.</p>
                <button
                  onClick={clearAll}
                  className="text-sm text-blue-600 border border-blue-200 hover:bg-blue-50 px-4 py-2 rounded-full transition-colors"
                >
                  필터 초기화
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5' : 'space-y-4'}>
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} viewMode={viewMode} />
                ))}
              </div>
            )}

            {posts.length > 0 && (
              <div className="flex justify-center mt-10">
                <button className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-8 py-2.5 rounded-full hover:border-blue-300 hover:text-blue-600 transition-colors">
                  더 보기 Load More <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFilterOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-80 bg-white overflow-y-auto shadow-xl">
            <div className="p-4">
              <FilterPanel
                filters={filters}
                onFiltersChange={setFilters}
                isMobile
                onClose={() => setMobileFilterOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
