// src/app/(dashboard)/admin/analytics/page.tsx
import { prisma } from "@/lib/prisma"
import { formatPrice } from "@/lib/utils"
import { AnalyticsCharts } from "@/components/admin/analytics-charts"
import {
  DollarSign, ShoppingCart, Users, TrendingUp,
  Eye, BarChart3, ArrowUpRight, ArrowDownRight,
} from "lucide-react"

export default async function AnalyticsPage() {
  const now = new Date()
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

  const [
    thisMonthRevenue,
    lastMonthRevenue,
    thisMonthOrders,
    lastMonthOrders,
    thisMonthCustomers,
    lastMonthCustomers,
    topSellingProducts,
    revenueByCategory,
    dailyRevenue,
    ordersByStatus,
  ] = await Promise.all([
    // This month revenue
    prisma.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "PAID", createdAt: { gte: thisMonth } },
    }),
    // Last month revenue
    prisma.order.aggregate({
      _sum: { total: true },
      where: {
        paymentStatus: "PAID",
        createdAt: { gte: lastMonth, lte: lastMonthEnd },
      },
    }),
    // This month orders
    prisma.order.count({ where: { createdAt: { gte: thisMonth } } }),
    // Last month orders
    prisma.order.count({
      where: { createdAt: { gte: lastMonth, lte: lastMonthEnd } },
    }),
    // This month customers
    prisma.user.count({
      where: { role: "USER", createdAt: { gte: thisMonth } },
    }),
    // Last month customers
    prisma.user.count({
      where: { role: "USER", createdAt: { gte: lastMonth, lte: lastMonthEnd } },
    }),
    // Top selling products
    prisma.product.findMany({
      take: 10,
      orderBy: { orderItems: { _count: "desc" } },
      include: {
        images: { take: 1 },
        category: { select: { name: true } },
        _count: { select: { orderItems: true } },
      },
    }),
    // Revenue by category
    prisma.$queryRaw`
      SELECT c.name, SUM(oi.price * oi.quantity) as revenue
      FROM order_items oi
      JOIN products p ON oi."productId" = p.id
      JOIN categories c ON p."categoryId" = c.id
      JOIN orders o ON oi."orderId" = o.id
      WHERE o."paymentStatus" = 'PAID'
      GROUP BY c.name
      ORDER BY revenue DESC
    ` as Promise<any[]>,
    // Daily revenue (last 30 days)
    prisma.$queryRaw`
      SELECT DATE("createdAt") as date, SUM(total) as revenue, COUNT(*) as orders
      FROM orders
      WHERE "paymentStatus" = 'PAID'
      AND "createdAt" >= NOW() - INTERVAL '30 days'
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    ` as Promise<any[]>,
    // Orders by status
    prisma.order.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
  ])

  const currentRevenue = Number(thisMonthRevenue._sum.total || 0)
  const previousRevenue = Number(lastMonthRevenue._sum.total || 0)
  const revenueChange = previousRevenue > 0
    ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
    : 0

  const ordersChange = lastMonthOrders > 0
    ? ((thisMonthOrders - lastMonthOrders) / lastMonthOrders) * 100
    : 0

  const customersChange = lastMonthCustomers > 0
    ? ((thisMonthCustomers - lastMonthCustomers) / lastMonthCustomers) * 100
    : 0

  const avgOrderValue = thisMonthOrders > 0 ? currentRevenue / thisMonthOrders : 0

  const stats = [
    {
      title: "إيرادات الشهر",
      value: formatPrice(currentRevenue),
      change: revenueChange,
      icon: DollarSign,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "طلبات الشهر",
      value: thisMonthOrders.toLocaleString(),
      change: ordersChange,
      icon: ShoppingCart,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "عملاء جدد",
      value: thisMonthCustomers.toLocaleString(),
      change: customersChange,
      icon: Users,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "متوسط قيمة الطلب",
      value: formatPrice(avgOrderValue),
      change: 0,
      icon: TrendingUp,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">التحليلات</h1>
        <p className="text-gray-500">إحصائيات وتحليلات مفصلة لأداء المتجر</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              {stat.change !== 0 && (
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.change > 0 ? "text-green-600" : "text-red-600"
                }`}>
                  {stat.change > 0 ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {Math.abs(stat.change).toFixed(1)}%
                </div>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <AnalyticsCharts
        dailyRevenue={dailyRevenue}
        revenueByCategory={revenueByCategory}
        ordersByStatus={ordersByStatus}
        topProducts={topSellingProducts}
      />
    </div>
  )
}