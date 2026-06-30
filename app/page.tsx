"use client";

import Link from "next/link";
import { useAppStore, todayISO } from "@/lib/store";
import { macrosForDiaryDate } from "@/lib/calc";
import { MacroRing } from "@/components/MacroRing";
import { Card, SectionTitle, Button } from "@/components/ui";
import { Dumbbell, UtensilsCrossed, ArrowRight, UserCircle } from "lucide-react";

export default function DashboardPage() {
  const { diary, foods, goals, workoutLogs, routines, profile } = useAppStore();
  const today = todayISO();
  const consumed = macrosForDiaryDate(diary, foods, today);

  const todaysWorkout = workoutLogs.find((w) => w.date === today);
  const lastLogs = workoutLogs.slice(0, 3);

  const dateLabel = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <span className="text-coral text-xs font-semibold tracking-widest uppercase">
          {dateLabel}
        </span>
        <h1 className="display-text text-3xl md:text-4xl font-extrabold text-paper mt-1">
          Painel do dia
        </h1>
      </div>

      {!profile && (
        <Card className="flex items-center justify-between gap-3 !border-coral/40">
          <div className="flex items-center gap-3">
            <UserCircle size={22} className="text-coral shrink-0" />
            <p className="text-sm text-paper">
              Complete seu perfil para calcularmos metas de calorias/macros personalizadas.
            </p>
          </div>
          <Link href="/perfil" className="shrink-0">
            <Button className="!py-1.5 text-xs whitespace-nowrap">Completar perfil</Button>
          </Link>
        </Card>
      )}

      <Card className="flex flex-col items-center py-8">
        <MacroRing consumed={consumed} goals={goals} size={220} />
        <Link href="/diario" className="mt-6">
          <Button>Registrar alimento</Button>
        </Link>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <SectionTitle eyebrow="Hoje">Treino</SectionTitle>
            <Dumbbell size={20} className="text-coral" />
          </div>
          {todaysWorkout ? (
            <p className="text-paper">
              Treino registrado: <span className="font-semibold">{todaysWorkout.dayName}</span>
            </p>
          ) : routines.length > 0 ? (
            <p className="text-paper-dim text-sm">
              Você ainda não registrou um treino hoje.
            </p>
          ) : (
            <p className="text-paper-dim text-sm">Nenhuma rotina criada ainda.</p>
          )}
          <Link href="/treinos" className="inline-flex items-center gap-1 text-sm text-coral mt-4 font-medium">
            Ir para treinos <ArrowRight size={14} />
          </Link>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <SectionTitle eyebrow="Planejamento">Dietas</SectionTitle>
            <UtensilsCrossed size={20} className="text-coral" />
          </div>
          <p className="text-paper-dim text-sm">
            Monte planos de refeições e jogue direto no diário do dia.
          </p>
          <Link href="/dietas" className="inline-flex items-center gap-1 text-sm text-coral mt-4 font-medium">
            Ir para dietas <ArrowRight size={14} />
          </Link>
        </Card>
      </div>

      {lastLogs.length > 0 && (
        <div>
          <SectionTitle eyebrow="Histórico">Últimos treinos</SectionTitle>
          <div className="flex flex-col gap-2">
            {lastLogs.map((log) => (
              <Card key={log.id} className="flex justify-between items-center py-3">
                <div>
                  <p className="text-paper font-medium">{log.dayName}</p>
                  <p className="text-paper-dim text-xs tabular">
                    {new Date(log.date + "T00:00:00").toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <span className="text-paper-dim text-xs">
                  {log.exercises.length} exercício{log.exercises.length !== 1 ? "s" : ""}
                </span>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
