'use client';

import { useAuth } from '@/contexts/auth-context';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { MonitorForm } from '@/components/monitor-form';
import { api } from '@/lib/api';

export default function MonitorsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [monitors, setMonitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    if (user) loadMonitors();
  }, [user]);

  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const loadMonitors = async () => {
    try {
      const response = await api.get('/monitors');
      const data = response.data.data;
      const enriched = await Promise.all(
        data.map(async (m: any) => {
          try {
            const [statusRes, statsRes] = await Promise.all([
              api.get(`/monitors/${m.id}/status`),
              api.get(`/monitors/${m.id}/stats`),
            ]);
            return { ...m, currentStatus: statusRes.data.data.status, stats: statsRes.data.data };
          } catch {
            return { ...m, currentStatus: 'UNKNOWN' };
          }
        })
      );
      setMonitors(enriched);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: any) => {
    await api.post('/monitors', data);
    setShowCreateModal(false);
    loadMonitors();
  };

  const filtered = monitors.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <span className="text-[11px] text-[#80838a] font-medium">Monitores</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[22px] font-semibold text-[#e4e4e7] tracking-tight">Monitores</h1>
              <p className="text-[13px] text-[#3e424a] mt-1">{monitors.length} monitor{monitors.length !== 1 ? 'es' : ''} configurado{monitors.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="flex items-center gap-2.5">
              {/* Search */}
              <div className="relative w-[220px]">
                <input
                  type="text"
                  placeholder="Buscar monitores…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 bg-[#15171c] border border-[#1e2128] rounded-lg px-3 pl-9 text-[13px] text-[#c8c9cd] placeholder-[#3e424a] focus:outline-none focus:border-[#3e424a] transition-colors"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#3e424a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 h-9 px-4 bg-[#e4e4e7] hover:bg-white text-[#0c0d11] rounded-lg text-[13px] font-semibold transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Novo monitor
              </button>
            </div>
          </div>
        </div>

        {/* Monitor cards grid */}
        <div className="px-8 pb-8">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-[#1e2128] bg-[#12141a] py-16 text-center">
              <p className="text-[13px] text-[#555b66]">
                {searchQuery ? `Nenhum monitor encontrado para "${searchQuery}"` : 'Nenhum monitor configurado'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
              {filtered.map((monitor) => {
                const uptime = monitor.stats?.uptime ? parseFloat(monitor.stats.uptime) : 0;
                const avgResp = monitor.stats?.avgResponseTime ? Math.round(parseFloat(monitor.stats.avgResponseTime)) : 0;
                const now = Date.now();
                const lastChecked = monitor.lastChecked ? new Date(monitor.lastChecked).getTime() : 0;
                const countdown = Math.max(0, Math.ceil((lastChecked + monitor.interval * 1000 - now) / 1000));

                return (
                  <div
                    key={monitor.id}
                    onClick={() => router.push(`/monitors/${monitor.id}`)}
                    className="rounded-xl border border-[#1e2128] bg-[#12141a] p-5 hover:border-[#2a2e36] hover:bg-[#15171c] transition-all cursor-pointer group"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-[14px] font-semibold text-[#e4e4e7] truncate group-hover:text-white transition-colors">
                            {monitor.name}
                          </h3>
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            monitor.currentStatus === 'UP' ? 'bg-emerald-400' :
                            monitor.currentStatus === 'DOWN' ? 'bg-red-400' : 'bg-[#555b66]'
                          }`} />
                        </div>
                        <p className="text-[11px] text-[#3e424a] font-mono truncate">{monitor.url}</p>
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ml-3 ${
                        monitor.currentStatus === 'UP' ? 'bg-emerald-500/10 text-emerald-400' :
                        monitor.currentStatus === 'DOWN' ? 'bg-red-500/10 text-red-400' :
                        'bg-[#1e2128] text-[#555b66]'
                      }`}>
                        {monitor.currentStatus === 'UP' ? 'Online' : monitor.currentStatus === 'DOWN' ? 'Offline' : '—'}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div>
                        <p className="text-[9px] text-[#3e424a] uppercase font-semibold tracking-wider mb-0.5">Uptime</p>
                        <p className={`text-[14px] font-bold tabular-nums ${
                          uptime >= 99 ? 'text-emerald-400' : uptime >= 95 ? 'text-amber-400' : 'text-red-400'
                        }`}>{uptime.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-[#3e424a] uppercase font-semibold tracking-wider mb-0.5">Resp.</p>
                        <p className="text-[14px] font-bold text-[#c8c9cd] tabular-nums">{avgResp}ms</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-[#3e424a] uppercase font-semibold tracking-wider mb-0.5">Próx. check</p>
                        <p className={`text-[14px] font-bold tabular-nums ${countdown <= 15 ? 'text-emerald-400' : 'text-[#555b66]'}`}>
                          {countdown === 0 ? '...' : `${countdown}s`}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#1e2128]">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-[#3e424a]">{monitor.checkType}</span>
                        <span className="text-[10px] text-[#2e323a]">·</span>
                        <span className="text-[10px] text-[#3e424a]">{monitor.interval >= 60 ? `${monitor.interval / 60}min` : `${monitor.interval}s`}</span>
                      </div>
                      <svg className="w-4 h-4 text-[#2e323a] group-hover:text-[#555b66] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]" onClick={() => setShowCreateModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-[91] p-4">
            <div className="w-full max-w-[440px] bg-[#12141a] border border-[#1e2128] rounded-2xl p-6" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>
              <div className="mb-5">
                <h2 className="text-[17px] font-semibold text-[#e4e4e7]">Criar novo monitor</h2>
                <p className="text-[13px] text-[#555b66] mt-1">Configure um novo monitor</p>
              </div>
              <MonitorForm onSubmit={handleCreate} onCancel={() => setShowCreateModal(false)} />
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}