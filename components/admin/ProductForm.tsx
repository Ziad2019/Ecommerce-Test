// src/components/admin/product-form.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { productSchema, type ProductInput } from "@/lib/validators"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Save, X, Upload, Image as ImageIcon, GripVertical,
  Plus, Trash2, Package, DollarSign, Tag, Info
} from "lucide-react"
import Image from "next/image"
import toast from "react-hot-toast"
import { motion, Reorder } from "framer-motion"
import { createProduct, updateProduct } from "@/actions/product.actions"

interface Props {
  categories: any[]
  product?: any
}

export function ProductForm({ categories, product }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<string[]>(
    product?.images?.map((img: any) => img.url) || []
  )
  const [activeTab, setActiveTab] = useState("general")

  const isEditing = !!product

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          description: product.description,
          price: Number(product.price),
          compareAt: product.compareAt ? Number(product.compareAt) : undefined,
          stock: product.stock,
          categoryId: product.categoryId,
          isFeatured: product.isFeatured,
          status: product.status,
          images: product.images.map((img: any) => img.url),
        }
      : {
          status: "DRAFT",
          isFeatured: false,
          stock: 0,
          images: [],
        },
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    // هنا يمكن استخدام Uploadthing أو أي خدمة رفع صور
    // للتبسيط نستخدم URL مباشر
    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append("file", file)

      try {
        // Upload to your API
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
        const data = await res.json()
        
        if (data.url) {
          setImages((prev) => [...prev, data.url])
          setValue("images", [...images, data.url])
        }
      } catch (error) {
        toast.error("حدث خطأ أثناء رفع الصورة")
      }
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    setValue("images", newImages)
  }

  const onSubmit = async (data: ProductInput) => {
    if (images.length === 0) {
      toast.error("يجب إضافة صورة واحدة على الأقل")
      return
    }

    setIsLoading(true)
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (key === "images") return
        formData.append(key, String(value))
      })
      formData.append("images", JSON.stringify(images))

      if (isEditing) {
        await updateProduct(product.id, formData)
        toast.success("تم تحديث المنتج بنجاح")
      } else {
        await createProduct(formData)
        toast.success("تم إنشاء المنتج بنجاح")
      }
      router.push("/admin/products")
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ")
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: "general", label: "معلومات عامة", icon: Info },
    { id: "pricing", label: "التسعير والمخزون", icon: DollarSign },
    { id: "media", label: "الصور", icon: ImageIcon },
    { id: "organization", label: "التنظيم", icon: Tag },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-indigo-100 text-indigo-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-6">
        {/* Main Content */}
        <div className="space-y-6">
          {/* General Tab */}
          {activeTab === "general" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
            >
              <h3 className="font-bold text-gray-800 text-lg mb-4">معلومات المنتج</h3>

              <Input
                label="اسم المنتج *"
                placeholder="مثال: iPhone 15 Pro Max"
                error={errors.name?.message}
                {...register("name")}
              />

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  الوصف *
                </label>
                <textarea
                  placeholder="اكتب وصف تفصيلي للمنتج..."
                  rows={8}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 resize-none transition-all"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
                )}
              </div>
            </motion.div>
          )}

          {/* Pricing Tab */}
          {activeTab === "pricing" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
            >
              <h3 className="font-bold text-gray-800 text-lg mb-4">التسعير والمخزون</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="السعر *"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  icon={<DollarSign className="w-5 h-5" />}
                  error={errors.price?.message}
                  {...register("price")}
                />

                <Input
                  label="السعر قبل الخصم"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  icon={<DollarSign className="w-5 h-5" />}
                  error={errors.compareAt?.message}
                  {...register("compareAt")}
                />

                <Input
                  label="المخزون *"
                  type="number"
                  placeholder="0"
                  icon={<Package className="w-5 h-5" />}
                  error={errors.stock?.message}
                  {...register("stock")}
                />
              </div>

             // src/components/admin/product-form.tsx (تكملة - Pricing Tab)

              {/* Price Preview */}
              {watch("price") && (
                <div className="bg-gray-50 rounded-xl p-4 mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">معاينة السعر</h4>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-bold text-indigo-600">
                      ${Number(watch("price") || 0).toFixed(2)}
                    </span>
                    {watch("compareAt") && Number(watch("compareAt")) > Number(watch("price")) && (
                      <>
                        <span className="text-lg text-gray-400 line-through">
                          ${Number(watch("compareAt")).toFixed(2)}
                        </span>
                        <span className="text-sm bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                          -{Math.round(((Number(watch("compareAt")) - Number(watch("price"))) / Number(watch("compareAt"))) * 100)}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Media Tab */}
          {activeTab === "media" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 p-6"
            >
              <h3 className="font-bold text-gray-800 text-lg mb-4">صور المنتج</h3>

              {/* Upload Zone */}
              <label className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/50 transition-all block mb-6">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-indigo-600" />
                  </div>
                  <p className="text-gray-800 font-semibold mb-1">
                    اسحب الصور هنا أو اضغط للرفع
                  </p>
                  <p className="text-sm text-gray-400">
                    PNG, JPG, WebP حتى 5MB لكل صورة
                  </p>
                </div>
              </label>

              {/* Image Preview Grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map((url, index) => (
                    <motion.div
                      key={url}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 border-transparent hover:border-indigo-300 transition-all"
                    >
                      <Image
                        src={url}
                        alt={`صورة ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 left-2 w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {/* Order Badge */}
                      <span className="absolute top-2 right-2 w-7 h-7 bg-black/60 text-white text-xs rounded-lg flex items-center justify-center backdrop-blur font-bold">
                        {index + 1}
                      </span>
                      {/* Primary Badge */}
                      {index === 0 && (
                        <span className="absolute bottom-2 right-2 bg-indigo-600 text-white text-[10px] px-2 py-1 rounded-lg font-medium">
                          رئيسية
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}

              {errors.images && (
                <p className="text-xs text-red-500 mt-2">{errors.images.message}</p>
              )}
            </motion.div>
          )}

          {/* Organization Tab */}
          {activeTab === "organization" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
            >
              <h3 className="font-bold text-gray-800 text-lg mb-4">التنظيم</h3>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  التصنيف *
                </label>
                <select
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 bg-white transition-all"
                  {...register("categoryId")}
                >
                  <option value="">اختر التصنيف</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-xs text-red-500 mt-1">{errors.categoryId.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  حالة المنتج
                </label>
                <select
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 bg-white transition-all"
                  {...register("status")}
                >
                  <option value="DRAFT">مسودة</option>
                  <option value="ACTIVE">نشط</option>
                  <option value="ARCHIVED">مؤرشف</option>
                </select>
              </div>

              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  {...register("isFeatured")}
                />
                <div>
                  <p className="font-medium text-gray-800">منتج مميز</p>
                  <p className="text-sm text-gray-500">سيظهر في قسم المنتجات المميزة على الصفحة الرئيسية</p>
                </div>
              </label>
            </motion.div>
          )}
        </div>

        {/* Sidebar - Preview & Actions */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
            <h3 className="font-bold text-gray-800 mb-4">الإجراءات</h3>
            <div className="space-y-3">
              <Button
                type="submit"
                isLoading={isLoading}
                variant="gradient"
                size="lg"
                className="w-full"
              >
                <Save className="w-5 h-5 ml-2" />
                {isEditing ? "حفظ التعديلات" : "إنشاء المنتج"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.push("/admin/products")}
              >
                إلغاء
              </Button>
            </div>

            {/* Quick Stats for Editing */}
            {isEditing && (
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">تاريخ الإنشاء</span>
                  <span className="text-gray-700">
                    {new Date(product.createdAt).toLocaleDateString("ar-EG")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">آخر تحديث</span>
                  <span className="text-gray-700">
                    {new Date(product.updatedAt).toLocaleDateString("ar-EG")}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Live Preview */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4">معاينة</h3>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="aspect-square bg-gray-100 relative">
                {images[0] ? (
                  <Image src={images[0]} alt="Preview" fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="font-semibold text-gray-800 text-sm">
                  {watch("name") || "اسم المنتج"}
                </p>
                <p className="text-indigo-600 font-bold mt-1">
                  ${Number(watch("price") || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}