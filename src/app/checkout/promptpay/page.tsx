'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, Clock, Phone } from 'lucide-react'

function PromptPayContent() {
  const params = useSearchParams()
  const orderNumber = params.get('order') ?? ''
  const qrImage = params.get('qr') ? decodeURIComponent(params.get('qr')!) : null
  const total = params.get('total') ?? '0'

  return (
    <div className="max-w-lg mx-auto px-4 py-12 text-center">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">PP</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">ชำระด้วย PromptPay</h1>
        </div>
        <p className="text-gray-500 text-sm mb-6">สแกน QR Code เพื่อชำระเงิน</p>

        {/* QR Code */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 inline-block mb-4">
          {qrImage ? (
            <Image
              src={qrImage}
              alt="PromptPay QR Code"
              width={220}
              height={220}
              className="rounded"
              unoptimized
            />
          ) : (
            <div className="w-[220px] h-[220px] bg-gray-100 rounded flex items-center justify-center text-gray-400 text-sm">
              ไม่พบ QR Code
            </div>
          )}
        </div>

        {/* Amount */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-6 py-3 mb-6 inline-block">
          <p className="text-sm text-blue-700 font-medium">ยอดชำระ</p>
          <p className="text-3xl font-extrabold text-blue-700">฿{Number(total).toLocaleString()}</p>
        </div>

        {/* Order number */}
        <p className="text-sm text-gray-500 mb-6">
          หมายเลขคำสั่งซื้อ: <span className="font-mono font-semibold text-gray-900">{orderNumber}</span>
        </p>

        {/* Instructions */}
        <div className="text-left bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
          {[
            'เปิดแอปธนาคาร หรือ Mobile Banking',
            'กดสแกน QR Code / PromptPay',
            'ตรวจสอบยอดและยืนยันการชำระ',
            'รอรับการยืนยันคำสั่งซื้อทาง SMS',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              {step}
            </div>
          ))}
        </div>

        {/* Timer notice */}
        <div className="flex items-center gap-2 justify-center text-orange-600 text-sm mb-6">
          <Clock className="w-4 h-4" />
          QR Code หมดอายุใน 30 นาที
        </div>

        {/* Support */}
        <div className="border-t border-gray-100 pt-4 flex items-center justify-center gap-1 text-sm text-gray-500">
          <Phone className="w-3.5 h-3.5" />
          ปัญหาการชำระเงิน โทร 053-xxx-xxx
        </div>

        <div className="mt-4">
          <Link
            href={`/checkout/success?order=${orderNumber}`}
            className="flex items-center justify-center gap-2 text-sm text-green-700 font-medium hover:underline"
          >
            <CheckCircle className="w-4 h-4" />
            ชำระเงินแล้ว / Already paid
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function PromptPayPage() {
  return (
    <Suspense>
      <PromptPayContent />
    </Suspense>
  )
}
