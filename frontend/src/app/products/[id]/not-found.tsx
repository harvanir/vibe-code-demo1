import Link from 'next/link'

export default function ProductNotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
      <p className="text-gray-500 mb-6">The product you are looking for does not exist.</p>
      <Link href="/products" className="text-blue-600 hover:underline">
        ← Back to listing
      </Link>
    </div>
  )
}
