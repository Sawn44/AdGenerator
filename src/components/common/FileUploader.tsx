import React, { useRef, useCallback } from 'react';

interface FileUploaderProps {
  label: string;
  onFileSelect: (data: string) => void;
  accept?: string;
  children?: React.ReactNode;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  label,
  onFileSelect,
  accept = 'image/*',
  children,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onFileSelect(result);
    };
    reader.readAsDataURL(file);
  }, [onFileSelect]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors text-sm"
      >
        {label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      {children}
    </div>
  );
};
