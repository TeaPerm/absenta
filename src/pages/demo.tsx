import React from "react";
import { Container } from "@/components/ui/container";
import FileUploadDemo from "@/components/file-upload-demo";

const Demo = () => {
  return (
    <Container className="py-12">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">File Upload Component Demo</h1>
          <p className="mt-2 text-lg text-slate-600">A modern file upload component with drag and drop functionality</p>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <FileUploadDemo />
        </div>

        <div className="prose max-w-none dark:prose-invert">
          <h2>How to use</h2>
          <p>The FileUpload component provides a beautiful drag-and-drop interface for uploading files.</p>
          
          <h3>Basic usage</h3>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
            {`import { FileUpload } from "@/components/ui/file-upload";

const MyComponent = () => {
  const handleFileUpload = (files: File[]) => {
    console.log("Files uploaded:", files);
  };

  return (
    <FileUpload onChange={handleFileUpload} />
  );
};`}
          </pre>
          
          <h3>Features</h3>
          <ul>
            <li>Drag and drop files</li>
            <li>Click to open file dialog</li>
            <li>File metadata display</li>
            <li>Animated file upload UI</li>
            <li>Dark mode support</li>
          </ul>
        </div>
      </div>
    </Container>
  );
};

export default Demo; 