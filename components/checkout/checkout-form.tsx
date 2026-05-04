// src/components/checkout/checkout-form.tsx
"use client"

import { useState } from "react"
import { useCartStore } from "@/store/cart-store"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { addressSchema, type AddressInput } from "@/lib/validators"
import { createOrder } from "@/actions/order-actions"
import { createCheckoutSession } from "@/actions/payment-actions"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import {
  CreditCard, Truck, ShieldCheck, Lock, MapPin,
  CheckCircle, Package, ChevronLeft
} from "lucide-react"
import Image from "next/image"
import toast from "react-hot-toast"
import { motion } from "framer-motion"

interface Props {
  user: any
}

export function CheckoutForm({ user }: Props) {
  const { items, getSubtotal, clearCart } = useCartStore()
  const [step, setStep] = useState(1) // 1: Address, 2: Review, 3: Payment
  const [isLoading, setIsLoading] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)

  const subtotal = getSubtotal()
  const shipping = subtotal >= 100 ? 0 : 10
  const tax = subtotal * 0.1
  const total = subtotal - discount + shipping + tax

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
  })

  const handleCheckout = async () => {
    setIsLoading(true)
    try {
      const address = getValues()

      // Create order
      const order = await createOrder({
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          variant: item.variant,
        })),
        shippingAddress: address as any,
        couponCode: couponCode || undefined,
      })

      // Create Stripe checkout session
      const { url } = await createCheckoutSession(order.id)

      if (url) {
        clearCart()
        window.location.href = url
      }
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء إنشاء الطلب")
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <Package className="w-20 h-20 text-gray-200 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">السلة فارغة</h2>
        <p className="text-gray-500 mb-6">أضف منتجات قبل إتمام الطلب</p>
        <a href="/products">
          <Button variant="gradient" size="lg">تسوق الآن</Button>
        </a>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-8">
      {/* Left: Steps */}
      <div>
        {/* Progress Bar */}
        <div className="flex items-center gap-4 mb-8">
          {[
            { num: 1, label: "العنوان" },
            { num: 2, label: "المراجعة" },
            { num: 3, label: "الدفع" },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step >= s.num
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {step > s.num ? <CheckCircle className="w-5 h-5" /> : s.num}
              </div>
              <span
                className={`text-sm font-medium ${
                  step >= s.num ? "text-indigo-600" : "text-gray-400"
                }`}
              >
                {s.label}
              </span>
              {i < 2 && (
                <div
                  className={`flex-1 h-0.5 rounded-full ${
                    step > s.num ? "bg-indigo-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Address */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl border border-gray-100 p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-600" />
              عنوان التوصيل
            </h2>

            <form
              onSubmit={handleSubmit(() => setStep(2))}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <Input
                label="الاسم الكامل"
                placeholder="محمد أحمد"
                error={errors.name?.message}
                {...register("name")}
              />
              <Input
                label="رقم الهاتف"
                placeholder="+20 xxx xxx xxxx"
                error={errors.phone?.message}
                {...register("phone")}
              />
              <div className="md:col-span-2">
                <Input
                  label="العنوان"
                  placeholder="شارع، مبنى، شقة..."
                  error={errors.street?.message}
                  {...register("street")}
                />
              </div>
              <Input
                label="المدينة"
                placeholder="القاهرة"
                error={errors.city?.message}
                {...register("city")}
              />
              <Input
                label="المحافظة / الولاية"
                placeholder="القاهرة"
                error={errors.state?.message}
                {...register("state")}
              />
              <Input
                label="الدولة"
                placeholder="مصر"
                error={errors.country?.message}
                {...register("country")}
              />
              <Input
                label="الرمز البريدي"
                placeholder="11511"
                error={errors.zipCode?.message}
                {...register("zipCode")}
              />
              <div className="md:col-span-2 flex justify-end mt-4">
                <Button type="submit" variant="gradient" size="lg">
                  متابعة للمراجعة
                  <ChevronLeft className="w-5 h-5 mr-2" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Step 2: Review */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Order Items */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-600" />
                مراجعة المنتجات
              </h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-gray-50 rounded-xl p-3">
                    <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-500">الكمية: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-indigo-600">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  عنوان التوصيل
                </h3>
                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  تعديل
                </button>
              </div>
              <div className="text-gray-600 text-sm space-y-1">
                <p className="font-semibold text-gray-800">{getValues("name")}</p>
                <p>{getValues("street")}</p>
                <p>{getValues("city")}, {getValues("state")} {getValues("zipCode")}</p>
                <p>{getValues("country")}</p>
                <p>{getValues("phone")}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button onClick={() => setStep(1)} variant="outline" size="lg">
                رجوع
              </Button>
              <Button onClick={() => setStep(3)} variant="gradient" size="lg" className="flex-1">
                متابعة للدفع
                <ChevronLeft className="w-5 h-5 mr-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl border border-gray-100 p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              الدفع الآمن
            </h2>

            <div className="bg-indigo-50 rounded-xl p-4 mb-6 flex items-center gap-3">
              <Lock className="w-5 h-5 text-indigo-600" />
              <p className="text-sm text-indigo-700">
                جميع بياناتك مشفرة ومحمية بتقنية SSL
              </p>
            </div>

            {/* Coupon Code */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                كود الخصم
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="أدخل كود الخصم"
                  className="flex-1 h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-300"
                />
                <Button variant="outline" onClick={() => toast.success("تم تطبيق الخصم!")}>
                  تطبيق
                </Button>
              </div>
            </div>

            {/* Pay Button */}
            <div className="space-y-3">
              <Button
                onClick={handleCheckout}
                isLoading={isLoading}
                variant="gradient"
                size="xl"
                className="w-full"
              >
                <Lock className="w-5 h-5 ml-2" />
                ادفع الآن {formatPrice(total)}
              </Button>
              <Button
                onClick={() => setStep(2)}
                variant="ghost"
                className="w-full"
              >
                رجوع للمراجعة
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100">
              <div className="text-center">
                <ShieldCheck className="w-8 h-8 text-green-500 mx-auto mb-1" />
                <p className="text-xs text-gray-500">دفع آمن</p>
              </div>
              <div className="text-center">
                <Truck className="w-8 h-8 text-blue-500 mx-auto mb-1" />
                <p className="text-xs text-gray-500">شحن سريع</p>
              </div>
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-indigo-500 mx-auto mb-1" />
                <p className="text-xs text-gray-500">ضمان الجودة</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Right: Order Summary */}
      <div className="lg:sticky lg:top-24 h-fit">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">ملخص الطلب</h3>

          {/* Items Summary */}
          <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                <p className="flex-1 text-sm text-gray-600 line-clamp-1">{item.name}</p>
                <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-sm text-gray-500">
              <span>المجموع الفرعي</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>الشحن</span>
              <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                {shipping === 0 ? "مجاني" : formatPrice(shipping)}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>الضريبة (10%)</span>
              <span>{formatPrice(tax)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600 font-medium">
                <span>الخصم</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-100">
              <span>الإجمالي</span>
              <span className="text-indigo-600">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}