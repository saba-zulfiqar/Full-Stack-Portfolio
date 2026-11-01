"use client";

import React, { useState } from "react";
import { ProjectData } from "@/types";
import ProjectCard from "./ProjectCard";

interface ProjectsSectionProps {
  projects: ProjectData[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Client", "Personal", "Work"];

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-20 sm:py-24">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-12">
          <p className="text-xs font-mono uppercase tracking-wider text-blue-400 mb-2">
            Featured Projects
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Selected Work
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
            Production web applications built for clients and real-world users.
          </p>
        </div>

        {/* Filter Tabs */}
        {projects.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat;
              const count =
                cat === "All"
                  ? projects.length
                  : projects.filter((p) => p.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "bg-[#12151f] text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                  }`}
                >
                  <span>{cat}</span>
                  <span className="text-[11px] font-mono opacity-70 ml-1.5">({count})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            Projects are coming soon.
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            No projects found under &ldquo;{activeCategory}&rdquo;.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
