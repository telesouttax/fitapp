import { DietPlan, FoodItem, emptyMacros, sumMacros } from "@/lib/types";
import { macrosForFood } from "@/lib/calc";
import { generateShoppingList, formatAmount } from "@/lib/shoppingList";

export function PrintableDiet({ diet, foods, days = 1 }: { diet: DietPlan; foods: FoodItem[]; days?: number }) {
  const dietTotal = diet.meals.reduce((acc, m) => {
    const mealTotal = m.items.reduce((macc, item) => {
      const food = foods.find((f) => f.id === item.foodId);
      if (!food) return macc;
      return sumMacros(macc, macrosForFood(food, item.quantity));
    }, emptyMacros());
    return sumMacros(acc, mealTotal);
  }, emptyMacros());

  return (
    <div className="hidden print:block bg-white text-black p-2 font-sans max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-0.5">{diet.name}</h1>
      <p className="text-sm text-gray-600 mb-6">Gerado em {new Date().toLocaleDateString("pt-BR")} · FitTrack</p>

      {diet.meals.length === 0 && <p className="text-sm text-gray-500">Nenhuma refeição cadastrada nesta dieta.</p>}

      {diet.meals.map((meal) => {
        const mealTotal = meal.items.reduce((acc, item) => {
          const food = foods.find((f) => f.id === item.foodId);
          if (!food) return acc;
          return sumMacros(acc, macrosForFood(food, item.quantity));
        }, emptyMacros());

        return (
          <div key={meal.id} className="mb-6" style={{ breakInside: "avoid" }}>
            <h2 className="text-base font-semibold border-b border-gray-300 pb-1 mb-2">
              {meal.name}
              {meal.time ? ` — ${meal.time}` : ""}
            </h2>
            {meal.items.length === 0 ? (
              <p className="text-sm text-gray-500">Sem itens.</p>
            ) : (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-1 pr-2">Alimento</th>
                    <th className="py-1 pr-2">Qtd.</th>
                    <th className="py-1 pr-2">Kcal</th>
                    <th className="py-1 pr-2">Prot.</th>
                    <th className="py-1 pr-2">Carbo</th>
                    <th className="py-1">Gord.</th>
                  </tr>
                </thead>
                <tbody>
                  {meal.items.map((item) => {
                    const food = foods.find((f) => f.id === item.foodId);
                    if (!food) return null;
                    const m = macrosForFood(food, item.quantity);
                    const unit = food.unitLabel.includes("ml") ? "ml" : "g";
                    return (
                      <tr key={item.id} className="border-t border-gray-200">
                        <td className="py-1 pr-2">{food.name}</td>
                        <td className="py-1 pr-2">{(item.quantity * food.per).toFixed(0)}{unit}</td>
                        <td className="py-1 pr-2">{Math.round(m.kcal)}</td>
                        <td className="py-1 pr-2">{Math.round(m.protein)}g</td>
                        <td className="py-1 pr-2">{Math.round(m.carbs)}g</td>
                        <td className="py-1">{Math.round(m.fat)}g</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            <p className="text-xs text-gray-600 mt-1.5">
              Subtotal: {Math.round(mealTotal.kcal)} kcal · P {Math.round(mealTotal.protein)}g · C{" "}
              {Math.round(mealTotal.carbs)}g · G {Math.round(mealTotal.fat)}g
            </p>
          </div>
        );
      })}

      <div className="mt-8 pt-3 border-t-2 border-black">
        <p className="font-semibold text-sm">
          Total do dia: {Math.round(dietTotal.kcal)} kcal · Proteína {Math.round(dietTotal.protein)}g ·
          Carboidrato {Math.round(dietTotal.carbs)}g · Gordura {Math.round(dietTotal.fat)}g
        </p>
      </div>

      <div className="mt-8" style={{ breakInside: "avoid" }}>
        <h2 className="text-lg font-bold border-b-2 border-black pb-1 mb-3">
          Lista de compras {days > 1 ? `(${days} dias)` : "(1 dia)"}
        </h2>
        {(() => {
          const list = generateShoppingList(diet, foods, days);
          const alimentos = list.filter((i) => i.category === "alimento");
          const suplementos = list.filter((i) => i.category === "suplemento");
          return (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold mb-1">Alimentos</p>
                <ul className="text-sm flex flex-col gap-0.5">
                  {alimentos.map((i) => (
                    <li key={i.foodId}>
                      ☐ {i.name} — {formatAmount(i.totalAmount, i.unit)}
                    </li>
                  ))}
                </ul>
              </div>
              {suplementos.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-1">Suplementos</p>
                  <ul className="text-sm flex flex-col gap-0.5">
                    {suplementos.map((i) => (
                      <li key={i.foodId}>
                        ☐ {i.name} — {formatAmount(i.totalAmount, i.unit)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
