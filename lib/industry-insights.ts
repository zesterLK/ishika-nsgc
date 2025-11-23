import type {
  BusinessProfile,
  InsightCard,
  RegulatoryChange,
  ChecklistItem,
} from "./types";

/**
 * Industry-specific insights database
 */
const industryInsights: Record<
  string,
  {
    critical: string[];
    common_mistakes: string[];
    opportunities: string[];
    upcoming_changes: string[];
  }
> = {
  Manufacturing: {
    critical: [
      "Environmental clearances are mandatory for most manufacturing units",
      "Factory Act compliance critical if 10+ workers",
      "BIS certification may be required for products",
      "Pollution control board registrations are essential",
    ],
    common_mistakes: [
      "Missing pollution board renewals",
      "Incorrect ESI/EPF calculations for contract workers",
      "Not maintaining statutory registers",
      "Delayed GST filing for raw material purchases",
    ],
    opportunities: [
      "Eligible for MSME incentives and subsidies",
      "Can claim GST input credit on raw materials",
      "PLI scheme benefits available for specific sectors",
      "Export incentives under various schemes",
    ],
    upcoming_changes: [
      "New emission norms from January 2026",
      "Digital payment mandate for B2B transactions",
      "Enhanced safety regulations for hazardous industries",
    ],
  },
  "IT/Software": {
    critical: [
      "TDS compliance crucial for high-value contracts",
      "Gratuity Act applies if 10+ employees",
      "Export incentives under SEIS/EPCG available",
      "Data protection compliance becoming mandatory",
    ],
    common_mistakes: [
      "Incorrect TDS deduction on software services",
      "Missing GST registration for export services",
      "Not maintaining proper employee records",
      "Ignoring professional tax obligations",
    ],
    opportunities: [
      "Export benefits under Software Technology Parks",
      "Tax holidays available in certain states",
      "R&D tax credits for innovation",
      "Simplified compliance for small IT units",
    ],
    upcoming_changes: [
      "Digital Personal Data Protection Act implementation",
      "Enhanced TDS requirements for digital services",
      "New regulations for AI/ML services",
    ],
  },
  "Retail/E-commerce": {
    critical: [
      "GST registration mandatory for online sales",
      "Consumer Protection Act compliance essential",
      "Shops & Establishments Act applies to physical stores",
      "FSSAI license required for food products",
    ],
    common_mistakes: [
      "Missing GST registration for online sales",
      "Incorrect HSN code classification",
      "Not maintaining proper inventory records",
      "Delayed consumer complaint resolution",
    ],
    opportunities: [
      "GST composition scheme for small retailers",
      "E-commerce platform benefits and subsidies",
      "Digital payment incentives",
      "MSME registration benefits",
    ],
    upcoming_changes: [
      "Enhanced consumer protection rules",
      "Stricter e-commerce regulations",
      "New labeling requirements",
    ],
  },
  "Food & Beverage": {
    critical: [
      "FSSAI license mandatory for all food businesses",
      "Health department registrations required",
      "GST compliance for restaurant services",
      "Weights & Measures Act compliance",
    ],
    common_mistakes: [
      "Missing FSSAI license renewal",
      "Incorrect GST rates for food items",
      "Not maintaining hygiene records",
      "Delayed tax payments",
    ],
    opportunities: [
      "GST benefits for small restaurants",
      "Export incentives for processed foods",
      "Subsidies for food processing units",
      "MSME benefits for small-scale operations",
    ],
    upcoming_changes: [
      "Enhanced food safety regulations",
      "New labeling requirements",
      "Stricter hygiene standards",
    ],
  },
  Healthcare: {
    critical: [
      "Clinical Establishments Act registration required",
      "Drug license mandatory for pharmacies",
      "GST compliance for medical services",
      "Professional tax applicable",
    ],
    common_mistakes: [
      "Missing drug license renewals",
      "Incorrect GST classification of services",
      "Not maintaining patient records properly",
      "Delayed professional tax payments",
    ],
    opportunities: [
      "GST exemptions for certain medical services",
      "Export benefits for medical devices",
      "Subsidies for rural healthcare",
      "Tax benefits for medical equipment",
    ],
    upcoming_changes: [
      "Enhanced clinical trial regulations",
      "New telemedicine guidelines",
      "Stricter drug control measures",
    ],
  },
  "Professional Services": {
    critical: [
      "Professional tax applicable in most states",
      "GST registration if turnover exceeds threshold",
      "Income tax compliance essential",
      "Service tax legacy compliance if applicable",
    ],
    common_mistakes: [
      "Missing professional tax payments",
      "Incorrect GST classification",
      "Not maintaining proper client records",
      "Delayed tax filings",
    ],
    opportunities: [
      "GST exemptions for certain professional services",
      "Tax benefits for consulting services",
      "Export benefits for international services",
      "Simplified compliance for small practices",
    ],
    upcoming_changes: [
      "Enhanced professional standards",
      "New service tax regulations",
      "Digital compliance requirements",
    ],
  },
};

/**
 * State-specific insights database
 */
const stateInsights: Record<
  string,
  {
    professional_tax: {
      rate: string;
      due_date: string;
      exemptions?: string;
    };
    specific_compliances: string[];
    ease_of_compliance: "High" | "Medium" | "Low";
    common_challenges: string[];
  }
> = {
  Maharashtra: {
    professional_tax: {
      rate: "₹2,500/year max",
      due_date: "30th of next month",
      exemptions: "Not applicable for income <₹21,000/month",
    },
    specific_compliances: [
      "Shops & Establishments Act registration mandatory",
      "Mumbai-specific: BMC trade license required",
      "Maharashtra State Tax on professions applicable",
    ],
    ease_of_compliance: "High",
    common_challenges: [
      "Professional tax payment delays common",
      "Multiple municipal authorities can be confusing",
    ],
  },
  Karnataka: {
    professional_tax: {
      rate: "₹200/month for salary >₹25,000",
      due_date: "20th of next month",
    },
    specific_compliances: [
      "Shops & Commercial Establishments Act",
      "Karnataka Labor Welfare Fund applicable",
    ],
    ease_of_compliance: "High",
    common_challenges: [
      "Multiple labor welfare fund payments",
      "Complex professional tax structure",
    ],
  },
  Delhi: {
    professional_tax: {
      rate: "Not applicable",
      due_date: "N/A",
    },
    specific_compliances: [
      "Delhi Shops & Establishments Act",
      "Delhi Labor Welfare Fund",
    ],
    ease_of_compliance: "High",
    common_challenges: [
      "Multiple authority registrations",
      "Complex licensing requirements",
    ],
  },
  Gujarat: {
    professional_tax: {
      rate: "₹2,500/year max",
      due_date: "30th of next month",
    },
    specific_compliances: [
      "Gujarat Shops & Establishments Act",
      "Gujarat Labor Welfare Fund",
    ],
    ease_of_compliance: "High",
    common_challenges: [
      "Professional tax compliance",
      "Multiple fund contributions",
    ],
  },
  "Tamil Nadu": {
    professional_tax: {
      rate: "₹2,500/year max",
      due_date: "30th of next month",
    },
    specific_compliances: [
      "Tamil Nadu Shops & Establishments Act",
      "Tamil Nadu Labor Welfare Fund",
    ],
    ease_of_compliance: "Medium",
    common_challenges: [
      "Complex professional tax structure",
      "Multiple compliance requirements",
    ],
  },
};

/**
 * Regulatory changes database
 */
const upcomingChanges: {
  All: RegulatoryChange[];
  [industry: string]: RegulatoryChange[];
} = {
  All: [
    {
      title: "New Labor Codes Implementation",
      date: "April 2026 (expected)",
      impact: "Consolidation of 29 labor laws into 4 codes",
      action: "Review compliance requirements after implementation",
    },
    {
      title: "Enhanced Digital Compliance",
      date: "Ongoing",
      impact: "Mandatory digital filing for most compliances",
      action: "Ensure digital infrastructure is ready",
    },
  ],
  "E-commerce": [
    {
      title: "Consumer Protection Rules",
      date: "Ongoing updates",
      impact: "Stricter seller verification requirements",
      action: "Ensure compliance team is aware",
    },
  ],
  "IT/Software": [
    {
      title: "Digital Personal Data Protection Act",
      date: "2025 (expected)",
      impact: "Mandatory data protection compliance",
      action: "Review data handling practices",
    },
  ],
};

/**
 * Get industry-specific insights
 */
export function getIndustryInsights(
  industry: string,
  state: string,
  compliances: string[]
): InsightCard[] {
  const insights: InsightCard[] = [];
  const industryData =
    industryInsights[industry] || industryInsights["Professional Services"];

  // Critical requirements
  industryData.critical.forEach((insight) => {
    insights.push({
      title: "Critical Requirement",
      description: insight,
      category: "critical",
      relatedCompliances: compliances,
    });
  });

  // Opportunities
  industryData.opportunities.forEach((insight) => {
    insights.push({
      title: "Opportunity",
      description: insight,
      category: "opportunity",
    });
  });

  // Common mistakes
  industryData.common_mistakes.forEach((insight) => {
    insights.push({
      title: "Common Mistake",
      description: insight,
      category: "warning",
    });
  });

  return insights;
}

/**
 * Get state-specific insights
 */
export function getStateInsights(state: string): InsightCard[] {
  const insights: InsightCard[] = [];
  const stateData = stateInsights[state] || stateInsights["Maharashtra"];

  // Professional tax info
  if (stateData.professional_tax.rate !== "Not applicable") {
    insights.push({
      title: "Professional Tax Information",
      description: `Rate: ${stateData.professional_tax.rate}, Due: ${stateData.professional_tax.due_date}`,
      category: "critical",
    });
  }

  // Specific compliances
  stateData.specific_compliances.forEach((compliance) => {
    insights.push({
      title: "State-Specific Compliance",
      description: compliance,
      category: "critical",
    });
  });

  // Common challenges
  stateData.common_challenges.forEach((challenge) => {
    insights.push({
      title: "Common Challenge",
      description: challenge,
      category: "warning",
    });
  });

  return insights;
}

/**
 * Get business size-based insights
 */
export function getBusinessSizeInsights(
  employees: string,
  turnover: string
): InsightCard[] {
  const insights: InsightCard[] = [];
  const employeeCount =
    parseInt(employees.split("-")[0] || employees.replace("+", "")) || 0;

  if (employeeCount < 10) {
    insights.push({
      title: "Micro Business",
      description:
        "Focus on basic compliances. DIY filing may be possible for simple cases.",
      category: "best-practice",
    });
  } else if (employeeCount < 50) {
    insights.push({
      title: "Small Business",
      description:
        "Consider part-time professional help for compliance management.",
      category: "best-practice",
    });
  } else if (employeeCount < 250) {
    insights.push({
      title: "Medium Business",
      description:
        "Full-time compliance team or dedicated consultant recommended.",
      category: "best-practice",
    });
  } else {
    insights.push({
      title: "Large Business",
      description:
        "Dedicated compliance department with automation software essential.",
      category: "best-practice",
    });
  }

  return insights;
}

/**
 * Get upcoming regulatory changes
 */
export function getUpcomingChanges(
  industry: string,
  state: string
): RegulatoryChange[] {
  const changes: RegulatoryChange[] = [];

  // Add industry-specific changes
  if (upcomingChanges[industry]) {
    changes.push(...upcomingChanges[industry]);
  }

  // Add general changes
  changes.push(...upcomingChanges["All"]);

  return changes;
}

/**
 * Get industry best practices
 */
export function getBestPractices(industry: string): string[] {
  const practices: Record<string, string[]> = {
    Manufacturing: [
      "Maintain detailed production records",
      "Automate compliance tracking for monthly filings",
      "Keep environmental clearances updated",
      "Regular safety audits",
    ],
    "IT/Software": [
      "Use automated TDS calculation tools",
      "Maintain proper project-wise records",
      "Track export benefits regularly",
      "Keep data protection measures updated",
    ],
    "Retail/E-commerce": [
      "Automate GST filing with inventory systems",
      "Maintain proper HSN code mapping",
      "Track consumer complaints systematically",
      "Regular inventory audits",
    ],
  };

  return (
    practices[industry] || [
      "Maintain proper books of accounts",
      "Set up compliance calendar reminders",
      "Regular professional consultations",
      "Keep all registrations updated",
    ]
  );
}

/**
 * Get common pitfalls
 */
export function getCommonPitfalls(profile: BusinessProfile): string[] {
  const pitfalls: string[] = [
    "Missing deadlines (most common issue)",
    "Incorrect tax calculations",
    "Not maintaining proper books of accounts",
    "Ignoring notices from authorities",
    "Wrong business classification affecting taxes",
  ];

  if (profile.msmeRegistered) {
    pitfalls.push("Not filing MSME annual returns on time");
  }

  if (
    parseInt(
      profile.employees.split("-")[0] || profile.employees.replace("+", "")
    ) ||
    0 >= 20
  ) {
    pitfalls.push("Incorrect EPF/ESI calculations for contract workers");
  }

  return pitfalls;
}

/**
 * Get peer benchmarks (simplified - would be data-driven in production)
 */
export function getPeerBenchmarks(
  industry: string,
  size: string,
  state: string
): {
  averageComplianceCount: number;
  averageCost: number;
  commonCompliances: string[];
} {
  // Simplified benchmarks - would be data-driven in production
  const benchmarks: Record<
    string,
    { averageComplianceCount: number; averageCost: number; commonCompliances: string[] }
  > = {
    "Manufacturing-Small": {
      averageComplianceCount: 8,
      averageCost: 45000,
      commonCompliances: ["gst", "epf", "esi", "professional-tax"],
    },
    "IT/Software-Small": {
      averageComplianceCount: 6,
      averageCost: 35000,
      commonCompliances: ["gst", "tds", "professional-tax"],
    },
    "Retail-Small": {
      averageComplianceCount: 7,
      averageCost: 40000,
      commonCompliances: ["gst", "shops-establishments", "professional-tax"],
    },
  };

  const key = `${industry}-${size}`;
  return (
    benchmarks[key] || {
      averageComplianceCount: 7,
      averageCost: 40000,
      commonCompliances: ["gst", "professional-tax"],
    }
  );
}

/**
 * Get recommended resources
 */
export function getRecommendedResources(profile: BusinessProfile): Array<{
  title: string;
  url: string;
  description: string;
  category: "software" | "consultant" | "training" | "portal";
}> {
  const resources: Array<{
    title: string;
    url: string;
    description: string;
    category: "software" | "consultant" | "training" | "portal";
  }> = [
    {
      title: "GST Portal",
      url: "https://www.gst.gov.in",
      description: "Official GST filing portal",
      category: "portal",
    },
    {
      title: "EPFO Portal",
      url: "https://www.epfindia.gov.in",
      description: "EPF filing and management",
      category: "portal",
    },
  ];

  if (profile.industry === "IT/Software") {
    resources.push({
      title: "Income Tax Portal",
      url: "https://www.incometax.gov.in",
      description: "TDS and income tax filing",
      category: "portal",
    });
  }

  return resources;
}
