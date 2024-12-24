import React from 'react';
import ProfileForm from './ProfileForm';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProfileClientProps {
  initialProfile?: any;
}

const ProfileClient = ({ initialProfile }: ProfileClientProps) => {
  const router = useRouter();
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (data: any) => {
    try {
      const method = initialProfile ? 'PUT' : 'POST';
      const response = await fetch('/api/profile', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save profile');
      }

      setSuccess(true);
      setError('');
      router.refresh(); // Refresh the page to show updated data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setSuccess(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="bg-green-50">
          <AlertDescription>Profile saved successfully!</AlertDescription>
        </Alert>
      )}

      <ProfileForm 
        profile={initialProfile} 
        onSubmit={handleSubmit} 
      />
    </div>
  );
};

export default ProfileClient;
