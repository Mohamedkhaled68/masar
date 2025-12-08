import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware to protect routes and verify JWT access tokens
 * Runs on Next.js Edge Runtime for optimal performance
 */
export function middleware(request: NextRequest) {
    // Get the pathname from the request URL
    const { pathname } = request.nextUrl;

    // Get the access token from cookies
    const accessToken = request.cookies.get("accessToken")?.value;
    const userRole = request.cookies.get("userRole")?.value;

    // Define protected route patterns
    const isTeacherRoute = pathname.startsWith("/teacher");
    const isSchoolRoute = pathname.startsWith("/school");
    const isAdminRoute =
        pathname.startsWith("/admin") && pathname !== "/admin/login";

    // Check if current route is protected
    const isProtectedRoute = isTeacherRoute || isSchoolRoute || isAdminRoute;

    // If route is protected and no token exists, redirect to appropriate login page
    if (isProtectedRoute && !accessToken) {
        // Redirect admin routes to admin login
        if (isAdminRoute) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
        // Redirect teacher/school routes to main login
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // If token exists, verify role-based access
    if (isProtectedRoute && accessToken) {
        // Check if user role matches the route they're trying to access
        if (isTeacherRoute && userRole !== "teacher") {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        if (isSchoolRoute && userRole !== "school") {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        if (isAdminRoute && userRole !== "admin") {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }

        // Optional: Verify token format (basic validation)
        // For production, consider verifying JWT signature with jose library
        if (!isValidTokenFormat(accessToken)) {
            // Clear invalid cookies
            const response = NextResponse.redirect(
                new URL("/login", request.url)
            );
            response.cookies.delete("accessToken");
            response.cookies.delete("userRole");
            response.cookies.delete("user");
            return response;
        }
    }

    // Redirect authenticated users away from login pages to their dashboard
    if (accessToken && userRole) {
        if (pathname === "/login") {
            if (userRole === "teacher") {
                return NextResponse.redirect(
                    new URL("/teacher/profile", request.url)
                );
            }
            if (userRole === "school") {
                return NextResponse.redirect(
                    new URL("/school/home", request.url)
                );
            }
        }

        if (pathname === "/admin/login" && userRole === "admin") {
            return NextResponse.redirect(
                new URL("/admin/dashboard", request.url)
            );
        }
    }

    // Allow the request to continue
    return NextResponse.next();
}

/**
 * Basic token format validation
 * Checks if token follows JWT format (xxx.yyy.zzz)
 * For production, use jose library to verify signature and expiration
 */
function isValidTokenFormat(token: string): boolean {
    // JWT tokens have 3 parts separated by dots
    const parts = token.split(".");
    return parts.length === 3 && parts.every((part) => part.length > 0);
}

/**
 * Matcher configuration
 * Specifies which routes this middleware should run on
 * Excludes static files, images, and API routes for performance
 */
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico (favicon file)
         * - public files (images, fonts, etc.)
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.ico|.*\\.webp).*)",
    ],
};
