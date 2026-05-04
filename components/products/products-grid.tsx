// src/components/products/products-grid.tsx
"use client"

import { ProductCard } from "./product-card"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Props {
  products: any[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
}

export function ProductsGrid({ products, pagination }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          لم يتم العثور على منتجات
        </h3>
        <p className="text-gray-500">جرب تغيير الفلاتر أو البحث بكلمات أخرى</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            onClick={() => goToPage(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {Array.from({ length: pagination.totalPages }).map((_, i) => {
            const page = i + 1
            const isActive = page === pagination.page

            // Show limited pages
            if (
              page === 1 ||
              page === pagination.totalPages ||
              (page >= pagination.page - 1 && page <= pagination.page + 1)
            ) {
              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              )
            }

            if (page === pagination.page - 2 || page === pagination.page + 2) {
              return (
                <span key={page} className="text-gray-400">
                  ...
                </span>
              )
            }

            return null
          })}

          <button
            onClick={() => goToPage(pagination.page + 1)}
            disabled={!pagination.hasMore}
            className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}