import { create } from "zustand";
import { Charger } from "@/types";
import {
  createCharger,
  deleteCharger,
  deleteManyChargers,
  updateCharger,
} from "@/lib/supabase/realtime-data";

interface ChargerState {
  chargers: Charger[];
  loading: boolean;
  error: string | null;
  setAll: (chargers: Charger[]) => void;
  add: (c: Charger) => void;
  update: (id: string, c: Partial<Charger>) => void;
  remove: (id: string) => void;
  removeMany: (ids: string[]) => void;
  getById: (id: string) => Charger | undefined;
  getByType: (type: string) => Charger[];
  getLowStock: () => Charger[];
}

export const useChargerStore = create<ChargerState>((set, get) => ({
  chargers: [],
  loading: false,
  error: null,

  setAll: (chargers) => set({ chargers }),

  add: (c) => {
    set((s) => ({ chargers: [c, ...s.chargers] }));
    createCharger(c).then((created) => {
      set((s) => ({ chargers: [created as Charger, ...s.chargers.filter((x) => x.id !== c.id)] }));
    }).catch((error: unknown) => {
      set({ error: error instanceof Error ? error.message : "Failed to add charger" });
    });
  },

  update: (id, patch) => {
    set((s) => ({
      chargers: s.chargers.map((x) => (x.id === id ? { ...x, ...patch, updatedAt: new Date() } : x)),
    }));
    updateCharger(id, patch).then((updated) => {
      set((s) => ({
        chargers: s.chargers.map((x) => (x.id === id ? (updated as Charger) : x)),
      }));
    }).catch((error: unknown) => {
      set({ error: error instanceof Error ? error.message : "Failed to update charger" });
    });
  },

  remove: (id) => {
    const previous = get().chargers;
    set((s) => ({ chargers: s.chargers.filter((x) => x.id !== id) }));
    deleteCharger(id).catch((error: unknown) => {
      set({
        chargers: previous,
        error: error instanceof Error ? error.message : "Failed to remove charger",
      });
    });
  },

  removeMany: (ids) => {
    const previous = get().chargers;
    set((s) => ({ chargers: s.chargers.filter((x) => !ids.includes(x.id)) }));
    deleteManyChargers(ids).catch((error: unknown) => {
      set({
        chargers: previous,
        error: error instanceof Error ? error.message : "Failed to remove chargers",
      });
    });
  },

  getById: (id) => get().chargers.find((x) => x.id === id),

  getByType: (type) => get().chargers.filter((x) => x.type === type),

  getLowStock: () => get().chargers.filter((x) => x.stockStatus === "Low Stock" || x.stockStatus === "Out of Stock"),
}));
