"use client";

import React, { useState } from "react";
import { Send, Mail, Phone, Copy, Check, MapPin, Github, Linkedin, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { ProfileData } from "@/types";

interface ContactSectionProps {
  profile: ProfileData;
}

export default function ContactSection({ profile }: ContactSectionProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const cleanPhone = profile.phone.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=Hi%20Saba,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project.`;

  const copyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    toast("Email address copied to clipboard!", "success");
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit message");
      }

      toast("Thank you! Your message has been sent successfully. I will respond within 24 hours.", "success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please reach out directly via email or WhatsApp.";
      toast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasGithub = Boolean(profile.githubUrl && profile.githubUrl !== "[GITHUB_URL]" && profile.githubUrl.trim() !== "");
  const hasLinkedin = Boolean(profile.linkedinUrl && profile.linkedinUrl !== "[LINKEDIN_URL]" && profile.linkedinUrl.trim() !== "");

  return (
    <section id="contact" className="py-20 sm:py-24">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-12">
          <p className="text-xs font-mono uppercase tracking-wider text-blue-400 mb-2">
            Contact
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Get In Touch
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
            Have an open role, freelance project, or question? Send a message or reach out directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Direct channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-xl border border-slate-800 bg-[#12151f] space-y-5">
              <h3 className="text-lg font-semibold text-white">Direct Information</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Available for remote software engineering contracts and full-time US client teams with quick turnaround times.
              </p>

              {/* Direct cards */}
              <div className="space-y-3 pt-1">
                {/* Email Direct */}
                <div className="p-3.5 rounded-lg bg-[#090a0f] border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[11px] text-slate-500 font-mono">Email</p>
                      <a
                        href={`mailto:${profile.email}`}
                        className="text-xs sm:text-sm font-medium text-white hover:text-blue-400 transition-colors truncate block"
                      >
                        {profile.email}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={copyEmail}
                    className="p-1.5 rounded-md bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    title="Copy Email"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* WhatsApp Direct */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-lg bg-[#090a0f] border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500 font-mono">Phone / WhatsApp</p>
                      <p className="text-xs sm:text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">
                        {profile.phone}
                      </p>
                    </div>
                  </div>
                  <span className="p-1.5 rounded-md bg-slate-800 text-slate-400 group-hover:text-emerald-400 transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </a>

                {/* Location Card */}
                <div className="p-3.5 rounded-lg bg-[#090a0f] border border-slate-800 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 font-mono">Location</p>
                    <p className="text-xs sm:text-sm font-medium text-white">
                      {profile.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social links */}
              {(hasGithub || hasLinkedin) && (
                <div className="pt-3 border-t border-slate-800">
                  <p className="text-xs font-mono text-slate-500 mb-2.5">Profiles</p>
                  <div className="flex items-center gap-2.5">
                    {hasGithub && (
                      <a
                        href={profile.githubUrl!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#090a0f] border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                      >
                        <Github className="w-3.5 h-3.5 text-slate-400" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {hasLinkedin && (
                      <a
                        href={profile.linkedinUrl!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#090a0f] border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                      >
                        <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="p-6 rounded-xl border border-slate-800 bg-[#12151f] space-y-4">
              <h3 className="text-lg font-semibold text-white">Send a Message</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-slate-300 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#090a0f] border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-slate-300 mb-1.5">
                    Your Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#090a0f] border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Full Stack Role / Project Inquiry"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#090a0f] border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Message *
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about your project, timeline, or open role..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#090a0f] border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-y"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
