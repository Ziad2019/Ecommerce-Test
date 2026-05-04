// src/components/admin/order-status-update.tsx
"use client"

import { useState } from "react"
import { updateOrderStatus } from "@/actions/order-actions"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"

interface Props {
  orderId: string
  currentStatus: string
}

const allStatuses = [
  { value: "PENDING", label: "معلق" },
  { value: "CONFIRMED", label: "مؤكد" },
  { value: "PROCESSING", label: "قيد المعالجة" },
  { value: "SHIPPED", label: "تم الشحن" },
  { value: "DELIVERED", label: "تم التوصيل" },
  { value: "CANCELLED", label: "ملغي" },
  { value: "REFUNDED", label: "مسترجع" },
]

export function OrderStatusUpdate({ orderId, currentStatus }: Props) {
  const [status, setStatus] = useState(currentStatus)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdate = async () => {
    if (status === currentStatus) return
    setIsLoading(true)
    try {
      await updateOrderStatus(orderId, status)
      toast.success("تم تحديث حالة الطلب")
    } catch (error) {
      toast.error("حدث خطأ")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="h-10 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
      >
        {allStatuses.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
      <Button
        onClick={handleUpdate}
        isLoading={isLoading}
        disabled={status === currentStatus}
        size="sm"
        variant="gradient"
      >
        تحديث
      </Button>
    </div>
  )
}