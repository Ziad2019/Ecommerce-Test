// src/components/products/product-filters.tsx
"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SlidersHorizontal, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDebounce } from "@/hooks/use-debounce"

interface Props {
  categories: any[]
}

export function ProductFilters({ categories }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const [priceRange, setPriceRange] = useState({
    min: searchParams.get("minPrice") || "",
    max: searchParams.get("maxPrice") || "",
  })

  const currentCategory = searchParams.get("category") || ""
  const currentSort = searchParams.get("sort") || "newest"

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newParams = new URLSearchParams(searchParams.toString())

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === "") {
          newParams.delete(key)
        } else {
          newParams.set(key, value)
        }
      })

      // Reset page when filtering
      if (!params.page) newParams.delete("page")

      return newParams.toString()
    },
    [searchParams]
  )

  const applyFilter = (params: Record<string, string | null>) => {
    const qs = createQueryString(params)
    router.push(`${pathname}?${qs}`, { scroll: false })
  }

  const clearAllFilters = () => {
    router.push(pathname)
    setPriceRange({ min: "", max: "" })
  }

  const hasActiveFilters =
    currentCategory || priceRange.min || priceRange.max

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">
            الفلاتر النشطة
          </span>
          <button
            onClick={clearAllFilters}
            className="text-sm text-red-500 hover:text-red-600 font-medium"
          >
            مسح الكل
          </button>
        </div>
      )}

      {/* Categories */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span>التصنيفات</span>
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => applyFilter({ category: null })}
            className={`w-full text-right px-3 py-2.5 rounded-xl text-sm transition-all ${
              !currentCategory
                ? "bg-indigo-50 text-indigo-600 font-semibold"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            جميع التصنيفات
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => applyFilter({ category: cat.slug })}
              className={`w-full text-right px-3 py-2.5 rounded-xl text-sm transition-all flex items-center justify-between ${
                currentCategory === cat.slug
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {cat._count.products}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3">نطاق السعر</h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="من"
            value={priceRange.min}
            onChange={(e) =>
              setPriceRange((prev) => ({ ...prev, min: e.target.value }))
            }
            className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-300"
          />
          <span className="text-gray-400">—</span>
          <input
            type="number"
            placeholder="إلى"
            value={priceRange.max}
            onChange={(e) =>
              setPriceRange((prev) => ({ ...prev, max: e.target.value }))
            }
            className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-300"
          />
        </div>
        <Button
          onClick={() =>
            applyFilter({
              minPrice: priceRange.min || null,
              maxPrice: priceRange.max || null,
            })
          }
          size="sm"
          variant="outline"
          className="w-full mt-3"
        >
          تطبيق السعر
        </Button>
      </div>

      {/* Sort */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3">ترتيب حسب</h3>
        <div className="space-y-1">
          {[
            { value: "newest", label: "الأحدث" },
            { value: "price-asc", label: "السعر: من الأقل للأعلى" },
            { value: "price-desc", label: "السعر: من الأعلى للأقل" },
            { value: "popular", label: "الأكثر مبيعاً" },
            { value: "rating", label: "الأعلى تقييماً" },
            { value: "name-asc", label: "الاسم أ-ي" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => applyFilter({ sort: option.value })}
              className={`w-full text-right px-3 py-2.5 rounded-xl text-sm transition-all ${
                currentSort === option.value
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Filters */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5" />
            الفلاتر
          </h2>
          <FilterContent />
        </div>
      </aside>

      {/* Mobile Filter Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setIsMobileOpen(true)}
          variant="gradient"
          size="lg"
          className="rounded-full shadow-2xl"
        >
          <SlidersHorizontal className="w-5 h-5 ml-2" />
          الفلاتر
        </Button>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[80vh] overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">الفلاتر</h2>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-xl hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterContent />
              <Button
                onClick={() => setIsMobileOpen(false)}
                variant="gradient"
                className="w-full mt-6"
                size="lg"
              >
                عرض النتائج
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}