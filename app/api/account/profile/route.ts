// src/app/api/account/profile/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await req.json()

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: data.name,
      phone: data.phone,
    },
  })

  return NextResponse.json(user)
}