"use client";

import React from "react";
import { useRegistrationStore } from "@/lib/store/registrationStore";
import { InputField } from "@/components/registration/InputField";
import { SelectField } from "@/components/registration/SelectField";
import { RadioGroup } from "@/components/registration/RadioGroup";
import { FlightTicket } from "@/lib/types/registration";

export const SchoolStep3: React.FC = () => {
    const { schoolData, updateSchoolData } = useRegistrationStore();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                    الراتب والمزايا
                </h2>
                <p className="text-zinc-400">
                    حدد الحزمة المالية والمزايا المقدمة
                </p>
            </div>

            <div className="space-y-6">
                <InputField
                    label="نطاق الراتب المتوقع"
                    id="expectedSalaryRange"
                    value={schoolData.expectedSalaryRange}
                    onChange={(value) =>
                        updateSchoolData({ expectedSalaryRange: value })
                    }
                    placeholder="مثال: 400-600 ريال عماني"
                    required
                />

                <SelectField
                    label="تذكرة الطيران"
                    id="flightTicketProvided"
                    value={schoolData.flightTicketProvided}
                    onChange={(value) =>
                        updateSchoolData({
                            flightTicketProvided: value as FlightTicket | "",
                        })
                    }
                    options={[
                        { value: "full", label: "تذكرة كاملة" },
                        { value: "half", label: "نصف تذكرة" },
                        { value: "none", label: "لا يوجد" },
                    ]}
                    required
                />

                <RadioGroup
                    label="هل يتم توفير سكن؟"
                    options={[
                        { value: "true", label: "نعم" },
                        { value: "false", label: "لا" },
                    ]}
                    selectedValue={
                        schoolData.housingProvided === null
                            ? ""
                            : String(schoolData.housingProvided)
                    }
                    onChange={(value) =>
                        updateSchoolData({ housingProvided: value === "true" })
                    }
                    required
                />

                <InputField
                    label="بدل السكن (إن وُجد)"
                    id="housingAllowance"
                    value={schoolData.housingAllowance}
                    onChange={(value) =>
                        updateSchoolData({ housingAllowance: value })
                    }
                    placeholder="مثال: 100 ريال شهرياً"
                />
            </div>
        </div>
    );
};
