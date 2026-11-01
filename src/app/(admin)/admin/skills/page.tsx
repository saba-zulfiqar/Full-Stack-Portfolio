"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Cpu } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { SkillData } from "@/types";

const CATEGORIES = [
  "Frontend",
  "Backend",
  "Databases",
  "DevOps and Tools",
  "Testing",
  "Fundamentals",
] as const;

export default function AdminSkillsPage() {
  const { toast } = useToast();
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<SkillData["category"]>("Frontend");
  const [level, setLevel] = useState(90);
  const [order, setOrder] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/admin/skills");
      if (res.ok) {
        const data = await res.json();
        setSkills(data);
      }
    } catch {
      toast("Failed to load skills", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setName("");
    setCategory("Frontend");
    setLevel(90);
    setOrder(skills.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (s: SkillData) => {
    setEditingId(s.id);
    setName(s.name);
    setCategory(s.category);
    setLevel(s.level);
    setOrder(s.order);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name,
      category,
      level: Number(level),
      order: Number(order),
    };

    try {
      const url = "/api/admin/skills";
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

      toast(editingId ? "Skill updated!" : "Skill created!", "success");
      setIsModalOpen(false);
      fetchSkills();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Error saving skill", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/skills?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast("Skill removed", "success");
        setDeleteConfirmId(null);
        fetchSkills();
      }
    } catch {
      toast("Failed to delete skill", "error");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Skills Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Add or organize your technical proficiencies across frontend, backend, databases, and DevOps.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Skill</span>
        </button>
      </div>

      {/* Grouped Skills View */}
      {isLoading ? (
        <div className="py-12 text-center text-slate-400 text-xs">Loading skills...</div>
      ) : (
        <div className="space-y-6">
          {CATEGORIES.map((cat) => {
            const catSkills = skills.filter((s) => s.category === cat);
            return (
              <div key={cat} className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span>{cat}</span>
                    <span className="text-xs text-slate-400 normal-case">({catSkills.length} skills)</span>
                  </h3>
                </div>

                {catSkills.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2">No skills in this category yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {catSkills.map((s) => (
                      <div
                        key={s.id}
                        className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-2 hover:border-indigo-500/50 transition-colors"
                      >
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-white truncate">{s.name}</p>
                          <p className="text-[10px] text-cyan-400 font-mono">{s.level}% proficiency</p>
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => openEditModal(s)}
                            className="p-1 rounded-md text-indigo-400 hover:bg-slate-800"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(s.id)}
                            className="p-1 rounded-md text-rose-400 hover:bg-slate-800"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="p-6 rounded-2xl glass-panel max-w-sm w-full border border-rose-500/30 space-y-4">
            <h3 className="text-base font-bold text-white">Delete Skill</h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to remove this skill from the database?
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

      {/* Skill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="p-6 rounded-2xl glass-panel max-w-md w-full border border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">
                {editingId ? "Edit Skill" : "Add Technical Skill"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Next.js"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Proficiency Level</span>
                  <span className="font-mono text-cyan-400">{level}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={level}
                  onChange={(e) => setLevel(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
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
                  {isSubmitting ? "Saving..." : editingId ? "Update Skill" : "Add Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
