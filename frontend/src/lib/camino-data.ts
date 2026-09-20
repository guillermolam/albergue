export interface CaminoStage {
  id: string;
  name: string;
  distance: number;
  completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedDays: number;
}

export interface CaminoStats {
  totalDistance: number;
  completedDistance: number;
  remainingDistance: number;
  completedDays: number;
  averageDailyDistance: number;
}

export interface CaminoFunFact {
  icon: string;
  title: string;
  description: string;
  calculation: string;
}

export const stats: CaminoStats = {
  totalDistance: 847,
  completedDistance: 127,
  remainingDistance: 720,
  completedDays: 7,
  averageDailyDistance: 18.1,
};

export const stages: CaminoStage[] = [
  {
    id: '1',
    name: 'Sevilla → Guillena',
    distance: 22.2,
    completed: true,
    difficulty: 'easy',
    estimatedDays: 1,
  },
  {
    id: '2',
    name: 'Guillena → Castilblanco',
    distance: 18.5,
    completed: true,
    difficulty: 'easy',
    estimatedDays: 1,
  },
  {
    id: '3',
    name: 'Castilblanco → Almadén',
    distance: 25.8,
    completed: true,
    difficulty: 'medium',
    estimatedDays: 1,
  },
  {
    id: '4',
    name: 'Almadén → Real de la Jara',
    distance: 19.3,
    completed: true,
    difficulty: 'easy',
    estimatedDays: 1,
  },
  {
    id: '5',
    name: 'Real de la Jara → Monesterio',
    distance: 21.7,
    completed: true,
    difficulty: 'medium',
    estimatedDays: 1,
  },
  {
    id: '6',
    name: 'Monesterio → Fuente de Cantos',
    distance: 19.4,
    completed: true,
    difficulty: 'easy',
    estimatedDays: 1,
  },
  {
    id: '7',
    name: 'Fuente de Cantos → Zafra',
    distance: 20.1,
    completed: true,
    difficulty: 'easy',
    estimatedDays: 1,
  },
  {
    id: '8',
    name: 'Zafra → Villafranca',
    distance: 19.8,
    completed: false,
    difficulty: 'medium',
    estimatedDays: 1,
  },
  {
    id: '9',
    name: 'Villafranca → Alcuéscar',
    distance: 38.2,
    completed: false,
    difficulty: 'hard',
    estimatedDays: 2,
  },
  {
    id: '10',
    name: 'Alcuéscar → Cáceres',
    distance: 23.1,
    completed: false,
    difficulty: 'medium',
    estimatedDays: 1,
  },
];

export const funFacts: CaminoFunFact[] = [
  {
    icon: '🌍',
    title: 'Has caminado el equivalente a...',
    description:
      '¡Cruzar la península ibérica de este a oeste! Tu distancia recorrida es similar a la anchura de España en su punto más estrecho.',
    calculation: '127 km ≈ Ancho de España (mínimo)',
  },
  {
    icon: '🔥',
    title: 'Calorías quemadas',
    description:
      'Las 18,932 calorías equivalen a 37 bocadillos de tortilla española o 75 cafés con leche. ¡Eso es mucha energía!',
    calculation: '18,932 cal ÷ 510 cal/bocadillo = 37 bocadillos',
  },
  {
    icon: '👣',
    title: 'Pasos dados',
    description:
      'Tus 168,420 pasos equivalen a subir y bajar la Torre Eiffel aproximadamente 28 veces. ¡Qué altura!',
    calculation: '168,420 pasos ÷ 6,000 pasos/ascenso = 28 ascensos',
  },
  {
    icon: '⏰',
    title: 'Tiempo de calidad',
    description:
      'Has pasado 29.4 horas caminando, lo que equivale a ver 14 películas largas o leer 147 páginas de un buen libro.',
    calculation: '29.4 hrs ÷ 2.1 hrs/película = 14 películas',
  },
];
