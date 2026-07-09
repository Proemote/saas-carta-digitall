# CONTEXTO — Carta Digital + Panel de Gestión "Bodega Las Tres Carabelas"

**Última actualización:** 9 julio 2026
**Estado:** 🟢 EN PRODUCCIÓN — https://las-tres-carabelas-eta.vercel.app (Vercel, cuenta contactoproemote-4672, proyecto `las-tres-carabelas`). 
**Avance:** Carta digital + Panel Admin completo (6 módulos) + Chatbot inteligente con tool use + Gestión de mesas/promociones/asistencia de clientes.
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

## 7. Los 8 módulos del panel — estado (9 julio 2026)

1. **Dashboard** ✅ — reservas hoy/próximos 7 días, nº clientes, últimas reservas, agotados, accesos rápidos.

2. **Reservas** ✅ — vista lista + calendario mensual (date-fns), crear/editar/cancelar/eliminar, confirmar pendientes. Al crear con teléfono, vincula o crea ficha de cliente automáticamente. **Pendiente:** UI para marcar asistencia (attended: true/false/null).

3. **Clientes** ✅ — buscador, ficha con datos editables, notas internas, historial de reservas y registro de visitas/consumo. **Pendiente:** mostrar stats (X reservas totales, Y asistidas, Z% fidelidad, N no-shows) con indicadores visuales.

4. **Carta** ✅ — CRUD de productos con 4 tipos de precio, interruptor disponible/agotado. **Auto-traducción con Claude:** al crear/editar un plato, se generan automáticamente las traducciones EN/FR/DE y se guardan en BD. Reordenar categorías, crear categorías.

5. **Mesas** ✅ — CRUD de tablas (9 jul 2026). Crear/editar/eliminar mesas con nombre, capacidad, ubicación, notas. Activar/desactivar mesas. El bot consulta disponibilidad en tiempo real.

6. **Promociones** ✅ — CRUD de ofertas (9 jul 2026). Crear/editar/eliminar promociones con título, descuento (%), descuento_text, fechas de validez. Activar/desactivar. El bot las consulta y las menciona al cliente.

7. **Chatbot** ✅ — **Motor inteligente con tool use (9 jul 2026)**. El bot tiene acceso a 4 herramientas:
   - `check_table_availability(date, time, party_size)` → mesas libres
   - `get_active_promotions()` → ofertas activas
   - `get_customer_info(phone)` → ficha del cliente (reservas, % fidelidad)
   - `propose_reservation(...)` → propone reserva (bot_proposed=true, pendiente de confirmación)
   
   El bot decide automáticamente qué herramienta usar. El dueño confirma reservas desde el panel. Tabla `chatbot_config` con `business_instructions` editable. Widget flotante en carta pública (4 idiomas). Historial en `chatbot_conversations`/`chatbot_messages`. **Falta:** WhatsApp Business API.

8. **Contenido ✦** ✅ — wizard 3 pasos (formato, objetivo, contexto) → llama a `/api/generate` → Claude con system prompt que conoce la carta real → concepto + guion + caption + hashtags. Guarda histórico. Probado end-to-end.

---

## 8. Decisiones tomadas (con Carlos) — Actualizado 9 julio 2026

- Construir **todo el esqueleto de una vez** (los 6 módulos), no por fases.
- **Chatbot:** UI preparada, conexión WhatsApp después.
- **Generador IA:** conectado desde ya con API key de Anthropic (modelo `claude-opus-4-8`).
- **Sin login por ahora** (`ADMIN_AUTH_DISABLED=true` + políticas RLS abiertas). El código de auth (login page, middleware, server actions) ya existe y se activa poniendo la var a false + creando usuario en Supabase Auth + endureciendo RLS.
- Proyecto Supabase en **cuenta secundaria** por límite del plan free.
- Idiomas de la carta: **ES/EN/FR/DE** con selector. TODO se traduce: platos, descripciones, categorías, alérgenos y UI. Las traducciones viven en la **BD** (columnas `name_en/fr/de`, `description_en/fr/de` en products; `name_en/fr/de` en categories — migración 0003) y al crear/renombrar un plato o categoría desde el panel se **auto-traducen con Claude** (`src/lib/translate.ts`, claude-haiku, ver saveProduct/saveCategory en actions.ts). Respaldo: diccionario `src/lib/menu-translations.ts` (clave = nombre español; cubre también el fallback local). Nombres propios (vinos, marcas) no se traducen.
- **Acceso a Supabase desde Claude:** `SUPABASE_ACCESS_TOKEN` en `.env.local` (token de la cuenta secundaria, 9 jul 2026). Permite DDL y SQL vía Management API: `POST https://api.supabase.com/v1/projects/kckmmdntgogmjcfbyixp/database/query` con header `Authorization: Bearer $TOKEN`.
- **Chatbot inteligente (9 jul 2026):** El bot NO es un sistema de preguntas frecuentes (FAQs), sino una IA con herramientas (tool use). Puede consultar mesas, promociones, ficha de cliente, y proponer reservas. Las propuestas son "pendientes de confirmación" hasta que el dueño las ve en el panel y marca "confirmar".
- **Asistencia de clientes (9 jul 2026):** El dueño marca si el cliente asistió (true), no vino (false), o pendiente (null). Los triggers automáticos actualizan las estadísticas. Objetivo: identificar fácilmente clientes leales vs. problemáticos (alto no-show %).
- **Mesas y promociones (9 jul 2026):** Configuradas 100% por el dueño desde el panel. El bot las consulta en tiempo real.

---

## 9. Verificaciones realizadas — Actualizado 9 julio 2026

**8 julio 2026:**
- `npm run build` limpio (12 rutas, / estática con revalidate 60s).
- Carta pública verificada visualmente en Chrome: cabecera de marca, nav sticky, 3 tipos de precio, pie de alérgenos, olas.
- Panel verificado: sidebar + los 6 módulos.
- Escritura real en BD: reserva de prueba "Prueba Proemote" (jue 9 jul 13:30, 4 pax) creada vía REST → apareció en el dashboard.
- Generador IA: reel del Tomahawk generado correctamente con la key real.

**9 julio 2026:**
- ✅ Migraciones aplicadas (0003, 0004, 0005) vía Management API con token de Supabase
- ✅ Todas las traducciones (~90 productos, 20 categorías) pobladas en BD desde diccionario local
- ✅ Auto-traducción testeada: "Croquetas de choco" → EN/FR/DE generadas por Claude-haiku
- ✅ Tool use verificado: API `/api/chat` llama a herramientas, Claude decide cuándo usarlas
- ✅ Flujo propuesta de reserva: bot_proposed=true, status=pending, dueño confirma desde panel
- ✅ Triggers de estadísticas: al marcar attended, se actualiza automáticamente customer stats
- ✅ `npm run build` limpio tras todas las changes (8 rutas nuevas, sin errores de tipos)
- ✅ Deploy a Vercel verificado: https://las-tres-carabelas-eta.vercel.app responde 200
- ✅ Traducción EN/FR/DE verificada en producción: "Tartare de saumon", "Lachstatar" presentes en HTML

## Cómo arrancar en local

```bash
cd "CLAUDE BRAIN/03-Proemote-Tech/las-tres-carabelas"
npm run dev -- --port 3050
# Carta: http://localhost:3050 · Panel: http://localhost:3050/admin
```

Nota Claude Code: la sandbox de Bash bloquea localhost → usar `dangerouslyDisableSandbox` para curl/npm dev si hace falta acceso de red local.

---

## 10. Sistema de Operaciones del Chatbot (9 julio 2026 — COMPLETADO)

### 10.1 Base de Datos

**Migraciones aplicadas:**
- **0003** (9 jul) — Traducción EN/FR/DE
- **0004** (9 jul) — Configuración del chatbot (chatbot_config table)
- **0005** (9 jul) — Operaciones avanzadas

**Tablas nuevas (migración 0005):**
```
tables (id, name, capacity, location, notes, is_active, created_at, updated_at)
promotions (id, title, description, discount_text, discount_percentage, valid_from, valid_until, is_active, created_at, updated_at)
```

**Extensiones a tablas existentes:**
```
customers → reservations_total, reservations_attended, no_show_count
reservations → table_id (FK), attended (bool/null), bot_proposed (bool)
```

**Vista útil:**
- `table_availability` — reservaciones por fecha/hora (para consultas rápidas del bot)

### 10.2 Lógica Automática (Triggers)

1. **Al crear reserva** → `customers.reservations_total++`
2. **Al marcar attended=true** → `customers.reservations_attended++`
3. **Al marcar attended=false** → `customers.no_show_count++`
4. **Cálculo automático:** % fidelidad = (reservations_attended / reservations_total) * 100

Esto permite al dueño ver fácilmente quiénes son clientes leales (alta %) vs. problema (muchos no-shows).

### 10.3 Chatbot Inteligente — Tool Use

**Motor:** Claude Haiku + herramientas (tools) que el bot puede invocar automáticamente.

**Las 4 herramientas:**
1. **`check_table_availability(date, time, party_size)`**
   - Input: fecha (YYYY-MM-DD), hora (HH:MM), nº personas
   - Output: lista de mesas disponibles con capacidad
   - Usa: vista `table_availability` + query de reservaciones confirmadas

2. **`get_active_promotions()`**
   - Output: lista de promociones con is_active=true y fechas vigentes
   - El bot menciona ofertas relevantes en respuestas

3. **`get_customer_info(phone)`**
   - Input: teléfono del cliente
   - Output: nombre, email, notas, reservas_total, reservas_attended, no_show_count, % fidelidad
   - Permite al bot personalizar respuestas ("Veo que eres cliente frecuente...")

4. **`propose_reservation(customer_phone, customer_name, date, time, party_size, table_id, notes)`**
   - Acción: crea reserva con `bot_proposed=true`, `status='pending'`
   - Resultado: "Reserva propuesta (ID: xxx). El dueño la verá en el panel."
   - El dueño debe confirmar desde Reservas → Panel

**Flujo de conversación:**
1. Usuario: "Hola, quiero reservar para 4 personas mañana a las 20:00"
2. Bot llama `check_table_availability('2026-07-10', '20:00', 4)` → "Mesas disponibles: Terraza 4 (4 pax), Salón 2 (6 pax)"
3. Bot pregunta: "¿A nombre de quién?"
4. Usuario: "Pepe García, teléfono 123456789"
5. Bot llama `get_customer_info('123456789')` → "Pepe, tienes 8 reservas, asististe a 7 (87% fidelidad). ¡Bienvenido de vuelta!"
6. Bot llama `propose_reservation(...)` → propone la reserva
7. Dueño ve en panel: "Bot propuso reserva: Pepe García, 10 jul 20:00, 4 pax, Terraza 4"
8. Dueño: confirma o rechaza

### 10.4 Panel Admin — Nuevos Módulos

**Mesas** (`/admin/mesas`)
- Component: `TablesManager.tsx`
- CRUD completo: crear, editar, eliminar mesas
- Cambiar nombre, capacidad, ubicación, notas
- Activar/desactivar mesa (is_active toggle)
- Acción: `saveTable()`, `deleteTable()`, `toggleTableActive()`

**Promociones** (`/admin/promociones`)
- Component: `PromotionsManager.tsx`
- CRUD completo: crear, editar, eliminar ofertas
- Campos: título, descripción, descuento_text, descuento_%, fechas de validez
- Activar/desactivar promoción
- Indicador de estado: Activa / Próxima / Expirada / Desactivada
- Acción: `savePromotion()`, `deletePromotion()`, `togglePromotionActive()`

### 10.5 Traducciones EN/FR/DE — Auto-traducción

**Migración 0003:** Añadió columnas `name_fr`, `name_de`, `description_fr`, `description_de` a products y categories.

**Diccionario local** (`src/lib/menu-translations.ts`):
- Clave = nombre en español (ej: "Tomahawk")
- Valor = objeto con { en, fr, de }
- Cubre ~90 productos y 20 categorías

**Auto-traducción al guardar:**
- Cuando el dueño crea/edita un plato en el panel, se llama a `translateMenuItem()` vía Claude Haiku
- Las traducciones se guardan en `products.name_en/fr/de`, `products.description_en/fr/de`
- Prioridad: columna BD → diccionario local → español

**Ejemplo:** Dueño escribe "Croquetas de choco" → Claude genera automáticamente:
- EN: "Cuttlefish Croquettes"
- FR: "Croquettes de Seiche"
- DE: "Tintenfisch-Kroketten"

### 10.6 Acceso a Supabase desde Claude

**Token de Supabase:** `SUPABASE_ACCESS_TOKEN` en `.env.local` (cuenta secundaria).

**Management API:**
```
POST https://api.supabase.com/v1/projects/kckmmdntgogmjcfbyixp/database/query
Authorization: Bearer $TOKEN
Content-Type: application/json
{"query": "...SQL..."}
```

Esto permitió crear las migraciones (0003, 0004, 0005) y poblar traducciones directamente desde Claude, sin pasar por el SQL Editor de Supabase.

## 12. Sesión 9 julio 2026 — Resumen de Trabajo Completado

### Traducciones y Auto-traducción
- ✅ Migración 0003: Columnas FR/DE en BD
- ✅ Diccionario local: 90 productos + 20 categorías (clave = español)
- ✅ Auto-traducción: al crear/editar plato, Claude-haiku genera EN/FR/DE automáticamente
- ✅ Prioridad: BD → diccionario → español

### Sistema de Operaciones del Chatbot
- ✅ Migración 0004: chatbot_config (business_instructions editable)
- ✅ Migración 0005: tables, promotions, extensiones de customers/reservations
- ✅ Triggers automáticos para estadísticas de cliente
- ✅ Tool use: 4 herramientas (disponibilidad, promociones, info cliente, propuesta reserva)
- ✅ API `/api/chat` completa: Claude invoca tools automáticamente

### Panel Admin Ampliado
- ✅ Módulo "Mesas" (CRUD completo)
- ✅ Módulo "Promociones" (CRUD completo)
- ✅ 8 módulos totales en el panel

### Infraestructura
- ✅ Acceso a Supabase vía Management API (token en .env.local)
- ✅ 3 migraciones aplicadas y verificadas
- ✅ Deploy a Vercel (https://las-tres-carabelas-eta.vercel.app)

---

## 13. Próximos Pasos (por prioridad)

### Inmediatos (próxima sesión)
1. **UI de Asistencia en Reservas**
   - Agregar columna "Asistencia" (dropdown: Pendiente/Asistió/No vino)
   - Llama `setReservationAttendance(id, true/false/null)`
   - Integración visual con stats del cliente

2. **Stats en Ficha de Cliente**
   - Mostrar "X reservas, Y asistidas (Z% fidelidad)" en verde si > 80%
   - Mostrar "N no-shows" en rojo si > 20%
   - Indicador visual de "cliente problemático" si mucho no-show

### Mediatos (1-2 semanas)
3. **Conexión WhatsApp Business API**
   - Webhook de Meta → `/api/chat`
   - Leer/enviar mensajes a través de WhatsApp, no solo widget web
   - Testear con cuenta de prueba

4. **Mejorar Diálogo del Bot**
   - Captura interactiva de datos (nombre → fecha → hora → personas)
   - Confirmación antes de proponer
   - Resumen de la propuesta al cliente

### Opcionales (cuando haya tiempo)
5. Fotos de productos (UI de subida a Supabase Storage)
6. UI de alérgenos por producto (edición desde panel)
7. Activar login (ADMIN_AUTH_DISABLED=false + Auth real)
8. Generar QR con URL pública para mesas
9. Migrar Supabase a cuenta principal

---

**Notas operativas:**
- `npm run build` siempre limpio, sin type errors
- Vercel auto-deploy activo (cada push a main → deploy automático)
- Supabase token en `.env.local` (NO committed a git)
- Claude Code puede operar BD vía Management API cuando sea necesario

---

*Documento de contexto para retomar el trabajo en cualquier sesión futura de Claude Code. Leer hasta la sección 12. El CLAUDE.md general de Proemote está en `01-Proemote-Studio/proemote-landing/`.*
