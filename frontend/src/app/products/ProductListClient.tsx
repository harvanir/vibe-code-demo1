'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import type { PaginatedResponse, Product, ProductFilter } from '@/types/product'
import ProductCard from '@/components/ProductCard'
import FilterBar from '@/components/FilterBar'
import Pagination from '@/components/Pagination'

interface ProductListClientProps {
  initialData: PaginatedResponse<Product>
  filter: ProductFilter
}

const CATEGORIES = ['Electronics', 'Furniture', 'Sports', 'Groceries', 'Stationery']

export default function ProductListClient({ initialData, filter }: ProductListClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  function pushParams(params: URLSearchParams) {
    startTransition(() => {
      router.push(`/products?${params.toString()}`)
    })
  }

  function applyFilters(nextFilter: ProductFilter) {
    const params = new URLSearchParams(searchParams.toString())

    const updates: Array<[keyof ProductFilter, string | undefined]> = [
      ['category', nextFilter.category],
      ['minPrice', nextFilter.minPrice],
      ['maxPrice', nextFilter.maxPrice],
      ['keyword', nextFilter.keyword],
      ['size', nextFilter.size ?? filter.size ?? '10'],
    ]

    updates.forEach(([key, value]) => {
      const normalizedValue = value?.trim()
      if (normalizedValue) {
        params.set(key, normalizedValue)
      } else {
        params.delete(key)
      }
    })

    params.set('page', '0')
    pushParams(params)
  }

  function changePage(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))

    if (!params.get('size')) {
      params.set('size', filter.size ?? '10')
    }

    pushParams(params)
  }

  const uiPage = initialData.pagination.page + 1
  const apiPage = initialData.pagination.page

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Products</h1>
      <p className="text-sm text-gray-500 mb-6">
        Page {uiPage} (api page={apiPage}) · total items {initialData.pagination.totalElements}
      </p>

      <FilterBar
        filter={filter}
        categories={CATEGORIES}
        onApply={applyFilters}
      />

      {isPending && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent" />
        </div>
      )}

      {!isPending && initialData.data.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No products found for the selected filters.</p>
          <button
            onClick={() => applyFilters({ category: '', minPrice: '', maxPrice: '', keyword: '', size: filter.size ?? '10' })}
            className="mt-4 text-blue-600 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {!isPending && initialData.data.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {initialData.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <Pagination
            pagination={initialData.pagination}
            onPageChange={changePage}
          />
        </>
      )}
    </div>
  )
}