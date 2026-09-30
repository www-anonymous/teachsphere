import React from 'react';

export const BrandLogo = () => (
  <div className="flex items-center gap-2.5">
    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
      T
    </div>
    <div className="flex flex-col">
      <span className="text-lg font-black tracking-tight text-slate-900 leading-none">
        TeachSphere
      </span>
      <span className="text-[10px] font-medium tracking-wide text-blue-600">
        Learn Beyond Boundaries
      </span>
    </div>
  </div>
);