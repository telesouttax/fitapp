"use client";

import { useMemo, useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card, SectionTitle, Button, Input, Select, EmptyState } from "@/components/ui";
import { muscleGroups } from "@/lib/seedExercises";
import { Plus, Trash2, ChevronDown, ChevronRight, Check, X, UserCircle } from "lucide-react";
import { ExerciseDemoButton } from "@/components/ExerciseDemoButton";
import { getWorkoutRecommendation } from "@/lib/recommendations";
import Link from "next/link";

export default function TreinosPage() {
  const store = useAppStore();
  const { routines, exercises, profile } = store;

  const [newRoutineName, setNewRoutineName] = useState("");
  const [activeRoutineId, setActiveRoutineId] = useState<string | null>(routines[0]?.id ?? null);

  const activeRoutine = routines.find((r) => r.id === activeRoutineId) ?? null;

  function handleCreateRoutine() {
    if (!newRoutineName.trim()) return;
    const id = store.addRoutine(newRoutineName.trim());
    setNewRoutineName("");
    setActiveRoutineId(id);
  }

  const recommendation = profile ? getWorkoutRecommendation(profile) : null;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <span className="text-coral text-xs font-semibold tracking-widest uppercase">Treinos</span>
        <h1 className="display-text text-3xl md:text-4xl font-extrabold text-paper mt-1">
          Suas rotinas
        </h1>
      </div>

      {recommendation ? (
        <Card className="!border-sage/30">
          <div className="flex items-center gap-2 mb-2">
            <UserCircle size={16} className="text-sage" />
            <span className="text-sage text-xs font-semibold tracking-widest uppercase">
              Recomendado pra você
            </span>
          </div>
          <ul className="text-sm text-paper-dim flex flex-col gap-1">
            <li><span className="text-paper">Frequência:</span> {recommendation.frequency}</li>
            <li><span className="text-paper">Divisão sugerida:</span> {recommendation.split}</li>
            <li><span className="text-paper">Séries:</span> {recommendation.sets}</li>
            <li><span className="text-paper">Faixa de repetições:</span> {recommendation.reps}</li>
            <li className="text-xs mt-1">{recommendation.note}.</li>
          </ul>
        </Card>
      ) : (
        <Card className="flex items-center justify-between gap-3 !border-coral/40">
          <p className="text-sm text-paper">Complete seu perfil para receber recomendações de treino personalizadas.</p>
          <Link href="/perfil" className="shrink-0">
            <Button className="!py-1.5 text-xs whitespace-nowrap">Completar perfil</Button>
          </Link>
        </Card>
      )}

      <Card className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Nome da rotina (ex: Hipertrofia ABC)"
          value={newRoutineName}
          onChange={(e) => setNewRoutineName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreateRoutine()}
          className="flex-1"
        />
        <Button onClick={handleCreateRoutine}>
          <span className="flex items-center gap-1.5">
            <Plus size={16} /> Nova rotina
          </span>
        </Button>
      </Card>

      {routines.length === 0 ? (
        <EmptyState title="Nenhuma rotina ainda" hint="Crie sua primeira rotina de treino acima." />
      ) : (
        <div className="flex flex-wrap gap-2">
          {routines.map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveRoutineId(r.id)}
              className={`px-3.5 py-2 rounded-md text-sm font-semibold border transition-colors ${
                activeRoutineId === r.id
                  ? "bg-coral text-ink border-coral"
                  : "border-ink-line text-paper-dim hover:text-paper"
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>
      )}

      {activeRoutine && (
        <RoutineEditor
          routineId={activeRoutine.id}
          onDelete={() => {
            store.removeRoutine(activeRoutine.id);
            setActiveRoutineId(null);
          }}
        />
      )}
    </div>
  );
}

function RoutineEditor({ routineId, onDelete }: { routineId: string; onDelete: () => void }) {
  const store = useAppStore();
  const routine = useAppStore((s) => s.routines.find((r) => r.id === routineId));
  const [newDayName, setNewDayName] = useState("");
  const [openDayId, setOpenDayId] = useState<string | null>(null);

  if (!routine) return null;

  function handleAddDay() {
    if (!newDayName.trim()) return;
    store.addDay(routineId, newDayName.trim());
    setNewDayName("");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="display-text text-lg font-bold text-paper">{routine.name}</h3>
        <Button variant="danger" onClick={onDelete}>
          <span className="flex items-center gap-1.5">
            <Trash2 size={14} /> Excluir rotina
          </span>
        </Button>
      </div>

      <Card className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Nome do dia (ex: Treino A - Peito/Tríceps)"
          value={newDayName}
          onChange={(e) => setNewDayName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddDay()}
          className="flex-1"
        />
        <Button onClick={handleAddDay}>
          <span className="flex items-center gap-1.5">
            <Plus size={16} /> Adicionar dia
          </span>
        </Button>
      </Card>

      {routine.days.length === 0 ? (
        <EmptyState title="Nenhum dia de treino" hint="Adicione um dia (ex: Treino A) acima." />
      ) : (
        <div className="flex flex-col gap-3">
          {routine.days.map((day) => (
            <DayEditor
              key={day.id}
              routineId={routineId}
              dayId={day.id}
              open={openDayId === day.id}
              onToggle={() => setOpenDayId(openDayId === day.id ? null : day.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DayEditor({
  routineId,
  dayId,
  open,
  onToggle,
}: {
  routineId: string;
  dayId: string;
  open: boolean;
  onToggle: () => void;
}) {
  const store = useAppStore();
  const day = useAppStore((s) => s.routines.find((r) => r.id === routineId)?.days.find((d) => d.id === dayId));
  const exercises = useAppStore((s) => s.exercises);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [group, setGroup] = useState(muscleGroups[0]);
  const [exerciseId, setExerciseId] = useState("");
  const [justLogged, setJustLogged] = useState(false);

  const groupExercises = useMemo(() => exercises.filter((e) => e.muscleGroup === group), [exercises, group]);

  if (!day) return null;

  function handleAddExercise() {
    const id = exerciseId || groupExercises[0]?.id;
    if (!id) return;
    store.addExerciseToDay(routineId, dayId, id);
    setShowAddExercise(false);
    setExerciseId("");
  }

  function handleLog() {
    store.logWorkoutDay(routineId, dayId);
    setJustLogged(true);
    setTimeout(() => setJustLogged(false), 2000);
  }

  return (
    <Card className="!p-0 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center px-5 py-4 text-left"
      >
        <div className="flex items-center gap-2">
          {open ? <ChevronDown size={16} className="text-paper-dim" /> : <ChevronRight size={16} className="text-paper-dim" />}
          <span className="font-semibold text-paper">{day.name}</span>
          <span className="text-xs text-paper-dim">
            ({day.exercises.length} exercício{day.exercises.length !== 1 ? "s" : ""})
          </span>
        </div>
        <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-2">
          <Button
            onClick={handleLog}
            className="!py-1.5 !px-2.5 text-xs"
            variant={justLogged ? "ghost" : "primary"}
          >
            {justLogged ? (
              <span className="flex items-center gap-1"><Check size={13} /> Registrado</span>
            ) : (
              "Registrar treino de hoje"
            )}
          </Button>
          <button onClick={() => store.removeDay(routineId, dayId)} className="text-paper-dim hover:text-coral p-1">
            <Trash2 size={15} />
          </button>
        </div>
      </button>

      {open && (
        <div className="border-t border-ink-line px-5 py-4 flex flex-col gap-3">
          {day.exercises.length === 0 && (
            <p className="text-paper-dim text-sm">Nenhum exercício neste dia ainda.</p>
          )}

          {day.exercises.map((ex) => (
            <ExerciseRow key={ex.id} routineId={routineId} dayId={dayId} workoutExerciseId={ex.id} />
          ))}

          {showAddExercise ? (
            <div className="flex flex-col sm:flex-row gap-2 bg-ink rounded-md p-3 border border-ink-line">
              <Select value={group} onChange={(e) => { setGroup(e.target.value); setExerciseId(""); }}>
                {muscleGroups.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </Select>
              <Select value={exerciseId} onChange={(e) => setExerciseId(e.target.value)} className="flex-1">
                <option value="">Selecione um exercício</option>
                {groupExercises.map((ex) => (
                  <option key={ex.id} value={ex.id}>{ex.name}</option>
                ))}
              </Select>
              <div className="flex gap-2">
                <Button onClick={handleAddExercise}>Adicionar</Button>
                <Button variant="ghost" onClick={() => setShowAddExercise(false)}><X size={15} /></Button>
              </div>
            </div>
          ) : (
            <Button variant="ghost" onClick={() => setShowAddExercise(true)} className="self-start">
              <span className="flex items-center gap-1.5"><Plus size={15} /> Adicionar exercício</span>
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}

function ExerciseRow({
  routineId,
  dayId,
  workoutExerciseId,
}: {
  routineId: string;
  dayId: string;
  workoutExerciseId: string;
}) {
  const store = useAppStore();
  const exDefs = useAppStore((s) => s.exercises);
  const workoutEx = useAppStore((s) =>
    s.routines.find((r) => r.id === routineId)?.days.find((d) => d.id === dayId)?.exercises.find((e) => e.id === workoutExerciseId)
  );
  if (!workoutEx) return null;
  const def = exDefs.find((e) => e.id === workoutEx.exerciseId);

  return (
    <div className="bg-ink rounded-md border border-ink-line p-3">
      <div className="flex justify-between items-center mb-2">
        <div>
          <p className="text-paper font-medium text-sm">{def?.name ?? "Exercício"}</p>
          <p className="text-paper-dim text-xs">{def?.muscleGroup}</p>
        </div>
        <button
          onClick={() => store.removeExerciseFromDay(routineId, dayId, workoutExerciseId)}
          className="text-paper-dim hover:text-coral p-1"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="grid grid-cols-[2rem_1fr_1fr_2rem] gap-2 text-[11px] text-paper-dim uppercase tracking-wide px-1">
          <span>Série</span>
          <span>Reps</span>
          <span>Kg</span>
          <span></span>
        </div>
        {workoutEx.sets.map((s, idx) => (
          <div key={s.id} className="grid grid-cols-[2rem_1fr_1fr_2rem] gap-2 items-center">
            <span className="tabular text-paper-dim text-sm text-center">{idx + 1}</span>
            <Input
              type="number"
              value={s.reps}
              min={0}
              onChange={(e) =>
                store.updateSet(routineId, dayId, workoutExerciseId, s.id, { reps: Number(e.target.value) })
              }
              className="!py-1.5 tabular"
            />
            <Input
              type="number"
              value={s.weight}
              min={0}
              step={0.5}
              onChange={(e) =>
                store.updateSet(routineId, dayId, workoutExerciseId, s.id, { weight: Number(e.target.value) })
              }
              className="!py-1.5 tabular"
            />
            <button
              onClick={() => store.removeSet(routineId, dayId, workoutExerciseId, s.id)}
              className="text-paper-dim hover:text-coral justify-self-center"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <Button
          variant="ghost"
          className="!py-1.5 self-start mt-1 text-xs"
          onClick={() => store.addSet(routineId, dayId, workoutExerciseId)}
        >
          <span className="flex items-center gap-1"><Plus size={13} /> Série</span>
        </Button>
      </div>

      {def && <ExerciseDemoButton exerciseName={def.name} />}
    </div>
  );
}
