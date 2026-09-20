import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { motion } from 'motion/react';
import {
  currentStageProgress,
  dailyGoalKm,
  setDailyGoal,
  syncProgressToServer,
} from '../src/stores/app';
import { useI18n } from './hooks/useI18n';

interface ProgressData {
  todayKm: number;
  dailyGoal: number;
  totalKm: number;
  stageName: string;
  stageProgress: number; // 0-100
  distanceToNext: number;
}

const DEFAULT_DATA: ProgressData = {
  todayKm: 0,
  dailyGoal: 25,
  totalKm: 0,
  stageName: '',
  stageProgress: 0,
  distanceToNext: 0,
};

/**
 * CaminoProgressTracker — interactive progress bar showing today's km,
 * daily goal, and overall Camino progress. Uses nanostores for state.
 */
export function CaminoProgressTracker() {
  const { t } = useI18n();
  const [data, setData] = useState<ProgressData>(DEFAULT_DATA);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(String(data.dailyGoal));

  // Subscribe to nanostores
  const progress = useStore(currentStageProgress);
  const goal = useStore(dailyGoalKm);

  useEffect(() => {
    // Sync with nanostores on mount
    syncProgressToServer().then((serverData) => {
      if (serverData) {
        setData({
          todayKm: serverData.todayKm ?? 0,
          dailyGoal: serverData.dailyGoal ?? 25,
          totalKm: serverData.totalKm ?? 0,
          stageName: serverData.stageName ?? '',
          stageProgress: serverData.stageProgress ?? 0,
          distanceToNext: serverData.distanceToNext ?? 0,
        });
      }
    });
  }, []);

  useEffect(() => {
    setGoalInput(String(goal));
  }, [goal]);

  const handleSaveGoal = () => {
    const parsed = parseInt(goalInput, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 100) {
      setDailyGoal(parsed);
      setIsEditingGoal(false);
    }
  };

  const progressPercent = Math.min(100, (data.todayKm / data.dailyGoal) * 100);

  return (
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title flex items-center gap-2">
          <span>📊</span>
          {t('dashboard.progress') || 'Progreso de Hoy'}
        </h2>

        {/* Daily progress bar */}
        <div class="mt-4">
          <div class="flex justify-between text-sm mb-1">
            <span>{data.todayKm} km</span>
            <span>Meta: {data.dailyGoal} km</span>
          </div>
          <div class="w-full bg-base-200 rounded-full h-4 overflow-hidden">
            <motion.div
              class="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Goal editor */}
        {isEditingGoal ? (
          <div class="flex gap-2 mt-3">
            <input
              type="number"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              min="1"
              max="100"
              class="input input-bordered input-sm flex-1"
            />
            <button class="btn btn-primary btn-sm" onClick={handleSaveGoal}>
              ✓
            </button>
            <button class="btn btn-ghost btn-sm" onClick={() => setIsEditingGoal(false)}>
              ✕
            </button>
          </div>
        ) : (
          <button class="link link-primary text-sm mt-2" onClick={() => setIsEditingGoal(true)}>
            {t('dashboard.editGoal') || 'Editar meta diaria'}
          </button>
        )}

        {/* Stage progress */}
        {data.stageName && (
          <div class="mt-6 pt-4 border-t border-base-200">
            <div class="flex justify-between text-sm mb-1">
              <span class="font-semibold">{data.stageName}</span>
              <span>{data.stageProgress}%</span>
            </div>
            <div class="w-full bg-base-200 rounded-full h-3 overflow-hidden">
              <motion.div
                class="h-full bg-secondary"
                initial={{ width: 0 }}
                animate={{ width: `${data.stageProgress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <p class="text-xs text-base-content/60 mt-1">
              {data.distanceToNext} km hasta la siguiente etapa
            </p>
          </div>
        )}

        {/* Total km */}
        <div class="flex justify-between items-center mt-4">
          <span class="text-sm text-base-content/60">Total acumulado</span>
          <span class="text-2xl font-bold text-primary">{data.totalKm} km</span>
        </div>
      </div>
    </div>
  );
}

export default CaminoProgressTracker;
