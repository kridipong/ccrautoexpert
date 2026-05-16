-- ============================================================
-- ccrautoexpert — Supabase Schema
-- ============================================================

-- Extensions
create extension if not exists "unaccent";
create extension if not exists "pg_trgm";

-- ============================================================
-- PART BRANDS (Koyo, NSK, KYB, Bosch …)
-- ============================================================
create table part_brands (
  id          serial primary key,
  name        text not null unique,
  slug        text not null unique,
  logo_url    text,
  created_at  timestamptz default now()
);

-- ============================================================
-- CATEGORIES (hierarchical, max 2 levels)
-- ============================================================
create table categories (
  id          serial primary key,
  slug        text not null unique,
  name_th     text not null,
  name_en     text not null,
  parent_id   int references categories(id) on delete set null,
  sort_order  int default 0,
  created_at  timestamptz default now()
);

-- ============================================================
-- CAR BRANDS (Toyota, Honda, Isuzu …)
-- ============================================================
create table car_brands (
  id          serial primary key,
  name        text not null unique,
  slug        text not null unique,
  logo_url    text,
  created_at  timestamptz default now()
);

-- ============================================================
-- CAR MODELS (Vios, Civic, D-Max …)
-- ============================================================
create table car_models (
  id            serial primary key,
  car_brand_id  int not null references car_brands(id) on delete cascade,
  name          text not null,
  slug          text not null,
  model_code    text,                -- e.g. NCP93, ZNE10
  created_at    timestamptz default now(),
  unique(car_brand_id, slug)
);

-- ============================================================
-- PRODUCTS
-- ============================================================
create table products (
  id                serial primary key,
  slug              text not null unique,
  name_th           text not null,
  name_en           text not null,
  description_th    text,
  description_en    text,
  price             numeric(10,2) not null,
  compare_price     numeric(10,2),          -- original price before discount
  stock_qty         int not null default 0,
  part_number       text,
  oem_number        text,
  brand_id          int references part_brands(id) on delete set null,
  category_id       int references categories(id) on delete set null,
  images            text[] default '{}',    -- Cloudinary URLs
  weight_kg         numeric(6,3),
  dimensions        jsonb,                  -- {l, w, h} in cm
  fits_lr           boolean default false,  -- fits both left & right
  is_fast_shipping  boolean default false,
  is_active         boolean default true,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- Full-text search index (Thai + English)
create index products_fts_idx on products
  using gin(to_tsvector('simple', coalesce(name_th,'') || ' ' || coalesce(name_en,'') || ' ' || coalesce(part_number,'') || ' ' || coalesce(oem_number,'')));

-- ============================================================
-- FITMENTS (product ↔ car model + year range)
-- ============================================================
create table fitments (
  id            serial primary key,
  product_id    int not null references products(id) on delete cascade,
  car_model_id  int not null references car_models(id) on delete cascade,
  year_from     smallint,
  year_to       smallint,
  note_th       text,
  note_en       text,
  created_at    timestamptz default now()
);

create index fitments_product_idx   on fitments(product_id);
create index fitments_car_model_idx on fitments(car_model_id);

-- ============================================================
-- CUSTOMERS (extends Supabase auth.users)
-- ============================================================
create table customers (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  phone       text,
  created_at  timestamptz default now()
);

-- ============================================================
-- ADDRESSES
-- ============================================================
create table addresses (
  id            serial primary key,
  customer_id   uuid not null references customers(id) on delete cascade,
  label         text,                -- "บ้าน", "ที่ทำงาน"
  full_name     text not null,
  phone         text not null,
  address_line  text not null,
  sub_district  text not null,       -- ตำบล/แขวง
  district      text not null,       -- อำเภอ/เขต
  province      text not null,       -- จังหวัด
  postal_code   text not null,
  is_default    boolean default false,
  created_at    timestamptz default now()
);

-- ============================================================
-- ORDERS
-- ============================================================
create type order_status as enum (
  'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
);

create type payment_method as enum (
  'promptpay', 'credit_card', 'bank_transfer'
);

create table orders (
  id                serial primary key,
  order_number      text not null unique,   -- CCR-20240001
  customer_id       uuid references customers(id) on delete set null,
  status            order_status default 'pending',
  payment_method    payment_method,
  payment_ref       text,                   -- Omise charge ID
  subtotal          numeric(10,2) not null,
  shipping_fee      numeric(10,2) default 0,
  discount          numeric(10,2) default 0,
  total             numeric(10,2) not null,
  -- shipping address snapshot
  ship_full_name    text,
  ship_phone        text,
  ship_address      text,
  ship_sub_district text,
  ship_district     text,
  ship_province     text,
  ship_postal_code  text,
  note              text,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- Auto-generate order number: CCR-YYYYMMDD-XXXX
create sequence order_seq;
create or replace function generate_order_number()
returns text language plpgsql as $$
begin
  return 'CCR-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(nextval('order_seq')::text, 4, '0');
end;
$$;

-- ============================================================
-- ORDER ITEMS
-- ============================================================
create table order_items (
  id          serial primary key,
  order_id    int not null references orders(id) on delete cascade,
  product_id  int references products(id) on delete set null,
  -- snapshot at time of purchase
  name_th     text not null,
  name_en     text not null,
  part_number text,
  image_url   text,
  unit_price  numeric(10,2) not null,
  qty         int not null,
  subtotal    numeric(10,2) not null
);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_updated_at before update on products
  for each row execute function set_updated_at();

create trigger orders_updated_at before update on orders
  for each row execute function set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Products: public read, admin write
alter table products enable row level security;
create policy "public read products" on products for select using (is_active = true);

-- Categories / car_brands / car_models / part_brands: public read
alter table categories    enable row level security;
alter table car_brands    enable row level security;
alter table car_models    enable row level security;
alter table part_brands   enable row level security;
alter table fitments      enable row level security;

create policy "public read categories"  on categories  for select using (true);
create policy "public read car_brands"  on car_brands  for select using (true);
create policy "public read car_models"  on car_models  for select using (true);
create policy "public read part_brands" on part_brands for select using (true);
create policy "public read fitments"    on fitments    for select using (true);

-- Customers: own row only
alter table customers enable row level security;
create policy "customers own row" on customers
  for all using (auth.uid() = id);

-- Addresses: own rows only
alter table addresses enable row level security;
create policy "addresses own rows" on addresses
  for all using (auth.uid() = customer_id);

-- Orders: own orders only (public read for admins handled via service role)
alter table orders enable row level security;
create policy "orders own rows" on orders
  for select using (auth.uid() = customer_id);

alter table order_items enable row level security;
create policy "order_items via orders" on order_items
  for select using (
    exists (select 1 from orders where orders.id = order_items.order_id and orders.customer_id = auth.uid())
  );
