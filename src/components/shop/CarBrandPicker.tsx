'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { CarBrand, CarModel } from '@/types'

export default function CarBrandPicker({
  carBrands,
  carModels,
}: {
  carBrands: CarBrand[]
  carModels: CarModel[]
}) {
  const router = useRouter()
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null)
  const [selectedModel, setSelectedModel] = useState<number | null>(null)

  const filteredModels = selectedBrand
    ? carModels.filter((m) => m.car_brand_id === selectedBrand)
    : []

  function handleSearch() {
    if (!selectedModel) return
    router.push(`/shop?car_model=${selectedModel}`)
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-1">ค้นหาตามรุ่นรถ</h2>
      <p className="text-sm text-gray-500 mb-5">Find parts by vehicle</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Car brand */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            ยี่ห้อรถ / Car Brand
          </label>
          <select
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
            value={selectedBrand ?? ''}
            onChange={(e) => {
              setSelectedBrand(e.target.value ? Number(e.target.value) : null)
              setSelectedModel(null)
            }}
          >
            <option value="">เลือกยี่ห้อ...</option>
            {carBrands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* Car model */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            รุ่น / Model
          </label>
          <select
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white disabled:bg-gray-50 disabled:text-gray-400"
            value={selectedModel ?? ''}
            onChange={(e) => setSelectedModel(e.target.value ? Number(e.target.value) : null)}
            disabled={!selectedBrand}
          >
            <option value="">เลือกรุ่น...</option>
            {filteredModels.map((m) => (
              <option key={m.id} value={m.id}>{m.name}{m.model_code ? ` (${m.model_code})` : ''}</option>
            ))}
          </select>
        </div>

        {/* Search button */}
        <div className="flex items-end">
          <button
            onClick={handleSearch}
            disabled={!selectedModel}
            className="w-full py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
          >
            ค้นหาอะไหล่ →
          </button>
        </div>
      </div>
    </div>
  )
}
