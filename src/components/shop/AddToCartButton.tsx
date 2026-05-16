'use client'

import { useState } from 'react'
import { ShoppingCart, Plus, Minus } from 'lucide-react'
import type { Product } from '@/types'

export default function AddToCartButton({ product }: { product: Product }) {
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  function addToCart() {
    // Cart logic will be wired to context in the cart phase
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (product.stock_qty === 0) {
    return (
      <button disabled className="w-full py-3 bg-gray-200 text-gray-400 rounded-xl font-semibold cursor-not-allowed">
        สินค้าหมด / Out of stock
      </button>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 font-medium">จำนวน / Qty:</span>
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3 py-2 hover:bg-gray-100 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 py-2 font-semibold text-sm min-w-[3rem] text-center">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(product.stock_qty, q + 1))}
            className="px-3 py-2 hover:bg-gray-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <span className="text-xs text-gray-400">มี {product.stock_qty} ชิ้น</span>
      </div>

      <button
        onClick={addToCart}
        className={`w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${
          added ? 'bg-green-600' : 'bg-red-600 hover:bg-red-700 active:scale-95'
        }`}
      >
        <ShoppingCart className="w-5 h-5" />
        {added ? 'เพิ่มแล้ว! / Added!' : 'เพิ่มในตะกร้า / Add to Cart'}
      </button>
    </div>
  )
}
