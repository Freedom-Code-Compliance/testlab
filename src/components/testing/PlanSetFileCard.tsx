import { useState } from 'react';
import { supabase, callInitUpload, callConfirmUpload } from '../../lib/supabase';
import { Upload, X, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface PlanSetFileCardProps {
  projectId: string;
  planSetId: string;
  fileType: { id: string; code: string; name: string };
  onFileUploaded: () => void;
  onFileRemoved: () => void;
}

interface UploadedFile {
  id: string; // Unique ID for tracking
  fileId: string;
  filename: string;
  status: 'uploading' | 'uploaded' | 'error';
  progress?: number;
  error?: string;
  file?: File;
}

export default function PlanSetFileCard({
  projectId,
  planSetId,
  fileType,
  onFileUploaded,
  onFileRemoved,
}: PlanSetFileCardProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const uploadedCount = uploadedFiles.filter((f) => f.status === 'uploaded').length;
  const hasUploading = uploadedFiles.some((f) => f.status === 'uploading');

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!hasUploading) {
      setIsDragActive(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const relatedTarget = event.relatedTarget as Node | null;
    if (!relatedTarget || !event.currentTarget.contains(relatedTarget)) {
      setIsDragActive(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);

    if (hasUploading) return;

    const { files } = event.dataTransfer;
    if (files && files.length > 0) {
      void handleFilesSelected(files);
    }
  };

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newFiles: UploadedFile[] = Array.from(files).map((file, idx) => ({
      id: `${Date.now()}-${idx}-${Math.random()}`,
      fileId: '',
      filename: file.name,
      status: 'uploading' as const,
      progress: 0,
      file,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // Upload each file
    for (const newFile of newFiles) {
      const file = newFile.file!;
      let fileId: string | null = null;

      try {
        // 1. Call init-upload
        const initResponse = await callInitUpload({
          kind: 'PLAN_SET_FILE',
          filename: file.name,
          plan_set_id: planSetId,
          file_type_code: fileType.code,
          project_id: projectId,
        });

        if (initResponse?.error) {
          throw new Error(initResponse.error || 'init-upload failed');
        }

        if (!initResponse?.file_id) {
          throw new Error('init-upload did not return file_id');
        }

        fileId = initResponse.file_id;
        const bucket = initResponse.bucket;
        const objectKey = initResponse.object_key;
        const token = initResponse.signed_upload_token;

        // Update with fileId
        setUploadedFiles((prev) => {
          return prev.map((f) =>
            f.id === newFile.id ? { ...f, fileId: fileId! } : f
          );
        });

        // Update progress to indicate upload starting
        setUploadedFiles((prev) => {
          return prev.map((f) =>
            f.id === newFile.id ? { ...f, progress: 50 } : f
          );
        });

        // 2. Upload file directly to storage using signed URL
        const storageBucket = supabase.storage.from(bucket) as any;
        if (typeof storageBucket.uploadToSignedUrl !== 'function') {
          throw new Error('Signed uploads are not supported in the current supabase-js version.');
        }

        const { error: uploadError } = await storageBucket.uploadToSignedUrl(objectKey, token, file, {
          contentType: file.type,
        });

        if (uploadError) {
          // Call confirm-upload with success: false
          if (fileId) {
            try {
              await callConfirmUpload(fileId, false, uploadError.message || 'File upload failed');
            } catch (confirmError) {
              console.error('Failed to confirm upload failure:', confirmError);
            }
          }
          throw new Error(uploadError.message || 'File upload failed');
        }

        // 3. Call confirm-upload with success: true
        if (!fileId) {
          throw new Error('File ID is missing');
        }

        const confirmResponse = await callConfirmUpload(fileId, true);

        if (confirmResponse.error) {
          throw new Error(confirmResponse.error || 'confirm-upload failed');
        }

        // Update status to uploaded
        setUploadedFiles((prev) => {
          return prev.map((f) =>
            f.id === newFile.id
              ? { ...f, status: 'uploaded' as const, progress: 100 }
              : f
          );
        });

        // Notify parent
        onFileUploaded();
      } catch (err: any) {
        console.error('PlanSetFileCard upload failed:', err);
        console.error('Error details:', {
          message: err.message,
          error: err.error,
          status: err.status,
          statusCode: err.statusCode,
          response: err.response,
        });
        
        // If we have a fileId but upload failed, try to confirm the failure
        if (fileId) {
          try {
            await callConfirmUpload(fileId, false, err.message || 'Upload failed');
          } catch (confirmError) {
            console.error('Failed to confirm upload failure:', confirmError);
          }
        }

        setUploadedFiles((prev) => {
          return prev.map((f) =>
            f.id === newFile.id
              ? {
                  ...f,
                  status: 'error' as const,
                  error: err.message || 'Upload failed. Please try again.',
                }
              : f
          );
        });
      }
    }
  };

  const handleRetry = async (fileId: string) => {
    const fileToRetry = uploadedFiles.find((f) => f.id === fileId);
    if (!fileToRetry?.file) {
      console.error('Cannot retry: file object not available');
      return;
    }

    // Remove the failed entry and retry
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
    const fileList = new DataTransfer();
    fileList.items.add(fileToRetry.file!);
    await handleFilesSelected(fileList.files);
  };

  const handleRemove = (fileId: string) => {
    const fileToRemove = uploadedFiles.find((f) => f.id === fileId);
    const wasUploaded = fileToRemove?.status === 'uploaded';
    
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
    
    // Notify parent if we removed an uploaded file
    if (wasUploaded) {
      onFileRemoved();
    }
  };

  return (
    <div
      className={`relative border rounded-lg p-4 flex flex-col gap-3 transition-colors ${
        isDragActive
          ? 'border-fcc-cyan border-2 bg-fcc-black/40'
          : 'bg-fcc-dark border-fcc-divider'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragActive && (
        <div className="absolute inset-0 bg-fcc-cyan/10 border-2 border-dashed border-fcc-cyan rounded-lg flex items-center justify-center pointer-events-none z-10">
          <div className="text-center">
            <Upload className="w-8 h-8 text-fcc-cyan mx-auto mb-2" />
            <p className="text-fcc-cyan font-medium">Drop files here</p>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-fcc-white">{fileType.name}</h3>
        {uploadedCount > 0 && (
          <span className="text-xs text-fcc-cyan">
            {uploadedCount} file{uploadedCount > 1 ? 's' : ''} uploaded
          </span>
        )}
      </div>

      <p className="text-xs text-fcc-white/70">
        You can attach one or more {fileType.name.toLowerCase()} file(s). At least one total file
        across all fields is required before submitting.
      </p>

      <label className="inline-flex items-center justify-center rounded border border-fcc-divider px-3 py-2 text-sm cursor-pointer hover:bg-fcc-black transition-colors text-fcc-white">
        <Upload className="w-4 h-4 mr-2" />
        <span>Select files</span>
        <input
          type="file"
          className="hidden"
          multiple
          onChange={(e) => void handleFilesSelected(e.target.files)}
          disabled={hasUploading}
        />
      </label>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2 mt-2">
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-2 bg-fcc-black rounded border border-fcc-divider"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {file.status === 'uploading' && (
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-4 h-4 border-2 border-fcc-cyan border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-fcc-white truncate">{file.filename}</span>
                    {file.progress !== undefined && (
                      <span className="text-xs text-fcc-white/70 ml-auto">
                        {Math.round(file.progress)}%
                      </span>
                    )}
                  </div>
                )}
                {file.status === 'uploaded' && (
                  <div className="flex items-center gap-2 flex-1">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-xs text-fcc-white truncate">{file.filename}</span>
                  </div>
                )}
                {file.status === 'error' && (
                  <div className="flex items-center gap-2 flex-1">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-fcc-white truncate block">{file.filename}</span>
                      <span className="text-xs text-red-500 truncate block">{file.error}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 ml-2">
                {file.status === 'error' && (
                  <button
                    type="button"
                    onClick={() => void handleRetry(file.id)}
                    className="p-1 hover:bg-fcc-dark rounded transition-colors"
                    title="Retry upload"
                  >
                    <RefreshCw className="w-4 h-4 text-fcc-cyan" />
                  </button>
                )}
                {file.status !== 'uploading' && (
                  <button
                    type="button"
                    onClick={() => handleRemove(file.id)}
                    className="p-1 hover:bg-fcc-dark rounded transition-colors"
                    title="Remove file"
                  >
                    <X className="w-4 h-4 text-fcc-white/70" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

