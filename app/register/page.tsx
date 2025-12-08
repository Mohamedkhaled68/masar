"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useRegistrationStore } from "@/lib/store/registrationStore";
import { useAuthStore } from "@/lib/store/authStore";
import { authAPI } from "@/lib/api/axios";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import {
    validateTeacherStep1,
    validateTeacherStep2,
    validateTeacherStep3,
    validateTeacherStep4,
    validateSchoolStep1,
    validateSchoolStep2,
    validateSchoolStep3,
    validateSchoolStep4,
} from "@/lib/validation/registrationValidation";

// Components
import { UserTypeSelection } from "@/components/registration/UserTypeSelection";
import { ProgressIndicator } from "@/components/registration/ProgressIndicator";

// Teacher Steps
import { TeacherStep1 } from "@/components/registration/teacher/TeacherStep1";
import { TeacherStep2 } from "@/components/registration/teacher/TeacherStep2";
import { TeacherStep3 } from "@/components/registration/teacher/TeacherStep3";
import { TeacherStep4 } from "@/components/registration/teacher/TeacherStep4";

// School Steps
import { SchoolStep1 } from "@/components/registration/school/SchoolStep1";
import { SchoolStep2 } from "@/components/registration/school/SchoolStep2";
import { SchoolStep3 } from "@/components/registration/school/SchoolStep3";
import { SchoolStep4 } from "@/components/registration/school/SchoolStep4";

export default function RegisterPage() {
    const router = useRouter();
    const { setAuth } = useAuthStore();
    const {
        userType,
        currentStep,
        totalSteps,
        nextStep,
        prevStep,
        resetRegistration,
        teacherData,
        schoolData,
    } = useRegistrationStore();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const validateCurrentStep = (): boolean => {
        let validationError: string | null = null;

        if (userType === "teacher") {
            switch (currentStep) {
                case 1:
                    validationError = validateTeacherStep1(teacherData);
                    break;
                case 2:
                    validationError = validateTeacherStep2(teacherData);
                    break;
                case 3:
                    validationError = validateTeacherStep3(teacherData);
                    break;
                case 4:
                    validationError = validateTeacherStep4(teacherData);
                    break;
            }
        } else if (userType === "school") {
            switch (currentStep) {
                case 1:
                    validationError = validateSchoolStep1(schoolData);
                    break;
                case 2:
                    validationError = validateSchoolStep2(schoolData);
                    break;
                case 3:
                    validationError = validateSchoolStep3(schoolData);
                    break;
                case 4:
                    validationError = validateSchoolStep4(schoolData);
                    break;
            }
        }

        if (validationError) {
            toast.error(validationError, {
                duration: 4000,
                position: "top-center",
                style: {
                    background: "#18181b",
                    color: "#fff",
                    border: "1px solid #ef4444",
                },
                iconTheme: {
                    primary: "#ef4444",
                    secondary: "#fff",
                },
            });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validate current step
        if (!validateCurrentStep()) {
            return;
        }

        if (currentStep < totalSteps) {
            toast.success("تم حفظ البيانات بنجاح", {
                duration: 2000,
                position: "top-center",
                style: {
                    background: "#18181b",
                    color: "#fff",
                    border: "1px solid #facc15",
                },
                iconTheme: {
                    primary: "#facc15",
                    secondary: "#000",
                },
            });
            nextStep();
        } else {
            // Final submission
            setLoading(true);

            try {
                let response;

                if (userType === "teacher") {
                    // Prepare teacher registration data
                    const registrationData = {
                        fullName: teacherData.fullName,
                        password: teacherData.password,
                        phoneNumber: teacherData.phoneNumber,
                        nationalID: teacherData.nationalID,
                        gender: teacherData.gender,
                        age: parseInt(teacherData.age),
                        address: teacherData.address,
                        academicQualification:
                            teacherData.academicQualification,
                        diploma: teacherData.diploma,
                        courses: teacherData.courses,
                        specialties: teacherData.specialties,
                        taughtStages: teacherData.taughtStages,
                        workedInOmanBefore: teacherData.workedInOmanBefore,
                    };

                    response = await authAPI.registerTeacher(registrationData);
                } else if (userType === "school") {
                    // Prepare school registration data
                    const registrationData = {
                        managerName: schoolData.managerName,
                        email: schoolData.email,
                        password: schoolData.password,
                        whatsappPhone: schoolData.whatsappPhone,
                        schoolName: schoolData.schoolName,
                        schoolLocation: schoolData.schoolLocation,
                        stagesNeeded: schoolData.stagesNeeded,
                        specialtiesNeeded: schoolData.specialtiesNeeded,
                        expectedSalaryRange: schoolData.expectedSalaryRange,
                        flightTicketProvided: schoolData.flightTicketProvided,
                        housingProvided: schoolData.housingProvided,
                        housingAllowance: schoolData.housingAllowance,
                    };

                    response = await authAPI.registerSchool(registrationData);
                }

                // Registration successful
                if (response?.data?.data) {
                    const { accessToken, user } = response.data.data;

                    // Map user data to match our store structure
                    const mappedUser = {
                        id: user._id,
                        email: user.email || "",
                        name: user.fullName || user.managerName || "",
                        role: user.role,
                    };

                    // Store auth data
                    setAuth(accessToken, mappedUser, userType);

                    // Show success message
                    setSuccess(true);
                    toast.success("تم التسجيل بنجاح! جاري التحويل...", {
                        duration: 2000,
                        position: "top-center",
                        style: {
                            background: "#18181b",
                            color: "#fff",
                            border: "1px solid #22c55e",
                        },
                        iconTheme: {
                            primary: "#22c55e",
                            secondary: "#fff",
                        },
                    });

                    // Wait a moment then redirect
                    setTimeout(() => {
                        if (userType === "teacher") {
                            router.push("/teacher/profile");
                        } else {
                            router.push("/school/home");
                        }
                    }, 2000);
                }
            } catch (err: any) {
                console.error("Registration error:", err);
                const errorMessage =
                    err.response?.data?.message ||
                    "فشل التسجيل. يرجى المحاولة مرة أخرى أو التواصل مع الدعم.";
                setError(errorMessage);
                toast.error(errorMessage, {
                    duration: 5000,
                    position: "top-center",
                    style: {
                        background: "#18181b",
                        color: "#fff",
                        border: "1px solid #ef4444",
                    },
                    iconTheme: {
                        primary: "#ef4444",
                        secondary: "#fff",
                    },
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleBack = () => {
        if (currentStep === 1) {
            // Go back to user type selection
            resetRegistration();
        } else {
            prevStep();
        }
    };

    const renderStep = () => {
        if (userType === "teacher") {
            switch (currentStep) {
                case 1:
                    return <TeacherStep1 />;
                case 2:
                    return <TeacherStep2 />;
                case 3:
                    return <TeacherStep3 />;
                case 4:
                    return <TeacherStep4 />;
                default:
                    return null;
            }
        } else if (userType === "school") {
            switch (currentStep) {
                case 1:
                    return <SchoolStep1 />;
                case 2:
                    return <SchoolStep2 />;
                case 3:
                    return <SchoolStep3 />;
                case 4:
                    return <SchoolStep4 />;
                default:
                    return null;
            }
        }
        return null;
    };

    const getButtonText = () => {
        if (loading) {
            return "جاري الإرسال...";
        }
        if (currentStep === totalSteps) {
            return "إرسال التسجيل";
        }
        return "التالي";
    };

    // Show user type selection if no type is selected
    if (currentStep === 0 || !userType) {
        return <UserTypeSelection />;
    }

    return (
        <div className="min-h-screen bg-black">
            {/* Toast Container */}
            <Toaster />

            {/* Progress Indicator */}
            <ProgressIndicator
                currentStep={currentStep}
                totalSteps={totalSteps}
                userType={userType}
            />

            {/* Header */}
            <div className="border-b border-zinc-800">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <Link href="/">
                            <Image
                                src="/masar-logo.png"
                                alt="مسار"
                                width={192}
                                height={64}
                                className="h-12 w-auto object-contain cursor-pointer"
                                priority
                            />
                        </Link>
                        <Link
                            href="/login"
                            className="text-zinc-400 hover:text-white transition-colors"
                        >
                            لديك حساب؟{" "}
                            <span className="text-yellow-400">سجل الدخول</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Form */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto">
                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-green-400 font-semibold">
                                    تم التسجيل بنجاح!
                                </p>
                                <p className="text-green-400/80 text-sm mt-1">
                                    جاري تحويلك إلى لوحة التحكم...
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-red-400">{error}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Step Content */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                            {renderStep()}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between gap-4">
                            <button
                                type="button"
                                onClick={handleBack}
                                disabled={loading || success}
                                className="flex items-center gap-2 px-6 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ArrowRight className="w-5 h-5" />
                                <span>رجوع</span>
                            </button>

                            <button
                                type="submit"
                                disabled={loading || success}
                                className="flex items-center gap-2 px-8 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-all font-semibold shadow-lg shadow-yellow-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>{getButtonText()}</span>
                                {!loading && <ArrowLeft className="w-5 h-5" />}
                                {loading && (
                                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
