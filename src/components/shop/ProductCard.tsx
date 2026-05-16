import Link from 'next/link'
import Image from 'next/image'
import { Zap } from 'lucide-react'
import type { Product } from '@/types'

function discountPct(price: number, compare: number) {
  return Math.round((1 - price / compare) * 100)
}

export default function ProductCard({ product }: { product: Product }) {
  const hasDiscount = product.compare_price && product.compare_price > product.price
  const pct = hasDiscount ? discountPct(product.price, product.compare_price!) : 0
  const image = product.images?.[0]

  return (
    <Link href={`/shop/${product.slug}`} className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-red-200 transition-all duration-200">
      {/* Image */}
      <div className="relative aspect-square bg-gray-100">
        {image ? (
          <Image src={image} alt={product.name_en} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {pct > 0 && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{pct}%
          </span>
        )}
        {product.is_fast_shipping && (
          <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Zap className="w-3 h-3" /> ส่งด่วน
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-xs text-gray-500 mb-1 truncate">{product.part_brand?.name}</p>
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug mb-2">
          {product.name_th}
        </h3>
        {product.part_number && (
          <p className="text-xs text-gray-400 mb-2 font-mono">{product.part_number}</p>
        )}
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-red-600">
            ฿{product.price.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">
              ฿{product.compare_price!.toLocaleString()}
            </span>
          )}
        </div>
        {product.stock_qty === 0 && (
          <p className="text-xs text-red-500 mt-1">สินค้าหมด / Out of stock</p>
        )}
      </div>
    </Link>
  )
}
