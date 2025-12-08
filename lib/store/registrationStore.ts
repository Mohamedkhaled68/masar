import { create } from "zustand";
import {
    UserType,
    TeacherData,
    SchoolData,
    initialTeacherData,
    initialSchoolData,
} from "@/lib/types/registration";

interface RegistrationStore {
    userType: UserType;
    currentStep: number;
    totalSteps: number;
    teacherData: TeacherData;
    schoolData: SchoolData;

    // Actions
    setUserType: (type: UserType) => void;
    setCurrentStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    updateTeacherData: (data: Partial<TeacherData>) => void;
    updateSchoolData: (data: Partial<SchoolData>) => void;
    resetRegistration: () => void;
    goToStep: (step: number) => void;
}

export const useRegistrationStore = create<RegistrationStore>((set) => ({
    userType: null,
    currentStep: 0,
    totalSteps: 4,
    teacherData: initialTeacherData,
    schoolData: initialSchoolData,

    setUserType: (type) =>
        set({
            userType: type,
            currentStep: type ? 1 : 0,
            totalSteps: 4,
        }),

    setCurrentStep: (step) => set({ currentStep: step }),

    nextStep: () =>
        set((state) => ({
            currentStep: Math.min(state.currentStep + 1, state.totalSteps),
        })),

    prevStep: () =>
        set((state) => ({
            currentStep: Math.max(state.currentStep - 1, 0),
        })),

    updateTeacherData: (data) =>
        set((state) => ({
            teacherData: { ...state.teacherData, ...data },
        })),

    updateSchoolData: (data) =>
        set((state) => ({
            schoolData: { ...state.schoolData, ...data },
        })),

    goToStep: (step) => set({ currentStep: step }),

    resetRegistration: () =>
        set({
            userType: null,
            currentStep: 0,
            totalSteps: 4,
            teacherData: initialTeacherData,
            schoolData: initialSchoolData,
        }),
}));
