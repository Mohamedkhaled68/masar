"use client";

import React from "react";
import { useRegistrationStore } from "@/lib/store/registrationStore";
import { InputField } from "@/components/registration/InputField";
import { SelectField } from "@/components/registration/SelectField";

export const TeacherStep1: React.FC = () => {
    const { teacherData, updateTeacherData } = useRegistrationStore();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                    المعلومات الأساسية
                </h2>
                <p className="text-zinc-400">أدخل معلوماتك الشخصية الأساسية</p>
            </div>

            <div className="space-y-5">
                <InputField
                    label="الاسم الكامل"
                    id="fullName"
                    value={teacherData.fullName}
                    onChange={(value) => updateTeacherData({ fullName: value })}
                    placeholder="أدخل اسمك الكامل"
                    required
                />

                <InputField
                    label="كلمة المرور"
                    id="password"
                    type="password"
                    value={teacherData.password}
                    onChange={(value) => updateTeacherData({ password: value })}
                    placeholder="أدخل كلمة المرور"
                    required
                />

                <InputField
                    label="رقم الهاتف (واتساب)"
                    id="phoneNumber"
                    type="tel"
                    value={teacherData.phoneNumber}
                    onChange={(value) =>
                        updateTeacherData({ phoneNumber: value })
                    }
                    placeholder="+968 12345678"
                    required
                />

                <InputField
                    label="الرقم الوطني"
                    id="nationalID"
                    value={teacherData.nationalID}
                    onChange={(value) =>
                        updateTeacherData({ nationalID: value })
                    }
                    placeholder="أدخل الرقم الوطني"
                    required
                />

                <SelectField
                    label="الجنس"
                    id="gender"
                    value={teacherData.gender}
                    onChange={(value) =>
                        updateTeacherData({
                            gender: value as "male" | "female" | "",
                        })
                    }
                    options={[
                        { value: "male", label: "ذكر" },
                        { value: "female", label: "أنثى" },
                    ]}
                    required
                />

                <InputField
                    label="العمر"
                    id="age"
                    type="number"
                    value={teacherData.age}
                    onChange={(value) => updateTeacherData({ age: value })}
                    placeholder="أدخل العمر"
                    required
                />

                <InputField
                    label="العنوان"
                    id="address"
                    value={teacherData.address}
                    onChange={(value) => updateTeacherData({ address: value })}
                    placeholder="أدخل عنوانك"
                    required
                />
            </div>
        </div>
    );
};
