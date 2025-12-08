import React from "react";

interface CheckboxGroupProps {
    label: string;
    options: { value: string; label: string }[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
    required?: boolean;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
    label,
    options,
    selectedValues,
    onChange,
    required = false,
}) => {
    const handleChange = (value: string) => {
        if (selectedValues.includes(value)) {
            onChange(selectedValues.filter((v) => v !== value));
        } else {
            onChange([...selectedValues, value]);
        }
    };

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
                            type="checkbox"
                            checked={selectedValues.includes(option.value)}
                            onChange={() => handleChange(option.value)}
                            className="w-5 h-5 rounded border-zinc-700 text-yellow-400 focus:ring-2 focus:ring-yellow-400"
                        />
                        <span className="text-white">{option.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};
