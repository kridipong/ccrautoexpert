import { NextRequest, NextResponse } from 'next/server'
import Omise from 'omise'
import { createServiceClient } from '@/lib/supabase/server'

const omise = Omise({
  secretKey: process.env.OMISE_SECRET_KEY ?? '',
  omiseVersion: '2019-05-29',
})

function generateOrderNumber(): string {
  const date = new Date()
  const d = date.toISOString().slice(0, 10).replace(/-/g, '')
  const rand = Math.floor(Math.random() * 90000) + 10000
  return `CCR-${d}-${rand}`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items, shipping, payment_method, omise_token, subtotal, shipping_fee, total } = body

    if (!items?.length) {
      return NextResponse.json({ error: 'ไม่มีสินค้าในคำสั่งซื้อ' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const order_number = generateOrderNumber()

    // Create order in Supabase (status = pending, payment_ref = null initially)
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        order_number,
        status: 'pending',
        payment_method,
        subtotal,
        shipping_fee,
        discount: 0,
        total,
        ship_full_name: shipping.full_name,
        ship_phone: shipping.phone,
        ship_address: shipping.address,
        ship_sub_district: shipping.sub_district,
        ship_district: shipping.district,
        ship_province: shipping.province,
        ship_postal_code: shipping.postal_code,
        note: shipping.note || null,
      })
      .select('id')
      .single()

    if (orderErr || !order) {
      console.error('Order insert error:', orderErr)
      return NextResponse.json({ error: 'ไม่สามารถสร้างคำสั่งซื้อได้' }, { status: 500 })
    }

    // Insert order items
    const orderItems = items.map((item: {
      product_id: number
      qty: number
      unit_price: number
      name_th: string
      name_en: string
      part_number: string | null
      image_url: string | null
    }) => ({
      order_id: order.id,
      product_id: item.product_id,
      qty: item.qty,
      unit_price: item.unit_price,
      subtotal: item.unit_price * item.qty,
      name_th: item.name_th,
      name_en: item.name_en,
      part_number: item.part_number,
      image_url: item.image_url,
    }))

    const { error: itemsErr } = await supabase.from('order_items').insert(orderItems)
    if (itemsErr) {
      console.error('Order items insert error:', itemsErr)
    }

    // Process payment via Omise
    if (payment_method === 'promptpay') {
      // Create a PromptPay source first
      const source = await omise.sources.create({ type: 'promptpay', amount: Math.round(total * 100), currency: 'thb' })

      const charge = await omise.charges.create({
        amount: Math.round(total * 100),
        currency: 'thb',
        source: source.id,
        description: `CCRAutoExpert ${order_number}`,
        metadata: { order_id: order.id, order_number },
      })

      // Update order with payment ref
      await supabase.from('orders').update({ payment_ref: charge.id }).eq('id', order.id)

      // PromptPay QR image is on the source object
      const qrImage = (source as { scannable_code?: { image?: { download_uri?: string } } })
        ?.scannable_code?.image?.download_uri ?? null

      return NextResponse.json({
        order_number,
        charge_id: charge.id,
        qr_image: qrImage,
      })
    }

    if (payment_method === 'credit_card') {
      if (!omise_token) {
        return NextResponse.json({ error: 'ไม่พบ token บัตร' }, { status: 400 })
      }

      const charge = await omise.charges.create({
        amount: Math.round(total * 100),
        currency: 'thb',
        card: omise_token,
        description: `CCRAutoExpert ${order_number}`,
        metadata: { order_id: order.id, order_number },
      })

      await supabase
        .from('orders')
        .update({
          payment_ref: charge.id,
          status: charge.status === 'successful' ? 'paid' : 'pending',
        })
        .eq('id', order.id)

      if (charge.status !== 'successful') {
        return NextResponse.json(
          { error: 'การชำระเงินไม่สำเร็จ กรุณาตรวจสอบข้อมูลบัตร' },
          { status: 402 }
        )
      }

      return NextResponse.json({ order_number, charge_id: charge.id })
    }

    return NextResponse.json({ error: 'วิธีชำระเงินไม่ถูกต้อง' }, { status: 400 })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดภายในระบบ' }, { status: 500 })
  }
}
