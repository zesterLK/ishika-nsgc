"use client";

import { FileText } from "lucide-react";
import { FormField } from "./FormField";
import { RadioCards, type RadioOption } from "./RadioCards";
import type { BusinessProfileFormData } from "@/lib/form-state";

interface Step4AdditionalProps {
  formData: Partial<BusinessProfileFormData>;
  errors: Partial<Record<keyof BusinessProfileFormData, string>>;
  onChange: (field: keyof BusinessProfileFormData, value: any) => void;
}

export function Step4Additional({
  formData,
  errors,
  onChange,
}: Step4AdditionalProps) {
  const paymentOptions: RadioOption[] = [
    {
      value: "true",
      label: "Yes",
      description: "I have overdue payments to MSME suppliers",
      icon: <FileText className="w-6 h-6" />,
    },
    {
      value: "false",
      label: "No",
      description: "I do not have overdue payments to MSME suppliers",
      icon: <FileText className="w-6 h-6" />,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <FormField
        label="Do you have any overdue payments to MSME suppliers?"
        error={errors.owesPaymentToMSME}
        required
        helpText="If you owe payments to MSME entities for more than 45 days, you may need to file MSME Form 1"
      >
        <RadioCards
          options={paymentOptions}
          value={formData.owesPaymentToMSME?.toString()}
          onChange={(value) => onChange("owesPaymentToMSME", value === "true")}
          name="owesPaymentToMSME"
        />
      </FormField>
    </div>
  );
}
