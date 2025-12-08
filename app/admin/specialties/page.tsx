"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { specialtyAPI } from "@/lib/api/axios";
import {
    BookOpen,
    Plus,
    Edit2,
    Trash2,
    X,
    Save,
    ArrowRight,
    Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

interface Specialty {
    _id: string;
    name: string;
    nameAr: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

export default function SpecialtiesManagementPage() {
    const router = useRouter();
    const { role } = useAuthStore();
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [filteredSpecialties, setFilteredSpecialties] = useState<Specialty[]>(
        []
    );
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(
        null
    );
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchSpecialties();
    }, []);

    useEffect(() => {
        // Filter specialties based on search query
        if (searchQuery.trim() === "") {
            setFilteredSpecialties(specialties);
        } else {
            const filtered = specialties.filter(
                (specialty) =>
                    specialty.name
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    specialty.nameAr
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    specialty.description
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase())
            );
            setFilteredSpecialties(filtered);
        }
    }, [searchQuery, specialties]);

    const fetchSpecialties = async () => {
        try {
            setLoading(true);
            const response = await specialtyAPI.getAll();
            setSpecialties(response.data.data || response.data);
        } catch (error) {
            toast.error("فشل تحميل التخصصات");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (specialty?: Specialty) => {
        if (specialty) {
            setEditingSpecialty(specialty);
            setFormData({
                name: specialty.name,
                description: specialty.description || "",
            });
        } else {
            setEditingSpecialty(null);
            setFormData({ name: "", description: "" });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingSpecialty(null);
        setFormData({ name: "", description: "" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("اسم التخصص مطلوب");
            return;
        }

        setSubmitting(true);

        try {
            if (editingSpecialty) {
                // Update
                await specialtyAPI.update(editingSpecialty._id, formData);
                toast.success("تم تحديث التخصص بنجاح");
            } else {
                // Create
                await specialtyAPI.create(formData);
                toast.success("تم إضافة التخصص بنجاح");
            }
            handleCloseModal();
            fetchSpecialties();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "فشل حفظ التخصص");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("هل أنت متأكد من حذف هذا التخصص؟")) {
            return;
        }

        try {
            await specialtyAPI.delete(id);
            toast.success("تم حذف التخصص بنجاح");
            fetchSpecialties();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "فشل حذف التخصص");
        }
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
                                <div className="p-3 bg-yellow-400/10 rounded-lg">
                                    <BookOpen className="w-6 h-6 text-yellow-400" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">
                                        إدارة التخصصات
                                    </h1>
                                    <p className="text-sm text-zinc-400 mt-1">
                                        إضافة وتعديل وحذف التخصصات
                                    </p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => handleOpenModal()}
                            className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-all font-semibold"
                        >
                            <Plus className="w-5 h-5" />
                            <span>إضافة تخصص</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                {/* Search Bar */}
                <div className="mb-6 max-w-2xl mx-auto">
                    <div className="relative">
                        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="ابحث عن تخصص..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pr-12 pl-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400 transition-all"
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
                    {searchQuery && (
                        <p className="text-sm text-zinc-400 mt-2">
                            {filteredSpecialties.length} نتيجة
                        </p>
                    )}
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-zinc-400 mt-4">جاري التحميل...</p>
                    </div>
                ) : filteredSpecialties.length === 0 ? (
                    <div className="text-center py-12">
                        <BookOpen className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                        <p className="text-zinc-400 text-lg">
                            {searchQuery
                                ? "لا توجد نتائج للبحث"
                                : "لا توجد تخصصات حالياً"}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={() => handleOpenModal()}
                                className="mt-4 px-6 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-all font-semibold"
                            >
                                إضافة أول تخصص
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSpecialties.map((specialty) => (
                            <div
                                key={specialty._id}
                                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-yellow-400/50 transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white mb-2">
                                            {specialty.nameAr}
                                        </h3>
                                        {specialty.description && (
                                            <p className="text-sm text-zinc-400">
                                                {specialty.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            handleOpenModal(specialty)
                                        }
                                        className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-all flex-1"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        <span>تعديل</span>
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDelete(specialty._id)
                                        }
                                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                            <h2 className="text-xl font-bold text-white">
                                {editingSpecialty
                                    ? "تعديل التخصص"
                                    : "إضافة تخصص جديد"}
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
                                    اسم التخصص{" "}
                                    <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder="مثال: رياضيات"
                                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400 transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    الوصف (اختياري)
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    placeholder="وصف التخصص..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400 transition-all resize-none"
                                />
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
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-all font-semibold disabled:opacity-50"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                            <span>جاري الحفظ...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            <span>حفظ</span>
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
