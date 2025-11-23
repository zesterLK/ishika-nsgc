import type { ComplianceReport } from "@/lib/types";
import { AlertCircle, Clock, Target } from "lucide-react";

interface ActionPlanProps {
  report: ComplianceReport;
}

export function ActionPlan({ report }: ActionPlanProps) {
  const { actionPlan } = report;

  const sections = [
    {
      title: "Immediate Actions",
      subtitle: "Next 7 Days",
      items: actionPlan.immediate,
      icon: AlertCircle,
      color: "text-red-600 bg-red-50 border-red-200",
    },
    {
      title: "Short-term Actions",
      subtitle: "Next 30 Days",
      items: actionPlan.shortTerm,
      icon: Clock,
      color: "text-yellow-600 bg-yellow-50 border-yellow-200",
    },
    {
      title: "Long-term Actions",
      subtitle: "Next 90+ Days",
      items: actionPlan.longTerm,
      icon: Target,
      color: "text-green-600 bg-green-50 border-green-200",
    },
  ];

  return (
    <section id="action-plan" className="mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Action Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 ${section.color}`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-semibold text-sm">{section.title}</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{section.subtitle}</p>
              {section.items.length > 0 ? (
                <ul className="space-y-2">
                  {section.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">•</span>
                      <span className="text-gray-700 flex-1">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm italic">
                  No actions required in this timeframe
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
