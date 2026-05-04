// src/components/products/product-gallery.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"

interface Props {
  images: { id: string; url: string; alt?: string }[]
  name: string
}

export function ProductGallery({ images, name }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  const currentImage = images[selectedIndex]

  const goNext = () => setSelectedIndex((prev) => (prev + 1) % images.length)
  const goPrev = () =>
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-100 rounded-3xl overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full h-full"
          >
            <Image
              src={currentImage?.url || "/images/placeholder.png"}
              alt={currentImage?.alt || name}
              fill
              className={`object-cover transition-transform duration-500 ${
                isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={goNext}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Zoom Icon */}
        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all">
          <div className="w-9 h-9 bg-white/90 backdrop-blur rounded-xl flex items-center justify-center shadow-lg">
            <ZoomIn className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-300 ${
                index === selectedIndex
                  ? "border-indigo-600 ring-2 ring-indigo-200"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <Image
                src={image.url}
                alt={image.alt || `${name} ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}