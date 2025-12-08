"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { schoolAPI, specialtyAPI } from "@/lib/api/axios";
import {
    Shield,
    LogOut,
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    Calendar,
    BookOpen,
    Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

interface School {
    _id: string;
    schoolName: string;
    managerName: string;
    whatsappPhone: string;
    schoolLocation: string;
    stagesNeeded?: string[];
    specialtiesNeeded?: string[];
    expectedSalaryRange?: string;
    flightTicketProvided?: string;
    housingProvided?: boolean;
    housingAllowance?: string;
    selectedTeachers?: string[];
    role: string;
    createdAt: string;
    updatedAt: string;
}

interface Specialty {
    _id: string;
    nameAr: string;
    nameEn: string;
    description?: string;
}

export default function SchoolDetailPage() {
    const router = useRouter();
    const params = useParams();
    const schoolId = params.id as string;
    const { user, role, logout } = useAuthStore();
    const [school, setSchool] = useState<School | null>(null);
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (role !== "admin") {
            router.push("/");
            return;
        }
        fetchSchoolDetails();
    }, [role, router, schoolId]);

    const fetchSchoolDetails = async () => {
        try {
            setLoading(true);
            const response = await schoolAPI.getById(schoolId);
            const schoolData = response.data?.data || response.data;
            setSchool(schoolData);

            // Fetch specialty details
            if (
                schoolData.specialtiesNeeded &&
                schoolData.specialtiesNeeded.length > 0
            ) {
                const specialtyPromises = schoolData.specialtiesNeeded.map(
                    async (specialtyId: string) => {
                        try {
                            const res = await specialtyAPI.getById(specialtyId);
                            return res.data?.data || res.data;
                        } catch (error) {
                            console.error(
                                `Failed to fetch specialty ${specialtyId}:`,
                                error
                            );
                            return null;
                        }
                    }
                );

                const specialtyResults = await Promise.all(specialtyPromises);
                setSpecialties(
                    specialtyResults.filter((s): s is Specialty => s !== null)
                );
            }
        } catch (error) {
            console.error("Failed to fetch school details:", error);
            toast.error("فشل في تحميل تفاصيل المدرسة");
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

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
            </div>
        );
    }

    if (!school) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <p className="text-zinc-400 mb-4">المدرسة غير موجودة</p>
                    <button
                        onClick={() => router.push("/admin/schools")}
                        className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors"
                    >
                        العودة للمدارس
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            {/* Header */}
            <header className="border-b border-zinc-800 bg-zinc-900">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push("/admin/schools")}
                                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-zinc-400" />
                            </button>
                            <div className="p-3 bg-yellow-400/10 rounded-lg">
                                <Shield className="w-6 h-6 text-yellow-400" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">
                                    تفاصيل المدرسة
                                </h1>
                                <p className="text-sm text-zinc-400">
                                    {school.schoolName}
                                </p>
                            </div>
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
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-5xl mx-auto space-y-6">
                    {/* Basic Information */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-6">
                            المعلومات الأساسية
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-zinc-800 rounded-lg">
                                        <Shield className="w-5 h-5 text-yellow-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-400">
                                            اسم المدرسة
                                        </p>
                                        <p className="text-white font-medium">
                                            {school.schoolName}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-zinc-800 rounded-lg">
                                        <Shield className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-400">
                                            اسم المدير
                                        </p>
                                        <p className="text-white font-medium">
                                            {school.managerName}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-zinc-800 rounded-lg">
                                        <Phone className="w-5 h-5 text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-400">
                                            رقم الواتساب
                                        </p>
                                        <p className="text-white font-medium">
                                            {school.whatsappPhone}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-zinc-800 rounded-lg">
                                        <MapPin className="w-5 h-5 text-red-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-400">
                                            موقع المدرسة
                                        </p>
                                        <p className="text-white font-medium">
                                            {school.schoolLocation || "-"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-zinc-800 rounded-lg">
                                        <Shield className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-400">
                                            نطاق الراتب
                                        </p>
                                        <p className="text-white font-medium">
                                            {school.expectedSalaryRange || "-"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-zinc-800 rounded-lg">
                                        <Calendar className="w-5 h-5 text-orange-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-400">
                                            تاريخ التسجيل
                                        </p>
                                        <p className="text-white font-medium">
                                            {new Date(
                                                school.createdAt
                                            ).toLocaleDateString("ar-EG")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Specialties */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-yellow-400/10 rounded-lg">
                                <BookOpen className="w-5 h-5 text-yellow-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white">
                                التخصصات المطلوبة
                            </h2>
                            <span className="px-3 py-1 bg-zinc-800 text-yellow-400 text-sm rounded-full">
                                {specialties.length}
                            </span>
                        </div>

                        {specialties.length === 0 ? (
                            <p className="text-zinc-400 text-center py-8">
                                لم تحدد المدرسة أي تخصصات بعد
                            </p>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {specialties.map((specialty) => (
                                    <div
                                        key={specialty._id}
                                        className="p-4 bg-zinc-800 border border-zinc-700 rounded-lg"
                                    >
                                        <p className="text-white font-medium mb-1">
                                            {specialty.nameAr}
                                        </p>
                                        <p className="text-sm text-zinc-400">
                                            {specialty.nameEn}
                                        </p>
                                        {specialty.description && (
                                            <p className="text-sm text-zinc-500 mt-2">
                                                {specialty.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Account Metadata */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">
                            معلومات إضافية
                        </h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-zinc-400">
                                    معرف المدرسة:
                                </span>
                                <span className="text-white font-mono">
                                    {school._id}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-400">
                                    تاريخ الإنشاء:
                                </span>
                                <span className="text-white">
                                    {new Date(school.createdAt).toLocaleString(
                                        "ar-EG"
                                    )}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-400">
                                    توفير تذكرة الطيران:
                                </span>
                                <span className="text-white">
                                    {school.flightTicketProvided === "full"
                                        ? "كاملة"
                                        : school.flightTicketProvided ===
                                          "partial"
                                        ? "جزئية"
                                        : "لا"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-400">
                                    توفير السكن:
                                </span>
                                <span className="text-white">
                                    {school.housingProvided ? "نعم" : "لا"}
                                </span>
                            </div>
                            {school.housingAllowance && (
                                <div className="flex justify-between">
                                    <span className="text-zinc-400">
                                        بدل السكن:
                                    </span>
                                    <span className="text-white">
                                        {school.housingAllowance}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-zinc-400">
                                    المراحل المطلوبة:
                                </span>
                                <span className="text-white">
                                    {school.stagesNeeded?.join("، ") || "-"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-400">
                                    المعلمون المختارون:
                                </span>
                                <span className="text-white">
                                    {school.selectedTeachers?.length || 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
