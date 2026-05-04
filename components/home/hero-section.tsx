// src/components/home/hero-section.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles } from "lucide-react"

const slides = [
  {
    id: 1,
    title: "تشكيلة الصيف الجديدة",
    subtitle: "خصم يصل إلى 50%",
    description: "اكتشف أحدث صيحات الموضة لهذا الصيف مع تشكيلتنا الحصرية",
    image: "/images/hero-1.jpg",
    color: "from-indigo-600 to-purple-700",
    link: "/products?category=fashion",
  },
  {
    id: 2,
    title: "أحدث الإلكترونيات",
    subtitle: "تكنولوجيا متقدمة",
    description: "أحدث الأجهزة الإلكترونية والهواتف الذكية بأفضل الأسعار",
    image: "/images/hero-2.jpg",
    color: "from-blue-600 to-cyan-600",
    link: "/products?category=electronics",
  },
  {
    id: 3,
    title: "اهتم بمنزلك",
    subtitle: "تصاميم عصرية",
    description: "مستلزمات منزلية أنيقة تضفي لمسة جمالية على بيتك",
    image: "/images/hero-3.jpg",
    color: "from-emerald-600 to-teal-600",
    link: "/products?category=home",
  },
]

export function HeroSection() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[current].id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7 }}
          className={`absolute inset-0 bg-gradient-to-br ${slides[current].color}`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl" />
          </div>

          <div className="container-custom h-full flex items-center relative z-10">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-2 mb-6"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-white text-sm font-medium">
                  {slides[current].subtitle}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 leading-tight"
              >
                {slides[current].title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl text-white/80 mb-8 max-w-lg"
              >
                {slides[current].description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex gap-4"
              >
                <Link href={slides[current].link}>
                  <Button
                    size="xl"
                    className="bg-white text-gray-900 hover:bg-gray-100 shadow-2xl group"
                  >
                    تسوق الآن
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/products">
                  <Button
                    size="xl"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    جميع المنتجات
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === current
                ? "w-8 bg-white"
                : "w-2 bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  )
}