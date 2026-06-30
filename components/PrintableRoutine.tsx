import { ExerciseDef, WorkoutRoutine } from "@/lib/types";

export function PrintableRoutine({
  routine,
  exercises,
}: {
  routine: WorkoutRoutine;
  exercises: ExerciseDef[];
}) {
  return (
    <div className="hidden print:block bg-white text-black p-2 font-sans max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-0.5">{routine.name}</h1>
      <p className="text-sm text-gray-600 mb-6">Gerado em {new Date().toLocaleDateString("pt-BR")} · FitTrack</p>

      {routine.days.length === 0 && <p className="text-sm text-gray-500">Nenhum dia de treino cadastrado.</p>}

      {routine.days.map((day) => (
        <div key={day.id} className="mb-6" style={{ breakInside: "avoid" }}>
          <h2 className="text-base font-semibold border-b border-gray-300 pb-1 mb-2">{day.name}</h2>
          {day.exercises.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhum exercício adicionado.</p>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-1 pr-2">Exercício</th>
                  <th className="py-1 pr-2">Grupo</th>
                  <th className="py-1 pr-2">Séries</th>
                  <th className="py-1">Reps × Carga</th>
                </tr>
              </thead>
              <tbody>
                {day.exercises.map((ex) => {
                  const def = exercises.find((e) => e.id === ex.exerciseId);
                  return (
                    <tr key={ex.id} className="border-t border-gray-200">
                      <td className="py-1 pr-2">{def?.name ?? "Exercício"}</td>
                      <td className="py-1 pr-2">{def?.muscleGroup ?? "—"}</td>
                      <td className="py-1 pr-2">{ex.sets.length}</td>
                      <td className="py-1">
                        {ex.sets.map((s, i) => `${s.reps}x${s.weight}kg`).join(" · ")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
}
