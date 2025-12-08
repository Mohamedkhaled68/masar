"use client";

import React from "react";
import { useRegistrationStore } from "@/lib/store/registrationStore";
import { CheckboxGroup } from "@/components/registration/CheckboxGroup";
import { RadioGroup } from "@/components/registration/RadioGroup";
import { Stage } from "@/lib/types/registration";

export const TeacherStep3: React.FC = () => {
    const { teacherData, updateTeacherData } = useRegistrationStore();

    const stageOptions = [
        { value: "kindergarten", label: "رياض الأطفال" },
        { value: "primary", label: "الحلقة الأولى (1-4)" },
        { value: "preparatory", label: "الحلقة الثانية (5-9)" },
        { value: "secondary", label: "التعليم الثانوي (10-12)" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                    الخبرة التدريسية
                </h2>
                <p className="text-zinc-400">أخبرنا عن خبرتك في التدريس</p>
            </div>

            <div className="space-y-6">
                <CheckboxGroup
                    label="المراحل التي قمت بتدريسها"
                    options={stageOptions}
                    selectedValues={teacherData.taughtStages}
                    onChange={(values) =>
                        updateTeacherData({ taughtStages: values as Stage[] })
                    }
                    required
                />

                <RadioGroup
                    label="هل عملت في عُمان من قبل؟"
                    options={[
                        { value: "true", label: "نعم" },
                        { value: "false", label: "لا" },
                    ]}
                    selectedValue={
                        teacherData.workedInOmanBefore === null
                            ? ""
                            : String(teacherData.workedInOmanBefore)
                    }
                    onChange={(value) =>
                        updateTeacherData({
                            workedInOmanBefore: value === "true",
                        })
                    }
                    required
                />
            </div>
        </div>
    );
};
