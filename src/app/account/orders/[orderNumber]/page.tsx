import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, Package, Truck, MapPin, CreditCard } from 'lucide-react'

const STATUS_LABELS: Record<string, { th: string; color: string }> = {
  pending:    { th: 'รอชำระเงิน',   color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  paid:       { th: 'ชำระเงินแล้ว', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  processing: { th: 'กำลังเตรียมสินค้า', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  shipped:    { th: 'จัดส่งแล้ว',   color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  delivered:  { th: 'ได้รับสินค้าแล้ว', color: 'bg-green-100 text-green-700 border-green-200' },
  cancelled:  { th: 'ยกเลิกแล้ว',  color: 'bg-red-100 text-red-700 border-red-200' },
  refunded:   { th: 'คืนเงินแล้ว', color: 'bg-gray-100 text-gray-600 border-gray-200' },
}

export default async function OrderDetailPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/account/login')

  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('order_number', orderNumber)
    .single()

  if (!order) notFound()

  const status = STATUS_LABELS[order.status] ?? { th: order.status, color: 'bg-gray-100 text-gray-600 border-gray-200' }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/account/orders" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-mono">{order.order_number}</h1>
          <p className="text-xs text-gray-400">
            {new Date(order.created_at).toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <span className={`ml-auto text-sm font-semibold px-3 py-1.5 rounded-full border ${status.color}`}>
          {status.th}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Order items */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-500" />
              <h2 className="font-semibold text-gray-900 text-sm">รายการสินค้า</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {order.order_items?.map((item: {
                id: number
                name_th: string
                part_number: string | null
                image_url: string | null
                unit_price: number
                qty: number
                subtotal: number
              }) => (
                <div key={item.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="w-14 h-14 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                    {item.image_url ? (
                      <Image src={item.image_url} alt={item.name_th} width={56} height={56} className="object-contain p-1" />
                    ) : (
                      <span className="text-2xl">🔧</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{item.name_th}</p>
                    {item.part_number && (
                      <p className="text-xs text-gray-400 font-mono">{item.part_number}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-0.5">฿{item.unit_price.toLocaleString()} × {item.qty}</p>
                  </div>
                  <p className="font-bold text-gray-900 shrink-0">฿{item.subtotal.toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 space-y-1.5">
              <div className="flex justify-between text-sm text-gray-600">
                <span>ราคาสินค้า</span>
                <span>฿{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>ค่าจัดส่ง</span>
                <span>฿{order.shipping_fee.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>ส่วนลด</span>
                  <span>-฿{order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base text-gray-900 pt-1 border-t border-gray-200">
                <span>รวมทั้งหมด</span>
                <span className="text-red-600">฿{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: shipping + payment */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-gray-500" />
              <h3 className="font-semibold text-gray-900 text-sm">ที่อยู่จัดส่ง</h3>
            </div>
            <div className="text-sm text-gray-700 space-y-0.5">
              <p className="font-semibold">{order.ship_full_name}</p>
              <p>{order.ship_phone}</p>
              <p>{order.ship_address}</p>
              <p>{order.ship_sub_district} {order.ship_district}</p>
              <p>{order.ship_province} {order.ship_postal_code}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-gray-500" />
              <h3 className="font-semibold text-gray-900 text-sm">การชำระเงิน</h3>
            </div>
            <p className="text-sm text-gray-700">
              {order.payment_method === 'promptpay' ? 'PromptPay QR Code'
                : order.payment_method === 'credit_card' ? 'บัตรเครดิต/เดบิต'
                : order.payment_method ?? '-'}
            </p>
            {order.payment_ref && (
              <p className="text-xs text-gray-400 font-mono mt-1 truncate">{order.payment_ref}</p>
            )}
          </div>

          {order.status === 'shipped' && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Truck className="w-4 h-4 text-blue-600" />
                <p className="text-sm font-semibold text-blue-700">กำลังจัดส่ง</p>
              </div>
              <p className="text-xs text-blue-600">คาดว่าจะได้รับสินค้าใน 1-3 วันทำการ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
