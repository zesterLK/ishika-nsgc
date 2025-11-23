import type { ComplianceReport } from "@/lib/types";
import { CheckCircle2 } from "lucide-react";

interface KeyFindingsProps {
  report: ComplianceReport;
}

export function KeyFindings({ report }: KeyFindingsProps) {
  return (
    <section id="key-findings" className="mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Findings</h2>
      <div className="space-y-4">
        {report.keyFindings.map((finding, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-gray-700 flex-1">{finding}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
