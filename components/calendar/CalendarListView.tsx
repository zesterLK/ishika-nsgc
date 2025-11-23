'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { CalendarEntry } from '@/lib/types';
import { ComplianceCard } from './ComplianceCard';
import { groupCalendarByMonth } from '@/lib/calendar-utils';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CalendarListViewProps {
  calendar: CalendarEntry[];
  onEntryClick?: (entry: CalendarEntry) => void;
}

export function CalendarListView({
  calendar,
  onEntryClick,
}: CalendarListViewProps) {
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(
    new Set([format(new Date(), 'MMMM yyyy')])
  );

  const groupedCalendar = groupCalendarByMonth(calendar);

  const toggleMonth = (month: string) => {
    setExpandedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(month)) {
        next.delete(month);
      } else {
        next.add(month);
      }
      return next;
    });
  };

  // Sort months chronologically
  const sortedMonths = Array.from(groupedCalendar.keys()).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA.getTime() - dateB.getTime();
  });

  if (calendar.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No compliance entries found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedMonths.map((month) => {
        const entries = groupedCalendar.get(month) || [];
        const isExpanded = expandedMonths.has(month);

        return (
          <div key={month} className="bg-white rounded-lg border border-gray-200">
            {/* Month Header */}
            <button
              onClick={() => toggleMonth(month)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-900">{month}</h3>
                <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {entries.length} compliance{entries.length !== 1 ? 's' : ''}
                </span>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {/* Month Entries */}
            {isExpanded && (
              <div className="px-6 pb-4 space-y-3">
                {entries.map((entry) => (
                  <ComplianceCard
                    key={entry.id}
                    entry={entry}
                    variant="detailed"
                    onViewDetails={onEntryClick}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

