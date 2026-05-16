import Link from 'next/link'
import { ArrowRight, ShieldCheck, Truck, Headphones, Droplets, Car, Settings2, Snowflake, Wrench, Sparkles, Hammer } from 'lucide-react'
import { getMainCategories, getCarBrands, getCarModels, getFeaturedProducts } from '@/lib/queries'
import CarBrandPicker from '@/components/shop/CarBrandPicker'
import ProductCard from '@/components/shop/ProductCard'

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'engine-oil-fluids': Droplets,
  'body-parts': Car,
  'chassis-brakes': Settings2,
  'cooling-ac': Snowflake,
  'engine-drivetrain': Wrench,
  'car-care-equipment': Sparkles,
  'tools-equipment': Hammer,
}

const CATEGORY_COLORS: Record<string, string> = {
  'engine-oil-fluids': 'bg-amber-500/10 text-amber-500',
  'body-parts': 'bg-blue-500/10 text-blue-500',
  'chassis-brakes': 'bg-red-500/10 text-red-500',
  'cooling-ac': 'bg-cyan-500/10 text-cyan-500',
  'engine-drivetrain': 'bg-orange-500/10 text-orange-500',
  'car-care-equipment': 'bg-violet-500/10 text-violet-500',
  'tools-equipment': 'bg-gray-500/10 text-gray-500',
}

export default async function HomePage() {
  const [categories, carBrands, carModels, featured] = await Promise.all([
    getMainCategories(),
    getCarBrands(),
    getCarModels(),
    getFeaturedProducts(8),
  ])

  return (
    <div className="bg-gray-50">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gray-950">
        {/* Subtle checkered texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `repeating-conic-gradient(#fff 0% 25%, transparent 0% 50%)`,
            backgroundSize: '28px 28px',
          }}
        />
        {/* Red glow right */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-red-600/20 to-transparent pointer-events-none" />
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-red-600 via-red-400 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left — copy */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/20 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-400 text-xs font-semibold tracking-widest uppercase">CCRAutoExpert · เชียงราย</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-none tracking-tight mb-4 text-white">
                อะไหล่<br />
                <span className="text-red-500">รถยนต์</span>
              </h1>
              <p className="text-xl sm:text-2xl font-bold text-gray-300 mb-4 tracking-tight">
                ครบ · คุณภาพ · <span className="text-red-400">ส่งไว</span>
              </p>
              <p className="text-gray-400 text-base mb-10 leading-relaxed">
                อะไหล่แท้และอะไหล่คุณภาพ ครอบคลุมทุกยี่ห้อ ทุกรุ่น<br />
                <span className="text-gray-500 text-sm">Quality parts for every make and model</span>
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="px-7 py-3.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-500 transition-colors flex items-center gap-2 shadow-lg shadow-red-900/40"
                >
                  ดูสินค้าทั้งหมด <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/shop?category=chassis-brakes"
                  className="px-7 py-3.5 border border-white/20 text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
                >
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
                <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 hover:border-red-500/30 transition-all">
                  <p className="text-4xl font-extrabold text-red-500 mb-1">{num}</p>
                  <p className="font-semibold text-white text-sm">{label}</p>
                  <p className="text-gray-500 text-xs">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom red+dark checkers strip */}
        <div className="absolute bottom-0 right-0 flex">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className={`w-5 h-5 ${i % 2 === 0 ? 'bg-red-600' : 'bg-white/10'}`} />
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">

        {/* Car Brand Picker */}
        <CarBrandPicker carBrands={carBrands} carModels={carModels} />

        {/* ── Categories ── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">หมวดหมู่สินค้า</h2>
              <p className="text-sm text-gray-500 mt-0.5">Categories</p>
            </div>
            <Link href="/shop" className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
              ดูทั้งหมด <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.slug] ?? Wrench
              const colorCls = CATEGORY_COLORS[cat.slug] ?? 'bg-gray-100 text-gray-500'
              return (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-gray-200 hover:border-red-300 hover:shadow-md transition-all text-center group"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorCls} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-red-600 leading-tight">
                    {cat.name_th}
                  </span>
                </Link>
              )
            })}
          </div>
        </section>

        {/* ── Featured Products ── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">สินค้าแนะนำ</h2>
              <p className="text-sm text-gray-500 mt-0.5">Featured Parts</p>
            </div>
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
            <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
              ยังไม่มีสินค้า / No products yet
            </div>
          )}
        </section>

        {/* ── Trust badges ── */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: ShieldCheck, title: 'สินค้าคุณภาพ', sub: 'อะไหล่แท้และคุณภาพ', en: 'Genuine & quality parts', accent: 'bg-emerald-500', ring: 'ring-emerald-100' },
            { icon: Truck, title: 'จัดส่งทั่วประเทศ', sub: 'ส่งเร็ว รับของไว', en: 'Fast nationwide delivery', accent: 'bg-blue-500', ring: 'ring-blue-100' },
            { icon: Headphones, title: 'บริการหลังการขาย', sub: 'คืนสินค้าได้ 7 วัน', en: '7-day return guarantee', accent: 'bg-violet-500', ring: 'ring-violet-100' },
          ].map(({ icon: Icon, title, sub, en, accent, ring }) => (
            <div key={title} className={`flex items-center gap-5 bg-white rounded-2xl border border-gray-200 p-6 ring-4 ${ring} ring-opacity-0 hover:ring-opacity-100 transition-all`}>
              <div className={`w-14 h-14 ${accent} rounded-2xl flex items-center justify-center shrink-0 shadow-sm`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-base">{title}</p>
                <p className="text-sm text-gray-600">{sub}</p>
                <p className="text-xs text-gray-400">{en}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ── Car brands ── */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">ยี่ห้อรถยนต์</h2>
            <p className="text-sm text-gray-500 mt-0.5">Car Brands</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {carBrands.slice(0, 18).map((brand) => (
              <Link
                key={brand.id}
                href={`/shop?car_brand=${brand.id}`}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-all font-medium shadow-sm"
              >
                {brand.name}
              </Link>
            ))}
            {carBrands.length > 18 && (
              <Link
                href="/shop"
                className="px-4 py-2 bg-red-600 border border-red-600 rounded-xl text-sm text-white font-bold hover:bg-red-700 transition-colors shadow-sm"
              >
                +{carBrands.length - 18} more →
              </Link>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
