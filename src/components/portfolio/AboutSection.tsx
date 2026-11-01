"use client";

import React from "react";
import { GraduationCap, Briefcase, CheckCircle2, MapPin } from "lucide-react";
import { ProfileData } from "@/types";

interface AboutSectionProps {
  profile: ProfileData;
}

export default function AboutSection({ profile }: AboutSectionProps) {
  return (
    <section id="about" className="py-20 sm:py-24 border-t border-slate-800/60">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-12">
          <p className="text-xs font-mono uppercase tracking-wider text-blue-400 mb-2">
            About Me
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Background &amp; Focus
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
            I am a full stack developer who builds reliable web applications from database architecture to frontend interfaces.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="p-6 rounded-xl border border-slate-800 bg-[#12151f] flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{profile.name}</h3>
                  <p className="text-xs font-mono text-blue-400 mt-0.5">{profile.title}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{profile.location}</span>
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {profile.bio}
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <span>On-time milestone delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <span>TypeScript, React, Node.js &amp; PostgreSQL</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <span>Clear, proactive team communication</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
                <a
                  href="#contact"
                  className="inline-flex items-center text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Get in touch for roles &rarr;
                </a>
                {profile.resumeUrl && profile.resumeUrl.trim() && (
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                  >
                    Resume &rarr;
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Experience, Education, and Stats */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            {/* Experience & Education cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Experience */}
              <div className="p-6 rounded-xl border border-slate-800 bg-[#12151f] space-y-2">
                <div className="flex items-center justify-between">
                  <Briefcase className="w-4 h-4 text-blue-400" />
                  <span className="text-[11px] font-mono text-slate-400">2025 - 2026</span>
                </div>
                <h4 className="text-sm font-bold text-white pt-1">Full Stack Developer</h4>
                <p className="text-xs text-slate-400">Orzeh Technologies</p>
                <p className="text-xs text-slate-400 leading-relaxed pt-1">
                  1 year building full stack features, responsive UI modules, and REST APIs.
                </p>
              </div>

              {/* Education */}
              <div className="p-6 rounded-xl border border-slate-800 bg-[#12151f] space-y-2">
                <div className="flex items-center justify-between">
                  <GraduationCap className="w-4 h-4 text-blue-400" />
                  <span className="text-[11px] font-mono text-slate-400">2020 - 2024</span>
                </div>
                <h4 className="text-sm font-bold text-white pt-1">BS Computer Science</h4>
                <p className="text-xs text-slate-400">Allama Iqbal Open University</p>
                <p className="text-xs text-slate-400 leading-relaxed pt-1">
                  Foundation in data structures, algorithms, system design, and database systems.
                </p>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="p-6 rounded-xl border border-slate-800 bg-[#12151f]">
              <div className="grid grid-cols-3 gap-4 text-left divide-x divide-slate-800/80">
                <div className="pr-3">
                  <p className="text-xl sm:text-2xl font-bold text-white font-mono whitespace-nowrap">{profile.yearsExperience}+ year</p>
                  <p className="text-xs text-slate-400 mt-1">Experience</p>
                </div>
                <div className="px-3">
                  <p className="text-2xl font-bold text-white font-mono">{profile.projectsCompleted}+</p>
                  <p className="text-xs text-slate-400 mt-1">Projects Built</p>
                </div>
                <div className="pl-3">
                  <p className="text-2xl font-bold text-white font-mono">100%</p>
                  <p className="text-xs text-slate-400 mt-1">On-Time</p>
                </div>
              </div>
            </div>

            {/* Collaboration note */}
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-300">
                <p className="font-semibold text-white">Need a developer for your next sprint?</p>
                <p className="text-slate-400 mt-0.5">Available for full-time remote roles or freelance contracts.</p>
              </div>
              <a
                href="#contact"
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold whitespace-nowrap transition-colors"
              >
                Hire Me
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
