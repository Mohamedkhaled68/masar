"use client";

import React from "react";
import { useRegistrationStore } from "@/lib/store/registrationStore";
import { CheckCircle2, Edit2 } from "lucide-react";

export const TeacherStep4: React.FC = () => {
    const { teacherData, goToStep } = useRegistrationStore();

    const sections = [
        {
            title: "المعلومات الأساسية",
            step: 1,
            fields: [
                { label: "الاسم الكامل", value: teacherData.fullName },
                // { label: "البريد الإلكتروني", value: teacherData.email },
                { label: "رقم الهاتف", value: teacherData.phoneNumber },
                { label: "الرقم الوطني", value: teacherData.nationalID },
                {
                    label: "الجنس",
                    value: teacherData.gender === "male" ? "ذكر" : "أنثى",
                },
                { label: "العمر", value: teacherData.age },
                { label: "العنوان", value: teacherData.address },
            ],
        },
        {
            title: "المؤهلات الأكاديمية",
            step: 2,
            fields: [
                {
                    label: "المؤهل الأكاديمي",
                    value: teacherData.academicQualification,
                },
                { label: "الدبلوم", value: teacherData.diploma || "غير محدد" },
                {
                    label: "الدورات التدريبية",
                    value:
                        teacherData.courses.length > 0
                            ? teacherData.courses.join("، ")
                            : "لا توجد",
                },
            ],
        },
        {
            title: "الخبرة التدريسية",
            step: 3,
            fields: [
                {
                    label: "المراحل التي قمت بتدريسها",
                    value: teacherData.taughtStages
                        .map((stage) => {
                            const stageNames: Record<string, string> = {
                                kindergarten: "رياض الأطفال",
                                primary: "الحلقة الأولى",
                                preparatory: "الحلقة الثانية",
                                secondary: "التعليم الثانوي",
                            };
                            return stageNames[stage];
                        })
                        .join("، "),
                },
                {
                    label: "عملت في عُمان من قبل",
                    value: teacherData.workedInOmanBefore ? "نعم" : "لا",
                },
                // {
                //     label: "فيديو التدريس",
                //     value: teacherData.teachingVideoUpload
                //         ? teacherData.teachingVideoUpload.name
                //         : "لم يتم الرفع",
                // },
            ],
        },
    ];

    return (
        <div className="space-y-6">
            <div className="text-center pb-6 border-b border-zinc-800">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400/10 rounded-full mb-4">
                    <CheckCircle2 className="w-8 h-8 text-yellow-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                    مراجعة البيانات
                </h2>
                <p className="text-zinc-400">
                    تأكد من صحة المعلومات قبل التسجيل
                </p>
            </div>

            <div className="space-y-6">
                {sections.map((section) => (
                    <div
                        key={section.step}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-white">
                                {section.title}
                            </h3>
                            <button
                                onClick={() => goToStep(section.step)}
                                className="flex items-center gap-2 text-yellow-400 hover:text-yellow-500 transition-colors"
                            >
                                <Edit2 className="w-4 h-4" />
                                <span>تعديل</span>
                            </button>
                        </div>
                        <div className="space-y-3">
                            {section.fields.map((field, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-start"
                                >
                                    <span className="text-zinc-400 text-sm">
                                        {field.label}:
                                    </span>
                                    <span className="text-white font-medium text-right max-w-xs">
                                        {field.value || "غير محدد"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-6 text-center">
                <p className="text-yellow-400">
                    بالضغط على "إرسال التسجيل" أنت توافق على شروط الخدمة وسياسة
                    الخصوصية
                </p>
            </div>
        </div>
    );
};
