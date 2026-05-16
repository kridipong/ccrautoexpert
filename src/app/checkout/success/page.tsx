'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'

function SuccessContent() {
  const params = useSearchParams()
  const orderNumber = params.get('order') ?? ''

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">สั่งซื้อสำเร็จ!</h1>
        <p className="text-gray-500 mb-6">ขอบคุณสำหรับคำสั่งซื้อของคุณ</p>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-500 mb-1">หมายเลขคำสั่งซื้อ</p>
          <p className="font-mono font-bold text-lg text-gray-900">{orderNumber}</p>
        </div>

        <div className="text-left space-y-3 mb-8">
          {[
            { icon: CheckCircle, text: 'ได้รับคำสั่งซื้อของคุณแล้ว', color: 'text-green-600 bg-green-50' },
            { icon: Package, text: 'กำลังจัดเตรียมสินค้า (1-2 วันทำการ)', color: 'text-blue-600 bg-blue-50' },
          ].map(({ icon: Icon, text, color }) => (
            <div key={text} className={`flex items-center gap-3 p-3 rounded-xl ${color}`}>
              <Icon className="w-4 h-4 shrink-0" />
              <span className="text-sm font-medium">{text}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/shop"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors"
          >
            ซื้อสินค้าต่อ <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/account/orders"
            className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:border-gray-300 transition-colors"
          >
            ดูคำสั่งซื้อ
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
