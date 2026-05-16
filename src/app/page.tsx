import Link from 'next/link'
import { ArrowRight, ShieldCheck, Truck, Headphones } from 'lucide-react'
import { getMainCategories, getCarBrands, getCarModels, getFeaturedProducts } from '@/lib/queries'
import CarBrandPicker from '@/components/shop/CarBrandPicker'
import ProductCard from '@/components/shop/ProductCard'

const CATEGORY_ICONS: Record<string, string> = {
  'engine-oil-fluids': '🛢️',
  'body-parts': '🚗',
  'chassis-brakes': '⚙️',
  'cooling-ac': '❄️',
  'engine-drivetrain': '🔧',
  'car-care-equipment': '✨',
  'tools-equipment': '🔩',
}

export default async function HomePage() {
  const [categories, carBrands, carModels, featured] = await Promise.all([
    getMainCategories(),
    getCarBrands(),
    getCarModels(),
    getFeaturedProducts(8),
  ])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white border-b border-gray-200">
        {/* Checkered flag background */}
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage: `repeating-conic-gradient(#000 0% 25%, transparent 0% 50%)`,
            backgroundSize: '32px 32px',
          }}
        />
        {/* Red diagonal accent */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-600/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-64 h-1.5 bg-red-600" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left — text */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-1 w-10 bg-red-600" />
                <p className="text-red-600 font-bold text-sm tracking-widest uppercase">CCRAutoExpert</p>
              </div>
              <h1 className="text-5xl sm:text-6xl font-extrabold leading-none tracking-tight mb-2 text-gray-900">
                อะไหล่<br />
                <span className="text-red-600">รถยนต์</span>
              </h1>
              <p className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-6 tracking-tight">
                ครบ · คุณภาพ · <span className="text-red-600">ส่งไว</span>
              </p>
              <p className="text-gray-500 text-base mb-8 leading-relaxed">
                อะไหล่แท้และอะไหล่คุณภาพ ครอบคลุมทุกยี่ห้อ ทุกรุ่น<br />
                <span className="text-gray-400 text-sm">Quality parts for every make and model</span>
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/shop" className="px-7 py-3.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 shadow-lg shadow-red-200">
                  ดูสินค้าทั้งหมด <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/shop?category=chassis-brakes" className="px-7 py-3.5 border-2 border-gray-900 text-gray-900 font-bold rounded-lg hover:bg-gray-900 hover:text-white transition-colors">
                  ช่วงล่างและเบรก
                </Link>
              </div>
            </div>

            {/* Right — stats */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { num: '30+', label: 'แบรนด์อะไหล่', sub: 'Part Brands' },
                { num: '22', label: 'ยี่ห้อรถยนต์', sub: 'Car Brands' },
                { num: '31+', label: 'รุ่นรถ', sub: 'Car Models' },
                { num: '100%', label: 'คุณภาพรับประกัน', sub: 'Quality Guaranteed' },
              ].map(({ num, label, sub }) => (
                <div key={label} className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-sm hover:border-red-200 transition-colors">
                  <p className="text-4xl font-extrabold text-red-600 mb-1">{num}</p>
                  <p className="font-bold text-gray-900 text-sm">{label}</p>
                  <p className="text-gray-400 text-xs">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom checkered strip */}
        <div className="absolute bottom-0 right-0 flex">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={`w-6 h-6 ${i % 2 === 0 ? 'bg-red-600' : 'bg-gray-900'}`} />
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

        {/* Car Brand Picker */}
        <CarBrandPicker carBrands={carBrands} carModels={carModels} />

        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">หมวดหมู่สินค้า / Categories</h2>
            <Link href="/shop" className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
              ดูทั้งหมด <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-red-300 hover:shadow-sm transition-all text-center group"
              >
                <span className="text-3xl">{CATEGORY_ICONS[cat.slug] ?? '🔧'}</span>
                <span className="text-xs font-medium text-gray-700 group-hover:text-red-600 leading-tight">
                  {cat.name_th}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">สินค้าแนะนำ / Featured Parts</h2>
            <Link href="/shop" className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
              ดูทั้งหมด <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {featured.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
              ยังไม่มีสินค้า / No products yet
            </div>
          )}
        </section>

        {/* Trust badges */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: ShieldCheck, title: 'สินค้าคุณภาพ', sub: 'Genuine & quality parts', color: 'text-green-600 bg-green-50' },
            { icon: Truck, title: 'จัดส่งรวดเร็ว', sub: 'Fast nationwide delivery', color: 'text-blue-600 bg-blue-50' },
            { icon: Headphones, title: 'บริการหลังการขาย', sub: '7-day return guarantee', color: 'text-purple-600 bg-purple-50' },
          ].map(({ icon: Icon, title, sub, color }) => (
            <div key={title} className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-5">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{title}</p>
                <p className="text-sm text-gray-500">{sub}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Car brand grid */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">ยี่ห้อรถยนต์ / Car Brands</h2>
          <div className="flex flex-wrap gap-2">
            {carBrands.slice(0, 18).map((brand) => (
              <Link
                key={brand.id}
                href={`/shop?car_brand=${brand.id}`}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-red-400 hover:text-red-600 transition-colors font-medium"
              >
                {brand.name}
              </Link>
            ))}
            <Link href="/shop" className="px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 hover:bg-red-100 transition-colors font-medium">
              +{carBrands.length - 18} more →
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
