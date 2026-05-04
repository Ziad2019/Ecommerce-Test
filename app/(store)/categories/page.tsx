// components/store/ProductCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  category: { name: string };
}

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
      slug: product.slug,
    });
    toast.success("✅ تمت إضافة المنتج للسلة!");
  };

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Product Image */}
      <Link href={`/products/${product.slug}`}>
        <div className="relative h-56 bg-gray-50 overflow-hidden">
          <Image
            src={product.images[0] || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 bg-primary text-white text-xs px-2 py-1 rounded-full">
            {product.category.name}
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-gray-800 hover:text-primary transition-colors line-clamp-2 mb-1">
            {product.name}
          </h3>
        </Link>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
            />
          ))}
          <span className="text-xs text-gray-500">(24)</span>
        </div>

        {/* Price + Cart */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary/90 active:scale-95 transition-all"
          >
            <ShoppingCart className="h-4 w-4" />
            أضف للسلة
          </button>
        </div>
      </div>
    </div>
  );
}