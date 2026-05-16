'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react'
import type { Category, CarBrand, CarModel } from '@/types'

interface Props {
  categories: Category[]
  carBrands: CarBrand[]
  carModels: CarModel[]
  currentParams: Record<string, string | undefined>
}

export default function ShopFilters({ categories, carBrands, carModels, currentParams }: Props) {
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedBrand, setExpandedBrand] = useState(
    currentParams.car_brand ? Number(currentParams.car_brand) : null
  )

  const mainCategories = categories.filter((c) => !c.parent_id)
  const subCategories = categories.filter((c) => c.parent_id)

  function applyFilter(key: string, value: string | null) {
    const params = new URLSearchParams()
    Object.entries(currentParams).forEach(([k, v]) => {
      if (v && k !== key && k !== 'page') params.set(k, v)
    })
    if (value) params.set(key, value)
    router.push(`/shop?${params.toString()}`)
  }

  const filtersJSX = (
    <div className="space-y-6 text-sm">

      {/* Category */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">หมวดหมู่ / Category</h3>
        <div className="space-y-1">
          <button
            onClick={() => applyFilter('category', null)}
            className={`w-full text-left px-2 py-1.5 rounded-lg transition-colors ${!currentParams.category ? 'bg-red-50 text-red-700 font-medium' : 'text-gray-600 hover:text-red-600'}`}
          >
            ทั้งหมด / All
          </button>
          {mainCategories.map((cat) => {
            const subs = subCategories.filter((s) => s.parent_id === cat.id)
            const isActive = currentParams.category === cat.slug || subs.some((s) => s.slug === currentParams.category)
            return (
              <div key={cat.id}>
                <button
                  onClick={() => applyFilter('category', cat.slug)}
                  className={`w-full text-left px-2 py-1.5 rounded-lg transition-colors ${isActive ? 'bg-red-50 text-red-700 font-medium' : 'text-gray-600 hover:text-red-600'}`}
                >
                  {cat.name_th}
                </button>
                {isActive && subs.length > 0 && (
                  <div className="ml-3 mt-1 space-y-1 border-l-2 border-red-100 pl-3">
                    {subs.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => applyFilter('category', sub.slug)}
                        className={`w-full text-left px-2 py-1 rounded-lg transition-colors text-xs ${currentParams.category === sub.slug ? 'text-red-700 font-medium' : 'text-gray-500 hover:text-red-600'}`}
                      >
                        {sub.name_th}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Car brand + model */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">ยี่ห้อรถ / Car Brand</h3>
        <div className="space-y-1 max-h-60 overflow-y-auto">
          <button
            onClick={() => { applyFilter('car_brand', null); applyFilter('car_model', null) }}
            className={`w-full text-left px-2 py-1.5 rounded-lg transition-colors ${!currentParams.car_brand ? 'bg-red-50 text-red-700 font-medium' : 'text-gray-600 hover:text-red-600'}`}
          >
            ทั้งหมด
          </button>
          {carBrands.map((brand) => {
            const models = carModels.filter((m) => m.car_brand_id === brand.id)
            const isActive = Number(currentParams.car_brand) === brand.id ||
              models.some((m) => m.id === Number(currentParams.car_model))
            return (
              <div key={brand.id}>
                <button
                  onClick={() => {
                    setExpandedBrand(isActive ? null : brand.id)
                    applyFilter('car_brand', String(brand.id))
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded-lg transition-colors flex items-center justify-between ${isActive ? 'bg-red-50 text-red-700 font-medium' : 'text-gray-600 hover:text-red-600'}`}
                >
                  <span>{brand.name}</span>
                  {models.length > 0 && (
                    expandedBrand === brand.id || isActive
                      ? <ChevronUp className="w-3.5 h-3.5" />
                      : <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
                {(expandedBrand === brand.id || isActive) && models.length > 0 && (
                  <div className="ml-3 mt-1 space-y-1 border-l-2 border-red-100 pl-3">
                    {models.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => applyFilter('car_model', String(model.id))}
                        className={`w-full text-left px-2 py-1 rounded-lg transition-colors text-xs ${Number(currentParams.car_model) === model.id ? 'text-red-700 font-medium' : 'text-gray-500 hover:text-red-600'}`}
                      >
                        {model.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-56 shrink-0">
        <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-24">
          {filtersJSX}
        </div>
      </aside>

      {/* Mobile filter toggle */}
      <div className="lg:hidden mb-4 w-full">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700"
        >
          <SlidersHorizontal className="w-4 h-4" />
          ตัวกรอง / Filters
        </button>
        {mobileOpen && (
          <div className="mt-3 bg-white rounded-xl border border-gray-200 p-4">
            {filtersJSX}
          </div>
        )}
      </div>
    </>
  )
}
