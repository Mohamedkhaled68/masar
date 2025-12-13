"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
    return (
        <div className="min-h-screen bg-[hsl(var(--background))] relative overflow-hidden">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-[hsl(var(--primary))]/10 via-transparent to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 py-8">
                {/* Navigation */}
                <nav className="flex items-center justify-between mb-20 animate-fade-in">
                    <Image
                        src="/logo.svg"
                        alt="مسار"
                        width={192}
                        height={64}
                        className="h-12 md:h-16 w-auto object-contain"
                        priority
                    />
                    <div className="flex items-center">
                        <Link href="/login">
                            <Button
                                variant="outline"
                                className="font-semibold cursor-pointer"
                            >
                                تسجيل الدخول
                            </Button>
                        </Link>
                    </div>
                </nav>

                {/* Hero Content */}
                <div className="max-w-4xl mx-auto text-center pt-20 pb-32 animate-slide-up">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        نربط المعلمين المتميزين
                        <span className="block text-[hsl(var(--primary))] mt-2">
                            بالمدارس الرائدة
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-[hsl(var(--muted-foreground))] mb-12 max-w-2xl mx-auto leading-relaxed">
                        منصة مسار هي الوجهة الأولى لتوظيف المعلمين في السلطنة.
                        نسهل على المدارس إيجاد الكفاءات المناسبة، وعلى المعلمين
                        إيجاد فرصهم المثالية
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href="/register">
                            <Button
                                variant="hero"
                                size="lg"
                                className="px-10 py-6 cursor-pointer"
                            >
                                ابدأ الآن
                                <ArrowLeft className="mr-2 h-5 w-5" />
                            </Button>
                        </Link>
                        {/* <Button
                            variant="outline"
                            size="lg"
                            className="px-10 py-6"
                        >
                            اكتشف المزيد
                        </Button> */}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-[hsl(var(--primary))] mb-2">
                                500+
                            </div>
                            <div className="text-sm md:text-base text-[hsl(var(--muted-foreground))]">
                                مدرسة شريكة
                            </div>
                        </div>
                        <div className="text-center border-x border-[hsl(var(--border))]">
                            <div className="text-4xl md:text-5xl font-bold text-[hsl(var(--primary))] mb-2">
                                2000+
                            </div>
                            <div className="text-sm md:text-base text-[hsl(var(--muted-foreground))]">
                                معلم متميز
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-[hsl(var(--primary))] mb-2">
                                95%
                            </div>
                            <div className="text-sm md:text-base text-[hsl(var(--muted-foreground))]">
                                نسبة التوظيف
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="mt-16 p-6 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl max-w-2xl mx-auto">
                        <p className="text-[hsl(var(--muted-foreground))] text-center mb-2">
                            للاستفسارات والدعم
                        </p>
                        <a
                            href="https://wa.me/96891944943"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-2xl md:text-3xl font-bold text-[hsl(var(--primary))] block text-center hover:underline transition-all"
                            dir="ltr"
                        >
                            +968 91944943
                        </a>
                    </div>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-[hsl(var(--card))] to-transparent pointer-events-none" />
        </div>
    );
};

export default Hero;
