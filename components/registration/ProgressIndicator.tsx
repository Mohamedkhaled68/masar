import React from "react";

interface ProgressIndicatorProps {
    currentStep: number;
    totalSteps: number;
    userType: "teacher" | "school" | null;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
    currentStep,
    totalSteps,
    userType,
}) => {
    if (currentStep === 0) return null;

    const progress = (currentStep / totalSteps) * 100;

    return (
        <div className="w-full bg-zinc-900 border-b border-zinc-800 py-6">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-zinc-400">
                            الخطوة {currentStep} من {totalSteps}
                        </span>
                        <span className="text-sm text-yellow-400 font-semibold">
                            {userType === "teacher"
                                ? "تسجيل معلم"
                                : "تسجيل مدرسة"}
                        </span>
                    </div>
                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-linear-to-r from-yellow-400 to-yellow-500 transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
