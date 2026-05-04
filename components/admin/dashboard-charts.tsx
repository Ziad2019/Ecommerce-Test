// src/components/admin/dashboard-charts.tsx
"use client"

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
} from "recharts"
import { useState } from "react"

interface Props {
  monthlyData: any[]
}

export function DashboardCharts({ monthlyData }: Props) {
  const [activeChart, setActiveChart] = useState<"revenue" | "orders">("revenue")

  const formattedData = monthlyData.map((item: any) => ({
    month: new Date(item.month).toLocaleDateString("ar-EG", { month: "short" }),
    revenue: Number(item.revenue),
    orders: Number(item.orders),
  }))

  // Pie data for order status
  const pieData = [
    { name: "مكتمل", value: 65, color: "#10b981" },
    { name: "قيد المعالجة", value: 20, color: "#6366f1" },
    { name: "قيد الشحن", value: 10, color: "#f59e0b" },
    { name: "ملغي", value: 5, color: "#ef4444" },
  ]

  return (
    <div className="grid lg:grid-cols-[1fr_350px] gap-6">
      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800">الإيرادات والطلبات</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveChart("revenue")}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeChart === "revenue"
                  ? "bg-indigo-100 text-indigo-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              الإيرادات
            </button>
            <button
              onClick={() => setActiveChart("orders")}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeChart === "orders"
                  ? "bg-indigo-100 text-indigo-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              الطلبات
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          {activeChart === "revenue" ? (
            <AreaChart data={formattedData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          ) : (
            <BarChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                }}
              />
              <Bar dataKey="orders" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Pie Chart - Order Status */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-6">حالة الطلبات</h3>

        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="space-y-3 mt-4">
          {pieData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
              <span className="text-sm font-semibold text-gray-800">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}