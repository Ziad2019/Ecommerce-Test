// src/app/api/stripe/webhook/route.ts
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      const orderId = session.metadata?.orderId

      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: "PAID",
            status: "CONFIRMED",
            stripePaymentId: session.payment_intent as string,
            paymentMethod: "stripe",
          },
        })
      }
      break
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge
      const paymentIntentId = charge.payment_intent as string

      await prisma.order.updateMany({
        where: { stripePaymentId: paymentIntentId },
        data: {
          paymentStatus: "REFUNDED",
          status: "REFUNDED",
        },
      })
      break
    }
  }

  return NextResponse.json({ received: true })
}