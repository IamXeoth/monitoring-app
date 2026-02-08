'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useSidebar } from './sidebar-context';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'Monitores',
      href: '/monitors',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      name: 'Incidentes',
      href: '/incidents',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      name: 'Status Pages',
      href: '/status-pages',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      name: 'Integrações & API',
      href: '/integrations',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      ),
    },
  ];

  const userPlan = user?.subscription?.plan || 'FREE';
  
  const secondaryNav = [
    {
      name: 'Convidar Membro',
      href: '/team/invite',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
    },
    {
      name: `Minha Conta (${userPlan})`,
      href: '/account',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  const bottomNav = [
    {
      name: 'Atualizar',
      action: () => window.location.reload(),
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
    {
      name: 'Configurações',
      href: '/settings',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      name: 'Central de Ajuda',
      href: '/help',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-[#18181B] border-r border-[#27272a]/50 flex flex-col transition-all duration-300 ease-in-out z-50 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header com Logo */}
      <div className={`h-16 flex items-center border-b border-[#27272a]/50 transition-all duration-300 ${
        isCollapsed ? 'justify-center px-2' : 'justify-between px-5'
      }`}>
        {!isCollapsed ? (
          <Link href="/" className="flex items-center gap-2.5 group overflow-hidden">
            <div className="flex items-center gap-1 flex-shrink-0">
              <div className="w-1 h-5 rounded-full bg-[#f3f2f1]"></div>
              <div className="w-1 h-5 rounded-full bg-[#f3f2f1]"></div>
              <div className="w-1 h-5 rounded-full bg-[#f3f2f1]"></div>
            </div>
            <span 
              className={`text-[17px] font-semibold text-[#f3f2f1] tracking-tight whitespace-nowrap transition-all duration-300 ${
                isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
              }`}
            >
              TheAlert
            </span>
          </Link>
        ) : (
          <div className="flex items-center gap-1">
            <div className="w-1 h-5 rounded-full bg-[#f3f2f1]"></div>
            <div className="w-1 h-5 rounded-full bg-[#f3f2f1]"></div>
            <div className="w-1 h-5 rounded-full bg-[#f3f2f1]"></div>
          </div>
        )}
        
        {/* Botão de recolher */}
        {!isCollapsed && (
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-md hover:bg-[#27272a]/50 text-[#71717a] hover:text-[#f3f2f1] transition-all duration-200 flex-shrink-0"
            aria-label="Recolher sidebar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        )}

        {isCollapsed && (
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-6 p-1.5 rounded-full bg-[#18181B] border border-[#27272a]/50 hover:bg-[#27272a] text-[#71717a] hover:text-[#f3f2f1] transition-all duration-200 shadow-lg"
            aria-label="Expandir sidebar"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Navegação Principal */}
      <nav className={`flex-1 py-6 space-y-1 overflow-y-auto overflow-x-hidden transition-all duration-300 ${
        isCollapsed ? 'px-2' : 'px-3'
      }`}>
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`
              group flex items-center gap-3 rounded-lg text-[13px] font-medium transition-all duration-300 overflow-hidden
              ${
                isActive(item.href)
                  ? 'bg-[#f3f2f1]/10 text-[#f3f2f1] shadow-sm'
                  : 'text-[#a1a1aa] hover:text-[#f3f2f1] hover:bg-[#27272a]/30'
              }
              ${isCollapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}
            `}
            title={isCollapsed ? item.name : undefined}
          >
            <span className={`flex-shrink-0 ${isActive(item.href) ? 'text-[#f3f2f1]' : 'text-[#71717a] group-hover:text-[#a1a1aa]'}`}>
              {item.icon}
            </span>
            <span 
              className={`tracking-wide whitespace-nowrap transition-all duration-300 ${
                isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
              }`}
            >
              {item.name}
            </span>
          </Link>
        ))}

        {/* Divisor */}
        <div className="py-3">
          <div className="h-px bg-[#27272a]/50"></div>
        </div>

        {/* Navegação Secundária */}
        {secondaryNav.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`
              group flex items-center gap-3 rounded-lg text-[13px] font-medium transition-all duration-300 overflow-hidden
              ${
                isActive(item.href)
                  ? 'bg-[#f3f2f1]/10 text-[#f3f2f1] shadow-sm'
                  : 'text-[#a1a1aa] hover:text-[#f3f2f1] hover:bg-[#27272a]/30'
              }
              ${isCollapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}
            `}
            title={isCollapsed ? item.name : undefined}
          >
            <span className={`flex-shrink-0 ${isActive(item.href) ? 'text-[#f3f2f1]' : 'text-[#71717a] group-hover:text-[#a1a1aa]'}`}>
              {item.icon}
            </span>
            <span 
              className={`tracking-wide whitespace-nowrap transition-all duration-300 ${
                isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
              }`}
            >
              {item.name}
            </span>
          </Link>
        ))}

        {/* Botão de Upgrade (só aparece se FREE e não colapsado) */}
        {userPlan === 'FREE' && !isCollapsed && (
          <Link
            href="/pricing"
            className="mx-2 mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-[#f3f2f1]/10 text-[#f3f2f1] hover:bg-[#f3f2f1]/20 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Fazer Upgrade
          </Link>
        )}
      </nav>

      {/* Bottom Navigation */}
      <div className={`border-t border-[#27272a]/50 p-3 space-y-1 transition-all duration-300 ${
        isCollapsed ? 'px-2' : 'px-3'
      }`}>
        {bottomNav.map((item) => {
          if (item.action) {
            return (
              <button
                key={item.name}
                onClick={item.action}
                className={`
                  group w-full flex items-center gap-3 rounded-lg text-[13px] font-medium text-[#a1a1aa] hover:text-[#f3f2f1] hover:bg-[#27272a]/30 transition-all duration-300 overflow-hidden
                  ${isCollapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}
                `}
                title={isCollapsed ? item.name : undefined}
              >
                <span className="text-[#71717a] group-hover:text-[#a1a1aa] flex-shrink-0">
                  {item.icon}
                </span>
                <span 
                  className={`tracking-wide whitespace-nowrap transition-all duration-300 ${
                    isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                  }`}
                >
                  {item.name}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href!}
              className={`
                group flex items-center gap-3 rounded-lg text-[13px] font-medium transition-all duration-300 overflow-hidden
                ${
                  isActive(item.href!)
                    ? 'bg-[#f3f2f1]/10 text-[#f3f2f1] shadow-sm'
                    : 'text-[#a1a1aa] hover:text-[#f3f2f1] hover:bg-[#27272a]/30'
                }
                ${isCollapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}
              `}
              title={isCollapsed ? item.name : undefined}
            >
              <span className={`flex-shrink-0 ${isActive(item.href!) ? 'text-[#f3f2f1]' : 'text-[#71717a] group-hover:text-[#a1a1aa]'}`}>
                {item.icon}
              </span>
              <span 
                className={`tracking-wide whitespace-nowrap transition-all duration-300 ${
                  isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}