// src/app/(dashboard)/account/profile/page.tsx
"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Save, Camera, User, Mail, Phone } from "lucide-react"
import toast from "react-hot-toast"

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          phone: formData.get("phone"),
        }),
      })

      if (!res.ok) throw new Error("Failed")

      await update({ name: formData.get("name") })
      toast.success("تم تحديث الملف الشخصي")
    } catch (error) {
      toast.error("حدث خطأ")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">الملف الشخصي</h2>

      {/* Avatar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt=""
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-indigo-50"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-indigo-100 flex items-center justify-center">
                <User className="w-10 h-10 text-indigo-600" />
              </div>
            )}
            <button className="absolute -bottom-2 -left-2 w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{session?.user?.name}</h3>
            <p className="text-gray-500">{session?.user?.email}</p>
            <p className="text-sm text-indigo-600 font-medium mt-1">
              عضو منذ {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-800 mb-4">المعلومات الشخصية</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              name="name"
              label="الاسم الكامل"
              defaultValue={session?.user?.name || ""}
              icon={<User className="w-5 h-5" />}
            />
            <Input
              name="email"
              label="البريد الإلكتروني"
              defaultValue={session?.user?.email || ""}
              icon={<Mail className="w-5 h-5" />}
              disabled
            />
            <Input
              name="phone"
              label="رقم الهاتف"
              placeholder="+20 xxx xxx xxxx"
              icon={<Phone className="w-5 h-5" />}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" isLoading={isLoading} variant="gradient">
              <Save className="w-5 h-5 ml-2" />
              حفظ التغييرات
            </Button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-800 mb-4">تغيير كلمة المرور</h3>
        <form className="space-y-4">
          <Input name="currentPassword" label="كلمة المرور الحالية" type="password" />
          <div className="grid md:grid-cols-2 gap-4">
            <Input name="newPassword" label="كلمة المرور الجديدة" type="password" />
            <Input name="confirmPassword" label="تأكيد كلمة المرور" type="password" />
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit" variant="outline">
              تغيير كلمة المرور
            </Button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 rounded-2xl border border-red-100 p-6">
        <h3 className="font-bold text-red-800 mb-2">منطقة الخطر</h3>
        <p className="text-sm text-red-600 mb-4">
          حذف حسابك نهائياً. هذا الإجراء لا يمكن التراجع عنه.
        </p>
        <Button variant="destructive" size="sm">
          حذف الحساب
        </Button>
      </div>
    </div>
  )
}