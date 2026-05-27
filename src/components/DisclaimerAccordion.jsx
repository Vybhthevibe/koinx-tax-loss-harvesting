import React, { useState } from 'react';

/**
 * Collapsible accordion matching the design in the screenshots.
 * Light blue theme containing notes and disclaimers.
 */
export default function DisclaimerAccordion() {
  const [isOpen, setIsOpen] = useState(true); // Open by default as in the screenshot

  return (
    <div className="w-full rounded-lg border border-blue-200 bg-[#eef5fc] overflow-hidden transition-all duration-200">
      {/* Accordion Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-5 py-3 text-left font-medium text-[#1e293b]"
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-2 text-[#0f172a]">
          {/* Info icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4.5 w-4.5 text-[#3b82f6]"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span className="text-sm font-semibold text-slate-800">
            Important Notes & Disclaimers
          </span>
        </div>

        {/* Arrow Toggle Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-4 w-4 text-[#64748b] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Collapsible Content */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="px-5 pb-4 pt-1 text-[12.5px] text-[#334155] bg-[#eef5fc]">
          <ul className="list-disc pl-5 space-y-2 leading-relaxed">
            <li>
              Tax-loss harvesting is currently not allowed under Indian tax regulations. Please consult your tax advisor before making any decisions.
            </li>
            <li>
              Tax harvesting does not apply to derivatives or futures. These are handled separately as business income under tax rules.
            </li>
            <li>
              Price and market value data is fetched from Coingecko, not from individual exchanges. As a result, values may slightly differ from the ones on your exchange.
            </li>
            <li>
              Some countries do not have a short-term / long-term bifurcation. For now, we are calculating everything as long-term.
            </li>
            <li>
              Only realized losses are considered for harvesting. Unrealized losses in held assets are not counted.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
