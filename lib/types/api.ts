// API Response Types

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: "teacher" | "school" | "admin";
    };
}

export interface Teacher {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    nationalID: string;
    gender: "male" | "female";
    age: number;
    address: string;
    academicQualification: string;
    diploma?: string;
    courses: string[];
    taughtStages: string[];
    workedInOmanBefore: boolean;
    videoUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface School {
    id: string;
    managerName: string;
    email: string;
    whatsappPhone: string;
    schoolName: string;
    schoolLocation: string;
    stagesNeeded: string[];
    specialtiesNeeded: string[];
    expectedSalaryRange: string;
    flightTicketProvided: "full" | "half" | "none";
    housingProvided: boolean;
    housingAllowance?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Video {
    id: string;
    teacherId: string;
    teacherName: string;
    videoUrl: string;
    thumbnailUrl?: string;
    specialty: string;
    stage?: string;
    uploadedAt: string;
    status: "pending" | "approved" | "rejected";
}

export interface Selection {
    id: string;
    schoolId: string;
    teacherId: string;
    videoId: string;
    status: "pending" | "accepted" | "rejected";
    createdAt: string;
    updatedAt: string;
}

export interface Specialty {
    id?: string;
    name: string;
    description?: string;
    teacherCount?: number;
    icon?: React.ReactNode;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ErrorResponse {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
}
