"use client";

import type { ComplianceReport } from "@/lib/types";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface CostVisualizationProps {
  report: ComplianceReport;
}

const COLORS = {
  Tax: "#3b82f6",
  Labor: "#10b981",
  Statutory: "#f59e0b",
  Environmental: "#8b5cf6",
};

export function CostVisualization({ report }: CostVisualizationProps) {
  const { costAnalysis } = report;

  // Prepare data for pie chart
  const pieData = costAnalysis.breakdown.map((item) => ({
    name: item.complianceName,
    value: item.total,
    category:
      report.applicableCompliances.find((id) => {
        // Find category from calendar entries
        const entry = report.upcomingCriticalDeadlines.next30Days.find(
          (e) => e.complianceId === id
        );
        return entry?.category || "Statutory";
      }) || "Statutory",
  }));

  // Prepare data for stacked bar chart
  const barData = costAnalysis.breakdown.map((item) => ({
    name:
      item.complianceName.length > 15
        ? item.complianceName.substring(0, 15) + "..."
        : item.complianceName,
    filingFee: item.filingFee,
    professionalFee: item.professionalFee,
    software: item.software,
    timeValue: item.timeValue,
    total: item.total,
  }));

  // Prepare data for monthly cost timeline (simplified - distribute annual cost across months)
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(2025, i, 1).toLocaleString("default", {
      month: "short",
    });
    // Distribute costs evenly for now (in production, would calculate based on actual deadlines)
    const monthlyCost = Math.round(costAnalysis.totalAnnualCost / 12);
    return {
      month,
      cost: monthlyCost,
    };
  });

  return (
    <section id="cost-analysis" className="mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Cost Analysis</h2>

      {/* Total Cost Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg mb-6">
        <div className="text-sm font-medium opacity-90 mb-1">
          Total Annual Compliance Cost
        </div>
        <div className="text-4xl font-bold">
          {formatCurrency(costAnalysis.totalAnnualCost)}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Cost Distribution by Compliance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props: any) => {
                  const { name, percent } = props;
                  return `${name || ""}: ${((percent || 0) * 100).toFixed(0)}%`;
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      COLORS[entry.category as keyof typeof COLORS] || "#94a3b8"
                    }
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stacked Bar Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Cost Breakdown by Component
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis
                tickFormatter={(value: number) =>
                  `₹${(value / 1000).toFixed(0)}k`
                }
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value as number)}
              />
              <Legend />
              <Bar
                dataKey="filingFee"
                stackId="a"
                fill="#ef4444"
                name="Filing Fee"
              />
              <Bar
                dataKey="professionalFee"
                stackId="a"
                fill="#3b82f6"
                name="Professional"
              />
              <Bar
                dataKey="software"
                stackId="a"
                fill="#10b981"
                name="Software"
              />
              <Bar
                dataKey="timeValue"
                stackId="a"
                fill="#f59e0b"
                name="Time Value"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Timeline */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Estimated Monthly Cost Distribution
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis
              tickFormatter={(value: number) =>
                `₹${(value / 1000).toFixed(0)}k`
              }
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value as number)}
            />
            <Line
              type="monotone"
              dataKey="cost"
              stroke="#3b82f6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Cost Breakdown Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Detailed Cost Breakdown
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compliance
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Filing Fee
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Professional
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Software
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time Value
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % of Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {costAnalysis.breakdown.map((item, index) => {
                const percentage =
                  (item.total / costAnalysis.totalAnnualCost) * 100;
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.complianceName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                      {formatCurrency(item.filingFee)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                      {formatCurrency(item.professionalFee)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                      {formatCurrency(item.software)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                      {formatCurrency(item.timeValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {formatCurrency(item.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">
                      {percentage.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  Total
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">
                  {formatCurrency(
                    costAnalysis.breakdown.reduce(
                      (sum, item) => sum + item.filingFee,
                      0
                    )
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">
                  {formatCurrency(
                    costAnalysis.breakdown.reduce(
                      (sum, item) => sum + item.professionalFee,
                      0
                    )
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">
                  {formatCurrency(
                    costAnalysis.breakdown.reduce(
                      (sum, item) => sum + item.software,
                      0
                    )
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">
                  {formatCurrency(
                    costAnalysis.breakdown.reduce(
                      (sum, item) => sum + item.timeValue,
                      0
                    )
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">
                  {formatCurrency(costAnalysis.totalAnnualCost)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">
                  100%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Industry Comparison & Savings */}
      {costAnalysis.comparisonToIndustryAverage && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-blue-900 mb-2">
              Industry Comparison
            </h4>
            <p className="text-blue-800">
              {costAnalysis.comparisonToIndustryAverage}
            </p>
          </div>

          {costAnalysis.potentialSavings.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-green-900 mb-2">
                Potential Savings
              </h4>
              <ul className="space-y-2">
                {costAnalysis.potentialSavings.map((saving, index) => (
                  <li
                    key={index}
                    className="text-green-800 flex items-start gap-2"
                  >
                    <span>•</span>
                    <span>{saving}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
