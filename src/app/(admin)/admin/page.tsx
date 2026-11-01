import React from "react";
import Link from "next/link";
import { FolderGit2, Cpu, GraduationCap, Mail, Sparkles, Plus, ExternalLink } from "lucide-react";
import prisma from "@/lib/prisma";
import { getProjects, getSkills, getTimeline } from "@/lib/data";

export const revalidate = 0; // Dynamic server component

export default async function AdminDashboardPage() {
  let projectCount = 0;
  let skillCount = 0;
  let timelineCount = 0;
  let unreadMessagesCount = 0;
  let recentMessages: Array<{ id: string; name: string; email: string; subject: string | null; createdAt: Date }> = [];

  try {
    const [pCount, sCount, tCount, unread, messages] = await Promise.all([
      prisma.project.count(),
      prisma.skill.count(),
      prisma.timelineItem.count(),
      prisma.message.count({ where: { isRead: false } }),
      prisma.message.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
    ]);
    projectCount = pCount;
    skillCount = sCount;
    timelineCount = tCount;
    unreadMessagesCount = unread;
    recentMessages = messages;
  } catch {
    // Database connection fallback to mock data counts
    const [projects, skills, timeline] = await Promise.all([
      getProjects(false),
      getSkills(),
      getTimeline(),
    ]);
    projectCount = projects.length;
    skillCount = skills.length;
    timelineCount = timeline.length;
  }

  const KPI_CARDS = [
    {
      label: "Total Projects",
      value: projectCount,
      subtext: "Published & drafts",
      icon: FolderGit2,
      color: "from-blue-600 to-indigo-600",
      href: "/admin/projects",
    },
    {
      label: "Technical Skills",
      value: skillCount,
      subtext: "Categorized skills",
      icon: Cpu,
      color: "from-indigo-600 to-purple-600",
      href: "/admin/skills",
    },
    {
      label: "Career Timeline",
      value: timelineCount,
      subtext: "Jobs & Education",
      icon: GraduationCap,
      color: "from-cyan-600 to-blue-600",
      href: "/admin/timeline",
    },
    {
      label: "Unread Messages",
      value: unreadMessagesCount,
      subtext: "From contact form",
      icon: Mail,
      color: "from-purple-600 to-pink-600",
      href: "/admin/messages",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage portfolio content, monitor incoming client inquiries, and publish updates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            <span>Live Site</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {KPI_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="p-6 rounded-2xl glass-panel group hover:border-indigo-500/50 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-400">{card.label}</span>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white shadow-md`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <p className="text-3xl font-extrabold text-white font-mono">{card.value}</p>
                <p className="text-[11px] text-slate-400 mt-1">{card.subtext}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Contact Inquiries */}
      <div className="p-6 rounded-2xl glass-panel space-y-4 border border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-400" />
              <span>Recent Client Inquiries</span>
            </h2>
            <p className="text-xs text-slate-400">Direct inquiries from the portfolio contact form</p>
          </div>
          <Link
            href="/admin/messages"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
          >
            View all messages &rarr;
          </Link>
        </div>

        {recentMessages.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No contact submissions yet. New messages will appear here.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {recentMessages.map((msg) => (
              <div key={msg.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-white">{msg.name}</p>
                  <p className="text-xs text-slate-400 font-mono">{msg.email}</p>
                  {msg.subject && <p className="text-xs text-slate-300 mt-0.5">{msg.subject}</p>}
                </div>
                <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
