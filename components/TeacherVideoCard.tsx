import React, { useState, useEffect } from "react";
import { User, CheckCircle2, Video as VideoIcon } from "lucide-react";
import { specialtyAPI } from "@/lib/api/axios";

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
        specialties?: string[];
    };
    specialty: any;
    uploadedAt: string;
}

interface TeacherVideoCardProps {
    video: TeacherVideo;
    onSelect: (teacherId: string) => void;
    isSelecting?: boolean;
}

export const TeacherVideoCard: React.FC<TeacherVideoCardProps> = ({
    video,
    onSelect,
    isSelecting = false,
}) => {
    const [selected, setSelected] = useState(false);
    const [specialtyNames, setSpecialtyNames] = useState<string[]>([]);
    const [loadingSpecialties, setLoadingSpecialties] = useState(true);

    // Helper function to construct full video URL
    const getFullVideoUrl = (videoUrl: string) => {
        if (!videoUrl) return "";

        // Clean up any whitespace
        const cleanUrl = videoUrl.trim();

        // If URL already starts with http:// or https://, return as is
        if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
            console.log("Full URL detected:", cleanUrl);
            return cleanUrl;
        }

        // Otherwise, prepend the API base URL (use https in production)
        const baseUrl =
            process.env.NODE_ENV === "production"
                ? "https://api.masar.work"
                : "http://api.masar.work";

        // Ensure the path starts with /
        const path = cleanUrl.startsWith("/") ? cleanUrl : `/${cleanUrl}`;
        const fullUrl = `${baseUrl}${path}`;
        console.log("Constructed URL:", fullUrl);
        return fullUrl;
    };

    useEffect(() => {
        const fetchSpecialties = async () => {
            if (
                !video.teacher?.specialties ||
                video.teacher.specialties.length === 0
            ) {
                setLoadingSpecialties(false);
                return;
            }

            try {
                const specialtyPromises = video.teacher.specialties.map(
                    async (specialtyId: string) => {
                        try {
                            const res = await specialtyAPI.getById(specialtyId);
                            const specialty = res.data?.data || res.data;
                            return specialty?.nameAr || specialty?.nameEn || "";
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
                setSpecialtyNames(names.filter((name) => name !== ""));
            } catch (error) {
                console.error("Failed to fetch specialties:", error);
            } finally {
                setLoadingSpecialties(false);
            }
        };

        fetchSpecialties();
    }, [video.teacher?.specialties]);

    const handleSelect = () => {
        onSelect(video.teacher._id);
        setSelected(true);
    };

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-yellow-400 transition-all">
            {/* Video Player */}
            <div className="aspect-video bg-zinc-800 relative group">
                {video.videoUrl ? (
                    <video
                        controls
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            console.error(
                                "Video load error:",
                                getFullVideoUrl(video.videoUrl)
                            );
                        }}
                    >
                        <source
                            src={getFullVideoUrl(video.videoUrl)}
                            type="video/mp4"
                        />
                        متصفحك لا يدعم تشغيل الفيديو
                    </video>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <VideoIcon className="w-12 h-12 text-zinc-600" />
                    </div>
                )}
            </div>

            {/* Teacher Info */}
            <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-yellow-400/10 rounded-lg">
                        <User className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">
                            {video.teacher?.fullName}
                        </h3>
                        {video.teacher?.experience && (
                            <p className="text-sm text-zinc-400">
                                الخبرة: {video.teacher.experience} سنوات
                            </p>
                        )}
                        {!loadingSpecialties && specialtyNames.length > 0 && (
                            <p className="text-sm text-yellow-400 mt-1">
                                التخصصات: {specialtyNames.join("، ")}
                            </p>
                        )}
                        {loadingSpecialties && (
                            <p className="text-sm text-zinc-500 mt-1">
                                جاري تحميل التخصصات...
                            </p>
                        )}
                    </div>
                </div>

                {/* Select Button */}
                {selected ? (
                    <div className="flex items-center justify-center gap-2 py-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-semibold">تم الاختيار</span>
                    </div>
                ) : (
                    <button
                        onClick={handleSelect}
                        disabled={isSelecting}
                        className="w-full py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-400/20"
                    >
                        {isSelecting ? "جاري الإرسال..." : "اختيار هذا المعلم"}
                    </button>
                )}
            </div>
        </div>
    );
};
