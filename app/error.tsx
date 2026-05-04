// src/app/error.tsx
"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle, RotateCcw } from "lucide-react"
import Link from "next/link"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">حدث خطأ غير متوقع!</h1>
        <p className="text-gray-500 mb-6">
          نعتذر عن الإزعاج. يرجى المحاولة مرة أخرى.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} variant="gradient">
            <RotateCcw className="w-4 h-4 ml-2" />
            حاول مرة أخرى
          </Button>
          <Link href="/">
            <Button variant="outline">العودة للرئيسية</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}