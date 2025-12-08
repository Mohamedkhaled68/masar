"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { videoAPI, selectionAPI, specialtyAPI } from "@/lib/api/axios";
import { TeacherVideoCard } from "@/components/TeacherVideoCard";
import { ArrowRight, AlertCircle, CheckCircle } from "lucide-react";

interface TeacherVideo {
    _id: string;
    title: string;
    videoUrl: string;
    teacher: {
        _id: string;
        fullName: string;
        email?: string;
        phoneNumber?: string;
        experience?: number;
    };
    specialty: any;
    uploadedAt: string;
}

interface Specialty {
    _id: string;
    name: string;
    nameAr: string;
    description?: string;
}

export default function SpecialtyVideosPage() {
    const router = useRouter();
    const params = useParams();
    const specialtyId = params.name as string;
    const { role } = useAuthStore();

    const [specialty, setSpecialty] = useState<Specialty | null>(null);
    const [videos, setVideos] = useState<TeacherVideo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isSelecting, setIsSelecting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        fetchSpecialtyAndVideos();
    }, [specialtyId]);

    const fetchSpecialtyAndVideos = async () => {
        try {
            setLoading(true);

            // Fetch specialty details
            const specialtyResponse = await specialtyAPI.getById(specialtyId);
            const specialtyData =
                specialtyResponse.data.data || specialtyResponse.data;
            setSpecialty(specialtyData);

            // Fetch videos for this specialty
            const videosResponse = await videoAPI.getBySpecialty(specialtyId);
            const responseData =
                videosResponse.data.data || videosResponse.data;
            setVideos(responseData.videos || []);
            console.log(responseData);
            
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                    "فشل تحميل البيانات. حاول مرة أخرى"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTeacher = async (video: TeacherVideo) => {
        setIsSelecting(true);
        setError("");
        setSuccessMessage("");

        try {
            await selectionAPI.accept({
                teacherId: video.teacher._id,
                videoId: video._id,
            });
            setSuccessMessage(
                "تم إرسال اختيارك بنجاح، وسيتم التواصل معك عبر الأدمن."
            );

            // Scroll to top to show success message
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                    "فشل إرسال الاختيار. حاول مرة أخرى"
            );
        } finally {
            setIsSelecting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black">
            {/* Header */}
            <header className="border-b border-zinc-800 bg-zinc-900">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-zinc-800 rounded-lg transition-all"
                        >
                            <ArrowRight className="w-6 h-6 text-white" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                {loading
                                    ? "جاري التحميل..."
                                    : specialty
                                    ? `المعلمون المتاحون لتخصص: ${
                                          specialty.nameAr || specialty.name
                                      }`
                                    : "تخصص غير معروف"}
                            </h1>
                            <p className="text-sm text-zinc-400 mt-1">
                                اختر المعلم المناسب من خلال مشاهدة الفيديوهات
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    {/* Success Message */}
                    {successMessage && (
                        <div className="mb-8 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-green-400 font-semibold">
                                    {successMessage}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-red-400">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-zinc-400 mt-4">
                                جاري تحميل الفيديوهات...
                            </p>
                        </div>
                    ) : videos.length === 0 ? (
                        /* Empty State */
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-800 rounded-full mb-4">
                                <AlertCircle className="w-8 h-8 text-zinc-600" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                لا توجد فيديوهات متاحة
                            </h3>
                            <p className="text-zinc-400 mb-6">
                                لا يوجد معلمون متاحون لهذا التخصص حالياً
                            </p>
                            <button
                                onClick={() => router.back()}
                                className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-all"
                            >
                                العودة للتخصصات
                            </button>
                        </div>
                    ) : (
                        /* Videos Grid */
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {videos.map((video) => (
                                <TeacherVideoCard
                                    key={video._id}
                                    video={video}
                                    onSelect={() => handleSelectTeacher(video)}
                                    isSelecting={isSelecting}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
