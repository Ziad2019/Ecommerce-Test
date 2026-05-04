// src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q") || ""
  const limit = Number(searchParams.get("limit")) || 10

  try {
    const products = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { sku: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        images: { take: 1, select: { url: true } },
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: "Failed to search" }, { status: 500 })
  }
}