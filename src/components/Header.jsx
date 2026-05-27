import React from 'react';

/**
 * Header component matching the KoinX branding layout in the screenshots.
 */
export default function Header() {
  return (
    <header className="w-full bg-white border-b border-slate-200 py-4 px-6 md:px-12 flex items-center justify-between">
      {/* Brand Logo */}
      <div className="flex items-center space-x-1.5 select-none">
        <span className="text-2xl font-bold tracking-tight text-[#0f294a]">
          Koin
        </span>
        <span className="text-2xl font-extrabold text-[#f6931a] relative">
          X
          <span className="absolute -top-1 -right-2 text-[8px] font-normal text-slate-400">®</span>
        </span>
      </div>

    </header>
  );
}
