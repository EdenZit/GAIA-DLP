'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  });

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to GAIA-DLP Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-700">
          Logged in as: <span className="font-semibold">{session?.user?.name}</span>
        </p>
        <p className="text-gray-700">
          Email: <span className="font-semibold">{session?.user?.email}</span>
        </p>
      </div>
    </div>
  );
}
