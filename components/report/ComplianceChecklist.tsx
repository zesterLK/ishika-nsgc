"use client";

import { useState, useEffect } from "react";
import type { ComplianceReport, ChecklistItem } from "@/lib/types";
import { CheckCircle2, Circle } from "lucide-react";

interface ComplianceChecklistProps {
  report: ComplianceReport;
}

export function ComplianceChecklist({ report }: ComplianceChecklistProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    report.complianceChecklist
  );

  // Load saved state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(
      `checklist-${report.businessProfile.industry}`
    );
    if (saved) {
      try {
        const savedItems = JSON.parse(saved);
        setChecklist(savedItems);
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, [report.businessProfile.industry]);

  // Save state to localStorage
  const toggleItem = (id: string) => {
    const updated = checklist.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updated);
    localStorage.setItem(
      `checklist-${report.businessProfile.industry}`,
      JSON.stringify(updated)
    );
  };

  const completedCount = checklist.filter((item) => item.completed).length;
  const totalCount = checklist.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600 bg-red-50 border-red-200";
      case "Medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <section id="compliance-checklist" className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">
          Compliance Checklist
        </h2>
        <div className="text-sm text-gray-600">
          {completedCount} of {totalCount} completed
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {checklist.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => toggleItem(item.id)}
          >
            <div className="flex-shrink-0 mt-1">
              {item.completed ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <Circle className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-sm font-semibold px-2 py-1 rounded ${getPriorityColor(item.priority)}`}
                >
                  {item.priority}
                </span>
                <span className="text-xs text-gray-500 capitalize">
                  {item.timeframe}
                </span>
                {item.estimatedEffort && (
                  <span className="text-xs text-gray-500">
                    • {item.estimatedEffort}
                  </span>
                )}
              </div>
              <p
                className={`text-gray-700 ${item.completed ? "line-through text-gray-400" : ""}`}
              >
                {item.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
