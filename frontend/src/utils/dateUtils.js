// Utility functions for date formatting and manipulation

/**
 * Format a Date object to YYYY-MM-DD string in local timezone
 * @param {Date} date - The date to format
 * @returns {string} - Formatted date string in YYYY-MM-DD format
 */
export const formatDateToYMD = (date) => {
  if (!date) return null;
  
  if (date instanceof Date) {
    // Use local timezone instead of UTC to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  if (typeof date === 'string') {
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  return null;
};

/**
 * Parse a date string and return a Date object
 * @param {string} dateString - Date string in various formats
 * @returns {Date|null} - Parsed Date object or null if invalid
 */
export const parseDate = (dateString) => {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

/**
 * Calculate the number of days between two dates
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {number} - Number of days between the dates
 */
export const calculateDaysBetween = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  
  const diffTime = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Check if a date is in the past
 * @param {Date} date - Date to check
 * @returns {boolean} - True if date is in the past
 */
export const isDateInPast = (date) => {
  if (!date) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  return checkDate < today;
};

/**
 * Format date for display in Vietnamese format
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDateForDisplay = (date) => {
  if (!date) return '';
  
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
