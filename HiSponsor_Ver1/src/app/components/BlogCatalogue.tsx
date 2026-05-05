import { useState, useMemo } from "react";
import { BlogCard, BlogPost } from "./BlogCard";
import { FilterPanel } from "./FilterPanel";
import { SortDropdown, SortOption } from "./SortDropdown";
import { Button } from "./ui/button";
import { Filter, Grid, LayoutList, Search, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Input } from "./ui/input";
import bannerImage from "../../imports/Web_Header_Banner.png";

interface FilterState {
  categories: string[];
  countries: string[];
}

const mockPosts: BlogPost[] = [
  {
    id: "1",
    title: "How to Get a Tech Job Sponsorship in Canada",
    excerpt:
      "A comprehensive guide to securing employer sponsorship for your tech career in Canada, including tips on networking, visa requirements, and how to stand out to Canadian employers.",
    category: "jobs",
    country: "Canada",
    date: "2025-04-28",
    author: "Sarah Kim",
    authorInitial: "S",
    image: "https://images.unsplash.com/photo-1618229234536-dd459d33ad73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    readTime: 8,
    views: 1250,
    isNew: true,
  },
  {
    id: "2",
    title: "Top Companies Actively Hiring Sponsored Workers in the USA",
    excerpt:
      "Discover which Fortune 500 companies are most likely to sponsor your H-1B visa application and what skills they're looking for in international candidates.",
    category: "jobs",
    country: "USA",
    date: "2025-04-22",
    author: "Michael Chen",
    authorInitial: "M",
    image: "https://images.unsplash.com/photo-1758518727653-5650fd9e146c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    readTime: 6,
    views: 2100,
    isNew: true,
  },
  {
    id: "3",
    title: "Understanding UK Skilled Worker Visa Sponsorship",
    excerpt:
      "Everything you need to know about the UK Skilled Worker visa and how employer sponsorship works, including salary thresholds and eligible occupation codes.",
    category: "information",
    country: "UK",
    date: "2025-04-15",
    author: "Emma Wilson",
    authorInitial: "E",
    image: "https://images.unsplash.com/photo-1657358846135-ff4ede4fc4cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    readTime: 10,
    views: 980,
  },
  {
    id: "4",
    title: "Free Resume Template for Sponsored Job Applications",
    excerpt:
      "Download our professionally designed resume template optimized for international job applications. Includes ATS-friendly formatting and sections for visa status.",
    category: "template",
    country: "Global",
    date: "2025-03-30",
    author: "HiSponsor Team",
    authorInitial: "H",
    image: "https://images.unsplash.com/photo-1635253548172-d82ffe76449d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    readTime: 3,
    views: 3400,
  },
  {
    id: "5",
    title: "How to Network Your Way to a Sponsorship Offer",
    excerpt:
      "Strategic networking tips specifically for job seekers looking for sponsored positions abroad. Learn how LinkedIn, conferences, and alumni networks can open doors.",
    category: "information",
    country: "Australia",
    date: "2025-03-20",
    author: "James Park",
    authorInitial: "J",
    image: "https://images.unsplash.com/photo-1758599543157-bc1a94fec33c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    readTime: 7,
    views: 750,
  },
  {
    id: "6",
    title: "Germany Blue Card: Sponsorship Guide for Skilled Workers",
    excerpt:
      "The EU Blue Card makes Germany one of the most attractive destinations for skilled professionals worldwide. Here's what you need to know about getting sponsored.",
    category: "jobs",
    country: "Germany",
    date: "2025-03-12",
    author: "Lisa Müller",
    authorInitial: "L",
    image: "https://images.unsplash.com/photo-1749295672848-3be0a70da20c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    readTime: 9,
    views: 1100,
  },
  {
    id: "7",
    title: "Sponsorship Cover Letter Template That Gets Results",
    excerpt:
      "Use our customizable cover letter template to make a strong impression on hiring managers and clearly communicate your sponsorship needs and value.",
    category: "template",
    country: "Canada",
    date: "2025-02-28",
    author: "HiSponsor Team",
    authorInitial: "H",
    image: "https://images.unsplash.com/photo-1758873271805-1ff103e28558?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    readTime: 4,
    views: 2200,
  },
  {
    id: "8",
    title: "Tech Careers in Australia: A Complete Sponsorship Roadmap",
    excerpt:
      "Australia's tech industry is booming, and many companies are actively sponsoring international talent. Learn about the TSS visa and which cities have the most opportunities.",
    category: "information",
    country: "Australia",
    date: "2025-02-15",
    author: "Olivia Taylor",
    authorInitial: "O",
    image: "https://images.unsplash.com/photo-1602385676602-6f0ee562d964?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    readTime: 11,
    views: 870,
  },
  {
    id: "9",
    title: "Japan Work Visa for IT Engineers: Step-by-Step Guide",
    excerpt:
      "Japan is welcoming more international tech talent. This guide covers everything from the Engineer/Specialist in Humanities visa to landing your first Japanese employer sponsor.",
    category: "jobs",
    country: "Japan",
    date: "2025-02-05",
    author: "Kenji Tanaka",
    authorInitial: "K",
    image: "https://images.unsplash.com/photo-1658518727653-5650fd9e146c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    readTime: 12,
    views: 640,
  },
  {
    id: "10",
    title: "Singapore Employment Pass: Everything You Need to Know",
    excerpt:
      "Singapore is one of Asia's top destinations for professionals seeking employer sponsorship. Find out how to qualify for the Employment Pass and which sectors are hiring.",
    category: "information",
    country: "Singapore",
    date: "2025-01-20",
    author: "Priya Nair",
    authorInitial: "P",
    image: "https://images.unsplash.com/photo-1570125772048-c0197a2c2164?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    readTime: 8,
    views: 920,
  },
  {
    id: "11",
    title: "LinkedIn Profile Template for Sponsored Job Seekers",
    excerpt:
      "Optimize your LinkedIn profile to attract recruiters and companies willing to sponsor international candidates. Includes keyword strategies and a profile checklist.",
    category: "template",
    country: "Global",
    date: "2025-01-10",
    author: "HiSponsor Team",
    authorInitial: "H",
    image: "https://images.unsplash.com/photo-1611944212129-29977ae1398c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    readTime: 5,
    views: 1850,
  },
  {
    id: "12",
    title: "Netherlands Highly Skilled Migrant Program Explained",
    excerpt:
      "The Netherlands offers one of Europe's most streamlined sponsorship routes for highly skilled workers. Learn about salary requirements, the IND process, and top hiring companies.",
    category: "information",
    country: "Netherlands",
    date: "2024-12-18",
    author: "Thomas van Berg",
    authorInitial: "T",
    image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    readTime: 9,
    views: 580,
  },
];

const categoryLabels: Record<string, string> = {
  home: "Home",
  information: "Information",
  jobs: "Jobs",
  template: "Template",
  contact: "Contact",
};

export function BlogCatalogue() {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    countries: [],
  });
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAndSortedPosts = useMemo(() => {
    let result = [...mockPosts];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category));
    }

    // Country filter
    if (filters.countries.length > 0) {
      result = result.filter((p) => filters.countries.includes(p.country));
    }

    // Sort
    switch (sortBy) {
      case "latest":
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case "name-asc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "popular":
        result.sort((a, b) => b.views - a.views);
        break;
    }

    return result;
  }, [filters, sortBy, searchQuery]);

  const activeFilterLabels: string[] = [
    ...filters.categories.map((c) => categoryLabels[c] ?? c),
    ...filters.countries,
  ];

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative w-full overflow-hidden" style={{ height: "320px" }}>
        <img
          src={bannerImage}
          alt="HiSponsor Banner"
          className="w-full h-full object-cover object-center"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-blue-800/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 max-w-3xl">
          <div className="mb-2">
            <span className="bg-blue-500/30 text-blue-100 text-xs px-3 py-1 rounded-full border border-blue-400/40 backdrop-blur-sm">
              Your Sponsorship Guide
            </span>
          </div>
          <h1 className="text-white mb-3 leading-tight" style={{ fontSize: "2rem", fontWeight: 700 }}>
            Find Your Path to<br />International Career Growth
          </h1>
          <p className="text-blue-100/90 mb-6 max-w-xl" style={{ fontSize: "0.95rem" }}>
            Guides, job opportunities, templates, and expert insights to help you land your dream sponsorship abroad.
          </p>
          {/* Hero Search */}
          <div className="flex gap-2 max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search articles, jobs, templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white border-white h-11 text-gray-900 rounded-xl shadow-md"
              />
            </div>
            <Button className="h-11 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md flex-shrink-0">
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Breadcrumb / Category Tabs */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-none">
            {["All", "Home", "Information", "Jobs", "Template", "Contact"].map((cat) => {
              const catId = cat.toLowerCase();
              const isActive =
                cat === "All"
                  ? filters.categories.length === 0
                  : filters.categories.includes(catId);
              return (
                <button
                  key={cat}
                  onClick={() => {
                    if (cat === "All") {
                      setFilters((f) => ({ ...f, categories: [] }));
                    } else {
                      setFilters((f) => ({
                        ...f,
                        categories: isActive
                          ? f.categories.filter((c) => c !== catId)
                          : [...f.categories, catId],
                      }));
                    }
                  }}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm transition-all duration-200 border ${
                    isActive
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600 bg-white"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-7">
          {/* Desktop Sidebar Filter */}
          <div className="hidden lg:block flex-shrink-0">
            <FilterPanel filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* Articles Area */}
          <div className="flex-1 min-w-0">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
              <div className="flex items-center gap-3 flex-wrap">
                <div>
                  <span className="text-gray-500 text-sm">
                    <span className="text-gray-900 font-semibold">{filteredAndSortedPosts.length}</span>{" "}
                    {filteredAndSortedPosts.length === 1 ? "article" : "articles"} found
                  </span>
                </div>

                {/* Active Filter Pills */}
                {activeFilterLabels.map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full"
                  >
                    {label}
                    <button
                      onClick={() => {
                        setFilters((f) => ({
                          categories: f.categories.filter(
                            (c) => (categoryLabels[c] ?? c) !== label
                          ),
                          countries: f.countries.filter((c) => c !== label),
                        }));
                      }}
                      className="ml-0.5 hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                ))}

                {/* Mobile Filter */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="lg:hidden border-gray-200 text-gray-600 gap-1.5"
                    >
                      <Filter className="h-3.5 w-3.5" />
                      Filters
                      {(filters.categories.length + filters.countries.length) > 0 && (
                        <span className="bg-blue-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                          {filters.categories.length + filters.countries.length}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 p-0 bg-white">
                    <div className="p-4">
                      <FilterPanel
                        filters={filters}
                        onFiltersChange={setFilters}
                        isMobile={true}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 transition-colors ${
                      viewMode === "grid"
                        ? "bg-blue-600 text-white"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 transition-colors ${
                      viewMode === "list"
                        ? "bg-blue-600 text-white"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <LayoutList className="h-4 w-4" />
                  </button>
                </div>

                {/* Sort */}
                <SortDropdown value={sortBy} onChange={setSortBy} />
              </div>
            </div>

            {/* Articles Grid */}
            {filteredAndSortedPosts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-7 w-7 text-blue-300" />
                </div>
                <p className="text-gray-500 mb-1">No articles found matching your filters.</p>
                <p className="text-gray-400 text-sm mb-5">Try adjusting your search or filter criteria.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilters({ categories: [], countries: [] });
                    setSearchQuery("");
                  }}
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                    : "space-y-4"
                }
              >
                {filteredAndSortedPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            )}

            {/* Load More */}
            {filteredAndSortedPosts.length > 0 && (
              <div className="flex justify-center mt-10">
                <Button
                  variant="outline"
                  className="border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 gap-2 px-8"
                >
                  Load More Articles
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
