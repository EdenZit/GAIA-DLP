'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {session?.user?.name}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* My Courses Card */}
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-600">View and manage your enrolled courses</p>
              <Button
                onClick={() => router.push('/courses')}
                variant="outline"
                className="w-full"
              >
                View Courses
              </Button>
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle>My Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-600">Track your learning progress</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Courses Completed</span>
                  <span className="font-medium">0/0</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-blue-500" style={{ width: '0%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-gray-600">Email: {session?.user?.email}</p>
                <p className="text-gray-600">Role: {session?.user?.role || 'Student'}</p>
              </div>
              <Button
                onClick={() => router.push('/profile')}
                variant="outline"
                className="w-full"
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
