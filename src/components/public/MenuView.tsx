"use client";

import { useMemo, useState } from "react";
import type { MenuSection, Product } from "@/lib/types";
import { dict, catName, prodName, prodDesc, LANGS, type Lang } from "@/lib/i18n";
import { ALLERGENS, allergenLabel } from "@/lib/allergens";
import Waves from "./Waves";
import { Ship, ArrowUp } from "lucide-react";

const fmt = (n: number) =>
  new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n) + " €";

function PriceTag({ p, lang }: { p: Product; lang: Lang }) {
  const t = dict[lang];
  switch (p.price_type) {
    case "single":
      return <span className="font-semibold text-wood-dark whitespace-nowrap">{p.price != null ? fmt(p.price) : "—"}</span>;
    case "double":
      return (
        <span className="flex flex-col items-end leading-tight whitespace-nowrap">
          {p.price_tapa != null && (
            <span className="text-sm">
              <span className="text-wood/70 text-xs mr-1.5">{t.tapas}</span>
              <span className="font-semibold text-wood-dark">{fmt(p.price_tapa)}</span>
            </span>
          )}
          {p.price_plato != null && (
            <span className="text-sm">
              <span className="text-wood/70 text-xs mr-1.5">{t.platos}</span>
              <span className="font-semibold text-wood-dark">{fmt(p.price_plato)}</span>
            </span>
          )}
        </span>
      );
    case "per_unit":
      return (
        <span className="font-semibold text-wood-dark whitespace-nowrap">
          {p.price_unit != null ? fmt(p.price_unit) : "—"}
          <span className="text-xs font-normal text-wood/70">/{t.per_unit}</span>
        </span>
      );
    case "no_price":
      return (
        <span
          className="text-xs font-medium tracking-wide uppercase text-teja border border-teja/40 rounded-full px-2 py-0.5 whitespace-nowrap"
          title={t.ask_price}
        >
          {lang === "es" ? "S/P" : t.ask_price}
        </span>
      );
  }
}

function ProductRow({ p, lang }: { p: Product; lang: Lang }) {
  const t = dict[lang];
  const unavailable = !p.is_available;
  return (
    <li
      className={`flex items-start justify-between gap-3 py-2.5 ${
        unavailable ? "opacity-50" : ""
      }`}
    >
      <div className="min-w-0">
        <p
          className={`font-medium leading-snug ${
            unavailable ? "line-through decoration-teja/60" : ""
          }`}
        >
          {prodName(p, lang)}
          {unavailable && (
            <span className="ml-2 inline-block text-[10px] uppercase tracking-wider font-semibold text-cream bg-teja rounded-full px-2 py-0.5 align-middle no-underline">
              {t.sold_out}
            </span>
          )}
        </p>
        {prodDesc(p, lang) && (
          <p className="text-sm text-wood/80 leading-snug mt-0.5">
            {prodDesc(p, lang)}
          </p>
        )}
        {p.allergens.length > 0 && (
          <p className="mt-1 flex gap-1 text-xs" aria-label="alérgenos">
            {p.allergens.map((a) => {
              const info = ALLERGENS.find((x) => x.id === a);
              return info ? (
                <span key={a} title={allergenLabel(info, lang)}>
                  {info.emoji}
                </span>
              ) : null;
            })}
          </p>
        )}
      </div>
      <PriceTag p={p} lang={lang} />
    </li>
  );
}

export default function MenuView({ sections }: { sections: MenuSection[] }) {
  const [lang, setLang] = useState<Lang>("es");
  const t = dict[lang];

  const navItems = useMemo(
    () =>
      sections.map((s) => ({
        id: s.category.slug,
        label: catName(s.category, lang),
      })),
    [sections, lang]
  );

  return (
    <div className="min-h-dvh bg-sand paper-texture">
      {/* ===== Cabecera de marca ===== */}
      <header className="relative bg-wood-dark text-cream overflow-hidden">
        <div className="max-w-2xl mx-auto px-6 pt-10 pb-16 text-center relative z-10">
          <p className="text-[11px] tracking-[0.35em] uppercase text-gold-soft mb-1">
            Bodega
          </p>
          <h1 className="font-script text-5xl sm:text-6xl leading-tight text-cream">
            Las Tres Carabelas
          </h1>
          <div className="mt-3 flex items-center justify-center gap-3 text-gold-soft/80">
            <span className="h-px w-10 bg-gold-soft/50" />
            <Ship className="w-5 h-5" strokeWidth={1.5} />
            <span className="h-px w-10 bg-gold-soft/50" />
          </div>
          <p className="mt-3 font-script text-2xl text-gold-soft">
            {t.menu_title}
          </p>

          {/* Selector de idioma */}
          <div className="absolute top-4 right-4 flex rounded-full border border-cream/25 overflow-hidden text-xs font-medium">
            {LANGS.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1.5 uppercase tracking-wide transition-colors ${
                  lang === l
                    ? "bg-teja text-cream"
                    : "text-cream/70 hover:text-cream"
                }`}
                aria-pressed={lang === l}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <Waves className="absolute bottom-0 left-0 w-full h-8 text-sand" />
      </header>

      {/* ===== Navegación de categorías (sticky) ===== */}
      <nav className="sticky top-0 z-20 bg-sand/95 backdrop-blur border-b border-wood/15 shadow-sm">
        <div className="max-w-2xl mx-auto overflow-x-auto no-scrollbar">
          <ul className="flex gap-2 px-4 py-3 w-max">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="block whitespace-nowrap rounded-full border border-wood/25 bg-cream px-4 py-1.5 text-sm font-medium text-wood-dark hover:bg-teja hover:text-cream hover:border-teja transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ===== Secciones de la carta ===== */}
      <main className="max-w-2xl mx-auto px-5 pb-10">
        {sections.map((section) => (
          <section
            key={section.category.id}
            id={section.category.slug}
            className="pt-10 scroll-mt-16"
          >
            <div className="text-center mb-4">
              <h2 className="font-script text-4xl text-teja">
                {catName(section.category, lang)}
              </h2>
              <div className="mt-1 mx-auto h-px w-24 bg-gold" />
            </div>

            {section.products.length > 0 && (
              <ul className="divide-y divide-wood/10 bg-cream/70 rounded-2xl px-5 py-2 shadow-sm border border-wood/10">
                {section.products.map((p) => (
                  <ProductRow key={p.id} p={p} lang={lang} />
                ))}
              </ul>
            )}

            {/* Subcategorías (bebidas, vinos) */}
            {section.children.map((child) => (
              <div key={child.category.id} className="mt-6">
                <h3 className="font-script text-2xl text-wood-dark text-center mb-2">
                  {catName(child.category, lang)}
                </h3>
                <ul className="divide-y divide-wood/10 bg-cream/70 rounded-2xl px-5 py-2 shadow-sm border border-wood/10">
                  {child.products.map((p) => (
                    <ProductRow key={p.id} p={p} lang={lang} />
                  ))}
                </ul>
              </div>
            ))}
          </section>
        ))}

        {/* ===== Pie: sin gluten + alérgenos ===== */}
        <footer className="mt-14 text-center">
          <p className="font-semibold text-sm text-wood-dark uppercase tracking-wide">
            {t.gluten_free}
          </p>
          <p className="mt-3 text-[11px] leading-relaxed text-wood/80 max-w-md mx-auto">
            {t.allergen_note}
          </p>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-wood-dark mb-3">
              {t.allergen_title}
            </p>
            <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 max-w-lg mx-auto">
              {ALLERGENS.map((a) => (
                <li key={a.id} className="flex items-center gap-1 text-[10px] text-wood">
                  <span className="text-base leading-none">{a.emoji}</span>
                  <span>{allergenLabel(a, lang)}</span>
                </li>
              ))}
            </ul>
          </div>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="mt-8 inline-flex items-center gap-1.5 text-xs text-teja font-medium"
          >
            <ArrowUp className="w-3.5 h-3.5" /> {t.back_to_top}
          </a>
        </footer>
      </main>

      {/* Cierre con olas */}
      <div className="mt-6 bg-wood-dark">
        <Waves className="w-full h-8 text-sand rotate-180" />
        <p className="text-center text-cream/60 text-[11px] py-4 font-script text-lg">
          Bodega Las Tres Carabelas
        </p>
      </div>
    </div>
  );
}
