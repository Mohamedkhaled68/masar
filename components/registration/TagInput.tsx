import React from "react";

interface TagInputProps {
    label: string;
    values: string[];
    onChange: (values: string[]) => void;
    placeholder?: string;
    required?: boolean;
}

export const TagInput: React.FC<TagInputProps> = ({
    label,
    values,
    onChange,
    placeholder,
    required = false,
}) => {
    const [inputValue, setInputValue] = React.useState("");

    const handleAdd = () => {
        const trimmed = inputValue.trim();
        if (trimmed && !values.includes(trimmed)) {
            onChange([...values, trimmed]);
            setInputValue("");
        }
    };

    const handleRemove = (value: string) => {
        onChange(values.filter((v) => v !== value));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-white">
                {label} {required && <span className="text-yellow-400">*</span>}
            </label>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                />
                <button
                    type="button"
                    onClick={handleAdd}
                    className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-all"
                >
                    إضافة
                </button>
            </div>
            {values.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                    {values.map((value, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-800 text-white rounded-full border border-zinc-700"
                        >
                            {value}
                            <button
                                type="button"
                                onClick={() => handleRemove(value)}
                                className="text-yellow-400 hover:text-yellow-500"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};
