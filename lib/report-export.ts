import type { ComplianceReport, BusinessProfile } from './types';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

/**
 * Format report for export (clean and prepare data)
 */
export function formatReportForExport(report: ComplianceReport): {
  businessName: string;
  generatedDate: string;
  executiveSummary: string;
  keyFindings: string[];
  costBreakdown: Array<{
    compliance: string;
    filingFee: number;
    professionalFee: number;
    software: number;
    timeValue: number;
    total: number;
  }>;
  riskLevel: string;
  riskScore: number;
  actionItems: Array<{
    title: string;
    priority: string;
    timeframe: string;
  }>;
} {
  return {
    businessName: `${report.businessProfile.businessType} - ${report.businessProfile.industry}`,
    generatedDate: format(report.generatedAt, 'dd MMM yyyy, hh:mm a'),
    executiveSummary: report.executiveSummary,
    keyFindings: report.keyFindings,
    costBreakdown: report.costAnalysis.breakdown.map((item) => ({
      compliance: item.complianceName,
      filingFee: item.filingFee,
      professionalFee: item.professionalFee,
      software: item.software,
      timeValue: item.timeValue,
      total: item.total,
    })),
    riskLevel: report.riskAssessment.overallRisk,
    riskScore: report.riskAssessment.riskScore,
    actionItems: report.complianceChecklist.map((item) => ({
      title: item.title,
      priority: item.priority,
      timeframe: item.timeframe,
    })),
  };
}

/**
 * Generate filename with date
 */
export function generateReportFilename(type: 'pdf' | 'md' | 'docx'): string {
  const dateStr = format(new Date(), 'yyyy-MM-dd');
  return `compliance-report-${dateStr}.${type}`;
}

/**
 * Format currency for display
 */
function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Export report to PDF using jsPDF
 */
export async function exportReportToPDF(
  report: ComplianceReport,
  businessProfile: BusinessProfile
): Promise<void> {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Helper function to add new page if needed
    const checkPageBreak = (requiredSpace: number) => {
      if (yPosition + requiredSpace > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
    };

    // Cover Page
    doc.setFontSize(24);
    doc.text('Compliance Report', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    doc.setFontSize(16);
    doc.text(businessProfile.businessType, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    doc.setFontSize(12);
    doc.text(`${businessProfile.industry} - ${businessProfile.state}`, pageWidth / 2, yPosition, {
      align: 'center',
    });
    yPosition += 10;

    doc.setFontSize(10);
    doc.text(
      `Generated: ${format(report.generatedAt, 'dd MMM yyyy, hh:mm a')}`,
      pageWidth / 2,
      yPosition,
      { align: 'center' }
    );
    yPosition += 20;

    // Page 2: Executive Summary
    doc.addPage();
    yPosition = 20;

    doc.setFontSize(18);
    doc.text('Executive Summary', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    const summaryLines = doc.splitTextToSize(report.executiveSummary, pageWidth - 40);
    doc.text(summaryLines, 20, yPosition);
    yPosition += summaryLines.length * 6 + 10;

    // Key Findings
    checkPageBreak(30);
    doc.setFontSize(18);
    doc.text('Key Findings', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    report.keyFindings.forEach((finding) => {
      checkPageBreak(8);
      doc.text(`• ${finding}`, 25, yPosition);
      yPosition += 7;
    });
    yPosition += 5;

    // Cost Analysis Table
    checkPageBreak(50);
    doc.setFontSize(18);
    doc.text('Cost Analysis', 20, yPosition);
    yPosition += 10;

    const costTableData = report.costAnalysis.breakdown.map((item) => [
      item.complianceName,
      formatCurrency(item.filingFee),
      formatCurrency(item.professionalFee),
      formatCurrency(item.software),
      formatCurrency(item.timeValue),
      formatCurrency(item.total),
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Compliance', 'Filing Fee', 'Professional', 'Software', 'Time', 'Total']],
      body: costTableData,
      theme: 'striped',
      headStyles: { fillColor: [30, 64, 175] },
      styles: { fontSize: 9 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;

    // Total Cost
    doc.setFontSize(12);
    doc.text(
      `Total Annual Cost: ${formatCurrency(report.costAnalysis.totalAnnualCost)}`,
      pageWidth - 20,
      yPosition,
      { align: 'right' }
    );
    yPosition += 10;

    // Risk Assessment
    checkPageBreak(30);
    doc.setFontSize(18);
    doc.text('Risk Assessment', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.text(`Overall Risk Level: ${report.riskAssessment.overallRisk}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Risk Score: ${report.riskAssessment.riskScore}/10`, 20, yPosition);
    yPosition += 10;

    doc.setFontSize(14);
    doc.text('Risk Factors:', 20, yPosition);
    yPosition += 8;

    doc.setFontSize(11);
    report.riskAssessment.riskFactors.slice(0, 5).forEach((factor) => {
      checkPageBreak(15);
      doc.text(`• ${factor.factor} (${factor.severity})`, 25, yPosition);
      yPosition += 6;
      const descLines = doc.splitTextToSize(factor.description, pageWidth - 50);
      doc.text(descLines, 30, yPosition);
      yPosition += descLines.length * 5 + 3;
    });

    // Action Plan
    checkPageBreak(40);
    doc.setFontSize(18);
    doc.text('Action Plan', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(14);
    doc.text('Immediate Actions (Next 7 Days):', 20, yPosition);
    yPosition += 8;

    doc.setFontSize(11);
    report.actionPlan.immediate.forEach((action) => {
      checkPageBreak(8);
      doc.text(`• ${action}`, 25, yPosition);
      yPosition += 7;
    });
    yPosition += 5;

    doc.setFontSize(14);
    doc.text('Short-term Actions (Next 30 Days):', 20, yPosition);
    yPosition += 8;

    doc.setFontSize(11);
    report.actionPlan.shortTerm.forEach((action) => {
      checkPageBreak(8);
      doc.text(`• ${action}`, 25, yPosition);
      yPosition += 7;
    });
    yPosition += 5;

    if (report.actionPlan.longTerm.length > 0) {
      checkPageBreak(20);
      doc.setFontSize(14);
      doc.text('Long-term Actions (Next 90+ Days):', 20, yPosition);
      yPosition += 8;

      doc.setFontSize(11);
      report.actionPlan.longTerm.forEach((action) => {
        checkPageBreak(8);
        doc.text(`• ${action}`, 25, yPosition);
        yPosition += 7;
      });
      yPosition += 5;
    }

    // Compliance Overview
    checkPageBreak(40);
    doc.setFontSize(18);
    doc.text('Compliance Overview', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.text(`Total Compliances: ${report.complianceOverview.totalCompliances}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Monthly Compliances: ${report.complianceOverview.monthlyCompliances}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Quarterly Compliances: ${report.complianceOverview.quarterlyCompliances}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Annual Compliances: ${report.complianceOverview.annualCompliances}`, 20, yPosition);
    yPosition += 10;

    if (Object.keys(report.complianceOverview.categoryBreakdown).length > 0) {
      doc.setFontSize(14);
      doc.text('Category Breakdown:', 20, yPosition);
      yPosition += 8;

      doc.setFontSize(11);
      Object.entries(report.complianceOverview.categoryBreakdown).forEach(([category, count]) => {
        checkPageBreak(8);
        doc.text(`• ${category}: ${count}`, 25, yPosition);
        yPosition += 7;
      });
      yPosition += 5;
    }

    // Upcoming Critical Deadlines
    if (report.upcomingCriticalDeadlines.next7Days.length > 0 || 
        report.upcomingCriticalDeadlines.next30Days.length > 0) {
      checkPageBreak(40);
      doc.setFontSize(18);
      doc.text('Upcoming Critical Deadlines', 20, yPosition);
      yPosition += 10;

      if (report.upcomingCriticalDeadlines.next7Days.length > 0) {
        doc.setFontSize(14);
        doc.text('Next 7 Days:', 20, yPosition);
        yPosition += 8;

        doc.setFontSize(11);
        report.upcomingCriticalDeadlines.next7Days.slice(0, 5).forEach((entry) => {
          checkPageBreak(10);
          const daysUntil = Math.ceil(
            (entry.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );
          doc.text(
            `• ${entry.complianceName} (${entry.formName}): ${format(entry.dueDate, 'MMM dd, yyyy')} (${daysUntil} days)`,
            25,
            yPosition
          );
          yPosition += 7;
        });
        yPosition += 5;
      }

      if (report.upcomingCriticalDeadlines.next30Days.length > 0) {
        checkPageBreak(20);
        doc.setFontSize(14);
        doc.text('Next 30 Days:', 20, yPosition);
        yPosition += 8;

        doc.setFontSize(11);
        report.upcomingCriticalDeadlines.next30Days.slice(0, 10).forEach((entry) => {
          checkPageBreak(8);
          const daysUntil = Math.ceil(
            (entry.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );
          doc.text(
            `• ${entry.complianceName} (${entry.formName}): ${format(entry.dueDate, 'MMM dd, yyyy')} (${daysUntil} days)`,
            25,
            yPosition
          );
          yPosition += 7;
        });
        yPosition += 5;
      }
    }

    // Risk Assessment Recommendations
    if (report.riskAssessment.recommendations.length > 0) {
      checkPageBreak(30);
      doc.setFontSize(14);
      doc.text('Risk Assessment Recommendations:', 20, yPosition);
      yPosition += 8;

      doc.setFontSize(11);
      report.riskAssessment.recommendations.forEach((rec) => {
        checkPageBreak(8);
        doc.text(`• ${rec}`, 25, yPosition);
        yPosition += 7;
      });
      yPosition += 5;
    }

    // Industry Insights
    if (report.industrySpecificInsights.length > 0) {
      checkPageBreak(30);
      doc.setFontSize(18);
      doc.text('Industry-Specific Insights', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(11);
      report.industrySpecificInsights.forEach((insight) => {
        checkPageBreak(10);
        const insightLines = doc.splitTextToSize(insight, pageWidth - 50);
        doc.text(insightLines, 25, yPosition);
        yPosition += insightLines.length * 6 + 3;
      });
      yPosition += 5;
    }

    // Compliance Checklist
    if (report.complianceChecklist.length > 0) {
      checkPageBreak(30);
      doc.setFontSize(18);
      doc.text('Compliance Checklist', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(11);
      report.complianceChecklist.forEach((item) => {
        checkPageBreak(10);
        const checkbox = item.completed ? '☑' : '☐';
        doc.text(
          `${checkbox} ${item.title} (${item.priority} priority, ${item.timeframe})`,
          25,
          yPosition
        );
        yPosition += 7;
      });
    }

    // Cost Analysis additional info
    if (report.costAnalysis.comparisonToIndustryAverage) {
      checkPageBreak(15);
      doc.setFontSize(12);
      const comparisonLines = doc.splitTextToSize(
        `Industry Comparison: ${report.costAnalysis.comparisonToIndustryAverage}`,
        pageWidth - 40
      );
      doc.text(comparisonLines, 20, yPosition);
      yPosition += comparisonLines.length * 6 + 5;
    }

    if (report.costAnalysis.potentialSavings.length > 0) {
      checkPageBreak(20);
      doc.setFontSize(14);
      doc.text('Potential Savings:', 20, yPosition);
      yPosition += 8;

      doc.setFontSize(11);
      report.costAnalysis.potentialSavings.forEach((saving) => {
        checkPageBreak(8);
        doc.text(`• ${saving}`, 25, yPosition);
        yPosition += 7;
      });
    }

    // Add page numbers
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - 20, pageHeight - 10, {
        align: 'right',
      });
    }

    // Download
    const filename = generateReportFilename('pdf');
    doc.save(filename);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw new Error('Failed to export PDF. Please try again.');
  }
}

/**
 * Export report to Markdown
 */
export function exportReportToMarkdown(report: ComplianceReport): void {
  try {
    const lines: string[] = [];

    // Header
    lines.push('# Compliance Report');
    lines.push('');
    lines.push(`**Business:** ${report.businessProfile.businessType} - ${report.businessProfile.industry}`);
    lines.push(`**State:** ${report.businessProfile.state}`);
    lines.push(`**Generated:** ${format(report.generatedAt, 'dd MMM yyyy, hh:mm a')}`);
    lines.push('');

    // Executive Summary
    lines.push('## Executive Summary');
    lines.push('');
    lines.push(report.executiveSummary);
    lines.push('');

    // Key Findings
    lines.push('## Key Findings');
    lines.push('');
    report.keyFindings.forEach((finding) => {
      lines.push(`- ${finding}`);
    });
    lines.push('');

    // Compliance Overview
    lines.push('## Compliance Overview');
    lines.push('');
    lines.push(`- Total Compliances: ${report.complianceOverview.totalCompliances}`);
    lines.push(`- Monthly Compliances: ${report.complianceOverview.monthlyCompliances}`);
    lines.push(`- Quarterly Compliances: ${report.complianceOverview.quarterlyCompliances}`);
    lines.push(`- Annual Compliances: ${report.complianceOverview.annualCompliances}`);
    lines.push('');

    // Cost Analysis
    lines.push('## Cost Analysis');
    lines.push('');
    lines.push(`**Total Annual Cost:** ${formatCurrency(report.costAnalysis.totalAnnualCost)}`);
    lines.push('');
    lines.push('### Cost Breakdown');
    lines.push('');
    lines.push('| Compliance | Filing Fee | Professional | Software | Time | Total |');
    lines.push('|------------|-----------|--------------|----------|------|-------|');

    report.costAnalysis.breakdown.forEach((item) => {
      lines.push(
        `| ${item.complianceName} | ${formatCurrency(item.filingFee)} | ${formatCurrency(item.professionalFee)} | ${formatCurrency(item.software)} | ${formatCurrency(item.timeValue)} | ${formatCurrency(item.total)} |`
      );
    });
    lines.push('');

    if (report.costAnalysis.comparisonToIndustryAverage) {
      lines.push(`**Industry Comparison:** ${report.costAnalysis.comparisonToIndustryAverage}`);
      lines.push('');
    }

    if (report.costAnalysis.potentialSavings.length > 0) {
      lines.push('### Potential Savings');
      lines.push('');
      report.costAnalysis.potentialSavings.forEach((saving) => {
        lines.push(`- ${saving}`);
      });
      lines.push('');
    }

    // Risk Assessment
    lines.push('## Risk Assessment');
    lines.push('');
    lines.push(`**Overall Risk Level:** ${report.riskAssessment.overallRisk}`);
    lines.push(`**Risk Score:** ${report.riskAssessment.riskScore}/10`);
    lines.push('');

    if (report.riskAssessment.riskFactors.length > 0) {
      lines.push('### Risk Factors');
      lines.push('');
      report.riskAssessment.riskFactors.forEach((factor) => {
        lines.push(`#### ${factor.factor} (${factor.severity})`);
        lines.push('');
        lines.push(`${factor.description}`);
        lines.push('');
        lines.push(`**Mitigation:** ${factor.mitigation}`);
        lines.push('');
      });
    }

    if (report.riskAssessment.recommendations.length > 0) {
      lines.push('### Recommendations');
      lines.push('');
      report.riskAssessment.recommendations.forEach((rec) => {
        lines.push(`- ${rec}`);
      });
      lines.push('');
    }

    // Action Plan
    lines.push('## Action Plan');
    lines.push('');

    if (report.actionPlan.immediate.length > 0) {
      lines.push('### Immediate Actions (Next 7 Days)');
      lines.push('');
      report.actionPlan.immediate.forEach((action) => {
        lines.push(`- [ ] ${action}`);
      });
      lines.push('');
    }

    if (report.actionPlan.shortTerm.length > 0) {
      lines.push('### Short-term Actions (Next 30 Days)');
      lines.push('');
      report.actionPlan.shortTerm.forEach((action) => {
        lines.push(`- [ ] ${action}`);
      });
      lines.push('');
    }

    if (report.actionPlan.longTerm.length > 0) {
      lines.push('### Long-term Actions (Next 90+ Days)');
      lines.push('');
      report.actionPlan.longTerm.forEach((action) => {
        lines.push(`- [ ] ${action}`);
      });
      lines.push('');
    }

    // Upcoming Critical Deadlines
    lines.push('## Upcoming Critical Deadlines');
    lines.push('');

    if (report.upcomingCriticalDeadlines.next7Days.length > 0) {
      lines.push('### Next 7 Days');
      lines.push('');
      report.upcomingCriticalDeadlines.next7Days.forEach((entry) => {
        const daysUntil = Math.ceil(
          (entry.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        lines.push(
          `- **${entry.complianceName}** (${entry.formName}): ${format(entry.dueDate, 'MMM dd, yyyy')} (${daysUntil} days)`
        );
      });
      lines.push('');
    }

    if (report.upcomingCriticalDeadlines.next30Days.length > 0) {
      lines.push('### Next 30 Days');
      lines.push('');
      report.upcomingCriticalDeadlines.next30Days.forEach((entry) => {
        const daysUntil = Math.ceil(
          (entry.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        lines.push(
          `- **${entry.complianceName}** (${entry.formName}): ${format(entry.dueDate, 'MMM dd, yyyy')} (${daysUntil} days)`
        );
      });
      lines.push('');
    }

    if (report.upcomingCriticalDeadlines.next90Days.length > 0) {
      lines.push('### Next 90 Days');
      lines.push('');
      report.upcomingCriticalDeadlines.next90Days.slice(0, 10).forEach((entry) => {
        const daysUntil = Math.ceil(
          (entry.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        lines.push(
          `- **${entry.complianceName}** (${entry.formName}): ${format(entry.dueDate, 'MMM dd, yyyy')} (${daysUntil} days)`
        );
      });
      lines.push('');
    }

    // Compliance Checklist
    if (report.complianceChecklist.length > 0) {
      lines.push('## Compliance Checklist');
      lines.push('');
      report.complianceChecklist.forEach((item) => {
        const checkbox = item.completed ? '[x]' : '[ ]';
        lines.push(`${checkbox} **${item.title}** (${item.priority} priority, ${item.timeframe})`);
      });
      lines.push('');
    }

    // Industry Insights
    if (report.industrySpecificInsights.length > 0) {
      lines.push('## Industry-Specific Insights');
      lines.push('');
      report.industrySpecificInsights.forEach((insight) => {
        lines.push(`- ${insight}`);
      });
      lines.push('');
    }

    // Download
    const content = lines.join('\n');
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const filename = generateReportFilename('md');
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting to Markdown:', error);
    throw new Error('Failed to export Markdown. Please try again.');
  }
}

/**
 * Export report to Word document
 */
export async function exportReportToWord(report: ComplianceReport): Promise<void> {
  try {
    const children: (Paragraph | Table)[] = [];

    // Title
    children.push(
      new Paragraph({
        text: 'Compliance Report',
        heading: 'Heading1',
        alignment: AlignmentType.CENTER,
      })
    );

    // Business Info
    children.push(
      new Paragraph({
        text: `${report.businessProfile.businessType} - ${report.businessProfile.industry}`,
        heading: 'Heading2',
        alignment: AlignmentType.CENTER,
      })
    );

    children.push(
      new Paragraph({
        text: `State: ${report.businessProfile.state}`,
        alignment: AlignmentType.CENTER,
      })
    );

    children.push(
      new Paragraph({
        text: `Generated: ${format(report.generatedAt, 'dd MMM yyyy, hh:mm a')}`,
        alignment: AlignmentType.CENTER,
      })
    );

    children.push(new Paragraph({ text: '' }));

    // Executive Summary
    children.push(
      new Paragraph({
        text: 'Executive Summary',
        heading: 'Heading2',
      })
    );
    children.push(new Paragraph({ text: report.executiveSummary }));

    // Key Findings
    children.push(
      new Paragraph({
        text: 'Key Findings',
        heading: 'Heading2',
      })
    );

    report.keyFindings.forEach((finding) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: '• ',
              bold: true,
            }),
            new TextRun({
              text: finding,
            }),
          ],
        })
      );
    });

    // Cost Analysis Table
    children.push(
      new Paragraph({
        text: 'Cost Analysis',
        heading: 'Heading2',
      })
    );

    const costTableRows = [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph('Compliance')] }),
          new TableCell({ children: [new Paragraph('Filing Fee')] }),
          new TableCell({ children: [new Paragraph('Professional')] }),
          new TableCell({ children: [new Paragraph('Software')] }),
          new TableCell({ children: [new Paragraph('Time')] }),
          new TableCell({ children: [new Paragraph('Total')] }),
        ],
      }),
      ...report.costAnalysis.breakdown.map(
        (item) =>
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph(item.complianceName)] }),
              new TableCell({ children: [new Paragraph(formatCurrency(item.filingFee))] }),
              new TableCell({ children: [new Paragraph(formatCurrency(item.professionalFee))] }),
              new TableCell({ children: [new Paragraph(formatCurrency(item.software))] }),
              new TableCell({ children: [new Paragraph(formatCurrency(item.timeValue))] }),
              new TableCell({ children: [new Paragraph(formatCurrency(item.total))] }),
            ],
          })
      ),
    ];

    children.push(
      new Table({
        rows: costTableRows,
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
      })
    );

    children.push(
      new Paragraph({
        text: `Total Annual Cost: ${formatCurrency(report.costAnalysis.totalAnnualCost)}`,
        alignment: AlignmentType.RIGHT,
      })
    );

    // Risk Assessment
    children.push(
      new Paragraph({
        text: 'Risk Assessment',
        heading: 'Heading2',
      })
    );

    children.push(
      new Paragraph({
        text: `Overall Risk Level: ${report.riskAssessment.overallRisk}`,
      })
    );

    children.push(
      new Paragraph({
        text: `Risk Score: ${report.riskAssessment.riskScore}/10`,
      })
    );

    // Action Plan
    children.push(
      new Paragraph({
        text: 'Action Plan',
        heading: 'Heading2',
      })
    );

    if (report.actionPlan.immediate.length > 0) {
      children.push(
        new Paragraph({
          text: 'Immediate Actions (Next 7 Days)',
          heading: 'Heading3',
        })
      );

      report.actionPlan.immediate.forEach((action) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: '• ',
                bold: true,
              }),
              new TextRun({
                text: action,
              }),
            ],
          })
        );
      });
    }

    if (report.actionPlan.shortTerm.length > 0) {
      children.push(
        new Paragraph({
          text: 'Short-term Actions (Next 30 Days)',
          heading: 'Heading3',
        })
      );

      report.actionPlan.shortTerm.forEach((action) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: '• ',
                bold: true,
              }),
              new TextRun({
                text: action,
              }),
            ],
          })
        );
      });
    }

    if (report.actionPlan.longTerm.length > 0) {
      children.push(
        new Paragraph({
          text: 'Long-term Actions (Next 90+ Days)',
          heading: 'Heading3',
        })
      );

      report.actionPlan.longTerm.forEach((action) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: '• ',
                bold: true,
              }),
              new TextRun({
                text: action,
              }),
            ],
          })
        );
      });
    }

    // Compliance Overview
    children.push(
      new Paragraph({
        text: 'Compliance Overview',
        heading: 'Heading2',
      })
    );

    children.push(
      new Paragraph({
        text: `Total Compliances: ${report.complianceOverview.totalCompliances}`,
      })
    );
    children.push(
      new Paragraph({
        text: `Monthly Compliances: ${report.complianceOverview.monthlyCompliances}`,
      })
    );
    children.push(
      new Paragraph({
        text: `Quarterly Compliances: ${report.complianceOverview.quarterlyCompliances}`,
      })
    );
    children.push(
      new Paragraph({
        text: `Annual Compliances: ${report.complianceOverview.annualCompliances}`,
      })
    );

    if (Object.keys(report.complianceOverview.categoryBreakdown).length > 0) {
      children.push(
        new Paragraph({
          text: 'Category Breakdown:',
          heading: 'Heading3',
        })
      );

      Object.entries(report.complianceOverview.categoryBreakdown).forEach(([category, count]) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: '• ',
                bold: true,
              }),
              new TextRun({
                text: `${category}: ${count}`,
              }),
            ],
          })
        );
      });
    }

    // Upcoming Critical Deadlines
    if (report.upcomingCriticalDeadlines.next7Days.length > 0 ||
        report.upcomingCriticalDeadlines.next30Days.length > 0) {
      children.push(
        new Paragraph({
          text: 'Upcoming Critical Deadlines',
          heading: 'Heading2',
        })
      );

      if (report.upcomingCriticalDeadlines.next7Days.length > 0) {
        children.push(
          new Paragraph({
            text: 'Next 7 Days',
            heading: 'Heading3',
          })
        );

        report.upcomingCriticalDeadlines.next7Days.forEach((entry) => {
          const daysUntil = Math.ceil(
            (entry.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: '• ',
                  bold: true,
                }),
                new TextRun({
                  text: `${entry.complianceName} (${entry.formName}): ${format(entry.dueDate, 'MMM dd, yyyy')} (${daysUntil} days)`,
                }),
              ],
            })
          );
        });
      }

      if (report.upcomingCriticalDeadlines.next30Days.length > 0) {
        children.push(
          new Paragraph({
            text: 'Next 30 Days',
            heading: 'Heading3',
          })
        );

        report.upcomingCriticalDeadlines.next30Days.slice(0, 10).forEach((entry) => {
          const daysUntil = Math.ceil(
            (entry.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: '• ',
                  bold: true,
                }),
                new TextRun({
                  text: `${entry.complianceName} (${entry.formName}): ${format(entry.dueDate, 'MMM dd, yyyy')} (${daysUntil} days)`,
                }),
              ],
            })
          );
        });
      }
    }

    // Risk Assessment Recommendations
    if (report.riskAssessment.recommendations.length > 0) {
      children.push(
        new Paragraph({
          text: 'Risk Assessment Recommendations',
          heading: 'Heading3',
        })
      );

      report.riskAssessment.recommendations.forEach((rec) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: '• ',
                bold: true,
              }),
              new TextRun({
                text: rec,
              }),
            ],
          })
        );
      });
    }

    // Industry Insights
    if (report.industrySpecificInsights.length > 0) {
      children.push(
        new Paragraph({
          text: 'Industry-Specific Insights',
          heading: 'Heading2',
        })
      );

      report.industrySpecificInsights.forEach((insight) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: '• ',
                bold: true,
              }),
              new TextRun({
                text: insight,
              }),
            ],
          })
        );
      });
    }

    // Compliance Checklist
    if (report.complianceChecklist.length > 0) {
      children.push(
        new Paragraph({
          text: 'Compliance Checklist',
          heading: 'Heading2',
        })
      );

      report.complianceChecklist.forEach((item) => {
        const checkbox = item.completed ? '☑' : '☐';
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${checkbox} `,
                bold: true,
              }),
              new TextRun({
                text: `${item.title} (${item.priority} priority, ${item.timeframe})`,
              }),
            ],
          })
        );
      });
    }

    // Cost Analysis additional info
    if (report.costAnalysis.comparisonToIndustryAverage) {
      children.push(
        new Paragraph({
          text: `Industry Comparison: ${report.costAnalysis.comparisonToIndustryAverage}`,
        })
      );
    }

    if (report.costAnalysis.potentialSavings.length > 0) {
      children.push(
        new Paragraph({
          text: 'Potential Savings',
          heading: 'Heading3',
        })
      );

      report.costAnalysis.potentialSavings.forEach((saving) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: '• ',
                bold: true,
              }),
              new TextRun({
                text: saving,
              }),
            ],
          })
        );
      });
    }

    // Create document
    const doc = new Document({
      sections: [
        {
          children,
        },
      ],
    });

    // Generate and download
    const blob = await Packer.toBlob(doc);
    const filename = generateReportFilename('docx');
    saveAs(blob, filename);
  } catch (error) {
    console.error('Error exporting to Word:', error);
    throw new Error('Failed to export Word document. Please try again.');
  }
}

