import { holdingsData } from '../data/holdings';
import { capitalGainsData } from '../data/capitalGains';

/**
 * Fetch holdings portfolio with a simulated network latency of 700ms.
 * @returns {Promise<Array>} holdings data
 */
export const fetchHoldings = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(holdingsData);
    }, 700);
  });
};

/**
 * Fetch capital gains data with a simulated network latency of 700ms.
 * @returns {Promise<Object>} capital gains data
 */
export const fetchCapitalGains = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(capitalGainsData);
    }, 700);
  });
};
