import { readFileSync } from "fs";
import { join } from "path";
import type { BusinessProfile, ComplianceData } from "./types";
import { parseTurnover, parseEmployeeCount } from "./utils";

/**
 * Professional Tax applicable states
 */
const PROFESSIONAL_TAX_STATES = [
  "Maharashtra",
  "Karnataka",
  "West Bengal",
  "Tamil Nadu",
  "Gujarat",
  "Andhra Pradesh",
  "Telangana",
  "Madhya Pradesh",
  "Kerala",
  "Assam",
  "Odisha",
  "Punjab",
  "Tripura",
  "Meghalaya",
  "Chhattisgarh",
  "Sikkim",
  "Jharkhand",
];

/**
 * Loads compliance rules from JSON file
 */
function loadComplianceRules(): ComplianceData {
  try {
    const filePath = join(process.cwd(), "lib", "compliance-rules.json");
    const fileContents = readFileSync(filePath, "utf-8");
    return JSON.parse(fileContents) as ComplianceData;
  } catch (error) {
    console.error("Error loading compliance rules:", error);
    throw new Error("Failed to load compliance rules");
  }
}

/**
 * Parses turnover value from range string
 * @param turnoverRange - Turnover range string
 * @returns Numerical value in rupees
 */
function parseTurnoverValue(turnoverRange: string): number {
  return parseTurnover(turnoverRange);
}

/**
 * Parses employee count from range string
 * @param employeeRange - Employee range string
 * @returns Numerical employee count
 */
function parseEmployeeValue(employeeRange: string): number {
  return parseEmployeeCount(employeeRange);
}

/**
 * Checks if turnover meets threshold
 */
function checkTurnoverThreshold(turnover: number, threshold: number): boolean {
  return turnover >= threshold;
}

/**
 * Checks if employee count meets threshold
 */
function checkEmployeeThreshold(employees: number, threshold: number): boolean {
  return employees >= threshold;
}

/**
 * Checks if state is in applicable states list (case-insensitive)
 */
function checkStateApplicability(
  state: string,
  applicableStates: string[]
): boolean {
  return applicableStates.some(
    (applicableState) => applicableState.toLowerCase() === state.toLowerCase()
  );
}

/**
 * Determines which compliances apply to a business profile
 * @param profile - Business profile to check
 * @returns Array of applicable compliance IDs
 */
export function matchCompliances(profile: BusinessProfile): string[] {
  const applicableCompliances: string[] = [];
  const complianceData = loadComplianceRules();

  const turnoverValue = profile.annualTurnoverValue;
  const employeeCount = profile.employeeCount;

  // GST: Check turnover threshold based on business type
  // Services: ₹20L, Goods/Trading/Manufacturing: ₹40L
  const gstThreshold = profile.businessType === "Service" ? 2000000 : 4000000; // ₹20L or ₹40L
  if (checkTurnoverThreshold(turnoverValue, gstThreshold)) {
    applicableCompliances.push("gst");
  }

  // EPF: Applies if employees >= 20
  if (checkEmployeeThreshold(employeeCount, 20)) {
    applicableCompliances.push("epf");
  }

  // ESI: Applies if employees >= 10
  if (checkEmployeeThreshold(employeeCount, 10)) {
    applicableCompliances.push("esi");
  }

  // Professional Tax: State-specific
  if (checkStateApplicability(profile.state, PROFESSIONAL_TAX_STATES)) {
    applicableCompliances.push("professional-tax");
  }

  // TDS: Always applies (universal)
  applicableCompliances.push("tds");

  // MSME Annual Return: Applies if MSME registered
  if (profile.msmeRegistered) {
    applicableCompliances.push("msme-annual-return");
  }

  // MSME Form 1: Applies if owes payment to MSME
  if (profile.owesPaymentToMSME) {
    applicableCompliances.push("msme-form-1");
  }

  // Income Tax Return: Always applies (universal)
  applicableCompliances.push("income-tax");

  // Tax Audit: Check turnover threshold
  // Business: ₹1Cr, Professional: ₹50L
  const taxAuditThreshold =
    profile.businessType === "Professional" ? 5000000 : 10000000; // ₹50L or ₹1Cr
  if (checkTurnoverThreshold(turnoverValue, taxAuditThreshold)) {
    applicableCompliances.push("tax-audit");
  }

  // Shops & Establishments: Always applies (universal)
  applicableCompliances.push("shops-establishments");

  return applicableCompliances;
}

// Export helper functions for potential reuse
export {
  parseTurnoverValue,
  parseEmployeeValue,
  checkTurnoverThreshold,
  checkEmployeeThreshold,
  checkStateApplicability,
};
