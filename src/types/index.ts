export interface PartBrand {
  id: number
  name: string
  slug: string
  logo_url: string | null
}

export interface Category {
  id: number
  slug: string
  name_th: string
  name_en: string
  parent_id: number | null
  sort_order: number
  children?: Category[]
}

export interface CarBrand {
  id: number
  name: string
  slug: string
  logo_url: string | null
}

export interface CarModel {
  id: number
  car_brand_id: number
  name: string
  slug: string
  model_code: string | null
  car_brand?: CarBrand
}

export interface Fitment {
  id: number
  product_id: number
  car_model_id: number
  year_from: number | null
  year_to: number | null
  note_th: string | null
  note_en: string | null
  car_model?: CarModel
}

export interface Product {
  id: number
  slug: string
  name_th: string
  name_en: string
  description_th: string | null
  description_en: string | null
  price: number
  compare_price: number | null
  stock_qty: number
  part_number: string | null
  oem_number: string | null
  brand_id: number | null
  category_id: number | null
  images: string[]
  weight_kg: number | null
  dimensions: { l: number; w: number; h: number } | null
  fits_lr: boolean
  is_fast_shipping: boolean
  is_active: boolean
  created_at: string
  part_brand?: PartBrand
  category?: Category
  fitments?: Fitment[]
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number | null
  name_th: string
  name_en: string
  part_number: string | null
  image_url: string | null
  unit_price: number
  qty: number
  subtotal: number
}

export interface Order {
  id: number
  order_number: string
  customer_id: string | null
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  payment_method: 'promptpay' | 'credit_card' | 'bank_transfer' | null
  payment_ref: string | null
  subtotal: number
  shipping_fee: number
  discount: number
  total: number
  ship_full_name: string | null
  ship_phone: string | null
  ship_address: string | null
  ship_sub_district: string | null
  ship_district: string | null
  ship_province: string | null
  ship_postal_code: string | null
  note: string | null
  created_at: string
  order_items?: OrderItem[]
}

export interface CartItem {
  product: Product
  qty: number
}
