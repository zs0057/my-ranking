import { create } from "zustand";
import { fetchWeightDifferences } from "./fetchUser";

interface WeightDifference {
  userId: number;
  weightDifference: number;
}

interface BearState {
  id: number;
  bears: WeightDifference[];
  setId: (id: number) => void;
  fetchAndSetUsers: (roomId: number) => Promise<void>;
}

const useStore = create<BearState>((set) => ({
  id: 0,
  bears: [],
  setId: (id: number) => set({ id }),
  fetchAndSetUsers: async (roomId: number) => {
    const ids = await fetchWeightDifferences(roomId);
    set({ bears: ids });
  },
}));

export default useStore;
