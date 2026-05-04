// src/app/(dashboard)/admin/orders/[id]/page.tsx
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { formatPrice, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { OrderStatusUpdate } from "@/components/admin/order-status-update"
import Image from "next/image"
import {
  User, MapPin, CreditCard, Package, Truck,
  Calendar, Hash, Mail, Phone
} from "lucide-react"

interface Props {
  params: { id: string }
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      items: {
        include: {
          product: { include: { images: { take: 1 } } },
        },
      },
      coupon: true,
    },
  })

  if (!order) notFound()

  const shippingAddress = order.shippingAddress as any

  const timeline = [
    { status: "PENDING", label: "تم إنشاء الطلب", icon: Hash },
    { status: "CONFIRMED", label: "تم تأكيد الطلب", icon: Package },
    { status: "PROCESSING", label: "قيد المعالجة", icon: Package },
    { status: "SHIPPED", label: "تم الشحن", icon: Truck },
    { status: "DELIVERED", label: "تم التوصيل", icon: MapPin },
  ]

  const currentStatusIndex = timeline.findIndex((t) => t.status === order.status)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            الطلب #{order.orderNumber}
          </h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {formatDate(order.createdAt)}
          </p>
        </div>
        <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
      </div>

      {/* Order Timeline */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-800 mb-6">تتبع الطلب</h3>
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-5 right-5 left-5 h-1 bg-gray-200 rounded-full">
            <div
              className="h-full bg-gradient-to-l from-indigo-600 to-purple-600 rounded-full transition-all duration-500"
              style={{
                width: `${order.status === "CANCELLED" || order.status === "REFUNDED" ? 0 : (currentStatusIndex / (timeline.length - 1)) * 100}%`,
              }}
            />
          </div>

          {timeline.map((step, index) => {
            const isCompleted = index <= currentStatusIndex
            const isCurrent = index === currentStatusIndex

            return (
              <div key={step.status} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                      : "bg-gray-200 text-gray-400"
                  } ${isCurrent ? "ring-4 ring-indigo-100" : ""}`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-xs mt-2 font-medium whitespace-nowrap ${
                    isCompleted ? "text-indigo-600" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-600" />
              المنتجات ({order.items.length})
            </h3>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                >
                  <div className="relative w-20 h-20 bg-white rounded-xl overflow-hidden flex-shrink-0">
                    {item.product.images[0] ? (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{item.name}</h4>
                    {item.variant && (
                      <div className="flex gap-1 mt-1">
                        {Object.entries(item.variant as any).map(([key, val]) => (
                          <span key={key} className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-500">
                            {key}: {String(val)}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-500">
                        {formatPrice(Number(item.price))} × {item.quantity}
                      </span>
                      <span className="font-bold text-gray-800">
                        {formatPrice(Number(item.price) * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
              <div className="flex justify-between text-sm text-gray-500">
                <span>المجموع الفرعي</span>
                <span>{formatPrice(Number(order.subtotal))}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>الشحن</span>
                <span>{Number(order.shipping) === 0 ? "مجاني" : formatPrice(Number(order.shipping))}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>الضريبة</span>
                <span>{formatPrice(Number(order.tax))}</span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>الخصم {order.coupon && `(${order.coupon.code})`}</span>
                  <span>-{formatPrice(Number(order.discount))}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-200">
                <span>الإجمالي</span>
                <span className="text-indigo-600">{formatPrice(Number(order.total))}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              معلومات العميل
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {order.user.image ? (
                  <img src={order.user.image} alt="" className="w-10 h-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">{order.user.name?.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-800">{order.user.name}</p>
                  <p className="text-sm text-gray-500">{order.user.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-600" />
              عنوان التوصيل
            </h3>
            {shippingAddress && (
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-semibold text-gray-800">{shippingAddress.name}</p>
                <p>{shippingAddress.street}</p>
                <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                <p>{shippingAddress.country}</p>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{shippingAddress.phone}</span>
                </div>
              </div>
            )}
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              معلومات الدفع
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">طريقة الدفع</span>
                <span className="font-medium text-gray-800">
                  {order.paymentMethod === "stripe" ? "بطاقة ائتمان" : "غير محدد"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">حالة الدفع</span>
                <Badge variant={order.paymentStatus === "PAID" ? "success" : "warning"}>
                  {order.paymentStatus === "PAID" ? "مدفوع" : "في الانتظار"}
                </Badge>
              </div>
              {order.stripePaymentId && (
                <div className="flex justify-between">
                  <span className="text-gray-500">رقم المعاملة</span>
                  <span className="font-mono text-xs text-gray-600">
                    {order.stripePaymentId.substring(0, 20)}...
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}