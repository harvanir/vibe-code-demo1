export interface Product {
  id: number
  name: string
  price: number
  category: string
}

export interface ProductDetail {
  id: number
  name: string
  description: string
  price: number
  category: string
}

export interface Pagination {
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: Pagination
}

export interface SingleResponse<T> {
  data: T
}

export interface ProductFilter {
  category?: string
  minPrice?: string
  maxPrice?: string
  keyword?: string
  page?: string
  size?: string
}
