// src/components/home/categories-section.tsx
import Link from "next/link"
import { prisma } from "@/lib/prisma"

const categoryIcons: Record<string, string> = {
  electronics: "📱",
  fashion: "👕",
  home: "🏠",
  beauty: "💄",
  sports: "⚽",
  books: "📚",
}

export async function CategoriesSection() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: { _count: { select: { products: true } } },
    take: 6,
  })

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            تصفح التصنيفات
          </h2>
          <p className="text-gray-500 text-lg">اختر التصنيف المناسب لك</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group bg-white rounded-2xl p-6 text-center card-hover border border-gray-100"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {categoryIcons[category.slug] || "📦"}
              </div>
              <h3 className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                {category._count.products} منتج
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}