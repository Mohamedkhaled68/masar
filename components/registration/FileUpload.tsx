import React, { useRef, useState } from "react";
import { Upload, Video, X } from "lucide-react";

interface FileUploadProps {
    label: string;
    id: string;
    value: string | File | null;
    onChange: (value: File | null) => void;
    accept?: string;
    required?: boolean;
    maxSizeMB?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
    label,
    id,
    value,
    onChange,
    accept = "video/*",
    required = false,
    maxSizeMB = 100,
}) => {
    const [error, setError] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            setError(`حجم الملف يجب أن يكون أقل من ${maxSizeMB} ميجابايت`);
            return;
        }

        // Check file type
        if (accept && !file.type.match(accept.replace("*", ".*"))) {
            setError("نوع الملف غير مدعوم");
            return;
        }

        setError("");
        onChange(file);
    };

    const handleRemove = () => {
        onChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const getFileName = () => {
        if (value instanceof File) {
            return value.name;
        }
        return null;
    };

    const getFileSize = () => {
        if (value instanceof File) {
            const sizeInMB = (value.size / (1024 * 1024)).toFixed(2);
            return `${sizeInMB} ميجابايت`;
        }
        return null;
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-white">
                {label} {required && <span className="text-yellow-400">*</span>}
            </label>

            {!value ? (
                <button
                    type="button"
                    onClick={handleClick}
                    className="w-full p-8 border-2 border-dashed border-zinc-700 rounded-lg bg-zinc-900 hover:border-yellow-400 hover:bg-zinc-800 transition-all group"
                >
                    <div className="flex flex-col items-center gap-3">
                        <div className="p-3 bg-zinc-800 rounded-full group-hover:bg-yellow-400/10 transition-all">
                            <Upload className="w-8 h-8 text-zinc-400 group-hover:text-yellow-400 transition-colors" />
                        </div>
                        <div>
                            <p className="text-white font-medium">
                                انقر لتحميل الفيديو
                            </p>
                            <p className="text-sm text-zinc-400 mt-1">
                                الحد الأقصى {maxSizeMB} ميجابايت
                            </p>
                        </div>
                    </div>
                </button>
            ) : (
                <div className="p-4 bg-zinc-900 border border-zinc-700 rounded-lg">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-yellow-400/10 rounded-lg">
                            <Video className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">
                                {getFileName()}
                            </p>
                            <p className="text-sm text-zinc-400 mt-1">
                                {getFileSize()}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            <input
                ref={fileInputRef}
                id={id}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="hidden"
                required={required && !value}
            />

            {error && (
                <p className="text-sm text-red-400 flex items-center gap-2">
                    <span>⚠</span> {error}
                </p>
            )}
        </div>
    );
};
