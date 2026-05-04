// src/app/(store)/products/[slug]/page.tsx
// import { getProduct } from "@/actions/product-actions"
import { notFound } from "next/navigation"
import { ProductGallery } from "@/components/products/product-gallery"
import { ProductInfo } from "@/components/products/product-info"
import { ProductTabs } from "@/components/products/product-tabs"
import { ProductCard } from "@/components/products/product-card"
import type { Metadata } from "next"
import { getProduct } from "@/actions/product.actions"
import Link from "next/link"

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug)
  if (!product) return {}

  return {
    title: product.name,
    description: product.shortDesc || product?.description?.substring(0, 160),
    openGraph: {
      images: product.images[0]?.url ? [product.images[0].url] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug)

  if (!product) notFound()

  return (
    <div className="container-custom py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-indigo-600">الرئيسية</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-indigo-600">المنتجات</Link>
        <span>/</span>
        <Link href={`/categories/${product.category.slug}`} className="hover:text-indigo-600">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">{product.name}</span>
      </nav>

      {/* Product Main Section */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <ProductGallery images={product.images} name={product.name} />
        <ProductInfo product={product} />
      </div>

      {/* Tabs: Description, Reviews, etc. */}
      <ProductTabs product={product} />

      {/* Related Products */}
      {product.relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            منتجات مشابهة
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {product.relatedProducts.map((related: any) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}