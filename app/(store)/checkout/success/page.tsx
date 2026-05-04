// src/app/(store)/checkout/success/page.tsx
import { prisma } from "@/lib/prisma"
import { formatPrice, formatDate } from "@/lib/utils"
import { CheckCircle, Package, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"
// import confetti from "canvas-confetti"

interface Props {
  searchParams: { orderId?: string }
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  if (!searchParams.orderId) redirect("/")

  const order = await prisma.order.findUnique({
    where: { id: searchParams.orderId },
    include: {
      items: { include: { product: { include: { images: { take: 1 } } } } },
    },
  })

  if (!order) redirect("/")

  return (
    <div className="container-custom py-12 max-w-2xl">
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          🎉 تم الطلب بنجاح!
        </h1>
        <p className="text-gray-500 text-lg">
          شكراً لك! تم استلام طلبك وسيتم معالجته قريباً.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500">رقم الطلب</p>
            <p className="font-mono font-bold text-indigo-600">{order.orderNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">التاريخ</p>
            <p className="font-semibold text-gray-800">{formatDate(order.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">الإجمالي</p>
            <p className="font-bold text-gray-800">{formatPrice(Number(order.total))}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">حالة الدفع</p>
            <p className="font-semibold text-green-600">مدفوع ✓</p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-indigo-600" />
          المنتجات المطلوبة
        </h3>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 bg-gray-50 rounded-xl p-3">
              <div className="relative w-14 h-14 bg-white rounded-lg overflow-hidden flex-shrink-0">
                {item.product.images[0] && (
                  <img src={item.product.images[0].url} alt={item.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-500">{formatPrice(Number(item.price))} × {item.quantity}</p>
              </div>
              <p className="font-semibold text-gray-800">
                {formatPrice(Number(item.price) * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/account/orders">
          <Button variant="gradient" size="lg">
            تتبع طلبك
          </Button>
        </Link>
        <Link href="/products">
          <Button variant="outline" size="lg">
            <ArrowLeft className="w-5 h-5 mr-2" />
            متابعة التسوق
          </Button>
        </Link>
      </div>
    </div>
  )
}