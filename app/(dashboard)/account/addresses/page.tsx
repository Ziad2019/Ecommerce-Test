// src/app/(dashboard)/account/addresses/page.tsx
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { AddressCard } from "@/components/account/address-card"
import { AddAddressButton } from "@/components/account/add-address-button"
import { MapPin } from "lucide-react"

export default async function AddressesPage() {
  const session = await auth()

  const addresses = await prisma.address.findMany({
    where: { userId: session!.user?.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">عناويني</h2>
        <AddAddressButton />
      </div>

      {addresses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <MapPin className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-800 mb-2">لا توجد عناوين</h3>
          <p className="text-gray-500">أضف عنوان توصيل جديد</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <AddressCard key={address.id} address={address} />
          ))}
        </div>
      )}
    </div>
  )
}