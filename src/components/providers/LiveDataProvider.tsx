import { useEffect } from "react";
import { useLaptopStore } from "@/store/laptops";
import { useChargerStore } from "@/store/chargers";
import { useCustomerStore } from "@/store/customers";
import { useOrderStore } from "@/store/orders";
import {
  fetchLaptops,
  fetchChargers,
  fetchCustomers,
  fetchOrders,
  subscribeTable,
} from "@/lib/supabase/realtime-data";

export function LiveDataProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let active = true;

    const loadAll = async () => {
      try {
        const [laptops, chargers, customers, orders] = await Promise.all([
          fetchLaptops(),
          fetchChargers(),
          fetchCustomers(),
          fetchOrders(),
        ]);

        if (!active) {
          return;
        }

        useLaptopStore.getState().setAll(laptops as any[]);
        useChargerStore.getState().setAll(chargers as any[]);
        useCustomerStore.getState().setAll(customers as any[]);
        useOrderStore.getState().setAll(orders as any[]);
      } catch {
        // Store-level errors are handled in specific write actions.
      }
    };

    loadAll();

    const unsubscribers = [
      subscribeTable("laptops", loadAll),
      subscribeTable("chargers", loadAll),
      subscribeTable("customers", loadAll),
      subscribeTable("orders", loadAll),
      subscribeTable("order_items", loadAll),
      subscribeTable("inventory_imports", loadAll),
      subscribeTable("inventory_exports", loadAll),
    ];

    return () => {
      active = false;
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  return <>{children}</>;
}
