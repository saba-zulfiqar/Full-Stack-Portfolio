import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { skillSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const skills = await prisma.skill.findMany({
      orderBy: [{ category: "asc" }, { order: "asc" }],
    });
    return NextResponse.json(skills);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = skillSchema.parse(body);

    const skill = await prisma.skill.create({
      data: {
        name: data.name,
        category: data.category,
        level: data.level,
        icon: data.icon || null,
        order: data.order,
      },
    });

    revalidatePath("/");
    return NextResponse.json(skill, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: "Failed to create skill", details: error }, { status: 400 });
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
      return NextResponse.json({ error: "Skill ID is required" }, { status: 400 });
    }

    const data = skillSchema.parse(rest);

    const updated = await prisma.skill.update({
      where: { id },
      data: {
        name: data.name,
        category: data.category,
        level: data.level,
        icon: data.icon || null,
        order: data.order,
      },
    });

    revalidatePath("/");
    return NextResponse.json(updated);
  } catch (error: unknown) {
    return NextResponse.json({ error: "Failed to update skill", details: error }, { status: 400 });
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

    await prisma.skill.delete({ where: { id } });
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}
