// src/app/(dashboard)/admin/coupons/page.tsx
import { prisma } from "@/lib/prisma"
import { formatPrice, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { CouponFormModal } from "@/components/admin/coupon-form-modal"

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    include: { _count: { select: { orders: true } } },
    orderBy: { createdAt: "desc" },
  })

  const statusConfig = (coupon: any) => {
    const isExpired =
      coupon.expiresAt && new Date(coupon.expiresAt) < new Date()
    const isLimitReached =
      coupon.usageLimit && coupon.usedCount >= coupon.usageLimit
    return isExpired || isLimitReached || !coupon.isActive
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">الكوبونات</h1>
          <p className="text-gray-500">{coupons.length} كوبون</p>
        </div>
        <CouponFormModal />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-500">
                  الكود
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-500">
                  النوع
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-500">
                  القيمة
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-500">
                  الاستخدام
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-500">
                  الحالة
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-500">
                  انتهاء الصلاحية
                </th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr
                  key={coupon.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <code className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-bold tracking-wider">
                      {coupon.code}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        coupon.type === "PERCENTAGE" ? "info" : "default"
                      }
                    >
                      {coupon.type === "PERCENTAGE"
                        ? "نسبة مئوية"
                        : "مبلغ ثابت"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-800">
                      {coupon.type === "PERCENTAGE"
                        ? `${Number(coupon.value)}%`
                        : formatPrice(Number(coupon.value))}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {coupon.usedCount}
                      {coupon.usageLimit
                        ? ` / ${coupon.usageLimit}`
                        : " (غير محدود)"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {statusConfig(coupon) ? (
                      <Badge variant="danger">غير نشط</Badge>
                    ) : (
                      <Badge variant="success">نشط</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">
                      {coupon.expiresAt
                        ? formatDate(coupon.expiresAt)
                        : "غير محدد"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {coupons.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">لا توجد كوبونات</p>
          </div>
        )}
      </div>
    </div>
  )
}