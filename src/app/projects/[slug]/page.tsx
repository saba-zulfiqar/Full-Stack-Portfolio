import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Github, Calendar, Layers } from "lucide-react";
import { getProjectBySlug, getProjects } from "@/lib/data";
import { cleanImageUrl } from "@/lib/images";

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateStaticParams() {
  return [];
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 py-16 px-4 sm:px-6">
      <div className="max-w-[1100px] mx-auto space-y-10">
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-[#12151f] border border-slate-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Portfolio
          </Link>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
              {project.category}
            </span>
            {project.featured && (
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Header Title */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            {project.title}
          </h1>
          <p className="text-base text-slate-400 leading-relaxed max-w-2xl">
            {project.shortDescription}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Visit Live Application</span>
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#12151f] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>View Source Code</span>
              </a>
            )}
          </div>
        </div>

        {/* Screenshot showcase */}
        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-[#12151f] border border-slate-800">
          <Image
            src={cleanImageUrl(project.imageUrl)}
            alt={project.title}
            fill
            className="object-cover object-top"
            priority
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/images/project-placeholder.svg";
            }}
          />
        </div>

        {/* Detailed Description */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6 border-t border-slate-800">
          <div className="lg:col-span-8 space-y-4">
            <h2 className="text-xl font-bold text-white">About the Project</h2>
            <div className="text-slate-300 text-sm leading-relaxed space-y-4">
              <p>{project.description}</p>
            </div>
          </div>

          {/* Sidebar Specs */}
          <div className="lg:col-span-4 p-6 rounded-xl bg-[#12151f] border border-slate-800 space-y-5">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Technologies Used
            </h3>

            <div className="flex flex-wrap gap-1.5">
              {project.techTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded text-xs font-mono bg-[#090a0f] text-slate-300 border border-slate-800"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-3 text-xs text-slate-400">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  Category:
                </span>
                <span className="text-white font-medium">{project.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  Status:
                </span>
                <span className="text-emerald-400 font-medium">Production Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
