import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ColorPalette from "@/components/ColorPalette";

export default function Home() {
    return (
        <div className="min-h-screen">
            <Hero />
            <Features />
            {/* <ColorPalette /> */}
        </div>
    );
}
