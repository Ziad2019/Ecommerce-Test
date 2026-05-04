// app/(dashboard)/admin/page.tsx
import { prisma } from "@/lib/prisma"
import { formatPrice } from "@/lib/utils"
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
  const [
    deliveredOrders,
    totalOrders,
    totalCustomers,
    totalProducts,
    recentOrders,
    lowStockProducts,
  ] = await Promise.all([
    // ✅ بدل $queryRaw
    prisma.order.findMany({
      where: { status: "DELIVERED" },
      select: { total: true },
    }),
    prisma.order.count(),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.product.count({ where: { status: "ACTIVE" } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        items: { take: 1 },
      },
    }),
    prisma.product.findMany({
      where: { stock: { lte: 5 }, status: "ACTIVE" },
      select: { name: true, stock: true },
      take: 5,
    }),
  ])

  // ✅ حساب الـ Revenue يدوياً
  const totalRevenue = deliveredOrders.reduce(
    (acc, order) => acc + Number(order.total),
    0
  )

  const stats = [
    {
      title: "إجمالي الإيرادات",
      value: formatPrice(totalRevenue),
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "إجمالي الطلبات",
      value: totalOrders.toLocaleString(),
      change: "+8.2%",
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "العملاء",
      value: totalCustomers.toLocaleString(),
      change: "+5.1%",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "المنتجات النشطة",
      value: totalProducts.toLocaleString(),
      change: "+2.3%",
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  const statusLabels: Record<string, { label: string; color: string }> = {
    PENDING:    { label: "معلق",     color: "bg-yellow-100 text-yellow-700" },
    PROCESSING: { label: "جاري",     color: "bg-blue-100 text-blue-700" },
    SHIPPED:    { label: "شُحن",     color: "bg-indigo-100 text-indigo-700" },
    DELIVERED:  { label: "تم التسليم", color: "bg-green-100 text-green-700" },
    CANCELLED:  { label: "ملغي",     color: "bg-red-100 text-red-700" },
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">لوحة التحكم</h1>
        <p className="text-gray-500 mt-1">نظرة عامة على أداء المتجر</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                <TrendingUp className="w-4 h-4" />
                {stat.change}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">أحدث الطلبات</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-indigo-600 hover:underline"
            >
              عرض الكل
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-center text-gray-400 py-8">لا توجد طلبات بعد</p>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {order.user?.name || "مستخدم"}
                    </p>
                    <p className="text-xs text-gray-500">{order.orderNumber}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        statusLabels[order.status]?.color || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {statusLabels[order.status]?.label || order.status}
                    </span>
                    <p className="font-bold text-gray-800 text-sm">
                      {formatPrice(Number(order.total))}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">مخزون منخفض ⚠️</h2>
            <Link
              href="/admin/products"
              className="text-sm text-indigo-600 hover:underline"
            >
              عرض الكل
            </Link>
          </div>
          <div className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-center text-gray-400 py-8">
                ✅ المخزون ممتاز
              </p>
            ) : (
              lowStockProducts.map((product, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-orange-50 rounded-xl"
                >
                  <p className="font-medium text-gray-800 text-sm">
                    {product.name}
                  </p>
                  <span
                    className={`text-sm font-bold px-3 py-1 rounded-full ${
                      product.stock === 0
                        ? "bg-red-100 text-red-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {product.stock === 0 ? "نفد المخزون" : `${product.stock} متبقي`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}