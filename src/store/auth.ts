import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, UserRole } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  clearError: () => void;
  hasRole: (role: UserRole) => boolean;
}

const supabase = createClient();

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const normalizedEmail = email.trim().toLowerCase();
          if (!normalizedEmail || !password) {
            throw new Error("Email and password are required");
          }

          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password: password,
          });

          if (authError) {
            throw new Error(authError.message);
          }

          if (!authData.user) {
            throw new Error("Invalid credentials");
          }

          const { data: profile, error: profileError } = await supabase
            .from("users")
            .select("id, email, full_name, role, avatar_url, is_active, created_at, updated_at")
            .eq("email", normalizedEmail)
            .eq("is_active", true)
            .maybeSingle();

          if (profileError) {
            throw profileError;
          }

          if (!profile) {
            throw new Error("User profile not found or inactive");
          }

          set({
            user: {
              id: profile.id,
              email: profile.email,
              name: profile.full_name,
              role: profile.role as UserRole,
              avatar: profile.avatar_url ?? undefined,
              isActive: profile.is_active,
              createdAt: new Date(profile.created_at),
              updatedAt: new Date(profile.updated_at),
              lastLogin: new Date(),
            },
            token: authData.session.access_token,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Login failed",
            loading: false,
          });
          throw error;
        }
      },

      signup: async (name: string, email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const normalizedEmail = email.trim().toLowerCase();
          if (!name || !normalizedEmail || !password) {
            throw new Error("Name, email and password are required");
          }

          // 1. Sign up with Supabase Auth
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: normalizedEmail,
            password: password,
            options: {
              data: { full_name: name }
            }
          });

          if (authError) {
            throw new Error(authError.message);
          }

          if (!authData.user) {
            throw new Error("Failed to create account");
          }

          // 2. We no longer manually insert the profile. 
          // A Supabase database trigger handles it automatically securely!

          // 3. Log the user in (if a session was returned immediately)
          if (authData.session) {
            // Fetch the profile created by the trigger
            const { data: profile, error: profileError } = await supabase
              .from("users")
              .select("id, email, full_name, role, avatar_url, is_active, created_at, updated_at")
              .eq("id", authData.user.id)
              .single();

            if (profileError) {
              console.error("Profile fetch error:", profileError);
              throw new Error("Account created but failed to load profile: " + profileError.message);
            }

            set({
              user: {
                id: profile.id,
                email: profile.email,
                name: profile.full_name,
                role: profile.role as UserRole,
                avatar: profile.avatar_url ?? undefined,
                isActive: profile.is_active,
                createdAt: new Date(profile.created_at),
                updatedAt: new Date(profile.updated_at),
                lastLogin: new Date(),
              },
              token: authData.session.access_token,
              isAuthenticated: true,
              loading: false,
            });
          } else {
            // Some configurations require email confirmation
            set({ loading: false });
            throw new Error("Account created! Please verify your email before logging in.");
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Signup failed",
            loading: false,
          });
          throw error;
        }
      },

      logout: () => {
        supabase.auth.signOut().catch(console.error);
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setUser: (user) => {
        set({ user, isAuthenticated: user !== null });
      },

      setToken: (token) => {
        set({ token, isAuthenticated: token !== null });
      },

      clearError: () => {
        set({ error: null });
      },

      hasRole: (role) => {
        const currentUser = get().user;
        if (currentUser?.role === "Super Admin") return true;
        return currentUser?.role === role;
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
