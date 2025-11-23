"use client";

import { Users } from "lucide-react";
import { FormField } from "./FormField";
import { RadioCards, type RadioOption } from "./RadioCards";
import { INDIAN_STATES_AND_UTS } from "@/lib/types";
import { EMPLOYEE_RANGES } from "@/lib/form-state";
import type { BusinessProfileFormData } from "@/lib/form-state";

interface Step2LocationProps {
  formData: Partial<BusinessProfileFormData>;
  errors: Partial<Record<keyof BusinessProfileFormData, string>>;
  onChange: (field: keyof BusinessProfileFormData, value: any) => void;
}

export function Step2Location({
  formData,
  errors,
  onChange,
}: Step2LocationProps) {
  const employeeOptions: RadioOption[] = EMPLOYEE_RANGES.map((range) => ({
    value: range.value,
    label: range.label,
    description: `${range.label} employees`,
    icon: <Users className="w-6 h-6" />,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <FormField
        label="Which state is your business registered in?"
        error={errors.state}
        required
        helpText="Select the state where your business is registered or primarily operates"
      >
        <select
          value={formData.state || ""}
          onChange={(e) => onChange("state", e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none transition-colors appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMUw2IDZMMTEgMSIgc3Ryb2tlPSIjNjY2IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-[length:12px_8px] bg-[right_1rem_center] bg-no-repeat"
        >
          <option value="">Select a state or union territory</option>
          {INDIAN_STATES_AND_UTS.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label="How many employees do you have?"
        error={errors.employees}
        required
        helpText="Include all full-time and part-time employees"
      >
        <RadioCards
          options={employeeOptions}
          value={formData.employees}
          onChange={(value) => onChange("employees", value)}
          name="employees"
        />
      </FormField>
    </div>
  );
}
