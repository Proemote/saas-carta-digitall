-- 0005: Tablas para operaciones avanzadas del chatbot (mesas, promociones, asistencia)

-- ========== MESAS ==========
create table if not exists tables (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  capacity int not null check (capacity > 0),
  location text,
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table tables enable row level security;
create policy "open full tables" on tables for all using (true) with check (true);

-- ========== PROMOCIONES ==========
create table if not exists promotions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  discount_text text,
  discount_percentage numeric(5,2),
  valid_from date,
  valid_until date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table promotions enable row level security;
create policy "open full promotions" on promotions for all using (true) with check (true);

-- ========== EXTENDER CUSTOMERS ==========
alter table customers
  add column if not exists reservations_total int not null default 0,
  add column if not exists reservations_attended int not null default 0,
  add column if not exists no_show_count int not null default 0;

-- ========== EXTENDER RESERVATIONS ==========
alter table reservations
  add column if not exists table_id uuid references tables(id) on delete set null,
  add column if not exists attended boolean,
  add column if not exists bot_proposed boolean not null default false;

-- ========== TRIGGERS ==========
drop trigger if exists set_updated_at on tables;
create trigger set_updated_at before update on tables
  for each row execute function set_updated_at();

drop trigger if exists set_updated_at on promotions;
create trigger set_updated_at before update on promotions
  for each row execute function set_updated_at();

-- Trigger: cuando se marca attended, actualizar estadísticas del cliente
create or replace function update_customer_attendance()
returns trigger as $$
begin
  if new.attended is not null and old.attended is null then
    if new.attended = true then
      update customers
        set reservations_attended = reservations_attended + 1
        where id = new.customer_id;
    else
      update customers
        set no_show_count = no_show_count + 1
        where id = new.customer_id;
    end if;
  elsif new.attended is not true and old.attended = true then
    update customers
      set reservations_attended = reservations_attended - 1
      where id = new.customer_id;
  elsif new.attended = false and old.attended is not false then
    update customers
      set no_show_count = no_show_count + 1
      where id = new.customer_id;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_customer_attendance on reservations;
create trigger update_customer_attendance after update on reservations
  for each row execute function update_customer_attendance();

-- Trigger: al crear una reserva desde el bot o manual, incrementar reservations_total
create or replace function increment_customer_reservations()
returns trigger as $$
begin
  if new.customer_id is not null then
    update customers
      set reservations_total = reservations_total + 1
      where id = new.customer_id;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists increment_customer_reservations on reservations;
create trigger increment_customer_reservations after insert on reservations
  for each row execute function increment_customer_reservations();

-- Vista: disponibilidad de mesas por fecha/hora
create or replace view table_availability as
select
  t.id,
  t.name,
  t.capacity,
  t.location,
  t.is_active,
  coalesce(count(r.id), 0) as reservations_today
from tables t
left join reservations r on r.table_id = t.id
  and r.date = current_date
  and r.status != 'cancelled'
group by t.id, t.name, t.capacity, t.location, t.is_active;

-- Comentarios
comment on table tables is 'Mesas del restaurante (gestionadas por el dueño)';
comment on table promotions is 'Promociones y ofertas activas (gestionadas por el dueño)';
comment on column customers.reservations_total is 'Total de reservas realizadas (auto-actualizado)';
comment on column customers.reservations_attended is 'Reservas a las que asistió (auto-actualizado)';
comment on column customers.no_show_count is 'Veces que no asistió (auto-actualizado)';
comment on column reservations.attended is 'null=pendiente, true=asistió, false=no vino';
comment on column reservations.bot_proposed is 'true si la reserva fue propuesta por el chatbot (pendiente de confirmación)';
