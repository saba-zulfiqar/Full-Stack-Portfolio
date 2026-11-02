import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const directUrl = formData.get("url") as string | null;
    const type = formData.get("type") as string | null;

    if (directUrl) {
      return NextResponse.json({ url: directUrl });
    }

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 5 MB). Please choose a smaller image." }, { status: 400 });
    }

    const isResume = type === "resume";
    const allowedImages = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml"];
    const allowedResume = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"];
    const allowed = isResume ? [...allowedImages, ...allowedResume] : allowedImages;
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: isResume ? "Invalid file type. Use PDF or DOCX." : "Invalid file type" }, { status: 400 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error("[UPLOAD] Missing Cloudinary env vars");
      return NextResponse.json({ error: "Missing Cloudinary configuration. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET." }, { status: 500 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64Data, {
      folder: "portfolio",
      resource_type: isResume ? "auto" : "image",
      use_filename: false,
      unique_filename: true,
    });

    if (!result?.secure_url) {
      console.error("[UPLOAD] Cloudinary returned no secure_url", result);
      return NextResponse.json({ error: "Upload failed: no URL returned from Cloudinary" }, { status: 500 });
    }

    return NextResponse.json({ url: result.secure_url });
  } catch (error: any) {
    console.error("[UPLOAD] Error:", error);
    return NextResponse.json({ error: error?.message || "Image processing failed" }, { status: 500 });
  }
}
