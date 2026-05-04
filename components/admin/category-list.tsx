// src/components/admin/category-list.tsx
"use client"

import { Edit, Trash2, FolderOpen, Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

interface Props {
  categories: any[]
}

export function CategoryList({ categories }: Props) {
  const router = useRouter()

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف التصنيف "${name}"؟`)) return

    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed")
      toast.success("تم حذف التصنيف")
      router.refresh()
    } catch (error) {
      toast.error("لا يمكن حذف تصنيف يحتوي على منتجات")
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-800">التصنيفات ({categories.length})</h3>
      </div>

      <div className="divide-y divide-gray-50">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-800">{category.name}</p>
                  {category.parent && (
                    <Badge variant="info" className="text-[10px]">
                      فرعي من: {category.parent.name}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-400">/{category.slug}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Package className="w-4 h-4" />
                {category._count.products}
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-all">
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.id, category.name)}
                  className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500">لا توجد تصنيفات</p>
        </div>
      )}
    </div>
  )
}