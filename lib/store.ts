"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuid } from "uuid";
import {
  DiaryEntry,
  DietPlan,
  ExerciseDef,
  FoodItem,
  Goals,
  Meal,
  MealFoodEntry,
  UserProfile,
  WorkoutDay,
  WorkoutExercise,
  WorkoutLogEntry,
  WorkoutRoutine,
} from "./types";
import { seedFoods } from "./seedFoods";
import { seedExercises } from "./seedExercises";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

type AppState = {
  // perfil
  profile: UserProfile | null;
  setProfile: (p: UserProfile) => void;

  // catálogos
  foods: FoodItem[];
  exercises: ExerciseDef[];

  // metas
  goals: Goals;
  setGoals: (g: Goals) => void;

  // treinos
  routines: WorkoutRoutine[];
  workoutLogs: WorkoutLogEntry[];
  addRoutine: (name: string) => string;
  removeRoutine: (id: string) => void;
  addDay: (routineId: string, name: string) => void;
  removeDay: (routineId: string, dayId: string) => void;
  renameDay: (routineId: string, dayId: string, name: string) => void;
  addExerciseToDay: (routineId: string, dayId: string, exerciseId: string) => void;
  removeExerciseFromDay: (routineId: string, dayId: string, workoutExerciseId: string) => void;
  addSet: (routineId: string, dayId: string, workoutExerciseId: string) => void;
  updateSet: (
    routineId: string,
    dayId: string,
    workoutExerciseId: string,
    setId: string,
    patch: Partial<{ reps: number; weight: number; completed: boolean }>
  ) => void;
  removeSet: (routineId: string, dayId: string, workoutExerciseId: string, setId: string) => void;
  addCustomExercise: (name: string, muscleGroup: string) => string;
  logWorkoutDay: (routineId: string, dayId: string) => void;
  removeWorkoutLog: (id: string) => void;

  // dietas
  diets: DietPlan[];
  addDiet: (name: string) => string;
  removeDiet: (id: string) => void;
  addMeal: (dietId: string, name: string, time?: string) => string;
  removeMeal: (dietId: string, mealId: string) => void;
  addFoodToMeal: (dietId: string, mealId: string, foodId: string, quantity: number) => void;
  updateMealFoodQty: (dietId: string, mealId: string, entryId: string, quantity: number) => void;
  removeFoodFromMeal: (dietId: string, mealId: string, entryId: string) => void;
  addCustomFood: (food: Omit<FoodItem, "id" | "custom">) => string;

  // diário
  diary: DiaryEntry[];
  addDiaryEntry: (date: string, mealName: string, foodId: string, quantity: number) => void;
  removeDiaryEntry: (id: string) => void;
  logDietDayToDiary: (dietId: string, date: string) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: null,
      setProfile: (p) => set({ profile: p }),

      foods: seedFoods,
      exercises: seedExercises,

      goals: { kcal: 2200, protein: 150, carbs: 220, fat: 70 },
      setGoals: (g) => set({ goals: g }),

      routines: [],
      workoutLogs: [],

      addRoutine: (name) => {
        const id = uuid();
        const routine: WorkoutRoutine = {
          id,
          name,
          days: [],
          createdAt: new Date().toISOString(),
        };
        set({ routines: [...get().routines, routine] });
        return id;
      },

      removeRoutine: (id) => set({ routines: get().routines.filter((r) => r.id !== id) }),

      addDay: (routineId, name) =>
        set({
          routines: get().routines.map((r) =>
            r.id === routineId
              ? { ...r, days: [...r.days, { id: uuid(), name, exercises: [] } as WorkoutDay] }
              : r
          ),
        }),

      removeDay: (routineId, dayId) =>
        set({
          routines: get().routines.map((r) =>
            r.id === routineId ? { ...r, days: r.days.filter((d) => d.id !== dayId) } : r
          ),
        }),

      renameDay: (routineId, dayId, name) =>
        set({
          routines: get().routines.map((r) =>
            r.id === routineId
              ? { ...r, days: r.days.map((d) => (d.id === dayId ? { ...d, name } : d)) }
              : r
          ),
        }),

      addExerciseToDay: (routineId, dayId, exerciseId) =>
        set({
          routines: get().routines.map((r) =>
            r.id === routineId
              ? {
                  ...r,
                  days: r.days.map((d) =>
                    d.id === dayId
                      ? {
                          ...d,
                          exercises: [
                            ...d.exercises,
                            {
                              id: uuid(),
                              exerciseId,
                              sets: [{ id: uuid(), reps: 10, weight: 0 }],
                            } as WorkoutExercise,
                          ],
                        }
                      : d
                  ),
                }
              : r
          ),
        }),

      removeExerciseFromDay: (routineId, dayId, workoutExerciseId) =>
        set({
          routines: get().routines.map((r) =>
            r.id === routineId
              ? {
                  ...r,
                  days: r.days.map((d) =>
                    d.id === dayId
                      ? { ...d, exercises: d.exercises.filter((e) => e.id !== workoutExerciseId) }
                      : d
                  ),
                }
              : r
          ),
        }),

      addSet: (routineId, dayId, workoutExerciseId) =>
        set({
          routines: get().routines.map((r) =>
            r.id === routineId
              ? {
                  ...r,
                  days: r.days.map((d) =>
                    d.id === dayId
                      ? {
                          ...d,
                          exercises: d.exercises.map((e) =>
                            e.id === workoutExerciseId
                              ? {
                                  ...e,
                                  sets: [
                                    ...e.sets,
                                    {
                                      id: uuid(),
                                      reps: e.sets[e.sets.length - 1]?.reps ?? 10,
                                      weight: e.sets[e.sets.length - 1]?.weight ?? 0,
                                    },
                                  ],
                                }
                              : e
                          ),
                        }
                      : d
                  ),
                }
              : r
          ),
        }),

      updateSet: (routineId, dayId, workoutExerciseId, setId, patch) =>
        set({
          routines: get().routines.map((r) =>
            r.id === routineId
              ? {
                  ...r,
                  days: r.days.map((d) =>
                    d.id === dayId
                      ? {
                          ...d,
                          exercises: d.exercises.map((e) =>
                            e.id === workoutExerciseId
                              ? {
                                  ...e,
                                  sets: e.sets.map((s) => (s.id === setId ? { ...s, ...patch } : s)),
                                }
                              : e
                          ),
                        }
                      : d
                  ),
                }
              : r
          ),
        }),

      removeSet: (routineId, dayId, workoutExerciseId, setId) =>
        set({
          routines: get().routines.map((r) =>
            r.id === routineId
              ? {
                  ...r,
                  days: r.days.map((d) =>
                    d.id === dayId
                      ? {
                          ...d,
                          exercises: d.exercises.map((e) =>
                            e.id === workoutExerciseId
                              ? { ...e, sets: e.sets.filter((s) => s.id !== setId) }
                              : e
                          ),
                        }
                      : d
                  ),
                }
              : r
          ),
        }),

      addCustomExercise: (name, muscleGroup) => {
        const id = uuid();
        set({ exercises: [...get().exercises, { id, name, muscleGroup, custom: true }] });
        return id;
      },

      logWorkoutDay: (routineId, dayId) => {
        const routine = get().routines.find((r) => r.id === routineId);
        const day = routine?.days.find((d) => d.id === dayId);
        if (!routine || !day) return;
        const entry: WorkoutLogEntry = {
          id: uuid(),
          date: todayISO(),
          routineId,
          dayId,
          dayName: day.name,
          exercises: day.exercises,
        };
        set({ workoutLogs: [entry, ...get().workoutLogs] });
      },

      removeWorkoutLog: (id) => set({ workoutLogs: get().workoutLogs.filter((w) => w.id !== id) }),

      diets: [],

      addDiet: (name) => {
        const id = uuid();
        const diet: DietPlan = { id, name, meals: [], createdAt: new Date().toISOString() };
        set({ diets: [...get().diets, diet] });
        return id;
      },

      removeDiet: (id) => set({ diets: get().diets.filter((d) => d.id !== id) }),

      addMeal: (dietId, name, time) => {
        const id = uuid();
        set({
          diets: get().diets.map((d) =>
            d.id === dietId
              ? { ...d, meals: [...d.meals, { id, name, time, items: [] } as Meal] }
              : d
          ),
        });
        return id;
      },

      removeMeal: (dietId, mealId) =>
        set({
          diets: get().diets.map((d) =>
            d.id === dietId ? { ...d, meals: d.meals.filter((m) => m.id !== mealId) } : d
          ),
        }),

      addFoodToMeal: (dietId, mealId, foodId, quantity) =>
        set({
          diets: get().diets.map((d) =>
            d.id === dietId
              ? {
                  ...d,
                  meals: d.meals.map((m) =>
                    m.id === mealId
                      ? { ...m, items: [...m.items, { id: uuid(), foodId, quantity } as MealFoodEntry] }
                      : m
                  ),
                }
              : d
          ),
        }),

      updateMealFoodQty: (dietId, mealId, entryId, quantity) =>
        set({
          diets: get().diets.map((d) =>
            d.id === dietId
              ? {
                  ...d,
                  meals: d.meals.map((m) =>
                    m.id === mealId
                      ? { ...m, items: m.items.map((i) => (i.id === entryId ? { ...i, quantity } : i)) }
                      : m
                  ),
                }
              : d
          ),
        }),

      removeFoodFromMeal: (dietId, mealId, entryId) =>
        set({
          diets: get().diets.map((d) =>
            d.id === dietId
              ? {
                  ...d,
                  meals: d.meals.map((m) =>
                    m.id === mealId ? { ...m, items: m.items.filter((i) => i.id !== entryId) } : m
                  ),
                }
              : d
          ),
        }),

      addCustomFood: (food) => {
        const id = uuid();
        set({ foods: [...get().foods, { ...food, id, custom: true }] });
        return id;
      },

      diary: [],

      addDiaryEntry: (date, mealName, foodId, quantity) =>
        set({
          diary: [...get().diary, { id: uuid(), date, mealName, foodId, quantity }],
        }),

      removeDiaryEntry: (id) => set({ diary: get().diary.filter((e) => e.id !== id) }),

      logDietDayToDiary: (dietId, date) => {
        const diet = get().diets.find((d) => d.id === dietId);
        if (!diet) return;
        const newEntries: DiaryEntry[] = [];
        diet.meals.forEach((meal) => {
          meal.items.forEach((item) => {
            newEntries.push({
              id: uuid(),
              date,
              mealName: meal.name,
              foodId: item.foodId,
              quantity: item.quantity,
            });
          });
        });
        set({ diary: [...get().diary, ...newEntries] });
      },
    }),
    {
      name: "fitapp-storage",
      version: 1,
    }
  )
);

export { todayISO };
