import { ChevronDown, SlidersHorizontal, X, Globe } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useState } from "react";

interface FilterState {
  categories: string[];
  countries: string[];
}

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

const categories = [
  { id: "home", label: "Home", count: 12 },
  { id: "information", label: "Information", count: 38 },
  { id: "jobs", label: "Jobs", count: 94 },
  { id: "template", label: "Template", count: 21 },
  { id: "contact", label: "Contact", count: 6 },
];

const countries = [
  { id: "USA", label: "🇺🇸 USA", count: 45 },
  { id: "Canada", label: "🇨🇦 Canada", count: 28 },
  { id: "UK", label: "🇬🇧 United Kingdom", count: 31 },
  { id: "Australia", label: "🇦🇺 Australia", count: 19 },
  { id: "Germany", label: "🇩🇪 Germany", count: 22 },
  { id: "Japan", label: "🇯🇵 Japan", count: 14 },
  { id: "South Korea", label: "🇰🇷 South Korea", count: 17 },
  { id: "Singapore", label: "🇸🇬 Singapore", count: 11 },
  { id: "Netherlands", label: "🇳🇱 Netherlands", count: 8 },
  { id: "France", label: "🇫🇷 France", count: 9 },
  { id: "Global", label: "🌐 Global", count: 24 },
];

export function FilterPanel({ filters, onFiltersChange, onClose, isMobile = false }: FilterPanelProps) {
  const [openSections, setOpenSections] = useState({
    categories: true,
    countries: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, categoryId]
      : filters.categories.filter((id) => id !== categoryId);
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleCountryChange = (countryId: string, checked: boolean) => {
    const newCountries = checked
      ? [...filters.countries, countryId]
      : filters.countries.filter((id) => id !== countryId);
    onFiltersChange({ ...filters, countries: newCountries });
  };

  const clearAllFilters = () => {
    onFiltersChange({ categories: [], countries: [] });
  };

  const filterCount = filters.categories.length + filters.countries.length;

  return (
    <Card
      className={`h-fit sticky top-20 border-gray-100 shadow-sm bg-white ${
        isMobile ? "w-full" : "w-72"
      }`}
    >
      <CardHeader className="pb-3 border-b border-gray-50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <SlidersHorizontal className="h-4 w-4 text-blue-600" />
            <span>Filters</span>
            {filterCount > 0 && (
              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                {filterCount}
              </span>
            )}
          </CardTitle>
          <div className="flex gap-1">
            {filterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs text-gray-500 hover:text-gray-700 h-7 px-2"
              >
                Clear All
              </Button>
            )}
            {isMobile && (
              <Button variant="ghost" size="sm" onClick={onClose} className="h-7 w-7 p-0">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pt-4">
        {/* Categories */}
        <Collapsible
          open={openSections.categories}
          onOpenChange={() => toggleSection("categories")}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-0 h-auto hover:bg-transparent text-gray-700 hover:text-gray-900"
            >
              <span className="font-medium text-sm">Categories</span>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                  openSections.categories ? "rotate-180" : ""
                }`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-2.5">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Checkbox
                    id={`cat-${category.id}`}
                    checked={filters.categories.includes(category.id)}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(category.id, checked as boolean)
                    }
                    className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <label
                    htmlFor={`cat-${category.id}`}
                    className="text-sm text-gray-600 cursor-pointer hover:text-gray-900"
                  >
                    {category.label}
                  </label>
                </div>
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                  {category.count}
                </span>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <div className="border-t border-gray-50 pt-2" />

        {/* Country */}
        <Collapsible
          open={openSections.countries}
          onOpenChange={() => toggleSection("countries")}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-0 h-auto hover:bg-transparent text-gray-700 hover:text-gray-900"
            >
              <div className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-blue-500" />
                <span className="font-medium text-sm">Country</span>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                  openSections.countries ? "rotate-180" : ""
                }`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {countries.map((country) => (
              <div key={country.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Checkbox
                    id={`country-${country.id}`}
                    checked={filters.countries.includes(country.id)}
                    onCheckedChange={(checked) =>
                      handleCountryChange(country.id, checked as boolean)
                    }
                    className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <label
                    htmlFor={`country-${country.id}`}
                    className="text-sm text-gray-600 cursor-pointer hover:text-gray-900"
                  >
                    {country.label}
                  </label>
                </div>
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                  {country.count}
                </span>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
