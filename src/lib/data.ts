import prisma from "@/lib/prisma";
import { ProfileData, ProjectData, SkillData, TimelineData } from "@/types";

export const DEFAULT_PROFILE: ProfileData = {
  name: "Saba Zulfiqar",
  title: "Full Stack Developer",
  bio: "I build web applications end to end, from relational databases to responsive user interfaces. Focused on clean TypeScript architectures, backend APIs, and reliable on-time delivery.",
  email: "sabazulfiqar926@gmail.com",
  phone: "+92 307 5834975",
  location: "Lahore, Pakistan",
  availability: "Open to remote, hybrid, or onsite roles",
  githubUrl: null, // Hidden until filled from admin
  linkedinUrl: "https://www.linkedin.com/in/saba-zulfiqar-015059356/", // Hidden until filled from admin
  resumeUrl: "/resume.pdf",
  yearsExperience: 1,
  projectsCompleted: 15,
  availableForWork: true,
};

export const DEFAULT_PROJECTS: ProjectData[] = [
  {
    id: "proj_typeoye",
    title: "TypeOye",
    slug: "typeoye",
    shortDescription: "Interactive touch typing speed test platform with real-time WPM calculation, accuracy tracking, and responsive layout.",
    description: "TypeOye is a web application designed to help users evaluate and improve their typing speed and precision. Built with a responsive interface, dynamic keystroke analysis, real-time WPM and accuracy counters, and custom test durations.",
    techTags: ["Next.js", "TypeScript", "Tailwind CSS", "React"],
    liveUrl: "https://typeoye.com",
    githubUrl: null,
    imageUrl: "/images/typeoye.svg",
    category: "Client",
    featured: true,
    published: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "proj_saba_fashion",
    title: "Saba Fashion",
    slug: "saba-fashion",
    shortDescription: "Apparel e-commerce web platform engineered for browsing, product discovery, and responsive catalog viewing.",
    description: "Saba Fashion is an apparel catalog and shopping application. Features dynamic product filtering, responsive layouts, product previews, and structured category browsing.",
    techTags: ["Next.js", "React", "Tailwind CSS", "REST API"],
    liveUrl: "https://saba-fashion.vercel.app",
    githubUrl: null,
    imageUrl: "/images/saba-fashion.svg",
    category: "Client",
    featured: true,
    published: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const DEFAULT_SKILLS: SkillData[] = [
  // Frontend
  { id: "sk_1", name: "HTML5", category: "Frontend", level: 95, order: 1 },
  { id: "sk_2", name: "CSS3", category: "Frontend", level: 95, order: 2 },
  { id: "sk_3", name: "JavaScript (ES6+)", category: "Frontend", level: 92, order: 3 },
  { id: "sk_4", name: "TypeScript", category: "Frontend", level: 90, order: 4 },
  { id: "sk_5", name: "React.js", category: "Frontend", level: 92, order: 5 },
  { id: "sk_6", name: "Next.js", category: "Frontend", level: 90, order: 6 },
  { id: "sk_7", name: "Zustand", category: "Frontend", level: 85, order: 7 },
  { id: "sk_8", name: "React Query", category: "Frontend", level: 88, order: 8 },
  { id: "sk_9", name: "Tailwind CSS", category: "Frontend", level: 95, order: 9 },

  // Backend
  { id: "sk_10", name: "Node.js", category: "Backend", level: 90, order: 10 },
  { id: "sk_11", name: "Express.js", category: "Backend", level: 90, order: 11 },
  { id: "sk_12", name: "NestJS", category: "Backend", level: 82, order: 12 },
  { id: "sk_13", name: "REST APIs", category: "Backend", level: 94, order: 13 },
  { id: "sk_14", name: "JWT", category: "Backend", level: 90, order: 14 },
  { id: "sk_15", name: "OAuth", category: "Backend", level: 85, order: 15 },

  // Databases
  { id: "sk_16", name: "PostgreSQL", category: "Databases", level: 90, order: 16 },
  { id: "sk_17", name: "MySQL", category: "Databases", level: 85, order: 17 },
  { id: "sk_18", name: "MongoDB", category: "Databases", level: 85, order: 18 },

  // DevOps and Tools
  { id: "sk_19", name: "Git", category: "DevOps and Tools", level: 92, order: 19 },
  { id: "sk_20", name: "GitHub", category: "DevOps and Tools", level: 92, order: 20 },
  { id: "sk_21", name: "Docker", category: "DevOps and Tools", level: 82, order: 21 },
  { id: "sk_22", name: "GitHub Actions (CI/CD)", category: "DevOps and Tools", level: 82, order: 22 },
  { id: "sk_23", name: "AWS", category: "DevOps and Tools", level: 80, order: 23 },
  { id: "sk_24", name: "Vercel", category: "DevOps and Tools", level: 95, order: 24 },
  { id: "sk_25", name: "Linux", category: "DevOps and Tools", level: 85, order: 25 },

  // Testing
  { id: "sk_26", name: "Jest", category: "Testing", level: 85, order: 26 },
  { id: "sk_27", name: "React Testing Library", category: "Testing", level: 85, order: 27 },
  { id: "sk_28", name: "Cypress / Playwright", category: "Testing", level: 80, order: 28 },

  // Fundamentals
  { id: "sk_29", name: "Data Structures & Algorithms", category: "Fundamentals", level: 88, order: 29 },
  { id: "sk_30", name: "System Design", category: "Fundamentals", level: 84, order: 30 },
  { id: "sk_31", name: "OOP", category: "Fundamentals", level: 92, order: 31 },
  { id: "sk_32", name: "HTTP / Networking", category: "Fundamentals", level: 90, order: 32 },
];

export const DEFAULT_TIMELINE: TimelineData[] = [
  {
    id: "tl_1",
    type: "EXPERIENCE",
    title: "Full Stack Developer",
    organization: "Orzeh Technologies",
    period: "2025 - 2026",
    description:
      "Built and maintained responsive frontend interfaces using Next.js, React, and TypeScript.\nDesigned and integrated backend REST APIs and business logic using Node.js.\nManaged database queries and schema updates with PostgreSQL, collaborating with team members on feature delivery.",
    current: true,
    order: 1,
  },
  {
    id: "tl_2",
    type: "EDUCATION",
    title: "BS Computer Science",
    organization: "Allama Iqbal Open University",
    period: "2020 - 2024",
    description:
      "Completed comprehensive Bachelor of Science degree in Computer Science covering algorithms, data structures, software engineering methodologies, web technologies, database management systems, and distributed computing.",
    current: false,
    order: 2,
  },
];

// Helper to safely parse tech tags
export function parseTechTags(tags: string | string[]): string[] {
  if (Array.isArray(tags)) return tags;
  if (!tags) return [];
  try {
    const parsed = JSON.parse(tags);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // Comma-separated fallback
  }
  return tags.split(",").map((t) => t.trim()).filter(Boolean);
}

// Helper to parse location and availability from database or defaults
export function parseLocationAndAvailability(raw: string | undefined | null): { location: string; availability: string } {
  if (!raw) {
    return {
      location: "Lahore, Pakistan",
      availability: "Open to remote, hybrid, or onsite roles",
    };
  }
  if (raw.includes("|")) {
    const [loc, ...availParts] = raw.split("|");
    const locTrimmed = loc.trim();
    const availTrimmed = availParts.join("|").trim();
    return {
      location: locTrimmed || "Lahore, Pakistan",
      availability: availTrimmed || "Open to remote, hybrid, or onsite roles",
    };
  }
  if (
    raw.toLowerCase().includes("remote") ||
    raw.toLowerCase().includes("hybrid") ||
    raw.toLowerCase().includes("onsite") ||
    raw.toLowerCase().includes("roles")
  ) {
    return {
      location: "Lahore, Pakistan",
      availability: raw,
    };
  }
  return {
    location: raw,
    availability: "Open to remote, hybrid, or onsite roles",
  };
}

// Timeout wrapper so unreachable DB fails over to seed data instantly
async function withTimeout<T>(promise: Promise<T>, ms = 2500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("DB query timed out")), ms)
    ),
  ]);
}

export async function getProfile(): Promise<ProfileData> {
  try {
    const profile = await withTimeout(prisma.profile.findFirst());
    if (profile) {
      const { location, availability } = parseLocationAndAvailability(profile.location);
      return {
        id: profile.id,
        name: profile.name,
        title: profile.title,
        bio: profile.bio,
        email: profile.email,
        phone: profile.phone,
        location,
        availability,
        githubUrl: profile.githubUrl && profile.githubUrl !== "[GITHUB_URL]" ? profile.githubUrl : null,
        linkedinUrl: profile.linkedinUrl && profile.linkedinUrl !== "[LINKEDIN_URL]" ? profile.linkedinUrl : null,
        resumeUrl: profile.resumeUrl || "/resume.pdf",
        yearsExperience: profile.yearsExperience,
        projectsCompleted: profile.projectsCompleted,
        availableForWork: profile.availableForWork,
      };
    }
  } catch {
    // Database connection fallback
  }
  return DEFAULT_PROFILE;
}

export async function getProjects(onlyPublished = true): Promise<ProjectData[]> {
  try {
    const projects = await prisma.project.findMany({
      where: onlyPublished ? { published: true } : undefined,
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    });

    return projects.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      shortDescription: p.shortDescription,
      description: p.description,
      techTags: parseTechTags(p.techTags),
      liveUrl: p.liveUrl,
      githubUrl: p.githubUrl && p.githubUrl !== "[GITHUB_URL]" ? p.githubUrl : null,
      imageUrl: p.imageUrl,
      category: p.category as "Client" | "Personal" | "Work",
      featured: p.featured,
      published: p.published,
      order: p.order,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));
  } catch (err) {
    console.error("[PUBLIC getProjects] ERROR:", err);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<ProjectData | null> {
  try {
    const project = await prisma.project.findUnique({
      where: { slug },
    });
    if (project) {
      return {
        id: project.id,
        title: project.title,
        slug: project.slug,
        shortDescription: project.shortDescription,
        description: project.description,
        techTags: parseTechTags(project.techTags),
        liveUrl: project.liveUrl,
        githubUrl: project.githubUrl,
        imageUrl: project.imageUrl,
        category: project.category as "Client" | "Personal" | "Work",
        featured: project.featured,
        published: project.published,
        order: project.order,
      };
    }
    return null;
  } catch (err) {
    console.error("[PUBLIC getProjectBySlug] ERROR:", err);
    return null;
  }
}

export async function getSkills(): Promise<SkillData[]> {
  try {
    const skills = await withTimeout(
      prisma.skill.findMany({
        orderBy: [{ category: "asc" }, { order: "asc" }],
      })
    );
    if (skills.length > 0) {
      return skills.map((s) => ({
        id: s.id,
        name: s.name,
        category: s.category as SkillData["category"],
        level: s.level,
        icon: s.icon,
        order: s.order,
      }));
    }
  } catch {
    // Database fallback
  }
  return DEFAULT_SKILLS;
}

export async function getTimeline(): Promise<TimelineData[]> {
  try {
    const items = await withTimeout(
      prisma.timelineItem.findMany({
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      })
    );
    if (items.length > 0) {
      return items.map((i) => ({
        id: i.id,
        type: i.type as "EXPERIENCE" | "EDUCATION",
        title: i.title,
        organization: i.organization,
        period: i.period,
        description: i.description,
        current: i.current,
        order: i.order,
      }));
    }
  } catch {
    // Database fallback
  }
  return DEFAULT_TIMELINE;
}
