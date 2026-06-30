"use client";

import { useState } from "react";
import { useAppStore, todayISO } from "@/lib/store";
import { Card, SectionTitle, Button, Input, Select, EmptyState } from "@/components/ui";
import { macrosForDiaryDate, macrosForFood, groupDiaryByMeal } from "@/lib/calc";
import { MacroRing } from "@/components/MacroRing";
import { Plus, Trash2 } from "lucide-react";

const commonMeals = ["Café da manhã", "Almoço", "Lanche", "Jantar", "Ceia", "Pré-treino", "Pós-treino"];

export default function DiarioPage() {
  const store = useAppStore();
  const { diary, foods, goals } = store;
  const [date, setDate] = useState(todayISO());

  const [mealName, setMealName] = useState(commonMeals[0]);
  const [foodId, setFoodId] = useState("");
  const [qty, setQty] = useState(1);

  const consumed = macrosForDiaryDate(diary, foods, date);
  const groups = groupDiaryByMeal(diary, date);

  function handleAdd() {
    const id = foodId || foods[0]?.id;
    if (!id) return;
    store.addDiaryEntry(date, mealName, id, qty);
    setQty(1);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-start flex-wrap gap-3">
        <div>
          <span className="text-coral text-xs font-semibold tracking-widest uppercase">Diário</span>
          <h1 className="display-text text-3xl md:text-4xl font-extrabold text-paper mt-1">
            Calorias e macros
          </h1>
        </div>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="tabular" />
      </div>

      <Card className="flex flex-col items-center py-8">
        <MacroRing consumed={consumed} goals={goals} size={200} />
      </Card>

      <Card>
        <SectionTitle eyebrow="Registrar">Adicionar alimento</SectionTitle>
        <div className="flex flex-wrap gap-2 items-center">
          <Select value={mealName} onChange={(e) => setMealName(e.target.value)} className="min-w-[140px]">
            {commonMeals.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </Select>
          <Select value={foodId} onChange={(e) => setFoodId(e.target.value)} className="flex-1 min-w-[180px]">
            <option value="">Selecione um alimento</option>
            {foods.map((f) => (
              <option key={f.id} value={f.id}>{f.name} ({f.unitLabel})</option>
            ))}
          </Select>
          <Input
            type="number"
            min={0.25}
            step={0.25}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="w-24 tabular"
            title="Multiplicador da porção de referência"
          />
          <Button onClick={handleAdd}>
            <span className="flex items-center gap-1.5"><Plus size={15} /> Adicionar</span>
          </Button>
        </div>
      </Card>

      {Object.keys(groups).length === 0 ? (
        <EmptyState title="Nada registrado neste dia" hint="Adicione alimentos acima ou lance uma dieta inteira na página Dietas." />
      ) : (
        <div className="flex flex-col gap-3">
          {Object.entries(groups).map(([meal, entries]) => (
            <Card key={meal}>
              <p className="font-semibold text-paper mb-2">{meal}</p>
              <div className="flex flex-col gap-1.5">
                {entries.map((entry) => {
                  const food = foods.find((f) => f.id === entry.foodId);
                  if (!food) return null;
                  const m = macrosForFood(food, entry.quantity);
                  return (
                    <div key={entry.id} className="flex justify-between items-center bg-ink rounded-md px-3 py-2 border border-ink-line">
                      <div>
                        <p className="text-sm text-paper">{food.name}</p>
                        <p className="text-xs text-paper-dim tabular">
                          {(entry.quantity * food.per).toFixed(0)}{food.unitLabel.includes("ml") ? "ml" : "g"} · {Math.round(m.kcal)} kcal · P{Math.round(m.protein)} C{Math.round(m.carbs)} G{Math.round(m.fat)}
                        </p>
                      </div>
                      <button onClick={() => store.removeDiaryEntry(entry.id)} className="text-paper-dim hover:text-coral p-1">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
