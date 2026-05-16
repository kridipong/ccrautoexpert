import { Suspense } from 'react'
import { getProducts, getCategories, getCarBrands, getCarModels } from '@/lib/queries'
import ProductCard from '@/components/shop/ProductCard'
import ShopFilters from '@/components/shop/ShopFilters'

type SearchParams = Record<string, string | undefined>

export default async function ShopPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams
  const page = Number(sp.page ?? 1)
  const limit = 12
  const offset = (page - 1) * limit

  const [{ products, total }, categories, carBrands, carModels] = await Promise.all([
    getProducts({
      search: sp.q,
      categorySlug: sp.category,
      carModelId: sp.car_model ? Number(sp.car_model) : undefined,
      limit,
      offset,
    }),
    getCategories(),
    getCarBrands(),
    getCarModels(),
  ])

  const totalPages = Math.ceil(total / limit)

  const selectedModel = sp.car_model
    ? carModels.find((m) => m.id === Number(sp.car_model))
    : null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {sp.q ? `ผลการค้นหา "${sp.q}"` : 'สินค้าทั้งหมด / All Parts'}
        </h1>
        {selectedModel && (
          <p className="text-sm text-gray-500 mt-1">
            สำหรับ {selectedModel.car_brand?.name} {selectedModel.name}
            {selectedModel.model_code ? ` (${selectedModel.model_code})` : ''}
          </p>
        )}
        <p className="text-sm text-gray-500 mt-1">พบ {total} รายการ / {total} items found</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <Suspense>
          <ShopFilters
            categories={categories}
            carBrands={carBrands}
            carModels={carModels}
            currentParams={sp}
          />
        </Suspense>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <a
                      key={p}
                      href={`/shop?${new URLSearchParams({ ...sp, page: String(p) })}`}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        p === page
                          ? 'bg-red-600 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:border-red-400'
                      }`}
                    >
                      {p}
                    </a>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-400 text-lg mb-2">ไม่พบสินค้า</p>
              <p className="text-gray-400 text-sm">No products found matching your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
