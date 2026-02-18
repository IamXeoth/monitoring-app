'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 12a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" />
        </svg>
      ),
    },
    {
      name: 'Monitores',
      href: '/monitors',
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg>
      ),
    },
    {
      name: 'Incidentes',
      href: '/incidents',
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      name: 'Status Pages',
      href: '/status-pages',
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      name: 'Manutenção',
      href: '/maintenance',
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" />
        </svg>
      ),
    },
    {
      name: 'Integrações & API',
      href: '/integrations',
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
    },
  ];

  const planLabel = user?.subscription?.plan || 'FREE';

  /* Shared nav item style */
  const navItemClass = (active: boolean) =>
    `group flex items-center gap-3 px-3 py-[9px] rounded-lg text-[13px] font-medium transition-all duration-150 ${
      active
        ? 'bg-white/[0.07] text-[#e4e4e7]'
        : 'text-[#5c6370] hover:text-[#b0b3ba] hover:bg-white/[0.03]'
    }`;

  const iconClass = (active: boolean) =>
    `transition-colors duration-150 ${active ? 'text-[#e4e4e7]' : 'text-[#3a3f4a] group-hover:text-[#5c6370]'}`;

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[252px] bg-[#101218] flex flex-col z-30">

      {/* ─── Logo ─── */}
      <div className="h-16 flex items-center px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex items-center gap-[3px]">
            <div className="w-[3.5px] h-[18px] rounded-full bg-[#e4e4e7] group-hover:bg-white transition-colors" />
            <div className="w-[3.5px] h-[18px] rounded-full bg-[#e4e4e7]/50 group-hover:bg-white/60 transition-colors" />
            <div className="w-[3.5px] h-[18px] rounded-full bg-[#e4e4e7]/25 group-hover:bg-white/35 transition-colors" />
          </div>
          <span className="text-[16px] font-bold text-[#e4e4e7] tracking-tight group-hover:text-white transition-colors">
            TheAlert
          </span>
        </Link>
      </div>

      {/* ─── Section: Menu ─── */}
      <div className="px-6 mb-2">
        <p className="text-[10px] font-semibold text-[#2e323a] uppercase tracking-[0.1em]">
          Menu
        </p>
      </div>

      <nav className="px-5 space-y-0.5">
        {navigation.map((item) => {
          const active = isActive(item.href);
          return (
            <Link key={item.name} href={item.href} className={navItemClass(active)}>
              <span className={iconClass(active)}>{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* ─── Section: Equipe ─── */}
      <div className="mt-8 px-6 mb-2">
        <p className="text-[10px] font-semibold text-[#2e323a] uppercase tracking-[0.1em]">
          Equipe
        </p>
      </div>

      <div className="px-5">
        <button className="w-full flex items-center gap-3 px-3 py-[9px] rounded-lg text-[13px] font-medium text-[#5c6370] hover:text-[#b0b3ba] hover:bg-white/[0.03] transition-all duration-150">
          <svg className="w-[18px] h-[18px] text-[#3a3f4a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Convidar membro
        </button>
        {/* Future: team member avatars will appear here */}
      </div>

      {/* ─── Spacer ─── */}
      <div className="flex-1" />

      {/* ─── Bottom ─── */}
      <div className="px-5 pb-3 space-y-0.5">
        {/* Settings */}
        <Link href="/settings" className={navItemClass(isActive('/settings'))}>
          <svg className={`w-[18px] h-[18px] ${iconClass(isActive('/settings'))}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Configurações
        </Link>

        {/* Help */}
        <Link href="/help" className={navItemClass(false)}>
          <svg className={`w-[18px] h-[18px] ${iconClass(false)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Central de ajuda
        </Link>

        {/* Divider */}
        <div className="!my-2.5 mx-1 border-t border-white/[0.05]" />

        {/* User card */}
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-white/[0.03] transition-colors cursor-default">
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1e2128] to-[#15171c] border border-white/[0.06] flex items-center justify-center">
              <span className="text-[12px] font-bold text-[#80838a] uppercase">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#101218]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-[#c8c9cd] truncate leading-tight">
              {user?.name || 'Usuário'}
            </p>
            <p className="text-[10px] text-[#3a3f4a] font-medium mt-0.5">
              Plano {planLabel}
            </p>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-md text-[#2e323a] hover:text-[#80838a] hover:bg-white/[0.05] transition-all"
            title="Sair"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>

        {/* Upgrade CTA */}
        {planLabel === 'FREE' && (
          <Link href="/pricing">
            <div className="mt-1.5 px-3 py-3 rounded-lg bg-gradient-to-r from-emerald-500/[0.08] to-emerald-500/[0.03] border border-emerald-500/[0.08] hover:border-emerald-500/20 transition-all cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-emerald-400/80 group-hover:text-emerald-400 transition-colors">
                    Fazer upgrade
                  </p>
                  <p className="text-[10px] text-emerald-400/30 mt-0.5">
                    Mais monitores e alertas
                  </p>
                </div>
                <svg className="w-4 h-4 text-emerald-400/30 group-hover:text-emerald-400/60 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        )}
      </div>
    </aside>
  );
}