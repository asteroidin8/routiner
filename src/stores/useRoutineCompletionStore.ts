import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type RoutineCompletionStore = {
  // key: 'YYYY-MM-DD:routineId' → completed timestamp
  completions: Record<string, number>;
  toggleCompletion: (routineId: string, date: string) => void;
  isCompleted: (routineId: string, date: string) => boolean;
  getCompletedIds: (date: string) => string[];
  /** 특정 루틴의 연속 달성 일수 (오늘 기준 역방향) */
  getStreak: (routineId: string, repeatDays: number[]) => number;
  clearOldCompletions: () => void;
};

function makeKey(routineId: string, date: string) {
  return `${date}:${routineId}`;
}

export const useRoutineCompletionStore = create<RoutineCompletionStore>()(
  persist(
    (set, get) => ({
      completions: {},

      toggleCompletion: (routineId, date) => {
        const key = makeKey(routineId, date);
        set((state) => {
          const next = { ...state.completions };
          if (next[key]) {
            delete next[key];
          } else {
            next[key] = Date.now();
          }
          return { completions: next };
        });
      },

      isCompleted: (routineId, date) => {
        return !!get().completions[makeKey(routineId, date)];
      },

      getCompletedIds: (date) => {
        const prefix = `${date}:`;
        return Object.keys(get().completions)
          .filter((k) => k.startsWith(prefix))
          .map((k) => k.slice(prefix.length));
      },

      getStreak: (routineId, repeatDays) => {
        const { completions } = get();
        let streak = 0;
        const cursor = new Date();
        cursor.setHours(0, 0, 0, 0);
        // 최대 365일 역방향으로 탐색
        for (let i = 0; i < 365; i++) {
          const dayOfWeek = cursor.getDay();
          if (repeatDays.includes(dayOfWeek)) {
            const dateStr = cursor.toISOString().slice(0, 10);
            if (completions[`${dateStr}:${routineId}`]) {
              streak++;
            } else {
              // 오늘이면 아직 미완료일 수 있으므로 건너뜀
              if (i === 0) {
                cursor.setDate(cursor.getDate() - 1);
                continue;
              }
              break;
            }
          }
          cursor.setDate(cursor.getDate() - 1);
        }
        return streak;
      },

      // 30일 이상 지난 완료 기록 정리
      clearOldCompletions: () => {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 30);
        const cutoffStr = cutoff.toISOString().slice(0, 10);
        set((state) => {
          const next: Record<string, number> = {};
          for (const [key, ts] of Object.entries(state.completions)) {
            const date = key.slice(0, 10);
            if (date >= cutoffStr) {
              next[key] = ts;
            }
          }
          return { completions: next };
        });
      },
    }),
    {
      name: 'routine-completion-store',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
