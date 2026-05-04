// src/app/(dashboard)/admin/products/new/page.tsx

import { prisma } from "@/lib/prisma"
// import { ProductForm } from "@/components/admin/product-form"
import { ProductForm } from "@/components/admin/ProductForm"

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">إضافة منتج جديد</h1>
      <ProductForm categories={categories} />
    </div>
  )
}