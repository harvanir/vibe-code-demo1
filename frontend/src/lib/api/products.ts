import type {
  PaginatedResponse,
  ProductDetail,
  ProductFilter,
  SingleResponse,
  Product,
} from '@/types/product'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

function buildQueryParams(filter: ProductFilter): Record<string, string> {
  const params: Record<string, string> = {}
  if (filter.category) params.category = filter.category
  if (filter.minPrice) params.minPrice = filter.minPrice
  if (filter.maxPrice) params.maxPrice = filter.maxPrice
  if (filter.keyword) params.keyword = filter.keyword
  if (filter.page) params.page = filter.page
  if (filter.size) params.size = filter.size
  return params
}

export async function getProducts(
  filter: ProductFilter
): Promise<PaginatedResponse<Product>> {
  const params = new URLSearchParams(buildQueryParams(filter))
  const res = await fetch(
    `${API_BASE_URL}/api/v1/products?${params.toString()}`,
    { cache: 'no-store' }
  )
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}

export async function getProductById(
  id: number
): Promise<SingleResponse<ProductDetail>> {
  const res = await fetch(`${API_BASE_URL}/api/v1/products/${id}`, {
    cache: 'no-store',
  })
  if (res.status === 404) throw new Error('Product not found')
  if (!res.ok) throw new Error('Failed to fetch product detail')
  return res.json()
}
