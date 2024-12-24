import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  currentImage?: string;
}

const ImageUpload = ({ onImageUpload, currentImage }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      const fileName = `${uuidv4()}-${file.name}`;
      formData.append('file', file, fileName);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      onImageUpload(data.url);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxSize: 5242880, // 5MB
    multiple: false
  });

  return (
    <div className="w-full max-w-md">
      {currentImage && (
        <div className="mb-4">
          <img 
            src={currentImage} 
            alt="Current profile" 
            className="w-32 h-32 rounded-full object-cover"
          />
        </div>
      )}

      <Card 
        {...getRootProps()} 
        className={`p-6 border-2 border-dashed ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } cursor-pointer`}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          {uploading ? (
            <p>Uploading...</p>
          ) : (
            <>
              <p className="text-sm text-gray-600">
                {isDragActive
                  ? 'Drop the image here'
                  : 'Drag and drop an image, or click to select'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: PNG, JPG, GIF (max 5MB)
              </p>
            </>
          )}
        </div>
      </Card>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ImageUpload;
