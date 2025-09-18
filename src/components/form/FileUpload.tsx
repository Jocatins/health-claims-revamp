import React, { useRef, useState } from "react";

interface FileUploadProps {
  accept?: string;
  onFileSelect?: (file: File | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  accept = "image/*",
  onFileSelect,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileName(file ? file.name : "");
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
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
      />
    </div>
  );
};

export default FileUpload;
