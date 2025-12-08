"use client";

import { GraduationCap, Building2, TrendingUp, Shield } from "lucide-react";

const Features = () => {
    const features = [
        {
            icon: GraduationCap,
            title: "للمعلمين",
            description:
                "اعثر على الوظيفة المثالية في أفضل المدارس. نوفر لك فرصًا متنوعة تناسب خبراتك وتطلعاتك المهنية",
        },
        {
            icon: Building2,
            title: "للمدارس",
            description:
                "وظف أفضل الكفاءات التعليمية بسرعة وكفاءة. نساعدك في إيجاد المعلمين المناسبين لمدرستك",
        },
        {
            icon: TrendingUp,
            title: "نمو مستمر",
            description:
                "تابع تطورك المهني وابن مسيرتك التعليمية مع منصة توفر لك كل ما تحتاجه للنجاح",
        },
        {
            icon: Shield,
            title: "موثوق وآمن",
            description:
                "نحرص على التحقق من جميع الفرص والمؤهلات لضمان تجربة توظيف آمنة وموثوقة",
        },
    ];

    return (
        <div className="bg-[hsl(var(--card))] py-24 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        لماذا{" "}
                        <span className="text-[hsl(var(--primary))]">مسار</span>
                        ؟
                    </h2>
                    <p className="text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
                        نوفر تجربة متكاملة تجمع بين السهولة والاحترافية
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-xl p-8 hover:border-[hsl(var(--primary))]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[hsl(var(--primary))]/10 animate-slide-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="w-14 h-14 rounded-lg bg-[hsl(var(--primary))]/10 flex items-center justify-center mb-6">
                                <feature.icon className="w-7 h-7 text-[hsl(var(--primary))]" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Features;
