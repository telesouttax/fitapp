// Tipos centrais do app

export type Sex = "M" | "F";

export type ActivityLevel = "sedentario" | "leve" | "moderado" | "ativo" | "muito_ativo";

export type Goal = "perder_peso" | "manter_peso" | "ganhar_massa";

export type ExperienceLevel = "iniciante" | "intermediario" | "avancado";

export type UserProfile = {
  name: string;
  age: number;
  sex: Sex;
  weightKg: number;
  heightCm: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  experienceLevel: ExperienceLevel;
};

export type Macros = {
  kcal: number;
  protein: number; // g
  carbs: number; // g
  fat: number; // g
};

export type Goals = {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
};

// ---------- TREINOS ----------

export type ExerciseDef = {
  id: string;
  name: string;
  muscleGroup: string;
  custom?: boolean;
};

export type WorkoutSet = {
  id: string;
  reps: number;
  weight: number; // kg
  completed?: boolean;
};

export type WorkoutExercise = {
  id: string;
  exerciseId: string;
  sets: WorkoutSet[];
  notes?: string;
};

export type WorkoutDay = {
  id: string;
  name: string; // ex: "Treino A - Peito/Triceps"
  exercises: WorkoutExercise[];
};

export type WorkoutRoutine = {
  id: string;
  name: string; // ex: "Rotina de Hipertrofia"
  days: WorkoutDay[];
  createdAt: string;
};

export type WorkoutLogEntry = {
  id: string;
  date: string; // ISO yyyy-mm-dd
  routineId?: string;
  dayId?: string;
  dayName: string;
  exercises: WorkoutExercise[];
};

// ---------- DIETAS / ALIMENTOS ----------

export type FoodCategory = "alimento" | "suplemento";

export type FoodItem = {
  id: string;
  name: string;
  per: number; // referência em gramas/ml (ex: 100)
  unitLabel: string; // "100g" / "100ml" / "unidade"
  macros: Macros;
  category?: FoodCategory; // default: "alimento"
  custom?: boolean;
};

export type MealFoodEntry = {
  id: string;
  foodId: string;
  quantity: number; // multiplicador em unidades de `per`, ex: 1.5 * 100g
};

export type Meal = {
  id: string;
  name: string; // "Café da manhã"
  time?: string; // "08:00"
  items: MealFoodEntry[];
};

export type DietPlan = {
  id: string;
  name: string;
  meals: Meal[];
  createdAt: string;
};

// ---------- DIÁRIO DE CONSUMO ----------

export type DiaryEntry = {
  id: string;
  date: string; // ISO yyyy-mm-dd
  mealName: string;
  foodId: string;
  quantity: number;
};

export function emptyMacros(): Macros {
  return { kcal: 0, protein: 0, carbs: 0, fat: 0 };
}

export function scaleMacros(macros: Macros, factor: number): Macros {
  return {
    kcal: macros.kcal * factor,
    protein: macros.protein * factor,
    carbs: macros.carbs * factor,
    fat: macros.fat * factor,
  };
}

export function sumMacros(a: Macros, b: Macros): Macros {
  return {
    kcal: a.kcal + b.kcal,
    protein: a.protein + b.protein,
    carbs: a.carbs + b.carbs,
    fat: a.fat + b.fat,
  };
}
