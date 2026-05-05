import { ChevronDown, ArrowUpAZ, ArrowDownZA, CalendarArrowDown, CalendarArrowUp, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export type SortOption =
  | "latest"
  | "oldest"
  | "name-asc"
  | "name-desc"
  | "popular";

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const sortOptions = [
  {
    value: "latest" as SortOption,
    label: "Latest",
    icon: CalendarArrowDown,
  },
  {
    value: "oldest" as SortOption,
    label: "Oldest",
    icon: CalendarArrowUp,
  },
  {
    value: "name-asc" as SortOption,
    label: "Name (A → Z)",
    icon: ArrowUpAZ,
  },
  {
    value: "name-desc" as SortOption,
    label: "Name (Z → A)",
    icon: ArrowDownZA,
  },
  {
    value: "popular" as SortOption,
    label: "Most Popular",
    icon: TrendingUp,
  },
];

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const selectedOption = sortOptions.find((option) => option.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="justify-between min-w-[180px] border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
        >
          <div className="flex items-center gap-2">
            {selectedOption?.icon && (
              <selectedOption.icon className="h-4 w-4 text-blue-500" />
            )}
            <span className="text-sm">Sort: {selectedOption?.label}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 border-gray-100 shadow-md">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`flex items-center gap-2 cursor-pointer text-sm ${
              value === option.value
                ? "text-blue-600 bg-blue-50"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <option.icon
              className={`h-4 w-4 ${value === option.value ? "text-blue-600" : "text-gray-400"}`}
            />
            <span>{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
