// src/components/account/add-address-button.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X, MapPin } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"

export function AddAddressButton() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          phone: formData.get("phone"),
          street: formData.get("street"),
          city: formData.get("city"),
          state: formData.get("state"),
          country: formData.get("country"),
          zipCode: formData.get("zipCode"),
          isDefault: formData.get("isDefault") === "on",
        }),
      })

      if (!res.ok) throw new Error("Failed")

      toast.success("تم إضافة العنوان بنجاح")
      setIsOpen(false)
      router.refresh()
    } catch (error) {
      toast.error("حدث خطأ أثناء إضافة العنوان")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="gradient">
        <Plus className="w-5 h-5 ml-2" />
        إضافة عنوان
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
              className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                  إضافة عنوان جديد
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  name="name"
                  label="الاسم الكامل *"
                  placeholder="محمد أحمد"
                  required
                />

                <Input
                  name="phone"
                  label="رقم الهاتف *"
                  placeholder="+20 xxx xxx xxxx"
                  required
                />

                <Input
                  name="street"
                  label="العنوان التفصيلي *"
                  placeholder="شارع، مبنى، شقة..."
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="city"
                    label="المدينة *"
                    placeholder="القاهرة"
                    required
                  />
                  <Input
                    name="state"
                    label="المحافظة *"
                    placeholder="القاهرة"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="country"
                    label="الدولة *"
                    placeholder="مصر"
                    required
                  />
                  <Input
                    name="zipCode"
                    label="الرمز البريدي *"
                    placeholder="11511"
                    required
                  />
                </div>

                {/* Default Address */}
                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    name="isDefault"
                    className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      عنوان افتراضي
                    </p>
                    <p className="text-sm text-gray-500">
                      استخدم هذا العنوان كعنوان افتراضي للتوصيل
                    </p>
                  </div>
                </label>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    variant="gradient"
                    size="lg"
                    className="flex-1"
                  >
                    <Plus className="w-5 h-5 ml-2" />
                    إضافة العنوان
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    variant="outline"
                    size="lg"
                  >
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