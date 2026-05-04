// actions/product-actions.ts
"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function getProducts({
  search = "",
  category = "",
  minPrice = 0,
  maxPrice = 100000,
  sort = "newest",
  page = 1,
  limit = 12,
  featured,
}: {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  sort?: string
  page?: number
  limit?: number
  featured?: boolean
} = {}) {

  const where: any = {
    status: "ACTIVE",
    // ❌ احذف isArchived: false - مش موجود في الـ schema
    price: { gte: minPrice, lte: maxPrice },
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ]
  }

  if (category) {
    where.category = { slug: category }
  }

  if (featured !== undefined) {
    where.isFeatured = featured
  }

  const orderBy: any = (() => {
    switch (sort) {
      case "price-asc":  return { price: "asc" }
      case "price-desc": return { price: "desc" }
      case "name-asc":   return { name: "asc" }
      default:           return { createdAt: "desc" }
    }
  })()

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        images: { orderBy: { position: "asc" }, take: 2 },
        category: { select: { name: true, slug: true } },
        reviews: { select: { rating: true } },
        _count: { select: { reviews: true, orderItems: true } },
      },
    }),
    prisma.product.count({ where }),
  ])

  const productsWithRating = products.map((product) => ({
    ...product,
    price: Number(product.price),
    compareAt: product.compareAt ? Number(product.compareAt) : null,
    avgRating:
      product.reviews.length > 0
        ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
        : 0,
  }))

  return {
    products: productsWithRating,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  }
}

export async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { position: "asc" } },
      category: true,
      variants: true,
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: { select: { reviews: true } },
    },
  })

  if (!product) return null

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      status: "ACTIVE",
    },
    include: { images: { take: 1 }, reviews: { select: { rating: true } } },
    take: 4,
  })

  return {
    ...product,
    price: Number(product.price),
    compareAt: product.compareAt ? Number(product.compareAt) : null,
    avgRating:
      product.reviews.length > 0
        ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
        : 0,
    relatedProducts,
  }
}

export async function createProduct(data: FormData) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized")

  const name      = data.get("name") as string
  const desc      = data.get("description") as string
  const price     = parseFloat(data.get("price") as string)
  const compareAt = data.get("compareAt") ? parseFloat(data.get("compareAt") as string) : null
  const stock     = parseInt(data.get("stock") as string)
  const categoryId = data.get("categoryId") as string
  const isFeatured = data.get("isFeatured") === "true"
  const status    = (data.get("status") as string) || "DRAFT"
  const images    = JSON.parse(data.get("images") as string) as string[]

  const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description: desc,
      price,
      compareAt,
      stock,
      categoryId,
      isFeatured,
      status: status as any,
      images: {
        create: images.map((url, index) => ({ url, position: index })),
      },
    },
  })

  revalidatePath("/admin/products")
  revalidatePath("/products")
  return product
}

export async function updateProduct(id: string, data: FormData) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized")

  const name      = data.get("name") as string
  const desc      = data.get("description") as string
  const price     = parseFloat(data.get("price") as string)
  const compareAt = data.get("compareAt") ? parseFloat(data.get("compareAt") as string) : null
  const stock     = parseInt(data.get("stock") as string)
  const categoryId = data.get("categoryId") as string
  const isFeatured = data.get("isFeatured") === "true"
  const status    = (data.get("status") as string) || "DRAFT"
  const images    = JSON.parse(data.get("images") as string) as string[]
  const slug      = name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")

  await prisma.productImage.deleteMany({ where: { productId: id } })

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      slug,
      description: desc,
      price,
      compareAt,
      stock,
      categoryId,
      isFeatured,
      status: status as any,
      images: {
        create: images.map((url, index) => ({ url, position: index })),
      },
    },
  })

  revalidatePath("/admin/products")
  revalidatePath(`/products/${slug}`)
  return product
}

export async function deleteProduct(id: string) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized")

  await prisma.product.delete({ where: { id } })

  revalidatePath("/admin/products")
  revalidatePath("/products")
}