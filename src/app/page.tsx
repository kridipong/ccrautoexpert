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
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-red-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-red-400 font-medium text-sm mb-3 tracking-widest uppercase">CCRAutoExpert</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
              อะไหล่รถยนต์<br />
              <span className="text-red-400">ครบ · คุณภาพ · ส่งไว</span>
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              อะไหล่แท้และอะไหล่คุณภาพ ครอบคลุมทุกยี่ห้อ ทุกรุ่น<br />
              <span className="text-gray-400 text-base">Quality parts for every make and model</span>
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/shop" className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                ดูสินค้าทั้งหมด <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/shop?category=chassis-brakes" className="px-6 py-3 border border-gray-500 text-white font-medium rounded-lg hover:border-red-400 hover:text-red-300 transition-colors">
                ช่วงล่างและเบรก
              </Link>
            </div>
          </div>
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
