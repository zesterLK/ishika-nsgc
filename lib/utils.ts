import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { differenceInDays, differenceInMonths } from 'date-fns';
import { BusinessProfile } from './types';

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx and tailwind-merge to handle conditional classes and resolve conflicts
 * 
 * @param inputs - Variable number of class values (strings, objects, arrays)
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts turnover range strings to numeric values (in rupees)
 * Returns the midpoint of the range for calculations
 * 
 * @param turnoverRange - Turnover range string (e.g., '<20L', '1Cr-5Cr')
 * @returns Numeric value in rupees representing the midpoint of the range
 * 
 * @example
 * parseTurnover('<20L') // returns 1000000 (10 lakhs)
 * parseTurnover('1Cr-5Cr') // returns 30000000 (3 crores)
 */
export function parseTurnover(turnoverRange: string): number {
  const range = turnoverRange.trim();
  
  // Handle '<20L' case
  if (range === '<20L') {
    return 1000000; // 10 lakhs (midpoint of 0-20L)
  }
  
  // Handle '>10Cr' case
  if (range === '>10Cr') {
    return 150000000; // 15 crores (assumed midpoint)
  }
  
  // Handle ranges like '20L-40L', '1Cr-5Cr'
  if (range.includes('-')) {
    const [start, end] = range.split('-').map(s => s.trim());
    
    const parseValue = (val: string): number => {
      if (val.endsWith('Cr')) {
        return parseFloat(val) * 10000000;
      } else if (val.endsWith('L')) {
        return parseFloat(val) * 100000;
      }
      return parseFloat(val);
    };
    
    const startValue = parseValue(start);
    const endValue = parseValue(end);
    
    return (startValue + endValue) / 2;
  }
  
  // Handle single values
  if (range.endsWith('Cr')) {
    return parseFloat(range) * 10000000;
  } else if (range.endsWith('L')) {
    return parseFloat(range) * 100000;
  }
  
  return parseFloat(range);
}

/**
 * Converts employee range strings to numeric values
 * Returns the midpoint of the range for calculations
 * 
 * @param employeeRange - Employee range string (e.g., '<10', '20-49', '100+')
 * @returns Numeric value representing the midpoint of the range
 * 
 * @example
 * parseEmployeeCount('<10') // returns 5
 * parseEmployeeCount('20-49') // returns 35
 * parseEmployeeCount('100+') // returns 150
 */
export function parseEmployeeCount(employeeRange: string): number {
  const range = employeeRange.trim();
  
  // Handle '<10' case
  if (range === '<10') {
    return 5; // midpoint of 0-10
  }
  
  // Handle '100+' case
  if (range === '100+') {
    return 150; // assumed midpoint
  }
  
  // Handle ranges like '10-19', '20-49'
  if (range.includes('-')) {
    const [start, end] = range.split('-').map(s => parseInt(s.trim(), 10));
    return Math.floor((start + end) / 2);
  }
  
  // Handle single values
  return parseInt(range, 10);
}

/**
 * Formats numbers as Indian currency with proper lakhs and crores notation
 * Uses Indian numbering system (lakhs, crores)
 * 
 * @param amount - Amount in rupees to format
 * @returns Formatted currency string with ₹ symbol
 * 
 * @example
 * formatCurrency(100000) // returns '₹1,00,000'
 * formatCurrency(5000000) // returns '₹50,00,000'
 * formatCurrency(10000000) // returns '₹1,00,00,000'
 */
export function formatCurrency(amount: number): string {
  // Handle negative amounts
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  // Convert to string and split by decimal point if present
  const parts = absAmount.toString().split('.');
  const integerPart = parts[0];
  
  // Add commas using Indian numbering system (lakhs, crores)
  let formatted = '';
  let count = 0;
  
  // Process from right to left
  for (let i = integerPart.length - 1; i >= 0; i--) {
    if (count === 3 && i > 0) {
      formatted = ',' + formatted;
      count = 0;
    }
    formatted = integerPart[i] + formatted;
    count++;
  }
  
  // Add decimal part if present
  const result = parts.length > 1 ? formatted + '.' + parts[1] : formatted;
  
  return `${isNegative ? '-' : ''}₹${result}`;
}

/**
 * Formats a date as 'DD MMM YYYY' (e.g., '15 Jan 2025')
 * Uses date-fns library for formatting
 * 
 * @param date - Date object to format
 * @returns Formatted date string
 * 
 * @example
 * formatDate(new Date('2025-01-15')) // returns '15 Jan 2025'
 */
export function formatDate(date: Date): string {
  return format(date, 'dd MMM yyyy');
}

/**
 * Calculates the number of days between now and a target date
 * Used for priority calculation in calendar entries
 * 
 * @param date - Target date to calculate days until
 * @returns Number of days (positive if future, negative if past)
 * 
 * @example
 * calculateDaysUntil(new Date('2025-12-31')) // returns days until Dec 31, 2025
 */
export function calculateDaysUntil(date: Date): number {
  return differenceInDays(date, new Date());
}

/**
 * Returns Tailwind CSS color class based on priority level
 * 
 * @param priority - Priority level ('High', 'Medium', 'Low')
 * @returns Tailwind color class string
 * 
 * @example
 * getPriorityColor('High') // returns 'text-red-600 bg-red-50'
 * getPriorityColor('Medium') // returns 'text-yellow-600 bg-yellow-50'
 * getPriorityColor('Low') // returns 'text-green-600 bg-green-50'
 */
export function getPriorityColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'low':
      return 'text-green-600 bg-green-50 border-green-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

/**
 * Calculates the number of months between two dates
 * Used for calendar generation to determine how many months to display
 * 
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Number of months between dates
 * 
 * @example
 * getMonthsBetween(new Date('2025-01-01'), new Date('2025-12-31')) // returns 11
 */
export function getMonthsBetween(startDate: Date, endDate: Date): number {
  return differenceInMonths(endDate, startDate);
}

/**
 * Returns color class for compliance category
 * 
 * @param category - Compliance category ('Tax', 'Labor', 'Statutory', 'Environmental')
 * @returns Tailwind color class string
 * 
 * @example
 * getCategoryColor('Tax') // returns 'text-blue-600 bg-blue-50'
 * getCategoryColor('Labor') // returns 'text-green-600 bg-green-50'
 * getCategoryColor('Statutory') // returns 'text-orange-600 bg-orange-50'
 */
export function getCategoryColor(category: string): string {
  switch (category.toLowerCase()) {
    case 'tax':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'labor':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'statutory':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'environmental':
      return 'text-purple-600 bg-purple-50 border-purple-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

/**
 * Validates that all required fields in a BusinessProfile are present
 * 
 * @param profile - BusinessProfile object to validate
 * @returns true if all required fields are present, false otherwise
 * 
 * @example
 * validateBusinessProfile({ businessType: 'Manufacturing', state: 'Maharashtra', ... }) // returns true
 * validateBusinessProfile({ businessType: 'Manufacturing' }) // returns false (missing fields)
 */
export function validateBusinessProfile(profile: BusinessProfile): boolean {
  return (
    profile.businessType !== undefined &&
    profile.state !== undefined &&
    profile.state.trim() !== '' &&
    profile.turnover !== undefined &&
    profile.annualTurnoverValue !== undefined &&
    profile.employees !== undefined &&
    profile.employeeCount !== undefined &&
    typeof profile.msmeRegistered === 'boolean' &&
    profile.industry !== undefined &&
    profile.industry.trim() !== '' &&
    typeof profile.owesPaymentToMSME === 'boolean'
  );
}

