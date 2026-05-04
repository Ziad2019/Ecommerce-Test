// src/components/admin/recent-orders.tsx
import { Badge } from "@/components/ui/badge"
import { formatPrice, formatDate } from "@/lib/utils"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const statusMap: Record<string, { label: string; variant: any }> = {
  PENDING: { label: "معلق", variant: "warning" },
  CONFIRMED: { label: "مؤكد", variant: "info" },
  PROCESSING: { label: "قيد المعالجة", variant: "info" },
  SHIPPED: { label: "تم الشحن", variant: "default" },
  DELIVERED: { label: "تم التوصيل", variant: "success" },
  CANCELLED: { label: "ملغي", variant: "danger" },
  REFUNDED: { label: "مسترجع", variant: "danger" },
}

interface Props {
  orders: any[]
}

export function RecentOrders({ orders }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">أحدث الطلبات</h3>
        <Link
          href="/admin/orders"
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
        >
          عرض الكل
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-right py-3 text-sm font-semibold text-gray-500">رقم الطلب</th>
              <th className="text-right py-3 text-sm font-semibold text-gray-500">العميل</th>
              <th className="text-right py-3 text-sm font-semibold text-gray-500">المبلغ</th>
              <th className="text-right py-3 text-sm font-semibold text-gray-500">الحالة</th>
              <th className="text-right py-3 text-sm font-semibold text-gray-500">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-4">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-sm font-mono text-indigo-600 hover:underline"
                  >
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    {order.user.image ? (
                      <img src={order.user.image} alt="" className="w-7 h-7 rounded-full" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                        {order.user.name?.charAt(0)}
                      </div>
                    )}
                    <span className="text-sm text-gray-700">{order.user.name}</span>
                  </div>
                </td>
                <td className="py-4">
                  <span className="text-sm font-semibold text-gray-800">
                    {formatPrice(Number(order.total))}
                  </span>
                </td>
                <td className="py-4">
                  <Badge variant={statusMap[order.status]?.variant}>
                    {statusMap[order.status]?.label}
                  </Badge>
                </td>
                <td className="py-4">
                  <span className="text-sm text-gray-500">{formatDate(order.createdAt)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}