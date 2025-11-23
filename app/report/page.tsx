'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ComplianceReport, BusinessProfile, CalendarEntry } from '@/lib/types';
import { ExecutiveSummary } from '@/components/report/ExecutiveSummary';
import { KeyFindings } from '@/components/report/KeyFindings';
import { ComplianceOverview } from '@/components/report/ComplianceOverview';
import { CostAnalysis } from '@/components/report/CostAnalysis';
import { RiskAssessment } from '@/components/report/RiskAssessment';
import { ActionPlan } from '@/components/report/ActionPlan';
import { IndustryInsights } from '@/components/report/IndustryInsights';
import { ComplianceChecklist } from '@/components/report/ComplianceChecklist';
import {
  exportReportToPDF,
  exportReportToMarkdown,
  exportReportToWord,
} from '@/lib/report-export';
import { Download, FileText, FileDown, FileCode, ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { ReportGenerationDialog } from '@/components/report/ReportGenerationDialog';

interface ComplianceData {
  businessProfile: BusinessProfile;
  applicableCompliances: string[];
  calendar: CalendarEntry[];
}

export default function ReportPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<ComplianceReport | null>(null);
  const [activeSection, setActiveSection] = useState<string>('executive-summary');
  const [showGenerationDialog, setShowGenerationDialog] = useState(false);
  const [generationSteps, setGenerationSteps] = useState<Array<{
    id: string;
    label: string;
    status: 'pending' | 'in-progress' | 'completed' | 'error';
  }>>([]);
  const [currentGenerationStep, setCurrentGenerationStep] = useState<string | null>(null);

  // Load data and generate report
  useEffect(() => {
    const loadReport = async () => {
      try {
        if (typeof window === 'undefined') return;

        // Check if report exists in sessionStorage
        const cachedReport = sessionStorage.getItem('complianceReport');
        if (cachedReport) {
          try {
            const parsed = JSON.parse(cachedReport);
            // Convert date strings to Date objects
            parsed.generatedAt = new Date(parsed.generatedAt);
            parsed.businessProfile = parsed.businessProfile;
            parsed.upcomingCriticalDeadlines = {
              next7Days: parsed.upcomingCriticalDeadlines.next7Days.map((e: any) => ({
                ...e,
                dueDate: new Date(e.dueDate),
              })),
              next30Days: parsed.upcomingCriticalDeadlines.next30Days.map((e: any) => ({
                ...e,
                dueDate: new Date(e.dueDate),
              })),
              next90Days: parsed.upcomingCriticalDeadlines.next90Days.map((e: any) => ({
                ...e,
                dueDate: new Date(e.dueDate),
              })),
            };
            setReport(parsed);
            setIsLoading(false);
            return;
          } catch (e) {
            // Invalid cache, continue to generate
          }
        }

        // Get compliance data from sessionStorage
        const storedData = sessionStorage.getItem('complianceData');
        if (!storedData) {
          setError('No compliance data found. Please complete the questionnaire first.');
          setIsLoading(false);
          return;
        }

        const data: ComplianceData = JSON.parse(storedData);
        const calendarWithDates: CalendarEntry[] = data.calendar.map((entry) => ({
          ...entry,
          dueDate: new Date(entry.dueDate),
        }));

        // Generate report
        setIsGenerating(true);
        const response = await fetch('/api/generate-report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            businessProfile: data.businessProfile,
            calendar: calendarWithDates,
            applicableCompliances: data.applicableCompliances,
          }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Failed to generate report');
        }

        // Convert date strings to Date objects
        const generatedReport = result.report;
        generatedReport.generatedAt = new Date(generatedReport.generatedAt);
        generatedReport.upcomingCriticalDeadlines = {
          next7Days: generatedReport.upcomingCriticalDeadlines.next7Days.map((e: any) => ({
            ...e,
            dueDate: new Date(e.dueDate),
          })),
          next30Days: generatedReport.upcomingCriticalDeadlines.next30Days.map((e: any) => ({
            ...e,
            dueDate: new Date(e.dueDate),
          })),
          next90Days: generatedReport.upcomingCriticalDeadlines.next90Days.map((e: any) => ({
            ...e,
            dueDate: new Date(e.dueDate),
          })),
        };

        setReport(generatedReport);
        sessionStorage.setItem('complianceReport', JSON.stringify(generatedReport));
      } catch (err) {
        console.error('Error loading report:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load report. Please try again.'
        );
      } finally {
        setIsLoading(false);
        setIsGenerating(false);
      }
    };

    loadReport();
  }, []);

  // Initialize generation steps
  const initializeGenerationSteps = () => [
    { id: 'validate', label: 'Validating business data', status: 'pending' as const },
    { id: 'calculate', label: 'Calculating compliance costs', status: 'pending' as const },
    { id: 'assess', label: 'Assessing compliance risks', status: 'pending' as const },
    { id: 'ai', label: 'Generating AI insights', status: 'pending' as const },
    { id: 'compile', label: 'Compiling report sections', status: 'pending' as const },
    { id: 'finalize', label: 'Finalizing report', status: 'pending' as const },
  ];

  // Update generation step status
  const updateStepStatus = (stepId: string, status: 'pending' | 'in-progress' | 'completed' | 'error') => {
    setGenerationSteps((prev) =>
      prev.map((step) => (step.id === stepId ? { ...step, status } : step))
    );
    setCurrentGenerationStep(status === 'in-progress' ? stepId : null);
  };

  // Handle regenerate report
  const handleRegenerate = async () => {
    try {
      if (typeof window === 'undefined') return;

      // Get compliance data from sessionStorage
      const storedData = sessionStorage.getItem('complianceData');
      if (!storedData) {
        setError('No compliance data found. Please complete the questionnaire first.');
        return;
      }

      const data: ComplianceData = JSON.parse(storedData);
      const calendarWithDates: CalendarEntry[] = data.calendar.map((entry) => ({
        ...entry,
        dueDate: new Date(entry.dueDate),
      }));

      // Initialize steps and show dialog
      const steps = initializeGenerationSteps();
      setGenerationSteps(steps);
      setShowGenerationDialog(true);
      setIsGenerating(true);
      setError(null);

      // Step 1: Validate
      updateStepStatus('validate', 'in-progress');
      await new Promise((resolve) => setTimeout(resolve, 300));
      updateStepStatus('validate', 'completed');

      // Step 2: Calculate costs
      updateStepStatus('calculate', 'in-progress');
      await new Promise((resolve) => setTimeout(resolve, 400));
      updateStepStatus('calculate', 'completed');

      // Step 3: Assess risks
      updateStepStatus('assess', 'in-progress');
      await new Promise((resolve) => setTimeout(resolve, 300));
      updateStepStatus('assess', 'completed');

      // Step 4: Generate AI insights
      updateStepStatus('ai', 'in-progress');
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessProfile: data.businessProfile,
          calendar: calendarWithDates,
          applicableCompliances: data.applicableCompliances,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to generate report');
      }

      updateStepStatus('ai', 'completed');

      // Step 5: Compile sections
      updateStepStatus('compile', 'in-progress');
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Convert date strings to Date objects
      const generatedReport = result.report;
      generatedReport.generatedAt = new Date(generatedReport.generatedAt);
      generatedReport.upcomingCriticalDeadlines = {
        next7Days: generatedReport.upcomingCriticalDeadlines.next7Days.map((e: any) => ({
          ...e,
          dueDate: new Date(e.dueDate),
        })),
        next30Days: generatedReport.upcomingCriticalDeadlines.next30Days.map((e: any) => ({
          ...e,
          dueDate: new Date(e.dueDate),
        })),
        next90Days: generatedReport.upcomingCriticalDeadlines.next90Days.map((e: any) => ({
          ...e,
          dueDate: new Date(e.dueDate),
        })),
      };

      updateStepStatus('compile', 'completed');

      // Step 6: Finalize
      updateStepStatus('finalize', 'in-progress');
      await new Promise((resolve) => setTimeout(resolve, 200));

      setReport(generatedReport);
      sessionStorage.setItem('complianceReport', JSON.stringify(generatedReport));

      updateStepStatus('finalize', 'completed');

      // Close dialog after a short delay
      setTimeout(() => {
        setShowGenerationDialog(false);
        setIsGenerating(false);
      }, 500);
    } catch (err) {
      console.error('Error regenerating report:', err);
      updateStepStatus('ai', 'error');
      setError(
        err instanceof Error ? err.message : 'Failed to regenerate report. Please try again.'
      );
      setIsGenerating(false);
    }
  };

  // Handle export
  const handleExport = async (type: 'pdf' | 'md' | 'docx') => {
    if (!report) return;

    try {
      switch (type) {
        case 'pdf':
          await exportReportToPDF(report, report.businessProfile);
          break;
        case 'md':
          exportReportToMarkdown(report);
          break;
        case 'docx':
          await exportReportToWord(report);
          break;
      }
    } catch (err) {
      console.error('Export error:', err);
      alert(
        err instanceof Error ? err.message : 'Failed to export. Please try again.'
      );
    }
  };

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Table of contents
  const sections = [
    { id: 'executive-summary', label: 'Executive Summary' },
    { id: 'key-findings', label: 'Key Findings' },
    { id: 'compliance-overview', label: 'Compliance Overview' },
    { id: 'cost-analysis', label: 'Cost Analysis' },
    { id: 'risk-assessment', label: 'Risk Assessment' },
    { id: 'action-plan', label: 'Action Plan' },
    { id: 'industry-insights', label: 'Industry Insights' },
    { id: 'compliance-checklist', label: 'Compliance Checklist' },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          {isGenerating ? (
            <>
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Report</h2>
              <p className="text-gray-600">
                This usually takes 10-15 seconds. Please wait...
              </p>
            </>
          ) : (
            <>
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Report</h2>
            </>
          )}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Report</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // No report state
  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Report Available</h2>
          <p className="text-gray-600 mb-6">
            Please complete the questionnaire to generate a report.
          </p>
          <button
            onClick={() => router.push('/questionnaire')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Start Questionnaire
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Compliance Report</h1>
                <p className="text-sm text-gray-600">
                  {report.businessProfile.businessType} - {report.businessProfile.industry}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRegenerate}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                Regenerate
              </button>
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <button
                    onClick={() => handleExport('pdf')}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 rounded-t-lg"
                  >
                    <FileText className="w-4 h-4" />
                    Export as PDF
                  </button>
                  <button
                    onClick={() => handleExport('md')}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50"
                  >
                    <FileCode className="w-4 h-4" />
                    Export as Markdown
                  </button>
                  <button
                    onClick={() => handleExport('docx')}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 rounded-b-lg"
                  >
                    <FileDown className="w-4 h-4" />
                    Export as Word
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Generated: {format(report.generatedAt, 'dd MMM yyyy, hh:mm a')} •{' '}
            {report.generatedBy === 'openai' ? 'AI-Generated' : 'Template-Based'}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <ExecutiveSummary report={report} />
            <KeyFindings report={report} />
            <ComplianceOverview report={report} />
            <CostAnalysis report={report} />
            <RiskAssessment report={report} />
            <ActionPlan report={report} />
            <IndustryInsights report={report} />
            <ComplianceChecklist report={report} />
          </div>

          {/* Sidebar - Table of Contents (Desktop) */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Table of Contents</h3>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {section.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Generation Dialog */}
      <ReportGenerationDialog
        isOpen={showGenerationDialog}
        steps={generationSteps}
        currentStep={currentGenerationStep}
        onClose={isGenerating ? undefined : () => setShowGenerationDialog(false)}
      />
    </div>
  );
}

