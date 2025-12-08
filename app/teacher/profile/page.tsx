"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { teacherAPI, specialtyAPI, videoAPI } from "@/lib/api/axios";
import {
    User,
    Phone,
    MapPin,
    GraduationCap,
    Calendar,
    Upload,
    LogOut,
    Video as VideoIcon,
    CheckCircle,
    AlertCircle,
} from "lucide-react";

interface TeacherProfile {
    _id: string;
    fullName: string;
    phoneNumber: string;
    nationalID: string;
    gender: string;
    age: number;
    address: string;
    academicQualification: string;
    diploma?: string;
    courses: string[];
    specialties?: string[]; // Array of specialty IDs
    videos?: Array<{
        _id: string;
        videoUrl: string;
        title?: string;
        specialty: string;
    }>;
    taughtStages: string[];
    workedInOmanBefore: boolean;
    videoUrl?: string;
}

interface Specialty {
    _id: string;
    name: string;
    nameAr: string;
    description?: string;
}

export default function TeacherProfilePage() {
    const router = useRouter();
    const { role, logout, user } = useAuthStore();
    const [profile, setProfile] = useState<TeacherProfile | null>(null);
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [uploadingSpecialtyId, setUploadingSpecialtyId] = useState<
        string | null
    >(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await teacherAPI.getMe();
            const profileData = response.data.data;
            console.log(profileData);
            
            setProfile(profileData);

            // Fetch specialties if teacher has any
            if (profileData.specialties && profileData.specialties.length > 0) {
                await fetchSpecialties(profileData.specialties);
            }
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                    "فشل تحميل الملف الشخصي. حاول مرة أخرى"
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchSpecialties = async (specialtyIds: string[]) => {
        try {
            const specialtyPromises = specialtyIds.map((id) =>
                specialtyAPI.getById(id)
            );
            const responses = await Promise.all(specialtyPromises);
            const fetchedSpecialties = responses.map(
                (res) => res.data.data || res.data
            );
            setSpecialties(fetchedSpecialties);
        } catch (err) {
            console.error("Failed to fetch specialties:", err);
        }
    };

    const handleVideoUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
        specialtyId: string,
        specialtyName: string
    ) => {
        const file = e.target.files?.[0];
        if (!file || !profile) return;

        // Validate file size (max 100MB)
        if (file.size > 100 * 1024 * 1024) {
            setError("حجم الملف يجب أن يكون أقل من 100 ميجابايت");
            return;
        }

        setUploadingSpecialtyId(specialtyId);
        setError("");
        setUploadSuccess(false);

        try {
            const formData = new FormData();
            formData.append("video", file);
            formData.append("title", `${specialtyName} - ${profile.fullName}`);
            formData.append("specialtyId", specialtyId);

            await videoAPI.upload(formData);
            setUploadSuccess(true);

            // Refresh profile to get new video URL
            await fetchProfile();

            // Clear success message after 3 seconds
            setTimeout(() => setUploadSuccess(false), 3000);
        } catch (err: any) {
            setError(
                err.response?.data?.message || "فشل رفع الفيديو. حاول مرة أخرى"
            );
        } finally {
            setUploadingSpecialtyId(null);
        }
    };

    const handleLogout = () => {
        logout();
    };

    const getStageLabel = (stage: string) => {
        const stageLabels: Record<string, string> = {
            kindergarten: "رياض الأطفال",
            primary: "الحلقة الأولى (1-4)",
            preparatory: "الحلقة الثانية (5-9)",
            secondary: "التعليم الثانوي (10-12)",
        };
        return stageLabels[stage] || stage;
    };

    return (
        <div className="min-h-screen bg-black">
            {/* Header */}
            <header className="border-b border-zinc-800 bg-zinc-900">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                الملف الشخصي للمعلم
                            </h1>
                            <p className="text-sm text-zinc-400 mt-1">
                                مرحباً {profile?.fullName}
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-all cursor-pointer"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>تسجيل الخروج</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Success Message */}
                    {uploadSuccess && (
                        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                            <p className="text-green-400 font-semibold">
                                تم رفع الفيديو بنجاح!
                            </p>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <p className="text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-zinc-400 mt-4">
                                جاري تحميل البيانات...
                            </p>
                        </div>
                    ) : profile ? (
                        <div className="space-y-6">
                            {/* Video Upload Section - Per Specialty */}
                            {specialties.length > 0 && (
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <VideoIcon className="w-5 h-5 text-yellow-400" />
                                        <span>فيديوهات التدريس</span>
                                    </h2>
                                    <p className="text-sm text-zinc-400 mb-6">
                                        ارفع فيديو تدريسي لكل تخصص
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {specialties.map((specialty) => {
                                            const specialtyVideo =
                                                profile.videos?.find(
                                                    (v) =>
                                                        v.specialty ===
                                                        specialty._id
                                                );
                                            const isUploading =
                                                uploadingSpecialtyId ===
                                                specialty._id;

                                            return (
                                                <div
                                                    key={specialty._id}
                                                    className="bg-zinc-800 border border-zinc-700 rounded-lg p-4"
                                                >
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h3 className="text-lg font-semibold text-white">
                                                            {specialty.nameAr}
                                                        </h3>
                                                        {specialtyVideo && (
                                                            <span className="px-2 py-1 bg-green-500/10 border border-green-500/30 text-green-400 rounded text-xs">
                                                                تم الرفع
                                                            </span>
                                                        )}
                                                    </div>

                                                    {specialtyVideo && (
                                                        <div className="mb-4 aspect-video bg-zinc-900 rounded-lg overflow-hidden">
                                                            <video
                                                                controls
                                                                className="w-full h-full"
                                                                onError={(
                                                                    e
                                                                ) => {
                                                                    console.error(
                                                                        "Video load error:",
                                                                        specialtyVideo.videoUrl
                                                                    );
                                                                }}
                                                            >
                                                                <source
                                                                    src={
                                                                        specialtyVideo.videoUrl.startsWith(
                                                                            "http"
                                                                        )
                                                                            ? encodeURI(
                                                                                  specialtyVideo.videoUrl
                                                                              )
                                                                            : encodeURI(
                                                                                  `${
                                                                                      process
                                                                                          .env
                                                                                          .NEXT_PUBLIC_API_URL ||
                                                                                      "http://localhost:5000/api"
                                                                                  }${
                                                                                      specialtyVideo.videoUrl
                                                                                  }`
                                                                              )
                                                                    }
                                                                    type="video/mp4"
                                                                />
                                                                متصفحك لا يدعم
                                                                تشغيل الفيديو
                                                            </video>
                                                        </div>
                                                    )}

                                                    <label className="block">
                                                        <input
                                                            type="file"
                                                            accept="video/*"
                                                            onChange={(e) =>
                                                                handleVideoUpload(
                                                                    e,
                                                                    specialty._id,
                                                                    specialty.name
                                                                )
                                                            }
                                                            disabled={
                                                                isUploading
                                                            }
                                                            className="hidden"
                                                        />
                                                        <div className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-all cursor-pointer disabled:opacity-50">
                                                            <Upload className="w-4 h-4" />
                                                            <span>
                                                                {isUploading
                                                                    ? "جاري الرفع..."
                                                                    : specialtyVideo
                                                                    ? "تحديث الفيديو"
                                                                    : "رفع فيديو"}
                                                            </span>
                                                        </div>
                                                    </label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Basic Information */}
                            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <User className="w-5 h-5 text-yellow-400" />
                                    <span>المعلومات الأساسية</span>
                                </h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-zinc-400 mb-1">
                                            الاسم الكامل
                                        </p>
                                        <p className="text-white font-medium">
                                            {profile.fullName}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-400 mb-1">
                                            رقم الهاتف
                                        </p>
                                        <p className="text-white font-medium flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-yellow-400" />
                                            {profile.phoneNumber}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-400 mb-1">
                                            الرقم الوطني
                                        </p>
                                        <p className="text-white font-medium">
                                            {profile.nationalID}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-400 mb-1">
                                            الجنس
                                        </p>
                                        <p className="text-white font-medium">
                                            {profile.gender === "male"
                                                ? "ذكر"
                                                : "أنثى"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-400 mb-1">
                                            العمر
                                        </p>
                                        <p className="text-white font-medium flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-yellow-400" />
                                            {profile.age} سنة
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-400 mb-1">
                                            العنوان
                                        </p>
                                        <p className="text-white font-medium flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-yellow-400" />
                                            {profile.address}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Qualifications */}
                            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <GraduationCap className="w-5 h-5 text-yellow-400" />
                                    <span>المؤهلات الأكاديمية</span>
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-zinc-400 mb-1">
                                            المؤهل الأكاديمي
                                        </p>
                                        <p className="text-white font-medium">
                                            {profile.academicQualification}
                                        </p>
                                    </div>
                                    {profile.diploma && (
                                        <div>
                                            <p className="text-sm text-zinc-400 mb-1">
                                                الدبلوم
                                            </p>
                                            <p className="text-white font-medium">
                                                {profile.diploma}
                                            </p>
                                        </div>
                                    )}
                                    {specialties.length > 0 && (
                                        <div>
                                            <p className="text-sm text-zinc-400 mb-2">
                                                التخصصات
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {specialties.map(
                                                    (specialty) => (
                                                        <span
                                                            key={specialty._id}
                                                            className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-full text-sm"
                                                        >
                                                            {specialty.nameAr}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {profile.courses?.length > 0 && (
                                        <div>
                                            <p className="text-sm text-zinc-400 mb-2">
                                                الدورات التدريبية
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {profile.courses.map(
                                                    (course, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-1 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 rounded-full text-sm"
                                                        >
                                                            {course}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Teaching Experience */}
                            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                <h2 className="text-xl font-bold text-white mb-4">
                                    الخبرة التدريسية
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-zinc-400 mb-2">
                                            المراحل التي قمت بتدريسها
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {profile.taughtStages?.map(
                                                (stage, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-zinc-800 border border-zinc-700 text-white rounded-lg text-sm"
                                                    >
                                                        {getStageLabel(stage)}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-400 mb-1">
                                            العمل في عُمان سابقاً
                                        </p>
                                        <p className="text-white font-medium">
                                            {profile.workedInOmanBefore
                                                ? "نعم"
                                                : "لا"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <AlertCircle className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                            <p className="text-zinc-400">
                                لم يتم العثور على البيانات
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
