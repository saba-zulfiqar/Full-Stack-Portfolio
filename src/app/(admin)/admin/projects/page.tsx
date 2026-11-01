"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Eye, EyeOff, Sparkles, ExternalLink, Github, Upload, X } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { ProjectData } from "@/types";

export default function AdminProjectsPage() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formShortDesc, setFormShortDesc] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formTechTags, setFormTechTags] = useState("");
  const [formLiveUrl, setFormLiveUrl] = useState("");
  const [formGithubUrl, setFormGithubUrl] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("/images/project-placeholder.svg");
  const [formCategory, setFormCategory] = useState<"Client" | "Personal" | "Work">("Client");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formPublished, setFormPublished] = useState(true);
  const [formOrder, setFormOrder] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/admin/projects");
      if (res.ok) {
        const data = await res.json();
        // debug removed
        // parse tech tags
        const mapped = data.map((p: any) => ({
          ...p,
          techTags: Array.isArray(p.techTags) ? p.techTags : JSON.parse(p.techTags || "[]"),
        }));
        setProjects(mapped);
      }
    } catch {
      toast("Failed to load projects", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (!editingId) {
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormSlug(autoSlug);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormTitle("");
    setFormSlug("");
    setFormShortDesc("");
    setFormDesc("");
    setFormTechTags("");
    setFormLiveUrl("");
    setFormGithubUrl("");
    setFormImageUrl("/images/project-placeholder.svg");
    setFormCategory("Client");
    setFormFeatured(false);
    setFormPublished(true);
    setFormOrder(projects.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (p: ProjectData) => {
    setEditingId(p.id);
    setFormTitle(p.title);
    setFormSlug(p.slug);
    setFormShortDesc(p.shortDescription);
    setFormDesc(p.description);
    setFormTechTags(p.techTags.join(", "));
    setFormLiveUrl(p.liveUrl || "");
    setFormGithubUrl(p.githubUrl || "");
    setFormImageUrl(p.imageUrl);
    setFormCategory(p.category);
    setFormFeatured(p.featured);
    setFormPublished(p.published);
    setFormOrder(p.order);
    setIsModalOpen(true);
  };

  const compressImage = async (file: File): Promise<File> => {
    if (file.type === "image/svg+xml") return file;
    if (file.size <= 5 * 1024 * 1024) {
      // still try to compress large images but allow
    }
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const maxWidth = 1600;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("canvas error"));
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("compression failed"));
            const compressed = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
              type: "image/webp",
            });
            resolve(compressed);
          },
          "image/webp",
          0.8
        );
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 7 * 1024 * 1024) {
      toast("Image is too large (max 5 MB). Please choose a smaller image.", "error");
      e.target.value = "";
      return;
    }

    setIsUploading(true);
    try {
      toast("Uploading image...", "info");
      let uploadFile: File = file;
      if (file.type !== "image/svg+xml") {
        try {
          uploadFile = await compressImage(file);
        } catch {
          // fallback to original
        }
      }
      if (uploadFile.size > 5 * 1024 * 1024) {
        toast("Image is too large (max 5 MB). Please choose a smaller image.", "error");
        setIsUploading(false);
        e.target.value = "";
        return;
      }
      const fd = new FormData();
      fd.append("file", uploadFile);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      if (res.ok) {
        const data = await res.json();
        setFormImageUrl(data.url);
        toast("Image uploaded", "success");
      } else {
        const err = await res.json().catch(() => ({}));
        toast(err.error || "Failed to upload image", "error");
      }
    } catch {
      toast("Failed to upload image", "error");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const generateUniqueSlug = async (baseSlug: string, excludeId?: string | null) => {
    let slug = baseSlug || "project";
    let attempt = 0;
    while (attempt < 10) {
      const res = await fetch(`/api/admin/projects`);
      if (res.ok) {
        const data = await res.json();
        const exists = data.some((p: any) => p.slug === slug && p.id !== excludeId);
        if (!exists) return slug;
      }
      attempt++;
      slug = `${baseSlug || "project"}-${attempt + 1}`;
    }
    return slug;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const tagsArray = formTechTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      let slugToUse = formSlug.trim();
      if (!slugToUse && formTitle.trim()) {
        slugToUse = formTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
      }
      if (!slugToUse) {
        toast("Slug is required", "error");
        setIsSubmitting(false);
        return;
      }
      slugToUse = await generateUniqueSlug(slugToUse, editingId);

      const payload = {
        title: formTitle,
        slug: slugToUse,
        shortDescription: formShortDesc,
        description: formDesc,
        techTags: tagsArray,
        liveUrl: formLiveUrl || undefined,
        githubUrl: formGithubUrl || undefined,
        imageUrl: formImageUrl,
        category: formCategory,
        featured: formFeatured,
        published: formPublished,
        order: Number(formOrder),
      };

      const url = "/api/admin/projects";
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? JSON.stringify({ id: editingId, ...payload }) : JSON.stringify(payload);

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Save failed");
      }

      toast(editingId ? "Project updated successfully!" : "Project created successfully!", "success");
      setIsModalOpen(false);
      await fetchProjects();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Error saving project", "error");
      // retry once on connection issues
      try {
        const url = "/api/admin/projects";
        const method = editingId ? "PUT" : "POST";
        const tagsArray = formTechTags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
        let slugToUse = formSlug.trim();
        if (!slugToUse && formTitle.trim()) {
          slugToUse = formTitle
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
        }
        if (slugToUse) {
          slugToUse = await generateUniqueSlug(slugToUse, editingId);
          const payload = {
            title: formTitle,
            slug: slugToUse,
            shortDescription: formShortDesc,
            description: formDesc,
            techTags: tagsArray,
            liveUrl: formLiveUrl || undefined,
            githubUrl: formGithubUrl || undefined,
            imageUrl: formImageUrl,
            category: formCategory,
            featured: formFeatured,
            published: formPublished,
            order: Number(formOrder),
          };
          const body = editingId ? JSON.stringify({ id: editingId, ...payload }) : JSON.stringify(payload);
          const res2 = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body,
          });
          if (res2.ok) {
            toast(editingId ? "Project updated successfully!" : "Project created successfully!", "success");
            setIsModalOpen(false);
            await fetchProjects();
          }
        }
      } catch {
        // ignore
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast("Project deleted successfully", "success");
        setDeleteConfirmId(null);
        fetchProjects();
      }
    } catch {
      toast("Failed to delete project", "error");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Projects Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Create, edit, toggle visibility, and update showcase case studies.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Projects Table / List */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        {isLoading ? (
          <div className="py-12 text-center text-slate-400 text-xs">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No projects found. Click &ldquo;Add New Project&rdquo; to create your first showcase!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Project</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Tags</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-8 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                          <Image src={p.imageUrl} alt={p.title} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{p.title}</p>
                          <p className="text-[11px] font-mono text-slate-400">/{p.slug}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-slate-800 text-cyan-300 border border-slate-700">
                        {p.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        {p.published ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                            <Eye className="w-3.5 h-3.5" /> Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                            <EyeOff className="w-3.5 h-3.5" /> Draft
                          </span>
                        )}

                        {p.featured && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                            <Sparkles className="w-3 h-3" /> Featured
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {p.techTags.slice(0, 3).map((t) => (
                          <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                            {t}
                          </span>
                        ))}
                        {p.techTags.length > 3 && (
                          <span className="text-[10px] text-slate-500">+{p.techTags.length - 3}</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {p.liveUrl && (
                          <a
                            href={p.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                            title="Live URL"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(p.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="p-6 rounded-2xl glass-panel max-w-sm w-full border border-rose-500/30 space-y-4">
            <h3 className="text-base font-bold text-white">Delete Project</h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to delete this project? This will remove it from your portfolio and database.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="p-6 sm:p-8 rounded-2xl glass-panel max-w-2xl w-full border border-slate-800 my-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white">
                {editingId ? "Edit Project" : "Create New Project"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter project name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Slug *</label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="project-name (auto-generated from title)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Short Description (Portfolio Card) *
                </label>
                <input
                  type="text"
                  required
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  placeholder="Enter a short description for the portfolio card"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Detailed Description (Case Study Page) *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Explain what the project does, what you built and the technologies you used"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tech Tags (comma separated) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTechTags}
                    onChange={(e) => setFormTechTags(e.target.value)}
                    placeholder="e.g. React, Node.js, PostgreSQL (comma separated)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Client">Client Project</option>
                    <option value="Personal">Personal Project</option>
                    <option value="Work">Work / Employment</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Live Demo URL</label>
                  <input
                    type="url"
                    value={formLiveUrl}
                    onChange={(e) => setFormLiveUrl(e.target.value)}
                    placeholder="https://your-project.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Repo URL</label>
                  <input
                    type="url"
                    value={formGithubUrl}
                    onChange={(e) => setFormGithubUrl(e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Image Preview & Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Project Screenshot / Thumbnail
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-14 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 flex-shrink-0">
                    <Image
                    src={formImageUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/images/project-placeholder.svg";
                    }}
                  />
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={formImageUrl}
                      onChange={(e) => setFormImageUrl(e.target.value)}
                      placeholder="Upload an image or paste an image URL"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                    />
                    <label className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${isUploading ? "bg-slate-700 text-slate-400" : "bg-slate-800 hover:bg-slate-700 text-slate-200"}`}>
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploading ? "Uploading..." : "Upload New File"}</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                    </label>
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-slate-800">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formPublished}
                    onChange={(e) => setFormPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-indigo-500"
                  />
                  <span>Published on Live Portfolio</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-indigo-500"
                  />
                  <span>Featured Project</span>
                </label>

                <div className="flex items-center gap-2 ml-auto">
                  <label className="text-xs font-semibold text-slate-300">Sort Order:</label>
                  <input
                    type="number"
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
                    className="w-16 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs text-center"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : editingId ? "Update Project" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
