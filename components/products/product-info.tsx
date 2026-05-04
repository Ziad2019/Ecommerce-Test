// src/components/products/product-info.tsx
"use client"

import { useState } from "react"
import { useCartStore } from "@/store/cart-store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice, calculateDiscount } from "@/lib/utils"
import {
  ShoppingCart, Heart, Share2, Star, Minus, Plus,
  Truck, Shield, RotateCcw, CheckCircle
} from "lucide-react"
import toast from "react-hot-toast"

interface Props {
  product: any
}

export function ProductInfo({ product }: Props) {
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<Record<string, string>>({})
  const { addItem, openCart } = useCartStore()

  const discount = product.compareAt
    ? calculateDiscount(product.price, product.compareAt)
    : 0

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url || "/images/placeholder.png",
      quantity,
      stock: product.stock,
      slug: product.slug,
      variant: Object.keys(selectedVariant).length > 0 ? selectedVariant : undefined,
    })
    toast.success("تمت الإضافة للسلة ✓")
    openCart()
  }

  const handleBuyNow = () => {
    handleAddToCart()
    window.location.href = "/checkout"
  }

  return (
    <div className="space-y-6">
      {/* Category & Badge */}
      <div className="flex items-center gap-2">
        <Badge>{product.category.name}</Badge>
        {product.stock > 0 ? (
          <Badge variant="success">
            <CheckCircle className="w-3 h-3 ml-1" />
            متوفر
          </Badge>
        ) : (
          <Badge variant="danger">غير متوفر</Badge>
        )}
      </div>

      {/* Name */}
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < Math.round(product.avgRating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-200"
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-500">
          ({product._count.reviews} تقييم)
        </span>
        <span className="text-sm text-gray-400">|</span>
        <span className="text-sm text-gray-500">
          SKU: {product.sku || "N/A"}
        </span>
      </div>

      {/* Price */}
      <div className="bg-gray-50 rounded-2xl p-5">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl md:text-4xl font-black text-indigo-600">
            {formatPrice(product.price)}
          </span>
          {product.compareAt && (
            <>
              <span className="text-xl text-gray-400 line-through">
                {formatPrice(product.compareAt)}
              </span>
              <Badge variant="danger" className="text-sm">
                وفر {discount}%
              </Badge>
            </>
          )}
        </div>
        {product.compareAt && (
          <p className="text-sm text-green-600 mt-2 font-medium">
            توفير {formatPrice(product.compareAt - product.price)}
          </p>
        )}
      </div>

      {/* Short Description */}
      {product.shortDesc && (
        <p className="text-gray-600 leading-relaxed">{product.shortDesc}</p>
      )}

      {/* Variants */}
      {product.variants.length > 0 && (
        <div className="space-y-4">
          {/* Extract unique option keys */}
          {Object.keys(product.variants[0]?.options || {}).map((optionKey) => {
            const uniqueValues = [
              ...new Set(
                product.variants.map((v: any) => v.options[optionKey])
              ),
            ] as string[]

            return (
              <div key={optionKey}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {optionKey === "color" ? "اللون" : optionKey === "size" ? "المقاس" : optionKey}
                </label>
                <div className="flex flex-wrap gap-2">
                  {uniqueValues.map((value) => (
                    <button
                      key={value}
                      onClick={() =>
                        setSelectedVariant((prev) => ({
                          ...prev,
                          [optionKey]: value,
                        }))
                      }
                      className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                        selectedVariant[optionKey] === value
                          ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                          : "border-gray-200 hover:border-gray-300 text-gray-600"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Quantity */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          الكمية
        </label>
        <div className="flex items-center gap-3">
          <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-14 h-11 flex items-center justify-center font-bold text-gray-800 border-x-2 border-gray-200">
              {quantity}
            </span>
            <button
              onClick={() =>
                setQuantity(Math.min(product.stock, quantity + 1))
              }
              disabled={quantity >= product.stock}
              className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {product.stock <= 10 && product.stock > 0 && (
            <span className="text-sm text-orange-500 font-medium">
              ⚡ باقي {product.stock} قطعة فقط
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      
           

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          variant="gradient"
          size="lg"
          className="flex-1"
        >
          <ShoppingCart className="w-5 h-5 ml-2" />
          أضف للسلة
        </Button>
        <Button
          onClick={handleBuyNow}
          disabled={product.stock === 0}
          size="lg"
          className="flex-1"
        >
          شراء الآن
        </Button>
        <button
          onClick={() => toast.success("تمت الإضافة للمفضلة ❤️")}
          className="w-12 h-12 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-red-300 hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <Heart className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href)
            toast.success("تم نسخ الرابط!")
          }}
          className="w-12 h-12 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-500 transition-all"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 gap-4 pt-4">
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Truck className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">شحن مجاني</p>
            <p className="text-xs text-gray-500">للطلبات فوق \$100</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">ضمان سنة</p>
            <p className="text-xs text-gray-500">ضمان شامل</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <RotateCcw className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">إرجاع مجاني</p>
            <p className="text-xs text-gray-500">خلال 30 يوم</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">منتج أصلي</p>
            <p className="text-xs text-gray-500">100% أصلي</p>
          </div>
        </div>
      </div>
    </div>
    )
}

