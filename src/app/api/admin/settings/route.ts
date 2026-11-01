import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { profileSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { getProfile } from "@/lib/data";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getProfile();
  return NextResponse.json(profile);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = profileSchema.parse(body);

    const finalLocation = data.availability?.trim()
      ? `${data.location.trim()} | ${data.availability.trim()}`
      : data.location.trim();

    const existing = await prisma.profile.findFirst();

    let updated;
    if (existing) {
      updated = await prisma.profile.update({
        where: { id: existing.id },
        data: {
          name: data.name,
          title: data.title,
          bio: data.bio,
          email: data.email,
          phone: data.phone,
          location: finalLocation,
          githubUrl: data.githubUrl || null,
          linkedinUrl: data.linkedinUrl || null,
          resumeUrl: data.resumeUrl,
          yearsExperience: data.yearsExperience,
          projectsCompleted: data.projectsCompleted,
          availableForWork: data.availableForWork,
        },
      });
    } else {
      updated = await prisma.profile.create({
        data: {
          id: "profile_saba",
          name: data.name,
          title: data.title,
          bio: data.bio,
          email: data.email,
          phone: data.phone,
          location: finalLocation,
          githubUrl: data.githubUrl || null,
          linkedinUrl: data.linkedinUrl || null,
          resumeUrl: data.resumeUrl,
          yearsExperience: data.yearsExperience,
          projectsCompleted: data.projectsCompleted,
          availableForWork: data.availableForWork,
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/#about");
    revalidatePath("/admin/settings");
    return NextResponse.json(updated);
  } catch (error: unknown) {
    return NextResponse.json({ error: "Failed to update profile settings", details: error }, { status: 400 });
  }
}
