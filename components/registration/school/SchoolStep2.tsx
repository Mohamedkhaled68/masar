"use client";

import React, { useEffect, useState } from "react";
import { useRegistrationStore } from "@/lib/store/registrationStore";
import { CheckboxGroup } from "@/components/registration/CheckboxGroup";
import { specialtyAPI } from "@/lib/api/axios";
import { SchoolStage } from "@/lib/types/registration";

interface Specialty {
    _id: string;
    name: string;
    nameAr: string;
}

export const SchoolStep2: React.FC = () => {
    const { schoolData, updateSchoolData } = useRegistrationStore();
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSpecialties();
    }, []);

    const fetchSpecialties = async () => {
        try {
            setLoading(true);
            const response = await specialtyAPI.getAll();
            const specialtiesData = response.data.data || response.data || [];
            setSpecialties(
                Array.isArray(specialtiesData) ? specialtiesData : []
            );
        } catch (error) {
            console.error("Failed to fetch specialties:", error);
            setSpecialties([]);
        } finally {
            setLoading(false);
        }
    };

    const stageOptions = [
        { value: "kindergarten", label: "رياض الأطفال" },
        { value: "stageOne", label: "الحلقة الأولى (1-4)" },
        { value: "stageTwo", label: "الحلقة الثانية (5-9)" },
        { value: "grade10to12", label: "الصفوف (10-12)" },
    ];

    const specialtyOptions = specialties.map((specialty) => ({
        value: specialty._id,
        label: specialty.nameAr || specialty.name,
    }));

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                    احتياجات التوظيف
                </h2>
                <p className="text-zinc-400">حدد المراحل والتخصصات المطلوبة</p>
            </div>

            <div className="space-y-6">
                <CheckboxGroup
                    label="المراحل الدراسية المطلوبة"
                    options={stageOptions}
                    selectedValues={schoolData.stagesNeeded}
                    onChange={(values) =>
                        updateSchoolData({
                            stagesNeeded: values as SchoolStage[],
                        })
                    }
                    required
                />

                {loading ? (
                    <div className="text-center py-8">
                        <div className="inline-block w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-zinc-400 mt-2">
                            جاري تحميل التخصصات...
                        </p>
                    </div>
                ) : (
                    <CheckboxGroup
                        label="التخصصات المطلوبة"
                        options={specialtyOptions}
                        selectedValues={schoolData.specialtiesNeeded}
                        onChange={(values) =>
                            updateSchoolData({ specialtiesNeeded: values })
                        }
                        required
                    />
                )}
            </div>
        </div>
    );
};
