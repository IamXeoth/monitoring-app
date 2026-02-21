'use client';

import { useAuth } from '@/contexts/auth-context';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { api } from '@/lib/api';

type Tab = 'all' | 'config';
type FilterType = 'all' | 'down' | 'up' | 'maintenance';

interface Notification {
  id: string;
  type: 'down' | 'up' | 'maintenance' | 'info';
  title: string;
  message: string;
  monitorId: string;
  monitorName: string;
  monitorUrl: string;
  read: boolean;
  createdAt: string;
}

interface MonitorAlertConfig {
  monitorId: string;
  monitorName: string;
  monitorUrl: string;
  emailEnabled: boolean;
  webhookEnabled: boolean;
  slackEnabled: boolean;
  discordEnabled: boolean;
  telegramEnabled: boolean;
  notifyAfterMinutes: number;
  repeatIntervalMinutes: number;
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [monitors, setMonitors] = useState<any[]>([]);
  const [alertConfigs, setAlertConfigs] = useState<MonitorAlertConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const monitorsRes = await api.get('/monitors').catch(() => ({ data: { data: [] } }));
      const monitorsList = monitorsRes.data.data || [];
      setMonitors(monitorsList);

      // TODO: Replace with real API — using generated demo data
      const stored = localStorage.getItem('thealert_notifications');
      if (stored) {
        setNotifications(JSON.parse(stored));
      } else {
        // Generate demo notifications from monitors
        const demo = generateDemoNotifications(monitorsList);
        setNotifications(demo);
        localStorage.setItem('thealert_notifications', JSON.stringify(demo));
      }

      // Generate default alert configs for each monitor
      const storedConfigs = localStorage.getItem('thealert_alert_configs');
      if (storedConfigs) {
        setAlertConfigs(JSON.parse(storedConfigs));
      } else {
        const configs = monitorsList.map((m: any) => ({
          monitorId: m.id,
          monitorName: m.name,
          monitorUrl: m.url,
          emailEnabled: true,
          webhookEnabled: false,
          slackEnabled: false,
          discordEnabled: false,
          telegramEnabled: false,
          notifyAfterMinutes: 0,
          repeatIntervalMinutes: 0,
        }));
        setAlertConfigs(configs);
        localStorage.setItem('thealert_alert_configs', JSON.stringify(configs));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const saveConfigs = (updated: MonitorAlertConfig[]) => {
    setAlertConfigs(updated);
    localStorage.setItem('thealert_alert_configs', JSON.stringify(updated));
  };

  const markAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('thealert_notifications', JSON.stringify(updated));
  };

  const clearAll = () => {
    if (!confirm('Limpar todas as notificações?')) return;
    setNotifications([]);
    localStorage.setItem('thealert_notifications', JSON.stringify([]));
  };

  const filteredNotifications = useMemo(() => {
    return notifications
      .filter((n) => filter === 'all' || n.type === filter)
      .filter((n) =>
        !search || n.monitorName.toLowerCase().includes(search.toLowerCase()) || n.title.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [notifications, filter, search]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const stats = useMemo(() => ({
    total: notifications.length,
    unread: unreadCount,
    down: notifications.filter((n) => n.type === 'down').length,
    up: notifications.filter((n) => n.type === 'up').length,
  }), [notifications, unreadCount]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-[#0c0d11] flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0c0d11]">
        <div className="px-8 pt-8 pb-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4">
            <Link href="/dashboard" className="text-[11px] text-[#3e424a] hover:text-[#80838a] font-medium transition-colors">Dashboard</Link>
            <svg className="w-3 h-3 text-[#2e323a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-[11px] text-[#80838a] font-medium">Notificações</span>
          </div>

          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-[22px] font-semibold text-[#e4e4e7] tracking-tight">Notificações</h1>
              <p className="text-[13px] text-[#3e424a] mt-1">Histórico de alertas e configuração de notificações</p>
            </div>
            {notifications.length > 0 && (
              <div className="flex items-center gap-2">
                <button onClick={markAllRead} className="h-8 px-3 rounded-lg text-[11px] font-semibold text-[#80838a] border border-[#1e2128] hover:text-[#c8c9cd] hover:border-[#2a2e36] transition-all">
                  Marcar todas como lidas
                </button>
                <button onClick={clearAll} className="h-8 px-3 rounded-lg text-[11px] font-semibold text-red-400/50 border border-[#1e2128] hover:text-red-400 hover:border-red-500/15 transition-all">
                  Limpar
                </button>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-[#1e2128]">
            {([
              { key: 'all' as Tab, label: 'Todas', count: stats.unread },
              { key: 'config' as Tab, label: 'Configurar alertas', count: 0 },
            ]).map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2.5 text-[13px] font-medium border-b-2 -mb-px transition-all ${
                  tab === t.key
                    ? 'border-[#e4e4e7] text-[#e4e4e7]'
                    : 'border-transparent text-[#555b66] hover:text-[#80838a]'
                }`}
              >
                {t.label}
                {t.count > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-red-500/15 text-[9px] font-bold text-red-400 tabular-nums">
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="px-8 py-6">
          {tab === 'all' ? (
            <NotificationsTab
              notifications={filteredNotifications}
              filter={filter}
              setFilter={setFilter}
              search={search}
              setSearch={setSearch}
              stats={stats}
            />
          ) : (
            <AlertConfigTab
              configs={alertConfigs}
              onSave={saveConfigs}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

// ─── Notifications Tab ───

function NotificationsTab({
  notifications,
  filter,
  setFilter,
  search,
  setSearch,
  stats,
}: {
  notifications: Notification[];
  filter: FilterType;
  setFilter: (f: FilterType) => void;
  search: string;
  setSearch: (s: string) => void;
  stats: { total: number; unread: number; down: number; up: number };
}) {
  const formatDate = (d: string) => {
    const date = new Date(d);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}min atrás`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h atrás`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d atrás`;

    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const groupByDate = (items: Notification[]) => {
    const groups: Record<string, Notification[]> = {};
    items.forEach((n) => {
      const date = new Date(n.createdAt);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

      let key: string;
      if (diffDays === 0) key = 'Hoje';
      else if (diffDays === 1) key = 'Ontem';
      else if (diffDays < 7) key = 'Esta semana';
      else if (diffDays < 30) key = 'Este mês';
      else key = 'Anteriores';

      if (!groups[key]) groups[key] = [];
      groups[key].push(n);
    });
    return groups;
  };

  const grouped = groupByDate(notifications);

  const typeConfig = {
    down: { icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>, color: 'text-red-400', bg: 'bg-red-500/10', dot: 'bg-red-400' },
    up: { icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>, color: 'text-emerald-400', bg: 'bg-emerald-500/10', dot: 'bg-emerald-400' },
    maintenance: { icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63" /></svg>, color: 'text-amber-400', bg: 'bg-amber-500/10', dot: 'bg-amber-400' },
    info: { icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: 'text-blue-400', bg: 'bg-blue-500/10', dot: 'bg-blue-400' },
  };

  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'Todas', count: stats.total },
    { key: 'down', label: 'Quedas', count: stats.down },
    { key: 'up', label: 'Recuperações', count: stats.up },
  ];

  return (
    <div>
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total', value: stats.total, color: 'text-[#e4e4e7]' },
          { label: 'Não lidas', value: stats.unread, color: stats.unread > 0 ? 'text-red-400' : 'text-[#e4e4e7]' },
          { label: 'Quedas', value: stats.down, color: stats.down > 0 ? 'text-red-400' : 'text-[#e4e4e7]' },
          { label: 'Recuperações', value: stats.up, color: 'text-emerald-400' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-[#1e2128] bg-[#12141a] px-4 py-3">
            <p className="text-[9px] text-[#3e424a] font-semibold uppercase tracking-wider">{s.label}</p>
            <p className={`text-[18px] font-bold tabular-nums mt-0.5 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1 bg-[#12141a] border border-[#1e2128] rounded-lg p-0.5">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                filter === f.key ? 'bg-white/[0.07] text-[#e4e4e7]' : 'text-[#555b66] hover:text-[#80838a]'
              }`}
            >
              {f.label}
              <span className="ml-1 text-[9px] tabular-nums opacity-50">{f.count}</span>
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-[260px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#2e323a] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por monitor..."
            className="w-full h-8 bg-[#12141a] border border-[#1e2128] rounded-lg text-[11px] text-[#e4e4e7] placeholder-[#2e323a] pl-9 pr-3 focus:outline-none focus:border-[#3e424a] transition-all"
          />
        </div>
      </div>

      {/* Notification list */}
      {notifications.length === 0 ? (
        <div className="rounded-xl border border-[#1e2128] bg-[#12141a] py-16 text-center">
          <div className="w-11 h-11 rounded-full bg-[#1e2128] flex items-center justify-center mx-auto mb-3">
            <svg className="w-5 h-5 text-[#3e424a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </div>
          <p className="text-[13px] font-semibold text-[#555b66] mb-1">Nenhuma notificação</p>
          <p className="text-[11px] text-[#3e424a]">Alertas de monitores aparecerão aqui</p>
        </div>
      ) : (
        <div className="space-y-5">
          {Object.entries(grouped).map(([label, items]) => (
            <div key={label}>
              <p className="text-[10px] font-semibold text-[#3e424a] uppercase tracking-wider mb-2">{label}</p>
              <div className="rounded-xl border border-[#1e2128] bg-[#12141a] overflow-hidden">
                {items.map((notif, idx) => {
                  const tc = typeConfig[notif.type];
                  return (
                    <div
                      key={notif.id}
                      className={`flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-white/[0.01] ${
                        idx < items.length - 1 ? 'border-b border-[#1e2128]/60' : ''
                      } ${!notif.read ? 'bg-white/[0.015]' : ''}`}
                    >
                      {/* Icon */}
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${tc.bg} ${tc.color}`}>
                        {tc.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-[12px] font-semibold text-[#e4e4e7] truncate">{notif.title}</p>
                          {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />}
                        </div>
                        <p className="text-[11px] text-[#555b66] line-clamp-1">{notif.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Link
                            href={`/monitors/${notif.monitorId}`}
                            className="inline-flex items-center gap-1 text-[10px] font-medium text-[#3e424a] hover:text-[#80838a] transition-colors"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${tc.dot}`} />
                            {notif.monitorName}
                          </Link>
                          <span className="text-[10px] text-[#2e323a]">·</span>
                          <span className="text-[10px] text-[#3e424a] font-mono truncate">{notif.monitorUrl}</span>
                        </div>
                      </div>

                      {/* Time */}
                      <span className="text-[10px] text-[#3e424a] flex-shrink-0 tabular-nums mt-1">
                        {formatDate(notif.createdAt)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Alert Config Tab ───

function AlertConfigTab({
  configs,
  onSave,
}: {
  configs: MonitorAlertConfig[];
  onSave: (configs: MonitorAlertConfig[]) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const channels = [
    { key: 'emailEnabled' as const, label: 'Email', icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, color: 'text-blue-400' },
    { key: 'webhookEnabled' as const, label: 'Webhook', icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>, color: 'text-violet-400' },
    { key: 'slackEnabled' as const, label: 'Slack', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" /></svg>, color: 'text-[#E01E5A]' },
    { key: 'discordEnabled' as const, label: 'Discord', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.12-.098.246-.198.373-.292a.074.074 0 0 1 .078-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.094.246.194.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" /></svg>, color: 'text-[#5865F2]' },
    { key: 'telegramEnabled' as const, label: 'Telegram', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>, color: 'text-[#26A5E4]' },
  ];

  const delayOptions = [
    { value: 0, label: 'Imediatamente' },
    { value: 1, label: 'Após 1 minuto' },
    { value: 3, label: 'Após 3 minutos' },
    { value: 5, label: 'Após 5 minutos' },
    { value: 10, label: 'Após 10 minutos' },
  ];

  const repeatOptions = [
    { value: 0, label: 'Não repetir' },
    { value: 5, label: 'A cada 5 min' },
    { value: 15, label: 'A cada 15 min' },
    { value: 30, label: 'A cada 30 min' },
    { value: 60, label: 'A cada 1 hora' },
  ];

  const toggleChannel = (monitorId: string, channelKey: string) => {
    const updated = configs.map((c) =>
      c.monitorId === monitorId ? { ...c, [channelKey]: !(c as any)[channelKey] } : c
    );
    onSave(updated);
  };

  const updateDelay = (monitorId: string, field: string, value: number) => {
    const updated = configs.map((c) =>
      c.monitorId === monitorId ? { ...c, [field]: value } : c
    );
    onSave(updated);
  };

  return (
    <div>
      <div className="mb-5">
        <h3 className="text-[14px] font-semibold text-[#e4e4e7] mb-1">Regras de alerta por monitor</h3>
        <p className="text-[12px] text-[#3e424a]">Configure quais canais notificar e com que frequência para cada monitor</p>
      </div>

      {configs.length === 0 ? (
        <div className="rounded-xl border border-[#1e2128] bg-[#12141a] py-12 text-center">
          <p className="text-[12px] text-[#3e424a]">Crie monitores para configurar alertas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {configs.map((config) => {
            const isExpanded = editingId === config.monitorId;
            const activeChannels = channels.filter((ch) => (config as any)[ch.key]);

            return (
              <div key={config.monitorId} className={`rounded-xl border bg-[#12141a] transition-all ${
                isExpanded ? 'border-[#2a2e36]' : 'border-[#1e2128]'
              }`}>
                {/* Collapsed header */}
                <button
                  onClick={() => setEditingId(isExpanded ? null : config.monitorId)}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#e4e4e7] truncate">{config.monitorName}</p>
                    <p className="text-[10px] text-[#3e424a] font-mono truncate">{config.monitorUrl}</p>
                  </div>

                  {/* Active channels preview */}
                  <div className="flex items-center gap-1.5 mr-2">
                    {activeChannels.length > 0 ? activeChannels.map((ch) => (
                      <div key={ch.key} className={`w-6 h-6 rounded flex items-center justify-center ${ch.color} bg-white/[0.04]`} title={ch.label}>
                        {ch.icon}
                      </div>
                    )) : (
                      <span className="text-[10px] text-[#3e424a]">Sem alertas</span>
                    )}
                  </div>

                  <svg className={`w-4 h-4 text-[#3e424a] transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Expanded config */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-0 border-t border-[#1e2128]">
                    {/* Channels */}
                    <p className="text-[10px] font-semibold text-[#555b66] uppercase tracking-wider mt-4 mb-3">Canais de notificação</p>
                    <div className="grid grid-cols-5 gap-2 mb-5">
                      {channels.map((ch) => {
                        const enabled = (config as any)[ch.key];
                        return (
                          <button
                            key={ch.key}
                            onClick={() => toggleChannel(config.monitorId, ch.key)}
                            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                              enabled
                                ? `${ch.color} bg-white/[0.03] border-current border-opacity-20`
                                : 'text-[#3e424a] border-[#1e2128] hover:border-[#2a2e36] hover:text-[#555b66]'
                            }`}
                          >
                            {ch.icon}
                            <span className="text-[9px] font-semibold">{ch.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Timing */}
                    <p className="text-[10px] font-semibold text-[#555b66] uppercase tracking-wider mb-3">Timing</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-[#3e424a] font-medium mb-1.5">Notificar após</label>
                        <select
                          value={config.notifyAfterMinutes}
                          onChange={(e) => updateDelay(config.monitorId, 'notifyAfterMinutes', Number(e.target.value))}
                          className="w-full h-9 bg-[#0a0b0f] border border-[#1e2128] rounded-lg text-[11px] text-[#e4e4e7] px-3 appearance-none cursor-pointer focus:outline-none focus:border-[#3e424a] transition-all"
                        >
                          {delayOptions.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                        <p className="text-[9px] text-[#2e323a] mt-1">Espera antes de disparar o alerta</p>
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#3e424a] font-medium mb-1.5">Repetir alerta</label>
                        <select
                          value={config.repeatIntervalMinutes}
                          onChange={(e) => updateDelay(config.monitorId, 'repeatIntervalMinutes', Number(e.target.value))}
                          className="w-full h-9 bg-[#0a0b0f] border border-[#1e2128] rounded-lg text-[11px] text-[#e4e4e7] px-3 appearance-none cursor-pointer focus:outline-none focus:border-[#3e424a] transition-all"
                        >
                          {repeatOptions.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                        <p className="text-[9px] text-[#2e323a] mt-1">Enquanto o monitor estiver fora</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Demo Data Generator ───

function generateDemoNotifications(monitors: any[]): Notification[] {
  if (monitors.length === 0) return [];

  const now = Date.now();
  const notifs: Notification[] = [];

  monitors.forEach((m) => {
    // Down notification
    notifs.push({
      id: `notif-${m.id}-down-1`,
      type: 'down',
      title: `${m.name} está fora do ar`,
      message: `O monitor ${m.name} não está respondendo. Última verificação retornou timeout após 30s.`,
      monitorId: m.id,
      monitorName: m.name,
      monitorUrl: m.url,
      read: false,
      createdAt: new Date(now - 1000 * 60 * 15).toISOString(),
    });

    // Recovery
    notifs.push({
      id: `notif-${m.id}-up-1`,
      type: 'up',
      title: `${m.name} voltou ao normal`,
      message: `O monitor ${m.name} está respondendo novamente. Tempo de resposta: 245ms. Duração da queda: 12 minutos.`,
      monitorId: m.id,
      monitorName: m.name,
      monitorUrl: m.url,
      read: true,
      createdAt: new Date(now - 1000 * 60 * 3).toISOString(),
    });

    // Older down
    notifs.push({
      id: `notif-${m.id}-down-2`,
      type: 'down',
      title: `${m.name} está fora do ar`,
      message: `O monitor ${m.name} retornou status code 503. Service Unavailable.`,
      monitorId: m.id,
      monitorName: m.name,
      monitorUrl: m.url,
      read: true,
      createdAt: new Date(now - 1000 * 60 * 60 * 26).toISOString(),
    });

    // Older recovery
    notifs.push({
      id: `notif-${m.id}-up-2`,
      type: 'up',
      title: `${m.name} voltou ao normal`,
      message: `O monitor ${m.name} está respondendo novamente. Duração da queda: 4 minutos.`,
      monitorId: m.id,
      monitorName: m.name,
      monitorUrl: m.url,
      read: true,
      createdAt: new Date(now - 1000 * 60 * 60 * 25.5).toISOString(),
    });
  });

  return notifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}