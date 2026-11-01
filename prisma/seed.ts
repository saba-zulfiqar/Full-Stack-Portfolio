import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Admin User
  const adminEmail = process.env.ADMIN_EMAIL || "sabazulfiqar926@gmail.com";
  const rawPassword = process.env.ADMIN_PASSWORD || "AdminPassword2026!";
  const passwordHash = await bcrypt.hash(rawPassword, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      passwordHash,
      name: "Saba Zulfiqar",
    },
  });
  console.log(`✅ Admin user seeded: ${admin.email}`);

  // 2. Profile
  const profile = await prisma.profile.upsert({
    where: { id: "profile_saba" },
    update: {
      yearsExperience: 1,
      location: "Pakistan | Open to Remote, Hybrid & Onsite roles",
      bio: "I build web applications end to end, from relational databases to responsive user interfaces. Focused on clean TypeScript architectures, backend APIs, and reliable on-time delivery.",
    },
    create: {
      id: "profile_saba",
      name: "Saba Zulfiqar",
      title: "Full Stack Developer",
      bio: "I build web applications end to end, from relational databases to responsive user interfaces. Focused on clean TypeScript architectures, backend APIs, and reliable on-time delivery.",
      email: "sabazulfiqar926@gmail.com",
      phone: "+92 307 5834975",
      location: "Pakistan | Open to Remote, Hybrid & Onsite roles",
      githubUrl: null,
      linkedinUrl: "https://www.linkedin.com/in/saba-zulfiqar-015059356/",
      resumeUrl: "/resume.pdf",
      yearsExperience: 1,
      projectsCompleted: 15,
      availableForWork: true,
    },
  });
  console.log(`✅ Profile seeded for: ${profile.name}`);

  // 3. Projects
  const projects = [
    {
      id: "proj_typeoye",
      title: "TypeOye",
      slug: "typeoye",
      shortDescription: "An interactive touch typing speed test platform featuring real-time WPM calculation, accuracy tracking, and responsive UI.",
      description: "TypeOye is a modern web application designed to help users evaluate and sharpen their typing speed and precision. Built with a responsive interface, dynamic keystroke analysis, real-time WPM/accuracy counters, and custom test durations.",
      techTags: JSON.stringify(["Next.js", "TypeScript", "Tailwind CSS", "React", "Web Vitals"]),
      liveUrl: "https://typeoye.com",
      githubUrl: null,
      imageUrl: "/images/typeoye.svg",
      category: "Client",
      featured: true,
      published: true,
      order: 1,
    },
    {
      id: "proj_saba_fashion",
      title: "Saba Fashion",
      slug: "saba-fashion",
      shortDescription: "A modern responsive fashion and apparel e-commerce web platform engineered for seamless browsing and catalog exploration.",
      description: "Saba Fashion is a full-featured apparel showcase and shopping application. It features dynamic product filtering, responsive mobile-first layouts, modern card previews, and streamlined product discovery.",
      techTags: JSON.stringify(["Next.js", "React", "Tailwind CSS", "REST API", "E-Commerce"]),
      liveUrl: "https://saba-fashion.vercel.app",
      githubUrl: null,
      imageUrl: "/images/saba-fashion.svg",
      category: "Client",
      featured: true,
      published: true,
      order: 2,
    },
  ];

  for (const proj of projects) {
    await prisma.project.upsert({
      where: { slug: proj.slug },
      update: proj,
      create: proj,
    });
  }
  console.log(`✅ Seeded ${projects.length} projects`);

  // 4. Skills (Exact 32 skills)
  const skills = [
    // Frontend
    { name: "HTML5", category: "Frontend", level: 95, order: 1 },
    { name: "CSS3", category: "Frontend", level: 95, order: 2 },
    { name: "JavaScript (ES6+)", category: "Frontend", level: 92, order: 3 },
    { name: "TypeScript", category: "Frontend", level: 90, order: 4 },
    { name: "React.js", category: "Frontend", level: 92, order: 5 },
    { name: "Next.js", category: "Frontend", level: 90, order: 6 },
    { name: "Zustand", category: "Frontend", level: 85, order: 7 },
    { name: "React Query", category: "Frontend", level: 88, order: 8 },
    { name: "Tailwind CSS", category: "Frontend", level: 95, order: 9 },

    // Backend
    { name: "Node.js", category: "Backend", level: 90, order: 10 },
    { name: "Express.js", category: "Backend", level: 90, order: 11 },
    { name: "NestJS", category: "Backend", level: 82, order: 12 },
    { name: "REST APIs", category: "Backend", level: 94, order: 13 },
    { name: "JWT", category: "Backend", level: 90, order: 14 },
    { name: "OAuth", category: "Backend", level: 85, order: 15 },

    // Databases
    { name: "PostgreSQL", category: "Databases", level: 90, order: 16 },
    { name: "MySQL", category: "Databases", level: 85, order: 17 },
    { name: "MongoDB", category: "Databases", level: 85, order: 18 },

    // DevOps and Tools
    { name: "Git", category: "DevOps and Tools", level: 92, order: 19 },
    { name: "GitHub", category: "DevOps and Tools", level: 92, order: 20 },
    { name: "Docker", category: "DevOps and Tools", level: 82, order: 21 },
    { name: "GitHub Actions (CI/CD)", category: "DevOps and Tools", level: 82, order: 22 },
    { name: "AWS", category: "DevOps and Tools", level: 80, order: 23 },
    { name: "Vercel", category: "DevOps and Tools", level: 95, order: 24 },
    { name: "Linux", category: "DevOps and Tools", level: 85, order: 25 },

    // Testing
    { name: "Jest", category: "Testing", level: 85, order: 26 },
    { name: "React Testing Library", category: "Testing", level: 85, order: 27 },
    { name: "Cypress / Playwright", category: "Testing", level: 80, order: 28 },

    // Fundamentals
    { name: "Data Structures & Algorithms", category: "Fundamentals", level: 88, order: 29 },
    { name: "System Design", category: "Fundamentals", level: 84, order: 30 },
    { name: "OOP", category: "Fundamentals", level: 92, order: 31 },
    { name: "HTTP / Networking", category: "Fundamentals", level: 90, order: 32 },
  ];

  for (const skill of skills) {
    const skillId = `skill_${skill.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
    await prisma.skill.upsert({
      where: { id: skillId },
      update: {
        name: skill.name,
        category: skill.category,
        level: skill.level,
        order: skill.order,
      },
      create: {
        id: skillId,
        name: skill.name,
        category: skill.category,
        level: skill.level,
        order: skill.order,
      },
    });
  }
  console.log(`✅ Seeded ${skills.length} skills`);

  // 5. Timeline
  const timeline = [
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

  for (const item of timeline) {
    await prisma.timelineItem.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }
  console.log(`✅ Seeded ${timeline.length} timeline entries`);
  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
