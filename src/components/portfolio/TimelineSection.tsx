"use client";

import React from "react";
import { TimelineData } from "@/types";
import { Briefcase, GraduationCap, Calendar, Building } from "lucide-react";

interface TimelineSectionProps {
  timeline: TimelineData[];
}

export default function TimelineSection({ timeline }: TimelineSectionProps) {
  return (
    <section id="experience" className="py-20 sm:py-24">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-12">
          <p className="text-xs font-mono uppercase tracking-wider text-blue-400 mb-2">
            Experience &amp; Education
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Work History &amp; Education
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
            Professional experience and academic background in computer science.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative pl-6 sm:pl-8 border-l border-slate-800 ml-4 sm:ml-6 space-y-8">
          {timeline.map((item) => {
            const isExperience = item.type === "EXPERIENCE";
            const Icon = isExperience ? Briefcase : GraduationCap;
            const lines = item.description
              ? item.description
                  .split("\n")
                  .map((l) => l.trim().replace(/^[•\-\*]\s*/, ""))
                  .filter(Boolean)
              : [];

            return (
              <div key={item.id} className="relative">
                {/* Timeline node icon */}
                <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-8 h-8 rounded-lg flex items-center justify-center border border-slate-700 bg-[#12151f] text-blue-400">
                  <Icon className="w-4 h-4" />
                </div>

                {/* Timeline Card */}
                <div className="p-6 rounded-xl border border-slate-800 bg-[#12151f]">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                          {item.type}
                        </span>
                        {item.current && (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Current Role
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-white">
                        {item.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{item.period}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-4">
                    <Building className="w-3.5 h-3.5 text-blue-400" />
                    <span>{item.organization}</span>
                  </div>

                  {lines.length > 1 ? (
                    <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed list-disc list-outside ml-4">
                      {lines.map((line, idx) => (
                        <li key={idx}>{line}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
