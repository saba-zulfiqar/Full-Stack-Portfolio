"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ArrowRight, FileDown, MapPin, Github, Linkedin } from "lucide-react";
import Fallback3D from "@/components/3d/Fallback3D";

const HeroScene = dynamic(() => import("@/components/3d/HeroScene"), {
  ssr: false,
  loading: () => <Fallback3D />,
});

const ROLES = [
  "Full Stack Developer",
  "React & Next.js",
  "Node.js & PostgreSQL",
  "TypeScript Specialist",
];

interface HeroProps {
  name?: string;
  title?: string;
  location?: string;
  availability?: string;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  resumeUrl?: string | null;
}

export default function HeroSection({
  name = "Saba Zulfiqar",
  location = "Lahore, Pakistan",
  availability = "Open to remote, hybrid, or onsite roles",
  githubUrl = null,
  linkedinUrl = "https://www.linkedin.com/in/saba-zulfiqar-015059356/",
  resumeUrl = "/resume.pdf",
}: HeroProps) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMobileOrReducedMotion, setIsMobileOrReducedMotion] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;
    if (reducedMotion || isMobile) {
      setIsMobileOrReducedMotion(true);
    }
  }, []);

  useEffect(() => {
    const currentRole = ROLES[roleIndex];
    const typingSpeed = isDeleting ? 35 : 70;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setText(currentRole.substring(0, text.length + 1));
        if (text.length + 1 === currentRole.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setText(currentRole.substring(0, text.length - 1));
        if (text.length === 0) {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % ROLES.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, roleIndex]);

  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-20 overflow-hidden">
      {/* Single subtle ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[520px] h-[320px] bg-blue-600/[0.08] blur-[120px] pointer-events-none" />

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            {/* Location only */}
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{location}</span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Hi, I&apos;m {name}.
            </h1>

            {/* Role typing line */}
            <div className="h-8 flex items-center justify-center lg:justify-start">
              <p className="text-lg sm:text-xl font-mono text-slate-300 flex items-center">
                <span className="text-blue-400 mr-2">&gt;</span>
                <span>{text}</span>
                <span className="inline-block w-2 h-5 bg-blue-500 ml-1 animate-pulse" />
              </p>
            </div>

            {/* Direct personal copy */}
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              I build web apps end to end, from the database to the UI, and I ship on time.
            </p>

            {/* Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <a
                href="#projects"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors"
              >
                <span>View Projects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              {resumeUrl && resumeUrl.trim() && (
                <>
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-800 bg-[#12151f] hover:bg-slate-800/80 text-slate-200 font-medium text-xs transition-colors"
                  >
                    <FileDown className="w-3.5 h-3.5 text-slate-400" />
                    <span>Resume</span>
                  </a>
                  <a
                    href={resumeUrl}
                    download="Saba_Zulfiqar_Resume.pdf"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white font-medium text-xs transition-colors"
                  >
                    <FileDown className="w-3.5 h-3.5 text-slate-400" />
                    <span>Download Resume</span>
                  </a>
                </>
              )}

              <a
                href="#contact"
                className="inline-flex items-center px-4 py-2.5 rounded-lg border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white font-medium text-xs transition-colors"
              >
                <span>Contact Me</span>
              </a>
            </div>

            {/* Social Links */}
            {(githubUrl || linkedinUrl) && (
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-2">
                {githubUrl && githubUrl.trim() && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="p-2 rounded-lg bg-[#12151f] border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {linkedinUrl && linkedinUrl.trim() && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="p-2 rounded-lg bg-[#12151f] border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}

            {/* Stat Row */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-md mx-auto lg:mx-0">
              <div>
                <p className="text-xl font-bold text-white font-mono">1 year</p>
                <p className="text-xs text-slate-400 mt-0.5">Professional exp.</p>
              </div>
              <div>
                <p className="text-xl font-bold text-white font-mono">15+</p>
                <p className="text-xs text-slate-400 mt-0.5">Projects shipped</p>
              </div>
              <div>
                <p className="text-xl font-bold text-white font-mono">100%</p>
                <p className="text-xs text-slate-400 mt-0.5">On-time delivery</p>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Scene */}
          <div className="lg:col-span-5 flex items-center justify-center">
            {isMobileOrReducedMotion ? <Fallback3D /> : <HeroScene />}
          </div>
        </div>
      </div>
    </section>
  );
}
