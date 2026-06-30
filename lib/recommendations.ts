import { ExperienceLevel, Goal, UserProfile } from "./types";

const goalFocus: Record<Goal, { reps: string; note: string }> = {
  perder_peso: {
    reps: "10–15 repetições",
    note: "priorize manter a massa magra com cargas moderadas e inclua cardio complementar",
  },
  manter_peso: {
    reps: "8–12 repetições",
    note: "equilíbrio entre força e hipertrofia, sem necessidade de cardio extra",
  },
  ganhar_massa: {
    reps: "6–12 repetições",
    note: "priorize progressão de carga (sobrecarga progressiva) e descanso adequado entre séries",
  },
};

const experienceSplit: Record<ExperienceLevel, { frequency: string; split: string; sets: string }> = {
  iniciante: {
    frequency: "3x por semana",
    split: "Treino full body (corpo inteiro) em cada sessão",
    sets: "2–3 séries por exercício, foco em aprender a técnica",
  },
  intermediario: {
    frequency: "4x por semana",
    split: "Divisão upper/lower ou ABC (ex: Peito/Tríceps, Costas/Bíceps, Pernas/Ombro)",
    sets: "3–4 séries por exercício",
  },
  avancado: {
    frequency: "5–6x por semana",
    split: "Divisão por grupo muscular (ex: ABCDE) ou push/pull/legs 2x na semana",
    sets: "4–5 séries por exercício, pode incluir técnicas avançadas (drop set, rest-pause)",
  },
};

export function getWorkoutRecommendation(profile: UserProfile) {
  const goal = goalFocus[profile.goal];
  const exp = experienceSplit[profile.experienceLevel];
  return {
    frequency: exp.frequency,
    split: exp.split,
    sets: exp.sets,
    reps: goal.reps,
    note: goal.note,
  };
}
