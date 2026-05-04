// src/app/(store)/products/page.tsx
import { Suspense } from "react"
// import { getProducts } from "@/actions/product-actions"
import { prisma } from "@/lib/prisma"
import { ProductsGrid } from "@/components/products/products-grid"
import { ProductFilters } from "@/components/products/product-filters"
import { ProductsSkeleton } from "@/components/products/products-skeleton"
import type { Metadata } from "next"
import { getProducts } from "@/actions/product.actions"

export const metadata: Metadata = {
  title: "المنتجات",
  description: "تصفح جميع المنتجات",
}

interface Props {
  searchParams: {
    search?: string
    category?: string
    minPrice?: string
    maxPrice?: string
    sort?: string
    page?: string
    featured?: string
  }
}

export default async function ProductsPage({ searchParams }: Props) {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  })

  const { products, pagination } = await getProducts({
    search: searchParams.search,
    category: searchParams.category,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    sort: searchParams.sort,
    page: searchParams.page ? Number(searchParams.page) : 1,
    featured: searchParams.featured === "true" ? true : undefined,
  })

  return (
    <div className="container-custom py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          {searchParams.search
            ? `نتائج البحث: "${searchParams.search}"`
            : searchParams.featured
            ? "العروض والمنتجات المميزة"
            : "جميع المنتجات"}
        </h1>
        <p className="text-gray-500 mt-2">
          {pagination.total} منتج
        </p>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        {/* Sidebar Filters */}
        <ProductFilters categories={categories} />

        {/* Products Grid */}
        <Suspense fallback={<ProductsSkeleton />}>
          <ProductsGrid products={products} pagination={pagination} />
        </Suspense>
      </div>
    </div>
  )
}