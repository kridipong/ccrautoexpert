'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { ShieldCheck, CreditCard, QrCode, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const SHIPPING_FEE = 80

type PaymentMethod = 'promptpay' | 'credit_card'

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const router = useRouter()
  const total = subtotal + SHIPPING_FEE

  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    address: '',
    sub_district: '',
    district: '',
    province: '',
    postal_code: '',
    note: '',
  })
  const [payMethod, setPayMethod] = useState<PaymentMethod>('promptpay')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Credit card fields (tokenized client-side via OmiseJS)
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvc: '' })

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  const formValid =
    form.full_name && form.phone && form.address && form.sub_district &&
    form.district && form.province && form.postal_code

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formValid || items.length === 0) return
    setLoading(true)
    setError(null)

    try {
      let omiseToken: string | null = null

      if (payMethod === 'credit_card') {
        omiseToken = await tokenizeCard()
        if (!omiseToken) {
          setError('ไม่สามารถตรวจสอบบัตรได้ กรุณาตรวจสอบข้อมูลบัตร')
          setLoading(false)
          return
        }
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            product_id: i.product.id,
            qty: i.qty,
            unit_price: i.product.price,
            name_th: i.product.name_th,
            name_en: i.product.name_en,
            part_number: i.product.part_number,
            image_url: i.product.images?.[0] ?? null,
          })),
          shipping: form,
          payment_method: payMethod,
          omise_token: omiseToken,
          subtotal,
          shipping_fee: SHIPPING_FEE,
          total,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่')
        setLoading(false)
        return
      }

      clearCart()

      if (payMethod === 'promptpay' && data.qr_image) {
        router.push(`/checkout/promptpay?order=${data.order_number}&qr=${encodeURIComponent(data.qr_image)}&total=${total}`)
      } else {
        router.push(`/checkout/success?order=${data.order_number}`)
      }
    } catch {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่')
      setLoading(false)
    }
  }

  async function tokenizeCard(): Promise<string | null> {
    return new Promise((resolve) => {
      const [mm, yy] = card.expiry.split('/')
      const payload = {
        number: card.number.replace(/\s/g, ''),
        name: card.name,
        expiration_month: mm?.trim(),
        expiration_year: `20${yy?.trim()}`,
        security_code: card.cvc,
      }
      // OmiseJS loaded via script tag below
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Omise = (window as any).Omise
      if (!Omise) { resolve(null); return }
      Omise.setPublicKey(process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY ?? '')
      Omise.createToken('card', payload, (_statusCode: number, response: { id?: string }) => {
        resolve(response?.id ?? null)
      })
    })
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">ตะกร้าว่างเปล่า</p>
        <Link href="/shop" className="text-red-600 hover:underline">กลับไปซื้อสินค้า</Link>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/cart" className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">ชำระเงิน / Checkout</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Shipping + payment */}
            <div className="lg:col-span-2 space-y-6">

              {/* Shipping address */}
              <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold">1</span>
                  ที่อยู่จัดส่ง / Shipping Address
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ชื่อ-นามสกุล <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      value={form.full_name}
                      onChange={(e) => update('full_name', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="ชื่อ-นามสกุล ผู้รับสินค้า"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      เบอร์โทร <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="08x-xxx-xxxx"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ที่อยู่ <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      value={form.address}
                      onChange={(e) => update('address', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="บ้านเลขที่ ซอย ถนน"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      แขวง/ตำบล <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      value={form.sub_district}
                      onChange={(e) => update('sub_district', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      เขต/อำเภอ <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      value={form.district}
                      onChange={(e) => update('district', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      จังหวัด <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      value={form.province}
                      onChange={(e) => update('province', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      รหัสไปรษณีย์ <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      value={form.postal_code}
                      onChange={(e) => update('postal_code', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="50000"
                      maxLength={5}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      หมายเหตุ (ถ้ามี)
                    </label>
                    <textarea
                      rows={2}
                      value={form.note}
                      onChange={(e) => update('note', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                      placeholder="หมายเหตุพิเศษ / ข้อมูลเพิ่มเติม"
                    />
                  </div>
                </div>
              </section>

              {/* Payment method */}
              <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold">2</span>
                  วิธีชำระเงิน / Payment Method
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {[
                    { id: 'promptpay' as PaymentMethod, icon: QrCode, label: 'PromptPay', sub: 'สแกน QR Code' },
                    { id: 'credit_card' as PaymentMethod, icon: CreditCard, label: 'บัตรเครดิต/เดบิต', sub: 'Visa, Mastercard' },
                  ].map(({ id, icon: Icon, label, sub }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPayMethod(id)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                        payMethod === id
                          ? 'border-red-600 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${payMethod === id ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{label}</p>
                        <p className="text-xs text-gray-500">{sub}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {payMethod === 'credit_card' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อบนบัตร</label>
                      <input
                        value={card.name}
                        onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                        placeholder="NAME ON CARD"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">หมายเลขบัตร</label>
                      <input
                        value={card.number}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, '').slice(0, 16)
                          const formatted = raw.replace(/(.{4})/g, '$1 ').trim()
                          setCard((c) => ({ ...c, number: formatted }))
                        }}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white font-mono tracking-wider"
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">วันหมดอายุ (MM/YY)</label>
                      <input
                        value={card.expiry}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, '').slice(0, 4)
                          if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2)
                          setCard((c) => ({ ...c, expiry: v }))
                        }}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV / CVC</label>
                      <input
                        value={card.cvc}
                        onChange={(e) => setCard((c) => ({ ...c, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* Right: Order summary + submit */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm sticky top-24">
                <h2 className="font-bold text-lg text-gray-900 mb-4">สรุปคำสั่งซื้อ</h2>

                <div className="space-y-2 text-sm mb-4 max-h-48 overflow-y-auto">
                  {items.map(({ product, qty }) => (
                    <div key={product.id} className="flex justify-between gap-2">
                      <span className="text-gray-600 truncate">{product.name_th} ×{qty}</span>
                      <span className="shrink-0 font-medium">฿{(product.price * qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>ราคาสินค้า</span>
                    <span>฿{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>ค่าจัดส่ง</span>
                    <span>฿{SHIPPING_FEE.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base text-gray-900 pt-1">
                    <span>รวมทั้งหมด</span>
                    <span className="text-red-600">฿{total.toLocaleString()}</span>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !formValid}
                  className="w-full py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 active:scale-95 transition-all shadow-lg shadow-red-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      กำลังดำเนินการ...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      {payMethod === 'promptpay' ? 'รับ QR Code ชำระเงิน' : 'ชำระเงิน ฿' + total.toLocaleString()}
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  ชำระเงินปลอดภัย ผ่าน Omise
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
