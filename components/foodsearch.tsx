"use client";

import { useEffect, useState } from "react";
import { Input } from "./ui";
import { Search, Plus, Loader2 } from "lucide-react";
import { useDebounce } from "@/lib/useDebounce";
import { searchOpenFoodFacts, OFFProduct } from "@/lib/api/openFoodFacts";

export function FoodSearch({ onPick }: { onPick: (p: OFFProduct) => void }) {
  const [term, setTerm] = useState("");
  const debounced = useDebounce(term, 500);
  const [results, setResults] = useState<OFFProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!debounced.trim()) {
      setResults([]);
      setError(null);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    searchOpenFoodFacts(debounced, controller.signal)
      .then((r) => setResults(r))
      .catch((e) => {
        if (e?.name !== "AbortError") setError("Não foi possível buscar agora. Tente de novo em alguns segundos.");
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [debounced]);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-paper-dim" />
        <Input
          placeholder="Buscar produto industrializado (Open Food Facts)..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="pl-9 w-full"
        />
        {loading && (
          <Loader2 size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-paper-dim animate-spin" />
        )}
      </div>

      {error && <p className="text-coral text-xs">{error}</p>}

      {!loading && !error && debounced.trim() && results.length === 0 && (
        <p className="text-paper-dim text-xs">Nenhum produto encontrado.</p>
      )}

      {results.length > 0 && (
        <div className="flex flex-col max-h-64 overflow-y-auto border border-ink-line rounded-md">
          {results.map((p) => (
            <button
              key={p.id}
              onClick={() => onPick(p)}
              className="flex items-center justify-between gap-2 px-3 py-2 hover:bg-ink-line/40 text-left border-b border-ink-line last:border-0"
            >
              <div className="min-w-0">
                <p className="text-sm text-paper truncate">{p.name}</p>
                <p className="text-xs text-paper-dim truncate">
                  {p.brand ? `${p.brand} · ` : ""}
                  {Math.round(p.macros.kcal)} kcal/100g
                </p>
              </div>
              <Plus size={14} className="text-coral shrink-0" />
            </button>
          ))}
        </div>
      )}

      <p className="text-[11px] text-paper-dim">
        Dados de produtos via Open Food Facts, banco aberto e colaborativo.
      </p>
    </div>
  );
}
