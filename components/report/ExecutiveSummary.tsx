import type { ComplianceReport } from "@/lib/types";

interface ExecutiveSummaryProps {
  report: ComplianceReport;
}

export function ExecutiveSummary({ report }: ExecutiveSummaryProps) {
  return (
    <section id="executive-summary" className="mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Executive Summary
      </h2>
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
        <p className="text-lg text-gray-800 leading-relaxed">
          {report.executiveSummary}
        </p>
      </div>
    </section>
  );
}
