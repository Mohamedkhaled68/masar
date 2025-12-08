"use client";

import React, { useEffect, useState } from "react";
import { useRegistrationStore } from "@/lib/store/registrationStore";
import { InputField } from "@/components/registration/InputField";
import { TagInput } from "@/components/registration/TagInput";
import { CheckboxGroup } from "@/components/registration/CheckboxGroup";
import { specialtyAPI } from "@/lib/api/axios";

interface Specialty {
    _id: string;
    nameAr: string;
    name: string;
    description?: string;
}

export const TeacherStep2: React.FC = () => {
    const { teacherData, updateTeacherData } = useRegistrationStore();
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [loadingSpecialties, setLoadingSpecialties] = useState(true);

    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const response = await specialtyAPI.getAll();
                setSpecialties(response.data.data || response.data);
                console.log(response.data.data || response.data);
                
            } catch (error) {
                console.error("Failed to fetch specialties:", error);
            } finally {
                setLoadingSpecialties(false);
            }
        };

        fetchSpecialties();
    }, []);

    const specialtyOptions = specialties.map((specialty) => ({
        value: specialty._id,
        label: specialty.nameAr,
    }));

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                    المؤهلات الأكاديمية
                </h2>
                <p className="text-zinc-400">
                    أدخل مؤهلاتك العلمية والدورات التدريبية
                </p>
            </div>

            <div className="space-y-5">
                <InputField
                    label="المؤهل الأكاديمي"
                    id="academicQualification"
                    value={teacherData.academicQualification}
                    onChange={(value) =>
                        updateTeacherData({ academicQualification: value })
                    }
                    placeholder="مثال: بكالوريوس في اللغة العربية"
                    required
                />

                <InputField
                    label="الدبلوم (اختياري)"
                    id="diploma"
                    value={teacherData.diploma}
                    onChange={(value) => updateTeacherData({ diploma: value })}
                    placeholder="مثال: دبلوم في التربية"
                />

                {loadingSpecialties ? (
                    <div className="text-zinc-400">جاري تحميل التخصصات...</div>
                ) : (
                    <CheckboxGroup
                        label="التخصصات"
                        options={specialtyOptions}
                        selectedValues={teacherData.specialties}
                        onChange={(values) =>
                            updateTeacherData({ specialties: values })
                        }
                        required
                    />
                )}

                <TagInput
                    label="الدورات التدريبية (اختياري)"
                    values={teacherData.courses}
                    onChange={(values) =>
                        updateTeacherData({ courses: values })
                    }
                    placeholder="أدخل اسم الدورة واضغط إضافة"
                />
            </div>
        </div>
    );
};
