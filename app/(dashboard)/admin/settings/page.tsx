// src/app/(dashboard)/admin/settings/page.tsx
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Save, Store, Mail, CreditCard, Truck, Bell } from "lucide-react"
import toast from "react-hot-toast"

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [isLoading, setIsLoading] = useState(false)

  const tabs = [
    { id: "general", label: "عام", icon: Store },
    { id: "email", label: "البريد", icon: Mail },
    { id: "payment", label: "الدفع", icon: CreditCard },
    { id: "shipping", label: "الشحن", icon: Truck },
    { id: "notifications", label: "الإشعارات", icon: Bell },
  ]

  const handleSave = async () => {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    toast.success("تم حفظ الإعدادات بنجاح")
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">الإعدادات</h1>
        <p className="text-gray-500">إعدادات المتجر العامة</p>
      </div>

      <div className="grid lg:grid-cols-[250px_1fr] gap-6">
        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 h-fit sticky top-24">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          {activeTab === "general" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800">إعدادات عامة</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="اسم المتجر" defaultValue="ShopNext" />
                <Input label="البريد الإلكتروني" defaultValue="info@shopnext.com" />
                <Input label="رقم الهاتف" defaultValue="+20 123 456 7890" />
                <Input label="العملة" defaultValue="USD" />
                <div className="md:col-span-2">
                  <Input label="عنوان المتجر" defaultValue="القاهرة، مصر - شارع التحرير" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">وصف المتجر</label>
                  <textarea
                    rows={4}
                    defaultValue="أفضل متجر إلكتروني مبني بأحدث التقنيات"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800">إعدادات الشحن</h3>
              <div className="space-y-4">
                <Input label="رسوم الشحن الافتراضية" type="number" defaultValue="10" />
                <Input label="الحد الأدنى للشحن المجاني" type="number" defaultValue="100" />
                <Input label="مدة التوصيل (أيام)" defaultValue="3-5" />

                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-indigo-600" />
                  <div>
                    <p className="font-medium text-gray-800">شحن مجاني متاح</p>
                    <p className="text-sm text-gray-500">تفعيل الشحن المجاني للطلبات فوق الحد الأدنى</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-indigo-600" />
                  <div>
                    <p className="font-medium text-gray-800">شحن سريع</p>
                    <p className="text-sm text-gray-500">إتاحة خيار الشحن السريع بتكلفة إضافية</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {activeTab === "payment" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800">إعدادات الدفع</h3>
              <div className="space-y-4">
                <Input label="Stripe Public Key" defaultValue="pk_test_..." />
                <Input label="Stripe Secret Key" type="password" defaultValue="sk_test_..." />
                <Input label="نسبة الضريبة (%)" type="number" defaultValue="10" />

                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-indigo-600" />
                  <div>
                    <p className="font-medium text-gray-800">الدفع بالبطاقة</p>
                    <p className="text-sm text-gray-500">Visa, MasterCard, AMEX عبر Stripe</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-indigo-600" />
                  <div>
                    <p className="font-medium text-gray-800">الدفع عند الاستلام</p>
                    <p className="text-sm text-gray-500">COD - الدفع نقداً عند التوصيل</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {activeTab === "email" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800">إعدادات البريد</h3>
              <div className="space-y-4">
                <Input label="Resend API Key" type="password" defaultValue="re_..." />
                <Input label="بريد المرسل" defaultValue="noreply@shopnext.com" />
                <Input label="اسم المرسل" defaultValue="ShopNext" />

                <div className="space-y-3 mt-4">
                  <h4 className="font-medium text-gray-700">إشعارات البريد</h4>
                  {[
                    { label: "تأكيد الطلب", desc: "إرسال بريد تأكيد عند إنشاء طلب جديد" },
                    { label: "تحديث الشحن", desc: "إرسال بريد عند تحديث حالة الشحن" },
                    { label: "ترحيب العملاء", desc: "إرسال بريد ترحيب للعملاء الجدد" },
                    { label: "تذكير السلة", desc: "إرسال تذكير للعملاء الذين تركوا سلتهم" },
                  ].map((item) => (
                    <label key={item.label} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-indigo-600" />
                      <div>
                        <p className="font-medium text-gray-800">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800">إعدادات الإشعارات</h3>
              <div className="space-y-3">
                {[
                  { label: "طلب جديد", desc: "إشعار عند استلام طلب جديد" },
                  { label: "مخزون منخفض", desc: "إشعار عندما يقل المخزون عن الحد المحدد" },
                  { label: "تقييم جديد", desc: "إشعار عند إضافة تقييم جديد" },
                  { label: "تسجيل عميل جديد", desc: "إشعار عند تسجيل عميل جديد" },
                  { label: "دفع ناجح", desc: "إشعار عند اكتمال عملية دفع" },
                  { label: "طلب إرجاع", desc: "إشعار عند طلب إرجاع منتج" },
                ].map((item) => (
                  <label key={item.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-800">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <div className="relative">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-indigo-600 transition-colors" />
                      <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm peer-checked:translate-x-5 transition-transform" />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-6 mt-6 border-t border-gray-100">
            <Button onClick={handleSave} isLoading={isLoading} variant="gradient" size="lg">
              <Save className="w-5 h-5 ml-2" />
              حفظ الإعدادات
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}