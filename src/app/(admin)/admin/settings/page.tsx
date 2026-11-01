"use client";

import React, { useState, useEffect } from "react";
import { Save, User, Mail, Phone, MapPin, Github, Linkedin, FileText, CheckCircle2, Globe, Upload } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { ProfileData } from "@/types";

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResumeUploading, setIsResumeUploading] = useState(false);

  const [formData, setFormData] = useState<ProfileData>({
    name: "Saba Zulfiqar",
    title: "Full Stack Developer",
    bio: "",
    email: "sabazulfiqar926@gmail.com",
    phone: "+92 307 5834975",
    location: "Lahore, Pakistan",
    availability: "Open to remote, hybrid, or onsite roles",
    githubUrl: "",
    linkedinUrl: "",
    resumeUrl: "/resume.pdf",
    yearsExperience: 2,
    projectsCompleted: 15,
    availableForWork: true,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          setFormData({
            ...data,
            githubUrl: data.githubUrl || "",
            linkedinUrl: data.linkedinUrl || "",
          });
        }
      } catch {
        toast("Failed to load settings", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          githubUrl: formData.githubUrl?.trim() || null,
          linkedinUrl: formData.linkedinUrl?.trim() || null,
          yearsExperience: Number(formData.yearsExperience),
          projectsCompleted: Number(formData.projectsCompleted),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save settings");
      }

      toast("Profile settings updated! Live site revalidated.", "success");
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Error saving profile", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast("File too large (max 5 MB).", "error");
      e.target.value = "";
      return;
    }
    const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"];
    if (!allowed.includes(file.type)) {
      toast("Invalid file type. Use PDF or DOCX.", "error");
      e.target.value = "";
      return;
    }
    setIsResumeUploading(true);
    try {
      toast("Uploading resume...", "info");
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", "resume");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({ ...prev, resumeUrl: data.url }));
        toast("Resume uploaded", "success");
      } else {
        const err = await res.json().catch(() => ({}));
        toast(err.error || "Failed to upload resume", "error");
      }
    } catch {
      toast("Failed to upload resume", "error");
    } finally {
      setIsResumeUploading(false);
      e.target.value = "";
    }
  };

  if (isLoading) {
    return <div className="py-12 text-center text-slate-400 text-xs">Loading profile settings...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Profile Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Update bio, contact credentials, social profile links, and live portfolio stats.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 rounded-2xl glass-panel border border-slate-800 space-y-6">
        {/* Basic Identity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span>Full Name *</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Professional Title *</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Professional Bio (2-3 lines for public About section) *
          </label>
          <textarea
            required
            rows={4}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
          />
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span>Email Address *</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Phone / WhatsApp *</span>
            </label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Location & Availability */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
              <span>Location *</span>
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Lahore, Pakistan"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>Availability *</span>
            </label>
            <input
              type="text"
              required
              value={formData.availability || ""}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              placeholder="Open to remote, hybrid, or onsite roles"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Resume */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Resume PDF Path / URL *</span>
          </label>
          <input
            type="text"
            required
            value={formData.resumeUrl}
            onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
            placeholder="/resume.pdf"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <div className="mt-2 flex items-center gap-2">
            <label className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${isResumeUploading ? "bg-slate-700 text-slate-400" : "bg-slate-800 hover:bg-slate-700 text-slate-200"}`}>
              <Upload className="w-3.5 h-3.5" />
              <span>{isResumeUploading ? "Uploading..." : "Upload Resume (PDF/DOCX)"}</span>
              <input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleResumeUpload} className="hidden" disabled={isResumeUploading} />
            </label>
            {formData.resumeUrl && (
              <a href={formData.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300">View current resume</a>
            )}
          </div>
        </div>

        {/* Social Links (GitHub, LinkedIn) */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <p className="text-xs font-mono font-bold text-slate-300">
            Social Profiles (Icons remain hidden on the portfolio until a valid URL is provided)
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5 text-slate-300" />
                <span>GitHub URL</span>
              </label>
              <input
                type="url"
                value={formData.githubUrl || ""}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/your-username"
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-cyan-400" />
                <span>LinkedIn URL</span>
              </label>
              <input
                type="url"
                value={formData.linkedinUrl || ""}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/your-profile"
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Stats & Availability */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Years of Experience
            </label>
            <input
              type="number"
              min="0"
              value={formData.yearsExperience}
              onChange={(e) => setFormData({ ...formData, yearsExperience: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Projects Completed
            </label>
            <input
              type="number"
              min="0"
              value={formData.projectsCompleted}
              onChange={(e) => setFormData({ ...formData, projectsCompleted: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 sm:pt-6">
            <input
              type="checkbox"
              id="availableForWork"
              checked={formData.availableForWork}
              onChange={(e) => setFormData({ ...formData, availableForWork: e.target.checked })}
              className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-indigo-500"
            />
            <label htmlFor="availableForWork" className="text-xs font-semibold text-slate-300 cursor-pointer">
              Available for Hire (Badge on Hero)
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end pt-6 border-t border-slate-800">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? "Saving..." : "Save Settings & Revalidate"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
