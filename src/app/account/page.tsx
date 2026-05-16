import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Package, MapPin, LogOut, ChevronRight, User } from 'lucide-react'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/account/login')

  // Fetch recent orders
  const { data: orders } = await supabase
    .from('orders')
    .select('id, order_number, status, total, created_at')
    .order('created_at', { ascending: false })
    .limit(3)

  const fullName = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'ผู้ใช้'
  const initials = fullName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()

  const STATUS_LABELS: Record<string, { th: string; color: string }> = {
    pending:    { th: 'รอชำระ',     color: 'bg-yellow-100 text-yellow-700' },
    paid:       { th: 'ชำระแล้ว',  color: 'bg-blue-100 text-blue-700' },
    processing: { th: 'กำลังเตรียม', color: 'bg-purple-100 text-purple-700' },
    shipped:    { th: 'จัดส่งแล้ว', color: 'bg-indigo-100 text-indigo-700' },
    delivered:  { th: 'ได้รับแล้ว', color: 'bg-green-100 text-green-700' },
    cancelled:  { th: 'ยกเลิก',    color: 'bg-red-100 text-red-700' },
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">บัญชีของฉัน / My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex flex-col items-center text-center mb-4">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white text-xl font-bold mb-3">
                {initials}
              </div>
              <p className="font-bold text-gray-900">{fullName}</p>
              <p className="text-sm text-gray-500 break-all">{user.email}</p>
            </div>

            <div className="space-y-1">
              {[
                { href: '/account/orders', icon: Package, label: 'คำสั่งซื้อของฉัน' },
                { href: '/account/profile', icon: User, label: 'แก้ไขโปรไฟล์' },
                { href: '/account/addresses', icon: MapPin, label: 'ที่อยู่จัดส่ง' },
              ].map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-700 group-hover:text-red-600">
                    <Icon className="w-4 h-4" />
                    {label}
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-red-400" />
                </Link>
              ))}

              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-red-50 transition-colors group text-left"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-700 group-hover:text-red-600">
                    <LogOut className="w-4 h-4" />
                    ออกจากระบบ
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-red-400" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Recent orders */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">คำสั่งซื้อล่าสุด</h2>
              <Link href="/account/orders" className="text-sm text-red-600 hover:underline">
                ดูทั้งหมด →
              </Link>
            </div>

            {orders && orders.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {orders.map((order) => {
                  const status = STATUS_LABELS[order.status] ?? { th: order.status, color: 'bg-gray-100 text-gray-600' }
                  return (
                    <Link
                      key={order.id}
                      href={`/account/orders/${order.order_number}`}
                      className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <p className="font-mono font-semibold text-sm text-gray-900">{order.order_number}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(order.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.color}`}>
                          {status.th}
                        </span>
                        <span className="font-bold text-gray-900">฿{order.total.toLocaleString()}</span>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="px-6 py-12 text-center text-gray-400">
                <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">ยังไม่มีคำสั่งซื้อ</p>
                <Link href="/shop" className="mt-3 inline-block text-sm text-red-600 hover:underline">
                  เริ่มช้อปปิ้ง →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
