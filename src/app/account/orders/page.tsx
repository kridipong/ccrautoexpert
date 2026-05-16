import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Package, ChevronRight, ArrowLeft } from 'lucide-react'

const STATUS_LABELS: Record<string, { th: string; color: string }> = {
  pending:    { th: 'รอชำระ',      color: 'bg-yellow-100 text-yellow-700' },
  paid:       { th: 'ชำระแล้ว',   color: 'bg-blue-100 text-blue-700' },
  processing: { th: 'กำลังเตรียม', color: 'bg-purple-100 text-purple-700' },
  shipped:    { th: 'จัดส่งแล้ว',  color: 'bg-indigo-100 text-indigo-700' },
  delivered:  { th: 'ได้รับแล้ว',  color: 'bg-green-100 text-green-700' },
  cancelled:  { th: 'ยกเลิก',     color: 'bg-red-100 text-red-700' },
  refunded:   { th: 'คืนเงิน',    color: 'bg-gray-100 text-gray-600' },
}

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/account/login')

  const { data: orders } = await supabase
    .from('orders')
    .select('id, order_number, status, total, created_at, payment_method')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/account" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">คำสั่งซื้อของฉัน / My Orders</h1>
      </div>

      {orders && orders.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {orders.map((order) => {
              const status = STATUS_LABELS[order.status] ?? { th: order.status, color: 'bg-gray-100 text-gray-600' }
              const payLabel = order.payment_method === 'promptpay' ? 'PromptPay'
                : order.payment_method === 'credit_card' ? 'บัตรเครดิต' : '-'

              return (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.order_number}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-mono font-semibold text-sm text-gray-900">{order.order_number}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(order.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {' · '}{payLabel}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.color}`}>
                      {status.th}
                    </span>
                    <span className="font-bold text-gray-900 hidden sm:block">
                      ฿{order.total.toLocaleString()}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm py-16 text-center">
          <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 mb-4">ยังไม่มีคำสั่งซื้อ / No orders yet</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors text-sm"
          >
            เริ่มช้อปปิ้ง →
          </Link>
        </div>
      )}
    </div>
  )
}
