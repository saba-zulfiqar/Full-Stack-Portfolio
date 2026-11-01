export interface ProfileData {
  id?: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  availability?: string;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  resumeUrl: string;
  yearsExperience: number;
  projectsCompleted: number;
  availableForWork: boolean;
}

export interface ProjectData {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  techTags: string[];
  liveUrl?: string | null;
  githubUrl?: string | null;
  imageUrl: string;
  category: "Client" | "Personal" | "Work";
  featured: boolean;
  published: boolean;
  order: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface SkillData {
  id: string;
  name: string;
  category: "Frontend" | "Backend" | "Databases" | "DevOps and Tools" | "Testing" | "Fundamentals";
  level: number;
  icon?: string | null;
  order: number;
}

export interface TimelineData {
  id: string;
  type: "EXPERIENCE" | "EDUCATION";
  title: string;
  organization: string;
  period: string;
  description: string;
  current: boolean;
  order: number;
}

export interface MessageData {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  isRead: boolean;
  createdAt: string | Date;
}
