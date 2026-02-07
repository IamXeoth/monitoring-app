'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MonitorCard } from '@/components/monitor-card';
import { MonitorForm } from '@/components/monitor-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { api } from '@/lib/api';
import { Monitor, CreateMonitorInput } from '@/types/monitor';

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMonitor, setEditingMonitor] = useState<Monitor | undefined>();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadMonitors();
    }
  }, [user]);

  // Auto-refresh a cada 30 segundos
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      loadMonitors();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [user]);

  const loadMonitors = async () => {
    try {
      const response = await api.get('/monitors');
      const monitorsData = response.data.data;

      // Buscar status e stats de cada monitor
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0c10]">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-2 h-8 rounded-full bg-primary animate-pulse"></div>
            <div className="w-2 h-8 rounded-full bg-primary animate-pulse [animation-delay:0.2s]"></div>
            <div className="w-2 h-8 rounded-full bg-primary animate-pulse [animation-delay:0.4s]"></div>
          </div>
          <p className="text-sm text-slate-400">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const activeMonitors = monitors.filter((m) => m.isActive);
  const upMonitors = monitors.filter((m) => m.currentStatus === 'UP');
  const downMonitors = monitors.filter((m) => m.currentStatus === 'DOWN');
  const uptimePercentage = monitors.length > 0 
    ? ((upMonitors.length / monitors.length) * 100).toFixed(1)
    : '0.0';

  const getMonitorLimit = () => {
    const plan = user.subscription?.plan || 'FREE';
    switch (plan) {
      case 'STARTER': return 10;
      case 'PRO': return 30;
      case 'BUSINESS': return 100;
      default: return 3;
    }
  };

  const monitorLimit = getMonitorLimit();
  const canAddMonitor = monitors.length < monitorLimit;

  return (
    <div className="min-h-screen bg-[#0b0c10]">
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#0b0c10]/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex items-center gap-1 transition-transform group-hover:scale-105">
                <div className="w-1 h-5 rounded-full bg-primary"></div>
                <div className="w-1 h-5 rounded-full bg-primary"></div>
                <div className="w-1 h-5 rounded-full bg-primary"></div>
              </div>
              <span className="text-lg font-semibold text-white tracking-tight">TheAlert</span>
            </Link>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-sm font-medium text-primary">
                Dashboard
              </Link>
              <Link href="/monitors" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                Monitores
              </Link>
              <Link href="/incidents" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                Incidentes
              </Link>
              <Link href="/settings" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                Configurações
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* User info */}
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-slate-400">{user.subscription?.plan || 'FREE'}</p>
            </div>
            
            <Button 
              onClick={logout} 
              variant="ghost" 
              className="text-slate-400 hover:text-white hover:bg-slate-800"
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div>
            <h2 className="text-3xl font-semibold text-white mb-2 tracking-tight">
              Bem-vindo de volta, {user.name.split(' ')[0]}! 👋
            </h2>
            <p className="text-slate-400">
              Monitore a saúde de seus serviços em tempo real
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Monitors */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-slate-800 rounded-xl">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-1">Total de Monitores</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-semibold text-white tabular-nums">{monitors.length}</p>
                <span className="text-sm text-slate-500">/ {monitorLimit}</span>
              </div>
            </div>

            {/* UP */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-green-900/50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-500/10 rounded-xl">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                  ONLINE
                </span>
              </div>
              <p className="text-sm text-slate-400 mb-1">Ativos</p>
              <p className="text-3xl font-semibold text-green-500 tabular-nums">{upMonitors.length}</p>
            </div>

            {/* DOWN */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-red-900/50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-red-500/10 rounded-xl">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                {downMonitors.length > 0 && (
                  <span className="text-xs font-medium text-red-500 bg-red-500/10 px-2 py-1 rounded-full animate-pulse">
                    ALERTA
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-400 mb-1">Inativos</p>
              <p className="text-3xl font-semibold text-red-500 tabular-nums">{downMonitors.length}</p>
            </div>

            {/* Uptime */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-1">Disponibilidade</p>
              <div className="flex items-baseline gap-1">
                <p className="text-3xl font-semibold text-primary tabular-nums">{uptimePercentage}</p>
                <span className="text-lg text-primary">%</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {!canAddMonitor && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-yellow-500/10 rounded-xl flex-shrink-0">
                  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-yellow-500 mb-1">
                    Limite de monitores atingido
                  </h3>
                  <p className="text-sm text-slate-400 mb-3">
                    Você está usando {monitors.length} de {monitorLimit} monitores no plano {user.subscription?.plan || 'FREE'}. Faça upgrade para adicionar mais.
                  </p>
                  <Link href="/pricing">
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
                      Ver planos
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Monitors Section */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1 tracking-tight">
                    Seus Monitores
                  </h3>
                  <p className="text-sm text-slate-400">
                    Gerencie e acompanhe seus monitores de uptime
                  </p>
                </div>
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  disabled={!canAddMonitor}
                  className="bg-primary hover:bg-primary/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-2xl mb-4">
                    <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Nenhum monitor configurado
                  </h3>
                  <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
                    Comece criando seu primeiro monitor para acompanhar a disponibilidade de seus serviços
                  </p>
                  <Button 
                    onClick={() => setShowCreateModal(true)}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    Criar Primeiro Monitor
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {monitors.map((monitor) => (
                    <MonitorCard
                      key={monitor.id}
                      monitor={monitor}
                      onEdit={setEditingMonitor}
                      onDelete={handleDeleteMonitor}
                      onToggle={handleToggleMonitor}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Create Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Criar Novo Monitor</DialogTitle>
            <DialogDescription className="text-slate-400">
              Configure um novo monitor para acompanhar seu site ou API
            </DialogDescription>
          </DialogHeader>
          <MonitorForm
            onSubmit={handleCreateMonitor}
            onCancel={() => setShowCreateModal(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={!!editingMonitor} onOpenChange={() => setEditingMonitor(undefined)}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Editar Monitor</DialogTitle>
            <DialogDescription className="text-slate-400">
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
    </div>
  );
}