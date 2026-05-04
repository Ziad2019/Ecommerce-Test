// src/components/products/review-form.tsx
"use client"

import { useState } from "react"
import { createReview } from "@/actions/review-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Star, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"

interface Props {
  productId: string
  onClose: () => void
}

export function ReviewForm({ productId, onClose }: Props) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    if (rating === 0) {
      toast.error("يرجى اختيار التقييم")
      return
    }

    formData.append("rating", rating.toString())
    setIsLoading(true)

    try {
      await createReview(productId, formData)
      toast.success("تم إضافة تقييمك بنجاح! 🎉")
      onClose()
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">اكتب تقييمك</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form action={handleSubmit} className="space-y-6">
          {/* Rating Stars */}
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-3">ما تقييمك للمنتج؟</p>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-200"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-indigo-600 font-medium mt-2"
              >
                {["", "ضعيف 😞", "مقبول 😐", "جيد 🙂", "ممتاز 😊", "رائع 🤩"][rating]}
              </motion.p>
            )}
          </div>

          {/* Title */}
          <Input
            name="title"
            label="عنوان التقييم (اختياري)"
            placeholder="مثال: منتج رائع وجودة عالية"
          />

          {/* Comment */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              تعليقك (اختياري)
            </label>
            <textarea
              name="comment"
              rows={4}
              placeholder="شاركنا تجربتك مع هذا المنتج..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 resize-none transition-all"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <Button
              type="submit"
              isLoading={isLoading}
              variant="gradient"
              size="lg"
              className="flex-1"
            >
              إرسال التقييم
            </Button>
            <Button type="button" onClick={onClose} variant="outline" size="lg">
              إلغاء
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}