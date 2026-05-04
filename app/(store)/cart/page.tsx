"use client"

import { useCartStore } from "@/store/cart-store"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Trash2, Minus, Plus, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } =
    useCartStore()
  const subtotal = getSubtotal()
  const shipping = subtotal >= 100 ? 0 : 10
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <ShoppingBag className="w-20 h-20 text-gray-200 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">السلة فارغة</h1>
        <p className="text-gray-500 mb-6">أضف منتجات إلى سلة التسوق</p>
        <Link href="/products">
          <Button variant="gradient" size="lg">تسوق الآن</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">سلة التسوق ({items.length})</h1>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 bg-white rounded-2xl border border-gray-100 p-4">
              <div className="relative w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <Link href={`/products/${item.slug}`} className="font-semibold text-gray-800 hover:text-indigo-600">
                  {item.name}
                </Link>
                <p className="text-indigo-600 font-bold mt-1">{formatPrice(item.price)}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-800">{formatPrice(item.price * item.quantity)}</span>
                    <button onClick={() => removeItem(item.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-600 font-medium">
            مسح السلة
          </button>
        </div>

        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-6">ملخص الطلب</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-500">
                <span>المجموع الفرعي</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>الشحن</span>
                <span>{shipping === 0 ? "مجاني" : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-3 border-t">
                <span>الإجمالي</span>
                <span className="text-indigo-600">{formatPrice(total)}</span>
              </div>
            </div>
            <Link href="/checkout" className="block mt-6">
              <Button variant="gradient" size="lg" className="w-full">إتمام الطلب</Button>
            </Link>
            <Link href="/products" className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500 hover:text-indigo-600">
              <ArrowLeft className="w-4 h-4" />
              متابعة التسوق
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}