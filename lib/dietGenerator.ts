import { FoodItem, Goals, Macros } from "./types";

// ---------- Modelos de refeição ----------
// Cada refeição combina 1 fonte de proteína + 1 fonte de carboidrato + 1 fonte de gordura
// (as 3 variáveis que resolvemos via sistema linear) + opcionalmente alguns itens fixos
// (legumes/frutas) que entram em quantidade fixa, pra variedade e fibra/micronutrientes.

type MealTemplate = {
  name: string;
  kcalPct: number;
  proteinPct: number;
  carbsPct: number;
  fatPct: number;
  proteinFoodId: string;
  carbFoodId: string;
  fatFoodId: string;
  fixedExtras?: { foodId: string; quantity: number }[];
};

// Percentuais de cada macro por refeição (cada coluna soma 100%).
// Proteína/carbo/gordura não seguem necessariamente o mesmo % que as calorias,
// pra refletir um padrão alimentar mais realista (ex: menos proteína no café da manhã).
const mealTemplates: MealTemplate[] = [
  {
    name: "Café da manhã",
    kcalPct: 0.25,
    proteinPct: 0.2,
    carbsPct: 0.3,
    fatPct: 0.2,
    proteinFoodId: "f-whey",
    carbFoodId: "f-aveia",
    fatFoodId: "f-azeite",
    fixedExtras: [{ foodId: "f-banana", quantity: 1 }],
  },
  {
    name: "Almoço",
    kcalPct: 0.35,
    proteinPct: 0.35,
    carbsPct: 0.35,
    fatPct: 0.3,
    proteinFoodId: "f-frango-peito",
    carbFoodId: "f-arroz-branco",
    fatFoodId: "f-azeite",
    fixedExtras: [
      { foodId: "f-brocolis", quantity: 1 },
      { foodId: "f-feijao-carioca", quantity: 1 },
    ],
  },
  {
    name: "Lanche da tarde",
    kcalPct: 0.15,
    proteinPct: 0.15,
    carbsPct: 0.1,
    fatPct: 0.15,
    proteinFoodId: "f-ovo",
    carbFoodId: "f-pao-integral",
    fatFoodId: "f-abacate",
  },
  {
    name: "Jantar",
    kcalPct: 0.25,
    proteinPct: 0.3,
    carbsPct: 0.25,
    fatPct: 0.35,
    proteinFoodId: "f-tilapia",
    carbFoodId: "f-batata-doce",
    fatFoodId: "f-azeite",
    fixedExtras: [{ foodId: "f-alface", quantity: 1 }],
  },
];

export type GeneratedMealItem = { foodId: string; quantity: number };
export type GeneratedMeal = {
  name: string;
  items: GeneratedMealItem[];
};

function det3(m: number[][]): number {
  return (
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
  );
}

// Resolve o sistema linear 3x3 A*x = b via regra de Cramer.
// A = matriz de macros (linhas: proteína/carbo/gordura, colunas: cada um dos 3 alimentos)
// b = meta restante de macros pra essa refeição
function solve3x3(A: number[][], b: number[]): number[] | null {
  const D = det3(A);
  if (Math.abs(D) < 1e-6) return null;
  const Ax = [
    [b[0], A[0][1], A[0][2]],
    [b[1], A[1][1], A[1][2]],
    [b[2], A[2][1], A[2][2]],
  ];
  const Ay = [
    [A[0][0], b[0], A[0][2]],
    [A[1][0], b[1], A[1][2]],
    [A[2][0], b[2], A[2][2]],
  ];
  const Az = [
    [A[0][0], A[0][1], b[0]],
    [A[1][0], A[1][1], b[1]],
    [A[2][0], A[2][1], b[2]],
  ];
  return [det3(Ax) / D, det3(Ay) / D, det3(Az) / D];
}

function roundQty(x: number): number {
  // arredonda pra múltiplos de 0.25 (mesma granularidade usada no resto do app)
  return Math.max(0, Math.round(x * 4) / 4);
}

export function generateDiet(goals: Goals, foods: FoodItem[]): GeneratedMeal[] {
  const byId = (id: string) => foods.find((f) => f.id === id);

  return mealTemplates.map((template) => {
    const mealTarget: Macros = {
      kcal: goals.kcal * template.kcalPct,
      protein: goals.protein * template.proteinPct,
      carbs: goals.carbs * template.carbsPct,
      fat: goals.fat * template.fatPct,
    };

    const extras = template.fixedExtras ?? [];
    const extrasMacros = extras.reduce(
      (acc, e) => {
        const f = byId(e.foodId);
        if (!f) return acc;
        return {
          protein: acc.protein + f.macros.protein * e.quantity,
          carbs: acc.carbs + f.macros.carbs * e.quantity,
          fat: acc.fat + f.macros.fat * e.quantity,
        };
      },
      { protein: 0, carbs: 0, fat: 0 }
    );

    const remaining = {
      protein: Math.max(0, mealTarget.protein - extrasMacros.protein),
      carbs: Math.max(0, mealTarget.carbs - extrasMacros.carbs),
      fat: Math.max(0, mealTarget.fat - extrasMacros.fat),
    };

    const proteinFood = byId(template.proteinFoodId);
    const carbFood = byId(template.carbFoodId);
    const fatFood = byId(template.fatFoodId);

    const items: GeneratedMealItem[] = extras.filter((e) => byId(e.foodId));

    if (proteinFood && carbFood && fatFood) {
      const A = [
        [proteinFood.macros.protein, carbFood.macros.protein, fatFood.macros.protein],
        [proteinFood.macros.carbs, carbFood.macros.carbs, fatFood.macros.carbs],
        [proteinFood.macros.fat, carbFood.macros.fat, fatFood.macros.fat],
      ];
      const b = [remaining.protein, remaining.carbs, remaining.fat];
      const sol = solve3x3(A, b);

      const [qProtein, qCarb, qFat] = sol
        ? sol.map(roundQty)
        : // fallback bem simples caso o sistema seja degenerado (não deve ocorrer com os alimentos padrão)
          [
            roundQty(remaining.protein / (proteinFood.macros.protein || 1)),
            roundQty(remaining.carbs / (carbFood.macros.carbs || 1)),
            roundQty(remaining.fat / (fatFood.macros.fat || 1)),
          ];

      if (qProtein > 0.05) items.push({ foodId: proteinFood.id, quantity: qProtein });
      if (qCarb > 0.05) items.push({ foodId: carbFood.id, quantity: qCarb });
      if (qFat > 0.05) items.push({ foodId: fatFood.id, quantity: qFat });
    }

    return { name: template.name, items };
  });
}
