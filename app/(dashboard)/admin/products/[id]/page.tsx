// src/app/(dashboard)/admin/products/[id]/page.tsx
import { ProductForm } from "@/components/admin/ProductForm"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"


interface Props {
  params: { id: string }
}

export default async function EditProductPage({ params }: Props) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
      include: { images: { orderBy: { position: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ])

  if (!product) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">تعديل المنتج</h1>
      <ProductForm categories={categories} product={product} />
    </div>
  )
}