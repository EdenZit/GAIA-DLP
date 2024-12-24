import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import ProfileClient from '@/app/components/profile/ProfileClient';
import Profile from '@/app/models/Profile';
import dbConnect from '@/app/lib/dbConnect';

async function getProfile(userId: string) {
  await dbConnect();
  const profile = await Profile.findOne({ userId });
  return JSON.parse(JSON.stringify(profile)); // Serialize the Mongoose document
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  const profile = await getProfile(session.user.id);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      <ProfileClient initialProfile={profile} />
    </div>
  );
}
