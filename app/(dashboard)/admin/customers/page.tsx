// src/app/(dashboard)/admin/customers/page.tsx
import { prisma } from "@/lib/prisma"
import { formatDate, formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Users, Mail, ShoppingBag, Calendar } from "lucide-react"

interface Props {
  searchParams: { page?: string; search?: string }
}

export default async function AdminCustomersPage({ searchParams }: Props) {
  const page = Number(searchParams.page) || 1
  const limit = 15

  const where: any = { role: "USER" }
  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search, mode: "insensitive" } },
      { email: { contains: searchParams.search, mode: "insensitive" } },
    ]
  }

  const [customers, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        orders: {
          select: { total: true, status: true },
        },
        _count: { select: { orders: true, reviews: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ])

  const customersWithStats = customers.map((customer) => ({
    ...customer,
    totalSpent: customer.orders
      .filter((o) => o.status === "DELIVERED")
      .reduce((acc, o) => acc + Number(o.total), 0),
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">العملاء</h1>
          <p className="text-gray-500">{total} عميل</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <form className="relative max-w-md">
          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            name="search"
            defaultValue={searchParams.search}
            placeholder="ابحث بالاسم أو البريد..."
            className="w-full h-10 pr-10 pl-4 rounded-xl bg-gray-50 border-0 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-500">العميل</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-500">البريد</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-500">الطلبات</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-500">إجمالي الإنفاق</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-500">التقييمات</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-500">تاريخ التسجيل</th>
              </tr>
            </thead>
            <tbody>
              {customersWithStats.map((customer) => (
                <tr key={customer.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {customer.image ? (
                        <img src={customer.image} alt="" className="w-9 h-9 rounded-full" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 font-bold text-sm">
                            {customer.name?.charAt(0) || "?"}
                          </span>
                        </div>
                      )}
                      <span className="font-medium text-gray-800 text-sm">
                        {customer.name || "بدون اسم"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{customer.email}</td>
                  <td className="px-6 py-4">
                    <Badge variant="info">{customer._count.orders} طلب</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-800 text-sm">
                      {formatPrice(customer.totalSpent)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {customer._count.reviews}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(customer.createdAt)}
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