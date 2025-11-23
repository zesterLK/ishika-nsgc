'use client';

import { useState } from 'react';
import { Factory, ShoppingCart, Briefcase, GraduationCap } from 'lucide-react';
import { FormField } from './FormField';
import { RadioCards, type RadioOption } from './RadioCards';
import { BUSINESS_TYPES, INDUSTRY_OPTIONS } from '@/lib/form-state';
import type { BusinessProfileFormData } from '@/lib/form-state';

interface Step1BusinessInfoProps {
  formData: Partial<BusinessProfileFormData>;
  errors: Partial<Record<keyof BusinessProfileFormData, string>>;
  onChange: (field: keyof BusinessProfileFormData, value: any) => void;
}

const businessTypeIcons = {
  Manufacturing: <Factory className="w-6 h-6" />,
  Trading: <ShoppingCart className="w-6 h-6" />,
  Service: <Briefcase className="w-6 h-6" />,
  Professional: <GraduationCap className="w-6 h-6" />,
};

export function Step1BusinessInfo({ formData, errors, onChange }: Step1BusinessInfoProps) {
  const [industrySearch, setIndustrySearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const businessTypeOptions: RadioOption[] = BUSINESS_TYPES.map((type) => ({
    value: type.value,
    label: type.label,
    description: type.description,
    icon: businessTypeIcons[type.value],
  }));

  const filteredIndustries = INDUSTRY_OPTIONS.filter((industry) =>
    industry.toLowerCase().includes(industrySearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <FormField
        label="What type of business do you operate?"
        error={errors.businessType}
        required
      >
        <RadioCards
          options={businessTypeOptions}
          value={formData.businessType}
          onChange={(value) => onChange('businessType', value)}
          name="businessType"
        />
      </FormField>

      <FormField
        label="What industry are you in?"
        error={errors.industry}
        required
        helpText="Select or type your industry"
      >
        <div className="relative">
          <input
            type="text"
            value={formData.industry || industrySearch}
            onChange={(e) => {
              const value = e.target.value;
              setIndustrySearch(value);
              setShowDropdown(true);
              onChange('industry', value);
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            placeholder="Select or type your industry"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
            list="industry-list"
          />
          {showDropdown && filteredIndustries.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
              {filteredIndustries.map((industry) => (
                <button
                  key={industry}
                  type="button"
                  onClick={() => {
                    onChange('industry', industry);
                    setIndustrySearch('');
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors"
                >
                  {industry}
                </button>
              ))}
            </div>
          )}
        </div>
      </FormField>
    </div>
  );
}

