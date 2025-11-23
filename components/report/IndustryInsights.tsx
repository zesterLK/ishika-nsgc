import type { ComplianceReport } from "@/lib/types";
import { Lightbulb, AlertTriangle, TrendingUp, BookOpen } from "lucide-react";

interface IndustryInsightsProps {
  report: ComplianceReport;
}

export function IndustryInsights({ report }: IndustryInsightsProps) {
  const { industrySpecificInsights } = report;

  if (industrySpecificInsights.length === 0) {
    return null;
  }

  const getIcon = (index: number) => {
    const icons = [Lightbulb, AlertTriangle, TrendingUp, BookOpen];
    return icons[index % icons.length];
  };

  const getColor = (index: number) => {
    const colors = [
      "bg-blue-50 border-blue-200 text-blue-800",
      "bg-yellow-50 border-yellow-200 text-yellow-800",
      "bg-green-50 border-green-200 text-green-800",
      "bg-purple-50 border-purple-200 text-purple-800",
    ];
    return colors[index % colors.length];
  };

  return (
    <section id="industry-insights" className="mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Industry-Specific Insights
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {industrySpecificInsights.map((insight, index) => {
          const Icon = getIcon(index);
          return (
            <div
              key={index}
              className={`flex items-start gap-4 p-5 rounded-lg border ${getColor(index)}`}
            >
              <Icon className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <p className="flex-1 font-medium">{insight}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
