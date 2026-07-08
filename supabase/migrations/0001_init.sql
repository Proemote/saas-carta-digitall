-- =============================================================
-- Bodega Las Tres Carabelas — Esquema inicial
-- Carta digital pública + panel de gestión
-- =============================================================

-- ---------- ENUMS ----------
create type price_type as enum ('single', 'double', 'per_unit', 'no_price');
create type reservation_status as enum ('pending', 'confirmed', 'cancelled');
create type record_source as enum ('manual', 'chatbot');
create type message_role as enum ('user', 'bot');

-- ---------- CATEGORÍAS ----------
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_en text,
  slug text not null unique,
  parent_id uuid references categories(id) on delete cascade,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- PRODUCTOS ----------
create table products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete cascade,
  name text not null,
  name_en text,
  description text,
  description_en text,
  image_url text,
  price_type price_type not null default 'single',
  price numeric(8,2),          -- precio único (o precio "plato" si solo hay uno)
  price_tapa numeric(8,2),     -- precio tapa (tipo doble)
  price_plato numeric(8,2),    -- precio plato (tipo doble)
  price_unit numeric(8,2),     -- precio por unidad
  allergens text[] not null default '{}',
  is_available boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_products_category on products(category_id);

-- ---------- CLIENTES ----------
create table customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text unique,
  email text,
  notes text,
  source record_source not null default 'manual',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_customers_phone on customers(phone);

-- ---------- RESERVAS ----------
create table reservations (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete set null,
  customer_name text not null,          -- desnormalizado por si se borra el cliente
  date date not null,
  time time not null,
  party_size int not null check (party_size > 0),
  status reservation_status not null default 'pending',
  notes text,
  source record_source not null default 'manual',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_reservations_date on reservations(date);
create index idx_reservations_customer on reservations(customer_id);

-- ---------- VISITAS / CONSUMO ----------
create table visits (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  visit_date date not null default current_date,
  amount numeric(8,2),
  notes text,
  created_at timestamptz not null default now()
);

create index idx_visits_customer on visits(customer_id);

-- ---------- CHATBOT: FAQs ----------
create table chatbot_faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- CHATBOT: Conversaciones ----------
create table chatbot_conversations (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete set null,
  customer_phone text,
  customer_name text,
  started_at timestamptz not null default now(),
  last_message_at timestamptz not null default now()
);

create table chatbot_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references chatbot_conversations(id) on delete cascade,
  role message_role not null,
  content text not null,
  created_at timestamptz not null default now()
);

create index idx_messages_conversation on chatbot_messages(conversation_id);

-- ---------- GENERADOR DE CONTENIDO ----------
create table content_generations (
  id uuid primary key default gen_random_uuid(),
  format text not null,        -- reel | post | story | story_sequence
  objective text not null,     -- atraer | producto | ambiente | oferta | marca
  context text,
  result jsonb not null,       -- { concepto, guion, caption, hashtags }
  created_at timestamptz not null default now()
);

-- ---------- updated_at trigger ----------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_products_updated before update on products
  for each row execute function set_updated_at();
create trigger trg_customers_updated before update on customers
  for each row execute function set_updated_at();
create trigger trg_reservations_updated before update on reservations
  for each row execute function set_updated_at();
create trigger trg_faqs_updated before update on chatbot_faqs
  for each row execute function set_updated_at();

-- ---------- RLS ----------
-- Lectura pública de la carta; escritura solo autenticados (panel).
alter table categories enable row level security;
alter table products enable row level security;
alter table customers enable row level security;
alter table reservations enable row level security;
alter table visits enable row level security;
alter table chatbot_faqs enable row level security;
alter table chatbot_conversations enable row level security;
alter table chatbot_messages enable row level security;
alter table content_generations enable row level security;

-- Carta pública: cualquiera puede leer categorías y productos activos
create policy "public read categories" on categories
  for select using (true);
create policy "public read products" on products
  for select using (true);

-- Panel: FASE SIN LOGIN — acceso completo abierto.
-- ⚠️ Cuando se active la autenticación, sustituir estas políticas por
-- versiones con auth.role() = 'authenticated'.
create policy "open full categories" on categories
  for all using (true) with check (true);
create policy "open full products" on products
  for all using (true) with check (true);
create policy "open full customers" on customers
  for all using (true) with check (true);
create policy "open full reservations" on reservations
  for all using (true) with check (true);
create policy "open full visits" on visits
  for all using (true) with check (true);
create policy "open full faqs" on chatbot_faqs
  for all using (true) with check (true);
create policy "open full conversations" on chatbot_conversations
  for all using (true) with check (true);
create policy "open full messages" on chatbot_messages
  for all using (true) with check (true);
create policy "open full generations" on content_generations
  for all using (true) with check (true);
