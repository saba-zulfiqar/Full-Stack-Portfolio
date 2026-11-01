import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from "fs";
import path from "path";

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
      return NextResponse.json({ error: "Image is too large (max 5 MB). Please choose a smaller image." }, { status: 400 });
    }

    const isResume = type === "resume";
    const allowedImages = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml"];
    const allowedResume = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"];
    const allowed = isResume ? [...allowedImages, ...allowedResume] : allowedImages;
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: isResume ? "Invalid file type. Use PDF or DOCX." : "Invalid file type" }, { status: 400 });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // If Cloudinary credentials are provided, upload to Cloudinary
    if (cloudName && apiKey && apiSecret) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Data = `data:${file.type};base64,${buffer.toString("base64")}`;

      const timestamp = Math.round(new Date().getTime() / 1000);
      const signaturePayload = `timestamp=${timestamp}${apiSecret}`;
      const crypto = await import("crypto");
      const signature = crypto.createHash("sha1").update(signaturePayload).digest("hex");

      const cloudFormData = new FormData();
      cloudFormData.append("file", base64Data);
      cloudFormData.append("api_key", apiKey);
      cloudFormData.append("timestamp", String(timestamp));
      cloudFormData.append("signature", signature);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${isResume ? "raw" : "image"}/upload`, {
        method: "POST",
        body: cloudFormData,
      });

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({ url: data.secure_url });
      }
    }

    if (isResume) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      if (file.type === "application/pdf") {
        const filepath = path.join(process.cwd(), "public", "resume.pdf");
        fs.writeFileSync(filepath, buffer);
        return NextResponse.json({ url: "/resume.pdf" });
      } else {
        const ext = file.name.split(".").pop() || "docx";
        const safeExt = ext.toLowerCase() === "doc" ? "doc" : "docx";
        const filename = `resume-${Date.now()}.${safeExt}`;
        const uploadDir = path.join(process.cwd(), "public");
        const filepath = path.join(uploadDir, filename);
        fs.writeFileSync(filepath, buffer);
        return NextResponse.json({ url: `/${filename}` });
      }
    }

    // Save locally to public/uploads
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split(".").pop() || "png";
    let safeExt = ["png", "jpg", "jpeg", "webp", "svg"].includes(ext.toLowerCase()) ? ext.toLowerCase() : "png";
    if (file.type === "image/webp") safeExt = "webp";
    if (file.type === "image/svg+xml") safeExt = "svg";
    const filename = `project-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, buffer);
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    return NextResponse.json({ error: "Image processing failed" }, { status: 500 });
  }
}
