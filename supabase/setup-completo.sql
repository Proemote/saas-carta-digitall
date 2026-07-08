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
-- =============================================================
-- Seed: carta real de Bodega Las Tres Carabelas
-- Extraída del menú físico (julio 2026)
-- =============================================================

-- ---------- Categorías principales ----------
insert into categories (id, name, name_en, slug, sort_order) values
  ('c0000000-0000-0000-0000-000000000001', 'Para Empezar',       'To Start',          'para-empezar',       1),
  ('c0000000-0000-0000-0000-000000000002', 'Papelones Chacinas', 'Cured Meats',       'papelones-chacinas', 2),
  ('c0000000-0000-0000-0000-000000000003', 'Caprichos',          'Little Treats',     'caprichos',          3),
  ('c0000000-0000-0000-0000-000000000004', 'Nuestros Tartar',    'Our Tartare',       'nuestros-tartar',    4),
  ('c0000000-0000-0000-0000-000000000005', 'De Almadraba',       'Almadraba Tuna',    'de-almadraba',       5),
  ('c0000000-0000-0000-0000-000000000006', 'Nuestras Tostas',    'Our Toasts',        'nuestras-tostas',    6),
  ('c0000000-0000-0000-0000-000000000007', 'Montaditos',         'Small Sandwiches',  'montaditos',         7),
  ('c0000000-0000-0000-0000-000000000008', 'Guisos',             'Stews',             'guisos',             8),
  ('c0000000-0000-0000-0000-000000000009', 'Nuestras Carnes',    'Our Meats',         'nuestras-carnes',    9),
  ('c0000000-0000-0000-0000-00000000000a', 'Nuestros Pescados',  'Our Fish',          'nuestros-pescados', 10),
  ('c0000000-0000-0000-0000-00000000000b', 'Postres',            'Desserts',          'postres',           11),
  ('c0000000-0000-0000-0000-00000000000c', 'Nuestras Bebidas',   'Our Drinks',        'nuestras-bebidas',  12),
  ('c0000000-0000-0000-0000-00000000000d', 'Carta de Vinos',     'Wine List',         'carta-de-vinos',    13);

-- ---------- Subcategorías de Bebidas ----------
insert into categories (id, name, name_en, slug, parent_id, sort_order) values
  ('c0000000-0000-0000-0000-0000000000c1', 'Cervezas Cruzcampo', 'Cruzcampo Beers', 'cervezas-cruzcampo', 'c0000000-0000-0000-0000-00000000000c', 1),
  ('c0000000-0000-0000-0000-0000000000c2', 'Copas de Vinos',     'Wines by the Glass', 'copas-de-vinos',  'c0000000-0000-0000-0000-00000000000c', 2),
  ('c0000000-0000-0000-0000-0000000000c3', 'Refrescos',          'Soft Drinks',     'refrescos',          'c0000000-0000-0000-0000-00000000000c', 3);

-- ---------- Subcategorías de Carta de Vinos ----------
insert into categories (id, name, name_en, slug, parent_id, sort_order) values
  ('c0000000-0000-0000-0000-0000000000d1', 'Vinos de la Tierra por Copas — Bodega César Florido (Chipiona)', 'Local Wines by the Glass — Bodega César Florido (Chipiona)', 'vinos-tierra-copas', 'c0000000-0000-0000-0000-00000000000d', 1),
  ('c0000000-0000-0000-0000-0000000000d2', 'Vinos Tintos por Botellas',  'Red Wines by the Bottle',   'tintos-botellas',  'c0000000-0000-0000-0000-00000000000d', 2),
  ('c0000000-0000-0000-0000-0000000000d3', 'Vinos Blancos por Botellas', 'White Wines by the Bottle', 'blancos-botellas', 'c0000000-0000-0000-0000-00000000000d', 3),
  ('c0000000-0000-0000-0000-0000000000d4', 'Copas y Licores',            'Spirits & Liqueurs',        'copas-licores',    'c0000000-0000-0000-0000-00000000000d', 4);

-- =============================================================
-- PRODUCTOS
-- =============================================================

-- ---------- Para Empezar ----------
insert into products (category_id, name, price_type, price, price_tapa, price_plato, sort_order) values
  ('c0000000-0000-0000-0000-000000000001', 'Tomate con Lomo Atún',                'single', 7.00,  null, null, 1),
  ('c0000000-0000-0000-0000-000000000001', 'Aceitunas',                           'single', 3.00,  null, null, 2),
  ('c0000000-0000-0000-0000-000000000001', 'Torreznos de Soria',                  'single', 7.00,  null, null, 3),
  ('c0000000-0000-0000-0000-000000000001', 'Ensalada de Ahumados',                'single', 10.00, null, null, 4),
  ('c0000000-0000-0000-0000-000000000001', 'Pimientada de Atún',                  'single', 10.00, null, null, 5),
  ('c0000000-0000-0000-0000-000000000001', 'Paté de Ciervo y Pasas',              'single', 6.00,  null, null, 6),
  ('c0000000-0000-0000-0000-000000000001', 'Paté de Queso Azul y Cebolla',        'single', 6.00,  null, null, 7),
  ('c0000000-0000-0000-0000-000000000001', 'Papas Arrugadas',                     'single', 5.00,  null, null, 8),
  ('c0000000-0000-0000-0000-000000000001', 'Ensaladilla de la Casa',              'double', null,  3.50, 7.00, 9),
  ('c0000000-0000-0000-0000-000000000001', 'Patatas Aliñadas con Lomo de Atún',   'double', null,  3.50, 7.00, 10);

-- ---------- Papelones Chacinas ----------
insert into products (category_id, name, price_type, price, price_tapa, price_plato, sort_order) values
  ('c0000000-0000-0000-0000-000000000002', 'Jamón Bellota',         'single', 19.00, null, null,  1),
  ('c0000000-0000-0000-0000-000000000002', 'Caña de Lomo Bellota',  'single', 15.00, null, null,  2),
  ('c0000000-0000-0000-0000-000000000002', 'Taquitos de Jamón',     'single', 4.00,  null, null,  3),
  ('c0000000-0000-0000-0000-000000000002', 'Salchichón',            'double', null,  4.00, 7.50,  4),
  ('c0000000-0000-0000-0000-000000000002', 'Morcilla de Hígado',    'double', null,  3.50, 6.50,  5),
  ('c0000000-0000-0000-0000-000000000002', 'Queso Oveja Viejo',     'double', null,  3.50, 10.50, 6);

-- ---------- Caprichos ----------
insert into products (category_id, name, price_type, price, price_tapa, price_plato, price_unit, sort_order) values
  ('c0000000-0000-0000-0000-000000000003', 'Pata de Pulpo',                 'single',   17.00, null, null, null, 1),
  ('c0000000-0000-0000-0000-000000000003', 'Boquerones en Vinagre',         'double',   null,  3.50, 7.00, null, 2),
  ('c0000000-0000-0000-0000-000000000003', 'Anchoas del Cantábrico',        'per_unit', null,  null, null, 1.80, 3),
  ('c0000000-0000-0000-0000-000000000003', 'Gildas Anchoas',                'per_unit', null,  null, null, 1.50, 4),
  ('c0000000-0000-0000-0000-000000000003', 'Gildas de Boquerón',            'per_unit', null,  null, null, 1.80, 5),
  ('c0000000-0000-0000-0000-000000000003', 'Gildas de Sushi Cecina Huevo',  'per_unit', null,  null, null, 2.20, 6);

-- ---------- Nuestros Tartar ----------
insert into products (category_id, name, price_type, price, sort_order) values
  ('c0000000-0000-0000-0000-000000000004', 'Tartar de Atún Rojo de Almadraba', 'single', 12.00, 1),
  ('c0000000-0000-0000-0000-000000000004', 'Tartar de Salmón',                 'single', 12.00, 2),
  ('c0000000-0000-0000-0000-000000000004', 'Steak Tartar',                     'single', 12.00, 3);

-- ---------- De Almadraba ----------
insert into products (category_id, name, price_type, price, price_tapa, price_plato, price_unit, sort_order) values
  ('c0000000-0000-0000-0000-000000000005', 'Tarantelo',                     'no_price', null,  null, null,  null, 1),
  ('c0000000-0000-0000-0000-000000000005', 'Solomillo de Atún Almadraba',   'per_unit', null,  null, null,  3.50, 2),
  ('c0000000-0000-0000-0000-000000000005', 'Mojama de Almadraba',           'double',   null,  3.50, 10.00, null, 3);

-- ---------- Nuestras Tostas ----------
insert into products (category_id, name, price_type, price, sort_order) values
  ('c0000000-0000-0000-0000-000000000006', 'Sardinas Anchoadas y Queso Viejo',  'single', 7.00, 1),
  ('c0000000-0000-0000-0000-000000000006', 'Rulo de Cabra con Miel y Nueces',   'single', 7.00, 2),
  ('c0000000-0000-0000-0000-000000000006', 'Boquerón Aguacate',                 'single', 7.00, 3),
  ('c0000000-0000-0000-0000-000000000006', 'Salmón Aguacate',                   'single', 7.00, 4),
  ('c0000000-0000-0000-0000-000000000006', 'Gulas con Salmorejo',               'single', 7.00, 5),
  ('c0000000-0000-0000-0000-000000000006', 'Bacalao con Salmorejo',             'single', 7.00, 6),
  ('c0000000-0000-0000-0000-000000000006', 'Sardina Anchoadas Aguacate',        'single', 7.00, 7),
  ('c0000000-0000-0000-0000-000000000006', 'Ahumados Aguacate',                 'single', 7.00, 8),
  ('c0000000-0000-0000-0000-000000000006', 'Rulo de Cabra con Arándanos',       'single', 7.00, 9);

-- ---------- Montaditos ----------
insert into products (category_id, name, price_type, price_unit, sort_order) values
  ('c0000000-0000-0000-0000-000000000007', 'Mini Hamburguesa',                'per_unit', 3.50, 1),
  ('c0000000-0000-0000-0000-000000000007', 'Solomillo al Whisky',             'per_unit', 3.50, 2),
  ('c0000000-0000-0000-0000-000000000007', 'Melva con Pimientos Morrones',    'per_unit', 3.50, 3),
  ('c0000000-0000-0000-0000-000000000007', 'Chorizo Picante',                 'per_unit', 3.50, 4),
  ('c0000000-0000-0000-0000-000000000007', 'Salmón con Philadelphia',         'per_unit', 3.50, 5),
  ('c0000000-0000-0000-0000-000000000007', 'Pringa',                          'per_unit', 3.50, 6);

-- ---------- Guisos ----------
insert into products (category_id, name, price_type, price, price_tapa, price_plato, sort_order) values
  ('c0000000-0000-0000-0000-000000000008', 'Atún al Pedro Jiménez',   'single', 12.00, null, null,  1),
  ('c0000000-0000-0000-0000-000000000008', 'Atún Encebollado',        'single', 12.00, null, null,  2),
  ('c0000000-0000-0000-0000-000000000008', 'Fabada Asturiana',        'single', 10.00, null, null,  3),
  ('c0000000-0000-0000-0000-000000000008', 'Carrillada',              'double', null,  5.00, 15.00, 4),
  ('c0000000-0000-0000-0000-000000000008', 'Albóndigas de Chocos',    'double', null,  4.00, 12.00, 5);

-- ---------- Nuestras Carnes ----------
insert into products (category_id, name, price_type, price, sort_order) values
  ('c0000000-0000-0000-0000-000000000009', 'Lomo Bajo 300gr aprox.',            'single',   16.00, 1),
  ('c0000000-0000-0000-0000-000000000009', 'Lomo Alto 400gr aprox.',            'single',   23.00, 2),
  ('c0000000-0000-0000-0000-000000000009', 'Solomillo Ternera 200gr aprox.',    'single',   20.00, 3),
  ('c0000000-0000-0000-0000-000000000009', 'Presa Ibérica',                     'single',   17.00, 4),
  ('c0000000-0000-0000-0000-000000000009', 'Solomillo de Cerdo',                'single',   12.00, 5),
  ('c0000000-0000-0000-0000-000000000009', 'Costillas Salsa Barbacoa',          'single',   12.00, 6),
  ('c0000000-0000-0000-0000-000000000009', 'Brocheta de Solomillo',             'single',   12.00, 7),
  ('c0000000-0000-0000-0000-000000000009', 'Churrasco de Pollo',                'single',   6.00,  8);

insert into products (category_id, name, description, price_type, sort_order) values
  ('c0000000-0000-0000-0000-000000000009', 'T-bone',    '21 días de maduración', 'no_price', 9),
  ('c0000000-0000-0000-0000-000000000009', 'Tomahawk',  '21 días de maduración', 'no_price', 10);

-- ---------- Nuestros Pescados ----------
insert into products (category_id, name, price_type, price, sort_order) values
  ('c0000000-0000-0000-0000-00000000000a', 'Bacalao bañado en salsa gourmet', 'single', 14.00, 1),
  ('c0000000-0000-0000-0000-00000000000a', 'Salmón',                          'single', 10.00, 2);

-- ---------- Postres ----------
insert into products (category_id, name, price_type, price, sort_order) values
  ('c0000000-0000-0000-0000-00000000000b', 'Pionono', 'single', 5.00, 2);

insert into products (category_id, name, description, price_type, sort_order) values
  ('c0000000-0000-0000-0000-00000000000b', 'Tarta', 'Consultar', 'no_price', 1);

-- ---------- Bebidas: Cervezas Cruzcampo ----------
insert into products (category_id, name, price_type, price, sort_order) values
  ('c0000000-0000-0000-0000-0000000000c1', 'Copa',         'single', 1.90, 1),
  ('c0000000-0000-0000-0000-0000000000c1', 'Cortada',      'single', 1.70, 2),
  ('c0000000-0000-0000-0000-0000000000c1', 'Maceta',       'single', 3.00, 3),
  ('c0000000-0000-0000-0000-0000000000c1', 'Botellín',     'single', 1.50, 4),
  ('c0000000-0000-0000-0000-0000000000c1', 'Tercio',       'single', 2.00, 5),
  ('c0000000-0000-0000-0000-0000000000c1', 'Heineken 0,0', 'single', 2.00, 6),
  ('c0000000-0000-0000-0000-0000000000c1', 'Radler',       'single', 2.00, 7),
  ('c0000000-0000-0000-0000-0000000000c1', 'Sin Gluten',   'single', 2.00, 8);

-- ---------- Bebidas: Copas de Vinos ----------
insert into products (category_id, name, price_type, price, sort_order) values
  ('c0000000-0000-0000-0000-0000000000c2', 'Rioja',            'single', 2.70, 1),
  ('c0000000-0000-0000-0000-0000000000c2', 'Ribera',           'single', 2.70, 2),
  ('c0000000-0000-0000-0000-0000000000c2', 'Verdejo',          'single', 2.70, 3),
  ('c0000000-0000-0000-0000-0000000000c2', 'Semidulce',        'single', 2.70, 4),
  ('c0000000-0000-0000-0000-0000000000c2', 'Frizante',         'single', 2.70, 5),
  ('c0000000-0000-0000-0000-0000000000c2', 'Tintos de Verano', 'single', 1.80, 6);

-- ---------- Bebidas: Refrescos ----------
insert into products (category_id, name, price_type, price, sort_order) values
  ('c0000000-0000-0000-0000-0000000000c3', 'Coca Cola',      'single', 1.70, 1),
  ('c0000000-0000-0000-0000-0000000000c3', 'Naranja',        'single', 1.70, 2),
  ('c0000000-0000-0000-0000-0000000000c3', 'Limón',          'single', 1.70, 3),
  ('c0000000-0000-0000-0000-0000000000c3', 'Nestea',         'single', 2.00, 4),
  ('c0000000-0000-0000-0000-0000000000c3', 'Aquarius',       'single', 2.00, 5),
  ('c0000000-0000-0000-0000-0000000000c3', 'Zumos',          'single', 1.50, 6),
  ('c0000000-0000-0000-0000-0000000000c3', 'Agua con/sin gas','single', 1.50, 7),
  ('c0000000-0000-0000-0000-0000000000c3', 'Casera Blanca',  'single', 1.50, 8);

-- ---------- Vinos: de la Tierra por Copas ----------
insert into products (category_id, name, price_type, price, sort_order) values
  ('c0000000-0000-0000-0000-0000000000d1', 'Manzanilla',        'single', 1.80, 1),
  ('c0000000-0000-0000-0000-0000000000d1', 'Moscatel Especial', 'single', 1.80, 2),
  ('c0000000-0000-0000-0000-0000000000d1', 'Moscatel Dorado',   'single', 1.80, 3),
  ('c0000000-0000-0000-0000-0000000000d1', 'Moscatel de Pasas', 'single', 2.80, 4),
  ('c0000000-0000-0000-0000-0000000000d1', 'Vermut',            'single', 2.80, 5);

-- ---------- Vinos: Tintos por Botellas ----------
insert into products (category_id, name, description, price_type, price, sort_order) values
  ('c0000000-0000-0000-0000-0000000000d2', 'Vino de la Casa',    null,                      'single', 14.50, 1),
  ('c0000000-0000-0000-0000-0000000000d2', 'Luis Cañas Crianza', 'D.O. Ca. Rioja',          'single', 25.00, 2),
  ('c0000000-0000-0000-0000-0000000000d2', 'Colonia 40',         'Cazalla de la Sierra',    'single', 20.00, 3),
  ('c0000000-0000-0000-0000-0000000000d2', 'LAN Crianza',        'D.O. Ca. Rioja',          'single', 18.00, 4),
  ('c0000000-0000-0000-0000-0000000000d2', 'Aparicio',           'Ribera del Duero',        'single', 16.00, 5),
  ('c0000000-0000-0000-0000-0000000000d2', 'López de Haro Reserva', 'D.O. Ca. Rioja',       'single', 14.00, 6);

-- ---------- Vinos: Blancos por Botellas ----------
insert into products (category_id, name, description, price_type, price, sort_order) values
  ('c0000000-0000-0000-0000-0000000000d3', 'Manijero', 'V.T. Cádiz',        'single', 14.00, 1),
  ('c0000000-0000-0000-0000-0000000000d3', 'Aparicio', 'Verdejo',           'single', 14.00, 2),
  ('c0000000-0000-0000-0000-0000000000d3', 'Bicos',    'D.O. Rías Baixas',  'single', 15.00, 3);

-- ---------- Vinos: Copas y Licores ----------
insert into products (category_id, name, price_type, price, sort_order) values
  ('c0000000-0000-0000-0000-0000000000d4', 'Combinados',         'single', 6.00, 1),
  ('c0000000-0000-0000-0000-0000000000d4', 'Combinados Prémium', 'single', 9.00, 2),
  ('c0000000-0000-0000-0000-0000000000d4', 'Licores',            'single', 5.00, 3);

-- ---------- FAQs iniciales del chatbot ----------
insert into chatbot_faqs (question, answer, sort_order) values
  ('¿Cuál es el horario?', 'Abrimos de martes a domingo. Consulta nuestros horarios actualizados en redes sociales o llámanos.', 1),
  ('¿Dónde estáis ubicados?', 'Estamos en el centro. Búscanos como Bodega Las Tres Carabelas en Google Maps.', 2),
  ('¿Puedo reservar mesa?', 'Sí, dime nombre, fecha, hora y número de personas y te confirmo la reserva al momento.', 3),
  ('¿Tenéis opciones sin gluten?', 'Sí, pregunta por nuestro pan y picos sin gluten. Tenemos también cerveza sin gluten.', 4);
