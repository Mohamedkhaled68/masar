"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { specialtyAPI } from "@/lib/api/axios";
import { SpecialtyCard } from "@/components/SpecialtyCard";
import {
    LogOut,
    BookOpen,
    Calculator,
    Beaker,
    Globe,
    Palette,
} from "lucide-react";

interface Specialty {
    _id: string;
    name: string;
    nameAr: string;
    description?: string;
    icon?: React.ReactNode;
    teacherCount?: number;
}

// Icon mapping function
const getIconForSpecialty = (name: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
        رياضيات: <Calculator className="w-8 h-8 text-yellow-400" />,
        علوم: <Beaker className="w-8 h-8 text-yellow-400" />,
        عربي: <BookOpen className="w-8 h-8 text-yellow-400" />,
        إنجليزي: <Globe className="w-8 h-8 text-yellow-400" />,
        فن: <Palette className="w-8 h-8 text-yellow-400" />,
        default: <BookOpen className="w-8 h-8 text-yellow-400" />,
    };

    // Check if any key is included in the name
    for (const key in iconMap) {
        if (
            name.includes(key) ||
            name.toLowerCase().includes(key.toLowerCase())
        ) {
            return iconMap[key];
        }
    }

    return iconMap.default;
};

export default function SchoolHomePage() {
    const router = useRouter();
    const { user, role, logout } = useAuthStore();
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSpecialties();
    }, []);

    const fetchSpecialties = async () => {
        try {
            setLoading(true);
            const response = await specialtyAPI.getAll();
            const specialtiesData = response.data.data || response.data || [];

            // Add icons to specialties
            const specialtiesWithIcons = specialtiesData.map(
                (specialty: any) => ({
                    ...specialty,
                    icon: getIconForSpecialty(
                        specialty.nameAr || specialty.name
                    ),
                })
            );

            setSpecialties(
                Array.isArray(specialtiesWithIcons) ? specialtiesWithIcons : []
            );
        } catch (error) {
            console.error("Failed to fetch specialties:", error);
            setSpecialties([]);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
    };

    const handleSpecialtyClick = (specialty: Specialty) => {
        router.push(`/school/specialty/${specialty._id}`);
    };

    return (
        <div className="min-h-screen bg-black">
            {/* Header */}
            <header className="border-b border-zinc-800 bg-zinc-900">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                مرحباً {user?.name}
                            </h1>
                            <p className="text-sm text-zinc-400 mt-1">
                                اختر التخصص المطلوب لعرض المعلمين المتاحين
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-all"
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
                    {/* Title Section */}
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-white mb-4">
                            اختاري التخصص المطلوب
                        </h2>
                        <p className="text-xl text-zinc-400">
                            تصفح المعلمين المتميزين حسب التخصص
                        </p>
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-zinc-400 mt-4">
                                جاري التحميل...
                            </p>
                        </div>
                    ) : (
                        /* Specialties Grid */
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {specialties.length === 0 ? (
                                <div className="col-span-full text-center py-12">
                                    <BookOpen className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                                    <p className="text-zinc-400 text-lg">
                                        لا توجد تخصصات متاحة حالياً
                                    </p>
                                </div>
                            ) : (
                                specialties.map((specialty) => (
                                    <SpecialtyCard
                                        key={specialty._id}
                                        name={
                                            specialty.nameAr || specialty.name
                                        }
                                        icon={specialty.icon}
                                        teacherCount={specialty.teacherCount}
                                        onClick={() =>
                                            handleSpecialtyClick(specialty)
                                        }
                                    />
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
