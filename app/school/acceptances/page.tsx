"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { acceptanceAPI, teacherAPI, specialtyAPI } from "@/lib/api/axios";
import {
    Shield,
    LogOut,
    Clock,
    CheckCircle,
    XCircle,
    Loader2,
    User,
    Calendar,
    FileText,
} from "lucide-react";
import toast from "react-hot-toast";

interface Acceptance {
    _id: string;
    school: string;
    teacher: {
        _id: string;
        fullName: string;
        email?: string;
        phoneNumber?: string;
        experience?: number;
        specialties?: string[];
    };
    status: "pending" | "approved" | "rejected";
    notes?: string;
    adminNotes?: string;
    createdAt: string;
    updatedAt: string;
}

export default function SchoolAcceptancesPage() {
    const router = useRouter();
    const { user, role, logout } = useAuthStore();
    const [acceptances, setAcceptances] = useState<Acceptance[]>([]);
    const [filteredAcceptances, setFilteredAcceptances] = useState<
        Acceptance[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [specialtyNames, setSpecialtyNames] = useState<{
        [key: string]: string[];
    }>({});

    useEffect(() => {
        fetchAcceptances();
    }, [router]);

    const fetchAcceptances = async () => {
        try {
            setLoading(true);
            const response = await acceptanceAPI.getSchoolAcceptances();
            const data = response.data?.data.acceptances;
            console.log(data);

            setAcceptances(Array.isArray(data) ? data : []);

            // Fetch specialties for all teachers
            if (Array.isArray(data)) {
                const specialtiesMap: { [key: string]: string[] } = {};

                for (const acceptance of data) {
                    if (
                        acceptance.teacher?.specialties &&
                        acceptance.teacher.specialties.length > 0
                    ) {
                        const specialtyPromises =
                            acceptance.teacher.specialties.map(
                                async (specialtyId: string) => {
                                    try {
                                        const res = await specialtyAPI.getById(
                                            specialtyId
                                        );
                                        const specialty =
                                            res.data?.data || res.data;
                                        return (
                                            specialty?.nameAr ||
                                            specialty?.nameEn ||
                                            ""
                                        );
                                    } catch (error) {
                                        console.error(
                                            `Failed to fetch specialty ${specialtyId}:`,
                                            error
                                        );
                                        return "";
                                    }
                                }
                            );

                        const names = await Promise.all(specialtyPromises);
                        specialtiesMap[acceptance.teacher._id] = names.filter(
                            (name) => name !== ""
                        );
                    }
                }

                setSpecialtyNames(specialtiesMap);
            }
        } catch (error) {
            console.error("Failed to fetch acceptances:", error);
            toast.error("فشل في تحميل الطلبات");
            setAcceptances([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "approved":
                return <CheckCircle className="w-5 h-5 text-green-400" />;
            case "rejected":
                return <XCircle className="w-5 h-5 text-red-400" />;
            default:
                return <Clock className="w-5 h-5 text-yellow-400" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "approved":
                return "مقبول";
            case "rejected":
                return "مرفوض";
            default:
                return "قيد المراجعة";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "approved":
                return "bg-green-500/20 border-green-500/30 text-green-400";
            case "rejected":
                return "bg-red-500/20 border-red-500/30 text-red-400";
            default:
                return "bg-yellow-500/20 border-yellow-500/30 text-yellow-400";
        }
    };

    const handleLogout = () => {
        logout();
    };

    if (role !== "school") {
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
                                    طلبات القبول
                                </h1>
                                <p className="text-sm text-zinc-400">
                                    متابعة حالة طلبات قبول المعلمين
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
                <div className="max-w-6xl mx-auto">
                    {/* Acceptances List */}
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
                        </div>
                    ) : acceptances.length === 0 ? (
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
                            <p className="text-zinc-400">لا توجد طلبات</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {acceptances.map((acceptance) => (
                                <div
                                    key={acceptance._id}
                                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-yellow-400/10 rounded-lg">
                                                <User className="w-6 h-6 text-yellow-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white mb-1">
                                                    {acceptance.teacher
                                                        ?.fullName ||
                                                        "معلم غير معروف"}
                                                </h3>
                                                {acceptance.teacher
                                                    ?.experience && (
                                                    <p className="text-sm text-zinc-400">
                                                        الخبرة:{" "}
                                                        {
                                                            acceptance.teacher
                                                                .experience
                                                        }{" "}
                                                        سنوات
                                                    </p>
                                                )}
                                                {specialtyNames[
                                                    acceptance.teacher._id
                                                ] &&
                                                    specialtyNames[
                                                        acceptance.teacher._id
                                                    ].length > 0 && (
                                                        <p className="text-sm text-yellow-400 mt-1">
                                                            التخصصات:{" "}
                                                            {specialtyNames[
                                                                acceptance
                                                                    .teacher._id
                                                            ].join("، ")}
                                                        </p>
                                                    )}
                                            </div>
                                        </div>
                                        <div
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getStatusColor(
                                                acceptance.status
                                            )}`}
                                        >
                                            {getStatusIcon(acceptance.status)}
                                            <span className="font-semibold">
                                                {getStatusText(
                                                    acceptance.status
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                                            <Calendar className="w-4 h-4" />
                                            <span>
                                                تاريخ الطلب:{" "}
                                                {new Date(
                                                    acceptance.createdAt
                                                ).toLocaleDateString("ar-EG")}
                                            </span>
                                        </div>
                                        {acceptance.notes && (
                                            <div className="flex items-start gap-2 text-sm text-zinc-400">
                                                <FileText className="w-4 h-4 mt-0.5" />
                                                <span>
                                                    ملاحظاتك: {acceptance.notes}
                                                </span>
                                            </div>
                                        )}
                                        {acceptance.adminNotes && (
                                            <div className="flex items-start gap-2 text-sm text-yellow-400 md:col-span-2">
                                                <FileText className="w-4 h-4 mt-0.5" />
                                                <span>
                                                    ملاحظات الإدارة:{" "}
                                                    {acceptance.adminNotes}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
