import axios from "axios";
import Cookies from "js-cookie";

// Create axios instance
export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
    withCredentials: true, 
});

// Request interceptor to add token from cookies
api.interceptors.request.use(
    (config) => {
        const token = Cookies.get("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear cookies and redirect to login
            Cookies.remove("accessToken");
            Cookies.remove("userRole");
            Cookies.remove("user");
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

// API functions
export const authAPI = {
    // Teacher
    registerTeacher: (data: any) => api.post("/auth/register/teacher", data),
    loginTeacher: (data: { phoneNumber: string; password: string }) =>
        api.post("/auth/login/teacher", data),

    // School
    registerSchool: (data: any) => api.post("/auth/register/school", data),
    loginSchool: (data: { phoneNumber: string; password: string }) =>
        api.post("/auth/login/school", data),

    // Admin
    loginAdmin: (data: { email: string; password: string }) =>
        api.post("/auth/login/admin", data),
};

export const teacherAPI = {
    getAll: (params?: any) => api.get("/teachers", { params }),
    getById: (id: string) => api.get(`/teachers/${id}`),
    getMe: () => api.get("/teachers/me"),
    update: (id: string, data: any) => api.put(`/teachers/${id}`, data),
    delete: (id: string) => api.delete(`/teachers/${id}`),
    uploadVideo: (id: string, formData: FormData) =>
        api.post(`videos/upload`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
};

export const schoolAPI = {
    getAll: (params?: any) => api.get("/schools", { params }),
    getById: (id: string) => api.get(`/schools/${id}`),
    getMe: () => api.get("/schools/me"),
    update: (id: string, data: any) => api.put(`/schools/${id}`, data),
    delete: (id: string) => api.delete(`/schools/${id}`),
};

export const videoAPI = {
    upload: (formData: FormData) =>
        api.post("/videos/upload", formData),
    getAll: (params?: any) => api.get("/videos", { params }),
    getById: (id: string) => api.get(`/videos/${id}`),
    getBySpecialty: (specialty: string) =>
        api.get(`/videos/specialty/${specialty}`),
    delete: (id: string) => api.delete(`/videos/${id}`),
};

export const selectionAPI = {
    accept: (data: { teacherId: string; videoId: string }) =>
        api.post("/selection/accept", data),
    getBySchool: (schoolId: string) => api.get(`/selection/school/${schoolId}`),
    remove: (data: { teacherId: string; schoolId: string }) =>
        api.post("/selection/remove", data),
};

export const specialtyAPI = {
    getAll: () => api.get("/specialties"),
    getById: (id: string) => api.get(`/specialties/${id}`),
    create: (data: { name: string; description?: string }) =>
        api.post("/specialties", data),
    update: (id: string, data: { name: string; description?: string }) =>
        api.put(`/specialties/${id}`, data),
    delete: (id: string) => api.delete(`/specialties/${id}`),
};

export const acceptanceAPI = {
    // School endpoints
    accept: (data: { teacherId: string; notes?: string }) =>
        api.post("/acceptance/accept", data),
    getSchoolAcceptances: (params?: { status?: string }) =>
        api.get("/acceptance/school", { params }),

    // Admin endpoints
    getAll: (params?: {
        status?: string;
        schoolId?: string;
        teacherId?: string;
        page?: number;
        limit?: number;
    }) => api.get("/acceptance/all", { params }),
    updateStatus: (
        id: string,
        data: { status: "approved" | "rejected" | "pending"; notes?: string }
    ) => api.put(`/acceptance/${id}/status`, data),
    delete: (id: string) => api.delete(`/acceptance/${id}`),
};
