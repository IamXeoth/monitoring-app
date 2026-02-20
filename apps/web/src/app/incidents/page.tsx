'use client';

import { useAuth } from '@/contexts/auth-context';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { api } from '@/lib/api';

interface Incident {
  id: string;
  monitorId: string;
  monitorName?: string;
  monitorUrl?: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description?: string;
  startedAt: string;
  resolvedAt?: string;
  isResolved: boolean;
}

type FilterStatus = 'all' | 'active' | 'resolved';
type FilterSeverity = 'all' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export default function IncidentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [monitors, setMonitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterSeverity, setFilterSeverity] = useState<FilterSeverity>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const monitorsRes = await api.get('/monitors');
      const monitorsData = monitorsRes.data.data || [];
      setMonitors(monitorsData);

      // Fetch incidents for each monitor
      const allIncidents: Incident[] = [];
      await Promise.all(
        monitorsData.map(async (m: any) => {
          try {
            const res = await api.get(`/monitors/${m.id}/incidents`);
            const data = res.data.data || [];
            data.forEach((inc: any) => {
              allIncidents.push({
                ...inc,
                monitorName: m.name,
                monitorUrl: m.url,
              });
            });
          } catch {}
        })
      );

      // Sort newest first
      allIncidents.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
      setIncidents(allIncidents);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Filter
  const filtered = incidents.filter((inc) => {
    if (filterStatus === 'active' && inc.isResolved) return false;
    if (filterStatus === 'resolved' && !inc.isResolved) return false;
    if (filterSeverity !== 'all' && inc.severity !== filterSeverity) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        inc.title?.toLowerCase().includes(q) ||
        inc.monitorName?.toLowerCase().includes(q) ||
        inc.monitorUrl?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Stats
  const activeCount = incidents.filter((i) => !i.isResolved).length;
  const resolvedCount = incidents.filter((i) => i.isResolved).length;
  const criticalCount = incidents.filter((i) => !i.isResolved && (i.severity === 'CRITICAL' || i.severity === 'HIGH')).length;
  const avgDuration = (() => {
    const resolved = incidents.filter((i) => i.isResolved && i.resolvedAt);
    if (resolved.length === 0) return 0;
    const totalMs = resolved.reduce((sum, i) => sum + (new Date(i.resolvedAt!).getTime() - new Date(i.startedAt).getTime()), 0);
    return totalMs / resolved.length;
  })();

  const formatDuration = (ms: number) => {
    if (ms === 0) return '—';
    const secs = Math.floor(ms / 1000);
    if (secs < 60) return `${secs}s`;
    const mins = Math.floor(secs / 60);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ${mins % 60}m`;
    return `${Math.floor(hrs / 24)}d ${hrs % 24}h`;
  };

  const formatTimeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'agora';
    if (mins < 60) return `${mins}min atrás`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h atrás`;
    const days = Math.floor(hrs / 24);
    return `${days}d atrás`;
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const severityConfig = {
    CRITICAL: { label: 'Crítico', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/15', dot: 'bg-red-400' },
    HIGH: { label: 'Alto', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/15', dot: 'bg-orange-400' },
    MEDIUM: { label: 'Médio', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/15', dot: 'bg-amber-400' },
    LOW: { label: 'Baixo', color: 'text-[#80838a]', bg: 'bg-[#1e2128]', border: 'border-[#2a2e36]', dot: 'bg-[#555b66]' },
  };

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
        <div className="px-8 pt-8 pb-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4">
            <Link href="/dashboard" className="text-[11px] text-[#3e424a] hover:text-[#80838a] font-medium transition-colors">
              Dashboard
            </Link>
            <svg className="w-3 h-3 text-[#2e323a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-[11px] text-[#80838a] font-medium">Incidentes</span>
          </div>

          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[22px] font-semibold text-[#e4e4e7] tracking-tight">Incidentes</h1>
              <p className="text-[13px] text-[#3e424a] mt-1">Histórico de quedas e problemas em seus monitores</p>
            </div>
          </div>
        </div>

        <div className="px-8 pb-8">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              {
                label: 'Ativos',
                value: activeCount,
                color: activeCount > 0 ? 'text-red-400' : 'text-emerald-400',
                icon: (
                  <svg className={`w-4 h-4 ${activeCount > 0 ? 'text-red-400/40' : 'text-emerald-400/40'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                ),
              },
              {
                label: 'Resolvidos',
                value: resolvedCount,
                color: 'text-[#e4e4e7]',
                icon: (
                  <svg className="w-4 h-4 text-emerald-400/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ),
              },
              {
                label: 'Críticos',
                value: criticalCount,
                color: criticalCount > 0 ? 'text-orange-400' : 'text-[#e4e4e7]',
                icon: (
                  <svg className={`w-4 h-4 ${criticalCount > 0 ? 'text-orange-400/40' : 'text-[#3e424a]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                ),
              },
              {
                label: 'Tempo médio',
                value: formatDuration(avgDuration),
                color: 'text-[#e4e4e7]',
                icon: (
                  <svg className="w-4 h-4 text-[#3e424a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-[#1e2128] bg-[#12141a] p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] text-[#3e424a] font-semibold uppercase tracking-[0.08em]">{s.label}</p>
                  {s.icon}
                </div>
                <p className={`text-[20px] font-bold tabular-nums ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 mb-5">
            {/* Status tabs */}
            <div className="flex items-center bg-[#12141a] border border-[#1e2128] rounded-lg p-0.5">
              {(['all', 'active', 'resolved'] as FilterStatus[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterStatus(f)}
                  className={`px-3.5 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                    filterStatus === f
                      ? 'bg-white/[0.07] text-[#e4e4e7]'
                      : 'text-[#555b66] hover:text-[#80838a]'
                  }`}
                >
                  {f === 'all' ? 'Todos' : f === 'active' ? 'Ativos' : 'Resolvidos'}
                  {f === 'active' && activeCount > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-red-500/15 text-[9px] font-bold text-red-400 tabular-nums">
                      {activeCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Severity filter */}
            <div className="relative">
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value as FilterSeverity)}
                className="h-8 bg-[#12141a] border border-[#1e2128] rounded-lg pl-3 pr-8 text-[12px] text-[#80838a] appearance-none cursor-pointer focus:outline-none focus:border-[#3e424a] transition-colors"
              >
                <option value="all">Todas severidades</option>
                <option value="CRITICAL">Crítico</option>
                <option value="HIGH">Alto</option>
                <option value="MEDIUM">Médio</option>
                <option value="LOW">Baixo</option>
              </select>
              <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#3e424a] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Search */}
            <div className="relative ml-auto">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#3e424a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar incidentes…"
                className="h-8 w-[200px] bg-[#12141a] border border-[#1e2128] rounded-lg pl-9 pr-3 text-[12px] text-[#c8c9cd] placeholder-[#3e424a] focus:outline-none focus:border-[#3e424a] transition-colors"
              />
            </div>
          </div>

          {/* Incidents list */}
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-[#1e2128] bg-[#12141a] py-20 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/[0.06] flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-emerald-400/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-[14px] font-semibold text-[#555b66] mb-1">
                {incidents.length === 0 ? 'Nenhum incidente registrado' : 'Nenhum incidente encontrado'}
              </p>
              <p className="text-[12px] text-[#3e424a]">
                {incidents.length === 0
                  ? 'Seus monitores estão funcionando perfeitamente'
                  : 'Tente ajustar os filtros de busca'}
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-[#1e2128] bg-[#12141a] overflow-hidden">
              {filtered.map((inc, idx) => {
                const sev = severityConfig[inc.severity] || severityConfig.MEDIUM;
                const duration = inc.resolvedAt
                  ? new Date(inc.resolvedAt).getTime() - new Date(inc.startedAt).getTime()
                  : Date.now() - new Date(inc.startedAt).getTime();
                const isLast = idx === filtered.length - 1;

                return (
                  <div
                    key={inc.id}
                    onClick={() => router.push(`/monitors/${inc.monitorId}`)}
                    className={`group flex items-start gap-4 px-5 py-4 hover:bg-[#15171c] transition-colors cursor-pointer ${
                      !isLast ? 'border-b border-[#1e2128]/70' : ''
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className="flex flex-col items-center pt-1">
                      <div className={`w-3 h-3 rounded-full border-2 ${
                        inc.isResolved
                          ? 'border-emerald-400/40 bg-emerald-400/10'
                          : 'border-red-400 bg-red-400/20 animate-pulse'
                      }`} />
                      {!isLast && <div className="w-px flex-1 bg-[#1e2128] mt-1" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1">
                        <p className="text-[13px] font-semibold text-[#e4e4e7] truncate">
                          {inc.title || (inc.isResolved ? 'Monitor recuperado' : 'Monitor offline')}
                        </p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold ${sev.bg} ${sev.color} border ${sev.border}`}>
                          <span className={`w-1 h-1 rounded-full ${sev.dot}`} />
                          {sev.label}
                        </span>
                        {!inc.isResolved && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold bg-red-500/10 text-red-400 border border-red-500/15">
                            Ativo
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#3e424a]">
                        <span className="font-medium text-[#555b66]">{inc.monitorName || '—'}</span>
                        <span>·</span>
                        <span className="font-mono truncate">{inc.monitorUrl || '—'}</span>
                      </div>
                      {inc.description && (
                        <p className="text-[11px] text-[#3e424a] mt-1.5 line-clamp-1">{inc.description}</p>
                      )}
                    </div>

                    {/* Right side - timing */}
                    <div className="flex-shrink-0 text-right">
                      <p className="text-[11px] text-[#555b66] font-medium">{formatTimeAgo(inc.startedAt)}</p>
                      <p className="text-[10px] text-[#3e424a] mt-0.5">
                        {formatDate(inc.startedAt)}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2 justify-end">
                        <svg className="w-3 h-3 text-[#2e323a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className={`text-[10px] font-bold tabular-nums ${inc.isResolved ? 'text-[#555b66]' : 'text-red-400'}`}>
                          {formatDuration(duration)}
                        </span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <svg className="w-4 h-4 text-[#2e323a] group-hover:text-[#555b66] transition-colors flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer info */}
          {filtered.length > 0 && (
            <p className="text-[10px] text-[#2e323a] mt-3 text-center">
              Mostrando {filtered.length} de {incidents.length} incidente{incidents.length !== 1 ? 's' : ''} · Clique para ver detalhes do monitor
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}