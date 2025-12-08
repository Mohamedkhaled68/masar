"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, UserRole } from "@/lib/store/authStore";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
    redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles,
    redirectTo = "/login",
}) => {
    const router = useRouter();
    const { role, isAuthenticated } = useAuthStore();

    useEffect(() => {
        // Check if user is authenticated
        if (!isAuthenticated) {
            router.push(redirectTo);
            return;
        }

        // Check if user has allowed role
        if (!allowedRoles.includes(role)) {
            // Redirect based on actual role
            if (role === "admin") {
                router.push("/admin/dashboard");
            } else if (role === "teacher") {
                router.push("/teacher/profile");
            } else if (role === "school") {
                router.push("/school/home");
            } else {
                router.push(redirectTo);
            }
        }
    }, [isAuthenticated, role, allowedRoles, router, redirectTo]);

    // Don't render children if not authenticated or wrong role
    if (!isAuthenticated || !allowedRoles.includes(role)) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-zinc-400">جاري التحقق من الصلاحيات...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
