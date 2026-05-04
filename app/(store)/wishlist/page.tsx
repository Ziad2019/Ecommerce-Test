// src/app/(store)/wishlist/page.tsx
import { getWishlist } from "@/actions/wishlist-actions"
import { ProductCard } from "@/components/products/product-card"
import { Heart } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "المفضلة" }

export default async function WishlistPage() {
  const wishlist = await getWishlist()

  if (wishlist.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <Heart className="w-20 h-20 text-gray-200 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">المفضلة فارغة</h1>
        <p className="text-gray-500 mb-6">أضف منتجات إلى قائمة المفضلة</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
        >
          تصفح المنتجات
        </Link>
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        المفضلة ({wishlist.length})
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {wishlist.map((item) => (
          <ProductCard
            key={item.id}
            product={{
              ...item.product,
              price: Number(item.product.price),
              compareAt: item.product.compareAt ? Number(item.product.compareAt) : null,
              avgRating:
                item.product.reviews.length > 0
                  ? item.product.reviews.reduce((a, r) => a + r.rating, 0) /
                    item.product.reviews.length
                  : 0,
            }}
          />
        ))}
      </div>
    </div>
  )
}