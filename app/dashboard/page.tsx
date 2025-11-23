"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import type { CalendarEntry, BusinessProfile } from "@/lib/types";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { CalendarControls } from "@/components/dashboard/CalendarControls";
import { CalendarMonthView } from "@/components/calendar/CalendarMonthView";
import { CalendarListView } from "@/components/calendar/CalendarListView";
import { ComplianceModal } from "@/components/calendar/ComplianceModal";
import {
  DashboardLoadingSkeleton,
  EmptyDashboard,
  DashboardError,
  NoSearchResults,
  UpcomingDeadlineAlert,
} from "@/components/dashboard/DashboardStates";
import {
  filterCalendarByCategory,
  sortCalendarByDate,
} from "@/lib/calendar-utils";
import { exportToCSV, exportToPDF, exportToICal } from "@/lib/export-utils";
import type { Metadata } from "next";

type ViewMode = "month" | "list";
type SortOption = "date-asc" | "date-desc" | "priority" | "name";

interface ComplianceData {
  businessProfile: BusinessProfile;
  applicableCompliances: string[];
  calendar: CalendarEntry[];
  summary: {
    totalCompliances: number;
    monthlyCompliances: number;
    quarterlyCompliances: number;
    annualCompliances: number;
    totalCalendarEntries: number;
    estimatedAnnualCost: number;
  };
  generatedAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<ComplianceData | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("date-asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<CalendarEntry | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dismissedAlert, setDismissedAlert] = useState(false);

  // Load data from sessionStorage
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;

      const storedData = sessionStorage.getItem("complianceData");
      if (!storedData) {
        setIsLoading(false);
        return;
      }

      const parsedData = JSON.parse(storedData) as ComplianceData;

      // Convert ISO date strings to Date objects
      const calendarWithDates: CalendarEntry[] = parsedData.calendar.map(
        (entry) => ({
          ...entry,
          dueDate: new Date(entry.dueDate),
        })
      );

      setData({
        ...parsedData,
        calendar: calendarWithDates,
      });
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to load compliance data")
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-switch to list view when searching
  useEffect(() => {
    if (searchQuery.trim() && viewMode === "month") {
      setViewMode("list");
    }
  }, [searchQuery, viewMode]);

  // Filter, sort, and search calendar entries
  const filteredAndSortedCalendar = useMemo(() => {
    if (!data) return [];

    let result = [...data.calendar];

    // Apply category filter
    if (filterCategory !== "all") {
      result = filterCalendarByCategory(result, filterCategory);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (entry) =>
          entry.complianceName.toLowerCase().includes(query) ||
          entry.formName.toLowerCase().includes(query) ||
          entry.description.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "date-asc":
        result = sortCalendarByDate(result);
        break;
      case "date-desc":
        result = sortCalendarByDate(result).reverse();
        break;
      case "priority":
        result.sort((a, b) => {
          const priorityOrder = { High: 0, Medium: 1, Low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        break;
      case "name":
        result.sort((a, b) => a.complianceName.localeCompare(b.complianceName));
        break;
    }

    return result;
  }, [data, filterCategory, sortBy, searchQuery]);

  // Calculate high priority count
  const highPriorityCount = useMemo(() => {
    return filteredAndSortedCalendar.filter((e) => e.priority === "High")
      .length;
  }, [filteredAndSortedCalendar]);

  // Handle export
  const handleExport = (type: "csv" | "pdf" | "ical") => {
    if (!data) return;

    try {
      switch (type) {
        case "csv":
          exportToCSV(filteredAndSortedCalendar, data.businessProfile);
          break;
        case "pdf":
          exportToPDF(filteredAndSortedCalendar, data.businessProfile);
          break;
        case "ical":
          exportToICal(filteredAndSortedCalendar);
          break;
      }
    } catch (err) {
      console.error("Export error:", err);
      alert(
        err instanceof Error
          ? err.message
          : "Failed to export. Please try again."
      );
    }
  };

  // Handle entry click
  const handleEntryClick = (entry: CalendarEntry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  // Handle modal navigation
  const handleModalPrevious = () => {
    if (!selectedEntry || !data) return;
    const currentIndex = filteredAndSortedCalendar.findIndex(
      (e) => e.id === selectedEntry.id
    );
    if (currentIndex > 0) {
      setSelectedEntry(filteredAndSortedCalendar[currentIndex - 1]);
    }
  };

  const handleModalNext = () => {
    if (!selectedEntry || !data) return;
    const currentIndex = filteredAndSortedCalendar.findIndex(
      (e) => e.id === selectedEntry.id
    );
    if (currentIndex < filteredAndSortedCalendar.length - 1) {
      setSelectedEntry(filteredAndSortedCalendar[currentIndex + 1]);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <DashboardLoadingSkeleton />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <DashboardError
            error={error}
            onRetry={() => {
              setError(null);
              setIsLoading(true);
              // Reload page
              window.location.reload();
            }}
          />
        </div>
      </div>
    );
  }

  // Empty state
  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <EmptyDashboard />
        </div>
      </div>
    );
  }

  // No search results
  if (
    filteredAndSortedCalendar.length === 0 &&
    (filterCategory !== "all" || searchQuery)
  ) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <SummaryCards
            calendar={data.calendar}
            applicableCompliances={data.applicableCompliances}
            businessProfile={data.businessProfile}
          />
          <div className="mt-6">
            <CalendarControls
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              filterCategory={filterCategory}
              onFilterChange={setFilterCategory}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onExport={handleExport}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
          <div className="mt-6">
            <NoSearchResults
              onClearFilters={() => {
                setFilterCategory("all");
                setSearchQuery("");
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Compliance Dashboard
            </h1>
            <p className="text-gray-600">
              Your personalized compliance calendar and deadlines
            </p>
          </div>
          <button
            onClick={() => router.push("/report")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            View Report
          </button>
        </div>

        {/* Alert Banner */}
        {!dismissedAlert && highPriorityCount > 0 && (
          <UpcomingDeadlineAlert
            count={highPriorityCount}
            onView={() => {
              setFilterCategory("all");
              setSortBy("priority");
              setDismissedAlert(true);
            }}
            onDismiss={() => setDismissedAlert(true)}
          />
        )}

        {/* Summary Cards */}
        <SummaryCards
          calendar={data.calendar}
          applicableCompliances={data.applicableCompliances}
          businessProfile={data.businessProfile}
        />

        {/* Controls */}
        <div className="mt-6">
          <CalendarControls
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            filterCategory={filterCategory}
            onFilterChange={setFilterCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onExport={handleExport}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Calendar Display */}
        <div className="mt-6">
          {viewMode === "month" ? (
            <CalendarMonthView
              calendar={data.calendar}
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
            />
          ) : (
            <CalendarListView
              calendar={filteredAndSortedCalendar}
              onEntryClick={handleEntryClick}
            />
          )}
        </div>

        {/* Compliance Modal */}
        {selectedEntry && (
          <ComplianceModal
            entry={selectedEntry}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedEntry(null);
            }}
            hasPrevious={
              filteredAndSortedCalendar.findIndex(
                (e) => e.id === selectedEntry.id
              ) > 0
            }
            hasNext={
              filteredAndSortedCalendar.findIndex(
                (e) => e.id === selectedEntry.id
              ) <
              filteredAndSortedCalendar.length - 1
            }
            onPrevious={handleModalPrevious}
            onNext={handleModalNext}
          />
        )}
      </div>
    </div>
  );
}
