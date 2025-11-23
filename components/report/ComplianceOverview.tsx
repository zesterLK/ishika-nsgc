import type { ComplianceReport } from '@/lib/types';
import { FileText, Calendar, TrendingUp, DollarSign } from 'lucide-react';

interface ComplianceOverviewProps {
  report: ComplianceReport;
}

export function ComplianceOverview({ report }: ComplianceOverviewProps) {
  const { complianceOverview } = report;

  const stats = [
    {
      label: 'Total Compliances',
      value: complianceOverview.totalCompliances,
      icon: FileText,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Monthly Filings',
      value: complianceOverview.monthlyCompliances,
      icon: Calendar,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Quarterly Filings',
      value: complianceOverview.quarterlyCompliances,
      icon: TrendingUp,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      label: 'Annual Filings',
      value: complianceOverview.annualCompliances,
      icon: DollarSign,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <section id="compliance-overview" className="mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Compliance Overview</h2>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Category Breakdown */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Category Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(complianceOverview.categoryBreakdown).map(([category, count]) => (
            <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium text-gray-700">{category}</span>
              <span className="text-lg font-bold text-gray-900">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

