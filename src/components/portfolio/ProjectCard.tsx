"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import { ProjectData } from "@/types";
import { cleanImageUrl } from "@/lib/images";

interface ProjectCardProps {
  project: ProjectData;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#12151f] overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-colors">
      <div>
        {/* Project Thumbnail */}
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-slate-900 border-b border-slate-800/80">
          <Image
            src={cleanImageUrl(project.imageUrl)}
            alt={project.title}
            fill
            className="object-cover object-top transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/images/project-placeholder.svg";
            }}
          />

          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#090a0f]/90 text-slate-300 border border-slate-800">
              {project.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold text-white hover:text-blue-400 transition-colors">
              <Link href={`/projects/${project.slug}`} className="inline-flex items-center gap-1">
                {project.title}
                <ArrowUpRight className="w-4 h-4 text-slate-500" />
              </Link>
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-3">
            {project.shortDescription}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.techTags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900 text-slate-400 border border-slate-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 pt-0 mt-2 border-t border-slate-800/60 flex items-center justify-between gap-3 pt-4">
        <Link
          href={`/projects/${project.slug}`}
          className="text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          View Case Study &rarr;
        </Link>

        <div className="flex items-center gap-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition-colors"
              title="GitHub Repository"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Site</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
