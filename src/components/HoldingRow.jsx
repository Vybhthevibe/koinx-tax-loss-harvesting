import React from 'react';
import { formatINR, formatCryptoAmount, formatNumber } from '../utils/formatters';

/**
 * Renders a single row representing an asset holding in the table.
 * Displays only the precise number in the hover tooltip as requested.
 */
export default function HoldingRow({ holding, isSelected, onToggle }) {
  const { coin, coinName, logo, currentPrice, totalHolding, averageBuyPrice, stcg, ltcg } = holding;

  // Selected row styling
  const rowClass = isSelected
    ? 'bg-[#f4f8ff] hover:bg-[#ebf3ff]'
    : 'hover:bg-slate-50/70';

  // Gain/Loss display helper
  const renderGain = (gain) => {
    const formatted = formatINR(Math.abs(gain));
    if (gain > 0) {
      return <span className="text-[#10b981] font-semibold">+{formatted}</span>;
    }
    if (gain < 0) {
      return <span className="text-[#ef4444] font-semibold">-{formatted}</span>;
    }
    return <span className="text-slate-400 font-semibold">{formatted}</span>;
  };

  const formatGainRaw = (gain) => {
    if (gain > 0) return `+₹${formatNumber(gain, 18)}`;
    if (gain < 0) return `-₹${formatNumber(Math.abs(gain), 18)}`;
    return `₹${formatNumber(gain, 18)}`;
  };

  const totalCurrentValue = totalHolding * currentPrice;

  return (
    <tr className={`border-b border-slate-100 transition-colors text-slate-800 ${rowClass}`}>
      {/* Checkbox */}
      <td className="py-4.5 pl-6 pr-3 align-middle w-12">
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggle}
            className="h-4.5 w-4.5 rounded border-slate-300 text-[#1d75fc] focus:ring-[#1d75fc]/25 cursor-pointer accent-[#1d75fc]"
          />
        </div>
      </td>

      {/* Asset name & logo */}
      <td className="py-4 px-3 align-middle min-w-[180px]">
        <div className="flex items-center space-x-3">
          <img
            src={logo}
            alt={`${coinName} logo`}
            onError={(e) => {
              e.target.src = 'https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg';
            }}
            className="h-7 w-7 rounded-full bg-slate-100 object-contain p-0.5"
          />
          <div className="flex flex-col">
            <span className="text-[13.5px] font-bold text-slate-900 leading-tight">
              {coinName.includes('Bridged') || coinName.includes('Polygon') ? coinName.split(' ')[0] + ' ' + coin : coinName}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {coin}
            </span>
          </div>
        </div>
      </td>

      {/* Holdings & Avg Buy Price with Hover Tooltips */}
      <td className="py-4 px-3 align-middle text-left">
        <div className="flex flex-col space-y-0.5">
          {/* Holdings Amount Tooltip */}
          <div className="relative group cursor-help inline-block">
            <span className="text-[13.5px] font-semibold text-slate-800">
              {formatCryptoAmount(totalHolding)} {coin}
            </span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-white text-slate-800 text-[11px] font-semibold py-1.5 px-3 rounded-lg shadow-lg border border-slate-200 z-50 whitespace-nowrap">
              {formatNumber(totalHolding, 18)} {coin}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-white border-r border-b border-slate-200 rotate-45"></div>
            </div>
          </div>

          {/* Average Buy Price Tooltip */}
          <div className="relative group cursor-help inline-block">
            <span className="text-[11px] text-slate-400">
              {formatINR(averageBuyPrice)}/{coin}
            </span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-white text-slate-800 text-[11px] font-semibold py-1.5 px-3 rounded-lg shadow-lg border border-slate-200 z-50 whitespace-nowrap">
              ₹{formatNumber(averageBuyPrice, 18)}/{coin}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-white border-r border-b border-slate-200 rotate-45"></div>
            </div>
          </div>
        </div>
      </td>

      {/* Total Current Value with Hover Tooltip */}
      <td className="py-4 px-3 align-middle text-left text-[13.5px]">
        <div className="relative group cursor-help inline-block font-semibold text-slate-800">
          <span>{formatINR(totalCurrentValue)}</span>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-white text-slate-800 text-[11px] font-semibold py-1.5 px-3 rounded-lg shadow-lg border border-slate-200 z-50 whitespace-nowrap">
            ₹{formatNumber(totalCurrentValue, 18)}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-white border-r border-b border-slate-200 rotate-45"></div>
          </div>
        </div>
      </td>

      {/* Short-term Gain with Hover Tooltips */}
      <td className="py-4 px-3 align-middle text-left">
        <div className="flex flex-col space-y-0.5">
          {/* STCG Gain Tooltip */}
          <div className="relative group cursor-help inline-block">
            <span className="text-[13.5px]">
              {renderGain(stcg.gain)}
            </span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-white text-slate-800 text-[11px] font-semibold py-1.5 px-3 rounded-lg shadow-lg border border-slate-200 z-50 whitespace-nowrap">
              {formatGainRaw(stcg.gain)}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-white border-r border-b border-slate-200 rotate-45"></div>
            </div>
          </div>

          {/* STCG Balance Tooltip */}
          <div className="relative group cursor-help inline-block">
            <span className="text-[11px] text-slate-400">
              {formatCryptoAmount(stcg.balance)} {coin}
            </span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-white text-slate-800 text-[11px] font-semibold py-1.5 px-3 rounded-lg shadow-lg border border-slate-200 z-50 whitespace-nowrap">
              {formatNumber(stcg.balance, 18)} {coin}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-white border-r border-b border-slate-200 rotate-45"></div>
            </div>
          </div>
        </div>
      </td>

      {/* Long-term Gain with Hover Tooltips */}
      <td className="py-4 px-3 align-middle text-left">
        <div className="flex flex-col space-y-0.5">
          {/* LTCG Gain Tooltip */}
          <div className="relative group cursor-help inline-block">
            <span className="text-[13.5px]">
              {renderGain(ltcg.gain)}
            </span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-white text-slate-800 text-[11px] font-semibold py-1.5 px-3 rounded-lg shadow-lg border border-slate-200 z-50 whitespace-nowrap">
              {formatGainRaw(ltcg.gain)}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-white border-r border-b border-slate-200 rotate-45"></div>
            </div>
          </div>

          {/* LTCG Balance Tooltip */}
          <div className="relative group cursor-help inline-block">
            <span className="text-[11px] text-slate-400">
              {formatCryptoAmount(ltcg.balance)} {coin}
            </span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-white text-slate-800 text-[11px] font-semibold py-1.5 px-3 rounded-lg shadow-lg border border-slate-200 z-50 whitespace-nowrap">
              {formatNumber(ltcg.balance, 18)} {coin}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-white border-r border-b border-slate-200 rotate-45"></div>
            </div>
          </div>
        </div>
      </td>

      {/* Amount to Sell with Hover Tooltip */}
      <td className="py-4 pl-3 pr-6 align-middle text-left text-[13.5px] font-medium">
        {isSelected ? (
          <div className="relative group cursor-help inline-block text-slate-800">
            <span>{formatCryptoAmount(totalHolding)} {coin}</span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-white text-slate-800 text-[11px] font-semibold py-1.5 px-3 rounded-lg shadow-lg border border-slate-200 z-50 whitespace-nowrap">
              {formatNumber(totalHolding, 18)} {coin}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-white border-r border-b border-slate-200 rotate-45"></div>
            </div>
          </div>
        ) : (
          <span className="text-slate-400 font-normal">-</span>
        )}
      </td>
    </tr>
  );
}
