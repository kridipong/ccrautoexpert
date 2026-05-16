import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Package, MapPin, LogOut, ChevronRight, User, ShoppingBag } from 'lucide-react'

const STATUS_LABELS: Record<string, { th: string; color: string }> = {
  pending:    { th: 'รอชำระ',      color: 'bg-yellow-100 text-yellow-800' },
  paid:       { th: 'ชำระแล้ว',   color: 'bg-blue-100 text-blue-800' },
  processing: { th: 'กำลังเตรียม', color: 'bg-purple-100 text-purple-800' },
  shipped:    { th: 'จัดส่งแล้ว',  color: 'bg-indigo-100 text-indigo-800' },
  delivered:  { th: 'ได้รับแล้ว',  color: 'bg-emerald-100 text-emerald-800' },
  cancelled:  { th: 'ยกเลิก',     color: 'bg-red-100 text-red-800' },
  refunded:   { th: 'คืนเงิน',    color: 'bg-gray-100 text-gray-600' },
}

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/account/login')

  const { data: orders } = await supabase
    .from('orders')
    .select('id, order_number, status, total, created_at')
    .order('created_at', { ascending: false })
    .limit(3)

  const fullName = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'ผู้ใช้'
  const initials = fullName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">บัญชีของฉัน</h1>
          <p className="text-sm text-gray-500 mt-0.5">My Account</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Profile card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              {/* Dark banner */}
              <div className="h-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative">
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: `repeating-conic-gradient(#fff 0% 25%, transparent 0% 50%)`, backgroundSize: '16px 16px' }} />
              </div>

              {/* Avatar overlapping banner */}
              <div className="px-6 pb-6">
                <div className="flex justify-center -mt-8 mb-4">
                  <div className="w-16 h-16 bg-red-600 rounded-2xl border-4 border-white flex items-center justify-center text-white text-xl font-bold shadow-md">
                    {initials}
                  </div>
                </div>
                <div className="text-center mb-5">
                  <p className="font-bold text-gray-900 text-base">{fullName}</p>
                  <p className="text-xs text-gray-500 break-all mt-0.5">{user.email}</p>
                </div>

                <div className="space-y-0.5">
                  {[
                    { href: '/account/orders', icon: Package, label: 'คำสั่งซื้อของฉัน' },
                    { href: '/account/profile', icon: User, label: 'แก้ไขโปรไฟล์' },
                    { href: '/account/addresses', icon: MapPin, label: 'ที่อยู่จัดส่ง' },
                  ].map(({ href, icon: Icon, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5 text-sm text-gray-700 group-hover:text-red-600">
                        <Icon className="w-4 h-4" />
                        {label}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-red-400" />
                    </Link>
                  ))}

                  <div className="pt-1 mt-1 border-t border-gray-100">
                    <form action="/api/auth/signout" method="POST">
                      <button
                        type="submit"
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors group text-left"
                      >
                        <div className="flex items-center gap-2.5 text-sm text-gray-500 group-hover:text-red-600">
                          <LogOut className="w-4 h-4" />
                          ออกจากระบบ
                        </div>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent orders */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div>
                  <h2 className="font-bold text-gray-900">คำสั่งซื้อล่าสุด</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Recent Orders</p>
                </div>
                <Link href="/account/orders" className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
                  ดูทั้งหมด <ChevronRight className="w-3.5 h-3.5" />
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
                        className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                            <Package className="w-4 h-4 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-mono font-semibold text-sm text-gray-900 group-hover:text-red-600 transition-colors">
                              {order.order_number}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {new Date(order.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>
                            {status.th}
                          </span>
                          <span className="font-bold text-gray-900">฿{order.total.toLocaleString()}</span>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-red-400 transition-colors" />
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div className="px-6 py-14 text-center">
                  <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-7 h-7 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium mb-1">ยังไม่มีคำสั่งซื้อ</p>
                  <p className="text-sm text-gray-400 mb-4">No orders yet</p>
                  <Link href="/shop" className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors text-sm">
                    เริ่มช้อปปิ้ง →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
