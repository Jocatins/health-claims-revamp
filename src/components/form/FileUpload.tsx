import React, { useRef, useState } from "react";
import { type UseFormRegisterReturn } from "react-hook-form";

interface FileUploadProps {
  accept?: string;
  register: UseFormRegisterReturn;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  accept = "image/*",
  register,
  error
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileName(file ? file.name : "");
    
    // Update React Hook Form value
    register.onChange({
      target: {
        name: register.name,
        value: file ? [file] : [],
        files: e.target.files,
      },
    });
  };

  const handleBlur = () => {
    register.onBlur({
      target: {
        name: register.name,
        value: fileName,
      },
    } as React.FocusEvent<HTMLInputElement>);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Set up ref for React Hook Form
  React.useEffect(() => {
    register.ref(fileInputRef.current);
  }, [register]);

  return (
    <div className="w-full">
      <div className={`flex items-center border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md overflow-hidden`}>
        <span className="flex-grow px-3 py-2 text-gray-500 text-sm truncate">
          {fileName || "Choose a Photo"}
        </span>
        <button
          type="button"
          onClick={handleClick}
          className="px-4 py-2 bg-[#186255] text-white text-sm font-medium hover:bg-[#145244]"
        >
          Browse
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
        onBlur={handleBlur}
        name={register.name}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FileUpload;