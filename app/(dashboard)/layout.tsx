'use client';

import { Button } from '@/app/components/ui/button';
import { signOut, useSession } from 'next-auth/react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <span className="text-xl font-bold">GAIA-DLP</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a href="/dashboard" className="inline-flex items-center border-b-2 border-blue-500 px-1 pt-1 text-sm font-medium text-gray-900">
                  Dashboard
                </a>
                <a href="/courses" className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
                  Courses
                </a>
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-4 text-sm text-gray-600">{session?.user?.email}</span>
              <Button
                onClick={() => signOut({ callbackUrl: '/' })}
                variant="outline"
                size="sm"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
