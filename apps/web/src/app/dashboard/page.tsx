'use client';

import { useAuth } from '@/contexts/auth-context';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { MonitorForm } from '@/components/monitor-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { api } from '@/lib/api';
import { Monitor, CreateMonitorInput } from '@/types/monitor';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMonitor, setEditingMonitor] = useState<Monitor | undefined>();
  
  // Header states
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [openMonitorMenu, setOpenMonitorMenu] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchExpanded]);

  useEffect(() => {
    if (user) {
      loadMonitors();
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      loadMonitors();
    }, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const loadMonitors = async () => {
    try {
      const response = await api.get('/monitors');
      const monitorsData = response.data.data;

      const monitorsWithStatus = await Promise.all(
        monitorsData.map(async (monitor: Monitor) => {
          try {
            const [statusRes, statsRes] = await Promise.all([
              api.get(`/monitors/${monitor.id}/status`),
              api.get(`/monitors/${monitor.id}/stats`),
            ]);

            return {
              ...monitor,
              currentStatus: statusRes.data.data.status,
              stats: statsRes.data.data,
            };
          } catch (error) {
            return {
              ...monitor,
              currentStatus: 'UNKNOWN',
            };
          }
        })
      );

      setMonitors(monitorsWithStatus);
    } catch (error) {
      console.error('Erro ao carregar monitores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMonitor = async (data: CreateMonitorInput) => {
    await api.post('/monitors', data);
    setShowCreateModal(false);
    loadMonitors();
  };

  const handleUpdateMonitor = async (data: CreateMonitorInput) => {
    if (!editingMonitor) return;
    await api.put(`/monitors/${editingMonitor.id}`, data);
    setEditingMonitor(undefined);
    loadMonitors();
  };

  const handleDeleteMonitor = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este monitor?')) return;
    try {
      await api.delete(`/monitors/${id}`);
      loadMonitors();
    } catch (error) {
      console.error('Erro ao deletar monitor:', error);
    }
  };

  const handleToggleMonitor = async (id: string) => {
    try {
      await api.patch(`/monitors/${id}/toggle`);
      loadMonitors();
    } catch (error) {
      console.error('Erro ao alternar monitor:', error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-2 h-8 rounded-full bg-[#22c55e] animate-pulse"></div>
              <div className="w-2 h-8 rounded-full bg-[#22c55e] animate-pulse [animation-delay:0.2s]"></div>
              <div className="w-2 h-8 rounded-full bg-[#22c55e] animate-pulse [animation-delay:0.4s]"></div>
            </div>
            <p className="text-sm text-[#a1a1aa]">Carregando dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const upMonitors = monitors.filter((m) => m.currentStatus === 'UP');
  const downMonitors = monitors.filter((m) => m.currentStatus === 'DOWN');
  const uptimePercentage = monitors.length > 0 
    ? ((upMonitors.length / monitors.length) * 100).toFixed(1)
    : '0.0';

  const getMonitorLimit = () => {
    const plan = user?.subscription?.plan || 'FREE';
    switch (plan) {
      case 'STARTER': return 10;
      case 'PRO': return 30;
      case 'BUSINESS': return 100;
      default: return 3;
    }
  };

  const monitorLimit = getMonitorLimit();
  const canAddMonitor = monitors.length < monitorLimit;

  // Mock notifications
  const notifications = [
    { id: 1, type: 'DOWN', message: 'Site Principal está DOWN', time: '5 min atrás', unread: true },
    { id: 2, type: 'UP', message: 'API Backend recuperou', time: '1 hora atrás', unread: true },
    { id: 3, type: 'INFO', message: 'Relatório mensal disponível', time: '2 horas atrás', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const formatUptime = (createdAt: string) => {
    const now = new Date();
    const diff = now.getTime() - new Date(createdAt).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen">
        {/* Header Refinado */}
        <header className="sticky top-0 z-40 bg-[#0b0c10]/95 backdrop-blur border-b border-[#27272a]/50">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-[#f3f2f1] tracking-tight">
                  Bem-vindo de volta, {user?.name.split(' ')[0]}! 👋
                </h1>
                <p className="text-sm text-[#a1a1aa] mt-1">
                  Monitore a saúde de seus serviços em tempo real
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Search expansível com animação suave */}
                <div className={`relative transition-all duration-500 ease-out ${
                  searchExpanded ? 'w-72' : 'w-auto'
                }`}>
                  {searchExpanded ? (
                    <div className="relative">
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Buscar monitores..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onBlur={() => {
                          if (!searchQuery) {
                            setTimeout(() => setSearchExpanded(false), 150);
                          }
                        }}
                        className="w-full bg-[#1a1b1e] border border-[#27272a] rounded-lg px-4 py-2 pl-10 text-sm text-[#f3f2f1] placeholder-[#71717a] focus:outline-none focus:border-[#22c55e]/50 focus:ring-1 focus:ring-[#22c55e]/20 transition-all duration-300"
                      />
                      <svg 
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      {searchQuery && (
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            searchInputRef.current?.focus();
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-[#f3f2f1] transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setSearchExpanded(true)}
                      className="p-2 rounded-lg hover:bg-[#27272a]/30 text-[#a1a1aa] hover:text-[#f3f2f1] hover:scale-110 transition-all duration-200"
                      aria-label="Buscar"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Notificações Refinadas */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 rounded-lg hover:bg-[#27272a]/30 text-[#a1a1aa] hover:text-[#f3f2f1] hover:scale-110 transition-all duration-200"
                    aria-label="Notificações"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ef4444] text-[10px] font-bold text-white ring-2 ring-[#0b0c10]">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown Notificações */}
                  {showNotifications && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowNotifications(false)}
                      ></div>
                      <div className="absolute right-0 mt-2 w-96 bg-[#1a1b1e] border border-[#27272a] rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* Header */}
                        <div className="p-4 border-b border-[#27272a]">
                          <h3 className="text-sm font-semibold text-[#f3f2f1] text-center">Notificações</h3>
                        </div>

                        {/* 3 Notificações Recentes */}
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.slice(0, 3).map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-4 border-b border-[#27272a]/50 hover:bg-[#27272a]/20 transition-colors cursor-pointer ${
                                notif.unread ? 'bg-[#27272a]/10' : ''
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`p-1.5 rounded-lg flex-shrink-0 ${
                                  notif.type === 'DOWN' ? 'bg-[#ef4444]/10' :
                                  notif.type === 'UP' ? 'bg-[#22c55e]/10' :
                                  'bg-[#3b82f6]/10'
                                }`}>
                                  {notif.type === 'DOWN' && (
                                    <svg className="w-4 h-4 text-[#ef4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  )}
                                  {notif.type === 'UP' && (
                                    <svg className="w-4 h-4 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                  {notif.type === 'INFO' && (
                                    <svg className="w-4 h-4 text-[#3b82f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-[#f3f2f1] leading-snug">{notif.message}</p>
                                  <p className="text-xs text-[#71717a] mt-1">{notif.time}</p>
                                </div>
                                {notif.unread && (
                                  <div className="w-2 h-2 rounded-full bg-[#3b82f6] flex-shrink-0 mt-1.5"></div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Ver Todas */}
                        <div className="p-3 border-b border-[#27272a] text-center">
                          <Link 
                            href="/notifications"
                            className="text-sm text-[#f3f2f1] hover:text-[#f3f2f1]/80 font-medium transition-colors inline-flex items-center gap-1"
                          >
                            Ver todas as notificações
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>

                        {/* Categorias */}
                        <div className="p-3">
                          <p className="text-xs font-semibold text-[#71717a] uppercase tracking-wider mb-2 text-center">Categorias</p>
                          <Link
                            href="/reports"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#a1a1aa] hover:text-[#f3f2f1] hover:bg-[#27272a]/30 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Relatórios
                          </Link>
                          <Link
                            href="/notifications"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#a1a1aa] hover:text-[#f3f2f1] hover:bg-[#27272a]/30 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            Notificações
                          </Link>
                          <Link
                            href="/settings/notifications"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#a1a1aa] hover:text-[#f3f2f1] hover:bg-[#27272a]/30 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                            Configurar alertas
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 rounded-lg hover:bg-[#27272a]/30 text-[#a1a1aa] hover:text-[#f3f2f1] hover:scale-110 transition-all duration-200"
                    aria-label="Menu"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>

                  {showMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowMenu(false)}
                      ></div>
                      <div className="absolute right-0 mt-2 w-56 bg-[#1a1b1e] border border-[#27272a] rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <Link
                          href="/billing"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-[#a1a1aa] hover:text-[#f3f2f1] hover:bg-[#27272a]/30 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          Billing
                        </Link>
                        <Link
                          href="/pricing"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-[#a1a1aa] hover:text-[#f3f2f1] hover:bg-[#27272a]/30 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          Planos & Assinaturas
                        </Link>
                        <div className="border-t border-[#27272a]"></div>
                        <button
                          onClick={logout}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-[#ef4444] hover:bg-[#27272a]/30 transition-colors w-full"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sair
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-[#f3f2f1] rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-[#18181B]/5 rounded-lg">
                  <svg className="w-5 h-5 text-[#18181B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-[#71717a] mb-1 font-medium">Total de Monitores</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-[#18181B] tabular-nums">{monitors.length}</p>
                <span className="text-sm text-[#71717a]">/ {monitorLimit}</span>
              </div>
            </div>

            <div className="bg-[#f3f2f1] rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-[#22c55e]/10 rounded-lg">
                  <svg className="w-5 h-5 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-[#22c55e] bg-[#22c55e]/10 px-2.5 py-1 rounded-full">
                  ONLINE
                </span>
              </div>
              <p className="text-sm text-[#71717a] mb-1 font-medium">Ativos</p>
              <p className="text-3xl font-bold text-[#22c55e] tabular-nums">{upMonitors.length}</p>
            </div>

            <div className="bg-[#f3f2f1] rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-[#ef4444]/10 rounded-lg">
                  <svg className="w-5 h-5 text-[#ef4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                {downMonitors.length > 0 && (
                  <span className="text-xs font-medium text-[#ef4444] bg-[#ef4444]/10 px-2.5 py-1 rounded-full animate-pulse">
                    ALERTA
                  </span>
                )}
              </div>
              <p className="text-sm text-[#71717a] mb-1 font-medium">Inativos</p>
              <p className="text-3xl font-bold text-[#ef4444] tabular-nums">{downMonitors.length}</p>
            </div>

            <div className="bg-[#f3f2f1] rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-[#22c55e]/10 rounded-lg">
                  <svg className="w-5 h-5 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-[#71717a] mb-1 font-medium">Disponibilidade</p>
              <div className="flex items-baseline gap-1">
                <p className="text-3xl font-bold text-[#22c55e] tabular-nums">{uptimePercentage}</p>
                <span className="text-lg text-[#22c55e]">%</span>
              </div>
            </div>
          </div>

          {/* Upgrade Alert */}
          {!canAddMonitor && (
            <div className="bg-[#fef3c7] border border-[#fbbf24]/20 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-[#fbbf24]/10 rounded-lg flex-shrink-0">
                  <svg className="w-5 h-5 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-[#92400e] mb-1">
                    Limite de monitores atingido
                  </h3>
                  <p className="text-sm text-[#78350f] mb-3">
                    Você está usando {monitors.length} de {monitorLimit} monitores no plano {user?.subscription?.plan || 'FREE'}. Faça upgrade para adicionar mais.
                  </p>
                  <Link href="/pricing">
                    <Button size="sm" className="bg-[#18181B] hover:bg-[#27272a] text-[#f3f2f1]">
                      Ver planos
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Monitors Section - Estilo UptimeRobot */}
          <div className="bg-[#1a1b1e] border border-[#27272a]/50 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-[#27272a]/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#f3f2f1] mb-1 tracking-tight">
                    Seus Monitores
                  </h2>
                  <p className="text-sm text-[#a1a1aa]">
                    {monitors.length} de {monitorLimit} monitores em uso
                  </p>
                </div>
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  disabled={!canAddMonitor}
                  className="bg-[#f3f2f1] hover:bg-[#e5e4e2] text-[#18181B] disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Novo Monitor
                </Button>
              </div>
            </div>

            <div className="p-6">
              {monitors.length === 0 ? (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#27272a]/50 rounded-xl mb-4">
                    <svg className="w-8 h-8 text-[#71717a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-[#f3f2f1] mb-2">
                    Nenhum monitor configurado
                  </h3>
                  <p className="text-sm text-[#a1a1aa] mb-6 max-w-md mx-auto">
                    Comece criando seu primeiro monitor para acompanhar a disponibilidade de seus serviços
                  </p>
                  <Button 
                    onClick={() => setShowCreateModal(true)}
                    className="bg-[#f3f2f1] hover:bg-[#e5e4e2] text-[#18181B] font-medium"
                  >
                    Criar Primeiro Monitor
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {monitors.map((monitor) => {
                    const uptime = monitor.stats?.uptime ? parseFloat(monitor.stats.uptime) : 0;
                    const isUp = monitor.currentStatus === 'UP';
                    
                    return (
                      <div
                        key={monitor.id}
                        className="bg-[#f3f2f1] rounded-lg p-5 hover:shadow-md transition-all duration-200 group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            {/* Status Indicator */}
                            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                              isUp ? 'bg-[#22c55e]' : 'bg-[#ef4444]'
                            } ${isUp ? 'animate-pulse' : ''}`}></div>
                            
                            {/* Monitor Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-base font-semibold text-[#18181B] truncate">
                                  {monitor.name}
                                </h3>
                                <span className="text-xs font-medium text-[#71717a] bg-[#18181B]/5 px-2 py-1 rounded">
                                  {monitor.type}
                                </span>
                                {monitor.lastChecked && (
                                  <span className="text-xs text-[#71717a] flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                    </svg>
                                    {formatUptime(monitor.createdAt)}
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-6">
                                <p className="text-sm text-[#71717a] truncate">
                                  {monitor.url}
                                </p>
                                <span className="text-xs text-[#71717a]">
                                  Checando a cada {Math.floor(monitor.interval / 60)} min
                                </span>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <div className="w-32">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-medium text-[#71717a]">{uptime.toFixed(1)}%</span>
                                </div>
                                <div className="h-2 bg-[#18181B]/5 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-500 ${
                                      uptime >= 99 ? 'bg-[#22c55e]' :
                                      uptime >= 95 ? 'bg-[#f59e0b]' :
                                      'bg-[#ef4444]'
                                    }`}
                                    style={{ width: `${uptime}%` }}
                                  ></div>
                                </div>
                              </div>

                              {/* Actions Menu */}
                              <div className="relative">
                                <button 
                                  onClick={() => setOpenMonitorMenu(openMonitorMenu === monitor.id ? null : monitor.id)}
                                  className="p-2 rounded-lg hover:bg-[#18181B]/5 text-[#71717a] hover:text-[#18181B] opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                  </svg>
                                </button>

                                {openMonitorMenu === monitor.id && (
                                  <>
                                    <div 
                                      className="fixed inset-0 z-40" 
                                      onClick={() => setOpenMonitorMenu(null)}
                                    ></div>
                                    <div className="absolute right-0 mt-1 w-48 bg-[#1a1b1e] border border-[#27272a] rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                                      <button
                                        onClick={() => {
                                          setEditingMonitor(monitor);
                                          setOpenMonitorMenu(null);
                                        }}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#a1a1aa] hover:text-[#f3f2f1] hover:bg-[#27272a]/30 transition-colors w-full"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Editar
                                      </button>
                                      <button
                                        onClick={() => {
                                          handleToggleMonitor(monitor.id);
                                          setOpenMonitorMenu(null);
                                        }}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#a1a1aa] hover:text-[#f3f2f1] hover:bg-[#27272a]/30 transition-colors w-full"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          {monitor.isActive ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                          )}
                                        </svg>
                                        {monitor.isActive ? 'Pausar' : 'Retomar'}
                                      </button>
                                      <div className="border-t border-[#27272a]"></div>
                                      <button
                                        onClick={() => {
                                          handleDeleteMonitor(monitor.id);
                                          setOpenMonitorMenu(null);
                                        }}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#ef4444] hover:bg-[#27272a]/30 transition-colors w-full"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Deletar
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="bg-[#1a1b1e] border-[#27272a]">
          <DialogHeader>
            <DialogTitle className="text-[#f3f2f1]">Criar Novo Monitor</DialogTitle>
            <DialogDescription className="text-[#a1a1aa]">
              Configure um novo monitor para acompanhar seu site ou API
            </DialogDescription>
          </DialogHeader>
          <MonitorForm
            onSubmit={handleCreateMonitor}
            onCancel={() => setShowCreateModal(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingMonitor} onOpenChange={() => setEditingMonitor(undefined)}>
        <DialogContent className="bg-[#1a1b1e] border-[#27272a]">
          <DialogHeader>
            <DialogTitle className="text-[#f3f2f1]">Editar Monitor</DialogTitle>
            <DialogDescription className="text-[#a1a1aa]">
              Atualize as configurações do seu monitor
            </DialogDescription>
          </DialogHeader>
          <MonitorForm
            monitor={editingMonitor}
            onSubmit={handleUpdateMonitor}
            onCancel={() => setEditingMonitor(undefined)}
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
