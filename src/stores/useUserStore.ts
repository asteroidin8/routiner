import { create } from 'zustand';

type UserStore = {
  heightCm: number | null;
  weightKg: number | null;
  targetWeightKg: number | null;
  setHeight: (cm: number) => void;
  setWeight: (kg: number) => void;
  setTargetWeight: (kg: number) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  heightCm: null,
  weightKg: null,
  targetWeightKg: null,
  setHeight: (cm) => set({ heightCm: cm }),
  setWeight: (kg) => set({ weightKg: kg }),
  setTargetWeight: (kg) => set({ targetWeightKg: kg }),
}));
