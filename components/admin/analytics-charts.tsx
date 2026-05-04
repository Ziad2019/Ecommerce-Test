// src/components/admin/analytics-charts.tsx
"use client"

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, Legend,
} from "recharts"
import { formatPrice } from "@/lib/utils"
import Image from "next/image"

interface Props {
  dailyRevenue: any[]
  revenueByCategory: any[]
  ordersByStatus: any[]
  topProducts: any[]
}

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"]

const statusLabels: Record<string, string> = {
  PENDING: "معلق",
  CONFIRMED: "مؤكد",
  PROCESSING: "قيد المعالجة",
  SHIPPED: "تم الشحن",
  DELIVERED: "تم التوصيل",
  CANCELLED: "ملغي",
  REFUNDED: "مسترجع",
}

export function AnalyticsCharts({
  dailyRevenue,
  revenueByCategory,
  ordersByStatus,
  topProducts,
}: Props) {
  const formattedDaily = dailyRevenue.map((item: any) => ({
    date: new Date(item.date).toLocaleDateString("ar-EG", {
      month: "short",
      day: "numeric",
    }),
    revenue: Number(item.revenue),
    orders: Number(item.orders),
  }))

  const formattedCategory = revenueByCategory.map((item: any) => ({
    name: item.name,
    revenue: Number(item.revenue),
  }))

  const formattedStatus = ordersByStatus.map((item: any) => ({
    name: statusLabels[item.status] || item.status,
    value: item._count.status,
  }))

  return (
    <div className="space-y-6">
      {/* Daily Revenue Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-6">
          الإيرادات اليومية (آخر 30 يوم)
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={formattedDaily}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} />
            <YAxis stroke="#9ca3af" fontSize={11} />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                direction: "rtl",
              }}
              formatter={(value: number) => [formatPrice(value), "الإيرادات"]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#6366f1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRev)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue by Category */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            الإيرادات حسب التصنيف
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={formattedCategory} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#9ca3af" fontSize={11} />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#9ca3af"
                fontSize={12}
                width={80}
              />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}
                formatter={(value: number) => [formatPrice(value), "الإيرادات"]}
              />
              <Bar dataKey="revenue" radius={[0, 8, 8, 0]}>
                {formattedCategory.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by Status */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            توزيع حالات الطلبات
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={formattedStatus}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
                labelLine={false}
              >
                {formattedStatus.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-6">
          أفضل 10 منتجات مبيعاً
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-right py-3 text-sm font-semibold text-gray-500">#</th>
                <th className="text-right py-3 text-sm font-semibold text-gray-500">المنتج</th>
                <th className="text-right py-3 text-sm font-semibold text-gray-500">التصنيف</th>
                <th className="text-right py-3 text-sm font-semibold text-gray-500">السعر</th>
                <th className="text-right py-3 text-sm font-semibold text-gray-500">المبيعات</th>
                <th className="text-right py-3 text-sm font-semibold text-gray-500">الإيرادات</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      index < 3 ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-500"
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
                        {product.images[0] && (
                          <Image src={product.images[0].url} alt="" fill className="object-cover" />
                        )}
                      </div>
                      <span className="font-medium text-gray-800 text-sm">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-sm text-gray-500">{product.category.name}</td>
                  <td className="py-3 text-sm font-semibold">{formatPrice(Number(product.price))}</td>
                  <td className="py-3 text-sm text-gray-600">{product._count.orderItems}</td>
                  <td className="py-3 text-sm font-bold text-indigo-600">
                    {formatPrice(Number(product.price) * product._count.orderItems)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}