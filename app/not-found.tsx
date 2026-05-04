// app/not-found.tsx
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      {/* Number */}
      <div className="text-center">
        <h1 className="text-9xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          404
        </h1>
        <div className="text-6xl mt-4">🛍️</div>
        <h2 className="text-2xl font-bold text-gray-800 mt-6">
          الصفحة غير موجودة
        </h2>
        <p className="text-gray-500 mt-3 max-w-md mx-auto">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها أو حذفها.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mt-10">
        <Link
          href="/"
          className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors text-center"
        >
          🏠 العودة للرئيسية
        </Link>
        <Link
          href="/products"
          className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-xl border-2 border-indigo-600 hover:bg-indigo-50 transition-colors text-center"
        >
          🛒 تصفح المنتجات
        </Link>
      </div>
    </div>
  )
}