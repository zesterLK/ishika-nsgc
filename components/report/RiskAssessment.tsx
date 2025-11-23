"use client";

import type { ComplianceReport } from "@/lib/types";
import {
  AlertTriangle,
  Shield,
  Clock,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

interface RiskAssessmentProps {
  report: ComplianceReport;
}

export function RiskAssessment({ report }: RiskAssessmentProps) {
  const { riskAssessment } = report;

  // Calculate risk score percentage for gauge
  const riskPercentage = (riskAssessment.riskScore / 10) * 100;

  // Determine gauge color
  const getGaugeColor = () => {
    if (riskAssessment.riskScore <= 3) return "#10b981"; // Green
    if (riskAssessment.riskScore <= 6) return "#f59e0b"; // Yellow
    return "#ef4444"; // Red
  };

  // Risk categories
  const riskCategories = [
    {
      name: "Operational Risk",
      description: "Complexity of compliance requirements",
      score: Math.min(riskAssessment.riskScore, 10),
      icon: Clock,
    },
    {
      name: "Financial Risk",
      description: "High-penalty compliance areas",
      score:
        riskAssessment.riskFactors.filter((f) => f.severity === "High").length *
        2,
      icon: AlertTriangle,
    },
    {
      name: "Time Risk",
      description: "Frequency of compliance deadlines",
      score: Math.min(report.complianceOverview.monthlyCompliances / 2, 10),
      icon: Clock,
    },
    {
      name: "Knowledge Risk",
      description: "Lack of compliance expertise",
      score: riskAssessment.riskScore > 6 ? 7 : riskAssessment.riskScore,
      icon: BookOpen,
    },
  ];

  // Calculate health score (0-100)
  const healthScore = Math.max(0, 100 - riskAssessment.riskScore * 10);
  const healthGrade =
    healthScore >= 90
      ? "A"
      : healthScore >= 80
        ? "B"
        : healthScore >= 70
          ? "C"
          : healthScore >= 60
            ? "D"
            : "F";

  return (
    <section id="risk-assessment" className="mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Risk Assessment</h2>

      {/* Risk Gauge */}
      <div className="bg-white p-8 rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-64 h-64">
            {/* SVG Gauge */}
            <svg
              className="transform -rotate-90"
              width="256"
              height="256"
              viewBox="0 0 256 256"
            >
              {/* Background arc */}
              <circle
                cx="128"
                cy="128"
                r="100"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="20"
                strokeLinecap="round"
              />
              {/* Risk arc */}
              <circle
                cx="128"
                cy="128"
                r="100"
                fill="none"
                stroke={getGaugeColor()}
                strokeWidth="20"
                strokeLinecap="round"
                strokeDasharray={`${(riskPercentage / 100) * 628} 628`}
                className="transition-all duration-500"
              />
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div
                className="text-4xl font-bold"
                style={{ color: getGaugeColor() }}
              >
                {riskAssessment.riskScore}
              </div>
              <div className="text-sm text-gray-600">/ 10</div>
              <div
                className="text-lg font-semibold mt-2"
                style={{ color: getGaugeColor() }}
              >
                {riskAssessment.overallRisk} Risk
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {riskCategories.map((category) => {
          const Icon = category.icon;
          const categoryScore = Math.min(category.score, 10);
          const categoryPercentage = (categoryScore / 10) * 100;
          const categoryColor =
            categoryScore <= 3
              ? "#10b981"
              : categoryScore <= 6
                ? "#f59e0b"
                : "#ef4444";

          return (
            <div
              key={category.name}
              className="bg-white p-6 rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <Icon className="w-6 h-6 text-gray-600" />
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {category.description}
              </p>
              <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${categoryPercentage}%`,
                    backgroundColor: categoryColor,
                  }}
                />
              </div>
              <div
                className="mt-2 text-sm font-medium"
                style={{ color: categoryColor }}
              >
                Score: {categoryScore.toFixed(1)}/10
              </div>
            </div>
          );
        })}
      </div>

      {/* Compliance Health Score */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium opacity-90 mb-1">
              Compliance Health Score
            </div>
            <div className="text-4xl font-bold">{healthScore}/100</div>
            <div className="text-2xl font-bold mt-2">Grade: {healthGrade}</div>
          </div>
          <div className="text-right">
            <Shield className="w-16 h-16 opacity-50" />
          </div>
        </div>
      </div>

      {/* Risk Factors */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Risk Factors
        </h3>
        <div className="space-y-4">
          {riskAssessment.riskFactors.map((factor, index) => {
            const severityColor =
              factor.severity === "High"
                ? "bg-red-50 border-red-200 text-red-800"
                : factor.severity === "Medium"
                  ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                  : "bg-green-50 border-green-200 text-green-800";

            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <AlertTriangle
                      className={`w-6 h-6 ${
                        factor.severity === "High"
                          ? "text-red-600"
                          : factor.severity === "Medium"
                            ? "text-yellow-600"
                            : "text-green-600"
                      }`}
                    />
                    <h4 className="text-lg font-semibold text-gray-900">
                      {factor.factor}
                    </h4>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${severityColor}`}
                  >
                    {factor.severity}
                  </span>
                </div>
                <p className="text-gray-700 mb-3">{factor.description}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-gray-600">Impact:</span>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full ${
                          i < factor.impact ? "bg-orange-500" : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                  <p className="text-sm text-blue-900">
                    <strong>Mitigation:</strong> {factor.mitigation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      {riskAssessment.recommendations.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-green-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6" />
            Recommendations
          </h3>
          <ul className="space-y-2">
            {riskAssessment.recommendations.map((recommendation, index) => (
              <li key={index} className="text-green-800 flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
