// src/actions/wishlist-actions.ts
"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function toggleWishlist(productId: string) {
  const session = await auth()
  if (!session) throw new Error("يجب تسجيل الدخول")

  const existing = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId,
      },
    },
  })

  if (existing) {
    await prisma.wishlist.delete({ where: { id: existing.id } })
    revalidatePath("/wishlist")
    return { added: false }
  }

  await prisma.wishlist.create({
    data: {
      userId: session.user.id,
      productId,
    },
  })

  revalidatePath("/wishlist")
  return { added: true }
}

export async function getWishlist() {
  const session = await auth()
  if (!session) return []

  const wishlist = await prisma.wishlist.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: {
          images: { take: 1 },
          category: { select: { name: true, slug: true } },
          reviews: { select: { rating: true } },
          _count: { select: { reviews: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return wishlist
}

export async function isInWishlist(productId: string) {
  const session = await auth()
  if (!session) return false

  const item = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId,
      },
    },
  })

  return !!item
}