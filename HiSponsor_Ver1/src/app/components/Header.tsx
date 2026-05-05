import { Search, Menu, X, Briefcase } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import horizontalLogo from "../../imports/Horizontal_Logo.png";

const navItems = [
  { label: "Home", href: "#" },
  { label: "Information", href: "#" },
  { label: "Jobs", href: "#" },
  { label: "Template", href: "#" },
  { label: "Contact", href: "#" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Home");

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src={horizontalLogo}
              alt="HiSponsor"
              className="h-9 w-auto object-contain"
            />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href="#"
                onClick={(e) => { e.preventDefault(); setActiveNav(item.label); }}
                className={`px-3 py-2 rounded-md transition-colors text-sm ${
                  activeNav === item.label
                    ? "text-blue-600 bg-blue-50 font-medium"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden sm:flex relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search articles..."
              className="pl-9 bg-gray-50 border-gray-200 rounded-full h-9"
            />
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex text-gray-600 hover:text-gray-900"
            >
              Login
            </Button>
            <Button
              size="sm"
              className="hidden sm:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4"
            >
              <Briefcase className="h-3.5 w-3.5" />
              Post a Job
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-100 bg-white">
            {/* Mobile Search */}
            <div className="relative mb-3 px-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search articles..."
                className="pl-9 bg-gray-50 border-gray-200 w-full"
              />
            </div>
            <nav className="flex flex-col gap-0.5">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveNav(item.label);
                    setIsMenuOpen(false);
                  }}
                  className={`px-3 py-2.5 rounded-md text-sm transition-colors ${
                    activeNav === item.label
                      ? "text-blue-600 bg-blue-50 font-medium"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
              <Button variant="outline" size="sm" className="flex-1">
                Login
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Post a Job
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
