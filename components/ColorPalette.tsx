"use client";

const ColorPalette = () => {
    const colors = [
        {
            name: "Primary Yellow",
            hex: "#FFCC00",
            hsl: "48 100% 50%",
            usage: "Main brand color, CTAs, highlights",
        },
        {
            name: "Accent Gold",
            hex: "#FFD633",
            hsl: "45 95% 55%",
            usage: "Secondary accents, hover states",
        },
        {
            name: "Background Dark",
            hex: "#121212",
            hsl: "0 0% 7%",
            usage: "Main background",
        },
        {
            name: "Card Surface",
            hex: "#1A1A1A",
            hsl: "0 0% 10%",
            usage: "Card backgrounds, elevated surfaces",
        },
        {
            name: "Secondary Gray",
            hex: "#262626",
            hsl: "0 0% 15%",
            usage: "Secondary surfaces, buttons",
        },
        {
            name: "Border Gray",
            hex: "#333333",
            hsl: "0 0% 20%",
            usage: "Borders, dividers",
        },
        {
            name: "Muted Text",
            hex: "#A6A6A6",
            hsl: "0 0% 65%",
            usage: "Secondary text, descriptions",
        },
        {
            name: "Foreground White",
            hex: "#FAFAFA",
            hsl: "0 0% 98%",
            usage: "Primary text, headings",
        },
    ];

    return (
        <div className="bg-[hsl(var(--card))] py-24 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        نظام الألوان{" "}
                        <span className="text-[hsl(var(--primary))]">
                            والتصميم
                        </span>
                    </h2>
                    <p className="text-xl text-[hsl(var(--muted-foreground))]">
                        لوحة ألوان احترافية مبنية على الأصفر والأسود
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {colors.map((color, index) => (
                        <div
                            key={index}
                            className="bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-xl overflow-hidden hover:border-[hsl(var(--primary))]/50 transition-all duration-300"
                        >
                            <div
                                className="h-32 w-full"
                                style={{ backgroundColor: color.hex }}
                            />
                            <div className="p-6">
                                <h3 className="font-bold text-lg mb-2">
                                    {color.name}
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-[hsl(var(--muted-foreground))]">
                                            HEX:
                                        </span>
                                        <code className="font-mono text-[hsl(var(--primary))]">
                                            {color.hex}
                                        </code>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[hsl(var(--muted-foreground))]">
                                            HSL:
                                        </span>
                                        <code className="font-mono text-xs text-[hsl(var(--primary))]">
                                            {color.hsl}
                                        </code>
                                    </div>
                                    <p className="text-[hsl(var(--muted-foreground))] mt-4 text-xs leading-relaxed">
                                        {color.usage}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-xl p-8">
                    <h3 className="text-2xl font-bold mb-6 text-center">
                        Typography
                    </h3>
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">
                                Font Family
                            </p>
                            <p className="text-3xl font-bold">
                                Cairo - خط القاهرة
                            </p>
                            <p className="text-[hsl(var(--muted-foreground))] mt-2">
                                Modern Arabic font with excellent readability
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-[hsl(var(--border))]">
                            <div>
                                <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">
                                    Heading
                                </p>
                                <p className="text-2xl font-bold">
                                    مسار للتوظيف
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">
                                    Body Text
                                </p>
                                <p className="text-base font-normal">
                                    نص تجريبي للمحتوى
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">
                                    Muted
                                </p>
                                <p className="text-base text-[hsl(var(--muted-foreground))]">
                                    نص ثانوي خفيف
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ColorPalette;
