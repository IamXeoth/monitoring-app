'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Sidebar } from './sidebar';
import { SidebarProvider, useSidebar } from './sidebar-context';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardLayoutContent({ children }: DashboardLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { isCollapsed } = useSidebar();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0c10]">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-2 h-8 rounded-full bg-[#22c55e] animate-pulse"></div>
            <div className="w-2 h-8 rounded-full bg-[#22c55e] animate-pulse [animation-delay:0.2s]"></div>
            <div className="w-2 h-8 rounded-full bg-[#22c55e] animate-pulse [animation-delay:0.4s]"></div>
          </div>
          <p className="text-sm text-[#a1a1aa]">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0b0c10]">
      <Sidebar />
      <main 
        className={`min-h-screen transition-all duration-300 ease-in-out ${
          isCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {children}
      </main>
    </div>
  );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
}