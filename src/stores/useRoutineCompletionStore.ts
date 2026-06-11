import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type RoutineCompletionStore = {
  // key: 'YYYY-MM-DD:routineId' → completed timestamp
  completions: Record<string, number>;
  toggleCompletion: (routineId: string, date: string) => void;
  isCompleted: (routineId: string, date: string) => boolean;
  getCompletedIds: (date: string) => string[];
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
