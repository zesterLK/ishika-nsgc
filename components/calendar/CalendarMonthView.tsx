'use client';

import { useState, useMemo } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';
import type { CalendarEntry } from '@/lib/types';
import { filterCalendarByMonth } from '@/lib/calendar-utils';
import { MonthSelector } from './MonthSelector';
import { ComplianceModal } from './ComplianceModal';
import { cn } from '@/lib/utils';

interface CalendarMonthViewProps {
  calendar: CalendarEntry[];
  selectedMonth?: Date;
  onMonthChange?: (month: Date) => void;
}

export function CalendarMonthView({
  calendar,
  selectedMonth = new Date(),
  onMonthChange,
}: CalendarMonthViewProps) {
  const [currentMonth, setCurrentMonth] = useState(
    startOfMonth(selectedMonth)
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEntries, setSelectedEntries] = useState<CalendarEntry[]>([]);
  const [currentEntryIndex, setCurrentEntryIndex] = useState(0);

  const handleMonthChange = (month: Date) => {
    setCurrentMonth(startOfMonth(month));
    onMonthChange?.(month);
  };

  const monthString = format(currentMonth, 'MMMM yyyy');
  const monthEntries = useMemo(() => {
    return filterCalendarByMonth(calendar, monthString);
  }, [calendar, monthString]);

  // Calculate compliance counts for all months (for month selector)
  const complianceCountsByMonth = useMemo(() => {
    const counts = new Map<string, number>();
    calendar.forEach((entry) => {
      const month = entry.month;
      counts.set(month, (counts.get(month) || 0) + 1);
    });
    return counts;
  }, [calendar]);

  // Get all days for the calendar grid
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Group entries by date
  const entriesByDate = useMemo(() => {
    const map = new Map<string, CalendarEntry[]>();
    monthEntries.forEach((entry) => {
      const dateKey = format(entry.dueDate, 'yyyy-MM-dd');
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(entry);
    });
    return map;
  }, [monthEntries]);

  const handleDateClick = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const entries = entriesByDate.get(dateKey) || [];
    setSelectedDate(date);
    setSelectedEntries(entries);
    setCurrentEntryIndex(0);
  };

  const handleCloseModal = () => {
    setSelectedDate(null);
    setSelectedEntries([]);
    setCurrentEntryIndex(0);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'tax':
        return 'bg-blue-500';
      case 'labor':
        return 'bg-green-500';
      case 'statutory':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-4">
      {/* Month Selector */}
      <div className="flex justify-center">
        <MonthSelector
          selectedMonth={currentMonth}
          onChange={handleMonthChange}
          complianceCounts={complianceCountsByMonth}
        />
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {weekDays.map((day) => (
            <div
              key={day}
              className="px-4 py-3 text-center text-sm font-semibold text-gray-700 bg-gray-50"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {days.map((day, dayIdx) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayEntries = entriesByDate.get(dateKey) || [];
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = isSameDay(day, new Date());
            const isSelected = selectedDate && isSameDay(day, selectedDate);

            // Get top 3 entries to display
            const visibleEntries = dayEntries.slice(0, 3);
            const remainingCount = dayEntries.length - 3;

            return (
              <div
                key={day.toString()}
                className={cn(
                  'min-h-[100px] border-r border-b border-gray-200 p-2 flex flex-col',
                  !isCurrentMonth && 'bg-gray-50',
                  isToday && 'bg-blue-50',
                  isSelected && 'bg-blue-100 ring-2 ring-blue-500'
                )}
              >
                <button
                  onClick={() => handleDateClick(day)}
                  className={cn(
                    'w-full text-left flex-shrink-0',
                    !isCurrentMonth && 'text-gray-400',
                    isCurrentMonth && 'text-gray-900',
                    isToday && 'font-bold'
                  )}
                >
                  <div className="text-sm mb-1">{format(day, 'd')}</div>
                </button>

                {/* Compliance Indicators */}
                {dayEntries.length > 0 && (
                  <div className="space-y-0.5 mt-1 flex-1 overflow-hidden min-h-0">
                    {visibleEntries.map((entry, idx) => {
                      const displayText = `${entry.complianceName} - ${entry.formName}`;
                      const priorityColor = getPriorityColor(entry.priority);
                      return (
                        <div
                          key={entry.id}
                          className={cn(
                            'flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px]',
                            priorityColor,
                            'text-white font-medium min-w-0'
                          )}
                          title={displayText}
                        >
                          <div className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', priorityColor)} />
                          <span className="truncate overflow-hidden text-ellipsis whitespace-nowrap min-w-0 flex-1">
                            {displayText}
                          </span>
                        </div>
                      );
                    })}
                    {remainingCount > 0 && (
                      <div className="text-xs text-gray-600 font-medium mt-0.5">
                        +{remainingCount} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
        <span className="font-medium">Priority:</span>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Low</span>
        </div>
      </div>

      {/* Modal for selected date */}
      {selectedDate && selectedEntries.length > 0 && (
        <ComplianceModal
          entry={selectedEntries[currentEntryIndex]}
          isOpen={true}
          onClose={handleCloseModal}
          hasPrevious={currentEntryIndex > 0}
          hasNext={currentEntryIndex < selectedEntries.length - 1}
          onPrevious={() => {
            if (currentEntryIndex > 0) {
              setCurrentEntryIndex(currentEntryIndex - 1);
            }
          }}
          onNext={() => {
            if (currentEntryIndex < selectedEntries.length - 1) {
              setCurrentEntryIndex(currentEntryIndex + 1);
            }
          }}
        />
      )}
    </div>
  );
}

