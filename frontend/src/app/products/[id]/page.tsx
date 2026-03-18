import { getProductById } from '@/lib/api/products'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface ProductDetailPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function resolveBackHref(from?: string | string[]): string {
  const candidate = Array.isArray(from) ? from[0] : from

  if (!candidate) {
    return '/products'
  }

  return candidate.startsWith('/products') ? candidate : '/products'
}

export default async function ProductDetailPage({ params, searchParams }: ProductDetailPageProps) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const productId = Number(resolvedParams.id)

  if (Number.isNaN(productId)) {
    notFound()
  }

  const backHref = resolveBackHref(resolvedSearchParams.from)

  try {
    const result = await getProductById(productId)
    const product = result.data

    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-8"
        >
          ← Back to listing
        </Link>

        <div className="bg-white rounded-2xl shadow p-8">
          {/* Thumbnail placeholder */}
          <div className="w-full h-48 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
            <span className="text-gray-400 text-sm">No image available</span>
          </div>

          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            {product.category}
          </span>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

          <p className="text-2xl font-bold text-blue-600">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </div>
    )
  } catch (error) {
    if (error instanceof Error && error.message === 'Product not found') {
      notFound()
    }

    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link href={backHref} className="text-blue-600 hover:underline mb-8 block">
          ← Back to listing
        </Link>
        <p className="text-red-500 text-lg">Failed to load product. Please try again.</p>
      </div>
    )
  }
}