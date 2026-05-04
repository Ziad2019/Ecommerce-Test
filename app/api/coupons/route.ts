// src/app/api/coupons/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await req.json()

  try {
    const coupon = await prisma.coupon.create({ data })
    return NextResponse.json(coupon, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Coupon code already exists" }, { status: 400 })
  }
}