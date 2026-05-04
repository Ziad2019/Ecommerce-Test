// src/components/admin/coupon-form-modal.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"

export function CouponFormModal() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: (formData.get("code") as string).toUpperCase(),
          type: formData.get("type"),
          value: Number(formData.get("value")),
          minPurchase: formData.get("minPurchase") ? Number(formData.get("minPurchase")) : null,
          maxDiscount: formData.get("maxDiscount") ? Number(formData.get("maxDiscount")) : null,
          usageLimit: formData.get("usageLimit") ? Number(formData.get("usageLimit")) : null,
          expiresAt: formData.get("expiresAt") || null,
          isActive: true,
        }),
      })

      if (!res.ok) throw new Error("Failed")

      toast.success("تم إنشاء الكوبون بنجاح")
      setIsOpen(false)
      router.refresh()
    } catch (error) {
      toast.error("حدث خطأ أثناء إنشاء الكوبون")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="gradient">
        <Plus className="w-5 h-5 ml-2" />
        إضافة كوبون
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">إنشاء كوبون جديد</h2>
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input name="code" label="كود الكوبون *" placeholder="مثال: SUMMER50" required />

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">نوع الخصم *</label>
                  <select
                    name="type"
                    required
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
                  >
                    <option value="PERCENTAGE">نسبة مئوية (%)</option>
                    <option value="FIXED">مبلغ ثابت ($)</option>
                  </select>
                </div>

                <Input name="value" label="القيمة *" type="number" step="0.01" placeholder="20" required />

                <div className="grid grid-cols-2 gap-4">
                  <Input name="minPurchase" label="الحد الأدنى للشراء" type="number" step="0.01" placeholder="50" />
                  <Input name="maxDiscount" label="أقصى خصم" type="number" step="0.01" placeholder="100" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input name="usageLimit" label="حد الاستخدام" type="number" placeholder="100" />
                  <Input name="expiresAt" label="تاريخ الانتهاء" type="date" />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" isLoading={isLoading} variant="gradient" className="flex-1">
                    إنشاء الكوبون
                  </Button>
                  <Button type="button" onClick={() => setIsOpen(false)} variant="outline">
                    إلغاء
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}