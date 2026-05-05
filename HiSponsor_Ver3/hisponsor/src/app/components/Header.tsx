import { useState } from 'react';
import { Search, Menu, X, Briefcase } from 'lucide-react';
import horizontalLogo from '../../assets/Horizontal_Logo.png';
import verticalLogo from '../../assets/Vertical_Logo.png';

const NAV = [
  { labelKr: '홈', labelEn: 'Home', href: '#top' },
  { labelKr: '정보', labelEn: 'Info', href: '#catalogue', cat: 'information' },
  { labelKr: '채용', labelEn: 'Jobs', href: '#catalogue', cat: 'jobs' },
  { labelKr: '템플릿', labelEn: 'Template', href: '#catalogue', cat: 'template' },
  { labelKr: '문의', labelEn: 'Contact', href: '#contact' },
];

interface HeaderProps {
  onSearch: (q: string) => void;
  onNavCat?: (cat: string) => void;
}

export function Header({ onSearch, onNavCat }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const handleSearch = (val: string) => {
    setSearchVal(val);
    onSearch(val);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <a href="#top" className="flex-shrink-0">
            <img src={horizontalLogo} alt="HiSponsor" className="hidden sm:block h-8 w-auto" />
            <img src={verticalLogo} alt="HiSponsor" className="sm:hidden h-9 w-auto" />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1 ml-2">
            {NAV.map((item) => (
              <a
                key={item.labelKr}
                href={item.href}
                onClick={() => item.cat && onNavCat?.(item.cat)}
                className="flex flex-col items-center px-3 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors leading-none"
              >
                <span className="text-sm font-medium">{item.labelKr}</span>
                <span className="text-[10px] text-gray-400 mt-0.5">{item.labelEn}</span>
              </a>
            ))}
          </nav>

          {/* Search */}
          <div className="hidden sm:flex relative flex-1 max-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              value={searchVal}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="검색 / Search..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
            />
          </div>

          {/* CTA */}
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <a href="#contact" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              로그인 <span className="text-gray-400 text-xs">Login</span>
            </a>
            <a href="#contact" className="flex items-center gap-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition-colors">
              <Briefcase className="h-3.5 w-3.5" />
              공고 등록
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden ml-auto p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="메뉴"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                value={searchVal}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="검색 / Search..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-blue-400"
              />
            </div>
            <nav className="flex flex-col gap-1">
              {NAV.map((item) => (
                <a
                  key={item.labelKr}
                  href={item.href}
                  onClick={() => { item.cat && onNavCat?.(item.cat); setMenuOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium">{item.labelKr}</span>
                  <span className="text-xs text-gray-400">{item.labelEn}</span>
                </a>
              ))}
            </nav>
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
              <a href="#contact" className="flex-1 text-center text-sm border border-gray-200 rounded-full py-2 text-gray-700">로그인</a>
              <a href="#contact" className="flex-1 text-center text-sm bg-blue-600 text-white rounded-full py-2 font-medium">공고 등록</a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
