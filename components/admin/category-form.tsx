// src/components/admin/category-form.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import toast from "react-hot-toast"
import slugify from "slugify"

interface Props {
  parents: { id: string; name: string }[]
}

export function CategoryForm({ parents }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const parentId = formData.get("parentId") as string
    const description = formData.get("description") as string

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug: slugify(name, { lower: true, strict: true }),
          description,
          parentId: parentId || null,
        }),
      })

      if (!res.ok) throw new Error("Failed")

      toast.success("تم إنشاء التصنيف بنجاح")
      router.refresh()
      ;(e.target as HTMLFormElement).reset()
    } catch (error) {
      toast.error("حدث خطأ أثناء إنشاء التصنيف")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 h-fit sticky top-24">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5 text-indigo-600" />
        إضافة تصنيف جديد
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="name" label="اسم التصنيف *" placeholder="مثال: إلكترونيات" required />

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            التصنيف الأب (اختياري)
          </label>
          <select
            name="parentId"
            className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
          >
            <option value="">بدون (تصنيف رئيسي)</option>
            {parents.map((parent) => (
              <option key={parent.id} value={parent.id}>{parent.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">الوصف</label>
          <textarea
            name="description"
            rows={3}
            placeholder="وصف التصنيف..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none"
          />
        </div>

        <Button type="submit" isLoading={isLoading} variant="gradient" className="w-full">
          <Plus className="w-5 h-5 ml-2" />
          إضافة التصنيف
        </Button>
      </form>
    </div>
  )
}