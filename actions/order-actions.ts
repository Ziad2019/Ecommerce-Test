// src/actions/order-actions.ts
"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { generateOrderNumber } from "@/lib/utils"
import { revalidatePath } from "next/cache"

interface CreateOrderInput {
  items: {
    productId: string
    quantity: number
    variant?: Record<string, string>
  }[]
  shippingAddress: Record<string, string>
  billingAddress?: Record<string, string>
  couponCode?: string
}

export async function createOrder(input: CreateOrderInput) {
  const session = await auth()
  if (!session) throw new Error("يجب تسجيل الدخول")

  const { items, shippingAddress, billingAddress, couponCode } = input

  // Fetch products & validate stock
  const productIds = items.map((i) => i.productId)
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  })

  // Validate
  const orderItems = items.map((item) => {
    const product = products.find((p) => p.id === item.productId)
    if (!product) throw new Error(`المنتج غير موجود`)
    if (product.stock < item.quantity) throw new Error(`${product.name} غير متوفر بالكمية المطلوبة`)

    return {
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: item.quantity,
      variant: item.variant,
    }
  })

  const subtotal = orderItems.reduce((acc, i) => acc + i.price * i.quantity, 0)
  let discount = 0

  // Apply coupon
  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: couponCode, isActive: true },
    })

    if (coupon && (!coupon.expiresAt || coupon.expiresAt > new Date())) {
      if (!coupon.minPurchase || subtotal >= Number(coupon.minPurchase)) {
        discount =
          coupon.type === "PERCENTAGE"
            ? subtotal * (Number(coupon.value) / 100)
            : Number(coupon.value)

        if (coupon.maxDiscount) {
          discount = Math.min(discount, Number(coupon.maxDiscount))
        }

        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        })
      }
    }
  }

  const shipping = subtotal >= 100 ? 0 : 10 // Free shipping over \$100
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal - discount + shipping + tax

  // Create order in transaction
  const order = await prisma.$transaction(async (tx) => {
    // Create order
    const newOrder = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session.user.id,
        subtotal,
        tax,
        shipping,
        discount,
        total,
        shippingAddress,
        billingAddress: billingAddress || shippingAddress,
        items: {
          create: orderItems,
        },
      },
      include: { items: true },
    })

    // Update stock
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    }

    return newOrder
  })

  revalidatePath("/account/orders")
  revalidatePath("/admin/orders")

  return order
}

export async function getOrders(page = 1, limit = 10) {
  const session = await auth()
  if (!session) throw new Error("يجب تسجيل الدخول")

  const where =
    session.user.role === "ADMIN" ? {} : { userId: session.user.id }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: { include: { product: { include: { images: { take: 1 } } } } },
        user: { select: { name: true, email: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ])

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: status as any },
  })

  revalidatePath("/admin/orders")
  revalidatePath(`/admin/orders/${orderId}`)
  return order
}