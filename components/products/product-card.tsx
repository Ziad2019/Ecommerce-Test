// src/components/products/product-card.tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, ShoppingCart, Star, Eye } from "lucide-react"
import { useCartStore } from "@/store/cart-store"
import { formatPrice, calculateDiscount } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"
import { useState } from "react"

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    compareAt: number | null
    stock: number
    images: { url: string; alt?: string }[]
    category: { name: string; slug: string }
    avgRating: number
    _count: { reviews: number }
    isFeatured: boolean
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCartStore()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)

  const discount = product.compareAt
    ? calculateDiscount(product.price, product.compareAt)
    : 0

  const isOutOfStock = product.stock === 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isOutOfStock) {
      toast.error("المنتج غير متوفر حالياً")
      return
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url || "/images/placeholder.png",
      quantity: 1,
      stock: product.stock,
      slug: product.slug,
    })

    toast.success("تمت الإضافة للسلة ✓")
    openCart()
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
    toast.success(
      isWishlisted ? "تمت الإزالة من المفضلة" : "تمت الإضافة للمفضلة ❤️"
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/products/${product.slug}`} className="block group">
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
          {/* Image */}
          <div
            className="relative aspect-square overflow-hidden bg-gray-100"
            onMouseEnter={() =>
              product.images.length > 1 && setImageIndex(1)
            }
            onMouseLeave={() => setImageIndex(0)}
          >
            <Image
              src={product.images[imageIndex]?.url || "/images/placeholder.png"}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />

            {/* Overlays */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="bg-white text-gray-800 font-bold px-4 py-2 rounded-xl">
                  نفذ المخزون
                </span>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              {discount > 0 && (
                <Badge variant="danger" className="text-xs px-2 py-1">
                  -{discount}%
                </Badge>
              )}
              {product.isFeatured && (
                <Badge variant="warning" className="text-xs px-2 py-1">
                  ⭐ مميز
                </Badge>
              )}
            </div>

            {/* Quick Actions */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-3 group-hover:translate-x-0">
              <button
                onClick={handleWishlist}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isWishlisted
                    ? "bg-red-500 text-white"
                    : "bg-white/90 backdrop-blur text-gray-600 hover:bg-red-50 hover:text-red-500"
                } shadow-lg`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
              </button>
              <Link
                href={`/products/${product.slug}`}
                className="w-9 h-9 bg-white/90 backdrop-blur rounded-xl flex items-center justify-center text-gray-600 hover:bg-indigo-50 hover:text-indigo-500 shadow-lg transition-all"
              >
                <Eye className="w-4 h-4" />
              </Link>
            </div>

            {/* Add to Cart Button */}
            <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-3 group-hover:translate-y-0">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all disabled:bg-gray-400"
              >
                <ShoppingCart className="w-4 h-4" />
                أضف للسلة
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Category */}
            <span className="text-xs text-indigo-600 font-medium">
              {product.category.name}
            </span>

            {/* Name */}
            <h3 className="font-semibold text-gray-800 mt-1 line-clamp-2 group-hover:text-indigo-600 transition-colors text-sm md:text-base">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.round(product.avgRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-200"
                  }`}
                />
              ))}
              <span className="text-xs text-gray-400 mr-1">
                ({product._count.reviews})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mt-3">
              <span className="text-lg font-bold text-indigo-600">
                {formatPrice(product.price)}
              </span>
              {product.compareAt && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.compareAt)}
                </span>
              )}
            </div>

            {/* Stock Indicator */}
            {product.stock > 0 && product.stock <= 5 && (
              <p className="text-xs text-orange-500 font-medium mt-2">
                ⚡ باقي {product.stock} فقط
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}