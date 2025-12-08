"use client";

import React from "react";
import { useRegistrationStore } from "@/lib/store/registrationStore";
import { CheckCircle2, Edit2 } from "lucide-react";

export const SchoolStep4: React.FC = () => {
    const { schoolData, goToStep } = useRegistrationStore();

    const sections = [
        {
            title: "معلومات المدرسة الأساسية",
            step: 1,
            fields: [
                { label: "اسم المدير", value: schoolData.managerName },
                { label: "البريد الإلكتروني", value: schoolData.email },
                { label: "رقم الواتساب", value: schoolData.whatsappPhone },
                { label: "اسم المدرسة", value: schoolData.schoolName },
                { label: "موقع المدرسة", value: schoolData.schoolLocation },
            ],
        },
        {
            title: "احتياجات التوظيف",
            step: 2,
            fields: [
                {
                    label: "المراحل الدراسية المطلوبة",
                    value: schoolData.stagesNeeded
                        .map((stage) => {
                            const stageNames: Record<string, string> = {
                                kindergarten: "رياض الأطفال",
                                stageOne: "الحلقة الأولى",
                                stageTwo: "الحلقة الثانية",
                                grade10to12: "الصفوف 10-12",
                            };
                            return stageNames[stage];
                        })
                        .join("، "),
                },
                {
                    label: "التخصصات المطلوبة",
                    value:
                        schoolData.specialtiesNeeded.length > 0
                            ? schoolData.specialtiesNeeded.join("، ")
                            : "لا توجد",
                },
            ],
        },
        {
            title: "الراتب والمزايا",
            step: 3,
            fields: [
                { label: "نطاق الراتب", value: schoolData.expectedSalaryRange },
                {
                    label: "تذكرة الطيران",
                    value:
                        schoolData.flightTicketProvided === "full"
                            ? "تذكرة كاملة"
                            : schoolData.flightTicketProvided === "half"
                            ? "نصف تذكرة"
                            : "لا يوجد",
                },
                {
                    label: "توفير السكن",
                    value: schoolData.housingProvided ? "نعم" : "لا",
                },
                {
                    label: "بدل السكن",
                    value: schoolData.housingAllowance || "غير محدد",
                },
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
