# 🚀 Quick Start Guide - Masar Platform

## Overview

Complete Next.js frontend for the Masar teacher recruitment platform with authentication, multi-step registration, and role-based dashboards.

---

## 🎯 What's Been Built

### 1️⃣ **Complete Registration Flow**

-   Multi-step forms for Teachers (4 steps) & Schools (4 steps)
-   User type selection screen
-   Progress indicator
-   Form validation
-   File upload for teaching videos
-   Review step before submission

### 2️⃣ **Authentication System**

-   Login page for Teachers & Schools (with type selector)
-   Admin login page (separate)
-   JWT token management
-   Persistent auth state (Zustand + localStorage)
-   Automatic token injection in API calls

### 3️⃣ **Role-Based Dashboards**

**Admin** (`/admin/dashboard`)

-   Statistics overview
-   Quick action menu
-   User management placeholders

**Teacher** (`/teacher/profile`)

-   View complete profile
-   Upload teaching video
-   See all qualifications & experience

**School** (`/school/home`)

-   Browse specialties
-   View teachers by specialty
-   Select teachers via video review
-   Receive confirmation messages

### 4️⃣ **Route Protection**

-   Automatic role-based redirects
-   Auth guards on protected routes
-   Logout functionality

---

## 📦 Installation

```bash
# 1. Navigate to project
cd d:\projects\masar

# 2. Install dependencies (already done)
npm install

# 3. Configure environment
# Create .env.local with:
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# 4. Run development server
npm run dev
```

---

## 🌐 Routes Map

### Public Routes

| Route          | Description             |
| -------------- | ----------------------- |
| `/`            | Landing page            |
| `/login`       | Login (Teacher/School)  |
| `/register`    | Multi-step registration |
| `/admin/login` | Admin login             |

### Protected Routes

| Route                      | Role    | Description                |
| -------------------------- | ------- | -------------------------- |
| `/admin/dashboard`         | Admin   | Admin control panel        |
| `/teacher/profile`         | Teacher | Teacher dashboard          |
| `/school/home`             | School  | Browse specialties         |
| `/school/specialty/[name]` | School  | View teachers by specialty |

---

## 🔑 Testing Accounts

### For Backend Testing

You'll need to create these in your backend:

**Admin**

```
Email: admin@masar.com
Password: [set in backend]
```

**Teacher**

```
Email: teacher@example.com
Password: [set after registration]
```

**School**

```
Email: school@example.com
Password: [set after registration]
```

---

## 🎨 UI Flow Examples

### Registration Flow

1. Visit `/register`
2. Select user type (Teacher or School)
3. Complete multi-step form:
    - **Teachers**: Basic Info → Qualifications → Experience → Review
    - **Schools**: Basic Info → Requirements → Salary/Benefits → Review
4. Submit (integrates with backend API)

### Teacher Login & Profile

1. Visit `/login`
2. Select "معلم" (Teacher)
3. Enter credentials
4. Redirected to `/teacher/profile`
5. Upload teaching video
6. View complete profile

### School Selection Flow

1. Visit `/login`
2. Select "مدرسة" (School)
3. Enter credentials
4. Redirected to `/school/home`
5. Click on specialty (e.g., "رياضيات")
6. View teacher videos
7. Click "اختيار هذا المعلم"
8. Receive confirmation

---

## 🔌 Backend API Integration

### Expected Endpoints

All endpoints are prefixed with `NEXT_PUBLIC_API_URL` from `.env.local`

**Auth**

-   `POST /auth/login/teacher`
-   `POST /auth/login/school`
-   `POST /auth/login/admin`
-   `POST /auth/register/teacher`
-   `POST /auth/register/school`

**Teachers**

-   `GET /teachers/me` (authenticated)
-   `GET /teachers/:id`
-   `PUT /teachers/:id`

**Schools**

-   `GET /schools/me` (authenticated)
-   `GET /schools/:id`

**Videos**

-   `POST /videos/teachers/:id/upload` (multipart/form-data)
-   `GET /videos/by-specialty/:specialty`
-   `GET /videos`

**Selection**

-   `POST /selection/accept` (body: `{ teacherId, videoId }`)
-   `GET /selection/school/:schoolId`

**Specialties** (optional)

-   `GET /specialties`
-   _Fallback: Uses static list if not available_

---

## 🛠️ Tech Stack

-   **Framework**: Next.js 15 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **State Management**: Zustand (with persist)
-   **HTTP Client**: Axios
-   **Icons**: Lucide React
-   **Theme**: Black & Yellow (مسار brand)

---

## 📂 Key Files

### State Management

-   `lib/store/authStore.ts` - Authentication state
-   `lib/store/registrationStore.ts` - Registration form state

### API Integration

-   `lib/api/axios.ts` - Axios instance + all API functions
-   `lib/types/api.ts` - TypeScript types for API responses

### Components

-   `components/ProtectedRoute.tsx` - Route guard
-   `components/SpecialtyCard.tsx` - Specialty display
-   `components/TeacherVideoCard.tsx` - Teacher video with select
-   `components/registration/*` - All registration form components

---

## ✅ Pre-Launch Checklist

-   [ ] Backend API is running
-   [ ] `.env.local` points to correct API URL
-   [ ] Test admin login works
-   [ ] Test teacher registration & login
-   [ ] Test school registration & login
-   [ ] Test video upload (teacher)
-   [ ] Test teacher selection (school)
-   [ ] Test route guards
-   [ ] Verify token persistence

---

## 🐛 Troubleshooting

### "Failed to fetch"

-   Check backend is running
-   Verify `NEXT_PUBLIC_API_URL` in `.env.local`
-   Check CORS settings on backend

### "Unauthorized" errors

-   Clear localStorage: `localStorage.clear()`
-   Re-login to get fresh token

### Video upload fails

-   Backend must support `multipart/form-data`
-   Check file size limit (default 100MB)
-   Verify `/videos/teachers/:id/upload` endpoint

### Route guard not working

-   Check role is set correctly in authStore
-   Verify token is in localStorage
-   Try hard refresh (Ctrl+Shift+R)

---

## 🎯 Next Steps

1. **Test with Backend**: Connect to your running backend API
2. **Add Real Data**: Create test accounts and data
3. **Customize**: Adjust styling, add branding
4. **Deploy**: Deploy to Vercel/Netlify when ready

---

## 📞 Support

Check `FRONTEND_README.md` for detailed documentation.

---

**Happy Coding! 🎉**
