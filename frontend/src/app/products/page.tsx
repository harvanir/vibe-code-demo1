import { getProducts } from '@/lib/api/products'
import type { ProductFilter } from '@/types/product'
import ProductListClient from './ProductListClient'

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams
  const filter: ProductFilter = {
    category: resolvedParams.category as string | undefined,
    minPrice: resolvedParams.minPrice as string | undefined,
    maxPrice: resolvedParams.maxPrice as string | undefined,
    keyword: resolvedParams.keyword as string | undefined,
    page: (resolvedParams.page as string | undefined) ?? '0',
    size: (resolvedParams.size as string | undefined) ?? '10',
  }

  try {
    const result = await getProducts(filter)
    return <ProductListClient initialData={result} filter={filter} />
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">Failed to load products. Make sure the backend is running.</p>
      </div>
    )
  }
}
