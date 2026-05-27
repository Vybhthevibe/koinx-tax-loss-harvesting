import React, { useState, useMemo } from 'react';
import HoldingRow from './HoldingRow';

/**
 * HoldingsTable renders the list of crypto assets with column headers, checkboxes,
 * sorting, and a "View all" expansion toggle.
 * Matches the layout in the screenshots (header titles, columns, and View All link).
 * 
 * @param {Object} props
 * @param {Array} props.holdings - Array of holdings from the API
 * @param {Set} props.selectedKeys - Set of selected asset keys ("coin-coinName")
 * @param {function} props.onToggleRow - Callback to toggle selection of a single row
 * @param {function} props.onToggleAll - Callback to toggle selection of all currently displayed rows
 */
export default function HoldingsTable({ holdings, selectedKeys, onToggleRow, onToggleAll }) {
  // Sort states: key can be 'stcg' or 'ltcg'; direction can be 'asc' or 'desc'
  const [sortKey, setSortKey] = useState(null); // 'stcg' | 'ltcg' | null
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' | 'desc'
  const [isExpanded, setIsExpanded] = useState(false);

  // Toggle sorting logic
  const handleSort = (key) => {
    if (sortKey === key) {
      if (sortDirection === 'desc') {
        setSortDirection('asc');
      } else {
        setSortKey(null);
        setSortDirection('desc');
      }
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  // Sort and filter the holdings
  const processedHoldings = useMemo(() => {
    if (!holdings) return [];
    
    let result = [...holdings];

    if (sortKey) {
      result.sort((a, b) => {
        const valA = a[sortKey]?.gain || 0;
        const valB = b[sortKey]?.gain || 0;

        if (sortDirection === 'asc') {
          return valA - valB;
        } else {
          return valB - valA;
        }
      });
    }

    return result;
  }, [holdings, sortKey, sortDirection]);

  // Determine displayed rows (4 initially, or all if expanded)
  const displayedHoldings = isExpanded ? processedHoldings : processedHoldings.slice(0, 4);

  // Check if all displayed rows are selected
  const areAllDisplayedSelected = useMemo(() => {
    if (displayedHoldings.length === 0) return false;
    return displayedHoldings.every(h => selectedKeys.has(`${h.coin}-${h.coinName}`));
  }, [displayedHoldings, selectedKeys]);

  // Render sort indicators
  const renderSortIndicator = (key) => {
    if (sortKey !== key) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 ml-1 text-slate-400 inline-block opacity-30 group-hover:opacity-100 transition-opacity">
          <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />
        </svg>
      );
    }
    return sortDirection === 'desc' ? (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 ml-1 text-blue-600 inline-block">
        <path d="M12 5v14M19 12l-7 7-7-7" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 ml-1 text-blue-600 inline-block">
        <path d="m19 12-7-7-7 7M12 19V5" />
      </svg>
    );
  };

  return (
    <div className="w-full flex flex-col space-y-3">
      {/* Title */}
      <h3 className="text-lg font-bold text-slate-900 px-1">
        Holdings
      </h3>

      {/* Table Container Card */}
      <div className="w-full rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto w-full scrollbar-thin">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-semibold tracking-wider text-slate-500">
                {/* Select All Checkbox */}
                <th className="py-4 pl-6 pr-3 text-center w-12 align-middle">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={areAllDisplayedSelected}
                      onChange={() => onToggleAll(displayedHoldings)}
                      className="h-4.5 w-4.5 rounded border-slate-300 text-[#1d75fc] focus:ring-[#1d75fc]/25 cursor-pointer accent-[#1d75fc]"
                    />
                  </div>
                </th>
                
                {/* Headers */}
                <th className="py-4 px-3 align-middle text-slate-650 font-bold">Asset</th>
                
                <th className="py-4 px-3 align-middle text-left font-bold">
                  <div className="flex flex-col">
                    <span>Holdings</span>
                    <span className="text-[9px] text-slate-400 font-normal -mt-0.5 normal-case tracking-normal">Current Market Rate</span>
                  </div>
                </th>

                <th className="py-4 px-3 align-middle text-slate-650 font-bold">Total Current Value</th>
                
                <th 
                  onClick={() => handleSort('stcg')}
                  className="py-4 px-3 align-middle cursor-pointer hover:text-slate-950 transition-colors select-none group font-bold"
                >
                  Short-term {renderSortIndicator('stcg')}
                </th>

                <th 
                  onClick={() => handleSort('ltcg')}
                  className="py-4 px-3 align-middle cursor-pointer hover:text-slate-950 transition-colors select-none group font-bold"
                >
                  Long-term {renderSortIndicator('ltcg')}
                </th>

                <th className="py-4 pl-3 pr-6 align-middle text-slate-650 font-bold">Amount to Sell</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100">
              {displayedHoldings.length > 0 ? (
                displayedHoldings.map((holding) => {
                  const key = `${holding.coin}-${holding.coinName}`;
                  return (
                    <HoldingRow
                      key={key}
                      holding={holding}
                      isSelected={selectedKeys.has(key)}
                      onToggle={() => onToggleRow(key)}
                    />
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-sm">
                    No holdings portfolio available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* View All link at the bottom left */}
        {holdings && holdings.length > 4 && (
          <div className="flex justify-start border-t border-slate-100 px-6 py-3.5 bg-white">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-semibold text-[#1d75fc] hover:underline hover:text-blue-700 transition focus:outline-none"
            >
              {isExpanded ? 'View less' : 'View all'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
