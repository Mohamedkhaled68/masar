# Masar Platform - Frontend Implementation

## 🚀 Completed Features

### ✅ Authentication System

-   **Admin Login** (`/admin/login`)
-   **Teacher/School Login** (`/login`) - with user type selection
-   **Zustand Auth Store** - persisted authentication state
-   **Axios Instance** - with automatic token injection

### ✅ Admin Pages

-   **Admin Dashboard** (`/admin/dashboard`)
    -   Welcome screen with statistics placeholders
    -   Quick actions menu
    -   Logout functionality

### ✅ School Pages

-   **School Home** (`/school/home`)

    -   Grid of specialties (with static fallback)
    -   Navigate to specialty-specific teacher videos
    -   Clean black/yellow theme

-   **Specialty Videos** (`/school/specialty/[name]`)
    -   List of teacher videos by specialty
    -   Video player for each teacher
    -   "Select Teacher" functionality
    -   Success/error messaging
    -   API integration: `GET /videos/by-specialty/:name`
    -   API integration: `POST /selection/accept`

### ✅ Teacher Pages

-   **Teacher Profile** (`/teacher/profile`)
    -   Display all teacher information
    -   Upload teaching video
    -   Video player for existing videos
    -   Clean card-based layout
    -   API integration: `GET /teachers/me`
    -   API integration: `POST /videos/teachers/:id/upload`

### ✅ Components Created

-   `SpecialtyCard` - Specialty selection cards
-   `TeacherVideoCard` - Teacher video display with selection
-   `ProtectedRoute` - Route guard component
-   `FileUpload` - Reusable file upload component (used in registration)

---

## 📁 Project Structure

```
d:\projects\masar\
├── app/
│   ├── admin/
│   │   ├── login/page.tsx
│   │   └── dashboard/page.tsx
│   ├── school/
│   │   ├── home/page.tsx
│   │   └── specialty/[name]/page.tsx
│   ├── teacher/
│   │   └── profile/page.tsx
│   ├── login/page.tsx
│   └── register/page.tsx
│
├── components/
│   ├── registration/
│   │   ├── InputField.tsx
│   │   ├── SelectField.tsx
│   │   ├── CheckboxGroup.tsx
│   │   ├── RadioGroup.tsx
│   │   ├── TagInput.tsx
│   │   ├── FileUpload.tsx
│   │   ├── ProgressIndicator.tsx
│   │   ├── UserTypeSelection.tsx
│   │   ├── teacher/
│   │   │   ├── TeacherStep1.tsx
│   │   │   ├── TeacherStep2.tsx
│   │   │   ├── TeacherStep3.tsx
│   │   │   └── TeacherStep4.tsx
│   │   └── school/
│   │       ├── SchoolStep1.tsx
│   │       ├── SchoolStep2.tsx
│   │       ├── SchoolStep3.tsx
│   │       └── SchoolStep4.tsx
│   ├── ProtectedRoute.tsx
│   ├── SpecialtyCard.tsx
│   └── TeacherVideoCard.tsx
│
├── lib/
│   ├── api/
│   │   └── axios.ts
│   ├── store/
│   │   ├── authStore.ts
│   │   └── registrationStore.ts
│   └── types/
│       └── registration.ts
│
└── .env.local
```

---

## 🔐 Authentication Flow

### Login Process

1. User selects account type (Teacher/School)
2. Enters email & password
3. API call to `/api/auth/login/teacher` or `/api/auth/login/school`
4. Token stored in Zustand + localStorage
5. Redirect to appropriate dashboard

### Route Protection

-   Each protected page checks user role on mount
-   Redirects to login if not authenticated
-   Redirects to correct dashboard if wrong role

---

## 🌐 API Integration

### Base Configuration

```typescript
// lib/api/axios.ts
baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
```

### Available API Functions

#### Authentication

```typescript
authAPI.loginTeacher({ email, password });
authAPI.loginSchool({ email, password });
authAPI.loginAdmin({ email, password });
authAPI.registerTeacher(data);
authAPI.registerSchool(data);
```

#### Teachers

```typescript
teacherAPI.getMe();
teacherAPI.getById(id);
teacherAPI.update(id, data);
```

#### Schools

```typescript
schoolAPI.getMe();
schoolAPI.getById(id);
```

#### Videos

```typescript
videoAPI.upload(teacherId, formData);
videoAPI.getBySpecialty(specialty);
videoAPI.getAll(params);
```

#### Selection

```typescript
selectionAPI.accept({ teacherId, videoId });
selectionAPI.getBySchool(schoolId);
```

#### Specialties

```typescript
specialtyAPI.getAll();
```

---

## 🎨 Design System

### Color Palette

-   **Background**: Black (`#000000`)
-   **Cards**: Zinc-900 (`#18181b`)
-   **Borders**: Zinc-800 (`#27272a`)
-   **Primary**: Yellow-400 (`#facc15`)
-   **Text**: White & Zinc shades

### Typography

-   Headers: Bold, 2xl-4xl
-   Body: Regular, base
-   Arabic-first design

---

## 🚦 Route Guards

### Protected Routes by Role

#### Admin Routes

-   `/admin/dashboard` - Admin only

#### Teacher Routes

-   `/teacher/profile` - Teacher only

#### School Routes

-   `/school/home` - School only
-   `/school/specialty/[name]` - School only

#### Public Routes

-   `/` - Home
-   `/login` - Login (all users)
-   `/register` - Registration (all users)
-   `/admin/login` - Admin login

---

## 📝 Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.local.example .env.local
# Edit .env.local with your backend API URL
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Backend Integration

Ensure your backend is running on `http://localhost:3001` (or update `.env.local`)

---

## 📋 Remaining Tasks

### Nice-to-Have Enhancements

1. **Admin Dashboard**

    - Implement full CRUD for teachers
    - Implement full CRUD for schools
    - Video management system
    - Selection tracking dashboard

2. **Teacher Profile**

    - Edit profile functionality
    - Application history
    - Notification system

3. **School Home**

    - Search/filter specialties
    - Saved/favorited teachers
    - Selection history

4. **General**
    - Forgot password flow
    - Email verification
    - Real-time notifications
    - File upload progress bars
    - Better error handling UI

---

## 🧪 Testing Checklist

-   [ ] Admin can login and access dashboard
-   [ ] Teacher can login and view profile
-   [ ] Teacher can upload video
-   [ ] School can login and view specialties
-   [ ] School can view teachers by specialty
-   [ ] School can select a teacher
-   [ ] Route guards work correctly
-   [ ] Token persists after page refresh
-   [ ] Logout clears session
-   [ ] Error messages display correctly

---

## 🐛 Known Issues

1. Video upload requires backend multipart/form-data support
2. Specialties list needs backend endpoint (using static fallback)
3. Admin statistics are placeholders
4. No pagination implemented yet

---

## 📞 Support

For issues or questions, contact the development team.

---

**Built with**: Next.js 15, TypeScript, Tailwind CSS, Zustand, Axios
**Theme**: Black & Yellow (مسار Platform)
