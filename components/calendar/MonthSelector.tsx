'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth } from 'date-fns';
import { cn } from '@/lib/utils';

interface MonthSelectorProps {
  selectedMonth: Date;
  onChange: (month: Date) => void;
  complianceCounts?: Map<string, number>;
}

export function MonthSelector({
  selectedMonth,
  onChange,
  complianceCounts,
}: MonthSelectorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handlePrevious = () => {
    onChange(subMonths(selectedMonth, 1));
  };

  const handleNext = () => {
    onChange(addMonths(selectedMonth, 1));
  };

  const handleToday = () => {
    onChange(startOfMonth(new Date()));
    setIsDropdownOpen(false);
  };

  const handleMonthSelect = (monthsAgo: number) => {
    const newMonth = startOfMonth(addMonths(new Date(), -monthsAgo));
    onChange(newMonth);
    setIsDropdownOpen(false);
  };

  const getComplianceCount = (month: string) => {
    return complianceCounts?.get(month) || 0;
  };

  const monthString = format(selectedMonth, 'MMMM yyyy');
  const count = getComplianceCount(monthString);

  // Generate month options (current month + next 11 months)
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const month = startOfMonth(addMonths(new Date(), i));
    return {
      date: month,
      label: format(month, 'MMMM yyyy'),
      count: getComplianceCount(format(month, 'MMMM yyyy')),
    };
  });

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handlePrevious}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Previous month"
      >
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      </button>

      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-gray-900"
        >
          <Calendar className="w-5 h-5" />
          <span>{monthString}</span>
          {count > 0 && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              {count}
            </span>
          )}
        </button>

        {isDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsDropdownOpen(false)}
            />
            <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-20 min-w-[200px] max-h-[300px] overflow-y-auto">
              <div className="p-2">
                <button
                  onClick={handleToday}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium text-blue-600"
                >
                  Jump to Today
                </button>
                <div className="border-t border-gray-200 my-2" />
                {monthOptions.map((option) => {
                  const isSelected = format(selectedMonth, 'MMMM yyyy') === option.label;
                  return (
                    <button
                      key={option.label}
                      onClick={() => {
                        const monthsDiff = 
                          (option.date.getFullYear() - new Date().getFullYear()) * 12 +
                          (option.date.getMonth() - new Date().getMonth());
                        handleMonthSelect(-monthsDiff);
                      }}
                      className={cn(
                        'w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm flex items-center justify-between',
                        isSelected && 'bg-blue-50 text-blue-700 font-medium'
                      )}
                    >
                      <span>{option.label}</span>
                      <span className={cn(
                        'px-2 py-0.5 rounded-full text-xs font-medium',
                        option.count > 0
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-400'
                      )}>
                        {option.count > 0 ? option.count : '0'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      <button
        onClick={handleNext}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Next month"
      >
        <ChevronRight className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
}

