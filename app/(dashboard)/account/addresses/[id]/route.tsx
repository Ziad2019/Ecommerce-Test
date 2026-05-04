// src/app/api/account/addresses/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // تأكد إن العنوان بتاع المستخدم ده
  const address = await prisma.address.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  })

  if (!address) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await prisma.address.delete({ where: { id: params.id } })

  return NextResponse.json({ success: true })
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await req.json()

  // لو بنخليه افتراضي
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.user.id, isDefault: true },
      data: { isDefault: false },
    })
  }

  const address = await prisma.address.update({
    where: { id: params.id },
    data,
  })

  return NextResponse.json(address)
}