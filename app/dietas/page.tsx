"use client";

import { useMemo, useState } from "react";
import { useAppStore, todayISO } from "@/lib/store";
import { Card, SectionTitle, Button, Input, Select, EmptyState } from "@/components/ui";
import { macrosForFood } from "@/lib/calc";
import { emptyMacros, sumMacros, Macros } from "@/lib/types";
import { Plus, Trash2, Check, UtensilsCrossed, Sparkles } from "lucide-react";
import { FoodSearch } from "@/components/FoodSearch";
import { OFFProduct } from "@/lib/api/openFoodFacts";
import { generateDiet } from "@/lib/dietGenerator";

function MacroPill({ macros }: { macros: Macros }) {
  return (
    <div className="flex gap-3 text-xs text-paper-dim tabular">
      <span>{Math.round(macros.kcal)} kcal</span>
      <span className="text-sage">P {Math.round(macros.protein)}g</span>
      <span className="text-sand">C {Math.round(macros.carbs)}g</span>
      <span className="text-coral">G {Math.round(macros.fat)}g</span>
    </div>
  );
}

export default function DietasPage() {
  const store = useAppStore();
  const { diets, goals, profile } = store;
  const [newDietName, setNewDietName] = useState("");
  const [activeDietId, setActiveDietId] = useState<string | null>(diets[0]?.id ?? null);
  const [generating, setGenerating] = useState(false);

  const activeDiet = diets.find((d) => d.id === activeDietId) ?? null;

  function handleCreate() {
    if (!newDietName.trim()) return;
    const id = store.addDiet(newDietName.trim());
    setNewDietName("");
    setActiveDietId(id);
  }

  function handleGenerate() {
    setGenerating(true);
    const meals = generateDiet(goals, store.foods);
    const dietName = `Dieta sugerida — ${new Date().toLocaleDateString("pt-BR")}`;
    const dietId = store.addDiet(dietName);
    meals.forEach((meal) => {
      const mealId = store.addMeal(dietId, meal.name);
      meal.items.forEach((item) => store.addFoodToMeal(dietId, mealId, item.foodId, item.quantity));
    });
    setActiveDietId(dietId);
    setGenerating(false);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <span className="text-coral text-xs font-semibold tracking-widest uppercase">Dietas</span>
        <h1 className="display-text text-3xl md:text-4xl font-extrabold text-paper mt-1">
          Seus planos alimentares
        </h1>
      </div>

      <Card className="!border-sage/30 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-sage" />
          <span className="text-sage text-xs font-semibold tracking-widest uppercase">Gerar automaticamente</span>
        </div>
        <p className="text-sm text-paper-dim">
          Monta um plano de 4 refeições calculado pra bater suas metas de calorias e macros (
          <span className="tabular text-paper">
            {Math.round(goals.kcal)} kcal · P{Math.round(goals.protein)} C{Math.round(goals.carbs)} G{Math.round(goals.fat)}
          </span>
          ), as mesmas que levam em conta seu nível de atividade física no Perfil.
        </p>
        <Button onClick={handleGenerate} disabled={generating} className="self-start">
          <span className="flex items-center gap-1.5">
            <Sparkles size={15} /> {generating ? "Gerando..." : "Gerar dieta automática"}
          </span>
        </Button>
        {!profile && (
          <p className="text-xs text-coral">
            Você ainda não preencheu o Perfil — as metas usadas agora são genéricas. Complete o perfil pra uma dieta
            mais precisa.
          </p>
        )}
        <p className="text-[11px] text-paper-dim">
          As quantidades são uma estimativa calculada automaticamente — ajuste à vontade (trocar alimento,
          quantidade) depois de gerada.
        </p>
      </Card>

      <Card className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Nome da dieta (ex: Cutting 2200kcal)"
          value={newDietName}
          onChange={(e) => setNewDietName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          className="flex-1"
        />
        <Button onClick={handleCreate}>
          <span className="flex items-center gap-1.5">
            <Plus size={16} /> Nova dieta (em branco)
          </span>
        </Button>
      </Card>

      {diets.length === 0 ? (
        <EmptyState title="Nenhuma dieta ainda" hint="Crie seu primeiro plano alimentar acima." />
      ) : (
        <div className="flex flex-wrap gap-2">
          {diets.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveDietId(d.id)}
              className={`px-3.5 py-2 rounded-md text-sm font-semibold border transition-colors ${
                activeDietId === d.id
                  ? "bg-coral text-ink border-coral"
                  : "border-ink-line text-paper-dim hover:text-paper"
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>
      )}

      {activeDiet && (
        <DietEditor dietId={activeDiet.id} onDelete={() => { store.removeDiet(activeDiet.id); setActiveDietId(null); }} />
      )}
    </div>
  );
}

function DietEditor({ dietId, onDelete }: { dietId: string; onDelete: () => void }) {
  const store = useAppStore();
  const diet = useAppStore((s) => s.diets.find((d) => d.id === dietId));
  const foods = useAppStore((s) => s.foods);
  const [newMealName, setNewMealName] = useState("");
  const [newMealTime, setNewMealTime] = useState("");
  const [justLogged, setJustLogged] = useState(false);

  if (!diet) return null;

  const dietTotal = diet.meals.reduce((acc, m) => {
    const mealTotal = m.items.reduce((macc, item) => {
      const food = foods.find((f) => f.id === item.foodId);
      if (!food) return macc;
      return sumMacros(macc, macrosForFood(food, item.quantity));
    }, emptyMacros());
    return sumMacros(acc, mealTotal);
  }, emptyMacros());

  function handleAddMeal() {
    if (!newMealName.trim()) return;
    store.addMeal(dietId, newMealName.trim(), newMealTime || undefined);
    setNewMealName("");
    setNewMealTime("");
  }

  function handleLogToday() {
    store.logDietDayToDiary(dietId, todayISO());
    setJustLogged(true);
    setTimeout(() => setJustLogged(false), 2000);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-start flex-wrap gap-3">
        <div>
          <h3 className="display-text text-lg font-bold text-paper">{diet.name}</h3>
          <MacroPill macros={dietTotal} />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleLogToday} className="!py-1.5 text-xs">
            {justLogged ? (
              <span className="flex items-center gap-1"><Check size={13} /> Lançado no diário</span>
            ) : (
              "Lançar no diário de hoje"
            )}
          </Button>
          <Button variant="danger" onClick={onDelete} className="!py-1.5 text-xs">
            <Trash2 size={14} />
          </Button>
        </div>
      </div>

      <Card className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Nome da refeição (ex: Café da manhã)"
          value={newMealName}
          onChange={(e) => setNewMealName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddMeal()}
          className="flex-1"
        />
        <Input
          type="time"
          value={newMealTime}
          onChange={(e) => setNewMealTime(e.target.value)}
          className="sm:w-32"
        />
        <Button onClick={handleAddMeal}>
          <span className="flex items-center gap-1.5">
            <Plus size={16} /> Refeição
          </span>
        </Button>
      </Card>

      {diet.meals.length === 0 ? (
        <EmptyState title="Nenhuma refeição" hint="Adicione refeições para montar o plano do dia." />
      ) : (
        <div className="flex flex-col gap-3">
          {diet.meals.map((meal) => (
            <MealEditor key={meal.id} dietId={dietId} mealId={meal.id} />
          ))}
        </div>
      )}
    </div>
  );
}

function MealEditor({ dietId, mealId }: { dietId: string; mealId: string }) {
  const store = useAppStore();
  const meal = useAppStore((s) => s.diets.find((d) => d.id === dietId)?.meals.find((m) => m.id === mealId));
  const foods = useAppStore((s) => s.foods);
  const [foodId, setFoodId] = useState("");
  const [qtyMultiplier, setQtyMultiplier] = useState(1);
  const [showSearch, setShowSearch] = useState(false);

  if (!meal) return null;

  const mealTotal = meal.items.reduce((acc, item) => {
    const food = foods.find((f) => f.id === item.foodId);
    if (!food) return acc;
    return sumMacros(acc, macrosForFood(food, item.quantity));
  }, emptyMacros());

  function handleAdd() {
    const id = foodId || foods[0]?.id;
    if (!id) return;
    store.addFoodToMeal(dietId, mealId, id, qtyMultiplier);
    setQtyMultiplier(1);
  }

  function handlePickOFF(p: OFFProduct) {
    const name = p.brand ? `${p.name} — ${p.brand}` : p.name;
    const newId = store.addCustomFood({
      name,
      per: 100,
      unitLabel: "100g",
      macros: p.macros,
    });
    store.addFoodToMeal(dietId, mealId, newId, 1);
    setShowSearch(false);
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <UtensilsCrossed size={16} className="text-coral" />
          <span className="font-semibold text-paper">{meal.name}</span>
          {meal.time && <span className="text-paper-dim text-xs tabular">{meal.time}</span>}
        </div>
        <button onClick={() => store.removeMeal(dietId, mealId)} className="text-paper-dim hover:text-coral p-1">
          <Trash2 size={14} />
        </button>
      </div>

      {meal.items.length > 0 && (
        <div className="flex flex-col gap-1.5 mb-3">
          {meal.items.map((item) => {
            const food = foods.find((f) => f.id === item.foodId);
            if (!food) return null;
            const m = macrosForFood(food, item.quantity);
            return (
              <div key={item.id} className="flex justify-between items-center bg-ink rounded-md px-3 py-2 border border-ink-line">
                <div>
                  <p className="text-sm text-paper">{food.name}</p>
                  <p className="text-xs text-paper-dim tabular">
                    {(item.quantity * food.per).toFixed(0)}{food.unitLabel.includes("ml") ? "ml" : "g"} · {Math.round(m.kcal)} kcal
                  </p>
                </div>
                <button onClick={() => store.removeFoodFromMeal(dietId, mealId, item.id)} className="text-paper-dim hover:text-coral p-1">
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap gap-2 items-center mb-3">
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
          value={qtyMultiplier}
          onChange={(e) => setQtyMultiplier(Number(e.target.value))}
          className="w-24 tabular"
          title="Multiplicador da porção de referência"
        />
        <Button onClick={handleAdd} className="!py-2">
          <Plus size={15} />
        </Button>
        <Button variant="ghost" className="!py-2 text-xs" onClick={() => setShowSearch(!showSearch)}>
          {showSearch ? "Fechar busca" : "Buscar produto industrializado"}
        </Button>
      </div>

      {showSearch && (
        <div className="bg-ink rounded-md border border-ink-line p-3 mb-3">
          <FoodSearch onPick={handlePickOFF} />
        </div>
      )}

      <MacroPill macros={mealTotal} />
    </Card>
  );
}
