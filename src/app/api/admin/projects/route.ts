import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { projectSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { cleanImageUrl } from "@/lib/images";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = projectSchema.parse(body);

    const project = await prisma.project.create({
      data: {
        title: data.title,
        slug: data.slug,
        shortDescription: data.shortDescription,
        description: data.description,
        techTags: JSON.stringify(data.techTags),
        liveUrl: data.liveUrl || null,
        githubUrl: data.githubUrl || null,
        imageUrl: cleanImageUrl(data.imageUrl),
        category: data.category,
        featured: data.featured,
        published: data.published,
        order: data.order,
      },
    });

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath(`/projects/${project.slug}`);

    return NextResponse.json(project, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Failed to create project", details: error },
      { status: 400 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...rest } = body;
    if (!id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const data = projectSchema.parse(rest);

    const updated = await prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        shortDescription: data.shortDescription,
        description: data.description,
        techTags: JSON.stringify(data.techTags),
        liveUrl: data.liveUrl || null,
        githubUrl: data.githubUrl || null,
        imageUrl: cleanImageUrl(data.imageUrl),
        category: data.category,
        featured: data.featured,
        published: data.published,
        order: data.order,
      },
    });

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath(`/projects/${updated.slug}`);

    return NextResponse.json(updated);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Failed to update project", details: error },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID parameter is required" }, { status: 400 });
    }

    await prisma.project.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/projects");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
