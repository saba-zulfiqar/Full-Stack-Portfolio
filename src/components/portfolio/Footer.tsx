"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUp, Github, Linkedin } from "lucide-react";
import { ProfileData } from "@/types";

interface FooterProps {
  profile?: ProfileData;
}

export default function Footer({ profile }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="py-12 border-t border-slate-800 bg-[#090a0f] text-slate-400 relative z-10">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Brand */}
          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm font-semibold text-white">Saba Zulfiqar</p>
              <div className="flex flex-col text-xs text-slate-500">
                <span>Full Stack Developer</span>
                <span>{profile?.location || "Lahore, Pakistan"}</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          {(profile?.githubUrl || profile?.linkedinUrl) && (
            <div className="flex items-center gap-2">
              {profile?.githubUrl && profile.githubUrl.trim() && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="p-2 rounded-lg bg-[#12151f] border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profile?.linkedinUrl && profile.linkedinUrl.trim() && (
                <a
                  href={profile.linkedinUrl}
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

          {/* Quick Links */}
          <div className="flex items-center gap-6 text-xs">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#skills" className="hover:text-white transition-colors">Skills</a>
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
            <a href="#experience" className="hover:text-white transition-colors">Experience</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            <Link href="/admin" className="text-slate-500 hover:text-slate-300 transition-colors">
              Admin
            </Link>
          </div>

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#12151f] border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-blue-400" />
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center">
          <p>&copy; {new Date().getFullYear()} Saba Zulfiqar All Right Reserved</p>
          <p>Full stack web applications shipped on time.</p>
        </div>
      </div>
    </footer>
  );
}
