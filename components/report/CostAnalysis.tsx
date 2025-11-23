import type { ComplianceReport } from "@/lib/types";
import { CostVisualization } from "./CostVisualization";

interface CostAnalysisProps {
  report: ComplianceReport;
}

export function CostAnalysis({ report }: CostAnalysisProps) {
  return <CostVisualization report={report} />;
}
