'use client';

import { IndianRupee, Building2 } from 'lucide-react';
import { FormField } from './FormField';
import { RadioCards, type RadioOption } from './RadioCards';
import { TURNOVER_RANGES } from '@/lib/form-state';
import type { BusinessProfileFormData } from '@/lib/form-state';

interface Step3FinancialProps {
  formData: Partial<BusinessProfileFormData>;
  errors: Partial<Record<keyof BusinessProfileFormData, string>>;
  onChange: (field: keyof BusinessProfileFormData, value: any) => void;
}

export function Step3Financial({ formData, errors, onChange }: Step3FinancialProps) {
  const turnoverOptions: RadioOption[] = TURNOVER_RANGES.map((range) => ({
    value: range.value,
    label: range.label,
    description: `Annual turnover: ${range.label}`,
    icon: <IndianRupee className="w-6 h-6" />,
  }));

  const msmeOptions: RadioOption[] = [
    {
      value: 'true',
      label: 'Yes',
      description: 'My business is registered under MSME',
      icon: <Building2 className="w-6 h-6" />,
    },
    {
      value: 'false',
      label: 'No',
      description: 'My business is not registered under MSME',
      icon: <Building2 className="w-6 h-6" />,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <FormField
        label="What is your annual turnover?"
        error={errors.turnover}
        required
        helpText="Select the range that best matches your annual revenue"
      >
        <RadioCards
          options={turnoverOptions}
          value={formData.turnover}
          onChange={(value) => onChange('turnover', value)}
          name="turnover"
        />
      </FormField>

      <FormField
        label="Is your business registered under MSME?"
        error={errors.msmeRegistered}
        required
        helpText="MSME (Micro, Small, and Medium Enterprises) registration"
      >
        <RadioCards
          options={msmeOptions}
          value={formData.msmeRegistered?.toString()}
          onChange={(value) => onChange('msmeRegistered', value === 'true')}
          name="msmeRegistered"
        />
      </FormField>
    </div>
  );
}

