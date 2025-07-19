import React, { useCallback, useState } from 'react';
import { Upload, X, FileIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  acceptedFileTypes: string;
  maxFileSize: string;
  supportedFormats: string[];
  onFilesSelected: (files: FileList | null) => void;
  files: FileList | null;
  onRemoveFile: (index: number) => void;
  multiple?: boolean;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  acceptedFileTypes,
  maxFileSize,
  supportedFormats,
  onFilesSelected,
  files,
  onRemoveFile,
  multiple = true,
  disabled = false
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    if (!disabled) {
      const droppedFiles = e.dataTransfer.files;
      onFilesSelected(droppedFiles);
    }
  }, [disabled, onFilesSelected]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    onFilesSelected(selectedFiles);
  }, [onFilesSelected]);

  const handleClick = useCallback(() => {
    if (!disabled) {
      const fileInput = document.getElementById('file-upload-input') as HTMLInputElement;
      fileInput?.click();
    }
  }, [disabled]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
          isDragOver && !disabled
            ? "border-primary bg-primary/5 border-solid"
            : "border-gray-600 hover:border-gray-500",
          disabled && "cursor-not-allowed opacity-50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          id="file-upload-input"
          type="file"
          accept={acceptedFileTypes}
          onChange={handleFileChange}
          multiple={multiple}
          className="hidden"
          disabled={disabled}
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center",
            isDragOver && !disabled
              ? "bg-primary/20 text-primary"
              : "bg-gray-800 text-gray-400"
          )}>
            <Upload className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <p className="text-lg font-medium text-white">
              {isDragOver ? "Drop files here" : "Drop files to upload"}
            </p>
            <p className="text-sm text-gray-400">
              or <span className="text-primary underline">browse files</span>
            </p>
          </div>
          
          <div className="text-xs text-gray-500 space-y-1">
            <p>Supported formats: {supportedFormats.join(', ')}</p>
            <p>Maximum file size: {maxFileSize}</p>
          </div>
        </div>
      </div>

      {/* Selected Files */}
      {files && files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-white">Selected Files ({files.length})</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {Array.from(files).map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <FileIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {file.name.split('.').slice(0, -1).join('.') || file.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatFileSize(file.size)} • {file.name.split('.').pop()?.toUpperCase()}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile(index);
                  }}
                  className="p-1 hover:bg-gray-700 rounded-full transition-colors"
                  disabled={disabled}
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 