'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Sidebar } from './sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0d11]">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 mb-4">
            <div className="w-1.5 h-7 rounded-full bg-emerald-400/60 animate-pulse" />
            <div className="w-1.5 h-7 rounded-full bg-amber-400/60 animate-pulse [animation-delay:150ms]" />
            <div className="w-1.5 h-7 rounded-full bg-red-400/60 animate-pulse [animation-delay:300ms]" />
          </div>
          <p className="text-xs text-[#555b66] font-medium tracking-wide">Carregando</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0c0d11]">
      <Sidebar />
      <main className="ml-[252px] min-h-screen">
        {children}
      </main>
    </div>
  );
}