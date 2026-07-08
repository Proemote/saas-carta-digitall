-- 0004: configuración del chatbot por system prompt (sustituye al enfoque de FAQs)
create table if not exists chatbot_config (
  id uuid primary key default gen_random_uuid(),
  business_instructions text not null default '',
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table chatbot_config enable row level security;
create policy "open full chatbot_config" on chatbot_config
  for all using (true) with check (true);

drop trigger if exists set_updated_at on chatbot_config;
create trigger set_updated_at before update on chatbot_config
  for each row execute function set_updated_at();

insert into chatbot_config (business_instructions, is_active)
select
'HORARIO: [completa aquí el horario real, ej.: martes a domingo de 12:00 a 16:30 y de 20:00 a 23:30; lunes cerrado]

DIRECCIÓN Y CONTACTO: [dirección del local] · Teléfono: [teléfono]

RESERVAS:
- Se aceptan reservas por el chat de hasta 8 personas. Para grupos más grandes, pedir que llamen por teléfono.
- Las reservas del chat quedan PENDIENTES hasta que el restaurante las confirma.

OTROS DATOS ÚTILES:
- Tenemos pan y picos sin gluten (preguntar al personal).
- [terraza sí/no, se admiten mascotas sí/no, métodos de pago, etc.]',
true
where not exists (select 1 from chatbot_config);
