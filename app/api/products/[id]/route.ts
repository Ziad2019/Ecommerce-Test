// src/app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: true,
        category: true,
        variants: true,
        reviews: {
          include: { user: { select: { name: true, image: true } } },
          take: 10,
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}