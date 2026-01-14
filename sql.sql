-- 1. جدول المستخدمين (نستخدم جدول auth.users الخاص بـ Supabase ونربطه بجدول إضافي للتفاصيل)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  role text check (role in ('admin', 'driver', 'customer')) not null default 'customer',
  shop_name text, -- اسم البقالة
  phone text,
  address text,
  latitude float, -- للموقع الجغرافي
  longitude float,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. جدول التصنيفات (شيبس، مشروبات، سكاكر)
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. جدول المنتجات
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  category_id uuid references public.categories(id),
  name text not null,
  description text,
  price numeric not null default 0, -- السعر الحالي
  cost_price numeric default 0, -- سعر التكلفة (لتعرف ربحك)
  stock_quantity integer default 0, -- المخزون
  image_url text,
  barcode text, -- للمسح بالكاميرا
  is_active boolean default true, -- لإخفاء المنتج دون حذفه
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. جدول الطلبات (رأس الفاتورة)
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null, -- صاحب البقالة
  driver_id uuid references public.profiles(id), -- السائق المسؤول
  status text check (status in ('pending', 'processing', 'delivering', 'delivered', 'cancelled')) default 'pending',
  total_amount numeric not null default 0,
  notes text,
  delivery_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  synced_at timestamp with time zone -- حقل مهم جداً للمزامنة لاحقاً
);

-- 5. تفاصيل الطلب (ماذا اشترى بالضبط)
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) not null,
  quantity integer not null default 1,
  price_at_purchase numeric not null, -- نحفظ السعر لحظة الشراء لأن سعر المنتج قد يتغير غداً
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- تفعيل Row Level Security (RLS) للحماية (خطوة ضرورية جداً)
alter table profiles enable row level security;
alter table orders enable row level security;

-- سياسة بسيطة للبدء (تسمح للجميع بالقراءة - سنعدلها لاحقاً لتكون أكثر صرامة)
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Products are viewable by everyone" on products for select using (true);