import { TeacherData, SchoolData } from "@/lib/types/registration";

/**
 * Validation functions for registration steps
 */

// Teacher Validation
export const validateTeacherStep1 = (data: TeacherData): string | null => {
    if (!data.fullName.trim()) {
        return "الاسم الكامل مطلوب";
    }
    if (data.fullName.trim().length < 3) {
        return "الاسم يجب أن يكون 3 أحرف على الأقل";
    }
    if (!data.password) {
        return "كلمة المرور مطلوبة";
    }
    if (data.password.length < 6) {
        return "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }
    if (!data.phoneNumber.trim()) {
        return "رقم الهاتف مطلوب";
    }
    // Basic phone validation
    const phoneRegex = /^[+]?[\d\s-]{8,}$/;
    if (!phoneRegex.test(data.phoneNumber)) {
        return "رقم الهاتف غير صحيح";
    }
    if (!data.nationalID.trim()) {
        return "الرقم الوطني مطلوب";
    }
    if (!data.gender) {
        return "الجنس مطلوب";
    }
    if (!data.age || parseInt(data.age) < 18) {
        return "العمر يجب أن يكون 18 سنة أو أكثر";
    }
    if (parseInt(data.age) > 100) {
        return "العمر غير صحيح";
    }
    if (!data.address.trim()) {
        return "العنوان مطلوب";
    }
    return null;
};

export const validateTeacherStep2 = (data: TeacherData): string | null => {
    if (!data.academicQualification.trim()) {
        return "المؤهل الأكاديمي مطلوب";
    }
    if (!data.specialties || data.specialties.length === 0) {
        return "يجب اختيار تخصص واحد على الأقل";
    }
    // diploma is optional
    // courses is optional
    return null;
};

export const validateTeacherStep3 = (data: TeacherData): string | null => {
    if (!data.taughtStages || data.taughtStages.length === 0) {
        return "يجب اختيار مرحلة تدريسية واحدة على الأقل";
    }
    if (data.workedInOmanBefore === null) {
        return "يجب الإجابة على سؤال العمل في عمان";
    }
    return null;
};

export const validateTeacherStep4 = (data: TeacherData): string | null => {
    // Video upload is optional at registration
    // Can be uploaded later from profile
    return null;
};

// School Validation
export const validateSchoolStep1 = (data: SchoolData): string | null => {
    if (!data.managerName.trim()) {
        return "اسم المدير مطلوب";
    }
    if (data.managerName.trim().length < 3) {
        return "اسم المدير يجب أن يكون 3 أحرف على الأقل";
    }
    if (!data.email.trim()) {
        return "البريد الإلكتروني مطلوب";
    }
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return "البريد الإلكتروني غير صحيح";
    }
    if (!data.password) {
        return "كلمة المرور مطلوبة";
    }
    if (data.password.length < 6) {
        return "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }
    if (!data.whatsappPhone.trim()) {
        return "رقم الواتساب مطلوب";
    }
    // Basic phone validation
    const phoneRegex = /^[+]?[\d\s-]{8,}$/;
    if (!phoneRegex.test(data.whatsappPhone)) {
        return "رقم الواتساب غير صحيح";
    }
    if (!data.schoolName.trim()) {
        return "اسم المدرسة مطلوب";
    }
    if (!data.schoolLocation.trim()) {
        return "موقع المدرسة مطلوب";
    }
    return null;
};

export const validateSchoolStep2 = (data: SchoolData): string | null => {
    if (!data.stagesNeeded || data.stagesNeeded.length === 0) {
        return "يجب اختيار مرحلة دراسية واحدة على الأقل";
    }
    if (!data.specialtiesNeeded || data.specialtiesNeeded.length === 0) {
        return "يجب اختيار تخصص واحد على الأقل";
    }
    return null;
};

export const validateSchoolStep3 = (data: SchoolData): string | null => {
    if (!data.expectedSalaryRange.trim()) {
        return "نطاق الراتب المتوقع مطلوب";
    }
    if (!data.flightTicketProvided) {
        return "يجب تحديد خيار تذكرة الطيران";
    }
    if (data.housingProvided === null) {
        return "يجب تحديد خيار السكن";
    }
    // housingAllowance is optional
    return null;
};

export const validateSchoolStep4 = (data: SchoolData): string | null => {
    // Step 4 is confirmation, no validation needed
    return null;
};
