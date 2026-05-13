import { create } from "zustand";
import { Order } from "@/types";

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  setAll: (orders: Order[]) => void;
  add: (o: Order) => void;
  update: (id: string, o: Partial<Order>) => void;
  remove: (id: string) => void;
  removeMany: (ids: string[]) => void;
  getById: (id: string) => Order | undefined;
  getByCustomerId: (customerId: string) => Order[];
  getByStatus: (status: string) => Order[];
  getRecentOrders: (limit: number) => Order[];
  getTotalRevenue: () => number;
  getTotalProfit: () => number;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  loading: false,
  error: null,

  setAll: (orders) => set({ orders }),

  add: (o) =>
    set((s) => ({
      orders: [o, ...s.orders],
    })),

  update: (id, patch) =>
    set((s) => ({
      orders: s.orders.map((x) => (x.id === id ? { ...x, ...patch, updatedAt: new Date() } : x)),
    })),

  remove: (id) =>
    set((s) => ({
      orders: s.orders.filter((x) => x.id !== id),
    })),

  removeMany: (ids) =>
    set((s) => ({
      orders: s.orders.filter((x) => !ids.includes(x.id)),
    })),

  getById: (id) => get().orders.find((x) => x.id === id),

  getByCustomerId: (customerId) => get().orders.filter((x) => x.customerId === customerId),

  getByStatus: (status) => get().orders.filter((x) => x.status === status),

  getRecentOrders: (limit = 10) => {
    const sorted = [...get().orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return sorted.slice(0, limit);
  },

  getTotalRevenue: () => get().orders.reduce((sum, order) => sum + order.total, 0),

  getTotalProfit: () => {
    return get().orders.reduce((sum, order) => sum + (order.total - order.subtotal), 0);
  },
}));
