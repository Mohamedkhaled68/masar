"use client";

import React from "react";
import { useRegistrationStore } from "@/lib/store/registrationStore";
import { GraduationCap, School } from "lucide-react";

export const UserTypeSelection: React.FC = () => {
    const { setUserType } = useRegistrationStore();

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12">
            <div className="max-w-4xl w-full">
                {/* Logo/Title */}
                <div className="text-center mb-12">
                    <h1 className="text-6xl font-bold text-yellow-400 mb-4">
                        مسار
                    </h1>
                    <p className="text-xl text-zinc-400">
                        اختر نوع الحساب لبدء التسجيل
                    </p>
                </div>

                {/* User Type Cards */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Teacher Card */}
                    <button
                        onClick={() => setUserType("teacher")}
                        className="group relative p-8 bg-linear-to-br from-zinc-900 to-zinc-800 border-2 border-zinc-700 rounded-2xl hover:border-yellow-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/20"
                    >
                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="p-6 bg-yellow-400/10 rounded-full group-hover:bg-yellow-400/20 transition-all">
                                <GraduationCap className="w-16 h-16 text-yellow-400" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">
                                    تسجيل كمعلم
                                </h2>
                                <p className="text-zinc-400 group-hover:text-zinc-300">
                                    انضم كمعلم متميز وابحث عن فرص التدريس
                                    المناسبة
                                </p>
                            </div>
                            <div className="pt-4">
                                <span className="inline-flex items-center gap-2 text-yellow-400 font-semibold group-hover:gap-4 transition-all">
                                    ابدأ التسجيل
                                    <span className="text-2xl">←</span>
                                </span>
                            </div>
                        </div>
                    </button>

                    {/* School Card */}
                    <button
                        onClick={() => setUserType("school")}
                        className="group relative p-8 bg-linear-to-br from-zinc-900 to-zinc-800 border-2 border-zinc-700 rounded-2xl hover:border-yellow-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/20"
                    >
                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="p-6 bg-yellow-400/10 rounded-full group-hover:bg-yellow-400/20 transition-all">
                                <School className="w-16 h-16 text-yellow-400" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">
                                    تسجيل كمدرسة
                                </h2>
                                <p className="text-zinc-400 group-hover:text-zinc-300">
                                    سجل مدرستك وابحث عن المعلمين الأكفاء
                                </p>
                            </div>
                            <div className="pt-4">
                                <span className="inline-flex items-center gap-2 text-yellow-400 font-semibold group-hover:gap-4 transition-all">
                                    ابدأ التسجيل
                                    <span className="text-2xl">←</span>
                                </span>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Additional Info */}
                <div className="mt-12 text-center">
                    <p className="text-zinc-500">
                        هل لديك حساب بالفعل؟{" "}
                        <a
                            href="/login"
                            className="text-yellow-400 hover:underline font-semibold"
                        >
                            تسجيل الدخول
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};
