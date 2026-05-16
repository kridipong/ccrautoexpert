import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Zap, ShieldCheck, Package, ChevronRight } from 'lucide-react'
import { getProductBySlug } from '@/lib/queries'
import AddToCartButton from '@/components/shop/AddToCartButton'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const hasDiscount = product.compare_price && product.compare_price > product.price
  const discountPct = hasDiscount
    ? Math.round((1 - product.price / product.compare_price!) * 100)
    : 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-red-600">หน้าแรก</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/shop" className="hover:text-red-600">สินค้าทั้งหมด</Link>
        {product.category && (
          <>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/shop?category=${product.category.slug}`} className="hover:text-red-600">
              {product.category.name_th}
            </Link>
          </>
        )}
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 truncate max-w-xs">{product.name_th}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Image */}
        <div className="space-y-3">
          <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
            {product.images?.[0] ? (
              <Image src={product.images[0]} alt={product.name_en} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <Package className="w-24 h-24" />
              </div>
            )}
            {discountPct > 0 && (
              <span className="absolute top-4 left-4 bg-red-600 text-white font-bold px-3 py-1 rounded-full text-sm">
                -{discountPct}%
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.slice(1, 5).map((img, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                  <Image src={img} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-5">
          {product.part_brand && (
            <p className="text-sm font-semibold text-red-600 uppercase tracking-wide">
              {product.part_brand.name}
            </p>
          )}
          <h1 className="text-2xl font-bold text-gray-900 leading-snug">{product.name_th}</h1>
          <p className="text-gray-500 text-sm">{product.name_en}</p>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-red-600">
              ฿{product.price.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-lg text-gray-400 line-through">
                ฿{product.compare_price!.toLocaleString()}
              </span>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {product.is_fast_shipping && (
              <span className="flex items-center gap-1 px-3 py-1 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-full text-xs font-medium">
                <Zap className="w-3.5 h-3.5" /> ส่งด่วน / Fast shipping
              </span>
            )}
            {product.fits_lr && (
              <span className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-medium">
                ใส่ได้ทั้ง L/R
              </span>
            )}
            {product.stock_qty > 0 ? (
              <span className="flex items-center gap-1 px-3 py-1 bg-green-50 border border-green-200 text-green-700 rounded-full text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> มีสินค้า / In stock
              </span>
            ) : (
              <span className="px-3 py-1 bg-red-50 border border-red-200 text-red-600 rounded-full text-xs font-medium">
                สินค้าหมด / Out of stock
              </span>
            )}
          </div>

          {/* Part numbers */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            {product.part_number && (
              <div className="flex justify-between">
                <span className="text-gray-500">Part Number</span>
                <span className="font-mono font-medium text-gray-900">{product.part_number}</span>
              </div>
            )}
            {product.oem_number && (
              <div className="flex justify-between">
                <span className="text-gray-500">OEM Number</span>
                <span className="font-mono font-medium text-gray-900">{product.oem_number}</span>
              </div>
            )}
            {product.weight_kg && (
              <div className="flex justify-between">
                <span className="text-gray-500">น้ำหนัก / Weight</span>
                <span className="font-medium text-gray-900">{product.weight_kg} kg</span>
              </div>
            )}
          </div>

          {/* Add to cart */}
          <AddToCartButton product={product} />

          {/* Fitments */}
          {product.fitments && product.fitments.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">รุ่นรถที่ใช้ได้ / Vehicle Fitment</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-2 font-medium text-gray-600">ยี่ห้อ</th>
                      <th className="text-left px-4 py-2 font-medium text-gray-600">รุ่น</th>
                      <th className="text-left px-4 py-2 font-medium text-gray-600">ปี</th>
                      <th className="text-left px-4 py-2 font-medium text-gray-600">หมายเหตุ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {product.fitments.map((f) => (
                      <tr key={f.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-700">{f.car_model?.car_brand?.name}</td>
                        <td className="px-4 py-2 text-gray-700 font-medium">{f.car_model?.name}</td>
                        <td className="px-4 py-2 text-gray-700">
                          {f.year_from && f.year_to ? `${f.year_from}–${f.year_to}` : f.year_from ?? f.year_to ?? '–'}
                        </td>
                        <td className="px-4 py-2 text-gray-500 text-xs">{f.note_th ?? '–'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Description */}
          {(product.description_th || product.description_en) && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">รายละเอียด / Description</h3>
              {product.description_th && <p className="text-gray-600 text-sm leading-relaxed">{product.description_th}</p>}
              {product.description_en && <p className="text-gray-500 text-sm mt-1 leading-relaxed">{product.description_en}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
