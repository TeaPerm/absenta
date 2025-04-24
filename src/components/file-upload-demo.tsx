import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";

export default function FileUploadDemo() {
  const [files, setFiles] = useState<File[]>([]);
  
  const handleFileUpload = (newFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    console.log("Uploaded files:", files, "New files:", newFiles);
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
      <FileUpload onChange={handleFileUpload} />
      {files.length > 0 && (
        <div className="p-4 text-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {files.length} file(s) uploaded
          </p>
        </div>
      )}
    </div>
  );
} 