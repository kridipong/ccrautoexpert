import Link from 'next/link'
import Image from 'next/image'
import { Zap, Package } from 'lucide-react'
import type { Product } from '@/types'

function discountPct(price: number, compare: number) {
  return Math.round((1 - price / compare) * 100)
}

export default function ProductCard({ product }: { product: Product }) {
  const hasDiscount = product.compare_price && product.compare_price > product.price
  const pct = hasDiscount ? discountPct(product.price, product.compare_price!) : 0
  const image = product.images?.[0]
  const outOfStock = product.stock_qty === 0

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-red-200 hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-50">
        {image ? (
          <Image
            src={image}
            alt={product.name_en}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
            <Package className="w-12 h-12" />
          </div>
        )}

        {/* Discount badge */}
        {pct > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
            -{pct}%
          </span>
        )}

        {/* Fast shipping badge */}
        {product.is_fast_shipping && (
          <span className="absolute top-2.5 right-2.5 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
            <Zap className="w-3 h-3 fill-current" /> ส่งด่วน
          </span>
        )}

        {/* Out of stock overlay */}
        {outOfStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-500 bg-white border border-gray-300 px-3 py-1 rounded-full">
              สินค้าหมด
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        {product.part_brand && (
          <p className="text-xs text-red-600 font-bold uppercase tracking-wider mb-1">
            {product.part_brand.name}
          </p>
        )}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug mb-1.5">
          {product.name_th}
        </h3>
        {product.part_number && (
          <p className="text-[11px] text-gray-400 font-mono mb-3 bg-gray-50 px-2 py-0.5 rounded w-fit">
            {product.part_number}
          </p>
        )}
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-lg font-extrabold text-red-600">
            ฿{product.price.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">
              ฿{product.compare_price!.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
