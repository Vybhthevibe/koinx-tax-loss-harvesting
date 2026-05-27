import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import DisclaimerAccordion from './components/DisclaimerAccordion';
import SummaryCard from './components/SummaryCard';
import HoldingsTable from './components/HoldingsTable';
import Loader from './components/Loader';
import { fetchHoldings, fetchCapitalGains } from './services/api';
import { calculatePreHarvesting, calculateAfterHarvesting, calculateSavings } from './utils/calculations';

export default function App() {
  // Core states
  const [holdings, setHoldings] = useState([]);
  const [rawCapitalGains, setRawCapitalGains] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState(new Set()); // Set of "coin-coinName" keys
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Tooltip visibility state
  const [showTooltip, setShowTooltip] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    let isMounted = true;
    
    setLoading(true);
    Promise.all([fetchHoldings(), fetchCapitalGains()])
      .then(([holdingsRes, gainsRes]) => {
        if (isMounted) {
          setHoldings(holdingsRes);
          setRawCapitalGains(gainsRes.capitalGains);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Error fetching data:', err);
          setError('Failed to fetch tax and portfolio data. Please reload.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 1. Calculate Pre-Harvesting values
  const preHarvestingData = useMemo(() => {
    return calculatePreHarvesting(rawCapitalGains);
  }, [rawCapitalGains]);

  // 2. Filter selected holdings based on keys
  const selectedHoldings = useMemo(() => {
    return holdings.filter(h => selectedKeys.has(`${h.coin}-${h.coinName}`));
  }, [holdings, selectedKeys]);

  // 3. Calculate After-Harvesting values
  const afterHarvestingData = useMemo(() => {
    return calculateAfterHarvesting(preHarvestingData, selectedHoldings);
  }, [preHarvestingData, selectedHoldings]);

  // 4. Calculate savings
  const savingsAmount = useMemo(() => {
    if (!preHarvestingData || !afterHarvestingData) return 0;
    return calculateSavings(preHarvestingData.netCapitalGains, afterHarvestingData.netCapitalGains);
  }, [preHarvestingData, afterHarvestingData]);

  // Selection handler: single row checkbox
  const handleToggleRow = (key) => {
    setSelectedKeys((prevKeys) => {
      const nextKeys = new Set(prevKeys);
      if (nextKeys.has(key)) {
        nextKeys.delete(key);
      } else {
        nextKeys.add(key);
      }
      return nextKeys;
    });
  };

  // Selection handler: Select All displayed rows
  const handleToggleAll = (displayedRows) => {
    setSelectedKeys((prevKeys) => {
      const nextKeys = new Set(prevKeys);
      
      const areAllSelected = displayedRows.every(h => {
        const key = `${h.coin}-${h.coinName}`;
        return nextKeys.has(key);
      });

      if (areAllSelected) {
        displayedRows.forEach(h => {
          const key = `${h.coin}-${h.coinName}`;
          nextKeys.delete(key);
        });
      } else {
        displayedRows.forEach(h => {
          const key = `${h.coin}-${h.coinName}`;
          nextKeys.add(key);
        });
      }
      
      return nextKeys;
    });
  };

  // Quick action: Select only holdings that have negative gains (ideal for harvesting losses)
  const handleSelectLosses = () => {
    const lossKeys = new Set();
    holdings.forEach(h => {
      const stcgGain = h.stcg?.gain || 0;
      const ltcgGain = h.ltcg?.gain || 0;
      if (stcgGain < 0 || ltcgGain < 0) {
        lossKeys.add(`${h.coin}-${h.coinName}`);
      }
    });
    setSelectedKeys(lossKeys);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f7fa] text-slate-900">
      {/* Brand Header */}
      <Header />

      {/* Main Content Layout */}
      <main className="flex-1 mx-auto max-w-[1060px] w-full px-6 py-6 space-y-6">
        
        {/* Title and "How it works?" with Tooltip */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-2 relative">
            <h2 className="text-[22px] font-bold text-slate-800">
              Tax Harvesting
            </h2>
            <div className="relative">
              <button 
                onClick={() => setShowTooltip(!showTooltip)}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="text-[#1d75fc] text-xs font-semibold hover:underline focus:outline-none"
              >
                How it works?
              </button>
              {showTooltip && (
                <div className="absolute top-7 left-0 bg-[#0b1329] text-white p-3.5 rounded-lg shadow-xl text-[11px] w-[260px] z-50 leading-relaxed border border-slate-800 animate-fade-in">
                  <p className="text-slate-200">
                    Lorem ipsum dolor sit amet, consectetur. Euismod id posuere nibh semper mattis scelerisque tellus. Vel mattis diam duis morbi tellus dui consectetur. <span className="underline cursor-pointer text-[#3b82f6] font-medium">Know More</span>
                  </p>
                  {/* Tooltip caret pointing up */}
                  <div className="absolute -top-2 left-6 w-0 h-0 border-4 border-transparent border-b-[#0b1329]"></div>
                </div>
              )}
            </div>
          </div>

          {/* Minimal Quick Actions inline */}
          {!loading && !error && holdings.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={handleSelectLosses}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1d75fc] bg-blue-50 border border-blue-100 rounded-lg px-3 py-1.5 hover:bg-blue-100/70 transition"
              >
                Auto-Select Losses
              </button>
              {selectedKeys.size > 0 && (
                <button
                  onClick={() => setSelectedKeys(new Set())}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100/80 rounded-lg px-3 py-1.5 hover:bg-slate-200 transition"
                >
                  Clear Selection
                </button>
              )}
            </div>
          )}
        </div>

        {/* Global Loading / Error State Renderers */}
        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm py-12">
            <Loader />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-800 shadow-sm">
            <h3 className="text-base font-bold text-rose-900">An Error Occurred</h3>
            <p className="text-sm mt-1">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Notes & Disclaimers Accordion */}
            <DisclaimerAccordion />

            {/* Summary Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SummaryCard 
                title="Pre Harvesting" 
                data={preHarvestingData} 
                isGradient={false} 
              />
              <SummaryCard 
                title="After Harvesting" 
                data={afterHarvestingData} 
                isGradient={true}
                savings={savingsAmount}
              />
            </div>

            {/* Holdings Table */}
            <HoldingsTable
              holdings={holdings}
              selectedKeys={selectedKeys}
              onToggleRow={handleToggleRow}
              onToggleAll={handleToggleAll}
            />
          </>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="py-8 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} KoinX. All rights reserved.
      </footer>
    </div>
  );
}
