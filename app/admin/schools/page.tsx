"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { schoolAPI } from "@/lib/api/axios";
import {
    Shield,
    LogOut,
    Search,
    Edit2,
    Trash2,
    Eye,
    X,
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

export default function SchoolsManagementPage() {
    const router = useRouter();
    const { user, role, logout } = useAuthStore();
    const [schools, setSchools] = useState<School[]>([]);
    const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [editingSchool, setEditingSchool] = useState<School | null>(null);
    const [editForm, setEditForm] = useState({
        schoolName: "",
        managerName: "",
        whatsappPhone: "",
        schoolLocation: "",
        expectedSalaryRange: "",
        housingAllowance: "",
    });

    useEffect(() => {
        if (role !== "admin") {
            router.push("/");
            return;
        }
        fetchSchools();
    }, [role, router]);

    useEffect(() => {
        filterSchools();
    }, [searchTerm, schools]);

    const fetchSchools = async () => {
        try {
            setLoading(true);
            const response = await schoolAPI.getAll();
            const schoolsData =
                response.data?.data.schools || response.data || [];
            console.log(schoolsData);

            setSchools(Array.isArray(schoolsData) ? schoolsData : []);
        } catch (error) {
            console.error("Failed to fetch schools:", error);
            toast.error("فشل في تحميل المدارس");
            setSchools([]);
        } finally {
            setLoading(false);
        }
    };

    const filterSchools = () => {
        if (!searchTerm.trim()) {
            setFilteredSchools(schools);
            return;
        }

        const term = searchTerm.toLowerCase();
        const filtered = schools.filter(
            (school) =>
                school.schoolName?.toLowerCase().includes(term) ||
                school.managerName?.toLowerCase().includes(term) ||
                school.whatsappPhone?.includes(term) ||
                school.schoolLocation?.toLowerCase().includes(term)
        );
        setFilteredSchools(filtered);
    };

    const handleEdit = (school: School) => {
        setEditingSchool(school);
        setEditForm({
            schoolName: school.schoolName || "",
            managerName: school.managerName || "",
            whatsappPhone: school.whatsappPhone || "",
            schoolLocation: school.schoolLocation || "",
            expectedSalaryRange: school.expectedSalaryRange || "",
            housingAllowance: school.housingAllowance || "",
        });
    };

    const handleUpdate = async () => {
        if (!editingSchool) return;

        if (
            !editForm.schoolName ||
            !editForm.managerName ||
            !editForm.whatsappPhone
        ) {
            toast.error("الرجاء ملء جميع الحقول المطلوبة");
            return;
        }

        try {
            await schoolAPI.update(editingSchool._id, editForm);
            toast.success("تم تحديث المدرسة بنجاح");
            setEditingSchool(null);
            fetchSchools();
        } catch (error) {
            console.error("Failed to update school:", error);
            toast.error("فشل في تحديث المدرسة");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await schoolAPI.delete(id);
            toast.success("تم حذف المدرسة بنجاح");
            setDeleteConfirm(null);
            fetchSchools();
        } catch (error) {
            console.error("Failed to delete school:", error);
            toast.error("فشل في حذف المدرسة");
        }
    };

    const handleLogout = () => {
        logout();
    };

    const handleViewDetails = (id: string) => {
        router.push(`/admin/schools/${id}`);
    };

    if (role !== "admin") {
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
                                    إدارة المدارس
                                </h1>
                                <p className="text-sm text-zinc-400">
                                    عرض وإدارة جميع المدارس المسجلة
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
                <div className="max-w-7xl mx-auto">
                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="بحث باسم المدرسة، اسم المدير، الهاتف، أو الموقع..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pr-12 pl-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400"
                            />
                        </div>
                    </div>

                    {/* Schools List */}
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
                        </div>
                    ) : filteredSchools.length === 0 ? (
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
                            <p className="text-zinc-400">لا توجد مدارس</p>
                        </div>
                    ) : (
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-zinc-800">
                                        <tr>
                                            <th className="px-6 py-4 text-right text-sm font-semibold text-white">
                                                اسم المدرسة
                                            </th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold text-white">
                                                اسم المدير
                                            </th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold text-white">
                                                واتساب
                                            </th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold text-white">
                                                الموقع
                                            </th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold text-white">
                                                التخصصات
                                            </th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold text-white">
                                                الإجراءات
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800">
                                        {filteredSchools.map((school) => (
                                            <tr
                                                key={school._id}
                                                className="hover:bg-zinc-800/50 transition-colors cursor-pointer"
                                                onClick={() =>
                                                    handleViewDetails(
                                                        school._id
                                                    )
                                                }
                                            >
                                                <td className="px-6 py-4 text-white">
                                                    {school.schoolName}
                                                </td>
                                                <td className="px-6 py-4 text-zinc-400">
                                                    {school.managerName}
                                                </td>
                                                <td className="px-6 py-4 text-zinc-400">
                                                    {school.whatsappPhone}
                                                </td>
                                                <td className="px-6 py-4 text-zinc-400">
                                                    {school.schoolLocation ||
                                                        "-"}
                                                </td>
                                                <td className="px-6 py-4 text-zinc-400">
                                                    {school.specialtiesNeeded
                                                        ?.length || 0}
                                                </td>
                                                <td
                                                    className="px-6 py-4"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() =>
                                                                handleViewDetails(
                                                                    school._id
                                                                )
                                                            }
                                                            className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                                                            title="عرض التفاصيل"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleEdit(
                                                                    school
                                                                )
                                                            }
                                                            className="p-2 text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors"
                                                            title="تعديل"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                setDeleteConfirm(
                                                                    school._id
                                                                )
                                                            }
                                                            className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                                            title="حذف"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {editingSchool && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">
                                    تعديل المدرسة
                                </h2>
                                <button
                                    onClick={() => setEditingSchool(null)}
                                    className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-zinc-400" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                                        اسم المدرسة *
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.schoolName}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                schoolName: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                                        اسم المدير *
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.managerName}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                managerName: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                                        رقم الواتساب *
                                    </label>
                                    <input
                                        type="tel"
                                        value={editForm.whatsappPhone}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                whatsappPhone: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                                        موقع المدرسة
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.schoolLocation}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                schoolLocation: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                                        نطاق الراتب المتوقع
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.expectedSalaryRange}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                expectedSalaryRange:
                                                    e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                                        بدل السكن
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.housingAllowance}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                housingAllowance:
                                                    e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleUpdate}
                                    className="flex-1 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
                                >
                                    حفظ التغييرات
                                </button>
                                <button
                                    onClick={() => setEditingSchool(null)}
                                    className="flex-1 py-3 bg-zinc-800 text-white font-semibold rounded-lg hover:bg-zinc-700 transition-colors"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-white mb-4">
                            تأكيد الحذف
                        </h3>
                        <p className="text-zinc-400 mb-6">
                            هل أنت متأكد من حذف هذه المدرسة؟ لا يمكن التراجع عن
                            هذا الإجراء.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="flex-1 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
                            >
                                حذف
                            </button>
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 py-2 bg-zinc-800 text-white font-semibold rounded-lg hover:bg-zinc-700 transition-colors"
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
