import { Database } from "lucide-react";

/** Aviso mostrado cuando Supabase aún no está conectado */
export default function SetupNotice() {
  return (
    <div className="m-6 rounded-2xl border-2 border-dashed border-wood/30 bg-cream p-8 text-center max-w-xl mx-auto mt-16">
      <Database className="w-10 h-10 mx-auto text-wood/50" strokeWidth={1.25} />
      <h2 className="mt-4 font-semibold text-lg text-wood-dark">
        Base de datos sin conectar
      </h2>
      <p className="mt-2 text-sm text-wood/80 leading-relaxed">
        Para usar el panel de gestión hace falta conectar Supabase. Añade{" "}
        <code className="bg-parchment px-1.5 py-0.5 rounded text-xs">
          NEXT_PUBLIC_SUPABASE_URL
        </code>{" "}
        y{" "}
        <code className="bg-parchment px-1.5 py-0.5 rounded text-xs">
          NEXT_PUBLIC_SUPABASE_ANON_KEY
        </code>{" "}
        al archivo <code className="bg-parchment px-1.5 py-0.5 rounded text-xs">.env.local</code>{" "}
        y ejecuta las migraciones de la carpeta{" "}
        <code className="bg-parchment px-1.5 py-0.5 rounded text-xs">supabase/migrations</code>.
      </p>
      <p className="mt-3 text-xs text-wood/60">
        La carta pública funciona mientras tanto con los datos de demostración.
      </p>
    </div>
  );
}
