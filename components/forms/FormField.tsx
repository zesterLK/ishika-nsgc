import { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  helpText?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({ label, error, required, helpText, children, className }: FormFieldProps) {
  return (
    <div className={cn('mb-6', className)}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {helpText && <p className="text-sm text-gray-500 italic mb-3">{helpText}</p>}
      {children}
      {error && (
        <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

