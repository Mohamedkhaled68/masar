"use client";

import React from "react";
import { useRegistrationStore } from "@/lib/store/registrationStore";
import { InputField } from "@/components/registration/InputField";

export const SchoolStep1: React.FC = () => {
    const { schoolData, updateSchoolData } = useRegistrationStore();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                    معلومات المدرسة الأساسية
                </h2>
                <p className="text-zinc-400">أدخل معلومات المدرسة والمسؤول</p>
            </div>

            <div className="space-y-5">
                <InputField
                    label="اسم المدير / المسؤول"
                    id="managerName"
                    value={schoolData.managerName}
                    onChange={(value) =>
                        updateSchoolData({ managerName: value })
                    }
                    placeholder="أدخل اسم المدير"
                    required
                />

                <InputField
                    label="البريد الإلكتروني"
                    id="email"
                    type="email"
                    value={schoolData.email}
                    onChange={(value) => updateSchoolData({ email: value })}
                    placeholder="school@example.com"
                    required
                />

                <InputField
                    label="كلمة المرور"
                    id="password"
                    type="password"
                    value={schoolData.password}
                    onChange={(value) => updateSchoolData({ password: value })}
                    placeholder="أدخل كلمة المرور"
                    required
                />

                <InputField
                    label="رقم الواتساب"
                    id="whatsappPhone"
                    type="tel"
                    value={schoolData.whatsappPhone}
                    onChange={(value) =>
                        updateSchoolData({ whatsappPhone: value })
                    }
                    placeholder="+968 12345678"
                    required
                />

                <InputField
                    label="اسم المدرسة"
                    id="schoolName"
                    value={schoolData.schoolName}
                    onChange={(value) =>
                        updateSchoolData({ schoolName: value })
                    }
                    placeholder="أدخل اسم المدرسة"
                    required
                />

                <InputField
                    label="موقع المدرسة"
                    id="schoolLocation"
                    value={schoolData.schoolLocation}
                    onChange={(value) =>
                        updateSchoolData({ schoolLocation: value })
                    }
                    placeholder="المدينة / المنطقة"
                    required
                />
            </div>
        </div>
    );
};
