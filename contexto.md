# CONTEXTO — Carta Digital + Panel de Gestión "Bodega Las Tres Carabelas"

**Última actualización:** 8 julio 2026
**Estado:** 🟢 EN PRODUCCIÓN — https://las-tres-carabelas-eta.vercel.app (Vercel, cuenta contactoproemote-4672, proyecto `las-tres-carabelas`). Conectado a Supabase real.
**Ubicación del proyecto:** `CLAUDE BRAIN/03-Proemote-Tech/las-tres-carabelas/`

---

## 1. Qué es este proyecto

Web app (no escritorio, no móvil nativo) para el bar-restaurante **Bodega Las Tres Carabelas**, con dos partes:

1. **Carta digital pública** (`/`) — el cliente la abre escaneando un QR en la mesa. Mobile-first.
2. **Panel de gestión privado** (`/admin`) — el dueño gestiona carta, reservas, clientes, chatbot y genera contenido para redes con IA. Pensado para alguien sin conocimientos técnicos.

**Stack:** Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind 4 + Supabase (BD + auth futura) + API de Claude (generador de contenido). Deploy previsto: **Vercel**.

---

## 2. Identidad visual (del brief)

- **Concepto:** bodega, mar y tradición. Marinera y clásica, rústico + cuidado. NO chiringuito de playa.
- **Paleta** (definida en `src/app/globals.css` con `@theme`):
  - `sand #f2ead9` (fondo beige), `cream #faf7ef`, `parchment #ede2cb`
  - `wood #6b4f3a`, `wood-dark #3a2a1e`, `ink #241a12`
  - `teja #a03d2a` (rojo de las velas de las carabelas), `teja-dark #7e2e1f`
  - `gold #c89b5f`, `gold-soft #e3cfa8`
- **Tipografías** (next/font): `Dancing Script` (títulos cursivos, clase `font-script`) + `Poppins` (cuerpo).
- Motivo de **olas** (`src/components/public/Waves.tsx`) imitando el pie del menú físico. Icono de barco (lucide `Ship`).

---

## 3. La carta real (datos)

Extraída de las 7 fotos del menú físico en `../Carta Digital Las Tres Carabelas/` (jpegs). **13 categorías**, ~90 productos:

Para Empezar · Papelones Chacinas · Caprichos · Nuestros Tartar · De Almadraba · Nuestras Tostas · Montaditos · Guisos · Nuestras Carnes · Nuestros Pescados · Postres · Nuestras Bebidas (subcats: Cervezas Cruzcampo, Copas de Vinos, Refrescos) · Carta de Vinos (subcats: Vinos de la Tierra por Copas — Bodega César Florido, Tintos por Botellas, Blancos por Botellas, Copas y Licores)

**4 tipos de precio** (enum `price_type`): `single` (único), `double` (tapa + plato), `per_unit` (€/ud), `no_price` (S/P — Tarantelo, T-bone, Tomahawk, Tarta).

Pie de carta: "Pregunte por nuestro pan y picos sin gluten" + texto legal Reglamento UE 1169/2011 + leyenda de los 14 alérgenos (definidos en `src/lib/allergens.ts`).

---

## 4. Supabase (conectado ✅)

- **Proyecto:** "Carta Digital Demo" — en una cuenta distinta a la principal de Proemote (la cuenta contactoproemote@gmail.com tenía el límite de 2 proyectos free ocupados por CRM LeafFlow y proemote-diagnostico).
- **URL:** `https://kckmmdntgogmjcfbyixp.supabase.co`
- **Key:** publishable key en `.env.local` (NO está en git)
- **⚠️ El MCP de Supabase de Claude Code está vinculado a la cuenta antigua**, no a esta. Para operar esta BD desde Claude: usar la REST API con la publishable key (funciona, verificado) o reconectar el MCP.
- **Esquema:** 9 tablas — `categories`, `products`, `customers`, `reservations`, `visits`, `chatbot_faqs`, `chatbot_conversations`, `chatbot_messages`, `content_generations`. Enums: `price_type`, `reservation_status`, `record_source`, `message_role`. Trigger `set_updated_at`.
- **RLS:** activado. Lectura pública en categorías/productos. **Escritura ABIERTA a todos** (políticas "open full …") porque la fase actual es SIN LOGIN. ⚠️ Al activar autenticación: sustituir por políticas `auth.role() = 'authenticated'`.
- **Migraciones:** `supabase/migrations/0001_init.sql` (esquema) + `0002_seed_carta.sql` (carta completa + 4 FAQs). Combinadas en `supabase/setup-completo.sql` (ya ejecutado en el SQL Editor por Carlos).

---

## 5. Variables de entorno (`.env.local`, no va a git)

```
NEXT_PUBLIC_SUPABASE_URL=https://kckmmdntgogmjcfbyixp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_… (publishable key)
ANTHROPIC_API_KEY=sk-ant-… (key real de Carlos, para el generador IA)
ADMIN_AUTH_DISABLED=true   ← fase sin login; poner "false" al activar auth
```

Plantilla en `.env.local.example`. Estas mismas 4 variables hay que ponerlas en Vercel al deployar.

---

## 6. Estructura del código

```
src/
├── middleware.ts                  # Protege /admin (salta si ADMIN_AUTH_DISABLED=true o sin Supabase)
├── lib/
│   ├── types.ts                   # Tipos de todo el dominio
│   ├── i18n.ts                    # Diccionario ES/EN de la carta pública
│   ├── allergens.ts               # Los 14 alérgenos UE con emoji y etiquetas ES/EN
│   ├── menu.ts                    # getMenuSections(): Supabase → fallback local si no hay BD
│   ├── fallback-menu.ts           # Carta completa en local (espejo del seed) para demo/preview
│   └── supabase/ server.ts + client.ts
├── app/
│   ├── layout.tsx                 # Fuentes Dancing Script + Poppins
│   ├── globals.css                # @theme con la paleta de la bodega
│   ├── page.tsx                   # Carta pública (revalidate: 60s)
│   ├── api/generate/route.ts      # POST → Claude (claude-opus-4-8, streaming) → JSON {concepto, guion, caption, hashtags}
│   └── admin/
│       ├── actions.ts             # Server actions: CRUD reservas/clientes/carta/FAQs + login/logout
│       ├── login/page.tsx         # Login (Supabase Auth) — INACTIVO en esta fase
│       └── (panel)/               # Route group con el shell (sidebar desktop + bottom nav móvil)
│           ├── layout.tsx
│           ├── page.tsx           # M1 Dashboard
│           ├── reservas/page.tsx  # M2
│           ├── clientes/page.tsx + [id]/page.tsx  # M3
│           ├── carta/page.tsx     # M4
│           ├── chatbot/page.tsx   # M5
│           └── contenido/page.tsx # M6
└── components/
    ├── public/ MenuView.tsx (toda la carta, client) + Waves.tsx
    └── admin/ ReservationsView.tsx · CustomersView.tsx · MenuManager.tsx
             · ChatbotManager.tsx · ContentGenerator.tsx · SetupNotice.tsx
```

---

## 7. Los 6 módulos del panel — estado

1. **Dashboard** ✅ — reservas hoy/próximos 7 días, nº clientes, últimas reservas, agotados, accesos rápidos.
2. **Reservas** ✅ — vista lista + calendario mensual (date-fns), crear/editar/cancelar/eliminar, confirmar pendientes. Al crear con teléfono, vincula o crea ficha de cliente automáticamente.
3. **Clientes** ✅ — buscador, ficha con datos editables, notas internas, historial de reservas y registro de visitas/consumo.
4. **Carta** ✅ — CRUD de productos con los 4 tipos de precio, interruptor disponible/agotado (se refleja en la carta pública como "Agotado" tachado), reordenar categorías (flechas), crear categorías.
5. **Chatbot** ✅ — Motor de IA + Widget web (9 jul 2026). API `/api/chat` llama a Claude-haiku con system prompt dinámico. El dueño configura el system prompt (horario, contacto, política de reservas) desde el panel. Widget flotante en la carta pública (4 idiomas, persistencia de conversación). Tabla `chatbot_config` con `business_instructions`. Historial guardado en `chatbot_messages`/`chatbot_conversations`. **Falta:** conexión real con WhatsApp Business API (posterior).
6. **Contenido ✦** ✅ — wizard 3 pasos (formato: reel/post/story/secuencia · objetivo: atraer/producto/ambiente/oferta/marca · contexto libre) → llama a `/api/generate` → Claude con system prompt que conoce la carta real → concepto + guion con planos + caption + hashtags, con botón copiar por bloque y propuestas múltiples. Guarda histórico en `content_generations`. **Probado end-to-end con la API key real ✅**.

---

## 8. Decisiones tomadas (con Carlos)

- Construir **todo el esqueleto de una vez** (los 6 módulos), no por fases.
- **Chatbot:** UI preparada, conexión WhatsApp después.
- **Generador IA:** conectado desde ya con API key de Anthropic (modelo `claude-opus-4-8`).
- **Sin login por ahora** (`ADMIN_AUTH_DISABLED=true` + políticas RLS abiertas). El código de auth (login page, middleware, server actions) ya existe y se activa poniendo la var a false + creando usuario en Supabase Auth + endureciendo RLS.
- Proyecto Supabase en **cuenta secundaria** por límite del plan free.
- Idiomas de la carta: **ES/EN/FR/DE** con selector. TODO se traduce: platos, descripciones, categorías, alérgenos y UI. Las traducciones viven en la **BD** (columnas `name_en/fr/de`, `description_en/fr/de` en products; `name_en/fr/de` en categories — migración 0003) y al crear/renombrar un plato o categoría desde el panel se **auto-traducen con Claude** (`src/lib/translate.ts`, claude-haiku, ver saveProduct/saveCategory en actions.ts). Respaldo: diccionario `src/lib/menu-translations.ts` (clave = nombre español; cubre también el fallback local). Nombres propios (vinos, marcas) no se traducen.
- **Acceso a Supabase desde Claude:** `SUPABASE_ACCESS_TOKEN` en `.env.local` (token de la cuenta secundaria, 9 jul 2026). Permite DDL y SQL vía Management API: `POST https://api.supabase.com/v1/projects/kckmmdntgogmjcfbyixp/database/query` con header `Authorization: Bearer $TOKEN`.

---

## 9. Verificaciones realizadas (8 julio 2026)

- `npm run build` limpio (12 rutas, / estática con revalidate 60s).
- Carta pública verificada visualmente en Chrome: cabecera de marca, nav sticky, 3 tipos de precio renderizando bien, pie de alérgenos, olas.
- Panel verificado: sidebar + los 6 módulos.
- Escritura real en BD: reserva de prueba "Prueba Proemote" (jue 9 jul 13:30, 4 pax) creada vía REST → apareció en el dashboard. **Se puede borrar desde Reservas.**
- Generador IA: reel del Tomahawk generado correctamente con la key real.
- Corregido: espacio sobrante delante de ANTHROPIC_API_KEY en .env.local (rompía la auth).

## Cómo arrancar en local

```bash
cd "CLAUDE BRAIN/03-Proemote-Tech/las-tres-carabelas"
npm run dev -- --port 3050
# Carta: http://localhost:3050 · Panel: http://localhost:3050/admin
```

Nota Claude Code: la sandbox de Bash bloquea localhost → usar `dangerouslyDisableSandbox` para curl/npm dev si hace falta acceso de red local.

---

## 10. Sistema de Operaciones del Chatbot (9 julio 2026)

**Nuevas tablas (migración 0005):**
- `tables` — mesas (nombre, capacidad, ubicación, notas, is_active)
- `promotions` — ofertas (título, descripción, descuento, fechas de validez)
- Extensiones: `customers` (contadores de reservas), `reservations` (table_id, attended, bot_proposed)

**Lógica automática (triggers):**
- Al crear reserva → incrementa `customers.reservations_total`
- Al marcar attended=true → incrementa `customers.reservations_attended`
- Al marcar attended=false → incrementa `customers.no_show_count`
- Cálculo automático de % asistencia en queries

**Chatbot inteligente (tool use):**
- Claude Haiku con 4 herramientas (tools):
  1. `check_table_availability(date, time, party_size)` → mesas libres
  2. `get_active_promotions()` → ofertas activas
  3. `get_customer_info(phone)` → ficha de cliente (historial, %)
  4. `propose_reservation(...)` → propone reserva (bot_proposed=true, status=pending)
- El bot decide cuándo usar cada herramienta; el dueño confirma desde el panel

**Panel:**
- Nuevo módulo "Mesas" (CRUD): crear/editar/eliminar mesas, activar/desactivar
- Nuevo módulo "Promociones" (CRUD): crear ofertas con fechas de validez, activar/desactivar
- Reservas: columna "Asistencia" (Pendiente/Asistió/No vino) — **próximo: crear UI**
- Clientes: ficha de cliente — **próximo: mostrar stats (X reservas, Y asistidas, Z%)**

## 12. Pendiente (próximos pasos)

1. ~~**Deploy en Vercel**~~ ✅ HECHO (8 jul 2026).
   - URL pública: **https://las-tres-carabelas-eta.vercel.app** · Panel: `/admin`
   
2. **Completar UI de reservas y clientes:**
   - Reservas: agregar columna "Asistencia" (dropdown Pendiente/Asistió/No vino) → llama `setReservationAttendance`
   - Clientes: en la ficha, mostrar "X reservas, Y asistidas (Z% fidelidad)" y "No-shows: N" (en rojo si > 20%)

3. Fotos de productos (columna `image_url` ya existe; UI de subida a Supabase Storage sin hacer).

4. Alérgenos (columna `allergens text[]` existe; UI de edición en panel sin hacer).

5. **Conectar chatbot a WhatsApp Business API** (Meta/Twilio webhook → `/api/chat`).

6. **Mejorar proposición de reservas desde bot:**
   - Capturar datos interactivamente (nombre, fecha, hora, personas)
   - Verificar disponibilidad antes de proponer
   - Enviar confirmación de la propuesta

7. Activar login (código existe; cambiar `ADMIN_AUTH_DISABLED=false` + crear usuario en Supabase Auth + endurecer RLS).

8. Generar QR con la URL pública para las mesas.

9. Migrar proyecto Supabase a cuenta principal cuando haya cupo.

---

*Documento de contexto para retomar el trabajo en cualquier sesión futura de Claude Code. Leer hasta la sección 12. El CLAUDE.md general de Proemote está en `01-Proemote-Studio/proemote-landing/`.*
