'use client';

import Link from 'next/link';
import { AlertCircle, Calendar, WifiOff, Search, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Loading skeleton component for dashboard
 */
export function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Summary cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow p-6 border border-gray-200"
          >
            <div className="h-12 w-12 bg-gray-200 rounded-full mb-4" />
            <div className="h-8 w-24 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* Controls skeleton */}
      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div className="h-10 w-32 bg-gray-200 rounded" />
          <div className="h-10 w-32 bg-gray-200 rounded" />
          <div className="h-10 w-32 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Calendar skeleton */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div className="h-64 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

/**
 * Empty state when no compliance data is available
 */
export function EmptyDashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-gray-100 rounded-full p-6 mb-6">
        <Calendar className="w-16 h-16 text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        No Compliance Data Yet
      </h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Complete the business profile questionnaire to generate your personalized
        compliance calendar.
      </p>
      <Link
        href="/questionnaire"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Start Questionnaire
      </Link>
    </div>
  );
}

/**
 * Error state component
 */
interface DashboardErrorProps {
  error?: Error | string;
  onRetry?: () => void;
}

export function DashboardError({ error, onRetry }: DashboardErrorProps) {
  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : 'An unexpected error occurred';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-red-100 rounded-full p-6 mb-6">
        <AlertCircle className="w-16 h-16 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Oops! Something went wrong
      </h2>
      <p className="text-gray-600 mb-8 max-w-md">{errorMessage}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

/**
 * No search results state
 */
interface NoSearchResultsProps {
  onClearFilters?: () => void;
}

export function NoSearchResults({ onClearFilters }: NoSearchResultsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-gray-100 rounded-full p-4 mb-4">
        <Search className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No compliances found
      </h3>
      <p className="text-gray-600 mb-4">
        Try adjusting your filters or search terms
      </p>
      {onClearFilters && (
        <button
          onClick={onClearFilters}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

/**
 * Alert banner for upcoming high-priority deadlines
 */
interface UpcomingDeadlineAlertProps {
  count: number;
  onView?: () => void;
  onDismiss?: () => void;
}

export function UpcomingDeadlineAlert({
  count,
  onView,
  onDismiss,
}: UpcomingDeadlineAlertProps) {
  if (count === 0) return null;

  return (
    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6 rounded-r-lg flex items-center justify-between">
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0" />
        <div>
          <p className="font-semibold text-orange-900">
            You have {count} compliance deadline{count !== 1 ? 's' : ''} in the
            next 7 days
          </p>
          <p className="text-sm text-orange-700">
            These require immediate attention
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {onView && (
          <button
            onClick={onView}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
          >
            View
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-2 text-orange-600 hover:text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
            aria-label="Dismiss alert"
          >
            <span className="text-xl">×</span>
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Offline notice banner
 */
export function OfflineNotice() {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 mb-4 rounded-r-lg flex items-center gap-3">
      <WifiOff className="w-5 h-5 text-yellow-600 flex-shrink-0" />
      <p className="text-sm text-yellow-800">
        You&apos;re offline. Some features may be limited.
      </p>
    </div>
  );
}

