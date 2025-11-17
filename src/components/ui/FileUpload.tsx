import { useState, useRef, ChangeEvent } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  maxSize?: number; // in bytes
}

export default function FileUpload({
  label = 'Upload Files',
  accept,
  multiple = false,
  onFilesSelected,
  maxSize,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setError('');

    if (maxSize) {
      const oversizedFiles = selectedFiles.filter(file => file.size > maxSize);
      if (oversizedFiles.length > 0) {
        setError(`Some files exceed the maximum size of ${maxSize / 1024 / 1024}MB`);
        return;
      }
    }

    setFiles(selectedFiles);
    onFilesSelected(selectedFiles);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label className="block text-sm text-fcc-white/70 mb-2">{label}</label>
      <div
        onClick={handleClick}
        className="w-full bg-fcc-black border border-fcc-divider rounded p-4 cursor-pointer hover:border-fcc-cyan transition-colors"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex items-center justify-center space-x-2">
          <Upload className="w-5 h-5 text-fcc-white/70" />
          <span className="text-fcc-white/70">
            {files.length > 0
              ? `${files.length} file(s) selected`
              : 'Click to upload files'}
          </span>
        </div>
        {files.length > 0 && (
          <ul className="mt-2 space-y-1">
            {files.map((file, index) => (
              <li key={index} className="text-sm text-fcc-white/70 truncate">
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}



