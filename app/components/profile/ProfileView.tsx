import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import ImageUpload from './ImageUpload';
import EducationSection from './sections/Education';
import ExperienceSection from './sections/Experience';
import SkillsSection from './sections/Skills';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProfileData {
  imageUrl?: string;
  education: {
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  experience: {
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }[];
  skills: {
    name: string;
    category: string;
    proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  }[];
}

const ProfileView = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    education: [],
    experience: [],
    skills: []
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        setError('Failed to load profile data');
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchProfile();
    }
  }, [session]);

  const handleImageUpload = async (url: string) => {
    try {
      setSaving(true);
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: url }),
      });

      if (!response.ok) throw new Error('Failed to update profile image');
      setProfileData(prev => ({ ...prev, imageUrl: url }));
    } catch (err) {
      setError('Failed to update profile image');
      console.error('Image update error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleEducationUpdate = async (education: ProfileData['education']) => {
    try {
      setSaving(true);
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ education }),
      });

      if (!response.ok) throw new Error('Failed to update education');
      setProfileData(prev => ({ ...prev, education }));
    } catch (err) {
      setError('Failed to update education');
      console.error('Education update error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleExperienceUpdate = async (experience: ProfileData['experience']) => {
    try {
      setSaving(true);
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ experience }),
      });

      if (!response.ok) throw new Error('Failed to update experience');
      setProfileData(prev => ({ ...prev, experience }));
    } catch (err) {
      setError('Failed to update experience');
      console.error('Experience update error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSkillsUpdate = async (skills: ProfileData['skills']) => {
    try {
      setSaving(true);
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ skills }),
      });

      if (!response.ok) throw new Error('Failed to update skills');
      setProfileData(prev => ({ ...prev, skills }));
    } catch (err) {
      setError('Failed to update skills');
      console.error('Skills update error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!session) {
    return (
      <Alert>
        <AlertDescription>
          Please sign in to view and edit your profile.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading profile...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            <ImageUpload
              onImageUpload={handleImageUpload}
              currentImage={profileData.imageUrl}
            />
            <h2 className="text-2xl font-bold">{session.user?.name}</h2>
            <p className="text-gray-600">{session.user?.email}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="education" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="education">
          <EducationSection
            educationList={profileData.education}
            onUpdate={handleEducationUpdate}
          />
        </TabsContent>

        <TabsContent value="experience">
          <ExperienceSection
            experienceList={profileData.experience}
            onUpdate={handleExperienceUpdate}
          />
        </TabsContent>

        <TabsContent value="skills">
          <SkillsSection
            skillsList={profileData.skills}
            onUpdate={handleSkillsUpdate}
          />
        </TabsContent>
      </Tabs>

      {saving && (
        <div className="fixed bottom-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded-md shadow">
          Saving changes...
        </div>
      )}
    </div>
  );
};

export default ProfileView;
