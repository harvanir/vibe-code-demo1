export default function ProductsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="h-9 w-36 bg-gray-200 rounded-lg animate-pulse mb-6" />
      {/* Filter bar skeleton */}
      <div className="bg-white rounded-2xl shadow p-4 flex gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 flex-1 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
      {/* Cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow h-52 animate-pulse" />
        ))}
      </div>
    </div>
  )
}
