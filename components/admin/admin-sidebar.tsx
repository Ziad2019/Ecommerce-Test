// src/components/admin/admin-sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag,
  BarChart3, Settings, ShoppingBag, ChevronLeft,
  Percent, MessageSquare, LogOut, X, Menu,
} from "lucide-react"
import { useState } from "react"

const menuItems = [
  { icon: LayoutDashboard, label: "لوحة التحكم", href: "/admin" },
  { icon: Package, label: "المنتجات", href: "/admin/products" },
  { icon: ShoppingCart, label: "الطلبات", href: "/admin/orders" },
  { icon: Tag, label: "التصنيفات", href: "/admin/categories" },
  { icon: Users, label: "العملاء", href: "/admin/customers" },
  { icon: Percent, label: "الكوبونات", href: "/admin/coupons" },
  { icon: MessageSquare, label: "التقييمات", href: "/admin/reviews" },
  { icon: BarChart3, label: "التحليلات", href: "/admin/analytics" },
  { icon: Settings, label: "الإعدادات", href: "/admin/settings" },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">ShopNext</h1>
            <p className="text-xs text-gray-400">لوحة التحكم</p>
          </div>
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative group ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="adminActiveTab"
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-l-full"
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
          العودة للمتجر
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed right-0 top-0 bottom-0 w-64 bg-gray-900 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="lg:hidden fixed right-0 top-0 bottom-0 w-64 bg-gray-900 z-50"
          >
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 left-4 p-2 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </motion.aside>
        </>
      )}
    </>
  )
}