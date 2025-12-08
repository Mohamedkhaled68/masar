"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { teacherAPI, specialtyAPI, schoolAPI } from "@/lib/api/axios";
import {
    Shield,
    Users,
    GraduationCap,
    School,
    LogOut,
    BookOpen,
} from "lucide-react";

export default function AdminDashboard() {
    const router = useRouter();
    const { user, role, logout } = useAuthStore();
    const [teachersCount, setTeachersCount] = useState<number>(0);
    const [specialtiesCount, setSpecialtiesCount] = useState<number>(0);
    const [schoolsCount, setSchoolsCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (role === "admin") {
            fetchCounts();
        }
    }, [role]);
    const fetchCounts = async () => {
        try {
            setLoading(true);
            const [teachersRes, specialtiesRes, schoolsRes] = await Promise.all(
                [teacherAPI.getAll(), specialtyAPI.getAll(), schoolAPI.getAll()]
            );

            const teachersData =
                teachersRes.data.data?.teachers ||
                teachersRes.data?.teachers ||
                [];
            const specialtiesData =
                specialtiesRes.data.data
            const schoolsData =
                schoolsRes.data.data.schools

            setTeachersCount(
                Array.isArray(teachersData) ? teachersData.length : 0
            );
            setSpecialtiesCount(
                Array.isArray(specialtiesData) ? specialtiesData.length : 0
            );
            setSchoolsCount(
                Array.isArray(schoolsData) ? schoolsData.length : 0
            );
        } catch (error) {
            console.error("Failed to fetch counts:", error);
            setTeachersCount(0);
            setSpecialtiesCount(0);
            setSchoolsCount(0);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
    };

    if (role !== "admin") {
        return null;
    }

    return (
        <div className="min-h-screen bg-black">
            {/* Header */}
            <header className="border-b border-zinc-800 bg-zinc-900">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-yellow-400/10 rounded-lg">
                                <Shield className="w-6 h-6 text-yellow-400" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">
                                    لوحة تحكم الأدمن
                                </h1>
                                <p className="text-sm text-zinc-400">
                                    مرحباً {user?.name || "Admin"}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>تسجيل الخروج</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    {/* Welcome Message */}
                    <div className="bg-linear-to-br from-yellow-400/10 to-yellow-400/5 border border-yellow-400/30 rounded-2xl p-8 mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">
                            مرحباً أيها الأدمن
                        </h2>
                        <p className="text-zinc-300">
                            أنت الآن في لوحة التحكم الإدارية لمنصة مسار
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-blue-500/10 rounded-lg">
                                    <GraduationCap className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">
                                        {loading ? (
                                            <span className="inline-block w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></span>
                                        ) : (
                                            teachersCount
                                        )}
                                    </p>
                                    <p className="text-sm text-zinc-400">
                                        إجمالي المعلمين
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-green-500/10 rounded-lg">
                                    <School className="w-6 h-6 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">
                                        {loading ? (
                                            <span className="inline-block w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></span>
                                        ) : (
                                            schoolsCount
                                        )}
                                    </p>
                                    <p className="text-sm text-zinc-400">
                                        إجمالي المدارس
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-yellow-400/10 rounded-lg">
                                    <BookOpen className="w-6 h-6 text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">
                                        {loading ? (
                                            <span className="inline-block w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></span>
                                        ) : (
                                            specialtiesCount
                                        )}
                                    </p>
                                    <p className="text-sm text-zinc-400">
                                        إجمالي التخصصات
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                        <h3 className="text-xl font-bold text-white mb-4">
                            الإجراءات السريعة
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <button
                                onClick={() =>
                                    router.push("/admin/specialties")
                                }
                                className="p-4 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-yellow-400 transition-all text-right"
                            >
                                <p className="text-white font-semibold mb-1">
                                    إدارة التخصصات
                                </p>
                                <p className="text-sm text-zinc-400">
                                    إضافة وتعديل وحذف التخصصات
                                </p>
                            </button>
                            <button
                                onClick={() => router.push("/admin/teachers")}
                                className="p-4 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-yellow-400 transition-all text-right"
                            >
                                <p className="text-white font-semibold mb-1">
                                    إدارة المعلمين
                                </p>
                                <p className="text-sm text-zinc-400">
                                    عرض وإدارة جميع المعلمين المسجلين
                                </p>
                            </button>
                            <button
                                onClick={() => router.push("/admin/schools")}
                                className="p-4 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-yellow-400 transition-all text-right"
                            >
                                <p className="text-white font-semibold mb-1">
                                    إدارة المدارس
                                </p>
                                <p className="text-sm text-zinc-400">
                                    عرض وإدارة جميع المدارس المسجلة
                                </p>
                            </button>
                            <button className="p-4 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-yellow-400 transition-all text-right">
                                <p className="text-white font-semibold mb-1">
                                    إدارة الفيديوهات
                                </p>
                                <p className="text-sm text-zinc-400">
                                    مراجعة وإدارة فيديوهات المعلمين
                                </p>
                            </button>
                            <button className="p-4 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-yellow-400 transition-all text-right">
                                <p className="text-white font-semibold mb-1">
                                    متابعة الاختيارات
                                </p>
                                <p className="text-sm text-zinc-400">
                                    متابعة اختيارات المدارس للمعلمين
                                </p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
