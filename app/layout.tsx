import AuthInitializer from "@/components/AuthInitializer";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "مسار - منصة توظيف المعلمين",
    description: "نربط المعلمين المتميزين بالمدارس الرائدة في السلطنة",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ar" dir="rtl">
            <body cz-shortcut-listen="true">
                <AuthInitializer />
                {children}
            </body>
        </html>
    );
}
