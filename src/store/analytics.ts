import { create } from "zustand";
import { AnalyticsData, DailySalesMetrics, TopSellingProduct } from "@/types";
import { useLaptopStore } from "./laptops";
import { useChargerStore } from "./chargers";
import { useOrderStore } from "./orders";
import { useCustomerStore } from "./customers";

interface AnalyticsState {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchAnalytics: () => void;
  getMetrics: () => AnalyticsData;
}

function calculateAnalytics(): AnalyticsData {
  const laptops = useLaptopStore.getState().laptops;
  const chargers = useChargerStore.getState().chargers;
  const orders = useOrderStore.getState().orders;
  const customers = useCustomerStore.getState().customers;

  const totalLaptops = laptops.length;
  const totalChargers = chargers.length;
  const totalCustomers = customers.length;
  
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalProfit = orders.reduce((sum, order) => {
    const cost = order.items.reduce((itemSum, item) => {
      const laptop = laptops.find((l) => l.id === item.laptopId);
      return itemSum + (laptop?.purchasePrice || 0) * item.quantity;
    }, 0);
    return sum + (order.total - cost);
  }, 0);
  
  const totalOrders = orders.length;
  const lowStockAlerts = laptops.filter((l) => l.currentQuantity <= l.reorderLevel).length;

  // Group orders by date
  const dailyMetrics: Record<string, DailySalesMetrics> = {};
  orders.forEach((order) => {
    const dateStr = order.createdAt.toISOString().split("T")[0];
    if (!dailyMetrics[dateStr]) {
      dailyMetrics[dateStr] = {
        date: order.createdAt,
        totalSales: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalProfit: 0,
        newCustomers: 0,
        avgOrderValue: 0,
      };
    }
    dailyMetrics[dateStr].totalOrders += 1;
    dailyMetrics[dateStr].totalRevenue += order.total;
  });

  // Top selling products
  const productSales: Record<string, TopSellingProduct> = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      const laptop = laptops.find((l) => l.id === item.laptopId);
      if (laptop) {
        if (!productSales[laptop.id]) {
          productSales[laptop.id] = {
            laptopId: laptop.id,
            name: laptop.name,
            brand: laptop.brand,
            totalQuantity: 0,
            totalRevenue: 0,
            imageUrl: laptop.thumbnail,
          };
        }
        productSales[laptop.id].totalQuantity += item.quantity;
        productSales[laptop.id].totalRevenue += item.unitPrice * item.quantity;
      }
    });
  });

  const topSellingProducts = Object.values(productSales)
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10);

  // Brand distribution
  const brandDistribution = laptops.reduce(
    (acc, laptop) => {
      const existing = acc.find((b) => b.brand === laptop.brand);
      if (existing) {
        existing.count += 1;
        existing.revenue += laptop.sellingPrice;
      } else {
        acc.push({
          brand: laptop.brand,
          count: 1,
          revenue: laptop.sellingPrice,
        });
      }
      return acc;
    },
    [] as Array<{ brand: string; count: number; revenue: number }>
  );

  // B2B vs B2C
  const b2bOrders = orders.filter((o) => {
    const customer = customers.find((c) => c.id === o.customerId);
    return customer?.type === "B2B";
  });
  const b2cOrders = orders.filter((o) => {
    const customer = customers.find((c) => c.id === o.customerId);
    return customer?.type === "B2C";
  });

  return {
    totalLaptops,
    totalChargers,
    totalCustomers,
    totalRevenue,
    totalProfit,
    totalOrders,
    lowStockAlerts,

    dailyMetrics: Object.values(dailyMetrics),
    topSellingProducts,

    brandDistribution,

    b2bVsB2c: {
      b2b: {
        orders: b2bOrders.length,
        revenue: b2bOrders.reduce((sum, o) => sum + o.total, 0),
        customers: customers.filter((c) => c.type === "B2B").length,
      },
      b2c: {
        orders: b2cOrders.length,
        revenue: b2cOrders.reduce((sum, o) => sum + o.total, 0),
        customers: customers.filter((c) => c.type === "B2C").length,
      },
    },
  };
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  data: null,
  loading: false,
  error: null,

  fetchAnalytics: () => {
    try {
      set({ loading: true, error: null });
      const data = calculateAnalytics();
      set({ data, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch analytics",
        loading: false,
      });
    }
  },

  getMetrics: () => {
    const currentData = get().data;
    if (currentData) return currentData;
    const data = calculateAnalytics();
    set({ data });
    return data;
  },
}));
