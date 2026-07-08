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

## 10. Pendiente (próximos pasos)

1. ~~**Deploy en Vercel**~~ ✅ HECHO (8 jul 2026) — deploy directo con Vercel CLI (sin GitHub; repo git solo local). Las 4 env vars están en Vercel (Production). Para redeployar: `vercel deploy --prod --yes` desde la raíz del proyecto.
   - URL pública: **https://las-tres-carabelas-eta.vercel.app** · Panel: `/admin`
   - Pendiente: generar **QR** con la URL pública para las mesas. Opcional: conectar repo a GitHub para deploys automáticos.
2. Fotos de productos (columna `image_url` ya existe; UI de subida a Supabase Storage sin hacer).
3. ~~Traducciones EN de productos~~ ✅ HECHO vía diccionario en código (EN/FR/DE, ver sección 8). Opcional a futuro: migrar el diccionario a columnas de BD (`name_fr`, `name_de`…) cuando haya acceso al SQL Editor, para que sobreviva a renombrados desde el panel.
4. Asignar alérgenos por producto desde el panel (columna `allergens text[]` existe; falta UI de edición — en la carta pública ya se renderizan si existen).
5. Activar login (ver sección 8).
6. Conectar chatbot a WhatsApp Business API (Meta/Twilio) — fase posterior.
7. Considerar migrar el proyecto Supabase a la cuenta principal cuando haya hueco/plan.

---

## 11. Arquitectura del chatbot (9 julio 2026)

**Motor:** Claude Haiku + system prompt dinámico que incluye:
- Tabla `chatbot_config` con `business_instructions` (horario, dirección, política de reservas, etc.)
- Carta completa desde Supabase (nombres + descripciones)
- Instrucciones de comportamiento en 4 idiomas (ES/EN/FR/DE)

**Flujo de un mensaje:**
1. Usuario escribe en widget `ChatWidget.tsx` (client component, flotante en carta pública)
2. POST `/api/chat` con `{message, lang, conversation_id, customer_phone}`
3. Servidor carga `chatbotSystemPrompt(lang)` = `business_instructions` + carta + reglas
4. Claude genera respuesta en 1-2 líneas (max_tokens: 300)
5. Guarda usuario + bot en `chatbot_messages`, crea/actualiza `chatbot_conversations`
6. Deja el widget con historial persistente durante la sesión

**Configuración (panel):**
- Panel → Chatbot → **Configuración**
- Textarea de `business_instructions` (con template prerellenado)
- Toggle "Chatbot activo" para mostrar/ocultar widget en la carta

**Próximos pasos:**
- WhatsApp Business API: conectar webhook de Meta al `/api/chat` para que los mensajes vengan de WhatsApp
- Crear reservas desde chat (request name/date/time/party_size y guardar en `reservations` con `source='chatbot'`)
- Traduir system prompt a EN/FR/DE (ahora solo `chatbotSystemPrompt('es')` está completo)
- Panel para ver estadísticas del bot (msg/día, tasa de resolución manual, etc.)

---

*Documento de contexto para retomar el trabajo en cualquier sesión futura de Claude Code. Leer hasta la sección 11. El CLAUDE.md general de Proemote está en `01-Proemote-Studio/proemote-landing/`.*
