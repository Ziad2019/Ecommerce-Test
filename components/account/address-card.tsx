// src/components/account/address-card.tsx
"use client"

import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, MapPin, Phone } from "lucide-react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

interface Props {
  address: any
}

export function AddressCard({ address }: Props) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm("هل أنت متأكد من حذف هذا العنوان؟")) return

    try {
      await fetch(`/api/account/addresses/${address.id}`, { method: "DELETE" })
      toast.success("تم حذف العنوان")
      router.refresh()
    } catch {
      toast.error("حدث خطأ")
    }
  }

  return (
    <div className={`bg-white rounded-2xl border-2 p-6 transition-all ${
      address.isDefault ? "border-indigo-300 ring-2 ring-indigo-50" : "border-gray-100"
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-gray-800">{address.name}</h3>
          {address.isDefault && <Badge variant="default">الافتراضي</Badge>}
        </div>
        <div className="flex gap-1">
          <button className="p-2 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-all">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={handleDelete} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-600 space-y-1">
        <p>{address.street}</p>
        <p>{address.city}, {address.state} {address.zipCode}</p>
        <p>{address.country}</p>
        <div className="flex items-center gap-2 pt-2 mt-2 border-t border-gray-100">
          <Phone className="w-4 h-4 text-gray-400" />
          <span>{address.phone}</span>
        </div>
      </div>
    </div>
  )
}