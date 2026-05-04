// src/app/sitemap.ts
import { prisma } from "@/lib/prisma"
import { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://shopnext.com"

  // Get all products
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    select: { slug: true, updatedAt: true },
  })

  // Get all categories
  const categories = await prisma.category.findMany({
    select: { slug: true, updatedAt: true },
  })

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const categoryUrls = categories.map((cat) => ({
    url: `${baseUrl}/categories/${cat.slug}`,
    lastModified: cat.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...productUrls,
    ...categoryUrls,
  ]
}