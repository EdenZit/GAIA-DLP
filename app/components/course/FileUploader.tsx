// app/components/course/FileUploader.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface FileUploaderProps {
  onUploadComplete: (url: string) => void;
}

export default function FileUploader({ onUploadComplete }: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      setProgress(0);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onUploadComplete(data.url);
    } catch (error) {
      console.error('Error uploading file:', error);
      // Handle error (e.g., show toast notification)
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        className="hidden"
        id="fileInput"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadFile(file);
        }}
      />
      
      <Button
        onClick={() => document.getElementById('fileInput')?.click()}
        disabled={uploading}
        className="w-full"
      >
        {uploading ? 'Uploading...' : 'Upload File'}
      </Button>

      {uploading && (
        <Progress value={progress} className="w-full" />
      )}
    </div>
  );
}

// Update ResourceManager.tsx to include file upload
import FileUploader from './FileUploader';

// Add inside ResourceManager component:
const [fileUrl, setFileUrl] = useState('');

const handleFileUpload = (url: string) => {
  setFileUrl(url);
};

// Add FileUploader component in the form:
<FileUploader onUploadComplete={handleFileUpload} />

