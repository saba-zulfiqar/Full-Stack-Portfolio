import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";
import { sendContactNotification } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const limiter = rateLimit(ip, 5, 60 * 1000);

    if (!limiter.success) {
      return NextResponse.json(
        { error: "Too many messages sent. Please wait a minute before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validatedData = contactSchema.parse(body);

    // Save to Database if reachable
    try {
      await prisma.message.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          subject: validatedData.subject || null,
          message: validatedData.message,
        },
      });
    } catch (dbErr) {
      console.warn("[Contact Route] Database write skipped or error:", dbErr);
    }

    // Send email notification (or simulate if no Resend key)
    try {
      await sendContactNotification(validatedData);
    } catch (emailErr) {
      console.error("[Contact Route] Email send error:", emailErr);
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been delivered successfully.",
    });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "issues" in err) {
      return NextResponse.json(
        { error: "Validation failed", details: err },
        { status: 400 }
      );
    }
    console.error("[Contact API Error]", err);
    return NextResponse.json(
      { error: "Failed to process message. Please try again." },
      { status: 500 }
    );
  }
}
