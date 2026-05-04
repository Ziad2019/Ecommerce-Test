// components/layout/header.tsx
"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { useCartStore } from "@/store/cart-store"
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
} from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { handleSignOut } from "@/actions/auth-actions"

export function Header() {
  const { data: session } = useSession()
  const { getItemCount, openCart } = useCartStore()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const itemCount = getItemCount()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const categories = [
    { href: "/categories/electronics", icon: "📱", label: "إلكترونيات" },
    { href: "/categories/fashion", icon: "👕", label: "أزياء" },
    { href: "/categories/home", icon: "🏠", label: "المنزل" },
    { href: "/categories/beauty", icon: "💄", label: "الجمال" },
    { href: "/categories/sports", icon: "⚽", label: "رياضة" },
  ]

  return (
    <>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-2 text-sm">
        🎉 خصم 20% على جميع المنتجات | كود: SHOP20
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-lg shadow-lg"
            : "bg-white"
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text hidden sm:block">
                ShopNext
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                الرئيسية
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                المنتجات
              </Link>

              {/* Categories Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                  التصنيفات
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 min-w-[220px]">
                    {categories.map((cat) => (
                      <Link
                        key={cat.href}
                        href={cat.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
                      >
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="font-medium text-gray-700">{cat.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link href="/products?featured=true" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                العروض
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ابحث عن منتجات..."
                  className="w-full h-11 pr-10 pl-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">

              {/* Mobile Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </button>

              {/* Wishlist */}
              <Link href="/wishlist" className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors relative">
                <Heart className="w-5 h-5 text-gray-600" />
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors relative"
              >
                <ShoppingBag className="w-5 h-5 text-gray-600" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -left-1 bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </button>

              {/* User Menu */}
              {session ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 transition-colors">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || ""}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-100"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-indigo-600" />
                      </div>
                    )}
                    <span className="hidden lg:block text-sm font-medium text-gray-700">
                      {session.user.name?.split(" ")[0]}
                    </span>
                  </button>

                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 min-w-[200px]">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-800">{session.user.name}</p>
                        <p className="text-sm text-gray-500">{session.user.email}</p>
                      </div>
                      <Link href="/account/profile" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm text-gray-600 mt-1">
                        <User className="w-4 h-4" />
                        حسابي
                      </Link>
                      <Link href="/account/orders" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm text-gray-600">
                        <ShoppingBag className="w-4 h-4" />
                        طلباتي
                      </Link>
                      {session.user.role === "ADMIN" && (
                        <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors text-sm text-indigo-600 font-medium">
                          ⚡ لوحة التحكم
                        </Link>
                      )}
                      <hr className="my-1" />
                      {/* ✅ Server Action منفصلة */}
                      <form action={handleSignOut}>
                        <button className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-50 transition-colors text-sm text-red-600 w-full">
                          <LogOut className="w-4 h-4" />
                          تسجيل الخروج
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">دخول</Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">حساب جديد</Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-600" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden pb-4"
              >
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="ابحث عن منتجات..."
                    className="w-full h-11 pr-10 pl-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-300 outline-none"
                    autoFocus
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden overflow-hidden border-t border-gray-100"
              >
                <nav className="py-4 space-y-1">
                  <Link href="/" className="block px-4 py-3 rounded-xl hover:bg-gray-50 font-medium text-gray-700">الرئيسية</Link>
                  <Link href="/products" className="block px-4 py-3 rounded-xl hover:bg-gray-50 font-medium text-gray-700">المنتجات</Link>
                  <Link href="/categories" className="block px-4 py-3 rounded-xl hover:bg-gray-50 font-medium text-gray-700">التصنيفات</Link>
                  <Link href="/products?featured=true" className="block px-4 py-3 rounded-xl hover:bg-gray-50 font-medium text-gray-700">العروض</Link>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <CartDrawer />
    </>
  )
}