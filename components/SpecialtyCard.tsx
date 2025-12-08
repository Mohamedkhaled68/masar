import React from "react";
import { BookOpen } from "lucide-react";

interface SpecialtyCardProps {
    name: string;
    icon?: React.ReactNode;
    teacherCount?: number;
    onClick: () => void;
}

export const SpecialtyCard: React.FC<SpecialtyCardProps> = ({
    name,
    icon,
    teacherCount,
    onClick,
}) => {
    return (
        <button
            onClick={onClick}
            className="group p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-yellow-400 hover:bg-zinc-800 transition-all hover:scale-105 hover:shadow-xl hover:shadow-yellow-400/10"
        >
            <div className="flex flex-col items-center text-center gap-4">
                <div className="p-4 bg-yellow-400/10 rounded-full group-hover:bg-yellow-400/20 transition-all">
                    {icon || <BookOpen className="w-8 h-8 text-yellow-400" />}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                        {name}
                    </h3>
                    {teacherCount !== undefined && (
                        <p className="text-sm text-zinc-400">
                            {teacherCount} معلم متاح
                        </p>
                    )}
                </div>
                <div className="text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-semibold">
                        عرض المعلمين ←
                    </span>
                </div>
            </div>
        </button>
    );
};
