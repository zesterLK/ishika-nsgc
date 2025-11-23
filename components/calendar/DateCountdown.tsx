'use client';

import { calculateDaysUntil } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface DateCountdownProps {
  dueDate: Date;
  className?: string;
}

export function DateCountdown({ dueDate, className }: DateCountdownProps) {
  const daysUntil = calculateDaysUntil(dueDate);
  const isOverdue = daysUntil < 0;
  const isUrgent = daysUntil >= 0 && daysUntil <= 7;

  let text: string;
  let colorClass: string;

  if (isOverdue) {
    text = `Overdue by ${Math.abs(daysUntil)} day${Math.abs(daysUntil) !== 1 ? 's' : ''}`;
    colorClass = 'text-red-600 font-semibold';
  } else if (daysUntil === 0) {
    text = 'Due today';
    colorClass = 'text-red-600 font-semibold';
  } else if (daysUntil === 1) {
    text = 'Due tomorrow';
    colorClass = 'text-orange-600 font-semibold';
  } else if (isUrgent) {
    text = `Due in ${daysUntil} days`;
    colorClass = 'text-orange-600 font-medium';
  } else {
    text = `Due in ${daysUntil} days`;
    colorClass = 'text-gray-600';
  }

  return (
    <span className={cn('text-sm', colorClass, className)}>{text}</span>
  );
}

