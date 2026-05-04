// src/components/home/deals-section.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Clock, Flame } from "lucide-react"

export function DealsSection() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        return { hours: 23, minutes: 59, seconds: 59 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 to-orange-500 p-8 md:p-12">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-10 -right-10 w-60 h-60 bg-white rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-white rounded-full" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-6 h-6 text-yellow-300" />
                <span className="text-white/90 font-medium">عرض محدود</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                خصم حتى 50%
              </h2>
              <p className="text-white/80 text-lg mb-6">
                لا تفوت أقوى العروض والخصومات الحصرية
              </p>
              <Link href="/products?featured=true">
                <Button
                  size="xl"
                  className="bg-white text-red-600 hover:bg-gray-100 shadow-2xl font-bold"
                >
                  تسوق العروض الآن
                </Button>
              </Link>
            </div>

            {/* Countdown Timer */}
            <div className="flex gap-4">
              {[
                { label: "ساعة", value: timeLeft.hours },
                { label: "دقيقة", value: timeLeft.minutes },
                { label: "ثانية", value: timeLeft.seconds },
              ].map((unit) => (
                <div key={unit.label} className="text-center">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-2">
                    <span className="text-3xl font-black text-white">
                      {String(unit.value).padStart(2, "0")}
                    </span>
                  </div>
                  <span className="text-sm text-white/80">{unit.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}