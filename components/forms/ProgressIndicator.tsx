import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

export function ProgressIndicator({ currentStep, totalSteps, stepLabels }: ProgressIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      {stepLabels && stepLabels.length === totalSteps && (
        <div className="flex justify-between mt-4 text-xs text-gray-600">
          {stepLabels.map((label, index) => (
            <span
              key={index}
              className={cn(
                index + 1 <= currentStep ? 'font-semibold text-blue-600' : 'text-gray-400'
              )}
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

