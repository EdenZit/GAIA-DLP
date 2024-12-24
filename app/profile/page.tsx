// app/profile/page.tsx
'use client';

import { Suspense } from 'react';
import ProfileView from '@/components/profile/ProfileView';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Loading from '@/components/common/Loading';
import Header from '@/components/common/Header';

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)]">
      <ErrorBoundary>
        <Header />
        <main className="flex-1 container mx-auto py-6">
          <Suspense fallback={<Loading message="Loading profile..." />}>
            <ProfileView />
          </Suspense>
        </main>
      </ErrorBoundary>
    </div>
  );
}
