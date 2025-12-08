export type UserType = "teacher" | "school" | null;

export type Gender = "male" | "female";

export type Stage = "kindergarten" | "primary" | "preparatory" | "secondary";

export type SchoolStage =
    | "kindergarten"
    | "stageOne"
    | "stageTwo"
    | "grade10to12";

export type FlightTicket = "full" | "half" | "none";

export interface TeacherData {
    // Step 1 - Basic Info
    fullName: string;
    password: string;
    phoneNumber: string;
    nationalID: string;
    gender: Gender | "";
    age: string;
    address: string;

    // Step 2 - Qualifications
    academicQualification: string;
    diploma: string;
    courses: string[];
    specialties: string[]; // Array of specialty IDs

    // Step 3 - Teaching Experience
    taughtStages: Stage[];
    workedInOmanBefore: boolean | null;
}

export interface SchoolData {
    // Step 1 - Basic Info
    managerName: string;
    email: string;
    password: string;
    whatsappPhone: string;
    schoolName: string;
    schoolLocation: string;

    // Step 2 - Teacher Requirements
    stagesNeeded: SchoolStage[];
    specialtiesNeeded: string[];

    // Step 3 - Salary & Benefits
    expectedSalaryRange: string;
    flightTicketProvided: FlightTicket | "";
    housingProvided: boolean | null;
    housingAllowance: string;
}

export const initialTeacherData: TeacherData = {
    fullName: "",
    password: "",
    phoneNumber: "",
    nationalID: "",
    gender: "",
    age: "",
    address: "",
    academicQualification: "",
    diploma: "",
    courses: [],
    specialties: [],
    taughtStages: [],
    workedInOmanBefore: null,
};

export const initialSchoolData: SchoolData = {
    managerName: "",
    email: "",
    password: "",
    whatsappPhone: "",
    schoolName: "",
    schoolLocation: "",
    stagesNeeded: [],
    specialtiesNeeded: [],
    expectedSalaryRange: "",
    flightTicketProvided: "",
    housingProvided: null,
    housingAllowance: "",
};
