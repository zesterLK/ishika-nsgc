"use client";

import { X, CheckCircle2, Loader2, Circle } from "lucide-react";

interface GenerationStep {
  id: string;
  label: string;
  status: "pending" | "in-progress" | "completed" | "error";
}

interface ReportGenerationDialogProps {
  isOpen: boolean;
  steps: GenerationStep[];
  currentStep: string | null;
  onClose?: () => void;
}

export function ReportGenerationDialog({
  isOpen,
  steps,
  currentStep,
  onClose,
}: ReportGenerationDialogProps) {
  if (!isOpen) return null;

  const getStepIcon = (step: GenerationStep) => {
    if (step.status === "completed") {
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    }
    if (step.status === "in-progress") {
      return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
    }
    if (step.status === "error") {
      return <X className="w-5 h-5 text-red-600" />;
    }
    return <Circle className="w-5 h-5 text-gray-400" />;
  };

  const getStepTextColor = (step: GenerationStep) => {
    if (step.status === "completed") {
      return "text-green-700";
    }
    if (step.status === "in-progress") {
      return "text-blue-700 font-medium";
    }
    if (step.status === "error") {
      return "text-red-700";
    }
    return "text-gray-500";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Generating Report
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Steps */}
        <div className="p-6">
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-0.5">{getStepIcon(step)}</div>
                <div className="flex-1">
                  <div className={`text-sm ${getStepTextColor(step)}`}>
                    {step.label}
                  </div>
                  {step.status === "in-progress" && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-blue-600 h-1.5 rounded-full animate-pulse" style={{ width: "60%" }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Progress Text */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              {steps.filter((s) => s.status === "completed").length} of{" "}
              {steps.length} steps completed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

