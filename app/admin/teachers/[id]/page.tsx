"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { teacherAPI, specialtyAPI } from "@/lib/api/axios";
import {
    GraduationCap,
    ArrowRight,
    Phone,
    Mail,
    Award,
    Video,
    User,
    Calendar,
    MapPin,
    Briefcase,
    BookOpen,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface Teacher {
    _id: string;
    fullName: string;
    phoneNumber: string;
    email?: string;
    nationalID?: string;
    age?: number;
    gender?: string;
    address?: string;
    academicQualification?: string;
    diploma?: string;
    courses?: string[];
    specialties?: string[];
    taughtStages?: string[];
    workedInOmanBefore?: boolean;
    videos?: Array<{
        _id: string;
        title: string;
        videoUrl: string;
        specialty: string;
        uploadedAt: string;
    }>;
    role?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface Specialty {
    _id: string;
    name: string;
    nameAr: string;
    description?: string;
}

export default function TeacherDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const teacherId = params.id as string;

    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [specialtiesData, setSpecialtiesData] = useState<Specialty[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (teacherId) {
            fetchTeacherDetails();
        }
    }, [teacherId]);

    const fetchTeacherDetails = async () => {
        try {
            setLoading(true);
            const response = await teacherAPI.getById(teacherId);
            const teacherData = response.data.data || response.data;
            setTeacher(teacherData);

            // Fetch specialties data
            if (
                teacherData.specialties &&
                Array.isArray(teacherData.specialties)
            ) {
                const specialtiesPromises = teacherData.specialties.map(
                    async (specialtyId: string) => {
                        try {
                            const res = await specialtyAPI.getById(specialtyId);
                            return res.data.data || res.data;
                        } catch (error) {
                            console.error(
                                `Failed to fetch specialty ${specialtyId}:`,
                                error
                            );
                            return null;
                        }
                    }
                );
                const fetchedSpecialties = await Promise.all(
                    specialtiesPromises
                );
                setSpecialtiesData(fetchedSpecialties.filter(Boolean));
            }
        } catch (error: any) {
            toast.error("فشل تحميل بيانات المعلم");
            console.error("Error fetching teacher:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStageLabel = (stage: string) => {
        const stages: { [key: string]: string } = {
            kindergarten: "روضة",
            primary: "ابتدائي",
            preparatory: "إعدادي",
            secondary: "ثانوي",
        };
        return stages[stage] || stage;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-zinc-400 mt-4">جاري التحميل...</p>
                </div>
            </div>
        );
    }

    if (!teacher) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <GraduationCap className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                    <p className="text-zinc-400 text-lg">
                        لم يتم العثور على المعلم
                    </p>
                    <button
                        onClick={() => router.push("/admin/teachers")}
                        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                    >
                        العودة للقائمة
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            <Toaster />

            {/* Header */}
            <header className="border-b border-zinc-800 bg-zinc-900">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push("/admin/teachers")}
                            className="p-2 hover:bg-zinc-800 rounded-lg transition-all"
                        >
                            <ArrowRight className="w-6 h-6 text-white" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-500/10 rounded-lg">
                                <GraduationCap className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">
                                    {teacher.fullName}
                                </h1>
                                <p className="text-sm text-zinc-400 mt-1">
                                    تفاصيل المعلم
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-5xl mx-auto space-y-6">
                    {/* Personal Information */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-400" />
                            المعلومات الشخصية
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                                <Phone className="w-5 h-5 text-zinc-400" />
                                <div>
                                    <p className="text-xs text-zinc-500">
                                        رقم الهاتف
                                    </p>
                                    <p className="text-white">
                                        {teacher.phoneNumber}
                                    </p>
                                </div>
                            </div>
                            {teacher.email && (
                                <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                                    <Mail className="w-5 h-5 text-zinc-400" />
                                    <div>
                                        <p className="text-xs text-zinc-500">
                                            البريد الإلكتروني
                                        </p>
                                        <p className="text-white">
                                            {teacher.email}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {teacher.nationalID && (
                                <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                                    <User className="w-5 h-5 text-zinc-400" />
                                    <div>
                                        <p className="text-xs text-zinc-500">
                                            الرقم الوطني
                                        </p>
                                        <p className="text-white">
                                            {teacher.nationalID}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {teacher.age && (
                                <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                                    <Calendar className="w-5 h-5 text-zinc-400" />
                                    <div>
                                        <p className="text-xs text-zinc-500">
                                            العمر
                                        </p>
                                        <p className="text-white">
                                            {teacher.age} سنة
                                        </p>
                                    </div>
                                </div>
                            )}
                            {teacher.gender && (
                                <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                                    <User className="w-5 h-5 text-zinc-400" />
                                    <div>
                                        <p className="text-xs text-zinc-500">
                                            الجنس
                                        </p>
                                        <p className="text-white">
                                            {teacher.gender === "male"
                                                ? "ذكر"
                                                : "أنثى"}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {teacher.address && (
                                <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                                    <MapPin className="w-5 h-5 text-zinc-400" />
                                    <div>
                                        <p className="text-xs text-zinc-500">
                                            العنوان
                                        </p>
                                        <p className="text-white">
                                            {teacher.address}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Academic Information */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Award className="w-5 h-5 text-blue-400" />
                            المعلومات الأكاديمية
                        </h2>
                        <div className="space-y-4">
                            {teacher.academicQualification && (
                                <div className="p-3 bg-zinc-800/50 rounded-lg">
                                    <p className="text-xs text-zinc-500 mb-1">
                                        المؤهل الأكاديمي
                                    </p>
                                    <p className="text-white">
                                        {teacher.academicQualification}
                                    </p>
                                </div>
                            )}
                            {teacher.diploma && (
                                <div className="p-3 bg-zinc-800/50 rounded-lg">
                                    <p className="text-xs text-zinc-500 mb-1">
                                        الدبلوم
                                    </p>
                                    <p className="text-white">
                                        {teacher.diploma}
                                    </p>
                                </div>
                            )}
                            {teacher.workedInOmanBefore !== undefined && (
                                <div className="p-3 bg-zinc-800/50 rounded-lg">
                                    <p className="text-xs text-zinc-500 mb-1">
                                        العمل السابق في عمان
                                    </p>
                                    <p className="text-white">
                                        {teacher.workedInOmanBefore
                                            ? "نعم"
                                            : "لا"}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Specialties */}
                    {specialtiesData.length > 0 && (
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-blue-400" />
                                التخصصات
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {specialtiesData.map((specialty) => (
                                    <div
                                        key={specialty._id}
                                        className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg"
                                    >
                                        {specialty.nameAr || specialty.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Taught Stages */}
                    {teacher.taughtStages &&
                        teacher.taughtStages.length > 0 && (
                            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-blue-400" />
                                    المراحل التي تم تدريسها
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    {teacher.taughtStages.map(
                                        (stage, index) => (
                                            <div
                                                key={index}
                                                className="px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg"
                                            >
                                                {getStageLabel(stage)}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                    {/* Videos */}
                    {teacher.videos && teacher.videos.length > 0 && (
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Video className="w-5 h-5 text-blue-400" />
                                الفيديوهات ({teacher.videos.length})
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {teacher.videos.map((video) => {
                                    const specialty = specialtiesData.find(
                                        (s) => s._id === video.specialty
                                    );
                                    return (
                                        <div
                                            key={video._id}
                                            className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg"
                                        >
                                            <video
                                                controls
                                                className="w-full rounded-lg mb-3"
                                                src={
                                                    video.videoUrl
                                                        ?.trim()
                                                        .startsWith("http")
                                                        ? video.videoUrl.trim()
                                                        : `${
                                                              process.env
                                                                  .NODE_ENV ===
                                                              "production"
                                                                  ? "https"
                                                                  : "http"
                                                          }://api.masar.work${
                                                              video.videoUrl.startsWith(
                                                                  "/"
                                                              )
                                                                  ? video.videoUrl
                                                                  : "/" +
                                                                    video.videoUrl
                                                          }`
                                                }
                                            >
                                                Your browser does not support
                                                the video tag.
                                            </video>
                                            <h3 className="text-white font-semibold mb-1">
                                                {video.title}
                                            </h3>
                                            {specialty && (
                                                <p className="text-sm text-blue-400 mb-2">
                                                    {specialty.nameAr ||
                                                        specialty.name}
                                                </p>
                                            )}
                                            <p className="text-xs text-zinc-500">
                                                {new Date(
                                                    video.uploadedAt
                                                ).toLocaleDateString("ar-EG", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Metadata */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-400" />
                            معلومات الحساب
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {teacher.createdAt && (
                                <div className="p-3 bg-zinc-800/50 rounded-lg">
                                    <p className="text-xs text-zinc-500 mb-1">
                                        تاريخ التسجيل
                                    </p>
                                    <p className="text-white">
                                        {new Date(
                                            teacher.createdAt
                                        ).toLocaleDateString("ar-EG", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                            )}
                            {teacher.updatedAt && (
                                <div className="p-3 bg-zinc-800/50 rounded-lg">
                                    <p className="text-xs text-zinc-500 mb-1">
                                        آخر تحديث
                                    </p>
                                    <p className="text-white">
                                        {new Date(
                                            teacher.updatedAt
                                        ).toLocaleDateString("ar-EG", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
