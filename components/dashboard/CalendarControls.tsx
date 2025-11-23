"use client";

import { useState } from "react";
import { Calendar, List, Download, ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = "month" | "list";
type SortOption = "date-asc" | "date-desc" | "priority" | "name";

interface CalendarControlsProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  filterCategory: string;
  onFilterChange: (category: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onExport: (type: "csv" | "pdf" | "ical") => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function CalendarControls({
  viewMode,
  onViewModeChange,
  filterCategory,
  onFilterChange,
  sortBy,
  onSortChange,
  onExport,
  searchQuery = "",
  onSearchChange,
}: CalendarControlsProps) {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  const categories = [
    { value: "all", label: "All Compliances" },
    { value: "tax", label: "Tax" },
    { value: "labor", label: "Labor" },
    { value: "statutory", label: "Statutory" },
  ];

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "date-asc", label: "By Date (Earliest First)" },
    { value: "date-desc", label: "By Date (Latest First)" },
    { value: "priority", label: "By Priority (High to Low)" },
    { value: "name", label: "By Name (A-Z)" },
  ];

  const handleExport = (type: "csv" | "pdf" | "ical") => {
    onExport(type);
    setIsExportMenuOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange("month")}
            className={cn(
              "px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors",
              viewMode === "month"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            <Calendar className="w-4 h-4" />
            Month
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={cn(
              "px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors",
              viewMode === "list"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            <List className="w-4 h-4" />
            List
          </button>
        </div>

        {/* Search Bar */}
        {onSearchChange && (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search compliances..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Filters and Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setIsFilterMenuOpen(!isFilterMenuOpen);
                setIsSortMenuOpen(false);
                setIsExportMenuOpen(false);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              {categories.find((c) => c.value === filterCategory)?.label ||
                "Category"}
              <ChevronDown className="w-4 h-4" />
            </button>
            {isFilterMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsFilterMenuOpen(false)}
                />
                <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-20 min-w-[180px]">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => {
                        onFilterChange(category.value);
                        setIsFilterMenuOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2 hover:bg-gray-50 text-sm",
                        filterCategory === category.value &&
                          "bg-blue-50 text-blue-700 font-medium"
                      )}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => {
                setIsSortMenuOpen(!isSortMenuOpen);
                setIsFilterMenuOpen(false);
                setIsExportMenuOpen(false);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              {sortOptions.find((s) => s.value === sortBy)?.label || "Sort"}
              <ChevronDown className="w-4 h-4" />
            </button>
            {isSortMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsSortMenuOpen(false)}
                />
                <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-20 min-w-[200px]">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onSortChange(option.value);
                        setIsSortMenuOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2 hover:bg-gray-50 text-sm",
                        sortBy === option.value &&
                          "bg-blue-50 text-blue-700 font-medium"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Export Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setIsExportMenuOpen(!isExportMenuOpen);
                setIsFilterMenuOpen(false);
                setIsSortMenuOpen(false);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
              <ChevronDown className="w-4 h-4" />
            </button>
            {isExportMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsExportMenuOpen(false)}
                />
                <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-20 min-w-[180px]">
                  <button
                    onClick={() => handleExport("csv")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                  >
                    Download as CSV
                  </button>
                  <button
                    onClick={() => handleExport("pdf")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                  >
                    Download as PDF
                  </button>
                  <button
                    onClick={() => handleExport("ical")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                  >
                    Download .ics file
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
