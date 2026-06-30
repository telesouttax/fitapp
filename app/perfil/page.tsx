"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card, SectionTitle, Button, Input, Select } from "@/components/ui";
import { calcSuggestedGoals, calcTDEE } from "@/lib/calc";
import { ActivityLevel, ExperienceLevel, Goal, UserProfile } from "@/lib/types";
import { Check, Sparkles } from "lucide-react";

const activityLabels: Record<ActivityLevel, string> = {
  sedentario: "Sedentário (pouco ou nenhum exercício)",
  leve: "Leve (exercício leve, 1–3x/semana)",
  moderado: "Moderado (exercício moderado, 3–5x/semana)",
  ativo: "Ativo (exercício intenso, 6–7x/semana)",
  muito_ativo: "Muito ativo (exercício intenso + trabalho físico)",
};

const goalLabels: Record<Goal, string> = {
  perder_peso: "Perder peso",
  manter_peso: "Manter peso",
  ganhar_massa: "Ganhar massa muscular",
};

const experienceLabels: Record<ExperienceLevel, string> = {
  iniciante: "Iniciante (até 6 meses de treino)",
  intermediario: "Intermediário (6 meses a 2 anos)",
  avancado: "Avançado (mais de 2 anos)",
};

const defaultProfile: UserProfile = {
  name: "",
  age: 30,
  sex: "M",
  weightKg: 80,
  heightCm: 175,
  activityLevel: "moderado",
  goal: "manter_peso",
  experienceLevel: "iniciante",
};

export default function PerfilPage() {
  const store = useAppStore();
  const savedProfile = useAppStore((s) => s.profile);
  const [form, setForm] = useState<UserProfile>(savedProfile ?? defaultProfile);
  const [savedFlag, setSavedFlag] = useState(false);

  const [goalsForm, setGoalsForm] = useState(useAppStore.getState().goals);
  const [goalsSavedFlag, setGoalsSavedFlag] = useState(false);
  const [appliedFlag, setAppliedFlag] = useState(false);

  function handleSaveProfile() {
    store.setProfile(form);
    setSavedFlag(true);
    setTimeout(() => setSavedFlag(false), 1800);
  }

  function handleApplySuggested() {
    const suggested = calcSuggestedGoals(form);
    setGoalsForm(suggested);
    store.setGoals(suggested);
    setAppliedFlag(true);
    setTimeout(() => setAppliedFlag(false), 2200);
  }

  function handleSaveGoals() {
    store.setGoals(goalsForm);
    setGoalsSavedFlag(true);
    setTimeout(() => setGoalsSavedFlag(false), 1800);
  }

  const tdee = calcTDEE(form);
  const proteinKcal = goalsForm.protein * 4;
  const carbsKcal = goalsForm.carbs * 4;
  const fatKcal = goalsForm.fat * 9;
  const sumKcal = proteinKcal + carbsKcal + fatKcal;
  const diff = goalsForm.kcal - sumKcal;

  return (
    <div className="flex flex-col gap-8 max-w-lg">
      <div>
        <span className="text-coral text-xs font-semibold tracking-widest uppercase">Perfil</span>
        <h1 className="display-text text-3xl md:text-4xl font-extrabold text-paper mt-1">
          Seus dados
        </h1>
        <p className="text-paper-dim text-sm mt-2">
          Preencha seus dados pra calcularmos suas metas de calorias/macros e ajustarmos as recomendações de
          treino ao seu objetivo.
        </p>
      </div>

      <Card className="flex flex-col gap-4">
        <SectionTitle eyebrow="Dados pessoais">Quem é você</SectionTitle>

        <Field label="Nome">
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Seu nome" />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Idade">
            <Input
              type="number"
              min={10}
              max={100}
              value={form.age}
              onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
              className="tabular"
            />
          </Field>
          <Field label="Sexo biológico">
            <Select value={form.sex} onChange={(e) => setForm({ ...form, sex: e.target.value as "M" | "F" })}>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Peso (kg)">
            <Input
              type="number"
              min={30}
              max={300}
              step={0.1}
              value={form.weightKg}
              onChange={(e) => setForm({ ...form, weightKg: Number(e.target.value) })}
              className="tabular"
            />
          </Field>
          <Field label="Altura (cm)">
            <Input
              type="number"
              min={100}
              max={250}
              value={form.heightCm}
              onChange={(e) => setForm({ ...form, heightCm: Number(e.target.value) })}
              className="tabular"
            />
          </Field>
        </div>

        <Field label="Nível de atividade física">
          <Select
            value={form.activityLevel}
            onChange={(e) => setForm({ ...form, activityLevel: e.target.value as ActivityLevel })}
          >
            {Object.entries(activityLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </Select>
        </Field>

        <Field label="Objetivo">
          <Select value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value as Goal })}>
            {Object.entries(goalLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </Select>
        </Field>

        <Field label="Experiência com treino">
          <Select
            value={form.experienceLevel}
            onChange={(e) => setForm({ ...form, experienceLevel: e.target.value as ExperienceLevel })}
          >
            {Object.entries(experienceLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </Select>
        </Field>

        <Button onClick={handleSaveProfile} className="self-start">
          {savedFlag ? (
            <span className="flex items-center gap-1.5"><Check size={15} /> Salvo</span>
          ) : (
            "Salvar perfil"
          )}
        </Button>
      </Card>

      <Card className="flex flex-col gap-3">
        <SectionTitle eyebrow="Estimativa">Seu gasto calórico</SectionTitle>
        <p className="text-paper-dim text-sm">
          Com base nos dados acima (fórmula de Mifflin-St Jeor), seu gasto calórico total estimado é de{" "}
          <span className="text-paper font-semibold tabular">{Math.round(tdee)} kcal/dia</span>.
        </p>
        <Button onClick={handleApplySuggested} variant="primary" className="self-start">
          <span className="flex items-center gap-1.5">
            <Sparkles size={15} /> {appliedFlag ? "Metas aplicadas!" : "Calcular e aplicar metas sugeridas"}
          </span>
        </Button>
        <p className="text-[11px] text-paper-dim">
          Estimativa geral, não substitui orientação de nutricionista ou médico — principalmente se você tiver
          alguma condição de saúde específica.
        </p>
      </Card>

      <Card className="flex flex-col gap-4">
        <SectionTitle eyebrow="Metas diárias">Calorias e macros</SectionTitle>

        <Field label="Calorias (kcal)">
          <Input
            type="number"
            value={goalsForm.kcal}
            onChange={(e) => setGoalsForm({ ...goalsForm, kcal: Number(e.target.value) })}
            className="tabular"
          />
        </Field>
        <Field label="Proteína (g)">
          <Input
            type="number"
            value={goalsForm.protein}
            onChange={(e) => setGoalsForm({ ...goalsForm, protein: Number(e.target.value) })}
            className="tabular"
          />
        </Field>
        <Field label="Carboidrato (g)">
          <Input
            type="number"
            value={goalsForm.carbs}
            onChange={(e) => setGoalsForm({ ...goalsForm, carbs: Number(e.target.value) })}
            className="tabular"
          />
        </Field>
        <Field label="Gordura (g)">
          <Input
            type="number"
            value={goalsForm.fat}
            onChange={(e) => setGoalsForm({ ...goalsForm, fat: Number(e.target.value) })}
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

        <Button onClick={handleSaveGoals} className="self-start">
          {goalsSavedFlag ? (
            <span className="flex items-center gap-1.5"><Check size={15} /> Salvo</span>
          ) : (
            "Salvar metas manualmente"
          )}
        </Button>
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
