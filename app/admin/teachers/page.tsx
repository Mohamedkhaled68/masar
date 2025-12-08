"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { teacherAPI, specialtyAPI } from "@/lib/api/axios";
import {
    GraduationCap,
    Plus,
    Edit2,
    Trash2,
    X,
    Save,
    ArrowRight,
    Search,
    Phone,
    Mail,
    Award,
    Video,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface Teacher {
    _id: string;
    fullName: string;
    phoneNumber: string;
    email?: string;
    age?: number;
    gender?: string;
    academicQualification?: string;
    specialties?: string[];
    specialtiesData?: Array<{ _id: string; name: string; nameAr: string }>;
    taughtStages?: string[];
    videos?: any[];
    createdAt?: string;
}

interface Specialty {
    _id: string;
    name: string;
    nameAr: string;
}

export default function TeachersManagementPage() {
    const router = useRouter();
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSpecialty, setSelectedSpecialty] = useState("");
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        email: "",
        specialties: [] as string[],
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchTeachers();
        fetchSpecialties();
    }, []);

    useEffect(() => {
        filterTeachers();
    }, [searchQuery, selectedSpecialty, teachers]);

    const fetchTeachers = async (specialtyId?: string) => {
        try {
            setLoading(true);
            const params = specialtyId ? { specialty: specialtyId } : undefined;
            const response = await teacherAPI.getAll(params);
            const teachersData = response.data.data.teachers;

            // Fetch specialty details for each teacher
            const teachersWithSpecialties = await Promise.all(
                teachersData.map(async (teacher: Teacher) => {
                    if (
                        teacher.specialties &&
                        Array.isArray(teacher.specialties)
                    ) {
                        const specialtiesData = await Promise.all(
                            teacher.specialties.map(
                                async (specialtyId: string) => {
                                    try {
                                        const res = await specialtyAPI.getById(
                                            specialtyId
                                        );
                                        return res.data.data || res.data;
                                    } catch (error) {
                                        console.error(
                                            `Failed to fetch specialty ${specialtyId}:`,
                                            error
                                        );
                                        return null;
                                    }
                                }
                            )
                        );
                        return {
                            ...teacher,
                            specialtiesData: specialtiesData.filter(Boolean),
                        };
                    }
                    return { ...teacher, specialtiesData: [] };
                })
            );

            setTeachers(
                Array.isArray(teachersWithSpecialties)
                    ? teachersWithSpecialties
                    : []
            );
        } catch (error) {
            toast.error("فشل تحميل المعلمين");
            setTeachers([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchSpecialties = async () => {
        try {
            const response = await specialtyAPI.getAll();
            setSpecialties(response.data.data || response.data);
        } catch (error) {
            console.error("Failed to fetch specialties:", error);
        }
    };

    const filterTeachers = () => {
        if (!Array.isArray(teachers)) {
            setFilteredTeachers([]);
            return;
        }

        let filtered = [...teachers];

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter(
                (teacher) =>
                    teacher.fullName
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    teacher.phoneNumber?.includes(searchQuery) ||
                    teacher.email
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase())
            );
        }

        // Filter by specialty
        if (selectedSpecialty) {
            filtered = filtered.filter((teacher) =>
                teacher.specialties?.includes(selectedSpecialty)
            );
        }

        setFilteredTeachers(filtered);
    };

    const handleOpenModal = (teacher?: Teacher) => {
        if (teacher) {
            setEditingTeacher(teacher);
            setFormData({
                fullName: teacher.fullName || "",
                phoneNumber: teacher.phoneNumber || "",
                email: teacher.email || "",
                specialties: teacher.specialties || [],
            });
        } else {
            setEditingTeacher(null);
            setFormData({
                fullName: "",
                phoneNumber: "",
                email: "",
                specialties: [],
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingTeacher(null);
        setFormData({
            fullName: "",
            phoneNumber: "",
            email: "",
            specialties: [],
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.fullName.trim()) {
            toast.error("اسم المعلم مطلوب");
            return;
        }

        if (!formData.phoneNumber.trim()) {
            toast.error("رقم الهاتف مطلوب");
            return;
        }

        setSubmitting(true);

        try {
            if (editingTeacher) {
                // Update
                await teacherAPI.update(editingTeacher._id, {
                    name: formData.fullName,
                    phone: formData.phoneNumber,
                    email: formData.email,
                    specialties: formData.specialties,
                });
                toast.success("تم تحديث بيانات المعلم بنجاح");
            }
            handleCloseModal();
            fetchTeachers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "فشل حفظ البيانات");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`هل أنت متأكد من حذف المعلم "${name}"؟`)) {
            return;
        }

        try {
            await teacherAPI.delete(id);
            toast.success("تم حذف المعلم بنجاح");
            fetchTeachers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "فشل حذف المعلم");
        }
    };

    const handleSpecialtyChange = (specialtyId: string) => {
        setFormData((prev) => ({
            ...prev,
            specialties: prev.specialties.includes(specialtyId)
                ? prev.specialties.filter((id) => id !== specialtyId)
                : [...prev.specialties, specialtyId],
        }));
    };

    return (
        <div className="min-h-screen bg-black">
            <Toaster />

            {/* Header */}
            <header className="border-b border-zinc-800 bg-zinc-900">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push("/admin/dashboard")}
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
                                        إدارة المعلمين
                                    </h1>
                                    <p className="text-sm text-zinc-400 mt-1">
                                        عرض وتعديل وحذف المعلمين
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                {/* Search and Filter Bar */}
                <div className="mb-6 space-y-4">
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="ابحث عن معلم..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pr-12 pl-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-400 transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-zinc-800 rounded transition-all"
                                >
                                    <X className="w-4 h-4 text-zinc-400" />
                                </button>
                            )}
                        </div>

                        <select
                            value={selectedSpecialty}
                            onChange={(e) =>
                                setSelectedSpecialty(e.target.value)
                            }
                            className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-blue-400 transition-all"
                        >
                            <option value="">جميع التخصصات</option>
                            {specialties.map((specialty) => (
                                <option
                                    key={specialty._id}
                                    value={specialty._id}
                                >
                                    {specialty.nameAr || specialty.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <p className="text-sm text-zinc-400">
                        {filteredTeachers.length} معلم
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-zinc-400 mt-4">جاري التحميل...</p>
                    </div>
                ) : filteredTeachers.length === 0 ? (
                    <div className="text-center py-12">
                        <GraduationCap className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                        <p className="text-zinc-400 text-lg">
                            {searchQuery || selectedSpecialty
                                ? "لا توجد نتائج للبحث"
                                : "لا يوجد معلمين مسجلين"}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredTeachers.map((teacher) => (
                            <div
                                key={teacher._id}
                                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-blue-400/50 transition-all cursor-pointer"
                                onClick={() =>
                                    router.push(
                                        `/admin/teachers/${teacher._id}`
                                    )
                                }
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white mb-2">
                                            {teacher.fullName}
                                        </h3>

                                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                                            <div className="flex items-center gap-2 text-zinc-400">
                                                <Phone className="w-4 h-4" />
                                                <span>
                                                    {teacher.phoneNumber}
                                                </span>
                                            </div>
                                            {teacher.email && (
                                                <div className="flex items-center gap-2 text-zinc-400">
                                                    <Mail className="w-4 h-4" />
                                                    <span>{teacher.email}</span>
                                                </div>
                                            )}
                                            {teacher.academicQualification && (
                                                <div className="flex items-center gap-2 text-zinc-400">
                                                    <Award className="w-4 h-4" />
                                                    <span>
                                                        {
                                                            teacher.academicQualification
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                            {teacher.videos &&
                                                teacher.videos.length > 0 && (
                                                    <div className="flex items-center gap-2 text-zinc-400">
                                                        <Video className="w-4 h-4" />
                                                        <span>
                                                            {
                                                                teacher.videos
                                                                    .length
                                                            }{" "}
                                                            فيديو
                                                        </span>
                                                    </div>
                                                )}
                                        </div>

                                        {teacher.specialtiesData &&
                                            teacher.specialtiesData.length >
                                                0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {teacher.specialtiesData.map(
                                                        (specialty) => (
                                                            <span
                                                                key={
                                                                    specialty._id
                                                                }
                                                                className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-full text-sm"
                                                            >
                                                                {specialty.nameAr ||
                                                                    specialty.name}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                    </div>

                                    <div className="flex gap-2 mr-4">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenModal(teacher);
                                            }}
                                            className="p-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-all"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(
                                                    teacher._id,
                                                    teacher.fullName
                                                );
                                            }}
                                            className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {showModal && editingTeacher && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-zinc-800 sticky top-0 bg-zinc-900">
                            <h2 className="text-xl font-bold text-white">
                                تعديل بيانات المعلم
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-zinc-800 rounded-lg transition-all"
                            >
                                <X className="w-5 h-5 text-zinc-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    الاسم الكامل{" "}
                                    <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            fullName: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-400 transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    رقم الهاتف{" "}
                                    <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            phoneNumber: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-400 transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    البريد الإلكتروني
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            email: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-400 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    التخصصات
                                </label>
                                <div className="space-y-2 max-h-48 overflow-y-auto p-4 bg-zinc-800 rounded-lg">
                                    {specialties.map((specialty) => (
                                        <label
                                            key={specialty._id}
                                            className="flex items-center gap-3 cursor-pointer hover:bg-zinc-700 p-2 rounded transition-all"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.specialties.includes(
                                                    specialty._id
                                                )}
                                                onChange={() =>
                                                    handleSpecialtyChange(
                                                        specialty._id
                                                    )
                                                }
                                                className="w-4 h-4 rounded border-zinc-600 text-blue-400 focus:ring-blue-400"
                                            />
                                            <span className="text-white">
                                                {specialty.nameAr ||
                                                    specialty.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-all font-semibold"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-semibold disabled:opacity-50"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>جاري الحفظ...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            <span>حفظ التغييرات</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
