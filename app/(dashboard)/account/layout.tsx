// src/app/(dashboard)/account/layout.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { User, ShoppingBag, MapPin, Heart, Settings } from "lucide-react"

const accountLinks = [
  { href: "/account/profile", label: "حسابي", icon: User },
  { href: "/account/orders", label: "طلباتي", icon: ShoppingBag },
  { href: "/account/addresses", label: "عناويني", icon: MapPin },
  { href: "/account/wishlist", label: "المفضلة", icon: Heart },
  { href: "/account/settings", label: "الإعدادات", icon: Settings },
]

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect("/login?callbackUrl=/account/profile")

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">حسابي</h1>

      <div className="grid lg:grid-cols-[250px_1fr] gap-8">
        {/* Sidebar */}
        <aside>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sticky top-24">
            {/* User Info */}
            <div className="text-center pb-4 mb-4 border-b border-gray-100">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || ""}
                  className="w-16 h-16 rounded-full mx-auto mb-3 ring-4 ring-indigo-50"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-indigo-600">
                    {session.user.name?.charAt(0)}
                  </span>
                </div>
              )}
              <h3 className="font-semibold text-gray-800">{session.user.name}</h3>
              <p className="text-sm text-gray-500">{session.user.email}</p>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {accountLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main>{children}</main>
      </div>
    </div>
  )
}