"use client";

import React from "react";
import { SkillData } from "@/types";

const CATEGORIES: Array<{
  id: SkillData["category"];
  title: string;
}> = [
  { id: "Frontend", title: "Frontend" },
  { id: "Backend", title: "Backend" },
  { id: "Databases", title: "Databases" },
  { id: "DevOps and Tools", title: "DevOps & Cloud" },
  { id: "Testing", title: "Testing & QA" },
  { id: "Fundamentals", title: "Core Fundamentals" },
];

interface SkillsSectionProps {
  skills: SkillData[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <section id="skills" className="py-20 sm:py-24 border-t border-slate-800/60">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-12">
          <p className="text-xs font-mono uppercase tracking-wider text-blue-400 mb-2">
            Skills
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Technical Stack
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
            Technologies and tools I use to build and maintain full stack web applications.
          </p>
        </div>

        {/* Clean Categorized Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((cat) => {
            const categorySkills = skills.filter((s) => s.category === cat.id);
            if (categorySkills.length === 0) return null;

            return (
              <div
                key={cat.id}
                className="p-6 rounded-xl border border-slate-800 bg-[#12151f] space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <h3 className="text-sm font-semibold text-white font-mono">
                    {cat.title}
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">
                    {categorySkills.length}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {categorySkills.map((skill) => (
                    <span
                      key={skill.id || skill.name}
                      className="px-2.5 py-1 text-xs font-mono rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
