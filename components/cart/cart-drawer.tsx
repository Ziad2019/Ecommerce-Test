// src/components/cart/cart-drawer.tsx
"use client"

import { useCartStore } from "@/store/cart-store"
import { AnimatePresence, motion } from "framer-motion"
import { X, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal, clearCart } =
    useCartStore()

  const subtotal = getSubtotal()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-indigo-600" />
                <h2 className="text-lg font-bold text-gray-800">
                  سلة التسوق ({items.length})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    السلة فارغة
                  </h3>
                  <p className="text-gray-500 mb-6">
                    أضف منتجات إلى سلة التسوق
                  </p>
                  <Button onClick={closeCart} variant="gradient">
                    تسوق الآن
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4 bg-gray-50 rounded-2xl p-3"
                    >
                      {/* Image */}
                      <div className="relative w-20 h-20 bg-white rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={closeCart}
                          className="text-sm font-semibold text-gray-800 hover:text-indigo-600 line-clamp-1 transition-colors"
                        >
                          {item.name}
                        </Link>

                        {item.variant && (
                          <div className="flex gap-1 mt-1">
                            {Object.entries(item.variant).map(([key, val]) => (
                              <span
                                key={key}
                                className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-500"
                              >
                                {val}
                              </span>
                            ))}
                          </div>
                        )}

                        <p className="text-indigo-600 font-bold text-sm mt-1">
                          {formatPrice(item.price)}
                        </p>

                        {/* Quantity */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.stock}
                              className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Clear Cart */}
                  <button
                    onClick={clearCart}
                    className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
                  >
                    مسح السلة
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>المجموع الفرعي</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>الشحن</span>
                    <span>{subtotal >= 100 ? "مجاني" : formatPrice(10)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>الإجمالي</span>
                    <span className="text-indigo-600">
                      {formatPrice(subtotal >= 100 ? subtotal : subtotal + 10)}
                    </span>
                  </div>
                </div>

                <Link href="/checkout" onClick={closeCart}>
                  <Button className="w-full" variant="gradient" size="lg">
                    إتمام الطلب
                  </Button>
                </Link>

                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="block text-center text-sm text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  عرض السلة كاملة
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}