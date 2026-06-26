import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { COMPLETION_RETENTION_DAYS, MAX_STREAK_DAYS } from '@/constants/dataRetention';
import { getSupabase } from '@/lib/supabase';
import type { Routine } from '@/types';
import { localDateStr } from '@/utils/dateFormat';
import { isRoutineScheduledForDate } from '@/utils/routineSchedule';

function makeKey(routineId: string, date: string) {
  return `${date}:${routineId}`;
}

type RoutineCompletionStore = {
  completions: Record<string, number>;
  toggleCompletion: (routineId: string, date: string) => void;
  isCompleted: (routineId: string, date: string) => boolean;
  getCompletedIds: (date: string) => string[];
  getStreak: (routineId: string, routine: Routine) => number;
  clearOldCompletions: () => void;
};

export const useRoutineCompletionStore = create<RoutineCompletionStore>()(
  persist(
    (set, get) => ({
      completions: {},

      toggleCompletion: (routineId, date) => {
        const key = makeKey(routineId, date);
        const wasCompleted = !!get().completions[key];
        set((s) => {
          const next = { ...s.completions };
          if (next[key]) {
            delete next[key];
          } else {
            next[key] = Date.now();
          }
          return { completions: next };
        });
        if (wasCompleted) {
          const supabase = getSupabase();
          if (supabase) {
            void supabase.from('routine_completions').delete().eq('completion_key', key);
          }
        }
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

      getStreak: (routineId, routine) => {
        const { completions } = get();
        let streak = 0;
        const cursor = new Date();
        cursor.setHours(0, 0, 0, 0);

        for (let i = 0; i < MAX_STREAK_DAYS; i++) {
          if (isRoutineScheduledForDate(routine, cursor)) {
            const dateStr = localDateStr(cursor);
            if (completions[makeKey(routineId, dateStr)]) {
              streak++;
            } else if (i === 0) {
              cursor.setDate(cursor.getDate() - 1);
              continue;
            } else {
              break;
            }
          }
          cursor.setDate(cursor.getDate() - 1);
        }
        return streak;
      },

      clearOldCompletions: () => {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - COMPLETION_RETENTION_DAYS);
        const cutoffStr = localDateStr(cutoff);
        set((s) => {
          const next: Record<string, number> = {};
          for (const [key, ts] of Object.entries(s.completions)) {
            if (key.slice(0, 10) >= cutoffStr) {
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
