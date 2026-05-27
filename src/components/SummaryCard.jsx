import React from 'react';
import { formatINR } from '../utils/formatters';

/**
 * SummaryCard displays a breakdown of STCG and LTCG profits, losses, and net gains.
 * Matches the layout in the screenshots (Short-term/Long-term columns, table structure).
 * 
 * @param {Object} props
 * @param {string} props.title - Card title ("Pre Harvesting" or "After Harvesting")
 * @param {Object} props.data - Object containing stcg and ltcg details, netCapitalGains, and realizedCapitalGains
 * @param {boolean} props.isGradient - Whether to use the blue theme
 * @param {number} props.savings - The calculated savings amount (passed to display at the bottom of the After Harvesting card)
 */
export default function SummaryCard({ title, data, isGradient = false, savings = 0 }) {
  if (!data) return null;

  const { stcg, ltcg, netCapitalGains, realizedCapitalGains } = data;

  // Formatting helpers to keep signs clean
  const formatLoss = (val) => {
    // In our calculations, losses are positive values. We prefix with a minus sign.
    return `- ${formatINR(Math.abs(val))}`;
  };

  const formatNet = (val) => {
    // Net can be positive or negative
    if (val < 0) {
      return `- ${formatINR(Math.abs(val))}`;
    }
    return formatINR(val);
  };

  // Card themes
  const cardClass = isGradient
    ? 'bg-[#1d75fc] text-white shadow-sm'
    : 'bg-white text-slate-800 border border-slate-200 shadow-sm';

  const titleColor = isGradient ? 'text-white' : 'text-slate-900';
  const labelColor = isGradient ? 'text-blue-100/90' : 'text-slate-500';
  const dividerClass = isGradient ? 'border-blue-400/40' : 'border-slate-100';
  const textMuted = isGradient ? 'text-blue-100/80' : 'text-slate-400';

  return (
    <div className={`rounded-xl p-6 transition-all duration-200 ${cardClass}`}>
      {/* Title */}
      <h3 className={`text-base font-bold mb-4 ${titleColor}`}>
        {title}
      </h3>

      {/* Grid Table */}
      <table className="w-full text-[13px] border-collapse">
        <thead>
          <tr className={`border-b ${dividerClass} text-[11px] font-semibold uppercase tracking-wider`}>
            <th className="text-left pb-2 font-normal"></th>
            <th className={`text-right pb-2 font-semibold w-[35%] ${textMuted}`}>Short-term</th>
            <th className={`text-right pb-2 font-semibold w-[35%] ${textMuted}`}>Long-term</th>
          </tr>
        </thead>
        <tbody className={`divide-y ${isGradient ? 'divide-blue-400/20' : 'divide-slate-50'}`}>
          {/* Profits */}
          <tr>
            <td className={`py-3.5 text-left font-medium ${labelColor}`}>Profits</td>
            <td className="py-3.5 text-right font-medium">{formatINR(stcg.profits)}</td>
            <td className="py-3.5 text-right font-medium">{formatINR(ltcg.profits)}</td>
          </tr>
          {/* Losses */}
          <tr>
            <td className={`py-3.5 text-left font-medium ${labelColor}`}>Losses</td>
            <td className="py-3.5 text-right font-medium">{formatLoss(stcg.losses)}</td>
            <td className="py-3.5 text-right font-medium">{formatLoss(ltcg.losses)}</td>
          </tr>
          {/* Net Capital Gains */}
          <tr className="border-t font-semibold">
            <td className={`py-4.5 text-left font-semibold ${titleColor}`}>Net Capital Gains</td>
            <td className="py-4.5 text-right font-semibold">{formatNet(stcg.net)}</td>
            <td className="py-4.5 text-right font-semibold">{formatNet(ltcg.net)}</td>
          </tr>
        </tbody>
      </table>

      {/* Divider */}
      <div className={`border-t my-4 ${dividerClass}`}></div>

      {/* Card Footer */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-baseline space-x-2 flex-wrap">
          <span className={`text-[13px] font-medium ${isGradient ? 'text-blue-100' : 'text-slate-700'}`}>
            {isGradient ? 'Effective Capital Gains:' : 'Realised Capital Gains:'}
          </span>
          <span className="text-2xl font-bold tracking-tight">
            {formatNet(realizedCapitalGains)}
          </span>
        </div>

        {/* Embedded Savings banner (only inside After Harvesting card) */}
        {isGradient && savings > 0 && (
          <div className="text-[13px] text-[#fef08a] font-bold mt-2 flex items-center space-x-1.5 animate-fade-in select-none">
            <span>🎉</span>
            <span>You are going to save upto {formatINR(savings)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
