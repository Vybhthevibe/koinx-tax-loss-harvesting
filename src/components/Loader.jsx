import React from 'react';

/**
 * A beautiful, full-page loading spinner to display during data fetching.
 */
export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-12 px-4 text-center">
      {/* Spinning gradient circle */}
      <div className="relative w-16 h-16 mb-4">
        <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin"></div>
      </div>
      <h3 className="text-lg font-semibold text-slate-800 animate-pulse">
        Fetching Portfolio Details
      </h3>
      <p className="text-sm text-slate-500 mt-1 max-w-xs">
        Connecting to mock exchange nodes and retrieving capital gains data...
      </p>
    </div>
  );
}
