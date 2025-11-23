/**
 * TypeScript type definitions for the SME Compliance Tracker application
 */

/**
 * Turnover range type union for business profile
 */
export type TurnoverRange =
  | "<20L"
  | "20L-40L"
  | "40L-1Cr"
  | "1Cr-5Cr"
  | "5Cr-10Cr"
  | ">10Cr";

/**
 * Employee range type union for business profile
 */
export type EmployeeRange = "<10" | "10-19" | "20-49" | "50-99" | "100+";

/**
 * Business type options
 */
export type BusinessType =
  | "Manufacturing"
  | "Trading"
  | "Service"
  | "Professional";

/**
 * Compliance category types
 */
export type ComplianceCategory =
  | "Tax"
  | "Labor"
  | "Statutory"
  | "Environmental";

/**
 * Compliance frequency types
 */
export type ComplianceFrequency =
  | "monthly"
  | "quarterly"
  | "biannual"
  | "annual";

/**
 * Deadline type options
 */
export type DeadlineType = "monthly" | "quarterly" | "annual" | "fixed";

/**
 * Priority levels for calendar entries
 */
export type Priority = "High" | "Medium" | "Low";

/**
 * Array of all 28 Indian states
 */
export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const;

/**
 * Array of all 8 Union Territories
 */
export const UNION_TERRITORIES = [
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
] as const;

/**
 * Combined array of all Indian states and union territories
 */
export const INDIAN_STATES_AND_UTS = [
  ...INDIAN_STATES,
  ...UNION_TERRITORIES,
] as const;

/**
 * Business profile interface containing all business information
 * used to determine applicable compliances
 */
export interface BusinessProfile {
  /** Type of business operation */
  businessType: BusinessType;
  /** State where business is registered/operates */
  state: string;
  /** Turnover range in string format */
  turnover: TurnoverRange;
  /** Annual turnover value in rupees (for calculations) */
  annualTurnoverValue: number;
  /** Employee count range in string format */
  employees: EmployeeRange;
  /** Employee count as number (for calculations) */
  employeeCount: number;
  /** Whether business is registered under MSME */
  msmeRegistered: boolean;
  /** Industry sector */
  industry: string;
  /** Whether business owes payment to MSME entities */
  owesPaymentToMSME: boolean;
}

/**
 * Resource interface for external links and documentation
 */
export interface Resource {
  /** Title of the resource */
  title: string;
  /** URL to the resource */
  url: string;
}

/**
 * Contribution rate interface for compliances with employer/employee contributions
 */
export interface ContributionRate {
  /** Employer contribution rate as string (e.g., "12%") */
  employer: string;
  /** Employee contribution rate as string (e.g., "12%") */
  employee: string;
}

/**
 * Deadline interface defining when compliance forms are due
 */
export interface Deadline {
  /** Type of deadline (monthly, quarterly, annual, or fixed date) */
  type: DeadlineType;
  /** Day of month when due (for monthly/quarterly) */
  day?: number;
  /** Formula description for deadline calculation */
  formula: string;
  /** Detailed calculation explanation */
  calculation: string;
}

/**
 * Compliance form interface representing individual forms within a compliance
 */
export interface ComplianceForm {
  /** Name of the form (e.g., "GSTR-1", "ECR") */
  name: string;
  /** Description of what the form is for */
  description: string;
  /** Deadline information for form submission */
  deadline: Deadline;
  /** Penalty information for late filing */
  penalty: string;
}

/**
 * Applicability rule interface defining when a compliance applies to a business
 */
export interface ApplicabilityRule {
  /** Human-readable condition description */
  condition: string;
  /** Threshold value(s) that determine applicability (can be number or object with multiple thresholds) */
  threshold?: number | { [key: string]: number };
  /** List of states where this compliance applies (if state-specific) */
  states?: string[];
}

/**
 * Compliance rule interface representing a single compliance requirement
 */
export interface ComplianceRule {
  /** Unique identifier for the compliance */
  id: string;
  /** Name of the compliance */
  name: string;
  /** Category of compliance (Tax, Labor, Statutory, Environmental) */
  category: ComplianceCategory;
  /** Rules that determine when this compliance applies */
  applicability: ApplicabilityRule;
  /** How frequently this compliance must be filed */
  frequency: ComplianceFrequency;
  /** List of forms associated with this compliance */
  forms: ComplianceForm[];
  /** Contribution rates (if applicable, e.g., for EPF, ESI) */
  contribution?: ContributionRate;
  /** External resources and official links */
  resources: Resource[];
}

/**
 * Calendar entry interface for individual compliance deadlines
 */
export interface CalendarEntry {
  /** Unique identifier for the calendar entry */
  id: string;
  /** ID of the compliance this entry belongs to */
  complianceId: string;
  /** Name of the compliance */
  complianceName: string;
  /** Name of the form */
  formName: string;
  /** Description of what needs to be done */
  description: string;
  /** Due date for this compliance */
  dueDate: Date;
  /** Month string (e.g., "January 2025") */
  month: string;
  /** Category of the compliance */
  category: string;
  /** Priority level (High, Medium, Low) */
  priority: Priority;
  /** Penalty information */
  penalty: string;
  /** Related resources */
  resources: Resource[];
}

/**
 * Cost breakdown interface for individual compliance costs
 */
export interface CostBreakdown {
  /** Compliance ID */
  complianceId: string;
  /** Compliance name */
  complianceName: string;
  /** Filing fees (government charges) */
  filingFee: number;
  /** Professional fees (CA, consultant) */
  professionalFee: number;
  /** Software/tools costs */
  software: number;
  /** Time cost (employee hours value) */
  timeValue: number;
  /** Total cost for this compliance */
  total: number;
}

/**
 * Risk factor interface for individual risk assessment
 */
export interface RiskFactor {
  /** Factor name/description */
  factor: string;
  /** Severity level */
  severity: "Low" | "Medium" | "High";
  /** Impact score (1-5) */
  impact: number;
  /** Description of the risk */
  description: string;
  /** Mitigation recommendations */
  mitigation: string;
}

/**
 * Risk assessment interface
 */
export interface RiskAssessment {
  /** Overall risk level */
  overallRisk: "Low" | "Medium" | "High";
  /** Risk score (0-10) */
  riskScore: number;
  /** List of risk factors */
  riskFactors: RiskFactor[];
  /** Recommendations to mitigate risks */
  recommendations: string[];
}

/**
 * Checklist item interface for actionable items
 */
export interface ChecklistItem {
  /** Item ID */
  id: string;
  /** Item title/description */
  title: string;
  /** Priority level */
  priority: "High" | "Medium" | "Low";
  /** Due timeframe */
  timeframe: "immediate" | "short-term" | "long-term";
  /** Estimated effort/cost */
  estimatedEffort?: string;
  /** Whether item is completed */
  completed?: boolean;
}

/**
 * Insight card interface for industry/state-specific insights
 */
export interface InsightCard {
  /** Insight title */
  title: string;
  /** Insight description */
  description: string;
  /** Category of insight */
  category: "critical" | "opportunity" | "warning" | "best-practice";
  /** Related compliance IDs */
  relatedCompliances?: string[];
}

/**
 * Regulatory change interface
 */
export interface RegulatoryChange {
  /** Change title */
  title: string;
  /** Expected date */
  date: string;
  /** Impact description */
  impact: string;
  /** Recommended action */
  action: string;
  /** Industries affected */
  industries?: string[];
}

/**
 * Compliance overview interface
 */
export interface ComplianceOverview {
  /** Total number of compliances */
  totalCompliances: number;
  /** Number of monthly compliances */
  monthlyCompliances: number;
  /** Number of quarterly compliances */
  quarterlyCompliances: number;
  /** Number of annual compliances */
  annualCompliances: number;
  /** Breakdown by category */
  categoryBreakdown: { [category: string]: number };
}

/**
 * Upcoming critical deadlines interface
 */
export interface UpcomingCriticalDeadlines {
  /** Deadlines in next 7 days */
  next7Days: CalendarEntry[];
  /** Deadlines in next 30 days */
  next30Days: CalendarEntry[];
  /** Deadlines in next 90 days */
  next90Days: CalendarEntry[];
}

/**
 * Cost analysis interface
 */
export interface CostAnalysis {
  /** Total annual cost */
  totalAnnualCost: number;
  /** Detailed cost breakdown */
  breakdown: CostBreakdown[];
  /** Comparison to industry average */
  comparisonToIndustryAverage: string;
  /** Potential savings opportunities */
  potentialSavings: string[];
}

/**
 * Action plan interface
 */
export interface ActionPlan {
  /** Immediate actions (next 7 days) */
  immediate: string[];
  /** Short-term actions (next 30 days) */
  shortTerm: string[];
  /** Long-term actions (next 90+ days) */
  longTerm: string[];
}

/**
 * Compliance report interface containing complete compliance analysis
 */
export interface ComplianceReport {
  /** Executive summary (3-4 sentences) */
  executiveSummary: string;
  /** Key findings (5-7 bullet points) */
  keyFindings: string[];
  /** Compliance overview statistics */
  complianceOverview: ComplianceOverview;
  /** Upcoming critical deadlines grouped by timeframe */
  upcomingCriticalDeadlines: UpcomingCriticalDeadlines;
  /** Cost analysis with breakdown */
  costAnalysis: CostAnalysis;
  /** Risk assessment */
  riskAssessment: RiskAssessment;
  /** Action plan by timeframe */
  actionPlan: ActionPlan;
  /** Industry-specific insights */
  industrySpecificInsights: string[];
  /** Compliance checklist */
  complianceChecklist: ChecklistItem[];
  /** Business profile used to generate this report */
  businessProfile: BusinessProfile;
  /** List of compliance IDs that apply to this business */
  applicableCompliances: string[];
  /** Timestamp when report was generated */
  generatedAt: Date;
  /** AI provider used (or 'template' for fallback) */
  generatedBy: "openai" | "template";
}

/**
 * Metadata interface for compliance data file
 */
export interface ComplianceDataMetadata {
  /** Version of the data format */
  version: string;
  /** ISO timestamp when data was generated */
  generatedAt: string;
  /** ISO timestamp when data was last updated */
  lastUpdated: string;
  /** Source of the data */
  source: string;
  /** Who/what this data is applicable for */
  applicableFor: string;
  /** Disclaimer message */
  disclaimer: string;
}

/**
 * Root compliance data structure containing all compliance rules
 */
export interface ComplianceData {
  /** Metadata about the compliance data */
  metadata: ComplianceDataMetadata;
  /** Dictionary of compliance rules keyed by compliance ID */
  compliances: { [key: string]: ComplianceRule };
}
