"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, FileDown, Lock } from "lucide-react";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({ resumeUrl = "/resume.pdf" }: { resumeUrl?: string | null }) {
  const [activeSection, setActiveSection] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ["about", "skills", "projects", "experience", "contact"];
      const scrollPosition = window.scrollY + 180;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-200 ${
        isScrolled
          ? "bg-[#090a0f]/90 backdrop-blur-md border-b border-slate-800/80 py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <Link
            href="/"
            className="text-sm sm:text-base font-semibold text-slate-100 hover:text-white transition-colors focus:outline-none"
            aria-label="Saba Zulfiqar home"
          >
            Saba Zulfiqar
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    isActive
                      ? "text-white bg-slate-800/70"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Action buttons */}
          <div className="hidden md:flex items-center gap-3">
            {resumeUrl && resumeUrl.trim() && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/60 text-slate-300 hover:text-white transition-all"
              >
                <FileDown className="w-3.5 h-3.5 text-slate-400" />
                Resume
              </a>
            )}

            <a
              href="#contact"
              className="inline-flex items-center text-xs font-semibold px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              Contact
            </a>

            <Link
              href="/admin"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
              title="Admin"
              aria-label="Admin Portal"
            >
              <Lock className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0c0e14] border-b border-slate-800 px-4 py-4 mt-2 space-y-2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}

          <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
            {resumeUrl && resumeUrl.trim() && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2 rounded-lg border border-slate-800 text-xs font-medium text-slate-300"
              >
                <FileDown className="w-3.5 h-3.5 text-slate-400" />
                Resume
              </a>
            )}
            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center py-2 rounded-lg bg-blue-600 text-xs font-semibold text-white"
            >
              Contact Me
            </a>
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 py-1 text-xs text-slate-500 hover:text-slate-300"
            >
              <Lock className="w-3 h-3" />
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
