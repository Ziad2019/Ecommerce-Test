// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { auth } from "@/lib/auth"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const ext = file.name.split(".").pop()
    const filename = `${uuidv4()}.${ext}`

    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), "public", "uploads")
    await mkdir(uploadDir, { recursive: true })

    // Save file
    const filepath = join(uploadDir, filename)
    await writeFile(filepath, buffer)

    const url = `/uploads/${filename}`

    return NextResponse.json({ url, filename })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}