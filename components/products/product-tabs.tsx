// src/components/products/product-tabs.tsx
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, ThumbsUp, CheckCircle, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"

interface Props {
  product: any
}

const tabs = [
  { id: "description", label: "الوصف", icon: MessageSquare },
  { id: "reviews", label: "التقييمات", icon: Star },
  { id: "shipping", label: "الشحن والإرجاع", icon: null },
]

export function ProductTabs({ product }: Props) {
  const [activeTab, setActiveTab] = useState("description")

  return (
    <div className="mt-16">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="flex items-center gap-2">
              {tab.label}
              {tab.id === "reviews" && (
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {product._count.reviews}
                </span>
              )}
            </span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="py-8">
        {/* Description Tab */}
        {activeTab === "description" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-lg max-w-none"
          >
            <div
              dangerouslySetInnerHTML={{ __html: product.description }}
              className="text-gray-600 leading-relaxed space-y-4"
            />

            {/* Product Specifications */}
            <div className="mt-8 bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">المواصفات</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.sku && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-500">رقم المنتج (SKU)</span>
                    <span className="font-medium text-gray-800">{product.sku}</span>
                  </div>
                )}
                {product.barcode && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-500">الباركود</span>
                    <span className="font-medium text-gray-800">{product.barcode}</span>
                  </div>
                )}
                {product.weight && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-500">الوزن</span>
                    <span className="font-medium text-gray-800">{Number(product.weight)} كجم</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-500">التصنيف</span>
                  <span className="font-medium text-gray-800">{product.category.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-500">التوفر</span>
                  <span className={`font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                    {product.stock > 0 ? `متوفر (${product.stock})` : "غير متوفر"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Rating Summary */}
            <div className="grid md:grid-cols-[300px_1fr] gap-8 mb-10">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 text-center">
                <div className="text-5xl font-black text-indigo-600 mb-2">
                  {product.avgRating.toFixed(1)}
                </div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(product.avgRating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  بناءً على {product._count.reviews} تقييم
                </p>
              </div>

              {/* Rating Bars */}
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = product.reviews.filter(
                    (r: any) => r.rating === star
                  ).length
                  const percentage =
                    product.reviews.length > 0
                      ? (count / product.reviews.length) * 100
                      : 0

                  return (
                    <div key={star} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-12">
                        <span className="text-sm font-medium text-gray-600">
                          {star}
                        </span>
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      </div>
                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, delay: 0.1 * star }}
                          className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                        />
                      </div>
                      <span className="text-sm text-gray-500 w-8">
                        {count}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Write Review Button */}
            <div className="flex justify-center mb-10">
              <Button variant="gradient" size="lg">
                <Star className="w-5 h-5 ml-2" />
                اكتب تقييماً
              </Button>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {product.reviews.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    لا توجد تقييمات بعد
                  </h3>
                  <p className="text-gray-500">كن أول من يقيم هذا المنتج</p>
                </div>
              ) : (
                product.reviews.map((review: any) => (
                  <div
                    key={review.id}
                    className="bg-white border border-gray-100 rounded-2xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {review.user.image ? (
                          <img
                            src={review.user.image}
                            alt={review.user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-600 font-bold text-sm">
                              {review.user.name?.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-800">
                              {review.user.name}
                            </p>
                            {review.isVerified && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          <p className="text-xs text-gray-400">
                            {formatDate(review.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.title && (
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {review.title}
                      </h4>
                    )}
                    {review.comment && (
                      <p className="text-gray-600 leading-relaxed">
                        {review.comment}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                      <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-indigo-600 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        مفيد
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* Shipping Tab */}
        {activeTab === "shipping" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                🚚 سياسة الشحن
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  شحن مجاني للطلبات فوق \$100
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  التوصيل خلال 3-5 أيام عمل
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  شحن سريع متاح (1-2 يوم) برسوم إضافية
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  تتبع الشحنة متاح لجميع الطلبات
                </li>
              </ul>
            </div>
            <div className="bg-orange-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                🔄 سياسة الإرجاع
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  إرجاع مجاني خلال 30 يوم من الاستلام
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  يجب أن يكون المنتج في حالته الأصلية
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  استرداد المبلغ خلال 5-7 أيام عمل
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}