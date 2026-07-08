"use client";

import { useState } from "react";
import type { GeneratedContent } from "@/lib/types";
import {
  Clapperboard,
  Image as ImageIcon,
  GalleryVertical,
  GalleryHorizontalEnd,
  Users,
  Star,
  Home,
  Megaphone,
  BookOpen,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
} from "lucide-react";

const FORMATS = [
  { id: "reel", label: "Reel", icon: Clapperboard },
  { id: "post", label: "Post de feed", icon: ImageIcon },
  { id: "story", label: "Story individual", icon: GalleryVertical },
  { id: "story_sequence", label: "Secuencia de stories", icon: GalleryHorizontalEnd },
];

const OBJECTIVES = [
  { id: "atraer", label: "Atraer nuevos clientes", icon: Users },
  { id: "producto", label: "Destacar un producto", icon: Star },
  { id: "ambiente", label: "Mostrar el ambiente", icon: Home },
  { id: "oferta", label: "Promocionar una oferta", icon: Megaphone },
  { id: "marca", label: "Marca / storytelling", icon: BookOpen },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      className="flex items-center gap-1 text-xs font-medium text-wood/60 hover:text-teja transition-colors"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" /> Copiado
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" /> Copiar
        </>
      )}
    </button>
  );
}

export default function ContentGenerator() {
  const [format, setFormat] = useState<string | null>(null);
  const [objective, setObjective] = useState<string | null>(null);
  const [context, setContext] = useState("");
  const [proposals, setProposals] = useState<GeneratedContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canGenerate = format && objective && !loading;

  async function generate() {
    if (!canGenerate) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format, objective, context: context.trim() || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error");
      setProposals((prev) => [data.result, ...prev]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo generar el contenido.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-5 md:p-8 max-w-4xl mx-auto">
      <header className="mb-6">
        <h1 className="font-script text-4xl text-wood-dark">
          Generador de contenido ✦
        </h1>
        <p className="text-sm text-wood/70 mt-1">
          Ideas de contenido para redes, hechas a medida de la bodega. Configura
          tu petición en tres pasos.
        </p>
      </header>

      {/* ===== Paso 1: Formato ===== */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-wood/60 mb-2">
          Paso 1 — Formato
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {FORMATS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setFormat(id)}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 px-3 py-4 text-sm font-medium transition-colors ${
                format === id
                  ? "border-teja bg-teja/10 text-teja"
                  : "border-wood/15 bg-cream text-wood-dark hover:border-wood/40"
              }`}
            >
              <Icon className="w-6 h-6" strokeWidth={1.5} />
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* ===== Paso 2: Objetivo ===== */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-wood/60 mb-2">
          Paso 2 — Objetivo
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {OBJECTIVES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setObjective(id)}
              className={`flex items-center gap-2.5 rounded-xl border-2 px-4 py-3 text-sm font-medium text-left transition-colors ${
                objective === id
                  ? "border-teja bg-teja/10 text-teja"
                  : "border-wood/15 bg-cream text-wood-dark hover:border-wood/40"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" strokeWidth={1.5} />
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* ===== Paso 3: Contexto ===== */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-wood/60 mb-2">
          Paso 3 — Contexto (opcional)
        </h2>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          rows={2}
          placeholder='"Esta semana tenemos Tomahawk disponible", "es temporada de almadraba", "queremos presentar la nueva carta de vinos"…'
          className="w-full rounded-xl border border-wood/25 bg-cream px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teja/50"
        />
      </section>

      <button
        onClick={generate}
        disabled={!canGenerate}
        className="w-full md:w-auto flex items-center justify-center gap-2 rounded-xl bg-teja hover:bg-teja-dark text-cream font-semibold px-8 py-3.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <RefreshCw className="w-4.5 h-4.5 animate-spin" /> Generando…
          </>
        ) : (
          <>
            <Sparkles className="w-4.5 h-4.5" />
            {proposals.length > 0 ? "Generar otra propuesta" : "Generar contenido"}
          </>
        )}
      </button>

      {error && (
        <p className="mt-4 text-sm text-teja bg-teja/10 border border-teja/30 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {/* ===== Resultados ===== */}
      <div className="mt-8 space-y-6">
        {proposals.map((p, i) => (
          <article
            key={i}
            className="rounded-2xl bg-cream border border-wood/15 overflow-hidden"
          >
            <div className="bg-wood-dark text-cream px-5 py-3 flex items-center justify-between">
              <p className="text-sm font-semibold">
                Propuesta {proposals.length - i}
              </p>
              <Sparkles className="w-4 h-4 text-gold-soft" />
            </div>
            <div className="p-5 space-y-5">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-teja">
                    Concepto
                  </h3>
                  <CopyButton text={p.concepto} />
                </div>
                <p className="text-sm leading-relaxed">{p.concepto}</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-teja">
                    Guion / estructura
                  </h3>
                  <CopyButton text={p.guion} />
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-line bg-white rounded-lg border border-wood/10 px-4 py-3">
                  {p.guion}
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-teja">
                    Caption
                  </h3>
                  <CopyButton text={p.caption} />
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-line bg-white rounded-lg border border-wood/10 px-4 py-3">
                  {p.caption}
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-teja">
                    Hashtags
                  </h3>
                  <CopyButton text={p.hashtags.join(" ")} />
                </div>
                <p className="text-sm text-wood flex flex-wrap gap-1.5">
                  {p.hashtags.map((h) => (
                    <span
                      key={h}
                      className="bg-parchment rounded-full px-2.5 py-0.5 text-xs"
                    >
                      {h}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
