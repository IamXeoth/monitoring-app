'use client';

import { useAuth } from '@/contexts/auth-context';
import { useEffect, useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { MonitorForm } from '@/components/monitor-form';
import { api } from '@/lib/api';
import { Monitor, CreateMonitorInput } from '@/types/monitor';

/* ─── Heartbeat Visualization ─── */
/* ─── Heartbeat Bars ─── */
/* Each bar = a time window. The window spans from monitor creation
   (or max 24h back) to now. Slots without check data are inferred
   from the monitor's current status — if it's UP now and was never
   recorded as DOWN, we assume it was UP (like UptimeRobot does). */

interface HeartbeatSlot {
  startTime: Date;
  endTime: Date;
  status: 'up' | 'down' | 'mixed' | 'pending';
  uptime: number;
  checks: number;
}

function buildHeartbeatSlots(
  monitor: Monitor,
  checks: Array<{ status: string; checkedAt: string }>,
  slotCount = 28
): HeartbeatSlot[] {
  const now = new Date();
  const createdAt = new Date(monitor.createdAt);
  // Window: from creation or max 24h ago, whichever is more recent
  const maxWindow = 24 * 60 * 60 * 1000;
  const windowStart = new Date(Math.max(createdAt.getTime(), now.getTime() - maxWindow));
  const totalMs = now.getTime() - windowStart.getTime();
  const slotMs = totalMs / slotCount;
  const slots: HeartbeatSlot[] = [];

  // Current status used to infer empty slots
  const isCurrentlyUp = monitor.currentStatus === 'UP';
  const isCurrentlyDown = monitor.currentStatus === 'DOWN';

  for (let i = 0; i < slotCount; i++) {
    const startTime = new Date(windowStart.getTime() + i * slotMs);
    const endTime = new Date(startTime.getTime() + slotMs);

    const slotChecks = checks.filter((c) => {
      const t = new Date(c.checkedAt).getTime();
      return t >= startTime.getTime() && t < endTime.getTime();
    });

    if (slotChecks.length === 0) {
      // No data for this slot — infer from current status
      // If monitor is UP now, assume it was UP in gaps (like UptimeRobot)
      // If monitor is DOWN now, only mark recent empty slots as down
      if (!monitor.isActive) {
        slots.push({ startTime, endTime, status: 'pending', uptime: 100, checks: 0 });
      } else if (isCurrentlyUp) {
        slots.push({ startTime, endTime, status: 'up', uptime: 100, checks: 0 });
      } else if (isCurrentlyDown && i >= slotCount - 3) {
        slots.push({ startTime, endTime, status: 'down', uptime: 0, checks: 0 });
      } else {
        slots.push({ startTime, endTime, status: 'up', uptime: 100, checks: 0 });
      }
    } else {
      const upCount = slotChecks.filter((c) => c.status === 'UP').length;
      const uptimePct = (upCount / slotChecks.length) * 100;
      const hasDown = slotChecks.some((c) => c.status === 'DOWN');
      const hasUp = slotChecks.some((c) => c.status === 'UP');

      slots.push({
        startTime,
        endTime,
        status: hasDown && hasUp ? 'mixed' : hasDown ? 'down' : 'up',
        uptime: uptimePct,
        checks: slotChecks.length,
      });
    }
  }
  return slots;
}

/* Fallback: if no checks endpoint available, infer all slots from current status */
function buildFallbackSlots(monitor: Monitor, slotCount = 28): HeartbeatSlot[] {
  const now = new Date();
  const createdAt = new Date(monitor.createdAt);
  const maxWindow = 24 * 60 * 60 * 1000;
  const windowStart = new Date(Math.max(createdAt.getTime(), now.getTime() - maxWindow));
  const totalMs = now.getTime() - windowStart.getTime();
  const slotMs = totalMs / slotCount;
  const slots: HeartbeatSlot[] = [];

  for (let i = 0; i < slotCount; i++) {
    const startTime = new Date(windowStart.getTime() + i * slotMs);
    const endTime = new Date(startTime.getTime() + slotMs);

    if (!monitor.isActive) {
      slots.push({ startTime, endTime, status: 'pending', uptime: 100, checks: 0 });
    } else if (monitor.currentStatus === 'DOWN' && i >= slotCount - 2) {
      slots.push({ startTime, endTime, status: 'down', uptime: 0, checks: 0 });
    } else if (monitor.currentStatus === 'UP' || monitor.currentStatus !== 'UNKNOWN') {
      slots.push({ startTime, endTime, status: 'up', uptime: 100, checks: 0 });
    } else {
      slots.push({ startTime, endTime, status: 'pending', uptime: 100, checks: 0 });
    }
  }
  return slots;
}

function formatSlotRange(start: Date, end: Date): string {
  const datePart = start.toLocaleDateString('pt-BR', {
    month: 'short',
    day: '2-digit',
    year: '2-digit',
  });
  const t1 = start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
  const t2 = end.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${datePart}, ${t1} - ${t2}`;
}

function HeartbeatChart({ slots }: { slots: HeartbeatSlot[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const total = slots.length;

  // Determine if tooltip should flip to left side to avoid overflow
  const isNearRight = hovered !== null && hovered > total * 0.7;
  const isNearLeft = hovered !== null && hovered < total * 0.3;

  return (
    <div ref={containerRef} className="relative flex items-center gap-[2px]">
      {slots.map((slot, i) => {
        const age = i / (total - 1);
        const opacity = 0.4 + age * 0.5;

        return (
          <div
            key={i}
            ref={(el) => { barRefs.current[i] = el; }}
            className="relative"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Bar */}
            <div
              className={`w-[3px] h-[18px] rounded-full cursor-default transition-all duration-150 ${
                slot.status === 'up'
                  ? 'bg-emerald-400 hover:bg-emerald-300 hover:shadow-[0_0_6px_rgba(52,211,153,0.35)]'
                  : slot.status === 'down'
                  ? 'bg-red-400 hover:bg-red-300 hover:shadow-[0_0_6px_rgba(248,113,113,0.35)]'
                  : slot.status === 'mixed'
                  ? 'bg-amber-400 hover:bg-amber-300 hover:shadow-[0_0_6px_rgba(251,191,36,0.35)]'
                  : 'bg-[#1e2128]'
              }`}
              style={{ opacity: slot.status === 'pending' ? 0.3 : opacity }}
            />

            {/* Tooltip */}
            {hovered === i && (
              <div
                className={`absolute bottom-full mb-3 z-[60] pointer-events-none ${
                  isNearRight ? 'right-0' : isNearLeft ? 'left-0' : 'left-1/2 -translate-x-1/2'
                }`}
                style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.55))' }}
              >
                <div className="bg-[#1a1d23] border border-[#2a2e36] rounded-lg px-3.5 py-2.5 whitespace-nowrap">
                  {/* Time range */}
                  <p className="text-[10px] text-[#555b66] font-medium tracking-wide mb-2">
                    {formatSlotRange(slot.startTime, slot.endTime)}
                  </p>

                  {/* Status row */}
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 text-[12px] font-bold ${
                      slot.status === 'up'
                        ? 'text-emerald-400'
                        : slot.status === 'down'
                        ? 'text-red-400'
                        : slot.status === 'mixed'
                        ? 'text-amber-400'
                        : 'text-[#3e424a]'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        slot.status === 'up'
                          ? 'bg-emerald-400'
                          : slot.status === 'down'
                          ? 'bg-red-400'
                          : slot.status === 'mixed'
                          ? 'bg-amber-400'
                          : 'bg-[#3e424a]'
                      }`} />
                      {slot.status === 'up' ? 'Online' : slot.status === 'down' ? 'Offline' : slot.status === 'mixed' ? 'Instável' : 'Sem dados'}
                    </span>

                    {slot.checks > 0 && (
                      <span className="text-[12px] font-bold text-[#e4e4e7] tabular-nums">
                        {slot.uptime.toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <div className={`flex -mt-[1px] ${
                  isNearRight ? 'justify-end pr-3' : isNearLeft ? 'justify-start pl-3' : 'justify-center'
                }`}>
                  <div className="w-[7px] h-[7px] bg-[#1a1d23] border-r border-b border-[#2a2e36] transform rotate-45 -translate-y-[3.5px]" />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Status Tag ─── */
function StatusTag({ status, isActive }: { status?: string; isActive: boolean }) {
  if (!isActive) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#23272e] text-[11px] font-medium text-[#6b7280] tracking-wide uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-[#6b7280]/60" />
        Pausado
      </span>
    );
  }
  if (status === 'DOWN') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-500/10 text-[11px] font-medium text-red-400 tracking-wide uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
        Offline
      </span>
    );
  }
  if (status === 'UP') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/8 text-[11px] font-medium text-emerald-400 tracking-wide uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        Online
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/10 text-[11px] font-medium text-amber-400 tracking-wide uppercase">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
      Verificando
    </span>
  );
}

/* ─── Main Dashboard ─── */
export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMonitor, setEditingMonitor] = useState<Monitor | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [sortBy, setSortBy] = useState<'down-first' | 'name' | 'created'>('down-first');
  const [openMonitorMenu, setOpenMonitorMenu] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; right: number }>({ top: 0, right: 0 });
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [selectedMonitors, setSelectedMonitors] = useState<Set<string>>(new Set());
  const [showBulkMenu, setShowBulkMenu] = useState(false);
  const [bulkMenuPosition, setBulkMenuPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) loadMonitors();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(loadMonitors, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const loadMonitors = async () => {
    try {
      const response = await api.get('/monitors');
      const monitorsData = response.data.data;
      const monitorsWithStatus = await Promise.all(
        monitorsData.map(async (monitor: Monitor) => {
          try {
            const [statusRes, statsRes, checksRes] = await Promise.all([
              api.get(`/monitors/${monitor.id}/status`),
              api.get(`/monitors/${monitor.id}/stats`),
              api.get(`/monitors/${monitor.id}/checks?limit=500`).catch(() => ({ data: { data: [] } })),
            ]);
            return {
              ...monitor,
              currentStatus: statusRes.data.data.status,
              stats: statsRes.data.data,
              recentChecks: checksRes.data.data || [],
            };
          } catch {
            return { ...monitor, currentStatus: 'UNKNOWN', recentChecks: [] };
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

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMonitors();
    setTimeout(() => setRefreshing(false), 600);
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
    if (!confirm('Tem certeza que deseja excluir este monitor?')) return;
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

  const filteredMonitors = useMemo(() => {
    return monitors
      .filter((m) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return m.name.toLowerCase().includes(q) || m.url.toLowerCase().includes(q);
      })
      .sort((a, b) => {
        if (sortBy === 'down-first') {
          if (a.currentStatus === 'DOWN' && b.currentStatus !== 'DOWN') return -1;
          if (b.currentStatus === 'DOWN' && a.currentStatus !== 'DOWN') return 1;
          return 0;
        }
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [monitors, searchQuery, sortBy]);

  // Selection helpers
  const toggleSelect = (id: string) => {
    setSelectedMonitors((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedMonitors.size === filteredMonitors.length) {
      setSelectedMonitors(new Set());
    } else {
      setSelectedMonitors(new Set(filteredMonitors.map((m) => m.id)));
    }
  };

  const clearSelection = () => setSelectedMonitors(new Set());

  // Bulk actions
  const handleBulkPause = async () => {
    const ids = Array.from(selectedMonitors);
    await Promise.all(ids.map((id) => api.patch(`/monitors/${id}/toggle`).catch(() => {})));
    clearSelection();
    loadMonitors();
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Tem certeza que deseja excluir ${selectedMonitors.size} monitor(es)?`)) return;
    const ids = Array.from(selectedMonitors);
    await Promise.all(ids.map((id) => api.delete(`/monitors/${id}`).catch(() => {})));
    clearSelection();
    loadMonitors();
  };

  const handleBulkResetStats = async () => {
    if (!confirm(`Resetar estatísticas de ${selectedMonitors.size} monitor(es)?`)) return;
    const ids = Array.from(selectedMonitors);
    await Promise.all(ids.map((id) => api.post(`/monitors/${id}/reset-stats`).catch(() => {})));
    clearSelection();
    loadMonitors();
  };

  // Computed values
  const upMonitors = monitors.filter((m) => m.currentStatus === 'UP');
  const downMonitors = monitors.filter((m) => m.currentStatus === 'DOWN');
  const pausedMonitors = monitors.filter((m) => !m.isActive);

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
  const overallUptime = monitors.length > 0
    ? ((upMonitors.length / monitors.length) * 100).toFixed(1)
    : '100.0';

  const formatUptime = (createdAt: string) => {
    const diff = Date.now() - new Date(createdAt).getTime();
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    if (d > 0) return `${d}d ${h}h`;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen bg-[#0c0d11]">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 mb-4">
              <div className="w-1.5 h-7 rounded-full bg-emerald-400/60 animate-pulse" />
              <div className="w-1.5 h-7 rounded-full bg-amber-400/60 animate-pulse [animation-delay:150ms]" />
              <div className="w-1.5 h-7 rounded-full bg-red-400/60 animate-pulse [animation-delay:300ms]" />
            </div>
            <p className="text-xs text-[#555b66] font-medium tracking-wide">Carregando</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0c0d11]">
        {/* ─── Page Header ─── */}
        <div className="px-8 pt-8 pb-6">
          <div>
            <p className="text-[11px] font-medium text-[#555b66] uppercase tracking-[0.1em] mb-2">
              Visão geral
            </p>
            <h1 className="text-[22px] font-semibold text-[#e4e4e7] tracking-tight leading-none">
              Dashboard
            </h1>
          </div>
        </div>

        {/* ─── Content Grid ─── */}
        <div className="px-8 pb-8 flex gap-6">
          {/* ── Left: Monitor List ── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar — switches between normal and selection mode */}
            {selectedMonitors.size > 0 ? (
              /* ── Selection Toolbar ── */
              <div className="flex items-center gap-2.5 mb-4 px-1">
                {/* Select all checkbox */}
                <button
                  onClick={toggleSelectAll}
                  className="w-5 h-5 rounded border-2 border-emerald-400 bg-emerald-400/10 flex items-center justify-center flex-shrink-0"
                >
                  {selectedMonitors.size === filteredMonitors.length ? (
                    <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <div className="w-2 h-0.5 bg-emerald-400 rounded-full" />
                  )}
                </button>

                <span className="text-[13px] font-semibold text-[#e4e4e7] tabular-nums">
                  {selectedMonitors.size} <span className="text-[#555b66] font-medium">selecionado{selectedMonitors.size !== 1 ? 's' : ''}</span>
                </span>

                {/* Bulk actions button */}
                <button
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setBulkMenuPosition({ top: rect.bottom + 4, left: rect.left });
                    setShowBulkMenu(!showBulkMenu);
                  }}
                  className="inline-flex items-center gap-1.5 h-8 px-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[12px] font-semibold text-emerald-400 hover:bg-emerald-500/15 transition-colors"
                >
                  Ações em massa
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div className="flex-1" />

                {/* Cancel selection */}
                <button
                  onClick={clearSelection}
                  className="h-8 px-3 rounded-lg text-[12px] font-medium text-[#80838a] hover:text-[#c8c9cd] hover:bg-[#1e2128] transition-colors"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              /* ── Normal Toolbar ── */
              <div className="flex items-center gap-2.5 mb-4">
                {/* New monitor button */}
                <button
                  onClick={() => setShowCreateModal(true)}
                  disabled={!canAddMonitor}
                  className="inline-flex items-center gap-2 h-9 px-4 bg-[#e4e4e7] hover:bg-white text-[#0c0d11] rounded-lg text-[13px] font-semibold transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Novo monitor
                </button>

                {/* Refresh */}
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="h-9 w-9 flex items-center justify-center bg-[#15171c] border border-[#1e2128] rounded-lg text-[#555b66] hover:text-[#c8c9cd] hover:border-[#2a2e36] transition-all disabled:pointer-events-none flex-shrink-0"
                  title="Atualizar dados"
                >
                  <svg className={`w-[15px] h-[15px] transition-transform duration-500 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>

                <div className="flex-1" />

                {/* Search */}
                <div className="relative w-[220px]">
                  <input
                    type="text"
                    placeholder="Buscar monitores…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className={`w-full h-9 bg-[#15171c] border rounded-lg px-3 pl-9 text-[13px] text-[#c8c9cd] placeholder-[#3e424a] focus:outline-none transition-colors ${
                      searchFocused ? 'border-[#3e424a]' : 'border-[#1e2128]'
                    }`}
                  />
                  <svg
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors ${
                      searchFocused ? 'text-[#555b66]' : 'text-[#3e424a]'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Sort */}
                <div className="relative">
                  <button
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="inline-flex items-center gap-1.5 h-9 px-3 bg-[#15171c] border border-[#1e2128] rounded-lg text-[12px] font-medium text-[#80838a] hover:text-[#c8c9cd] hover:border-[#2a2e36] transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                    {sortBy === 'down-first' ? 'Offline primeiro' : sortBy === 'name' ? 'A–Z' : 'Recentes'}
                    <svg className="w-3 h-3 text-[#555b66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showSortDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowSortDropdown(false)} />
                      <div className="absolute right-0 mt-1.5 w-40 bg-[#15171c] border border-[#2a2e36] rounded-lg z-50 overflow-hidden py-1" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                        {[
                          { value: 'down-first', label: 'Offline primeiro' },
                          { value: 'name', label: 'A–Z' },
                          { value: 'created', label: 'Recentes' },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => { setSortBy(opt.value as typeof sortBy); setShowSortDropdown(false); }}
                            className={`w-full text-left px-3 py-2 text-[12px] font-medium transition-colors ${
                              sortBy === opt.value ? 'text-[#e4e4e7] bg-[#1e2128]' : 'text-[#80838a] hover:text-[#c8c9cd] hover:bg-[#1a1d23]'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Counter */}
                <div className="h-9 px-3 bg-[#15171c] border border-[#1e2128] rounded-lg flex items-center">
                  <span className="text-[12px] font-medium text-[#555b66] tabular-nums">
                    <span className="text-[#80838a]">{monitors.length}</span> / {monitorLimit}
                  </span>
                </div>
              </div>
            )}

            {/* Monitor List Container */}
            <div className="rounded-xl border border-[#1e2128]">
              {filteredMonitors.length === 0 && monitors.length === 0 ? (
                /* ── Empty State ── */
                <div className="bg-[#12141a] py-24 px-6 rounded-xl">
                  <div className="max-w-xs mx-auto text-center">
                    {/* TheAlert logo mark as empty state icon */}
                    <div className="inline-flex items-center gap-1 mb-6">
                      <div className="w-1.5 h-10 rounded-full bg-emerald-500/20" />
                      <div className="w-1.5 h-10 rounded-full bg-amber-500/20" />
                      <div className="w-1.5 h-10 rounded-full bg-red-500/20" />
                    </div>
                    <h3 className="text-[15px] font-semibold text-[#e4e4e7] mb-2">
                      Nenhum monitor ainda
                    </h3>
                    <p className="text-[13px] text-[#555b66] leading-relaxed mb-7">
                      Comece a monitorar seus serviços em menos de um minuto. Vamos te alertar no momento em que algo der errado.
                    </p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="inline-flex items-center gap-2 h-9 px-5 bg-[#e4e4e7] hover:bg-white text-[#0c0d11] rounded-lg text-[13px] font-semibold transition-all"
                    >
                      Crie seu primeiro monitor
                    </button>
                  </div>
                </div>
              ) : filteredMonitors.length === 0 ? (
                /* ── No search results ── */
                <div className="bg-[#12141a] py-16 px-6 text-center rounded-xl">
                  <p className="text-[13px] text-[#555b66]">Nenhum monitor encontrado para "{searchQuery}"</p>
                </div>
              ) : (
                /* ── Monitor Rows ── */
                <div>
                  {filteredMonitors.map((monitor, idx) => {
                    const uptime = monitor.stats?.uptime ? parseFloat(monitor.stats.uptime) : 0;
                    const heartbeatSlots = (monitor as any).recentChecks?.length > 0
                      ? buildHeartbeatSlots(monitor, (monitor as any).recentChecks)
                      : buildFallbackSlots(monitor);
                    const avgResponse = monitor.stats?.avgResponseTime || 0;
                    const isFirst = idx === 0;
                    const isLast = idx === filteredMonitors.length - 1;

                    return (
                      <div
                        key={monitor.id}
                        className={`group relative flex items-center gap-5 px-5 py-[14px] transition-colors duration-100 hover:bg-[#15171c] ${
                          !isLast ? 'border-b border-[#1e2128]/70' : ''
                        } ${isFirst ? 'rounded-t-xl' : ''} ${isLast ? 'rounded-b-xl' : ''} ${
                          monitor.currentStatus === 'DOWN' ? 'bg-red-500/[0.02]' : 'bg-[#12141a]'
                        }`}
                      >
                        {/* Left edge accent for DOWN monitors */}
                        {monitor.currentStatus === 'DOWN' && (
                          <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full bg-red-400/70" />
                        )}

                        {/* Checkbox */}
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleSelect(monitor.id); }}
                          className={`w-[18px] h-[18px] rounded border-[1.5px] flex items-center justify-center flex-shrink-0 transition-all duration-100 ${
                            selectedMonitors.has(monitor.id)
                              ? 'border-emerald-400 bg-emerald-400/15'
                              : 'border-[#2a2e36] hover:border-[#3e424a] bg-transparent'
                          }`}
                        >
                          {selectedMonitors.has(monitor.id) && (
                            <svg className="w-2.5 h-2.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>

                        {/* Monitor info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2.5 mb-1">
                            <span className="text-[14px] font-semibold text-[#e4e4e7] truncate leading-tight">
                              {monitor.name}
                            </span>
                            <StatusTag status={monitor.currentStatus} isActive={monitor.isActive} />
                          </div>
                          <div className="flex items-center gap-1.5 text-[12px] text-[#555b66]">
                            <span className="text-[11px] font-semibold text-[#3e424a] uppercase tracking-wider">
                              {monitor.checkType}
                            </span>
                            <span className="text-[#2a2e36]">·</span>
                            <span className="truncate max-w-[200px]">{monitor.url}</span>
                          </div>
                        </div>

                        {/* Meta info */}
                        <div className="hidden xl:flex items-center gap-6 flex-shrink-0">
                          {/* Uptime duration */}
                          <div className="text-right w-[64px]">
                            <div className="text-[12px] font-medium text-[#80838a] tabular-nums">
                              {formatUptime(monitor.createdAt)}
                            </div>
                            <div className="text-[10px] text-[#3e424a] font-medium mt-0.5">ativo</div>
                          </div>

                          {/* Response time */}
                          <div className="text-right w-[56px]">
                            <div className="text-[12px] font-medium text-[#80838a] tabular-nums">
                              {avgResponse > 0 ? `${avgResponse}ms` : '—'}
                            </div>
                            <div className="text-[10px] text-[#3e424a] font-medium mt-0.5">resp.</div>
                          </div>

                          {/* Interval */}
                          <div className="text-right w-[44px]">
                            <div className="text-[12px] font-medium text-[#80838a] tabular-nums">
                              {monitor.interval < 60 ? `${monitor.interval}s` : `${Math.floor(monitor.interval / 60)}m`}
                            </div>
                            <div className="text-[10px] text-[#3e424a] font-medium mt-0.5">interv.</div>
                          </div>
                        </div>

                        {/* Heartbeat chart */}
                        <div className="flex-shrink-0 hidden md:block w-[118px]">
                          <HeartbeatChart slots={heartbeatSlots} />
                        </div>

                        {/* Uptime % */}
                        <div className="flex-shrink-0 w-[52px] text-right">
                          <span className={`text-[14px] font-bold tabular-nums ${
                            uptime >= 98
                              ? 'text-emerald-400'
                              : uptime >= 80
                              ? 'text-amber-400'
                              : 'text-red-400'
                          }`}>
                            {uptime > 0 ? `${uptime.toFixed(0)}%` : '—'}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex-shrink-0">
                          <button
                            onClick={(e) => {
                              if (openMonitorMenu === monitor.id) {
                                setOpenMonitorMenu(null);
                              } else {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setMenuPosition({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
                                setOpenMonitorMenu(monitor.id);
                              }
                            }}
                            className="w-8 h-8 rounded-md flex items-center justify-center text-[#3e424a] hover:text-[#80838a] hover:bg-[#1e2128] transition-all duration-150"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                              <circle cx="8" cy="3" r="1.5" />
                              <circle cx="8" cy="8" r="1.5" />
                              <circle cx="8" cy="13" r="1.5" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ─── Visão geral de todos os monitores ─── */}
            <div className="mt-5 space-y-4">

              {/* ── Response Time — Big Chart ── */}
              <div className="rounded-xl border border-[#1e2128] bg-[#12141a] p-5">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-[13px] font-semibold text-[#c8c9cd]">Tempo de resposta</p>
                    <p className="text-[11px] text-[#3e424a] mt-0.5">Média de todos os monitores — últimas 24h</p>
                  </div>
                  {(() => {
                    const allChecks = monitors.flatMap((m) => m.recentChecks || []);
                    const validChecks = allChecks.filter((c: any) => c.responseTime > 0);
                    if (validChecks.length === 0) return null;
                    const avg = Math.round(validChecks.reduce((s: number, c: any) => s + c.responseTime, 0) / validChecks.length);
                    const min = Math.round(Math.min(...validChecks.map((c: any) => c.responseTime)));
                    const max = Math.round(Math.max(...validChecks.map((c: any) => c.responseTime)));
                    return (
                      <div className="flex items-center gap-5">
                        <div className="text-right">
                          <p className="text-[10px] text-[#3e424a] font-medium">Média</p>
                          <p className="text-[14px] font-bold text-[#e4e4e7] tabular-nums">{avg}ms</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-[#3e424a] font-medium">Mín</p>
                          <p className="text-[14px] font-bold text-emerald-400 tabular-nums">{min}ms</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-[#3e424a] font-medium">Máx</p>
                          <p className="text-[14px] font-bold text-amber-400 tabular-nums">{max}ms</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* SVG Line Chart */}
                <div className="relative h-[160px] w-full">
                  {(() => {
                    const now = Date.now();
                    const h24 = 24 * 60 * 60 * 1000;
                    const bucketCount = 72;
                    const bucketSize = h24 / bucketCount;
                    const buckets: { sum: number; count: number }[] = Array.from({ length: bucketCount }, () => ({ sum: 0, count: 0 }));

                    monitors.forEach((m) => {
                      (m.recentChecks || []).forEach((check: any) => {
                        const t = new Date(check.checkedAt).getTime();
                        const age = now - t;
                        if (age < h24 && age >= 0 && check.responseTime) {
                          const idx = Math.floor((h24 - age) / bucketSize);
                          if (idx >= 0 && idx < bucketCount) {
                            buckets[idx].sum += check.responseTime;
                            buckets[idx].count += 1;
                          }
                        }
                      });
                    });

                    const avgs = buckets.map((b) => (b.count > 0 ? Math.round(b.sum / b.count) : 0));
                    const filledAvgs = avgs.map((v, i) => {
                      if (v > 0) return v;
                      // Fill gaps with nearest value
                      for (let d = 1; d < bucketCount; d++) {
                        if (i - d >= 0 && avgs[i - d] > 0) return avgs[i - d];
                        if (i + d < bucketCount && avgs[i + d] > 0) return avgs[i + d];
                      }
                      return 0;
                    });
                    const maxVal = Math.max(...filledAvgs.filter(Boolean), 1);
                    const minVal = Math.min(...filledAvgs.filter(Boolean), maxVal);
                    // Add 30% padding above and below so line isn't flat
                    const range = maxVal - minVal || maxVal * 0.5;
                    const scaleMin = Math.max(0, minVal - range * 0.3);
                    const scaleMax = maxVal + range * 0.3;
                    const chartH = 160;
                    const chartW = 1000;
                    const padY = 12;

                    if (filledAvgs.every((v) => v === 0)) {
                      return (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-[12px] text-[#2e323a] font-medium">Sem dados de resposta ainda</p>
                        </div>
                      );
                    }

                    const points = filledAvgs.map((v, i) => {
                      const x = (i / (bucketCount - 1)) * chartW;
                      const normalized = (v - scaleMin) / (scaleMax - scaleMin);
                      const y = padY + (1 - normalized) * (chartH - padY * 2);
                      return { x, y, val: v, original: avgs[i] };
                    });

                    // Smooth line
                    const linePath = points.reduce((path, p, i) => {
                      if (i === 0) return `M ${p.x} ${p.y}`;
                      const prev = points[i - 1];
                      const cpx = (prev.x + p.x) / 2;
                      return `${path} C ${cpx} ${prev.y}, ${cpx} ${p.y}, ${p.x} ${p.y}`;
                    }, '');

                    // Gradient fill area
                    const areaPath = `${linePath} L ${chartW} ${chartH} L 0 ${chartH} Z`;

                    // Y-axis labels
                    const yLabels = [Math.round(scaleMax), Math.round((scaleMax + scaleMin) / 2), Math.round(scaleMin)];

                    return (
                      <>
                        {/* Y-axis labels */}
                        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between pointer-events-none" style={{ paddingTop: padY, paddingBottom: padY }}>
                          {yLabels.map((v, i) => (
                            <span key={i} className="text-[9px] text-[#2e323a] font-medium tabular-nums leading-none">
                              {v >= 1000 ? `${(v / 1000).toFixed(1)}s` : `${v}ms`}
                            </span>
                          ))}
                        </div>
                        {/* Grid lines */}
                        <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="none">
                          {[0, 0.5, 1].map((pct, i) => (
                            <line key={i} x1="0" x2={chartW} y1={padY + pct * (chartH - padY * 2)} y2={padY + pct * (chartH - padY * 2)} stroke="#1e2128" strokeWidth="1" />
                          ))}
                        </svg>
                        {/* Chart */}
                        <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="respGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#34d399" stopOpacity="0.15" />
                              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <path d={areaPath} fill="url(#respGrad)" />
                          <path d={linePath} fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                        </svg>
                        {/* Hover columns */}
                        <div className="absolute inset-0 flex">
                          {points.map((p, i) => (
                            <div key={i} className="flex-1 relative group cursor-crosshair">
                              {p.val > 0 && (
                                <>
                                  {/* Vertical line */}
                                  <div className="absolute top-0 bottom-0 left-1/2 w-px bg-[#e4e4e7]/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                  {/* Dot on line */}
                                  <div
                                    className="absolute left-1/2 -translate-x-1/2 w-[6px] h-[6px] rounded-full bg-emerald-400 border border-[#12141a] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                                    style={{ top: `${p.y}px` }}
                                  />
                                  {/* Tooltip */}
                                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block z-10 pointer-events-none">
                                    <div className="bg-[#1a1d23] border border-[#2a2e36] rounded-md px-2.5 py-1.5 whitespace-nowrap" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>
                                      <p className="text-[11px] font-bold text-[#e4e4e7] tabular-nums">{p.val}ms</p>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </div>
                {/* X-axis labels */}
                <div className="flex justify-between mt-2 pl-7">
                  <span className="text-[10px] text-[#2e323a] font-medium">24h atrás</span>
                  <span className="text-[10px] text-[#2e323a] font-medium">18h</span>
                  <span className="text-[10px] text-[#2e323a] font-medium">12h</span>
                  <span className="text-[10px] text-[#2e323a] font-medium">6h</span>
                  <span className="text-[10px] text-[#2e323a] font-medium">Agora</span>
                </div>
              </div>

              {/* ── Two smaller cards ── */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

                {/* Activity Timeline */}
                <div className="rounded-xl border border-[#1e2128] bg-[#12141a] p-5">
                  <p className="text-[13px] font-semibold text-[#c8c9cd] mb-1">Atividade recente</p>
                  <p className="text-[11px] text-[#3e424a] mb-4">Eventos de todos os monitores</p>
                  <div className="space-y-0">
                    {(() => {
                      type ActivityEvent = { time: Date; type: 'down' | 'up' | 'created'; monitor: string; detail?: string };
                      const events: ActivityEvent[] = [];

                      monitors.forEach((m) => {
                        events.push({ time: new Date(m.createdAt), type: 'created', monitor: m.name });
                        const checks = [...(m.recentChecks || [])].sort(
                          (a: any, b: any) => new Date(a.checkedAt).getTime() - new Date(b.checkedAt).getTime()
                        );
                        let prevStatus: string | null = null;
                        checks.forEach((check: any) => {
                          if (prevStatus && check.status !== prevStatus) {
                            if (check.status === 'DOWN') {
                              events.push({ time: new Date(check.checkedAt), type: 'down', monitor: m.name, detail: `${check.statusCode || 'Timeout'}` });
                            } else if (check.status === 'UP' && prevStatus === 'DOWN') {
                              events.push({ time: new Date(check.checkedAt), type: 'up', monitor: m.name });
                            }
                          }
                          prevStatus = check.status;
                        });
                      });

                      events.sort((a, b) => b.time.getTime() - a.time.getTime());
                      const display = events.slice(0, 5);

                      if (display.length === 0) {
                        return (
                          <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/[0.06] flex items-center justify-center mb-2.5">
                              <svg className="w-4 h-4 text-emerald-400/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <p className="text-[12px] text-[#3e424a] font-medium">Nenhum evento recente</p>
                          </div>
                        );
                      }

                      const formatTimeAgo = (date: Date) => {
                        const diff = Date.now() - date.getTime();
                        const mins = Math.floor(diff / 60000);
                        if (mins < 1) return 'agora';
                        if (mins < 60) return `${mins}min`;
                        const hours = Math.floor(mins / 60);
                        if (hours < 24) return `${hours}h`;
                        return `${Math.floor(hours / 24)}d`;
                      };

                      return display.map((evt, i) => (
                        <div key={i} className="flex items-start gap-3 py-2 relative">
                          {i < display.length - 1 && (
                            <div className="absolute left-[7px] top-[20px] bottom-0 w-px bg-[#1e2128]" />
                          )}
                          <div className={`w-[15px] h-[15px] rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center ${
                            evt.type === 'down' ? 'bg-red-500/15' : evt.type === 'up' ? 'bg-emerald-500/15' : 'bg-[#1e2128]'
                          }`}>
                            <div className={`w-[7px] h-[7px] rounded-full ${
                              evt.type === 'down' ? 'bg-red-400' : evt.type === 'up' ? 'bg-emerald-400' : 'bg-[#3e424a]'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] text-[#c8c9cd] font-medium leading-tight truncate">
                              {evt.monitor}
                              {evt.type === 'down' && <span className="text-red-400 ml-1.5">offline</span>}
                              {evt.type === 'up' && <span className="text-emerald-400 ml-1.5">recuperado</span>}
                              {evt.type === 'created' && <span className="text-[#555b66] ml-1.5">criado</span>}
                            </p>
                            {evt.detail && evt.type === 'down' && (
                              <p className="text-[10px] text-[#3e424a] mt-0.5 font-mono">{evt.detail}</p>
                            )}
                          </div>
                          <span className="text-[10px] text-[#3e424a] font-medium flex-shrink-0 mt-0.5 tabular-nums">
                            {formatTimeAgo(evt.time)}
                          </span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                {/* Uptime per Monitor (mini bars) */}
                <div className="rounded-xl border border-[#1e2128] bg-[#12141a] p-5">
                  <p className="text-[13px] font-semibold text-[#c8c9cd] mb-1">Disponibilidade por monitor</p>
                  <p className="text-[11px] text-[#3e424a] mb-4">Uptime individual — últimas 24h</p>
                  <div className="space-y-3.5">
                    {monitors.map((m) => {
                      const uptime = m.stats?.uptime ? parseFloat(m.stats.uptime) : 100;
                      const barColor = uptime >= 99 ? 'bg-emerald-400' : uptime >= 95 ? 'bg-amber-400' : 'bg-red-400';
                      const textColor = uptime >= 99 ? 'text-emerald-400' : uptime >= 95 ? 'text-amber-400' : 'text-red-400';
                      return (
                        <div key={m.id}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[12px] text-[#80838a] font-medium truncate pr-3">{m.name}</span>
                            <span className={`text-[12px] font-bold tabular-nums ${textColor}`}>{uptime.toFixed(1)}%</span>
                          </div>
                          <div className="w-full h-[5px] bg-[#1e2128] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                              style={{ width: `${Math.min(uptime, 100)}%`, opacity: 0.7 }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    {monitors.length === 0 && (
                      <p className="text-[12px] text-[#2e323a] font-medium text-center py-6">Nenhum monitor</p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
          {/* ── Right: Summary Panel ── */}
          <div className="w-[240px] flex-shrink-0 hidden lg:flex flex-col gap-4">

            {/* Health Score */}
            <div className="rounded-xl border border-[#1e2128] bg-[#12141a] p-5">
              <p className="text-[11px] font-semibold text-[#3e424a] uppercase tracking-[0.08em] mb-4">
                Saúde do sistema
              </p>

              {/* Circular-ish health display */}
              <div className="flex items-center justify-center mb-5">
                <div className="relative w-20 h-20">
                  {/* Background ring */}
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="#1e2128" strokeWidth="5" />
                    <circle
                      cx="40" cy="40" r="34"
                      fill="none"
                      stroke={downMonitors.length > 0 ? '#ef4444' : '#34d399'}
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 34}`}
                      strokeDashoffset={`${2 * Math.PI * 34 * (1 - parseFloat(overallUptime) / 100)}`}
                      className="transition-all duration-700"
                    />
                  </svg>
                  {/* Center text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-[18px] font-bold tabular-nums leading-none ${
                      downMonitors.length > 0 ? 'text-red-400' : 'text-emerald-400'
                    }`}>
                      {parseFloat(overallUptime).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Status counts */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[12px] text-[#80838a]">
                    <span className="font-semibold text-[#c8c9cd]">{upMonitors.length}</span> on
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-[12px] text-[#80838a]">
                    <span className="font-semibold text-[#c8c9cd]">{downMonitors.length}</span> off
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#555b66]" />
                  <span className="text-[12px] text-[#80838a]">
                    <span className="font-semibold text-[#c8c9cd]">{pausedMonitors.length}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Last 24h */}
            <div className="rounded-xl border border-[#1e2128] bg-[#12141a] p-5">
              <p className="text-[11px] font-semibold text-[#3e424a] uppercase tracking-[0.08em] mb-4">
                Últimas 24 horas
              </p>

              <div className="space-y-3.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-[12px] text-[#555b66]">Disponibilidade</span>
                  <span className={`text-[15px] font-bold tabular-nums ${
                    parseFloat(overallUptime) >= 99 ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {overallUptime}%
                  </span>
                </div>
                <div className="h-px bg-[#1e2128]" />
                <div className="flex items-baseline justify-between">
                  <span className="text-[12px] text-[#555b66]">Incidentes</span>
                  <span className="text-[15px] font-bold text-[#e4e4e7] tabular-nums">
                    {downMonitors.length}
                  </span>
                </div>
                <div className="h-px bg-[#1e2128]" />
                <div className="flex items-baseline justify-between">
                  <span className="text-[12px] text-[#555b66]">Resp. média</span>
                  <span className="text-[15px] font-bold text-[#e4e4e7] tabular-nums">
                    {monitors.length > 0
                      ? `${Math.round(monitors.reduce((sum, m) => sum + (m.stats?.avgResponseTime || 0), 0) / monitors.length)}ms`
                      : '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* Uso do plano */}
            <div className="rounded-xl border border-[#1e2128] bg-[#12141a] p-5">
              <p className="text-[11px] font-semibold text-[#3e424a] uppercase tracking-[0.08em] mb-4">
                Seu plano
              </p>
              <div className="space-y-3">
                {/* Monitor usage bar */}
                <div>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-[12px] text-[#555b66]">Monitores</span>
                    <span className="text-[12px] font-semibold text-[#c8c9cd] tabular-nums">
                      {monitors.length} / {monitorLimit}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#1e2128] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        monitors.length / monitorLimit > 0.9 ? 'bg-amber-400' : 'bg-emerald-400/70'
                      }`}
                      style={{ width: `${Math.min((monitors.length / monitorLimit) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Interval info */}
                <div className="flex items-baseline justify-between">
                  <span className="text-[12px] text-[#555b66]">Intervalo mín.</span>
                  <span className="text-[12px] font-semibold text-[#c8c9cd]">
                    {(user?.subscription?.plan || 'FREE') === 'FREE' ? '5 min' : (user?.subscription?.plan || 'FREE') === 'STARTER' ? '3 min' : '30s'}
                  </span>
                </div>

                {/* Alerts info */}
                <div className="flex items-baseline justify-between">
                  <span className="text-[12px] text-[#555b66]">Alertas</span>
                  <span className="text-[12px] font-semibold text-[#c8c9cd]">
                    {(user?.subscription?.plan || 'FREE') === 'FREE' ? 'E-mail' : 'Multi-canal'}
                  </span>
                </div>
              </div>
            </div>

            {/* Upgrade card for FREE */}
            {(user?.subscription?.plan || 'FREE') === 'FREE' && (
              <Link href="/pricing">
                <div className="rounded-xl border border-[#1e2128] bg-gradient-to-b from-[#14161c] to-[#12141a] p-5 hover:border-[#2a2e36] transition-colors cursor-pointer group">
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="flex items-center gap-[3px]">
                      <div className="w-1 h-3.5 rounded-full bg-emerald-400/50" />
                      <div className="w-1 h-3.5 rounded-full bg-amber-400/50" />
                      <div className="w-1 h-3.5 rounded-full bg-red-400/50" />
                    </div>
                    <span className="text-[12px] font-semibold text-[#c8c9cd] group-hover:text-emerald-400 transition-colors">
                      Fazer upgrade
                    </span>
                  </div>
                  <p className="text-[11px] text-[#555b66] leading-relaxed">
                    Desbloqueie mais monitores, checks de 30s e alertas multi-canal.
                  </p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ─── Bulk actions menu ─── */}
      {showBulkMenu && selectedMonitors.size > 0 && (
        <>
          <div className="fixed inset-0 z-[70]" onClick={() => setShowBulkMenu(false)} />
          <div
            className="fixed w-52 bg-[#15171c] border border-[#2a2e36] rounded-lg z-[80] py-1"
            style={{ top: bulkMenuPosition.top, left: bulkMenuPosition.left, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
          >
            <p className="px-3 py-1.5 text-[10px] font-semibold text-[#3e424a] uppercase tracking-wider">
              Ações do monitor
            </p>
            <button
              onClick={() => { handleBulkPause(); setShowBulkMenu(false); }}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-[12px] font-medium text-[#c8c9cd] hover:bg-[#1e2128] transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-[#555b66]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pausar monitores
            </button>
            <button
              onClick={() => { handleBulkPause(); setShowBulkMenu(false); }}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-[12px] font-medium text-[#c8c9cd] hover:bg-[#1e2128] transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-[#555b66]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
              Retomar monitores
            </button>
            <button
              onClick={() => { handleBulkResetStats(); setShowBulkMenu(false); }}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-[12px] font-medium text-[#c8c9cd] hover:bg-[#1e2128] transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-[#555b66]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Resetar estatísticas
            </button>
            <div className="my-1 border-t border-[#1e2128]" />
            <button
              onClick={() => { handleBulkDelete(); setShowBulkMenu(false); }}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-[12px] font-medium text-red-400 hover:bg-red-500/5 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Excluir monitores
            </button>
          </div>
        </>
      )}

      {/* ─── Fixed-position monitor action menu ─── */}
      {openMonitorMenu && (() => {
        const monitor = monitors.find((m) => m.id === openMonitorMenu);
        if (!monitor) return null;
        return (
          <>
            <div className="fixed inset-0 z-[70]" onClick={() => setOpenMonitorMenu(null)} />
            <div
              className="fixed w-48 bg-[#15171c] border border-[#2a2e36] rounded-lg z-[80] py-1"
              style={{ top: menuPosition.top, right: menuPosition.right, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
            >
              {/* Editar */}
              <button
                onClick={() => { setEditingMonitor(monitor); setOpenMonitorMenu(null); }}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-[12px] font-medium text-[#c8c9cd] hover:bg-[#1e2128] transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-[#555b66]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar monitor
              </button>

              {/* Clonar */}
              <button
                onClick={() => {
                  handleCreateMonitor({ name: `${monitor.name} (cópia)`, url: monitor.url, checkType: monitor.checkType, interval: monitor.interval, isActive: true });
                  setOpenMonitorMenu(null);
                }}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-[12px] font-medium text-[#c8c9cd] hover:bg-[#1e2128] transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-[#555b66]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Clonar monitor
              </button>

              {/* Adicionar à status page */}
              <button
                onClick={() => { setOpenMonitorMenu(null); /* TODO: abrir modal de status page */ }}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-[12px] font-medium text-[#c8c9cd] hover:bg-[#1e2128] transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-[#555b66]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Adicionar à status page
              </button>

              {/* Manutenção */}
              <button
                onClick={() => { setOpenMonitorMenu(null); /* TODO: abrir modal de manutenção */ }}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-[12px] font-medium text-[#c8c9cd] hover:bg-[#1e2128] transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-[#555b66]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Manutenção
              </button>

              <div className="my-1 border-t border-[#1e2128]" />

              {/* Pausar / Retomar */}
              <button
                onClick={() => { handleToggleMonitor(monitor.id); setOpenMonitorMenu(null); }}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-[12px] font-medium text-[#c8c9cd] hover:bg-[#1e2128] transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-[#555b66]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  {monitor.isActive ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  )}
                </svg>
                {monitor.isActive ? 'Pausar monitor' : 'Retomar monitor'}
              </button>

              {/* Resetar estatísticas */}
              <button
                onClick={() => {
                  if (confirm('Tem certeza que deseja resetar as estatísticas deste monitor?')) {
                    api.post(`/monitors/${monitor.id}/reset-stats`).catch(() => {});
                    loadMonitors();
                  }
                  setOpenMonitorMenu(null);
                }}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-[12px] font-medium text-[#c8c9cd] hover:bg-[#1e2128] transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-[#555b66]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Resetar estatísticas
              </button>

              <div className="my-1 border-t border-[#1e2128]" />

              {/* Excluir */}
              <button
                onClick={() => { handleDeleteMonitor(monitor.id); setOpenMonitorMenu(null); }}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-[12px] font-medium text-red-400 hover:bg-red-500/5 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Excluir monitor
              </button>
            </div>
          </>
        );
      })()}

      {/* ─── Create Modal ─── */}
      {showCreateModal && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]" onClick={() => setShowCreateModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-[91] p-4">
            <div className="w-full max-w-[440px] bg-[#12141a] border border-[#1e2128] rounded-2xl p-6" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>
              <div className="mb-5">
                <h2 className="text-[17px] font-semibold text-[#e4e4e7]">Criar novo monitor</h2>
                <p className="text-[13px] text-[#555b66] mt-1">Configure um novo monitor para acompanhar seu site ou API</p>
              </div>
              <MonitorForm onSubmit={handleCreateMonitor} onCancel={() => setShowCreateModal(false)} />
            </div>
          </div>
        </>
      )}

      {/* ─── Edit Modal ─── */}
      {!!editingMonitor && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]" onClick={() => setEditingMonitor(undefined)} />
          <div className="fixed inset-0 flex items-center justify-center z-[91] p-4">
            <div className="w-full max-w-[440px] bg-[#12141a] border border-[#1e2128] rounded-2xl p-6" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>
              <div className="mb-5">
                <h2 className="text-[17px] font-semibold text-[#e4e4e7]">Editar monitor</h2>
                <p className="text-[13px] text-[#555b66] mt-1">Atualize as configurações do seu monitor</p>
              </div>
              <MonitorForm monitor={editingMonitor} onSubmit={handleUpdateMonitor} onCancel={() => setEditingMonitor(undefined)} />
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}