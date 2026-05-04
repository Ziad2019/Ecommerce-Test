// src/components/admin/admin-header.tsx
"use client"

import { Bell, Search, LogOut } from "lucide-react"
import { logout } from "@/actions/auth-actions"

interface Props {
  user: any
}

export function AdminHeader({ user }: Props) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="flex items-center justify-between px-6 h-16">
        {/* Search */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث في لوحة التحكم..."
              className="w-full h-10 pr-10 pl-4 rounded-xl bg-gray-100 border-0 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User */}
          <div className="flex items-center gap-3 pr-3 border-r border-gray-200">
            {user.image ? (
              <img src={user.image} alt={user.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-100" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-600 font-bold text-sm">{user.name?.charAt(0)}</span>
              </div>
            )}
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">مدير</p>
            </div>
          </div>

          {/* Logout */}
          <form action={logout}>
            <button type="submit" className="p-2.5 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all">
              <LogOut className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}