// src/components/admin/top-products.tsx
import { prisma } from "@/lib/prisma"
import { formatPrice } from "@/lib/utils"
import Image from "next/image"

export async function TopProducts() {
  const topProducts = await prisma.product.findMany({
    take: 5,
    orderBy: { orderItems: { _count: "desc" } },
    include: {
      images: { take: 1 },
      _count: { select: { orderItems: true } },
    },
  })

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-6">المنتجات الأكثر مبيعاً</h3>

      <div className="space-y-4">
        {topProducts.map((product, index) => (
          <div
            key={product.id}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <span className="text-lg font-bold text-gray-300 w-6">
              #{index + 1}
            </span>
            <div className="relative w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
              {product.images[0] && (
                <Image
                  src={product.images[0].url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {product.name}
              </p>
              <p className="text-xs text-gray-500">
                {product._count.orderItems} مبيعة
              </p>
            </div>
            <span className="text-sm font-bold text-indigo-600">
              {formatPrice(Number(product.price))}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}