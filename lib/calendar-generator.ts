import { readFileSync } from "fs";
import { join } from "path";
import { addMonths, setDate, startOfMonth, format, addDays } from "date-fns";
import type {
  ComplianceData,
  CalendarEntry,
  ComplianceRule,
  ComplianceForm,
} from "./types";
import { calculateDaysUntil, formatDate } from "./utils";

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
 * Calculates priority based on days until due date
 */
function calculatePriority(dueDate: Date): "High" | "Medium" | "Low" {
  const daysUntil = calculateDaysUntil(dueDate);
  if (daysUntil < 7) return "High";
  if (daysUntil < 30) return "Medium";
  return "Low";
}

/**
 * Generates due dates for a form based on its deadline type
 */
function generateDueDatesForForm(
  form: ComplianceForm,
  compliance: ComplianceRule,
  startDate: Date,
  monthsToGenerate: number = 12
): Date[] {
  const dueDates: Date[] = [];
  const deadline = form.deadline;

  if (deadline.type === "monthly" && deadline.day) {
    // Monthly deadline: same day each month
    for (let i = 0; i < monthsToGenerate; i++) {
      const monthDate = startOfMonth(addMonths(startDate, i));
      let dueDate = setDate(monthDate, deadline.day);
      // If the day has passed this month, use next month
      if (dueDate < startDate) {
        const nextMonth = startOfMonth(addMonths(monthDate, 1));
        dueDate = setDate(nextMonth, deadline.day);
      }
      dueDates.push(dueDate);
    }
  } else if (deadline.type === "quarterly" && deadline.day) {
    // Quarterly deadline: same day every 3 months
    const quarterStartMonth = Math.floor(startDate.getMonth() / 3) * 3;
    const quarterStart = startOfMonth(
      new Date(startDate.getFullYear(), quarterStartMonth, 1)
    );

    for (let i = 0; i < monthsToGenerate; i += 3) {
      const quarterDate = startOfMonth(addMonths(quarterStart, i));
      let dueDate = setDate(quarterDate, deadline.day);
      if (dueDate < startDate) {
        const nextQuarter = startOfMonth(addMonths(quarterDate, 3));
        dueDate = setDate(nextQuarter, deadline.day);
      }
      dueDates.push(dueDate);
    }
  } else if (deadline.type === "annual") {
    // Annual deadline: once per year
    const currentYear = startDate.getFullYear();
    if (deadline.day) {
      const annualDate = new Date(currentYear, 0, deadline.day);
      if (annualDate < startDate) {
        dueDates.push(new Date(currentYear + 1, 0, deadline.day));
      } else {
        dueDates.push(annualDate);
      }
      // Add next year's date
      if (monthsToGenerate > 12) {
        dueDates.push(new Date(currentYear + 2, 0, deadline.day));
      }
    }
  } else if (deadline.type === "fixed") {
    // Fixed date: specific date (handle as annual for now)
    if (deadline.day) {
      const currentYear = startDate.getFullYear();
      const fixedDate = new Date(currentYear, 0, deadline.day);
      if (fixedDate < startDate) {
        dueDates.push(new Date(currentYear + 1, 0, deadline.day));
      } else {
        dueDates.push(fixedDate);
      }
    }
  }

  return dueDates.filter((date) => {
    const monthsDiff =
      (date.getFullYear() - startDate.getFullYear()) * 12 +
      (date.getMonth() - startDate.getMonth());
    return monthsDiff < monthsToGenerate && monthsDiff >= 0;
  });
}

/**
 * Creates a calendar entry from a form and due date
 */
function createCalendarEntry(
  compliance: ComplianceRule,
  form: ComplianceForm,
  dueDate: Date,
  entryIndex: number
): CalendarEntry {
  const id = `${compliance.id}-${form.name.toLowerCase().replace(/\s+/g, "-")}-${format(dueDate, "yyyy-MM-dd")}-${entryIndex}`;
  const month = format(dueDate, "MMMM yyyy");
  const priority = calculatePriority(dueDate);

  return {
    id,
    complianceId: compliance.id,
    complianceName: compliance.name,
    formName: form.name,
    description: form.description,
    dueDate,
    month,
    category: compliance.category,
    priority,
    penalty: form.penalty,
    resources: compliance.resources,
  };
}

/**
 * Generates calendar entries for the next 12 months based on applicable compliances
 * @param applicableComplianceIds - Array of compliance IDs that apply to the business
 * @param startDate - Start date for calendar generation (typically today)
 * @returns Array of calendar entries sorted by due date
 */
export function generateCalendar(
  applicableComplianceIds: string[],
  startDate: Date = new Date()
): CalendarEntry[] {
  const complianceData = loadComplianceRules();
  const calendarEntries: CalendarEntry[] = [];

  for (const complianceId of applicableComplianceIds) {
    const compliance = complianceData.compliances[complianceId];

    if (!compliance) {
      console.warn(`Compliance ${complianceId} not found in rules`);
      continue;
    }

    // Generate entries for each form in the compliance
    for (let formIndex = 0; formIndex < compliance.forms.length; formIndex++) {
      const form = compliance.forms[formIndex];
      const dueDates = generateDueDatesForForm(form, compliance, startDate, 12);

      // Create calendar entry for each due date
      for (let dateIndex = 0; dateIndex < dueDates.length; dateIndex++) {
        const dueDate = dueDates[dateIndex];
        const entry = createCalendarEntry(
          compliance,
          form,
          dueDate,
          formIndex * 1000 + dateIndex
        );
        calendarEntries.push(entry);
      }
    }
  }

  // Sort by due date
  calendarEntries.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  return calendarEntries;
}

// Note: Utility functions (sortCalendarByDate, filterCalendarByCategory, etc.)
// have been moved to calendar-utils.ts to avoid bundling fs module on client side
