// API client for backend communication
// In production, this would connect to your actual backend

import { ApiResponse, Laptop, Customer, Order, Charger, PaginatedResponse, PaginationParams } from "@/types";

const API_BASE_URL = process.env.VITE_API_URL || "http://localhost:3000/api";

// ==================== HELPERS ====================

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "An error occurred" }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(`${key}[]`, String(v)));
      } else {
        searchParams.set(key, String(value));
      }
    }
  });
  return searchParams.toString();
}

// ==================== LAPTOPS ====================

export const laptopAPI = {
  async getAll(params?: PaginationParams & Record<string, any>): Promise<PaginatedResponse<Laptop>> {
    const query = params ? `?${buildQueryString(params)}` : "";
    const response = await fetch(`${API_BASE_URL}/laptops${query}`);
    return handleResponse(response);
  },

  async getById(id: string): Promise<Laptop> {
    const response = await fetch(`${API_BASE_URL}/laptops/${id}`);
    const data = await handleResponse<Laptop>(response);
    return data.data!;
  },

  async create(laptop: Omit<Laptop, "id" | "createdAt" | "updatedAt">): Promise<Laptop> {
    const response = await fetch(`${API_BASE_URL}/laptops`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(laptop),
    });
    const data = await handleResponse<Laptop>(response);
    return data.data!;
  },

  async update(id: string, updates: Partial<Laptop>): Promise<Laptop> {
    const response = await fetch(`${API_BASE_URL}/laptops/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const data = await handleResponse<Laptop>(response);
    return data.data!;
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/laptops/${id}`, {
      method: "DELETE",
    });
    await handleResponse(response);
  },

  async bulkDelete(ids: string[]): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/laptops/bulk/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    await handleResponse(response);
  },
};

// ==================== CHARGERS ====================

export const chargerAPI = {
  async getAll(params?: PaginationParams & Record<string, any>): Promise<PaginatedResponse<Charger>> {
    const query = params ? `?${buildQueryString(params)}` : "";
    const response = await fetch(`${API_BASE_URL}/chargers${query}`);
    return handleResponse(response);
  },

  async getById(id: string): Promise<Charger> {
    const response = await fetch(`${API_BASE_URL}/chargers/${id}`);
    const data = await handleResponse<Charger>(response);
    return data.data!;
  },

  async create(charger: Omit<Charger, "id" | "createdAt" | "updatedAt">): Promise<Charger> {
    const response = await fetch(`${API_BASE_URL}/chargers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(charger),
    });
    const data = await handleResponse<Charger>(response);
    return data.data!;
  },

  async update(id: string, updates: Partial<Charger>): Promise<Charger> {
    const response = await fetch(`${API_BASE_URL}/chargers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const data = await handleResponse<Charger>(response);
    return data.data!;
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/chargers/${id}`, {
      method: "DELETE",
    });
    await handleResponse(response);
  },
};

// ==================== CUSTOMERS ====================

export const customerAPI = {
  async getAll(params?: PaginationParams & Record<string, any>): Promise<PaginatedResponse<Customer>> {
    const query = params ? `?${buildQueryString(params)}` : "";
    const response = await fetch(`${API_BASE_URL}/customers${query}`);
    return handleResponse(response);
  },

  async getById(id: string): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`);
    const data = await handleResponse<Customer>(response);
    return data.data!;
  },

  async create(customer: Omit<Customer, "id" | "createdAt" | "updatedAt">): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer),
    });
    const data = await handleResponse<Customer>(response);
    return data.data!;
  },

  async update(id: string, updates: Partial<Customer>): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const data = await handleResponse<Customer>(response);
    return data.data!;
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: "DELETE",
    });
    await handleResponse(response);
  },
};

// ==================== ORDERS ====================

export const orderAPI = {
  async getAll(params?: PaginationParams & Record<string, any>): Promise<PaginatedResponse<Order>> {
    const query = params ? `?${buildQueryString(params)}` : "";
    const response = await fetch(`${API_BASE_URL}/orders${query}`);
    return handleResponse(response);
  },

  async getById(id: string): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`);
    const data = await handleResponse<Order>(response);
    return data.data!;
  },

  async create(order: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    const data = await handleResponse<Order>(response);
    return data.data!;
  },

  async update(id: string, updates: Partial<Order>): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const data = await handleResponse<Order>(response);
    return data.data!;
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: "DELETE",
    });
    await handleResponse(response);
  },
};

// ==================== AUTH ====================

export const authAPI = {
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  async logout() {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
    });
    return handleResponse(response);
  },

  async forgotPassword(email: string) {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return handleResponse(response);
  },

  async resetPassword(token: string, newPassword: string) {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });
    return handleResponse(response);
  },
};

// ==================== ANALYTICS ====================

export const analyticsAPI = {
  async getDashboardMetrics() {
    const response = await fetch(`${API_BASE_URL}/analytics/dashboard`);
    return handleResponse(response);
  },

  async getSalesMetrics(startDate: Date, endDate: Date) {
    const query = buildQueryString({ startDate, endDate });
    const response = await fetch(`${API_BASE_URL}/analytics/sales?${query}`);
    return handleResponse(response);
  },

  async getTopProducts(limit: number = 10) {
    const response = await fetch(`${API_BASE_URL}/analytics/top-products?limit=${limit}`);
    return handleResponse(response);
  },
};
