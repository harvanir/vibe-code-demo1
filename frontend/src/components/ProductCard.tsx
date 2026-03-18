'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import type { Product } from '@/types/product'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const searchParams = useSearchParams()
  const currentQuery = searchParams.toString()
  const from = currentQuery ? `/products?${currentQuery}` : '/products'

  return (
    <Link
      href={{
        pathname: `/products/${product.id}`,
        query: { from },
      }}
    >
      <div className="bg-white rounded-2xl shadow hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
        {/* Thumbnail placeholder */}
        <div className="w-full h-36 bg-gray-100 rounded-t-2xl flex items-center justify-center">
          <span className="text-gray-400 text-xs">No image</span>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full self-start mb-2">
            {product.category}
          </span>
          <h2 className="font-semibold text-gray-900 text-sm leading-snug mb-auto overflow-hidden">
            {product.name}
          </h2>
          <p className="text-blue-600 font-bold text-lg mt-3">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  )
}