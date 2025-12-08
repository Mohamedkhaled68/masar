import { create } from "zustand";
import Cookies from "js-cookie";

export type UserRole = "teacher" | "school" | "admin" | null;

interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
}

interface AuthStore {
    token: string | null;
    user: User | null;
    role: UserRole;
    isAuthenticated: boolean;

    // Actions
    setAuth: (token: string, user: User, role: UserRole) => void;
    logout: () => void;
    updateUser: (user: Partial<User>) => void;
    initializeAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    token: null,
    user: null,
    role: null,
    isAuthenticated: false,

    setAuth: (token, user, role) => {
        // Store token in cookies (expires in 7 days)
        Cookies.set("accessToken", token, { expires: 7, sameSite: "strict" });
        Cookies.set("userRole", role || "", { expires: 7, sameSite: "strict" });
        Cookies.set("user", JSON.stringify(user), {
            expires: 7,
            sameSite: "strict",
        });

        set({
            token,
            user,
            role,
            isAuthenticated: true,
        });
    },

    logout: () => {
        // Clear cookies
        Cookies.remove("accessToken");
        Cookies.remove("userRole");
        Cookies.remove("user");

        set({
            token: null,
            user: null,
            role: null,
            isAuthenticated: false,
        });

        // Redirect to home page
        if (typeof window !== "undefined") {
            window.location.href = "/";
        }
    },

    updateUser: (userData) =>
        set((state) => {
            const updatedUser = state.user
                ? { ...state.user, ...userData }
                : null;
            if (updatedUser) {
                Cookies.set("user", JSON.stringify(updatedUser), {
                    expires: 7,
                    sameSite: "strict",
                });
            }
            return { user: updatedUser };
        }),

    initializeAuth: () => {
        // Initialize auth state from cookies on app load
        const token = Cookies.get("accessToken");
        const role = Cookies.get("userRole") as UserRole;
        const userStr = Cookies.get("user");

        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                set({
                    token,
                    user,
                    role: role || null,
                    isAuthenticated: true,
                });
            } catch (error) {
                // Invalid cookie data, clear everything
                Cookies.remove("accessToken");
                Cookies.remove("userRole");
                Cookies.remove("user");
            }
        }
    },
}));
