"use client";

import React from "react";

export default function Fallback3D() {
  return (
    <div className="relative w-full h-[280px] sm:h-[340px] flex items-center justify-center">
      {/* Subtle single ambient glow */}
      <div className="absolute w-56 h-56 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

      {/* Outer subtle ring */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-slate-800 flex items-center justify-center">
        <div className="w-36 h-36 rounded-full border border-dashed border-slate-700/60 flex items-center justify-center">
          <div className="w-20 h-20 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center shadow-lg">
            <span className="font-mono text-xs text-blue-400 font-semibold">&lt;/&gt;</span>
          </div>
        </div>
      </div>
    </div>
  );
}
