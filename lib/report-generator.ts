import OpenAI from "openai";
import { readFileSync } from "fs";
import { join } from "path";

import type {
  BusinessProfile,
  CalendarEntry,
  ComplianceReport,
  CostBreakdown,
  RiskAssessment,
  RiskFactor,
  ComplianceOverview,
  UpcomingCriticalDeadlines,
  CostAnalysis,
  ActionPlan,
  ChecklistItem,
  ComplianceData,
} from "./types";
import {
  getIndustryInsights,
  getStateInsights,
  getBusinessSizeInsights,
  getUpcomingChanges,
  getBestPractices,
  getCommonPitfalls,
} from "./industry-insights";
import { format } from "date-fns";

/**
 * Initialize OpenAI client
 */
function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn("OPENAI_API_KEY not found in environment variables");
    return null;
  }
  return new OpenAI({ apiKey });
}

/**
 * Cost estimates per compliance type
 */
const complianceCosts: Record<
  string,
  {
    filingFee: number;
    professionalFee: number;
    software: number;
    timeValue: number;
    total: number;
  }
> = {
  gst: {
    filingFee: 0,
    professionalFee: 12000,
    software: 6000,
    timeValue: 2000,
    total: 20000,
  },
  epf: {
    filingFee: 0,
    professionalFee: 6000,
    software: 0,
    timeValue: 3000,
    total: 9000,
  },
  esi: {
    filingFee: 0,
    professionalFee: 4000,
    software: 0,
    timeValue: 2000,
    total: 6000,
  },
  "professional-tax": {
    filingFee: 0,
    professionalFee: 2000,
    software: 0,
    timeValue: 1000,
    total: 3000,
  },
  tds: {
    filingFee: 0,
    professionalFee: 5000,
    software: 2000,
    timeValue: 1000,
    total: 8000,
  },
  "tax-audit": {
    filingFee: 0,
    professionalFee: 25000,
    software: 5000,
    timeValue: 0,
    total: 30000,
  },
  "income-tax": {
    filingFee: 0,
    professionalFee: 8000,
    software: 3000,
    timeValue: 2000,
    total: 13000,
  },
  "msme-annual-return": {
    filingFee: 0,
    professionalFee: 1500,
    software: 0,
    timeValue: 500,
    total: 2000,
  },
  "msme-form-1": {
    filingFee: 0,
    professionalFee: 1000,
    software: 0,
    timeValue: 0,
    total: 1000,
  },
  "shops-establishments": {
    filingFee: 0,
    professionalFee: 2000,
    software: 0,
    timeValue: 500,
    total: 2500,
  },
};

/**
 * Calculate detailed cost breakdown
 */
export function calculateDetailedCosts(
  compliances: string[],
  profile: BusinessProfile
): CostBreakdown[] {
  const breakdown: CostBreakdown[] = [];
  const employeeCount = profile.employeeCount;

  // Size adjustment factors
  let sizeMultiplier = 1.0;
  if (employeeCount < 10) {
    sizeMultiplier = 0.8; // -20% for small businesses
  } else if (employeeCount >= 50 && employeeCount < 100) {
    sizeMultiplier = 1.3; // +30% for medium businesses
  } else if (employeeCount >= 100) {
    sizeMultiplier = 1.5; // +50% for large businesses
  }

  for (const complianceId of compliances) {
    const baseCost = complianceCosts[complianceId] || {
      filingFee: 0,
      professionalFee: 2000,
      software: 0,
      timeValue: 1000,
      total: 3000,
    };

    breakdown.push({
      complianceId,
      complianceName: getComplianceName(complianceId),
      filingFee: baseCost.filingFee,
      professionalFee: Math.round(baseCost.professionalFee * sizeMultiplier),
      software: baseCost.software,
      timeValue: Math.round(baseCost.timeValue * sizeMultiplier),
      total: Math.round(
        baseCost.filingFee +
          baseCost.professionalFee * sizeMultiplier +
          baseCost.software +
          baseCost.timeValue * sizeMultiplier
      ),
    });
  }

  return breakdown;
}

/**
 * Get compliance name from ID
 */
function getComplianceName(complianceId: string): string {
  const names: Record<string, string> = {
    gst: "GST Returns",
    epf: "EPF",
    esi: "ESI",
    "professional-tax": "Professional Tax",
    tds: "TDS",
    "tax-audit": "Tax Audit",
    "income-tax": "Income Tax",
    "msme-annual-return": "MSME Annual Return",
    "msme-form-1": "MSME Form 1",
    "shops-establishments": "Shops & Establishments",
  };
  return names[complianceId] || complianceId;
}

/**
 * Assess compliance risk
 */
export function assessComplianceRisk(
  profile: BusinessProfile,
  calendar: CalendarEntry[],
  compliances: string[]
): RiskAssessment {
  let riskScore = 0;
  const riskFactors: RiskFactor[] = [];

  // Factor 1: Number of compliances
  if (compliances.length > 10) {
    riskScore += 3;
    riskFactors.push({
      factor: "High number of compliances",
      severity: "High",
      impact: 4,
      description: `You have ${compliances.length} different compliance requirements to manage`,
      mitigation:
        "Consider using compliance management software or hiring a dedicated compliance officer",
    });
  } else if (compliances.length > 5) {
    riskScore += 2;
    riskFactors.push({
      factor: "Moderate number of compliances",
      severity: "Medium",
      impact: 3,
      description: `You have ${compliances.length} compliance requirements`,
      mitigation: "Set up a compliance calendar and regular reminders",
    });
  }

  // Factor 2: Monthly compliance frequency
  const monthlyCompliances = calendar.filter((entry) => {
    const monthDiff =
      (entry.dueDate.getMonth() - new Date().getMonth() + 12) % 12;
    return monthDiff <= 1;
  }).length;

  if (monthlyCompliances > 5) {
    riskScore += 2;
    riskFactors.push({
      factor: "High-frequency filings",
      severity: "High",
      impact: 4,
      description: `You have ${monthlyCompliances} monthly compliance deadlines`,
      mitigation:
        "Consider automation software or outsourcing to reduce manual effort",
    });
  }

  // Factor 3: High-penalty compliances
  const highPenaltyCompliances = ["gst", "epf", "tds"];
  const hasHighPenalty = compliances.some((c) =>
    highPenaltyCompliances.includes(c)
  );
  if (hasHighPenalty) {
    riskScore += 2;
    riskFactors.push({
      factor: "High-penalty compliances",
      severity: "High",
      impact: 5,
      description:
        "Your business has compliances with significant penalty risks (GST, EPF, TDS)",
      mitigation:
        "Ensure timely filing and consider professional help for these critical compliances",
    });
  }

  // Factor 4: Business complexity
  if (profile.businessType === "Manufacturing") {
    riskScore += 1;
    riskFactors.push({
      factor: "Manufacturing complexity",
      severity: "Medium",
      impact: 2,
      description:
        "Manufacturing businesses have additional compliance requirements",
      mitigation: "Stay updated on environmental and safety regulations",
    });
  }

  // Factor 5: New MSME
  if (profile.msmeRegistered) {
    riskScore += 1;
    riskFactors.push({
      factor: "MSME registration",
      severity: "Low",
      impact: 2,
      description: "MSME businesses have specific compliance requirements",
      mitigation: "Ensure MSME annual returns are filed on time",
    });
  }

  // Determine overall risk level
  let overallRisk: "Low" | "Medium" | "High";
  if (riskScore <= 3) {
    overallRisk = "Low";
  } else if (riskScore <= 6) {
    overallRisk = "Medium";
  } else {
    overallRisk = "High";
  }

  // Generate recommendations
  const recommendations: string[] = [];
  if (riskScore > 6) {
    recommendations.push(
      "Consider hiring a dedicated compliance officer or CA firm"
    );
    recommendations.push("Implement compliance management software");
    recommendations.push("Set up automated reminders for all deadlines");
  } else if (riskScore > 3) {
    recommendations.push("Use a compliance calendar to track all deadlines");
    recommendations.push(
      "Consider professional help for high-penalty compliances"
    );
    recommendations.push("Regular compliance reviews recommended");
  } else {
    recommendations.push("Maintain current compliance practices");
    recommendations.push("Set up basic reminder system");
  }

  return {
    overallRisk,
    riskScore: Math.min(riskScore, 10),
    riskFactors,
    recommendations,
  };
}

/**
 * Load compliance rules (cached to avoid repeated file reads)
 */
let complianceRulesCache: ComplianceData | null = null;
function loadComplianceRules(): ComplianceData {
  if (complianceRulesCache) {
    return complianceRulesCache;
  }
  try {
    const filePath = join(process.cwd(), "lib", "compliance-rules.json");
    const fileContents = readFileSync(filePath, "utf-8");
    complianceRulesCache = JSON.parse(fileContents) as ComplianceData;
    return complianceRulesCache;
  } catch (error) {
    console.error("Error loading compliance rules:", error);
    return { metadata: {} as any, compliances: {} };
  }
}

/**
 * Get relevant compliance details for AI prompt (only for applicable compliances)
 */
function getComplianceDetailsForPrompt(complianceIds: string[]): string {
  const rules = loadComplianceRules();
  const details: string[] = [];

  complianceIds.forEach((id) => {
    const compliance = rules.compliances[id];
    if (!compliance) return;

    const info: string[] = [];
    info.push(`\n${compliance.name || id.toUpperCase()}:`);

    // Add applicability info
    if (compliance.applicability?.condition) {
      info.push(
        `  Applicability: ${compliance.applicability.condition.substring(0, 200)}...`
      );
    }

    // Add threshold info if available
    if (compliance.applicability?.threshold) {
      const threshold = compliance.applicability.threshold;
      const thresholdInfo = [];
      if (typeof threshold === "object" && threshold !== null) {
        if (
          "goods_regular_states" in threshold &&
          typeof threshold.goods_regular_states === "number"
        ) {
          thresholdInfo.push(
            `Goods (regular states): ₹${threshold.goods_regular_states.toLocaleString("en-IN")}`
          );
        }
        if (
          "services_regular_states" in threshold &&
          typeof threshold.services_regular_states === "number"
        ) {
          thresholdInfo.push(
            `Services (regular states): ₹${threshold.services_regular_states.toLocaleString("en-IN")}`
          );
        }
      } else if (typeof threshold === "number") {
        thresholdInfo.push(`Threshold: ₹${threshold.toLocaleString("en-IN")}`);
      }
      if (thresholdInfo.length > 0) {
        info.push(`  Threshold: ${thresholdInfo.join(", ")}`);
      }
    }

    // Add key penalties (first form only, to keep it concise)
    if (compliance.forms && compliance.forms.length > 0) {
      const firstForm = compliance.forms[0];
      if (firstForm.penalty) {
        // Extract key penalty info (first 150 chars)
        const penaltySummary = firstForm.penalty
          .substring(0, 150)
          .replace(/\n/g, " ");
        info.push(`  Key Penalty: ${penaltySummary}...`);
      }
      if (firstForm.deadline?.type) {
        info.push(
          `  Frequency: ${firstForm.deadline.type} (due on ${firstForm.deadline.day || "varies"}th)`
        );
      }
    }

    if (info.length > 1) {
      details.push(info.join("\n"));
    }
  });

  return details.length > 0 ? details.join("\n") : "";
}

/**
 * Format upcoming deadlines for AI prompt
 */
function formatUpcomingDeadlines(calendar: CalendarEntry[]): string {
  const now = new Date();
  const next30Days = calendar
    .filter((entry) => {
      const daysDiff = Math.ceil(
        (entry.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysDiff >= 0 && daysDiff <= 30;
    })
    .slice(0, 10); // Limit to 10 for prompt

  if (next30Days.length === 0) {
    return "No upcoming deadlines in the next 30 days";
  }

  return next30Days
    .map((entry) => {
      const daysUntil = Math.ceil(
        (entry.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return `- ${entry.complianceName} (${entry.formName}): Due in ${daysUntil} days (${format(entry.dueDate, "MMM dd, yyyy")})`;
    })
    .join("\n");
}

/**
 * Construct AI prompt for report generation
 */
function constructReportPrompt(
  profile: BusinessProfile,
  calendar: CalendarEntry[],
  compliances: string[]
): string {
  const upcomingDeadlines = formatUpcomingDeadlines(calendar);
  const complianceDetails = getComplianceDetailsForPrompt(compliances);

  return `You are a compliance expert advisor for Indian businesses. Generate a detailed compliance report for the following business:

BUSINESS PROFILE:
- Type: ${profile.businessType}
- Industry: ${profile.industry}
- State: ${profile.state}
- Annual Turnover: ${profile.turnover} (₹${profile.annualTurnoverValue.toLocaleString("en-IN")})
- Employees: ${profile.employees} (${profile.employeeCount} employees)
- MSME Registered: ${profile.msmeRegistered ? "Yes" : "No"}

APPLICABLE COMPLIANCES:
${compliances.map((c) => `- ${getComplianceName(c)}`).join("\n")}

COMPLIANCE DETAILS (from latest compliance rules):
${complianceDetails || "Details not available"}

UPCOMING DEADLINES (Next 30 Days):
${upcomingDeadlines}

Generate a comprehensive report with the following sections:

1. EXECUTIVE SUMMARY (3-4 sentences)
   - Overview of compliance requirements
   - Key challenges specific to this business
   - Overall compliance health assessment

2. KEY FINDINGS (5-7 bullet points)
   - Critical observations about compliance burden
   - Industry-specific considerations
   - State-specific requirements
   - Financial impact highlights

3. COST ANALYSIS
   - Estimated annual compliance costs
   - Breakdown by compliance type
   - Comparison to industry averages
   - Potential cost-saving opportunities

4. RISK ASSESSMENT
   - Overall risk level (Low/Medium/High)
   - Specific risk factors for this business
   - High-penalty compliance areas
   - Common mistakes in this industry

5. RECOMMENDATIONS (Prioritized)
   - Immediate actions (next 7 days)
   - Short-term actions (next 30 days)
   - Long-term optimization strategies

6. INDUSTRY-SPECIFIC INSIGHTS
   - Relevant to ${profile.industry} in ${profile.state}
   - Upcoming regulatory changes
   - Best practices for this sector

Format response as structured JSON matching this exact structure:
{
  "executiveSummary": "string (3-4 sentences)",
  "keyFindings": ["string", "string", ...],
  "costAnalysis": {
    "comparisonToIndustryAverage": "string",
    "potentialSavings": ["string", "string", ...]
  },
  "riskAssessment": {
    "recommendations": ["string", "string", ...]
  },
  "actionPlan": {
    "immediate": ["string", "string", ...],
    "shortTerm": ["string", "string", ...],
    "longTerm": ["string", "string", ...]
  },
  "industrySpecificInsights": ["string", "string", ...]
}

Be specific, actionable, and data-driven. Use Indian currency (₹) and compliance terminology.`;
}

/**
 * Call OpenAI API
 */
async function callOpenAI(prompt: string): Promise<string> {
  const client = getOpenAIClient();
  if (!client) {
    throw new Error("OpenAI client not available");
  }

  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await client.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a compliance expert advisor for Indian businesses. Provide detailed, actionable compliance reports in JSON format. Your response must be valid JSON only, no additional text or markdown. Start your response with { and end with }.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 3000,
        // Note: response_format with json_object is only supported by certain models
        // Removing it to work with gpt-4, will parse JSON manually
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("Empty response from OpenAI");
      }

      // Extract JSON from response (handle cases where it might be wrapped in markdown)
      let jsonContent = content.trim();

      // Remove markdown code blocks if present
      if (jsonContent.startsWith("```json")) {
        jsonContent = jsonContent
          .replace(/^```json\s*/, "")
          .replace(/\s*```$/, "");
      } else if (jsonContent.startsWith("```")) {
        jsonContent = jsonContent.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }

      // Extract JSON object if it's embedded in text
      const jsonMatch = jsonContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonContent = jsonMatch[0];
      }

      return jsonContent;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error");
      console.warn(`OpenAI API attempt ${attempt} failed:`, lastError.message);
      if (attempt < maxRetries) {
        // Wait before retry (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  throw lastError || new Error("OpenAI API call failed after retries");
}

/**
 * Generate template-based report (fallback)
 */
function generateTemplateReport(
  profile: BusinessProfile,
  calendar: CalendarEntry[],
  compliances: string[]
): Partial<ComplianceReport> {
  const costBreakdown = calculateDetailedCosts(compliances, profile);
  const totalCost = costBreakdown.reduce((sum, item) => sum + item.total, 0);
  const riskAssessment = assessComplianceRisk(profile, calendar, compliances);

  // Calculate compliance overview
  const monthlyCount = calendar.filter((entry) => {
    const monthDiff =
      (entry.dueDate.getMonth() - new Date().getMonth() + 12) % 12;
    return monthDiff <= 1;
  }).length;

  const quarterlyCount = calendar.filter((entry) => {
    const quarter = Math.floor(entry.dueDate.getMonth() / 3);
    return quarter >= 0 && quarter < 4;
  }).length;

  const annualCount = calendar.filter((entry) => {
    return entry.dueDate.getMonth() === 0; // January
  }).length;

  const categoryBreakdown: Record<string, number> = {};
  calendar.forEach((entry) => {
    categoryBreakdown[entry.category] =
      (categoryBreakdown[entry.category] || 0) + 1;
  });

  // Group upcoming deadlines
  const now = new Date();
  const next7Days = calendar.filter((entry) => {
    const daysDiff = Math.ceil(
      (entry.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysDiff >= 0 && daysDiff <= 7;
  });

  const next30Days = calendar.filter((entry) => {
    const daysDiff = Math.ceil(
      (entry.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysDiff >= 0 && daysDiff <= 30;
  });

  const next90Days = calendar.filter((entry) => {
    const daysDiff = Math.ceil(
      (entry.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysDiff >= 0 && daysDiff <= 90;
  });

  return {
    executiveSummary: `Your ${profile.businessType} business in ${profile.state} requires compliance with ${compliances.length} different regulations. Based on your business profile, you have an estimated annual compliance cost of ₹${totalCost.toLocaleString("en-IN")}. Your overall compliance risk is ${riskAssessment.overallRisk}, primarily due to ${riskAssessment.riskFactors.length > 0 ? riskAssessment.riskFactors[0].factor.toLowerCase() : "standard compliance requirements"}. It is essential to maintain timely filing and proper record-keeping to avoid penalties.`,
    keyFindings: [
      `You have ${compliances.length} applicable compliances requiring regular attention`,
      `Estimated annual compliance cost: ₹${totalCost.toLocaleString("en-IN")}`,
      `You have ${next7Days.length} critical deadlines in the next 7 days`,
      `${profile.industry} businesses in ${profile.state} have specific compliance requirements`,
      riskAssessment.overallRisk === "High"
        ? "High compliance risk detected - professional assistance recommended"
        : "Moderate compliance risk - regular monitoring sufficient",
      `Monthly compliance filings: ${monthlyCount} per month on average`,
      profile.msmeRegistered
        ? "MSME registration provides benefits but requires annual return filing"
        : "Consider MSME registration for potential benefits",
    ],
    costAnalysis: {
      totalAnnualCost: totalCost,
      breakdown: costBreakdown,
      comparisonToIndustryAverage: `Your estimated compliance cost of ₹${totalCost.toLocaleString("en-IN")} is ${totalCost > 50000 ? "above" : "within"} the typical range for ${profile.industry} businesses of your size.`,
      potentialSavings: [
        "Consider DIY filing for simple compliances to save professional fees",
        "Use compliance software to reduce time costs",
        "Bundle multiple compliances with a single consultant for better rates",
      ],
    },
    riskAssessment,
    actionPlan: {
      immediate:
        next7Days.length > 0
          ? [
              `File ${next7Days[0].complianceName} (${next7Days[0].formName}) due ${format(next7Days[0].dueDate, "MMM dd")}`,
              "Review all upcoming deadlines for this month",
              "Ensure all required documents are ready",
            ]
          : [
              "Review compliance calendar for this month",
              "Prepare documents for upcoming filings",
            ],
      shortTerm: [
        "Set up compliance calendar reminders",
        "Consider professional consultation for high-penalty compliances",
        "Review and update compliance records",
      ],
      longTerm: [
        "Consider compliance management software",
        "Establish regular compliance review process",
        "Build relationship with reliable CA/consultant",
      ],
    },
    industrySpecificInsights: [
      ...getIndustryInsights(profile.industry, profile.state, compliances)
        .slice(0, 3)
        .map((i) => i.description),
      ...getStateInsights(profile.state)
        .slice(0, 2)
        .map((i) => i.description),
    ],
    complianceChecklist: [
      {
        id: "1",
        title: "Set up compliance calendar",
        priority: "High",
        timeframe: "immediate",
        estimatedEffort: "1 hour",
        completed: false,
      },
      {
        id: "2",
        title: "File upcoming deadlines",
        priority: "High",
        timeframe: "immediate",
        estimatedEffort: "2-4 hours",
        completed: false,
      },
      {
        id: "3",
        title: "Review compliance requirements",
        priority: "Medium",
        timeframe: "short-term",
        estimatedEffort: "2 hours",
        completed: false,
      },
      {
        id: "4",
        title: "Consider professional help",
        priority: riskAssessment.overallRisk === "High" ? "High" : "Medium",
        timeframe: "short-term",
        estimatedEffort: "Consultation time",
        completed: false,
      },
    ],
  };
}

/**
 * Generate compliance report
 */
export async function generateComplianceReport(
  businessProfile: BusinessProfile,
  calendar: CalendarEntry[],
  applicableCompliances: string[]
): Promise<ComplianceReport> {
  const costBreakdown = calculateDetailedCosts(
    applicableCompliances,
    businessProfile
  );
  const totalCost = costBreakdown.reduce((sum, item) => sum + item.total, 0);
  const riskAssessment = assessComplianceRisk(
    businessProfile,
    calendar,
    applicableCompliances
  );

  // Calculate compliance overview
  const monthlyCount = calendar.filter((entry) => {
    const monthDiff =
      (entry.dueDate.getMonth() - new Date().getMonth() + 12) % 12;
    return monthDiff <= 1;
  }).length;

  const quarterlyCount = calendar.filter((entry) => {
    const quarter = Math.floor(entry.dueDate.getMonth() / 3);
    return quarter >= 0 && quarter < 4;
  }).length;

  const annualCount = calendar.filter((entry) => {
    return entry.dueDate.getMonth() === 0;
  }).length;

  const categoryBreakdown: Record<string, number> = {};
  calendar.forEach((entry) => {
    categoryBreakdown[entry.category] =
      (categoryBreakdown[entry.category] || 0) + 1;
  });

  // Group upcoming deadlines
  const now = new Date();
  const next7Days = calendar.filter((entry) => {
    const daysDiff = Math.ceil(
      (entry.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysDiff >= 0 && daysDiff <= 7;
  });

  const next30Days = calendar.filter((entry) => {
    const daysDiff = Math.ceil(
      (entry.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysDiff >= 0 && daysDiff <= 30;
  });

  const next90Days = calendar.filter((entry) => {
    const daysDiff = Math.ceil(
      (entry.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysDiff >= 0 && daysDiff <= 90;
  });

  const complianceOverview: ComplianceOverview = {
    totalCompliances: applicableCompliances.length,
    monthlyCompliances: monthlyCount,
    quarterlyCompliances: quarterlyCount,
    annualCompliances: annualCount,
    categoryBreakdown,
  };

  const upcomingCriticalDeadlines: UpcomingCriticalDeadlines = {
    next7Days,
    next30Days,
    next90Days,
  };

  const costAnalysis: CostAnalysis = {
    totalAnnualCost: totalCost,
    breakdown: costBreakdown,
    comparisonToIndustryAverage: "",
    potentialSavings: [],
  };

  // Try AI generation, fallback to template
  let aiGenerated: Partial<ComplianceReport> = {};
  let generatedBy: "openai" | "template" = "template";

  try {
    const prompt = constructReportPrompt(
      businessProfile,
      calendar,
      applicableCompliances
    );
    const aiResponse = await callOpenAI(prompt);
    const parsed = JSON.parse(aiResponse);

    // Merge AI response with calculated data
    aiGenerated = {
      executiveSummary: parsed.executiveSummary || "",
      keyFindings: parsed.keyFindings || [],
      costAnalysis: {
        ...costAnalysis,
        comparisonToIndustryAverage:
          parsed.costAnalysis?.comparisonToIndustryAverage || "",
        potentialSavings: parsed.costAnalysis?.potentialSavings || [],
      },
      riskAssessment: {
        ...riskAssessment,
        recommendations:
          parsed.riskAssessment?.recommendations ||
          riskAssessment.recommendations,
      },
      actionPlan: parsed.actionPlan || {
        immediate: [],
        shortTerm: [],
        longTerm: [],
      },
      industrySpecificInsights: parsed.industrySpecificInsights || [],
    };
    generatedBy = "openai";
  } catch (error) {
    console.warn("AI generation failed, using template:", error);
    aiGenerated = generateTemplateReport(
      businessProfile,
      calendar,
      applicableCompliances
    );
  }

  // Build compliance checklist
  const complianceChecklist: ChecklistItem[] =
    aiGenerated.complianceChecklist || [
      {
        id: "1",
        title: "Set up compliance calendar",
        priority: "High",
        timeframe: "immediate",
        completed: false,
      },
    ];

  // Combine all data into final report
  const report: ComplianceReport = {
    executiveSummary: aiGenerated.executiveSummary || "",
    keyFindings: aiGenerated.keyFindings || [],
    complianceOverview,
    upcomingCriticalDeadlines,
    costAnalysis: aiGenerated.costAnalysis || costAnalysis,
    riskAssessment: aiGenerated.riskAssessment || riskAssessment,
    actionPlan: aiGenerated.actionPlan || {
      immediate: [],
      shortTerm: [],
      longTerm: [],
    },
    industrySpecificInsights: aiGenerated.industrySpecificInsights || [],
    complianceChecklist,
    businessProfile,
    applicableCompliances,
    generatedAt: new Date(),
    generatedBy,
  };

  return report;
}
