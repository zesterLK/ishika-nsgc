'use client';

import { useEffect } from 'react';
import { X, ExternalLink, Calendar as CalendarIcon } from 'lucide-react';
import type { CalendarEntry } from '@/lib/types';
import { PriorityBadge } from './PriorityBadge';
import { CategoryTag } from './CategoryTag';
import { DateCountdown } from './DateCountdown';
import { formatDate } from '@/lib/utils';
import { exportToGoogleCalendar } from '@/lib/export-utils';
import { cn } from '@/lib/utils';

interface ComplianceModalProps {
  entry: CalendarEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export function ComplianceModal({
  entry,
  isOpen,
  onClose,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
}: ComplianceModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !entry) return null;

  const handleAddToGoogleCalendar = () => {
    exportToGoogleCalendar(entry);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">
              {entry.complianceName}
            </h2>
            {entry.formName !== entry.complianceName && (
              <span className="text-gray-600">({entry.formName})</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasPrevious && onPrevious && (
              <button
                onClick={onPrevious}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Previous compliance"
              >
                ←
              </button>
            )}
            {hasNext && onNext && (
              <button
                onClick={onNext}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Next compliance"
              >
                →
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="flex items-center gap-3 flex-wrap">
            <PriorityBadge priority={entry.priority} size="md" />
            <CategoryTag category={entry.category} size="md" />
            <DateCountdown dueDate={entry.dueDate} />
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              Description
            </h3>
            <p className="text-gray-700">{entry.description}</p>
          </div>

          {/* Due Date */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              Due Date
            </h3>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{formatDate(entry.dueDate)}</span>
            </div>
          </div>

          {/* Penalty */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              Penalty for Late Filing
            </h3>
            <p className="text-gray-700">{entry.penalty}</p>
          </div>

          {/* Resources */}
          {entry.resources && entry.resources.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                Official Resources
              </h3>
              <div className="space-y-2">
                {entry.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{resource.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-gray-200 flex gap-3">
            <button
              onClick={handleAddToGoogleCalendar}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <CalendarIcon className="w-4 h-4" />
              Add to Google Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

