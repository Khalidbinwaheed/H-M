import { create } from "zustand";
import { Notification, NotificationType } from "@/types";

interface NotificationItem extends Notification {}

interface UIState {
  // Notifications
  notifications: NotificationItem[];
  addNotification: (notification: Omit<NotificationItem, "id" | "createdAt">) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  
  // Modals
  openModals: Record<string, boolean>;
  openModal: (key: string) => void;
  closeModal: (key: string) => void;
  toggleModal: (key: string) => void;
  
  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  
  // Dark Mode
  darkMode: boolean | "system";
  setDarkMode: (mode: boolean | "system") => void;
  
  // Selected Items
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  addSelectedId: (id: string) => void;
  removeSelectedId: (id: string) => void;
  clearSelectedIds: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  // Notifications
  notifications: [],

  addNotification: (notification) => {
    const id = crypto.randomUUID();
    const newNotification: NotificationItem = {
      id,
      ...notification,
      createdAt: new Date(),
    } as NotificationItem;

    set((state) => ({
      notifications: [newNotification, ...state.notifications].slice(0, 10), // Keep last 10
    }));

    // Auto remove after 5 seconds
    if (notification.type !== "system_alert") {
      setTimeout(() => {
        get().removeNotification(id);
      }, 5000);
    }
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  },

  // Modals
  openModals: {},

  openModal: (key) => {
    set((state) => ({
      openModals: { ...state.openModals, [key]: true },
    }));
  },

  closeModal: (key) => {
    set((state) => ({
      openModals: { ...state.openModals, [key]: false },
    }));
  },

  toggleModal: (key) => {
    set((state) => ({
      openModals: { ...state.openModals, [key]: !state.openModals[key] },
    }));
  },

  // Sidebar
  sidebarOpen: true,

  toggleSidebar: () => {
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    }));
  },

  // Dark Mode
  darkMode: "system",

  setDarkMode: (mode) => {
    set({ darkMode: mode });
  },

  // Selected Items
  selectedIds: [],

  setSelectedIds: (ids) => {
    set({ selectedIds: ids });
  },

  addSelectedId: (id) => {
    set((state) => ({
      selectedIds: [...new Set([...state.selectedIds, id])],
    }));
  },

  removeSelectedId: (id) => {
    set((state) => ({
      selectedIds: state.selectedIds.filter((sid) => sid !== id),
    }));
  },

  clearSelectedIds: () => {
    set({ selectedIds: [] });
  },
}));
