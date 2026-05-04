// src/app/(dashboard)/admin/categories/page.tsx
import { prisma } from "@/lib/prisma"
import { CategoryForm } from "@/components/admin/category-form"
import { CategoryList } from "@/components/admin/category-list"

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true, children: true } },
      parent: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const parentCategories = await prisma.category.findMany({
    where: { parentId: null },
    select: { id: true, name: true },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">التصنيفات</h1>

      <div className="grid lg:grid-cols-[400px_1fr] gap-6">
        {/* Add Category Form */}
        <CategoryForm parents={parentCategories} />

        {/* Categories List */}
        <CategoryList categories={categories} />
      </div>
    </div>
  )
}