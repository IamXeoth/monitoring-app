'use client';

import { useAuth } from '@/contexts/auth-context';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { api } from '@/lib/api';

// ─── Types ───

interface IncidentUpdate {
  id: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  message: string;
  createdAt: string;
  author?: string;
}

interface Incident {
  id: string;
  monitorId: string;
  monitorName?: string;
  monitorUrl?: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description?: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  startedAt: string;
  resolvedAt?: string;
  isResolved: boolean;
  publishedToStatusPage: boolean;
  statusPageIds: string[];
  updates: IncidentUpdate[];
}

interface StatusPageOption {
  id: string;
  name: string;
  slug: string;
}

type FilterStatus = 'all' | 'active' | 'resolved';
type FilterSeverity = 'all' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

const INCIDENT_STATUSES = [
  { key: 'investigating' as const, label: 'Investigando', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/15', dot: 'bg-red-400' },
  { key: 'identified' as const, label: 'Identificado', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/15', dot: 'bg-amber-400' },
  { key: 'monitoring' as const, label: 'Monitorando', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/15', dot: 'bg-blue-400' },
  { key: 'resolved' as const, label: 'Resolvido', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/15', dot: 'bg-emerald-400' },
];

const severityConfig = {
  CRITICAL: { label: 'Crítico', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/15', dot: 'bg-red-400' },
  HIGH: { label: 'Alto', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/15', dot: 'bg-orange-400' },
  MEDIUM: { label: 'Médio', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/15', dot: 'bg-amber-400' },
  LOW: { label: 'Baixo', color: 'text-[#80838a]', bg: 'bg-[#1e2128]', border: 'border-[#2a2e36]', dot: 'bg-[#555b66]' },
};

// ─── Main Page ───

export default function IncidentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [monitors, setMonitors] = useState<any[]>([]);
  const [statusPages, setStatusPages] = useState<StatusPageOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterSeverity, setFilterSeverity] = useState<FilterSeverity>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const monitorsRes = await api.get('/monitors').catch(() => ({ data: { data: [] } }));
      const monitorsData = monitorsRes.data.data || [];
      setMonitors(monitorsData);

      // Fetch status pages for publish integration
      const pagesRes = await api.get('/status-pages').catch(() => ({ data: { data: [] } }));
      setStatusPages((pagesRes.data.data || []).map((p: any) => ({ id: p.id, name: p.name, slug: p.slug })));

      // Fetch incidents + generate updates from localStorage
      const allIncidents: Incident[] = [];
      await Promise.all(
        monitorsData.map(async (m: any) => {
          try {
            const res = await api.get(`/monitors/${m.id}/incidents`);
            const data = res.data.data || [];
            data.forEach((inc: any) => {
              // Load stored updates & status page publishing from localStorage
              const storedKey = `thealert_incident_${inc.id}`;
              const stored = localStorage.getItem(storedKey);
              const extra = stored ? JSON.parse(stored) : {};

              allIncidents.push({
                ...inc,
                monitorName: m.name,
                monitorUrl: m.url,
                status: extra.status || (inc.isResolved ? 'resolved' : 'investigating'),
                publishedToStatusPage: extra.publishedToStatusPage || false,
                statusPageIds: extra.statusPageIds || [],
                updates: extra.updates || generateDefaultUpdates(inc),
              });
            });
          } catch {}
        })
      );

      allIncidents.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
      setIncidents(allIncidents);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const generateDefaultUpdates = (inc: any): IncidentUpdate[] => {
    const updates: IncidentUpdate[] = [
      {
        id: `${inc.id}-auto-1`,
        status: 'investigating',
        message: 'Monitor detectou indisponibilidade. Investigando a causa.',
        createdAt: inc.startedAt,
        author: 'Sistema',
      },
    ];
    if (inc.isResolved && inc.resolvedAt) {
      updates.push({
        id: `${inc.id}-auto-2`,
        status: 'resolved',
        message: 'Serviço restaurado e operando normalmente.',
        createdAt: inc.resolvedAt,
        author: 'Sistema',
      });
    }
    return updates;
  };

  const saveIncidentExtra = (incident: Incident) => {
    localStorage.setItem(`thealert_incident_${incident.id}`, JSON.stringify({
      status: incident.status,
      publishedToStatusPage: incident.publishedToStatusPage,
      statusPageIds: incident.statusPageIds,
      updates: incident.updates,
    }));
  };

  const handleAddUpdate = (incidentId: string, status: IncidentUpdate['status'], message: string) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id !== incidentId) return inc;
        const newUpdate: IncidentUpdate = {
          id: `upd-${Date.now().toString(36)}`,
          status,
          message,
          createdAt: new Date().toISOString(),
          author: user?.name || 'Operador',
        };
        const isResolved = status === 'resolved';
        const updated = {
          ...inc,
          status,
          isResolved,
          resolvedAt: isResolved ? new Date().toISOString() : inc.resolvedAt,
          updates: [newUpdate, ...inc.updates],
        };
        saveIncidentExtra(updated);
        return updated;
      })
    );
    // Re-select if detail is open
    if (selectedIncident?.id === incidentId) {
      setSelectedIncident((prev) => {
        if (!prev) return prev;
        const newUpdate: IncidentUpdate = {
          id: `upd-${Date.now().toString(36)}`,
          status,
          message,
          createdAt: new Date().toISOString(),
          author: user?.name || 'Operador',
        };
        const isResolved = status === 'resolved';
        return {
          ...prev,
          status,
          isResolved,
          resolvedAt: isResolved ? new Date().toISOString() : prev.resolvedAt,
          updates: [newUpdate, ...prev.updates],
        };
      });
    }
  };

  const handleToggleStatusPage = (incidentId: string, pageId: string) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id !== incidentId) return inc;
        const ids = inc.statusPageIds.includes(pageId)
          ? inc.statusPageIds.filter((id) => id !== pageId)
          : [...inc.statusPageIds, pageId];
        const updated = { ...inc, statusPageIds: ids, publishedToStatusPage: ids.length > 0 };
        saveIncidentExtra(updated);
        return updated;
      })
    );
  };

  // Filter
  const filtered = incidents.filter((inc) => {
    if (filterStatus === 'active' && inc.isResolved) return false;
    if (filterStatus === 'resolved' && !inc.isResolved) return false;
    if (filterSeverity !== 'all' && inc.severity !== filterSeverity) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return inc.title?.toLowerCase().includes(q) || inc.monitorName?.toLowerCase().includes(q) || inc.monitorUrl?.toLowerCase().includes(q);
    }
    return true;
  });

  // Stats
  const activeCount = incidents.filter((i) => !i.isResolved).length;
  const resolvedCount = incidents.filter((i) => i.isResolved).length;
  const criticalCount = incidents.filter((i) => !i.isResolved && (i.severity === 'CRITICAL' || i.severity === 'HIGH')).length;
  const publishedCount = incidents.filter((i) => i.publishedToStatusPage).length;

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
    return `${Math.floor(hrs / 24)}d atrás`;
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

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
          <div className="flex items-center gap-2 mb-4">
            <Link href="/dashboard" className="text-[11px] text-[#3e424a] hover:text-[#80838a] font-medium transition-colors">Dashboard</Link>
            <svg className="w-3 h-3 text-[#2e323a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-[11px] text-[#80838a] font-medium">Incidentes</span>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[22px] font-semibold text-[#e4e4e7] tracking-tight">Incidentes</h1>
              <p className="text-[13px] text-[#3e424a] mt-1">Gerencie incidentes, adicione atualizações e publique na status page</p>
            </div>
          </div>
        </div>

        <div className="px-8 pb-8">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Ativos', value: activeCount, color: activeCount > 0 ? 'text-red-400' : 'text-emerald-400', icon: <svg className="w-4 h-4 text-[#2e323a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01" /></svg> },
              { label: 'Resolvidos', value: resolvedCount, color: 'text-[#80838a]', icon: <svg className="w-4 h-4 text-[#2e323a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
              { label: 'Críticos', value: criticalCount, color: criticalCount > 0 ? 'text-orange-400' : 'text-[#80838a]', icon: <svg className="w-4 h-4 text-[#2e323a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" /></svg> },
              { label: 'Na Status Page', value: publishedCount, color: publishedCount > 0 ? 'text-violet-400' : 'text-[#80838a]', icon: <svg className="w-4 h-4 text-[#2e323a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945" /></svg> },
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
            <div className="flex items-center bg-[#12141a] border border-[#1e2128] rounded-lg p-0.5">
              {(['all', 'active', 'resolved'] as FilterStatus[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterStatus(f)}
                  className={`px-3.5 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                    filterStatus === f ? 'bg-white/[0.07] text-[#e4e4e7]' : 'text-[#555b66] hover:text-[#80838a]'
                  }`}
                >
                  {f === 'all' ? 'Todos' : f === 'active' ? 'Ativos' : 'Resolvidos'}
                  {f === 'active' && activeCount > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-red-500/15 text-[9px] font-bold text-red-400 tabular-nums">{activeCount}</span>
                  )}
                </button>
              ))}
            </div>

            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value as FilterSeverity)}
              className="h-8 bg-[#12141a] border border-[#1e2128] rounded-lg pl-3 pr-8 text-[12px] text-[#80838a] appearance-none cursor-pointer focus:outline-none focus:border-[#3e424a]"
            >
              <option value="all">Todas severidades</option>
              <option value="CRITICAL">Crítico</option>
              <option value="HIGH">Alto</option>
              <option value="MEDIUM">Médio</option>
              <option value="LOW">Baixo</option>
            </select>

            <div className="relative ml-auto">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#3e424a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar incidentes…"
                className="h-8 w-[200px] bg-[#12141a] border border-[#1e2128] rounded-lg pl-9 pr-3 text-[12px] text-[#c8c9cd] placeholder-[#3e424a] focus:outline-none focus:border-[#3e424a]"
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
                {incidents.length === 0 ? 'Seus monitores estão funcionando perfeitamente' : 'Tente ajustar os filtros de busca'}
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-[#1e2128] bg-[#12141a] overflow-hidden">
              {filtered.map((inc, idx) => {
                const sev = severityConfig[inc.severity] || severityConfig.MEDIUM;
                const statusInfo = INCIDENT_STATUSES.find((s) => s.key === inc.status) || INCIDENT_STATUSES[0];
                const duration = inc.resolvedAt
                  ? new Date(inc.resolvedAt).getTime() - new Date(inc.startedAt).getTime()
                  : Date.now() - new Date(inc.startedAt).getTime();
                const isLast = idx === filtered.length - 1;

                return (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncident(inc)}
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
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="text-[13px] font-semibold text-[#e4e4e7] truncate">
                          {inc.title || (inc.isResolved ? 'Monitor recuperado' : 'Monitor offline')}
                        </p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold ${sev.bg} ${sev.color} border ${sev.border}`}>
                          <span className={`w-1 h-1 rounded-full ${sev.dot}`} />
                          {sev.label}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold ${statusInfo.bg} ${statusInfo.color} border ${statusInfo.border}`}>
                          {statusInfo.label}
                        </span>
                        {inc.publishedToStatusPage && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold bg-violet-500/10 text-violet-400 border border-violet-500/15">
                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2" /></svg>
                            Status Page
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#3e424a]">
                        <span className="font-medium text-[#555b66]">{inc.monitorName || '—'}</span>
                        <span>·</span>
                        <span className="font-mono truncate">{inc.monitorUrl || '—'}</span>
                        {inc.updates.length > 1 && (
                          <>
                            <span>·</span>
                            <span className="text-[#555b66]">{inc.updates.length} atualizações</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Right side */}
                    <div className="flex-shrink-0 text-right">
                      <p className="text-[11px] text-[#555b66] font-medium">{formatTimeAgo(inc.startedAt)}</p>
                      <div className="flex items-center gap-1.5 mt-1.5 justify-end">
                        <svg className="w-3 h-3 text-[#2e323a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className={`text-[10px] font-bold tabular-nums ${inc.isResolved ? 'text-[#555b66]' : 'text-red-400'}`}>
                          {formatDuration(duration)}
                        </span>
                      </div>
                    </div>

                    <svg className="w-4 h-4 text-[#2e323a] group-hover:text-[#555b66] transition-colors flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                );
              })}
            </div>
          )}

          {filtered.length > 0 && (
            <p className="text-[10px] text-[#2e323a] mt-3 text-center">
              Mostrando {filtered.length} de {incidents.length} incidente{incidents.length !== 1 ? 's' : ''} · Clique para gerenciar
            </p>
          )}
        </div>
      </div>

      {/* ─── Incident Detail Modal ─── */}
      {selectedIncident && (
        <IncidentDetailModal
          incident={selectedIncident}
          statusPages={statusPages}
          userName={user?.name || 'Operador'}
          onClose={() => setSelectedIncident(null)}
          onAddUpdate={handleAddUpdate}
          onToggleStatusPage={handleToggleStatusPage}
          formatDate={formatDate}
          formatDuration={formatDuration}
        />
      )}
    </DashboardLayout>
  );
}

// ─── Incident Detail Modal ───

function IncidentDetailModal({
  incident,
  statusPages,
  userName,
  onClose,
  onAddUpdate,
  onToggleStatusPage,
  formatDate,
  formatDuration,
}: {
  incident: Incident;
  statusPages: StatusPageOption[];
  userName: string;
  onClose: () => void;
  onAddUpdate: (id: string, status: IncidentUpdate['status'], message: string) => void;
  onToggleStatusPage: (incidentId: string, pageId: string) => void;
  formatDate: (d: string) => string;
  formatDuration: (ms: number) => string;
}) {
  const [newStatus, setNewStatus] = useState<IncidentUpdate['status']>(
    incident.isResolved ? 'resolved' : 'monitoring'
  );
  const [newMessage, setNewMessage] = useState('');
  const sev = severityConfig[incident.severity] || severityConfig.MEDIUM;
  const duration = incident.resolvedAt
    ? new Date(incident.resolvedAt).getTime() - new Date(incident.startedAt).getTime()
    : Date.now() - new Date(incident.startedAt).getTime();

  const handleSubmitUpdate = () => {
    if (!newMessage.trim()) return;
    onAddUpdate(incident.id, newStatus, newMessage.trim());
    setNewMessage('');
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]" onClick={onClose} />
      <div className="fixed inset-0 flex items-start justify-center z-[91] p-4 pt-[5vh] overflow-y-auto">
        <div className="w-full max-w-[640px] bg-[#12141a] border border-[#1e2128] rounded-2xl overflow-hidden" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>

          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-[#1e2128]">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold ${sev.bg} ${sev.color} border ${sev.border}`}>
                    <span className={`w-1 h-1 rounded-full ${sev.dot}`} />{sev.label}
                  </span>
                  {INCIDENT_STATUSES.filter((s) => s.key === incident.status).map((s) => (
                    <span key={s.key} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold ${s.bg} ${s.color} border ${s.border}`}>
                      <span className={`w-1 h-1 rounded-full ${s.dot}`} />{s.label}
                    </span>
                  ))}
                </div>
                <h2 className="text-[18px] font-semibold text-[#e4e4e7] leading-tight">
                  {incident.title || 'Incidente'}
                </h2>
                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#3e424a]">
                  <span className="font-medium text-[#555b66]">{incident.monitorName}</span>
                  <span>·</span>
                  <span>{formatDate(incident.startedAt)}</span>
                  <span>·</span>
                  <span className={incident.isResolved ? 'text-[#555b66]' : 'text-red-400 font-semibold'}>{formatDuration(duration)}</span>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#3e424a] hover:text-[#80838a] hover:bg-white/[0.05] transition-all flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>

          {/* Publish to Status Page */}
          {statusPages.length > 0 && (
            <div className="px-6 py-4 border-b border-[#1e2128]">
              <p className="text-[11px] font-semibold text-[#555b66] uppercase tracking-[0.06em] mb-2">Publicar na Status Page</p>
              <div className="flex flex-wrap gap-2">
                {statusPages.map((page) => {
                  const isActive = incident.statusPageIds.includes(page.id);
                  return (
                    <button
                      key={page.id}
                      onClick={() => onToggleStatusPage(incident.id, page.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${
                        isActive
                          ? 'bg-violet-500/10 border-violet-500/20 text-violet-400'
                          : 'bg-[#0a0b0f] border-[#1e2128] text-[#555b66] hover:text-[#80838a] hover:border-[#2a2e36]'
                      }`}
                    >
                      {isActive ? (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      ) : (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                      )}
                      {page.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add update form */}
          {!incident.isResolved && (
            <div className="px-6 py-4 border-b border-[#1e2128] bg-[#0f1015]">
              <p className="text-[11px] font-semibold text-[#555b66] uppercase tracking-[0.06em] mb-3">Nova atualização</p>

              {/* Status selector */}
              <div className="flex gap-1.5 mb-3">
                {INCIDENT_STATUSES.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setNewStatus(s.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                      newStatus === s.key
                        ? `${s.bg} ${s.color} ${s.border}`
                        : 'border-[#1e2128] text-[#3e424a] hover:text-[#555b66] hover:border-[#2a2e36]'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${newStatus === s.key ? s.dot : 'bg-[#3e424a]'}`} />
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Message */}
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Descreva a atualização do incidente..."
                rows={3}
                className="w-full bg-[#12141a] border border-[#1e2128] rounded-xl text-[12px] text-[#e4e4e7] placeholder-[#2e323a] px-4 py-3 focus:outline-none focus:border-[#3e424a] resize-none"
              />

              <div className="flex items-center justify-between mt-3">
                <p className="text-[10px] text-[#2e323a]">Publicando como {userName}</p>
                <button
                  onClick={handleSubmitUpdate}
                  disabled={!newMessage.trim()}
                  className="h-8 px-4 bg-[#e4e4e7] hover:bg-white text-[#0c0d11] rounded-lg text-[12px] font-semibold transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  Publicar atualização
                </button>
              </div>
            </div>
          )}

          {/* Updates timeline */}
          <div className="px-6 py-5 max-h-[400px] overflow-y-auto">
            <p className="text-[11px] font-semibold text-[#555b66] uppercase tracking-[0.06em] mb-4">
              Timeline ({incident.updates.length})
            </p>
            <div className="space-y-0">
              {incident.updates.map((update, idx) => {
                const uStatus = INCIDENT_STATUSES.find((s) => s.key === update.status) || INCIDENT_STATUSES[0];
                return (
                  <div key={update.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${uStatus.dot}`} />
                      {idx < incident.updates.length - 1 && <div className="w-px flex-1 bg-[#1e2128] my-1" />}
                    </div>
                    <div className="pb-4 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[11px] font-bold ${uStatus.color}`}>{uStatus.label}</span>
                        <span className="text-[10px] text-[#3e424a]">{formatDate(update.createdAt)}</span>
                        {update.author && (
                          <span className="text-[9px] text-[#2e323a] bg-[#1e2128] px-1.5 py-0.5 rounded">{update.author}</span>
                        )}
                      </div>
                      <p className="text-[12px] text-[#80838a] mt-1 leading-relaxed">{update.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}