"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import type { CalendarEntry } from "@/lib/types";
import { PriorityBadge } from "./PriorityBadge";
import { CategoryTag } from "./CategoryTag";
import { DateCountdown } from "./DateCountdown";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ComplianceCardProps {
  entry: CalendarEntry;
  variant?: "compact" | "detailed";
  onViewDetails?: (entry: CalendarEntry) => void;
}

export function ComplianceCard({
  entry,
  variant = "detailed",
  onViewDetails,
}: ComplianceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const priorityBorderColor = {
    High: "border-l-red-500",
    Medium: "border-l-yellow-500",
    Low: "border-l-green-500",
  };

  return (
    <div
      className={cn(
        "bg-white rounded-lg border-l-4 shadow-sm hover:shadow-md transition-shadow",
        priorityBorderColor[entry.priority]
      )}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="font-semibold text-gray-900">
                {entry.complianceName}
              </h3>
              {entry.formName !== entry.complianceName && (
                <span className="text-sm text-gray-600">
                  ({entry.formName})
                </span>
              )}
            </div>

            {variant === "detailed" && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {entry.description}
              </p>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <DateCountdown dueDate={entry.dueDate} />
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600">
                {formatDate(entry.dueDate)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <PriorityBadge priority={entry.priority} size="sm" />
            <CategoryTag category={entry.category} size="sm" />
          </div>
        </div>

        {variant === "detailed" && (
          <>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Hide Details
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Show Details
                  </>
                )}
              </button>
            </div>

            {isExpanded && (
              <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    Penalty
                  </h4>
                  <p className="text-sm text-gray-700">{entry.penalty}</p>
                </div>

                {entry.resources && entry.resources.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      Resources
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {entry.resources.map((resource, index) => (
                        <a
                          key={index}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          {resource.title}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {onViewDetails && (
                  <button
                    onClick={() => onViewDetails(entry)}
                    className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    View Full Details
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
