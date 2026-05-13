import { create } from "zustand";
import { Customer } from "@/types";
import {
  createCustomer,
  deleteCustomer,
  deleteManyCustomers,
  updateCustomer,
} from "@/lib/supabase/realtime-data";

interface CustomerState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  setAll: (customers: Customer[]) => void;
  add: (c: Customer) => void;
  update: (id: string, c: Partial<Customer>) => void;
  remove: (id: string) => void;
  removeMany: (ids: string[]) => void;
  getById: (id: string) => Customer | undefined;
  getByType: (type: "B2B" | "B2C") => Customer[];
  getB2BCustomers: () => Customer[];
  getB2CCustomers: () => Customer[];
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  loading: false,
  error: null,

  setAll: (customers) => set({ customers }),

  add: (c) => {
    set((s) => ({ customers: [c, ...s.customers] }));
    createCustomer(c).then((created) => {
      set((s) => ({ customers: [created as Customer, ...s.customers.filter((x) => x.id !== c.id)] }));
    }).catch((error: unknown) => {
      set({ error: error instanceof Error ? error.message : "Failed to add customer" });
    });
  },

  update: (id, patch) => {
    set((s) => ({
      customers: s.customers.map((x) => (x.id === id ? { ...x, ...patch, updatedAt: new Date() } : x)),
    }));
    updateCustomer(id, patch).then((updated) => {
      set((s) => ({
        customers: s.customers.map((x) => (x.id === id ? (updated as Customer) : x)),
      }));
    }).catch((error: unknown) => {
      set({ error: error instanceof Error ? error.message : "Failed to update customer" });
    });
  },

  remove: (id) => {
    const previous = get().customers;
    set((s) => ({ customers: s.customers.filter((x) => x.id !== id) }));
    deleteCustomer(id).catch((error: unknown) => {
      set({
        customers: previous,
        error: error instanceof Error ? error.message : "Failed to remove customer",
      });
    });
  },

  removeMany: (ids) => {
    const previous = get().customers;
    set((s) => ({ customers: s.customers.filter((x) => !ids.includes(x.id)) }));
    deleteManyCustomers(ids).catch((error: unknown) => {
      set({
        customers: previous,
        error: error instanceof Error ? error.message : "Failed to remove customers",
      });
    });
  },

  getById: (id) => get().customers.find((x) => x.id === id),

  getByType: (type) => get().customers.filter((x) => x.type === type),

  getB2BCustomers: () => get().customers.filter((x) => x.type === "B2B"),

  getB2CCustomers: () => get().customers.filter((x) => x.type === "B2C"),
}));
