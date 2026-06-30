"use client";

import { useState } from "react";
import { Button } from "./ui";
import { Loader2, ImageIcon } from "lucide-react";
import { searchExerciseDemo } from "@/lib/api/wger";

export function ExerciseDemoButton({ exerciseName }: { exerciseName: string }) {
  const [loading, setLoading] = useState(false);
  const [tried, setTried] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  async function handleClick() {
    if (tried) return;
    setLoading(true);
    setTried(true);
    const demo = await searchExerciseDemo(exerciseName);
    setImageUrl(demo?.imageUrl ?? null);
    setLoading(false);
  }

  return (
    <div className="mt-2">
      {!tried && (
        <Button variant="ghost" className="!py-1 !px-2 text-xs" onClick={handleClick}>
          <span className="flex items-center gap-1">
            <ImageIcon size={13} /> Ver demonstração
          </span>
        </Button>
      )}

      {loading && (
        <p className="flex items-center gap-1.5 text-xs text-paper-dim mt-1">
          <Loader2 size={13} className="animate-spin" /> Buscando demonstração...
        </p>
      )}

      {!loading && tried && imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={`Demonstração: ${exerciseName}`}
          className="mt-2 rounded-md border border-ink-line max-h-40 max-w-full"
        />
      )}

      {!loading && tried && !imageUrl && (
        <p className="text-xs text-paper-dim mt-1">
          Demonstração não encontrada para este exercício no banco wger.
        </p>
      )}
    </div>
  );
}
