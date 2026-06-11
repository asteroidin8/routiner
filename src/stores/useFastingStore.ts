import { create } from 'zustand';

export type FastingStatus = 'idle' | 'fasting';

type FastingStore = {
  status: FastingStatus;
  startedAt: number | null; // Unix timestamp (ms)
  goalHours: number; // 목표 단식 시간 (기본 16시간)
  startFasting: () => void;
  stopFasting: () => void;
  setGoalHours: (hours: number) => void;
};

export const useFastingStore = create<FastingStore>((set) => ({
  status: 'idle',
  startedAt: null,
  goalHours: 16,
  startFasting: () => set({ status: 'fasting', startedAt: Date.now() }),
  stopFasting: () => set({ status: 'idle', startedAt: null }),
  setGoalHours: (hours) => set({ goalHours: hours }),
}));
