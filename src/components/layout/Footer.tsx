import Link from 'next/link'
import { Wrench, Phone, MapPin, Clock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white text-lg">
                CCR<span className="text-red-500">AUTO</span>EXPERT
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              ผู้จำหน่ายอะไหล่รถยนต์คุณภาพ<br />
              ครอบคลุมทุกยี่ห้อ ทุกรุ่น<br />
              Quality auto parts for every vehicle
            </p>
          </div>

          {/* Shop links */}
          <div>
            <h4 className="text-white font-semibold mb-4">หมวดหมู่ / Categories</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/shop?category=chassis-brakes', label: 'ช่วงล่างและเบรก' },
                { href: '/shop?category=engine-drivetrain', label: 'เครื่องยนต์' },
                { href: '/shop?category=engine-oil-fluids', label: 'น้ำมันเครื่อง' },
                { href: '/shop?category=cooling-ac', label: 'ระบบระบายความร้อน' },
                { href: '/shop?category=car-care-equipment', label: 'ดูแลรถยนต์' },
                { href: '/shop?category=tools-equipment', label: 'เครื่องมือช่าง' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-red-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info links */}
          <div>
            <h4 className="text-white font-semibold mb-4">ข้อมูล / Info</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/about', label: 'เกี่ยวกับเรา / About Us' },
                { href: '/account/orders', label: 'ติดตามออเดอร์ / Track Order' },
                { href: '/shipping', label: 'นโยบายการจัดส่ง / Shipping' },
                { href: '/returns', label: 'การคืนสินค้า / Returns' },
                { href: '/contact', label: 'ติดต่อเรา / Contact' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-red-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">ติดต่อเรา / Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 text-red-500 shrink-0" />
                <span>062-XXX-XXXX</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-red-500 shrink-0" />
                <span>เชียงราย / Chiang Rai</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 text-red-500 shrink-0" />
                <span>จ-ส 08:00–18:00<br />Mon–Sat 08:00–18:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} CCRAutoExpert. All rights reserved.</p>
          <p>Powered by Next.js · Supabase</p>
        </div>
      </div>
    </footer>
  )
}
