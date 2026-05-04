// scripts/upload-seed-images.ts
import cloudinary from "../src/lib/cloudinary"
import { prisma } from "../src/lib/prisma"

const placeholderImages: Record<string, string[]> = {
  "iphone-15-pro-max": [
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop",
  ],
  "samsung-galaxy-s24-ultra": [
    "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=600&fit=crop",
  ],
  // ... باقي المنتجات
}

async function main() {
  for (const [slug, urls] of Object.entries(placeholderImages)) {
    for (const url of urls) {
      const result = await cloudinary.uploader.upload(url, {
        folder: "ecommerce",
      })
      console.log(`✅ ${slug}: ${result.secure_url}`)
    }
  }
}

main()