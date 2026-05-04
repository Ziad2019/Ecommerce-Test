// src/app/(dashboard)/admin/products/page.tsx
import { prisma } from "@/lib/prisma"
import { formatPrice, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Plus, Search, Edit, Trash2, Eye, MoreVertical } from "lucide-react"
import { DeleteProductButton } from "@/components/admin/delete-product-button"

interface Props {
  searchParams: { search?: string; status?: string; page?: string }
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const page = Number(searchParams.page) || 1
  const limit = 10

  const where: any = {}
  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search, mode: "insensitive" } },
      { sku: { contains: searchParams.search, mode: "insensitive" } },
    ]
  }
  if (searchParams.status) {
    where.status = searchParams.status
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { take: 1, orderBy: { position: "asc" } },
        category: { select: { name: true } },
        _count: { select: { orderItems: true, reviews: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ])

  const statusConfig: Record<string, { label: string; variant: any }> = {
    ACTIVE: { label: "نشط", variant: "success" },
    DRAFT: { label: "مسودة", variant: "warning" },
    ARCHIVED: { label: "مؤرشف", variant: "danger" },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">المنتجات</h1>
          <p className="text-gray-500">{total} منتج</p>
        </div>
        <Link href="/admin/products/new">
          <Button variant="gradient">
            <Plus className="w-5 h-5 ml-2" />
            إضافة منتج
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <form className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              name="search"
              defaultValue={searchParams.search}
              placeholder="ابحث عن منتج..."
              className="w-full h-10 pr-10 pl-4 rounded-xl bg-gray-50 border-0 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </form>
          <div className="flex gap-2">
            {["", "ACTIVE", "DRAFT", "ARCHIVED"].map((status) => (
              <Link
                key={status}
                href={`/admin/products${status ? `?status=${status}` : ""}`}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  (searchParams.status || "") === status
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status === "" ? "الكل" : statusConfig[status]?.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-500">المنتج</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-500">التصنيف</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-500">السعر</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-500">المخزون</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-500">الحالة</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-500">المبيعات</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-500">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                        {product.images[0] ? (
                          <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">📦</div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{product.name}</p>
                        <p className="text-xs text-gray-400">SKU: {product.sku || "N/A"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{product.category.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className="text-sm font-semibold text-gray-800">
                        {formatPrice(Number(product.price))}
                      </span>
                      {product.compareAt && (
                        <span className="text-xs text-gray-400 line-through block">
                          {formatPrice(Number(product.compareAt))}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${
                      product.stock === 0
                        ? "text-red-600"
                        : product.stock <= product.lowStock
                        ? "text-orange-600"
                        : "text-green-600"
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={statusConfig[product.status]?.variant}>
                      {statusConfig[product.status]?.label}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {product._count.orderItems}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/products/${product.slug}`}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
                        target="_blank"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="p-2 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeleteProductButton productId={product.id} productName={product.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">لا توجد منتجات</p>
          </div>
        )}
      </div>
    </div>
  )
}