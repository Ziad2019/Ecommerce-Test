// src/components/admin/delete-product-button.tsx
"use client"

import { deleteProduct } from "@/actions/product.actions"
import { Trash2 } from "lucide-react"

import { useState } from "react"
import toast from "react-hot-toast"

interface Props {
  productId: string
  productName: string
}

export function DeleteProductButton({ productId, productName }: Props) {
  const [isConfirming, setIsConfirming] = useState(false)

  const handleDelete = async () => {
    try {
      await deleteProduct(productId)
      toast.success(`تم حذف "${productName}" بنجاح`)
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف المنتج")
    }
    setIsConfirming(false)
  }

  if (isConfirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          className="px-2 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600"
        >
          تأكيد
        </button>
        <button
          onClick={() => setIsConfirming(false)}
          className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-lg hover:bg-gray-300"
        >
          إلغاء
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setIsConfirming(true)}
      className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}