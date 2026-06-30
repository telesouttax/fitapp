"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card, SectionTitle, Button, Input } from "@/components/ui";
import { Check } from "lucide-react";

export default function ConfiguracoesPage() {
  const store = useAppStore();
  const goals = useAppStore((s) => s.goals);
  const [form, setForm] = useState(goals);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    store.setGoals(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  const proteinKcal = form.protein * 4;
  const carbsKcal = form.carbs * 4;
  const fatKcal = form.fat * 9;
  const sumKcal = proteinKcal + carbsKcal + fatKcal;
  const diff = form.kcal - sumKcal;

  return (
    <div className="flex flex-col gap-8 max-w-lg">
      <div>
        <span className="text-coral text-xs font-semibold tracking-widest uppercase">Configurações</span>
        <h1 className="display-text text-3xl md:text-4xl font-extrabold text-paper mt-1">
          Metas diárias
        </h1>
      </div>

      <Card className="flex flex-col gap-4">
        <Field label="Calorias (kcal)">
          <Input
            type="number"
            value={form.kcal}
            onChange={(e) => setForm({ ...form, kcal: Number(e.target.value) })}
            className="tabular"
          />
        </Field>
        <Field label="Proteína (g)">
          <Input
            type="number"
            value={form.protein}
            onChange={(e) => setForm({ ...form, protein: Number(e.target.value) })}
            className="tabular"
          />
        </Field>
        <Field label="Carboidrato (g)">
          <Input
            type="number"
            value={form.carbs}
            onChange={(e) => setForm({ ...form, carbs: Number(e.target.value) })}
            className="tabular"
          />
        </Field>
        <Field label="Gordura (g)">
          <Input
            type="number"
            value={form.fat}
            onChange={(e) => setForm({ ...form, fat: Number(e.target.value) })}
            className="tabular"
          />
        </Field>

        <div className="border-t border-ink-line pt-3 text-xs text-paper-dim tabular">
          Soma dos macros: {Math.round(sumKcal)} kcal{" "}
          {Math.abs(diff) > 30 && (
            <span className="text-coral">
              ({diff > 0 ? `${Math.round(diff)} kcal abaixo da meta` : `${Math.round(-diff)} kcal acima da meta`})
            </span>
          )}
        </div>

        <Button onClick={handleSave} className="self-start">
          {saved ? (
            <span className="flex items-center gap-1.5"><Check size={15} /> Salvo</span>
          ) : (
            "Salvar metas"
          )}
        </Button>
      </Card>

      <Card className="text-sm text-paper-dim leading-relaxed">
        <SectionTitle eyebrow="Dica">Como calcular suas metas</SectionTitle>
        <p>
          Uma referência comum: defina as calorias totais de acordo com seu objetivo (déficit, manutenção ou
          superávit), depois proteína em torno de 1,6–2,2g por kg de peso corporal, gordura em 20–30% das
          calorias totais, e o restante em carboidratos.
        </p>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-paper-dim font-medium">{label}</span>
      {children}
    </label>
  );
}
