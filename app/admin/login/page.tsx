"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authAPI } from "@/lib/api/axios";
import { useAuthStore } from "@/lib/store/authStore";
import { Shield, AlertCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function AdminLoginPage() {
    const router = useRouter();
    const { setAuth } = useAuthStore();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!formData.email.trim()) {
            toast.error("البريد الإلكتروني مطلوب", {
                duration: 3000,
                position: "top-center",
                style: {
                    background: "#18181b",
                    color: "#fff",
                    border: "1px solid #ef4444",
                },
            });
            return;
        }
        if (!formData.password) {
            toast.error("كلمة المرور مطلوبة", {
                duration: 3000,
                position: "top-center",
                style: {
                    background: "#18181b",
                    color: "#fff",
                    border: "1px solid #ef4444",
                },
            });
            return;
        }

        setLoading(true);

        try {
            const response = await authAPI.loginAdmin(formData);
            const { accessToken, user } = response.data.data;

            // Map user data to match our store structure
            const mappedUser = {
                id: user._id,
                email: user.email || "",
                name: user.fullName || user.name || "",
                role: user.role,
            };

            // Store auth data
            setAuth(accessToken, mappedUser, "admin");

            toast.success("تم تسجيل الدخول بنجاح!", {
                duration: 2000,
                position: "top-center",
                style: {
                    background: "#18181b",
                    color: "#fff",
                    border: "1px solid #22c55e",
                },
            });

            // Redirect to admin dashboard
            setTimeout(() => {
                router.push("/admin/dashboard");
            }, 500);
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message ||
                "فشل تسجيل الدخول. تحقق من البيانات المدخلة";
            setError(errorMessage);
            toast.error(errorMessage, {
                duration: 4000,
                position: "top-center",
                style: {
                    background: "#18181b",
                    color: "#fff",
                    border: "1px solid #ef4444",
                },
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col">
            <Toaster />
            {/* Header */}
            <nav className="border-b border-zinc-800">
                <div className="container mx-auto px-4 py-6">
                    <Link href="/">
                        <Image
                            src="/logo.svg"
                            alt="مسار"
                            width={192}
                            height={64}
                            className="h-12 w-auto object-contain cursor-pointer"
                            priority
                        />
                    </Link>
                </div>
            </nav>

            {/* Login Form */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                        {/* Icon & Title */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400/10 rounded-full mb-4">
                                <Shield className="w-8 h-8 text-yellow-400" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                تسجيل دخول الأدمن
                            </h1>
                            <p className="text-zinc-400">
                                لوحة التحكم الإدارية
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-white mb-2"
                                >
                                    البريد الإلكتروني
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            email: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                                    placeholder="admin@masar.com"
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-white mb-2"
                                >
                                    كلمة المرور
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            password: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-400/20"
                            >
                                {loading
                                    ? "جاري تسجيل الدخول..."
                                    : "تسجيل دخول الأدمن"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
