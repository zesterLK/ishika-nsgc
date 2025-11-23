'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { ProgressIndicator } from './ProgressIndicator';
import { Step1BusinessInfo } from './Step1BusinessInfo';
import { Step2Location } from './Step2Location';
import { Step3Financial } from './Step3Financial';
import { Step4Additional } from './Step4Additional';
import {
  getInitialFormState,
  validateStep,
  isStepComplete,
  type BusinessProfileFormData,
  type FormErrors,
  type FormStep,
  businessProfileSchema,
  convertFormDataToBusinessProfile,
} from '@/lib/form-state';
import { cn } from '@/lib/utils';

const STEP_LABELS = ['Business Info', 'Location & Size', 'Financial Details', 'Additional Info'];

export function QuestionnaireForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [formData, setFormData] = useState<Partial<BusinessProfileFormData>>(getInitialFormState());
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleFieldChange = (field: keyof BusinessProfileFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep, formData);
    setErrors(stepErrors);

    if (Object.keys(stepErrors).length === 0) {
      if (currentStep < 4) {
        setCurrentStep((prev) => (prev + 1) as FormStep);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as FormStep);
      setSubmitError(null);
    }
  };

  const handleSubmit = async () => {
    // Validate all steps
    const allErrors: FormErrors = {};
    for (let step = 1; step <= 4; step++) {
      const stepErrors = validateStep(step as FormStep, formData);
      Object.assign(allErrors, stepErrors);
    }

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      setCurrentStep(1); // Go to first step with errors
      return;
    }

    // Validate with Zod schema
    const validationResult = businessProfileSchema.safeParse(formData);
    if (!validationResult.success) {
      const zodErrors: FormErrors = {};
      validationResult.error.errors.forEach((error) => {
        if (error.path[0]) {
          zodErrors[error.path[0] as keyof BusinessProfileFormData] = error.message;
        }
      });
      setErrors(zodErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const businessProfile = convertFormDataToBusinessProfile(validationResult.data);

      const response = await fetch('/api/generate-calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(businessProfile),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to generate calendar');
      }

      // Store in sessionStorage for dashboard
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('complianceData', JSON.stringify(result.data));
      }

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(
        error instanceof Error ? error.message : 'An error occurred. Please try again.'
      );
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1BusinessInfo
            formData={formData}
            errors={errors}
            onChange={handleFieldChange}
          />
        );
      case 2:
        return (
          <Step2Location formData={formData} errors={errors} onChange={handleFieldChange} />
        );
      case 3:
        return (
          <Step3Financial formData={formData} errors={errors} onChange={handleFieldChange} />
        );
      case 4:
        return (
          <Step4Additional formData={formData} errors={errors} onChange={handleFieldChange} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <ProgressIndicator
        currentStep={currentStep}
        totalSteps={4}
        stepLabels={STEP_LABELS}
      />

      <div className="min-h-[400px]">{renderStep()}</div>

      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-600">{submitError}</p>
        </div>
      )}

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className={cn(
            'px-6 py-3 rounded-lg font-semibold transition-all',
            currentStep === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50'
          )}
        >
          Previous
        </button>

        {currentStep < 4 ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={!isStepComplete(currentStep, formData)}
            className={cn(
              'px-8 py-3 rounded-lg font-semibold text-white transition-all',
              isStepComplete(currentStep, formData)
                ? 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
                : 'bg-gray-400 cursor-not-allowed'
            )}
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !isStepComplete(4, formData)}
            className={cn(
              'px-8 py-3 rounded-lg font-semibold text-white transition-all flex items-center gap-2',
              isSubmitting || !isStepComplete(4, formData)
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 hover:scale-105'
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Calendar...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Submit & Generate Calendar
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

