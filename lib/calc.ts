import { ActivityLevel, DiaryEntry, FoodItem, Goal, Macros, UserProfile, emptyMacros, scaleMacros, sumMacros } from "./types";

const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  sedentario: 1.2,
  leve: 1.375,
  moderado: 1.55,
  ativo: 1.725,
  muito_ativo: 1.9,
};

const GOAL_KCAL_ADJUSTMENT: Record<Goal, number> = {
  perder_peso: -500,
  manter_peso: 0,
  ganhar_massa: 350,
};

const GOAL_PROTEIN_PER_KG: Record<Goal, number> = {
  perder_peso: 2.2,
  manter_peso: 1.8,
  ganhar_massa: 2.0,
};

export function calcBMR(profile: UserProfile): number {
  const base = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age;
  return profile.sex === "M" ? base + 5 : base - 161;
}

export function calcTDEE(profile: UserProfile): number {
  return calcBMR(profile) * ACTIVITY_FACTORS[profile.activityLevel];
}

export function calcSuggestedGoals(profile: UserProfile): Macros {
  const tdee = calcTDEE(profile);
  const kcal = Math.max(1200, tdee + GOAL_KCAL_ADJUSTMENT[profile.goal]);

  const protein = profile.weightKg * GOAL_PROTEIN_PER_KG[profile.goal];
  const fat = (kcal * 0.25) / 9;
  const proteinKcal = protein * 4;
  const fatKcal = fat * 9;
  const carbs = Math.max(0, (kcal - proteinKcal - fatKcal) / 4);

  return {
    kcal: Math.round(kcal),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
  };
}

export function macrosForFood(food: FoodItem, quantityUnits: number): Macros {
  // quantityUnits = quantas vezes a referência `per` (ex: 1.5x de 100g)
  return scaleMacros(food.macros, quantityUnits);
}

export function macrosForDiaryDate(diary: DiaryEntry[], foods: FoodItem[], date: string): Macros {
  const entries = diary.filter((e) => e.date === date);
  return entries.reduce((acc, entry) => {
    const food = foods.find((f) => f.id === entry.foodId);
    if (!food) return acc;
    return sumMacros(acc, macrosForFood(food, entry.quantity));
  }, emptyMacros());
}

export function groupDiaryByMeal(diary: DiaryEntry[], date: string) {
  const entries = diary.filter((e) => e.date === date);
  const groups: Record<string, DiaryEntry[]> = {};
  entries.forEach((e) => {
    if (!groups[e.mealName]) groups[e.mealName] = [];
    groups[e.mealName].push(e);
  });
  return groups;
}

export function pct(value: number, goal: number) {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((value / goal) * 100));
}

export function round1(n: number) {
  return Math.round(n * 10) / 10;
}
