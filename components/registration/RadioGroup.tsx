import React from "react";

interface RadioGroupProps {
    label: string;
    options: { value: string; label: string }[];
    selectedValue: string;
    onChange: (value: string) => void;
    required?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
    label,
    options,
    selectedValue,
    onChange,
    required = false,
}) => {
    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-white">
                {label} {required && <span className="text-yellow-400">*</span>}
            </label>
            <div className="space-y-2">
                {options.map((option) => (
                    <label
                        key={option.value}
                        className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-700 rounded-lg cursor-pointer hover:border-yellow-400 transition-all"
                    >
                        <input
                            type="radio"
                            checked={selectedValue === option.value}
                            onChange={() => onChange(option.value)}
                            className="w-5 h-5 border-zinc-700 text-yellow-400 focus:ring-2 focus:ring-yellow-400"
                        />
                        <span className="text-white">{option.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};
