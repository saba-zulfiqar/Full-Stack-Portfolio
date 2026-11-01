"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Briefcase, GraduationCap } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { TimelineData } from "@/types";

export default function AdminTimelinePage() {
  const { toast } = useToast();
  const [items, setItems] = useState<TimelineData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [type, setType] = useState<"EXPERIENCE" | "EDUCATION">("EXPERIENCE");
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [period, setPeriod] = useState("");
  const [description, setDescription] = useState("");
  const [current, setCurrent] = useState(false);
  const [order, setOrder] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTimeline = async () => {
    try {
      const res = await fetch("/api/admin/timeline");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch {
      toast("Failed to load timeline items", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setType("EXPERIENCE");
    setTitle("");
    setOrganization("");
    setPeriod("2025 - 2026");
    setDescription("");
    setCurrent(false);
    setOrder(items.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (item: TimelineData) => {
    setEditingId(item.id);
    setType(item.type);
    setTitle(item.title);
    setOrganization(item.organization);
    setPeriod(item.period);
    setDescription(item.description);
    setCurrent(item.current);
    setOrder(item.order);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      type,
      title,
      organization,
      period,
      description,
      current,
      order: Number(order),
    };

    try {
      const url = "/api/admin/timeline";
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? JSON.stringify({ id: editingId, ...payload }) : JSON.stringify(payload);

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Save failed");
      }

      toast(editingId ? "Timeline item updated!" : "Timeline item created!", "success");
      setIsModalOpen(false);
      fetchTimeline();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Error saving timeline item", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/timeline?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast("Timeline entry removed", "success");
        setDeleteConfirmId(null);
        fetchTimeline();
      }
    } catch {
      toast("Failed to delete entry", "error");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Timeline Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your employment history and academic milestones.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add Timeline Entry</span>
        </button>
      </div>

      {/* Timeline List */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        {isLoading ? (
          <div className="py-12 text-center text-slate-400 text-xs">Loading timeline...</div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No entries found. Click &ldquo;Add Timeline Entry&rdquo; to add your career history.
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              const isExperience = item.type === "EXPERIENCE";
              const Icon = isExperience ? Briefcase : GraduationCap;

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-indigo-500/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isExperience
                          ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30"
                          : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            isExperience
                              ? "bg-indigo-500/20 text-indigo-300"
                              : "bg-cyan-500/20 text-cyan-300"
                          }`}
                        >
                          {item.type}
                        </span>
                        {item.current && (
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-white mt-1">{item.title}</h3>
                      <p className="text-xs text-slate-400">
                        {item.organization} &bull; <span className="font-mono text-cyan-400">{item.period}</span>
                      </p>
                      <p className="text-xs text-slate-300 mt-2 line-clamp-2 max-w-2xl">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="p-6 rounded-2xl glass-panel max-w-sm w-full border border-rose-500/30 space-y-4">
            <h3 className="text-base font-bold text-white">Delete Timeline Entry</h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to remove this milestone from your portfolio?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="p-6 sm:p-8 rounded-2xl glass-panel max-w-lg w-full border border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">
                {editingId ? "Edit Milestone" : "Add Timeline Milestone"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Type *</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="EXPERIENCE">Work Experience</option>
                    <option value="EDUCATION">Education Degree</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Period *</label>
                  <input
                    type="text"
                    required
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    placeholder="2025 - 2026"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Title / Role / Degree *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Full Stack Developer or BS Computer Science"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Organization / University *
                </label>
                <input
                  type="text"
                  required
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Orzeh Technologies or Allama Iqbal Open University"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description &amp; Achievements *
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail key responsibilities, technologies deployed, and milestones delivered..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="current"
                  checked={current}
                  onChange={(e) => setCurrent(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-indigo-500"
                />
                <label htmlFor="current" className="text-xs font-semibold text-slate-300 cursor-pointer">
                  Current / Ongoing Position
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-xs font-semibold shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : editingId ? "Update Entry" : "Save Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
