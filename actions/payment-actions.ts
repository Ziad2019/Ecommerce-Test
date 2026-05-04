// src/actions/payment-actions.ts
"use server"

import { stripe } from "@/lib/stripe"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function createCheckoutSession(orderId: string) {
  const session = await auth()
  if (!session) throw new Error("يجب تسجيل الدخول")

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: { include: { images: { take: 1 } } } } } },
  })

  if (!order) throw new Error("الطلب غير موجود")

  const lineItems = order.items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
        images: item.product.images[0] ? [item.product.images[0].url] : [],
      },
      unit_amount: Math.round(Number(item.price) * 100),
    },
    quantity: item.quantity,
  }))

  // Add shipping
  if (Number(order.shipping) > 0) {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Shipping", images: [] },
        unit_amount: Math.round(Number(order.shipping) * 100),
      },
      quantity: 1,
    })
  }

  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?orderId=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
    metadata: {
      orderId: order.id,
      userId: session.user.id,
    },
    customer_email: session.user.email!,
  })

  return { url: stripeSession.url }
}