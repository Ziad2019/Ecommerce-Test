// src/components/home/testimonials-section.tsx
"use client"

import { Star, Quote } from "lucide-react"
import { motion } from "framer-motion"

const testimonials = [
  {
    id: 1,
    name: "أحمد محمد",
    role: "عميل منذ 2023",
    image: null,
    rating: 5,
    text: "تجربة تسوق ممتازة! المنتجات أصلية والتوصيل سريع جداً. أنصح الجميع بالشراء من هنا.",
  },
  {
    id: 2,
    name: "سارة عبدالله",
    role: "عميلة منذ 2024",
    image: null,
    rating: 5,
    text: "أفضل متجر إلكتروني تعاملت معه. خدمة العملاء ممتازة والأسعار تنافسية جداً.",
  },
  {
    id: 3,
    name: "محمد خالد",
    role: "عميل منذ 2023",
    image: null,
    rating: 4,
    text: "منتجات عالية الجودة وتغليف ممتاز. استلمت طلبي في يومين فقط. شكراً لكم!",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            ماذا يقول عملاؤنا
          </h2>
          <p className="text-gray-500 text-lg">آراء حقيقية من عملائنا</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 card-hover relative"
            >
              <Quote className="w-10 h-10 text-indigo-100 absolute top-6 left-6" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-600 leading-relaxed mb-6 relative z-10">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{testimonial.name}</p>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}