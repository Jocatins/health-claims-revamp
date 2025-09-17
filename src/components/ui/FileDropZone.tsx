import React, { useRef, useState } from 'react';
import type { DragEvent } from 'react';
import Button from './Button';

interface FileDropZoneProps {
  files: File[];
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  label?: string;
  className?: string;
  maxFiles?: number; // optional constraint for multiple selection
}

const FileDropZone: React.FC<FileDropZoneProps> = ({
  files,
  multiple,
  onFilesSelected,
  accept,
  label,
  className,
  maxFiles
}) => {
  const inputRef = useRef<HTMLInputElement|null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleBrowse = () => inputRef.current?.click();

  const handleFiles = (list: FileList | null) => {
    if (!list) return;
    let newFiles: File[] = Array.from(list);
    if (!multiple && newFiles.length) newFiles = [newFiles[0]]; // single mode
    if (multiple && typeof maxFiles === 'number') {
      const allowed = maxFiles - files.length;
      if (allowed <= 0) return; // already at max
      newFiles = newFiles.slice(0, allowed);
    }
    if (!multiple) {
      onFilesSelected(newFiles);
    } else {
      onFilesSelected([...files, ...newFiles]);
    }
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (!isDragging) setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeFile = (index: number) => {
    if (!multiple) {
      onFilesSelected([]);
    } else {
      onFilesSelected(files.filter((_, i) => i !== index));
    }
  };

  const zoneClasses = `h-[51px] border-2 rounded-md pl-3 pr-1 py-1 flex items-center justify-between gap-4 text-xs sm:text-sm transition-colors ${isDragging ? 'border-primary bg-green-50' : 'border-primary/80 bg-white'} ${className||''}`;

  const summary = files.length === 0
    ? 'Drag and drop file here'
    : files.length === 1
      ? files[0].name
      : `${files.length} files selected`;

  return (
    <div className='w-full'>
      {label && <div className='text-[11px] mb-1 font-medium text-gray-600'>{label}</div>}
      <div
        className={zoneClasses}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        role='button'
        tabIndex={0}
        onClick={handleBrowse}
      >
        <div className='flex-1 truncate text-gray-600'>{summary}</div>
  <Button size='sm' type='button' onClick={()=> handleBrowse()}>Browse</Button>
        <input
          ref={inputRef}
          type='file'
          className='hidden'
          multiple={!!multiple}
          accept={accept}
          onChange={(e)=> handleFiles(e.target.files)}
        />
      </div>
      {files.length > 0 && (
        <ul className='mt-2 space-y-1 border rounded-md p-2 bg-gray-50 max-h-40 overflow-auto'>
          {files.map((f, i) => (
            <li key={i} className='flex items-center justify-between text-[11px] sm:text-xs bg-white border rounded px-2 py-1'>
              <span className='truncate'>{f.name}</span>
              <button
                type='button'
                className='text-red-600 text-[10px] underline'
                onClick={(e)=> { e.stopPropagation(); removeFile(i); }}
              >Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileDropZone;
