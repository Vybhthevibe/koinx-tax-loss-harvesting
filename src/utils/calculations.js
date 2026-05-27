/**
 * Calculate pre-harvesting capital gains parameters from API response values.
 * 
 * Formula:
 * Net Gain = profits - losses
 * Realized Capital Gains = netSTCG + netLTCG
 * 
 * @param {Object} capitalGains - Capital gains object from API
 * @returns {Object} pre-harvesting calculations
 */
export const calculatePreHarvesting = (capitalGains) => {
  if (!capitalGains) return {
    stcg: { profits: 0, losses: 0, net: 0 },
    ltcg: { profits: 0, losses: 0, net: 0 },
    netCapitalGains: 0,
    realizedCapitalGains: 0
  };

  const stcgProfits = capitalGains.stcg.profits;
  const stcgLosses = capitalGains.stcg.losses;
  const ltcgProfits = capitalGains.ltcg.profits;
  const ltcgLosses = capitalGains.ltcg.losses;

  const netSTCG = stcgProfits - stcgLosses;
  const netLTCG = ltcgProfits - ltcgLosses;
  
  const netCapitalGains = netSTCG + netLTCG;
  const realizedCapitalGains = netSTCG + netLTCG;

  return {
    stcg: {
      profits: stcgProfits,
      losses: stcgLosses,
      net: netSTCG
    },
    ltcg: {
      profits: ltcgProfits,
      losses: ltcgLosses,
      net: netLTCG
    },
    netCapitalGains,
    realizedCapitalGains
  };
};

/**
 * Calculate after-harvesting capital gains parameters based on selected holdings.
 * 
 * Rules:
 * - If gain > 0: add to profits
 * - If gain < 0: add ABS(value) to losses
 * - Apply separately for short term and long term
 * 
 * @param {Object} preGains - The output of calculatePreHarvesting
 * @param {Array} selectedHoldings - Array of selected holding objects
 * @returns {Object} after-harvesting calculations
 */
export const calculateAfterHarvesting = (preGains, selectedHoldings) => {
  if (!preGains) return null;

  let postSTCGProfits = preGains.stcg.profits;
  let postSTCGLosses = preGains.stcg.losses;
  let postLTCGProfits = preGains.ltcg.profits;
  let postLTCGLosses = preGains.ltcg.losses;

  selectedHoldings.forEach(holding => {
    // Short Term Capital Gains (STCG)
    const stcgGain = holding.stcg?.gain || 0;
    if (stcgGain > 0) {
      postSTCGProfits += stcgGain;
    } else if (stcgGain < 0) {
      postSTCGLosses += Math.abs(stcgGain);
    }

    // Long Term Capital Gains (LTCG)
    const ltcgGain = holding.ltcg?.gain || 0;
    if (ltcgGain > 0) {
      postLTCGProfits += ltcgGain;
    } else if (ltcgGain < 0) {
      postLTCGLosses += Math.abs(ltcgGain);
    }
  });

  const postNetSTCG = postSTCGProfits - postSTCGLosses;
  const postNetLTCG = postLTCGProfits - postLTCGLosses;
  const postHarvestingCapitalGain = postNetSTCG + postNetLTCG;

  return {
    stcg: {
      profits: postSTCGProfits,
      losses: postSTCGLosses,
      net: postNetSTCG
    },
    ltcg: {
      profits: postLTCGProfits,
      losses: postLTCGLosses,
      net: postNetLTCG
    },
    netCapitalGains: postHarvestingCapitalGain,
    realizedCapitalGains: postHarvestingCapitalGain // The effective capital gains after harvesting
  };
};

/**
 * Calculates the tax savings.
 * 
 * Formula:
 * Savings = preHarvestingCapitalGain - postHarvestingCapitalGain (Only if pre > post)
 * 
 * @param {number} preGainsTotal - Pre-harvesting net capital gains
 * @param {number} postGainsTotal - Post-harvesting net capital gains
 * @returns {number} savings amount
 */
export const calculateSavings = (preGainsTotal, postGainsTotal) => {
  if (preGainsTotal > postGainsTotal) {
    return preGainsTotal - postGainsTotal;
  }
  return 0;
};
