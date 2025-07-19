import { create } from "zustand";

const useAuthStore = create((set) => ({
  trainerId: null,
  email: null,
  Name:null,
  setTrainer: (trainerId, email,Name) => set({ trainerId, email,Name}),
  clearTrainer: () => set({ trainerId: null, email: null,Name:null }),
}));

export default useAuthStore;
