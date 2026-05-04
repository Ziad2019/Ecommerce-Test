// src/app/(store)/checkout/page.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "إتمام الطلب" }

export default async function CheckoutPage() {
  const session = await auth()
  if (!session) redirect("/login?callbackUrl=/checkout")

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">إتمام الطلب</h1>
      <CheckoutForm user={session.user} />
    </div>
  )
}