// src/app/(store)/page.tsx
// import { getProducts } from "@/actions/product-actions"
import { HeroSection } from "@/components/home/hero-section"
import { CategoriesSection } from "@/components/home/categories-section"
import { FeaturedProducts } from "@/components/home/featured-products"
import { DealsSection } from "@/components/home/deals-section"
import { FeaturesSection } from "@/components/home/features-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { getProducts } from "@/actions/product.actions"

export default async function HomePage() {
  const { products: featuredProducts } = await getProducts({
    featured: true,
    limit: 8,
  })

  const { products: newArrivals } = await getProducts({
    sort: "newest",
    limit: 8,
  })

  return (
    <main>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts products={featuredProducts} title="منتجات مميزة" />
      <DealsSection />
      <FeaturedProducts products={newArrivals} title="وصل حديثاً" />
      <FeaturesSection />
      <TestimonialsSection />
    </main>
  )
}