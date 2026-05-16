import { createClient } from './supabase/server'
import type { Product, Category, CarBrand, CarModel } from '@/types'

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')
  return data ?? []
}

export async function getMainCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .order('sort_order')
  return data ?? []
}

export async function getCarBrands(): Promise<CarBrand[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('car_brands')
    .select('*')
    .order('name')
  return data ?? []
}

export async function getCarModels(carBrandId?: number): Promise<CarModel[]> {
  const supabase = await createClient()
  let query = supabase.from('car_models').select('*, car_brand:car_brands(*)').order('name')
  if (carBrandId) query = query.eq('car_brand_id', carBrandId)
  const { data } = await query
  return data ?? []
}

export async function getProducts(opts: {
  categorySlug?: string
  carModelId?: number
  yearFrom?: number
  yearTo?: number
  partBrandSlug?: string
  search?: string
  limit?: number
  offset?: number
} = {}): Promise<{ products: Product[]; total: number }> {
  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select(`
      *,
      part_brand:part_brands(*),
      category:categories(*),
      fitments(*, car_model:car_models(*, car_brand:car_brands(*)))
    `, { count: 'exact' })
    .eq('is_active', true)

  if (opts.search) {
    query = query.or(
      `name_th.ilike.%${opts.search}%,name_en.ilike.%${opts.search}%,part_number.ilike.%${opts.search}%,oem_number.ilike.%${opts.search}%`
    )
  }

  if (opts.categorySlug) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', opts.categorySlug)
      .single()
    if (cat) query = query.eq('category_id', cat.id)
  }

  if (opts.carModelId) {
    const { data: fitmentIds } = await supabase
      .from('fitments')
      .select('product_id')
      .eq('car_model_id', opts.carModelId)
    if (fitmentIds?.length) {
      query = query.in('id', fitmentIds.map((f) => f.product_id))
    }
  }

  if (opts.partBrandSlug) {
    const { data: brand } = await supabase
      .from('part_brands')
      .select('id')
      .eq('slug', opts.partBrandSlug)
      .single()
    if (brand) query = query.eq('brand_id', brand.id)
  }

  const limit = opts.limit ?? 12
  const offset = opts.offset ?? 0
  query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false })

  const { data, count } = await query
  return { products: (data as Product[]) ?? [], total: count ?? 0 }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select(`
      *,
      part_brand:part_brands(*),
      category:categories(*),
      fitments(*, car_model:car_models(*, car_brand:car_brands(*)))
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  return data as Product | null
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, part_brand:part_brands(*), category:categories(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit)
  return (data as Product[]) ?? []
}
