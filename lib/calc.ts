import { DiaryEntry, FoodItem, Macros, emptyMacros, scaleMacros, sumMacros } from "./types";

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
