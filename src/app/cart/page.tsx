'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '@/context/CartContext'

const SHIPPING_FEE = 80

export default function CartPage() {
  const { items, itemCount, subtotal, removeItem, setQty, clearCart } = useCart()

  const total = subtotal + (itemCount > 0 ? SHIPPING_FEE : 0)

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">ตะกร้าว่างเปล่า</h1>
        <p className="text-gray-500 mb-8">Your cart is empty — start shopping!</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors"
        >
          ดูสินค้าทั้งหมด <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        ตะกร้าสินค้า <span className="text-gray-400 font-normal text-lg">({itemCount} รายการ)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, qty }) => {
            const img = product.images?.[0] ?? null
            const discount = product.compare_price
              ? Math.round((1 - product.price / product.compare_price) * 100)
              : 0

            return (
              <div
                key={product.id}
                className="flex gap-4 bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
              >
                {/* Image */}
                <div className="relative w-24 h-24 shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                  {img ? (
                    <Image src={img} alt={product.name_th} fill className="object-contain p-1" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl">🔧</div>
                  )}
                  {discount > 0 && (
                    <span className="absolute top-1 left-1 text-[10px] font-bold bg-red-600 text-white px-1 rounded">
                      -{discount}%
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  {product.part_brand && (
                    <p className="text-xs text-red-600 font-semibold uppercase tracking-wide mb-0.5">
                      {product.part_brand.name}
                    </p>
                  )}
                  <p className="font-semibold text-gray-900 text-sm leading-tight mb-1 truncate">
                    {product.name_th}
                  </p>
                  {product.part_number && (
                    <p className="text-xs text-gray-400 font-mono mb-2">{product.part_number}</p>
                  )}

                  <div className="flex items-center justify-between flex-wrap gap-2">
                    {/* Qty controls */}
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setQty(product.id, qty - 1)}
                        className="px-2.5 py-1.5 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 py-1.5 font-semibold text-sm min-w-[2.5rem] text-center">
                        {qty}
                      </span>
                      <button
                        onClick={() => setQty(product.id, qty + 1)}
                        disabled={qty >= product.stock_qty}
                        className="px-2.5 py-1.5 hover:bg-gray-100 transition-colors disabled:opacity-40"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Price + remove */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          ฿{(product.price * qty).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">฿{product.price.toLocaleString()} / ชิ้น</p>
                      </div>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          <button
            onClick={clearCart}
            className="text-sm text-gray-400 hover:text-red-600 transition-colors mt-2"
          >
            ล้างตะกร้า / Clear cart
          </button>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm sticky top-24">
            <h2 className="font-bold text-lg text-gray-900 mb-4">สรุปคำสั่งซื้อ</h2>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>ราคาสินค้า ({itemCount} รายการ)</span>
                <span>฿{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>ค่าจัดส่ง</span>
                <span>฿{SHIPPING_FEE.toLocaleString()}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 mb-5">
              <div className="flex justify-between font-bold text-lg text-gray-900">
                <span>รวมทั้งหมด</span>
                <span className="text-red-600">฿{total.toLocaleString()}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 active:scale-95 transition-all shadow-lg shadow-red-100"
            >
              ดำเนินการชำระเงิน <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/shop"
              className="w-full flex items-center justify-center mt-3 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:border-gray-300 transition-colors"
            >
              ← ซื้อสินค้าต่อ
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
