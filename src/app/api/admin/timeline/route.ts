import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { timelineSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const items = await prisma.timelineItem.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch timeline items" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = timelineSchema.parse(body);

    const item = await prisma.timelineItem.create({
      data: {
        type: data.type,
        title: data.title,
        organization: data.organization,
        period: data.period,
        description: data.description,
        current: data.current,
        order: data.order,
      },
    });

    revalidatePath("/");
    return NextResponse.json(item, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: "Failed to create timeline item", details: error }, { status: 400 });
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
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const data = timelineSchema.parse(rest);

    const updated = await prisma.timelineItem.update({
      where: { id },
      data: {
        type: data.type,
        title: data.title,
        organization: data.organization,
        period: data.period,
        description: data.description,
        current: data.current,
        order: data.order,
      },
    });

    revalidatePath("/");
    return NextResponse.json(updated);
  } catch (error: unknown) {
    return NextResponse.json({ error: "Failed to update timeline item", details: error }, { status: 400 });
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

    await prisma.timelineItem.delete({ where: { id } });
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete timeline item" }, { status: 500 });
  }
}
