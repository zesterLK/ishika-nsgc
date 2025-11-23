'use client';

import { cn, getCategoryColor } from '@/lib/utils';

interface CategoryTagProps {
  category: string;
  size?: 'sm' | 'md' | 'lg';
}

export function CategoryTag({ category, size = 'md' }: CategoryTagProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        sizeClasses[size],
        getCategoryColor(category)
      )}
    >
      {category}
    </span>
  );
}

