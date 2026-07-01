import { DietPlan, FoodCategory, FoodItem } from "./types";

export type ShoppingListItem = {
  foodId: string;
  name: string;
  category: FoodCategory;
  totalAmount: number; // em gramas ou ml
  unit: "g" | "ml";
  portionCount: number; // soma dos multiplicadores de porção (quantity) usados na dieta
  unitLabel: string;
};

export function generateShoppingList(diet: DietPlan, foods: FoodItem[], days = 1): ShoppingListItem[] {
  const totals = new Map<string, number>();

  diet.meals.forEach((meal) => {
    meal.items.forEach((item) => {
      totals.set(item.foodId, (totals.get(item.foodId) ?? 0) + item.quantity);
    });
  });

  const list: ShoppingListItem[] = [];
  totals.forEach((qty, foodId) => {
    const food = foods.find((f) => f.id === foodId);
    if (!food) return;
    const totalQty = qty * days;
    list.push({
      foodId,
      name: food.name,
      category: food.category ?? "alimento",
      totalAmount: totalQty * food.per,
      unit: food.unitLabel.toLowerCase().includes("ml") ? "ml" : "g",
      portionCount: totalQty,
      unitLabel: food.unitLabel,
    });
  });

  return list.sort((a, b) => {
    if (a.category !== b.category) return a.category === "alimento" ? -1 : 1;
    return a.name.localeCompare(b.name, "pt-BR");
  });
}

export function formatAmount(amount: number, unit: "g" | "ml"): string {
  if (amount >= 1000) {
    const kg = amount / 1000;
    return `${kg % 1 === 0 ? kg : kg.toFixed(1)}${unit === "g" ? "kg" : "L"}`;
  }
  return `${Math.round(amount)}${unit}`;
}
