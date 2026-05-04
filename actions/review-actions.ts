// src/actions/review-actions.ts
"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { reviewSchema } from "@/lib/validators"
import { revalidatePath } from "next/cache"

export async function createReview(productId: string, data: FormData) {
  const session = await auth()
  if (!session) throw new Error("يجب تسجيل الدخول")

  const rawData = {
    rating: Number(data.get("rating")),
    title: data.get("title") as string,
    comment: data.get("comment") as string,
  }

  const validated = reviewSchema.parse(rawData)

  // Check if already reviewed
  const existing = await prisma.review.findUnique({
    where: {
      userId_productId: {
        userId: session.user.id,
        productId,
      },
    },
  })

  if (existing) {
    throw new Error("لقد قمت بتقييم هذا المنتج مسبقاً")
  }

  // Check if user purchased the product
  const hasPurchased = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: {
        userId: session.user.id,
        status: "DELIVERED",
      },
    },
  })

  const review = await prisma.review.create({
    data: {
      ...validated,
      userId: session.user.id,
      productId,
      isVerified: !!hasPurchased,
    },
  })

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { slug: true },
  })

  revalidatePath(`/products/${product?.slug}`)
  return review
}

export async function deleteReview(reviewId: string) {
  const session = await auth()
  if (!session) throw new Error("يجب تسجيل الدخول")

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: { product: { select: { slug: true } } },
  })

  if (!review) throw new Error("التقييم غير موجود")

  // Only the reviewer or admin can delete
  if (review.userId !== session.user.id && session.user.role !== "ADMIN") {
    throw new Error("غير مصرح لك بحذف هذا التقييم")
  }

  await prisma.review.delete({ where: { id: reviewId } })
  revalidatePath(`/products/${review.product.slug}`)
}