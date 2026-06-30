import { ExerciseDef } from "./types";

export const seedExercises: ExerciseDef[] = [
  // Peito
  { id: "e-supino-reto-barra", name: "Supino reto com barra", muscleGroup: "Peito" },
  { id: "e-supino-inclinado-halter", name: "Supino inclinado com halteres", muscleGroup: "Peito" },
  { id: "e-crucifixo", name: "Crucifixo com halteres", muscleGroup: "Peito" },
  { id: "e-crossover", name: "Crossover (cabo)", muscleGroup: "Peito" },
  { id: "e-flexao", name: "Flexão de braço", muscleGroup: "Peito" },

  // Costas
  { id: "e-puxada-frente", name: "Puxada frente (pulley)", muscleGroup: "Costas" },
  { id: "e-remada-curvada", name: "Remada curvada com barra", muscleGroup: "Costas" },
  { id: "e-remada-cavalinho", name: "Remada cavalinho", muscleGroup: "Costas" },
  { id: "e-barra-fixa", name: "Barra fixa", muscleGroup: "Costas" },
  { id: "e-remada-unilateral", name: "Remada unilateral com halter", muscleGroup: "Costas" },

  // Pernas
  { id: "e-agachamento-livre", name: "Agachamento livre", muscleGroup: "Pernas" },
  { id: "e-leg-press", name: "Leg press 45°", muscleGroup: "Pernas" },
  { id: "e-cadeira-extensora", name: "Cadeira extensora", muscleGroup: "Pernas" },
  { id: "e-cadeira-flexora", name: "Cadeira flexora", muscleGroup: "Pernas" },
  { id: "e-stiff", name: "Stiff (levantamento terra romeno)", muscleGroup: "Pernas" },
  { id: "e-afundo", name: "Afundo (passada)", muscleGroup: "Pernas" },
  { id: "e-panturrilha", name: "Elevação de panturrilha", muscleGroup: "Pernas" },

  // Ombros
  { id: "e-desenvolvimento-militar", name: "Desenvolvimento militar", muscleGroup: "Ombros" },
  { id: "e-elevacao-lateral", name: "Elevação lateral", muscleGroup: "Ombros" },
  { id: "e-elevacao-frontal", name: "Elevação frontal", muscleGroup: "Ombros" },
  { id: "e-remada-alta", name: "Remada alta", muscleGroup: "Ombros" },

  // Braços
  { id: "e-rosca-direta", name: "Rosca direta com barra", muscleGroup: "Braços" },
  { id: "e-rosca-alternada", name: "Rosca alternada com halteres", muscleGroup: "Braços" },
  { id: "e-triceps-pulley", name: "Tríceps pulley (corda)", muscleGroup: "Braços" },
  { id: "e-triceps-testa", name: "Tríceps testa", muscleGroup: "Braços" },
  { id: "e-rosca-martelo", name: "Rosca martelo", muscleGroup: "Braços" },

  // Abdômen
  { id: "e-abdominal-supra", name: "Abdominal supra", muscleGroup: "Abdômen" },
  { id: "e-prancha", name: "Prancha isométrica", muscleGroup: "Abdômen" },
  { id: "e-elevacao-pernas", name: "Elevação de pernas", muscleGroup: "Abdômen" },

  // Cardio
  { id: "e-esteira", name: "Esteira (corrida/caminhada)", muscleGroup: "Cardio" },
  { id: "e-bike", name: "Bicicleta ergométrica", muscleGroup: "Cardio" },
];

export const muscleGroups = [
  "Peito",
  "Costas",
  "Pernas",
  "Ombros",
  "Braços",
  "Abdômen",
  "Cardio",
];
