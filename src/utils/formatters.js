/**
 * Formats a numeric value into INR currency format (e.g., ₹70,200.88).
 * Handles negative values and rounds to 2 decimal places by default.
 * 
 * @param {number} value - The numeric value to format
 * @returns {string} Formatted currency string
 */
export const formatINR = (value) => {
  if (value === undefined || value === null || isNaN(value)) {
    return '₹0.00';
  }
  
  // Clean up floating point representation issues (e.g., -0.00)
  const cleanValue = Math.abs(value) < 0.005 ? 0 : value;
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(cleanValue);
};

/**
 * Formats cryptocurrency holding amounts with appropriate decimal precision.
 * Prevents scientific notation issues and hides insignificant decimal tails.
 * 
 * @param {number} value - The crypto holding amount
 * @returns {string} Formatted holding amount
 */
export const formatCryptoAmount = (value) => {
  if (value === undefined || value === null || isNaN(value)) {
    return '0';
  }
  
  // If the value is extremely close to 0 (e.g. under 1e-10), display as 0
  if (Math.abs(value) < 1e-10) {
    return '0';
  }
  
  // If it's a whole number
  if (Number.isInteger(value)) {
    return value.toString();
  }
  
  // Determine suitable decimal places based on size
  let fractionDigits = 2;
  const absVal = Math.abs(value);
  if (absVal < 0.0001) {
    fractionDigits = 8;
  } else if (absVal < 0.01) {
    fractionDigits = 6;
  } else if (absVal < 1) {
    fractionDigits = 4;
  }
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits
  }).format(value);
};

/**
 * Helper to format raw numbers with standard comma separators.
 * 
 * @param {number} value - The number to format
 * @param {number} maxDecimals - Maximum decimal digits
 * @returns {string} Formatted number
 */
export const formatNumber = (value, maxDecimals = 2) => {
  if (value === undefined || value === null || isNaN(value)) {
    return '0';
  }
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals
  }).format(value);
};
