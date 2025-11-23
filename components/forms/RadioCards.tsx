import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  icon?: ReactNode;
}

interface RadioCardsProps {
  options: RadioOption[];
  value?: string;
  onChange: (value: string) => void;
  name: string;
  className?: string;
}

export function RadioCards({ options, value, onChange, name, className }: RadioCardsProps) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-4', className)}>
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <label
            key={option.value}
            className={cn(
              'relative flex flex-col p-6 border-2 rounded-lg cursor-pointer transition-all',
              'hover:shadow-md hover:scale-[1.02]',
              'focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2',
              isSelected
                ? 'border-blue-600 bg-blue-50 shadow-md'
                : 'border-gray-300 bg-white hover:border-gray-400'
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={isSelected}
              onChange={(e) => onChange(e.target.value)}
              className="sr-only"
            />
            {option.icon && <div className="mb-3 text-blue-600">{option.icon}</div>}
            <div className="font-semibold text-gray-900 mb-1">{option.label}</div>
            {option.description && (
              <div className="text-sm text-gray-600 mt-1">{option.description}</div>
            )}
            {isSelected && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </label>
        );
      })}
    </div>
  );
}

