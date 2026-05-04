// src/app/(dashboard)/account/orders/page.tsx
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatPrice, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Package, Eye, ChevronLeft } from "lucide-react"

const statusMap: Record<string, { label: string; variant: any }> = {
  PENDING: { label: "معلق", variant: "warning" },
  CONFIRMED: { label: "مؤكد", variant: "info" },
  PROCESSING: { label: "قيد المعالجة", variant: "info" },
  SHIPPED: { label: "تم الشحن", variant: "default" },
  DELIVERED: { label: "تم التوصيل", variant: "success" },
  CANCELLED: { label: "ملغي", variant: "danger" },
  REFUNDED: { label: "مسترجع", variant: "danger" },
}

export default async function AccountOrdersPage() {
  const session = await auth()

  const orders = await prisma.order.findMany({
    where: { userId: session!.user.id },
    include: {
      items: {
        include: {
          product: { include: { images: { take: 1 } } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">لا توجد طلبات</h2>
        <p className="text-gray-500 mb-6">لم تقم بأي طلب بعد</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
        >
          تسوق الآن
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">طلباتي ({orders.length})</h2>

      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
        >
          {/* Order Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-gray-500">رقم الطلب</span>
                <p className="font-mono font-semibold text-gray-800">{order.orderNumber}</p>
              </div>
              <div>
                <span className="text-gray-500">التاريخ</span>
                <p className="font-medium text-gray-800">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <span className="text-gray-500">الإجمالي</span>
                <p className="font-bold text-indigo-600">{formatPrice(Number(order.total))}</p>
              </div>
            </div>
            <Badge variant={statusMap[order.status]?.variant}>
              {statusMap[order.status]?.label}
            </Badge>
          </div>

          {/* Order Items */}
          <div className="p-6">
            <div className="space-y-3">
              {order.items.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative w-14 h-14 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    {item.product.images[0] ? (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatPrice(Number(item.price))} × {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    {formatPrice(Number(item.price) * item.quantity)}
                  </span>
                </div>
              ))}
              {order.items.length > 3 && (
                <p className="text-sm text-gray-400">
                  و {order.items.length - 3} منتجات أخرى...
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
              <Link
                href={`/account/orders/${order.id}`}
                className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                تفاصيل الطلب
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}