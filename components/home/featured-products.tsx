// src/components/home/featured-products.tsx
import { ProductCard } from "@/components/products/product-card"

interface Props {
  products: any[]
  title: string
}

export function FeaturedProducts({ products, title }: Props) {
  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              {title}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mt-3" />
          </div>
          <a
            href="/products"
            className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
          >
            عرض الكل
            <span className="text-lg">←</span>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}