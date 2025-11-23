'use client';

import type { Priority } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md' | 'lg';
}

export function PriorityBadge({ priority, size = 'md' }: PriorityBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const colorClasses = {
    High: 'bg-red-100 text-red-700 border-red-300',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    Low: 'bg-green-100 text-green-700 border-green-300',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        sizeClasses[size],
        colorClasses[priority]
      )}
    >
      {priority}
    </span>
  );
}

