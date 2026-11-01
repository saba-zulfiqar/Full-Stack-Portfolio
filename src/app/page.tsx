import React from "react";
import Navbar from "@/components/portfolio/Navbar";
import HeroSection from "@/components/portfolio/HeroSection";
import AboutSection from "@/components/portfolio/AboutSection";
import SkillsSection from "@/components/portfolio/SkillsSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import TimelineSection from "@/components/portfolio/TimelineSection";
import ContactSection from "@/components/portfolio/ContactSection";
import Footer from "@/components/portfolio/Footer";
import { getProfile, getProjects, getSkills, getTimeline } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const [profile, projects, skills, timeline] = await Promise.all([
    getProfile(),
    getProjects(true),
    getSkills(),
    getTimeline(),
  ]);

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
      <Navbar resumeUrl={profile.resumeUrl} />
      <main>
        <HeroSection
          name={profile.name}
          title={profile.title}
          location={profile.location}
          availability={profile.availability}
          githubUrl={profile.githubUrl}
          linkedinUrl={profile.linkedinUrl}
          resumeUrl={profile.resumeUrl}
        />
        <AboutSection profile={profile} />
        <SkillsSection skills={skills} />
        <ProjectsSection projects={projects} />
        <TimelineSection timeline={timeline} />
        <ContactSection profile={profile} />
      </main>
      <Footer profile={profile} />
    </div>
  );
}
