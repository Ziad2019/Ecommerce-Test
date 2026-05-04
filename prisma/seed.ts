// prisma/seed.ts
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Create Admin
  const adminPassword = await bcrypt.hash("admin123456", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@shopnext.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@shopnext.com",
      password: adminPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  })
  console.log("✅ Admin created:", admin.email)

  // Create Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "electronics" },
      update: {},
      create: { name: "إلكترونيات", slug: "electronics", description: "أحدث الأجهزة الإلكترونية" },
    }),
    prisma.category.upsert({
      where: { slug: "fashion" },
      update: {},
      create: { name: "أزياء", slug: "fashion", description: "أحدث صيحات الموضة" },
    }),
    prisma.category.upsert({
      where: { slug: "home" },
      update: {},
      create: { name: "المنزل", slug: "home", description: "مستلزمات المنزل" },
    }),
    prisma.category.upsert({
      where: { slug: "beauty" },
      update: {},
      create: { name: "الجمال", slug: "beauty", description: "منتجات العناية والجمال" },
    }),
    prisma.category.upsert({
      where: { slug: "sports" },
      update: {},
      create: { name: "رياضة", slug: "sports", description: "مستلزمات رياضية" },
    }),
  ])
  console.log(`✅ ${categories.length} categories created`)

  // Create Sample Products
  const sampleProducts = [
    {
      name: "iPhone 15 Pro Max",
      slug: "iphone-15-pro-max",
      description: "أحدث هاتف من Apple مع شريحة A17 Pro وكاميرا 48MP وإطار تيتانيوم.",
      shortDesc: "الهاتف الأقوى من Apple",
      price: 1199,
      compareAt: 1399,
      stock: 50,
      categoryId: categories[0].id,
      isFeatured: true,
      status: "ACTIVE" as const,
      sku: "IPH-15PM-256",
    },
    {
      name: "Samsung Galaxy S24 Ultra",
      slug: "samsung-galaxy-s24-ultra",
      description: "هاتف Samsung الرائد مع قلم S Pen وكاميرا 200MP وذكاء اصطناعي متقدم.",
      shortDesc: "الهاتف الذكي الأكثر تطوراً",
      price: 1099,
      compareAt: 1299,
      stock: 35,
      categoryId: categories[0].id,
      isFeatured: true,
      status: "ACTIVE" as const,
      sku: "SAM-S24U-256",
    },
    {
      name: "Nike Air Max 270",
      slug: "nike-air-max-270",
      description: "حذاء رياضي مريح من Nike بتقنية Air Max لأقصى راحة أثناء المشي والجري.",
      shortDesc: "راحة فائقة مع كل خطوة",
      price: 150,
      compareAt: 200,
      stock: 100,
      categoryId: categories[1].id,
      isFeatured: true,
      status: "ACTIVE" as const,
      sku: "NK-AM270-42",
    },
  ]

  for (const product of sampleProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        images: {
          create: [
            { url: "https://via.placeholder.com/600x600/6366f1/ffffff?text=" + encodeURIComponent(product.name), position: 0 },
            { url: "https://via.placeholder.com/600x600/8b5cf6/ffffff?text=Image+2", position: 1 },
          ],
        },
      },
    })
  }
  console.log(`✅ ${sampleProducts.length} products created`)

  // Create Welcome Coupon
// prisma/seed.ts (تكملة)

  await prisma.coupon.upsert({
    where: { code: "SHOP50" },
    update: {},
    create: {
      code: "SHOP50",
      type: "FIXED",
      value: 50,
      minPurchase: 200,
      isActive: true,
    },
  })
  console.log("✅ Coupons created")

  console.log("🎉 Seeding complete!")
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
  