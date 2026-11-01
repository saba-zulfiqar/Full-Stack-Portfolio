import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  subject: z.string().max(150).optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export const projectSchema = z.object({
  title: z.string().min(2, "Title is required").max(120),
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric and dashes"),
  shortDescription: z.string().min(10, "Short description is required").max(300),
  description: z.string().min(20, "Detailed description is required"),
  techTags: z.array(z.string()).min(1, "At least one tech tag is required"),
  liveUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  imageUrl: z.string().min(1, "Image URL is required"),
  category: z.enum(["Client", "Personal", "Work"]),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  order: z.number().int().default(0),
});

export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required").max(60),
  category: z.enum([
    "Frontend",
    "Backend",
    "Databases",
    "DevOps and Tools",
    "Testing",
    "Fundamentals",
  ]),
  level: z.number().min(1).max(100).default(90),
  icon: z.string().optional().nullable(),
  order: z.number().int().default(0),
});

export const timelineSchema = z.object({
  type: z.enum(["EXPERIENCE", "EDUCATION"]),
  title: z.string().min(2, "Title is required").max(100),
  organization: z.string().min(2, "Organization is required").max(100),
  period: z.string().min(2, "Period is required").max(50),
  description: z.string().min(5, "Description is required"),
  current: z.boolean().default(false),
  order: z.number().int().default(0),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  title: z.string().min(2, "Title is required"),
  bio: z.string().min(20, "Bio should be at least 20 characters"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(5, "Phone is required"),
  location: z.string().min(2, "Location is required"),
  availability: z.string().optional(),
  githubUrl: z.string().optional().nullable(),
  linkedinUrl: z.string().optional().nullable(),
  resumeUrl: z.string().min(1, "Resume URL is required"),
  yearsExperience: z.number().min(0),
  projectsCompleted: z.number().min(0),
  availableForWork: z.boolean(),
});
