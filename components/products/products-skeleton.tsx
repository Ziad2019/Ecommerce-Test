// src/components/products/products-skeleton.tsx
export function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
          <div className="aspect-square bg-gray-200" />
          <div className="p-4 space-y-3">
            <div className="h-3 bg-gray-200 rounded-full w-1/3" />
            <div className="h-4 bg-gray-200 rounded-full w-full" />
            <div className="h-4 bg-gray-200 rounded-full w-2/3" />
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="w-4 h-4 bg-gray-200 rounded" />
              ))}
            </div>
            <div className="h-5 bg-gray-200 rounded-full w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}