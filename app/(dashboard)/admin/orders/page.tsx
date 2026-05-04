// src/app/(dashboard)/admin/orders/page.tsx
import { prisma } from "@/lib/prisma"
import { formatPrice, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Eye, Download, Filter } from "lucide-react"

const statusMap: Record<string, { label: string; variant: any; color: string }> = {
  PENDING: { label: "معلق", variant: "warning", color: "bg-yellow-500" },
  CONFIRMED: { label: "مؤكد", variant: "info", color: "bg-blue-500" },
  PROCESSING: { label: "قيد المعالجة", variant: "info", color: "bg-indigo-500" },
  SHIPPED: { label: "تم الشحن", variant: "default", color: "bg-purple-500" },
  DELIVERED: { label: "تم التوصيل", variant: "success", color: "bg-green-500" },
  CANCELLED: { label: "ملغي", variant: "danger", color: "bg-red-500" },
  REFUNDED: { label: "مسترجع", variant: "danger", color: "bg-gray-500" },
}

const paymentStatusMap: Record<string, { label: string; variant: any }> = {
  PENDING: { label: "في الانتظار", variant: "warning" },
  PAID: { label: "مدفوع", variant: "success" },
  FAILED: { label: "فشل", variant: "danger" },
  REFUNDED: { label: "مسترجع", variant: "info" },
}

interface Props {
  searchParams: { status?: string; page?: string; search?: string }
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const page = Number(searchParams.page) || 1
  const limit = 15

  const where: any = {}
  if (searchParams.status) where.status = searchParams.status
  if (searchParams.search) {
    where.OR = [
      { orderNumber: { contains: searchParams.search, mode: "insensitive" } },
      { user: { name: { contains: searchParams.search, mode: "insensitive" } } },
      { user: { email: { contains: searchParams.search, mode: "insensitive" } } },
    ]
  }

  const [orders, total, statusCounts] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true, image: true } },
        items: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
    prisma.order.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">الطلبات</h1>
          <p className="text-gray-500">{total} طلب</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-all">
          <Download className="w-4 h-4" />
          تصدير CSV
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Link
          href="/admin/orders"
          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
            !searchParams.status
              ? "bg-indigo-100 text-indigo-600"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          الكل ({total})
        </Link>
        {Object.entries(statusMap).map(([key, value]) => {
          const count = statusCounts.find((s) => s.status === key)?._count.status || 0
          return (
            <Link
              key={key}
              href={`/admin/orders?status=${key}`}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                searchParams.status === key
                  ? "bg-indigo-100 text-indigo-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${value.color}`} />
              {value.label} ({count})
            </Link>
          )
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-500">رقم الطلب</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-500">العميل</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-500">المنتجات</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-500">المبلغ</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-500">الحالة</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-500">الدفع</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-500">التاريخ</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-500">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-mono text-sm text-indigo-600 hover:underline font-medium"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {order.user.image ? (
                        <img src={order.user.image} alt="" className="w-8 h-8 rounded-full" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                          {order.user.name?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-800">{order.user.name}</p>
                        <p className="text-xs text-gray-400">{order.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {order.items.length} منتج ({order.items.reduce((acc, i) => acc + i.quantity, 0)} قطعة)
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-800">
                      {formatPrice(Number(order.total))}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={statusMap[order.status]?.variant}>
                      {statusMap[order.status]?.label}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={paymentStatusMap[order.paymentStatus]?.variant}>
                      {paymentStatusMap[order.paymentStatus]?.label}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">{formatDate(order.createdAt)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="p-2 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-all inline-flex"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">لا توجد طلبات</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              عرض {(page - 1) * limit + 1} - {Math.min(page * limit, total)} من {total}
            </p>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <Link
                  key={i}
                  href={`/admin/orders?page=${i + 1}${searchParams.status ? `&status=${searchParams.status}` : ""}`}
                  className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center transition-all ${
                    page === i + 1
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {i + 1}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}