import { create } from "zustand";
import { Laptop } from "@/types";
import {
  createLaptop,
  deleteLaptop,
  deleteManyLaptops,
  updateLaptop,
} from "@/lib/supabase/realtime-data";

interface LaptopState {
  laptops: Laptop[];
  loading: boolean;
  error: string | null;
  setAll: (laptops: Laptop[]) => void;
  add: (l: Laptop) => void;
  update: (id: string, l: Partial<Laptop>) => void;
  remove: (id: string) => void;
  removeMany: (ids: string[]) => void;
  getById: (id: string) => Laptop | undefined;
  getByBrand: (brand: string) => Laptop[];
  getLowStock: () => Laptop[];
}

export const useLaptopStore = create<LaptopState>((set, get) => ({
  laptops: [],
  loading: false,
  error: null,

  setAll: (laptops) => set({ laptops }),

  add: (l) => {
    set((s) => ({ laptops: [l, ...s.laptops] }));
    createLaptop(l).then((created) => {
      set((s) => ({ laptops: [created as Laptop, ...s.laptops.filter((x) => x.id !== l.id)] }));
    }).catch((error: unknown) => {
      set({ error: error instanceof Error ? error.message : "Failed to add laptop" });
    });
  },

  update: (id, patch) => {
    set((s) => ({
      laptops: s.laptops.map((x) => (x.id === id ? { ...x, ...patch, updatedAt: new Date() } : x)),
    }));
    updateLaptop(id, patch).then((updated) => {
      set((s) => ({
        laptops: s.laptops.map((x) => (x.id === id ? (updated as Laptop) : x)),
      }));
    }).catch((error: unknown) => {
      set({ error: error instanceof Error ? error.message : "Failed to update laptop" });
    });
  },

  remove: (id) => {
    const previous = get().laptops;
    set((s) => ({ laptops: s.laptops.filter((x) => x.id !== id) }));
    deleteLaptop(id).catch((error: unknown) => {
      set({
        laptops: previous,
        error: error instanceof Error ? error.message : "Failed to remove laptop",
      });
    });
  },

  removeMany: (ids) => {
    const previous = get().laptops;
    set((s) => ({ laptops: s.laptops.filter((x) => !ids.includes(x.id)) }));
    deleteManyLaptops(ids).catch((error: unknown) => {
      set({
        laptops: previous,
        error: error instanceof Error ? error.message : "Failed to remove laptops",
      });
    });
  },

  getById: (id) => get().laptops.find((x) => x.id === id),

  getByBrand: (brand) => get().laptops.filter((x) => x.brand === brand),

  getLowStock: () => get().laptops.filter((x) => x.currentQuantity <= x.reorderLevel),
}));
