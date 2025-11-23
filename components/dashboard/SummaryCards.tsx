"use client";

import { FileText, Calendar, AlertTriangle, DollarSign } from "lucide-react";
import type { CalendarEntry, BusinessProfile } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { format, isSameMonth } from "date-fns";

interface SummaryCardsProps {
  calendar: CalendarEntry[];
  businessProfile?: BusinessProfile;
  applicableCompliances?: string[];
}

/**
 * Calculates total number of unique compliances
 */
function calculateTotalCompliances(calendar: CalendarEntry[]): number {
  const uniqueComplianceIds = new Set(
    calendar.map((entry) => entry.complianceId)
  );
  return uniqueComplianceIds.size;
}

/**
 * Calculates number of entries due in current month
 */
function calculateUpcomingThisMonth(calendar: CalendarEntry[]): number {
  const currentMonth = new Date();
  return calendar.filter((entry) => isSameMonth(entry.dueDate, currentMonth))
    .length;
}

/**
 * Calculates number of high priority items
 */
function calculateHighPriority(calendar: CalendarEntry[]): number {
  return calendar.filter((entry) => entry.priority === "High").length;
}

/**
 * Estimates annual compliance cost based on compliance types
 * Uses the same calculation logic as report-generator.ts
 */
function calculateEstimatedCost(
  applicableCompliances: string[],
  businessProfile?: BusinessProfile
): number {
  const employeeCount = businessProfile?.employeeCount || 10;

  // Size adjustment factors (same as report-generator.ts)
  let sizeMultiplier = 1.0;
  if (employeeCount < 10) {
    sizeMultiplier = 0.8; // -20% for small businesses
  } else if (employeeCount >= 50 && employeeCount < 100) {
    sizeMultiplier = 1.3; // +30% for medium businesses
  } else if (employeeCount >= 100) {
    sizeMultiplier = 1.5; // +50% for large businesses
  }

  // Base costs (same as report-generator.ts)
  const complianceCosts: Record<
    string,
    {
      filingFee: number;
      professionalFee: number;
      software: number;
      timeValue: number;
    }
  > = {
    gst: {
      filingFee: 0,
      professionalFee: 12000,
      software: 6000,
      timeValue: 2000,
    },
    epf: {
      filingFee: 0,
      professionalFee: 6000,
      software: 0,
      timeValue: 3000,
    },
    esi: {
      filingFee: 0,
      professionalFee: 4000,
      software: 0,
      timeValue: 2000,
    },
    "professional-tax": {
      filingFee: 0,
      professionalFee: 2000,
      software: 0,
      timeValue: 1000,
    },
    tds: {
      filingFee: 0,
      professionalFee: 5000,
      software: 2000,
      timeValue: 1000,
    },
    "tax-audit": {
      filingFee: 0,
      professionalFee: 25000,
      software: 5000,
      timeValue: 0,
    },
    "income-tax": {
      filingFee: 0,
      professionalFee: 8000,
      software: 3000,
      timeValue: 2000,
    },
    "msme-annual-return": {
      filingFee: 0,
      professionalFee: 1500,
      software: 0,
      timeValue: 500,
    },
    "msme-form-1": {
      filingFee: 0,
      professionalFee: 1000,
      software: 0,
      timeValue: 0,
    },
    "shops-establishments": {
      filingFee: 0,
      professionalFee: 2000,
      software: 0,
      timeValue: 500,
    },
  };

  return applicableCompliances.reduce((total, complianceId) => {
    const baseCost = complianceCosts[complianceId] || {
      filingFee: 0,
      professionalFee: 2000,
      software: 0,
      timeValue: 1000,
    };

    const cost = Math.round(
      baseCost.filingFee +
        baseCost.professionalFee * sizeMultiplier +
        baseCost.software +
        baseCost.timeValue * sizeMultiplier
    );

    return total + cost;
  }, 0);
}

export function SummaryCards({
  calendar,
  applicableCompliances = [],
  businessProfile,
}: SummaryCardsProps) {
  const totalCompliances = calculateTotalCompliances(calendar);
  const upcomingThisMonth = calculateUpcomingThisMonth(calendar);
  const highPriority = calculateHighPriority(calendar);
  const estimatedCost = calculateEstimatedCost(
    applicableCompliances,
    businessProfile
  );

  const cards = [
    {
      title: "Total Compliances",
      value: totalCompliances,
      subtitle: "Active compliance requirements",
      icon: FileText,
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      valueColor: "text-blue-600",
    },
    {
      title: "Upcoming This Month",
      value: upcomingThisMonth,
      subtitle: `Deadlines in ${format(new Date(), "MMMM")}`,
      icon: Calendar,
      color: "green",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      valueColor: "text-green-600",
    },
    {
      title: "High Priority Items",
      value: highPriority,
      subtitle: "Requires immediate attention",
      icon: AlertTriangle,
      color: "red",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      valueColor: "text-red-600",
      pulse: highPriority > 0,
    },
    {
      title: "Estimated Annual Cost",
      value: formatCurrency(estimatedCost),
      subtitle: "Compliance + filing costs",
      icon: DollarSign,
      color: "orange",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      valueColor: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`${card.bgColor} rounded-lg p-3 ${card.pulse ? "animate-pulse" : ""}`}
              >
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
            <div className={card.valueColor}>
              <div className="text-3xl font-bold mb-1">{card.value}</div>
              <div className="text-sm font-semibold text-gray-900 mb-1">
                {card.title}
              </div>
              <div className="text-xs text-gray-600">{card.subtitle}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
