"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { authAPI } from "@/lib/api/axios";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
    const router = useRouter();
    const { setAuth } = useAuthStore();
    const [userType, setUserType] = useState<"teacher" | "school">("teacher");
    const [formData, setFormData] = useState({
        phoneNumber: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!formData.phoneNumber.trim()) {
            toast.error("رقم الهاتف مطلوب", {
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
            const loginFn =
                userType === "teacher"
                    ? authAPI.loginTeacher
                    : authAPI.loginSchool;
            const response = await loginFn(formData);
            const { accessToken, user } = response.data.data;

            // Map user data to match our store structure
            const mappedUser = {
                id: user._id,
                email: user.email || "",
                name: user.fullName || user.managerName || "",
                role: user.role,
            };

            // Store auth data
            setAuth(accessToken, mappedUser, userType);

            toast.success("تم تسجيل الدخول بنجاح!", {
                duration: 2000,
                position: "top-center",
                style: {
                    background: "#18181b",
                    color: "#fff",
                    border: "1px solid #22c55e",
                },
            });

            // Redirect based on user type
            setTimeout(() => {
                if (userType === "teacher") {
                    router.push("/teacher/profile");
                } else {
                    router.push("/school/home");
                }
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
        <div className="min-h-screen bg-[hsl(var(--background))] flex flex-col">
            <Toaster />
            {/* Navigation */}
            <nav className="container mx-auto px-4 py-8 flex items-center justify-between">
                <Link href="/">
                    <Image
                        src="/logo.svg"
                        alt="مسار"
                        width={192}
                        height={64}
                        className="h-12 md:h-16 w-auto object-contain cursor-pointer"
                        priority
                    />
                </Link>
            </nav>

            {/* Login Form */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="bg-[hsl(var(--card))] rounded-lg shadow-lg p-8 border border-[hsl(var(--border))]">
                        <h1 className="text-3xl font-bold text-center mb-2">
                            تسجيل الدخول
                        </h1>
                        <p className="text-center text-[hsl(var(--muted-foreground))] mb-8">
                            مرحباً بعودتك إلى مسار
                        </p>

                        {/* User Type Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-3">
                                نوع الحساب
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setUserType("teacher")}
                                    className={`py-3 px-4 rounded-md border transition-all ${
                                        userType === "teacher"
                                            ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] font-semibold"
                                            : "border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]/50"
                                    }`}
                                >
                                    معلم
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUserType("school")}
                                    className={`py-3 px-4 rounded-md border transition-all ${
                                        userType === "school"
                                            ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] font-semibold"
                                            : "border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]/50"
                                    }`}
                                >
                                    مدرسة
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="phoneNumber"
                                    className="block text-sm font-medium mb-2"
                                >
                                    رقم الهاتف
                                </label>
                                <input
                                    id="phoneNumber"
                                    type="tel"
                                    required
                                    className="w-full px-4 py-3 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] transition-all"
                                    placeholder="+966 5X XXX XXXX"
                                    value={formData.phoneNumber}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            phoneNumber: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium mb-2"
                                >
                                    كلمة المرور
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    className="w-full px-4 py-3 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] transition-all"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            password: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="rounded border-[hsl(var(--border))]"
                                    />
                                    <span>تذكرني</span>
                                </label>
                                <Link
                                    href="#"
                                    className="text-[hsl(var(--primary))] hover:underline"
                                >
                                    نسيت كلمة المرور؟
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full py-6 text-lg font-semibold"
                            >
                                {loading
                                    ? "جاري تسجيل الدخول..."
                                    : "تسجيل الدخول"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-[hsl(var(--muted-foreground))]">
                                ليس لديك حساب؟{" "}
                                <Link
                                    href="/register"
                                    className="text-[hsl(var(--primary))] font-semibold hover:underline"
                                >
                                    سجل الآن
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
