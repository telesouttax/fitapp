"use client";

import { Goals, Macros } from "@/lib/types";
import { pct, round1 } from "@/lib/calc";

type Props = {
  consumed: Macros;
  goals: Goals;
  size?: number;
};

const RADIUS = 70;
const STROKE = 12;
const CIRC = 2 * Math.PI * RADIUS;

export function MacroRing({ consumed, goals, size = 200 }: Props) {
  const kcalPct = pct(consumed.kcal, goals.kcal);
  const remaining = Math.max(0, goals.kcal - consumed.kcal);
  const dash = (kcalPct / 100) * CIRC;

  const bars: { label: string; value: number; goal: number; color: string }[] = [
    { label: "Proteína", value: consumed.protein, goal: goals.protein, color: "#8FB996" },
    { label: "Carbo", value: consumed.carbs, goal: goals.carbs, color: "#E8B86D" },
    { label: "Gordura", value: consumed.fat, goal: goals.fat, color: "#FF6B4A" },
  ];

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 160 160" className="-rotate-90" width={size} height={size}>
          <circle cx="80" cy="80" r={RADIUS} fill="none" stroke="#2A2F38" strokeWidth={STROKE} />
          <circle
            cx="80"
            cy="80"
            r={RADIUS}
            fill="none"
            stroke="#FF6B4A"
            strokeWidth={STROKE}
            strokeDasharray={`${dash} ${CIRC}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="tabular text-3xl font-bold text-paper">{Math.round(consumed.kcal)}</span>
          <span className="text-xs text-paper-dim mt-0.5">de {Math.round(goals.kcal)} kcal</span>
          <span className="text-[11px] text-sage mt-2">
            {remaining > 0 ? `${Math.round(remaining)} kcal restantes` : "Meta atingida"}
          </span>
        </div>
      </div>

      <div className="w-full max-w-[280px] flex flex-col gap-3">
        {bars.map((b) => (
          <div key={b.label} className="flex flex-col gap-1">
            <div className="flex justify-between text-xs">
              <span className="text-paper-dim">{b.label}</span>
              <span className="tabular text-paper-dim">
                {round1(b.value)}g / {round1(b.goal)}g
              </span>
            </div>
            <div className="h-2 rounded-full bg-ink-line overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${pct(b.value, b.goal)}%`,
                  backgroundColor: b.color,
                  transition: "width 0.6s ease",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
