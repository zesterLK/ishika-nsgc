import { z } from "zod";
import {
  INDIAN_STATES_AND_UTS,
  type BusinessType,
  type TurnoverRange,
  type EmployeeRange,
} from "./types";
import { parseTurnover, parseEmployeeCount } from "./utils";

/**
 * Zod schema for business profile form validation
 */
export const businessProfileSchema = z.object({
  businessType: z.enum(
    ["Manufacturing", "Trading", "Service", "Professional"],
    {
      required_error: "Business type is required",
    }
  ),
  state: z.string().min(1, "State is required"),
  turnover: z.enum(
    ["<20L", "20L-40L", "40L-1Cr", "1Cr-5Cr", "5Cr-10Cr", ">10Cr"],
    {
      required_error: "Annual turnover is required",
    }
  ),
  employees: z.enum(["<10", "10-19", "20-49", "50-99", "100+"], {
    required_error: "Employee count is required",
  }),
  msmeRegistered: z.boolean({
    required_error: "MSME registration status is required",
  }),
  industry: z.string().min(2, "Industry must be at least 2 characters"),
  owesPaymentToMSME: z.boolean({
    required_error: "MSME payment status is required",
  }),
});

/**
 * Business type options with labels
 */
export const BUSINESS_TYPES: Array<{
  value: BusinessType;
  label: string;
  description?: string;
}> = [
  {
    value: "Manufacturing",
    label: "Manufacturing",
    description: "Production of goods",
  },
  {
    value: "Trading",
    label: "Trading",
    description: "Buying and selling goods",
  },
  { value: "Service", label: "Service", description: "Providing services" },
  {
    value: "Professional",
    label: "Professional",
    description: "Professional services (CA, lawyer, etc.)",
  },
];

/**
 * Turnover range options with labels and numerical values
 */
export const TURNOVER_RANGES: Array<{
  value: TurnoverRange;
  label: string;
  numericalValue: number;
}> = [
  { value: "<20L", label: "Less than ₹20 Lakhs", numericalValue: 1000000 },
  { value: "20L-40L", label: "₹20 Lakhs - ₹40 Lakhs", numericalValue: 3000000 },
  { value: "40L-1Cr", label: "₹40 Lakhs - ₹1 Crore", numericalValue: 7000000 },
  { value: "1Cr-5Cr", label: "₹1 Crore - ₹5 Crores", numericalValue: 30000000 },
  {
    value: "5Cr-10Cr",
    label: "₹5 Crores - ₹10 Crores",
    numericalValue: 75000000,
  },
  { value: ">10Cr", label: "More than ₹10 Crores", numericalValue: 150000000 },
];

/**
 * Employee range options with labels and numerical values
 */
export const EMPLOYEE_RANGES: Array<{
  value: EmployeeRange;
  label: string;
  numericalValue: number;
}> = [
  { value: "<10", label: "Less than 10", numericalValue: 5 },
  { value: "10-19", label: "10 - 19", numericalValue: 15 },
  { value: "20-49", label: "20 - 49", numericalValue: 35 },
  { value: "50-99", label: "50 - 99", numericalValue: 75 },
  { value: "100+", label: "100 or more", numericalValue: 150 },
];

/**
 * Common industry options
 */
export const INDUSTRY_OPTIONS = [
  "Manufacturing",
  "IT/Software",
  "Retail",
  "Food & Beverage",
  "Healthcare",
  "Education",
  "Construction",
  "Real Estate",
  "Transportation",
  "Hospitality",
  "Finance",
  "Consulting",
  "E-commerce",
  "Textiles",
  "Chemicals",
  "Pharmaceuticals",
  "Automotive",
  "Electronics",
  "Other",
];

/**
 * Form step type
 */
export type FormStep = 1 | 2 | 3 | 4;

/**
 * Business profile form data type (inferred from Zod schema)
 */
export type BusinessProfileFormData = z.infer<typeof businessProfileSchema>;

/**
 * Form errors type
 */
export type FormErrors = Partial<Record<keyof BusinessProfileFormData, string>>;

/**
 * Initial empty form state
 */
export function getInitialFormState(): Partial<BusinessProfileFormData> {
  return {
    businessType: undefined,
    state: "",
    turnover: undefined,
    employees: undefined,
    msmeRegistered: false,
    industry: "",
    owesPaymentToMSME: false,
  };
}

/**
 * Validates a specific form step
 * @param stepNumber - The step number to validate (1-4)
 * @param formData - Current form data
 * @returns Object with field errors for the step
 */
export function validateStep(
  stepNumber: FormStep,
  formData: Partial<BusinessProfileFormData>
): FormErrors {
  const errors: FormErrors = {};

  switch (stepNumber) {
    case 1:
      if (!formData.businessType) {
        errors.businessType = "Business type is required";
      }
      if (!formData.industry || formData.industry.trim().length < 2) {
        errors.industry = "Industry must be at least 2 characters";
      }
      break;

    case 2:
      if (!formData.state || formData.state.trim() === "") {
        errors.state = "State is required";
      }
      if (!formData.employees) {
        errors.employees = "Employee count is required";
      }
      break;

    case 3:
      if (!formData.turnover) {
        errors.turnover = "Annual turnover is required";
      }
      if (formData.msmeRegistered === undefined) {
        errors.msmeRegistered = "MSME registration status is required";
      }
      break;

    case 4:
      if (formData.owesPaymentToMSME === undefined) {
        errors.owesPaymentToMSME = "MSME payment status is required";
      }
      break;
  }

  return errors;
}

/**
 * Checks if a specific step is complete
 * @param stepNumber - The step number to check (1-4)
 * @param formData - Current form data
 * @returns True if step is complete, false otherwise
 */
export function isStepComplete(
  stepNumber: FormStep,
  formData: Partial<BusinessProfileFormData>
): boolean {
  const errors = validateStep(stepNumber, formData);
  return Object.keys(errors).length === 0;
}

/**
 * Calculates form completion percentage
 * @param formData - Current form data
 * @returns Percentage completion (0-100)
 */
export function getFormProgress(
  formData: Partial<BusinessProfileFormData>
): number {
  let completedFields = 0;
  const totalFields = 7;

  if (formData.businessType) completedFields++;
  if (formData.industry && formData.industry.trim().length >= 2)
    completedFields++;
  if (formData.state && formData.state.trim() !== "") completedFields++;
  if (formData.employees) completedFields++;
  if (formData.turnover) completedFields++;
  if (formData.msmeRegistered !== undefined) completedFields++;
  if (formData.owesPaymentToMSME !== undefined) completedFields++;

  return Math.round((completedFields / totalFields) * 100);
}

/**
 * Converts form data to BusinessProfile type with calculated values
 * @param formData - Form data to convert
 * @returns BusinessProfile object with calculated annualTurnoverValue and employeeCount
 */
export function convertFormDataToBusinessProfile(
  formData: BusinessProfileFormData
) {
  return {
    ...formData,
    annualTurnoverValue: parseTurnover(formData.turnover),
    employeeCount: parseEmployeeCount(formData.employees),
  };
}
