import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  currentImage?: string;
}

const ImageUpload = ({ onImageUpload, currentImage }: ImageUploadProps) => {
  const [error, setError] = React.useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError('');
    
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    onImageUpload(file);
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
      >
        <input {...getInputProps()} />
        
        {currentImage ? (
          <div className="space-y-4">
            <img
              src={currentImage}
              alt="Profile"
              className="w-32 h-32 mx-auto rounded-full object-cover"
            />
            <p className="text-sm text-gray-600">Drop a new image to replace</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Camera className="w-12 h-12 mx-auto text-gray-400" />
            <div>
              <p className="text-base">
                {isDragActive ? 'Drop the image here' : 'Drag & drop an image here'}
              </p>
              <p className="text-sm text-gray-500">or click to select</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ImageUpload;
