import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with proper precedence
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency in INR
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date in readable format
 */
export function formatDate(date) {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date) {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now - then) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(date);
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Truncate text with ellipsis
 */
export function truncate(str, length = 100) {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

/**
 * Generate initials from name
 */
export function getInitials(name) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Calculate platform commission
 */
export function calculateCommission(amount, rate = 0.15) {
  return amount * rate;
}

/**
 * Calculate creator payout (after commission)
 */
export function calculatePayout(amount, rate = 0.15) {
  return amount * (1 - rate);
}

/**
 * Validate file type
 */
export function isValidFileType(file, allowedTypes) {
  return allowedTypes.includes(file.type);
}

/**
 * Validate file size
 */
export function isValidFileSize(file, maxSizeInMB) {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
}
