export default function ProductDetailLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-8" />
      <div className="bg-white rounded-2xl shadow p-8 space-y-4">
        <div className="w-full h-48 bg-gray-100 rounded-xl animate-pulse" />
        <div className="h-5 w-24 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
        <div className="h-4 w-5/6 bg-gray-100 rounded animate-pulse" />
        <div className="h-7 w-24 bg-gray-200 rounded animate-pulse mt-4" />
      </div>
    </div>
  )
}
