'use client';

import { useAuth } from '@/contexts/auth-context';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { MonitorForm } from '@/components/monitor-form';
import { api } from '@/lib/api';

interface Check {
  id: string;
  status: 'UP' | 'DOWN';
  responseTime: number;
  statusCode: number;
  checkedAt: string;
}

export default function MonitorDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const monitorId = params.id as string;

  const [monitor, setMonitor] = useState<any>(null);
  const [checks, setChecks] = useState<Check[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [status, setStatus] = useState<string>('UNKNOWN');
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    if (user && monitorId) loadMonitor();
  }, [user, monitorId]);

  // Tick for countdown
  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const loadMonitor = async () => {
    try {
      const monRes = await api.get(`/monitors/${monitorId}`);
      setMonitor(monRes.data.data);

      const [statusRes, statsRes, checksRes] = await Promise.all([
        api.get(`/monitors/${monitorId}/status`).catch(() => null),
        api.get(`/monitors/${monitorId}/stats`).catch(() => null),
        api.get(`/monitors/${monitorId}/checks?limit=500`).catch(() => null),
      ]);

      if (statusRes) setStatus(statusRes.data.data?.status || 'UNKNOWN');
      if (statsRes) setStats(statsRes.data.data);
      
      // Handle checks — try multiple response structures
      if (checksRes) {
        const checksData = checksRes.data?.data || checksRes.data || [];
        setChecks(Array.isArray(checksData) ? checksData : []);
      }
    } catch {
      router.push('/monitors');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: any) => {
    await api.put(`/monitors/${monitorId}`, data);
    setShowEditModal(false);
    loadMonitor();
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este monitor?')) return;
    await api.delete(`/monitors/${monitorId}`);
    router.push('/monitors');
  };

  const handleToggle = async () => {
    await api.patch(`/monitors/${monitorId}/toggle`);
    loadMonitor();
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

  if (!monitor) return null;

  const uptime = stats?.uptime ? parseFloat(stats.uptime) : 0;
  const avgResponse = stats?.avgResponseTime ? Math.round(parseFloat(stats.avgResponseTime)) : 0;
  const totalChecks = checks.length;
  const downChecks = checks.filter((c) => c.status === 'DOWN').length;

  // Next check countdown
  const now = Date.now();
  const lastChecked = monitor.lastChecked ? new Date(monitor.lastChecked).getTime() : 0;
  const nextAt = lastChecked + monitor.interval * 1000;
  const countdownSecs = Math.max(0, Math.ceil((nextAt - now) / 1000));

  // Response time chart data (last 24h, 72 buckets)
  const h24 = 24 * 60 * 60 * 1000;
  const bucketCount = 72;
  const bucketSize = h24 / bucketCount;
  const buckets: { sum: number; count: number }[] = Array.from({ length: bucketCount }, () => ({ sum: 0, count: 0 }));
  checks.forEach((c) => {
    const t = new Date(c.checkedAt).getTime();
    const age = now - t;
    if (age < h24 && age >= 0 && c.responseTime) {
      const idx = Math.floor((h24 - age) / bucketSize);
      if (idx >= 0 && idx < bucketCount) {
        buckets[idx].sum += c.responseTime;
        buckets[idx].count += 1;
      }
    }
  });
  const avgs = buckets.map((b) => (b.count > 0 ? Math.round(b.sum / b.count) : 0));
  const filledAvgs = avgs.map((v, i) => {
    if (v > 0) return v;
    for (let d = 1; d < bucketCount; d++) {
      if (i - d >= 0 && avgs[i - d] > 0) return avgs[i - d];
      if (i + d < bucketCount && avgs[i + d] > 0) return avgs[i + d];
    }
    return 0;
  });
  const maxVal = Math.max(...filledAvgs.filter(Boolean), 1);
  const minVal = Math.min(...filledAvgs.filter(Boolean), maxVal);
  const range = maxVal - minVal || maxVal * 0.5;
  const scaleMin = Math.max(0, minVal - range * 0.3);
  const scaleMax = maxVal + range * 0.3;

  // Heartbeat slots (last 50 checks)
  const heartbeatChecks = [...checks].sort((a, b) => new Date(a.checkedAt).getTime() - new Date(b.checkedAt).getTime()).slice(-50);

  // Incident log
  const incidents: { start: Date; end?: Date; duration?: number }[] = [];
  const sortedChecks = [...checks].sort((a, b) => new Date(a.checkedAt).getTime() - new Date(b.checkedAt).getTime());
  let incidentStart: Date | null = null;
  sortedChecks.forEach((c) => {
    if (c.status === 'DOWN' && !incidentStart) {
      incidentStart = new Date(c.checkedAt);
    } else if (c.status === 'UP' && incidentStart) {
      const end = new Date(c.checkedAt);
      incidents.push({ start: incidentStart, end, duration: end.getTime() - incidentStart.getTime() });
      incidentStart = null;
    }
  });
  if (incidentStart) incidents.push({ start: incidentStart });
  incidents.reverse();

  const formatDuration = (ms: number) => {
    const secs = Math.floor(ms / 1000);
    if (secs < 60) return `${secs}s`;
    const mins = Math.floor(secs / 60);
    if (mins < 60) return `${mins}m ${secs % 60}s`;
    const hrs = Math.floor(mins / 60);
    return `${hrs}h ${mins % 60}m`;
  };

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

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
            <Link href="/monitors" className="text-[11px] text-[#3e424a] hover:text-[#80838a] font-medium transition-colors">
              Monitores
            </Link>
            <svg className="w-3 h-3 text-[#2e323a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-[11px] text-[#80838a] font-medium">{monitor.name}</span>
          </div>

          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <h1 className="text-[22px] font-semibold text-[#e4e4e7] tracking-tight">{monitor.name}</h1>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                  status === 'UP' ? 'bg-emerald-500/10 text-emerald-400' :
                  status === 'DOWN' ? 'bg-red-500/10 text-red-400' :
                  'bg-[#1e2128] text-[#555b66]'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    status === 'UP' ? 'bg-emerald-400' : status === 'DOWN' ? 'bg-red-400' : 'bg-[#555b66]'
                  }`} />
                  {status === 'UP' ? 'Online' : status === 'DOWN' ? 'Offline' : 'Desconhecido'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[12px] text-[#3e424a]">
                <span className="font-mono text-[#555b66]">{monitor.checkType}</span>
                <span>·</span>
                <span className="font-mono">{monitor.url}</span>
                <span>·</span>
                <span>Intervalo: {monitor.interval >= 60 ? `${monitor.interval / 60}min` : `${monitor.interval}s`}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggle}
                className={`h-9 px-4 rounded-lg text-[12px] font-semibold border transition-all ${
                  monitor.isActive
                    ? 'border-amber-500/20 text-amber-400 hover:bg-amber-500/10'
                    : 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10'
                }`}
              >
                {monitor.isActive ? 'Pausar' : 'Retomar'}
              </button>
              <button
                onClick={() => setShowEditModal(true)}
                className="h-9 px-4 bg-[#15171c] border border-[#1e2128] rounded-lg text-[12px] font-semibold text-[#80838a] hover:text-[#c8c9cd] hover:border-[#2a2e36] transition-all"
              >
                Editar
              </button>
              <button
                onClick={handleDelete}
                className="h-9 px-4 bg-[#15171c] border border-[#1e2128] rounded-lg text-[12px] font-semibold text-red-400/60 hover:text-red-400 hover:border-red-500/20 transition-all"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>

        <div className="px-8 pb-8">
          {/* Stats row */}
          <div className="grid grid-cols-5 gap-3 mb-5">
            {[
              { label: 'Uptime', value: `${uptime.toFixed(1)}%`, color: uptime >= 99 ? 'text-emerald-400' : uptime >= 95 ? 'text-amber-400' : 'text-red-400' },
              { label: 'Resp. média', value: `${avgResponse}ms`, color: avgResponse < 500 ? 'text-[#e4e4e7]' : 'text-amber-400' },
              { label: 'Checks', value: `${totalChecks}`, color: 'text-[#e4e4e7]' },
              { label: 'Incidentes', value: `${incidents.length}`, color: incidents.length === 0 ? 'text-emerald-400' : 'text-red-400' },
              { label: 'Próx. check', value: countdownSecs === 0 ? 'Verificando...' : `~${countdownSecs}s`, color: countdownSecs <= 15 ? 'text-emerald-400' : 'text-[#e4e4e7]' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-[#1e2128] bg-[#12141a] p-4">
                <p className="text-[10px] text-[#3e424a] font-semibold uppercase tracking-[0.08em] mb-1.5">{s.label}</p>
                <p className={`text-[18px] font-bold tabular-nums ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Heartbeat — ECG style */}
          <div className="rounded-xl border border-[#1e2128] bg-[#12141a] p-5 mb-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[13px] font-semibold text-[#c8c9cd]">Heartbeat</p>
                <p className="text-[11px] text-[#3e424a] mt-0.5">{checks.length > 0 ? `Últimas ${heartbeatChecks.length} verificações` : 'Aguardando dados...'}</p>
              </div>
              {heartbeatChecks.length > 0 && (() => {
                const lastCheck = heartbeatChecks[heartbeatChecks.length - 1];
                return (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${lastCheck.status === 'UP' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400 animate-pulse'}`} />
                      <span className={`text-[12px] font-bold tabular-nums ${lastCheck.status === 'UP' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {lastCheck.responseTime || 0}ms
                      </span>
                    </div>
                    <button onClick={loadMonitor} className="text-[11px] text-[#3e424a] hover:text-[#80838a] font-medium transition-colors">
                      Atualizar
                    </button>
                  </div>
                );
              })()}
            </div>
            <div className="relative h-[100px] w-full overflow-hidden">
              {heartbeatChecks.length > 0 ? (() => {
                const chartW = 1000;
                const chartH = 100;
                const padY = 10;
                const upChecks = heartbeatChecks.filter((c) => c.status === 'UP' && c.responseTime > 0);
                const maxResp = Math.max(...upChecks.map((c) => c.responseTime), 1);
                const minResp = Math.min(...upChecks.map((c) => c.responseTime), maxResp);
                const respRange = maxResp - minResp || maxResp * 0.5;
                const sMin = Math.max(0, minResp - respRange * 0.2);
                const sMax = maxResp + respRange * 0.2;

                const points = heartbeatChecks.map((c, i) => {
                  const x = heartbeatChecks.length === 1 ? chartW / 2 : (i / (heartbeatChecks.length - 1)) * chartW;
                  let y: number;
                  if (c.status === 'DOWN') {
                    y = chartH - padY;
                  } else {
                    const normalized = sMax === sMin ? 0.5 : (c.responseTime - sMin) / (sMax - sMin);
                    y = padY + normalized * (chartH - padY * 2);
                  }
                  return { x, y, status: c.status, val: c.responseTime || 0, time: c.checkedAt };
                });

                // ECG path with sharp peaks
                let ecgPath = '';
                points.forEach((p, i) => {
                  if (i === 0) {
                    ecgPath = `M ${p.x} ${p.y}`;
                  } else {
                    const prev = points[i - 1];
                    if (p.status === 'DOWN' || prev.status === 'DOWN') {
                      const midX = (prev.x + p.x) / 2;
                      ecgPath += ` L ${midX} ${prev.y} L ${midX} ${p.y} L ${p.x} ${p.y}`;
                    } else {
                      const dx = p.x - prev.x;
                      ecgPath += ` L ${prev.x + dx * 0.4} ${prev.y} L ${prev.x + dx * 0.45} ${p.y} L ${p.x} ${p.y}`;
                    }
                  }
                });

                const hasDown = points.some((p) => p.status === 'DOWN');
                const lineColor = hasDown ? '#f87171' : '#34d399';
                const glowColor = hasDown ? 'rgba(248,113,113,0.25)' : 'rgba(52,211,153,0.25)';

                return (
                  <>
                    <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="none">
                      {[0.25, 0.5, 0.75].map((pct, idx) => (
                        <line key={idx} x1="0" x2={chartW} y1={padY + pct * (chartH - padY * 2)} y2={padY + pct * (chartH - padY * 2)} stroke="#1a1d23" strokeWidth="1" />
                      ))}
                    </svg>
                    <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="none">
                      <defs>
                        <filter id="ecgGlow">
                          <feGaussianBlur stdDeviation="3" result="blur" />
                          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                      </defs>
                      <path d={ecgPath} fill="none" stroke={glowColor} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                      <path d={ecgPath} fill="none" stroke={lineColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" filter="url(#ecgGlow)" />
                      {points.filter((p) => p.status === 'DOWN').map((p, idx) => (
                        <circle key={idx} cx={p.x} cy={p.y} r="4" fill="#ef4444" stroke="#12141a" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                      ))}
                    </svg>
                    <div className="absolute inset-0 flex">
                      {points.map((p, i) => (
                        <div key={i} className="flex-1 relative group cursor-crosshair">
                          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/[0.06] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                          <div className={`absolute left-1/2 -translate-x-1/2 w-[7px] h-[7px] rounded-full border-2 border-[#12141a] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${p.status === 'UP' ? 'bg-emerald-400' : 'bg-red-400'}`} style={{ top: `${p.y}px` }} />
                          <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block z-10 pointer-events-none">
                            <div className="bg-[#1a1d23] border border-[#2a2e36] rounded-md px-2.5 py-1.5 whitespace-nowrap" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>
                              <p className={`text-[10px] font-bold ${p.status === 'UP' ? 'text-emerald-400' : 'text-red-400'}`}>
                                {p.status === 'UP' ? '● Online' : '● Offline'} · {p.val}ms
                              </p>
                              <p className="text-[9px] text-[#3e424a] mt-0.5">
                                {new Date(p.time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="absolute right-2 top-0 bottom-0 flex flex-col justify-between pointer-events-none" style={{ paddingTop: padY, paddingBottom: padY }}>
                      <span className="text-[8px] text-[#2e323a] font-mono tabular-nums">{Math.round(sMin)}ms</span>
                      <span className="text-[8px] text-[#2e323a] font-mono tabular-nums">{Math.round(sMax)}ms</span>
                    </div>
                  </>
                );
              })() : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-[12px] text-[#2e323a]">Sem dados de verificação ainda</p>
                </div>
              )}
            </div>
          </div>

          {/* Response time chart */}
          <div className="rounded-xl border border-[#1e2128] bg-[#12141a] p-5 mb-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[13px] font-semibold text-[#c8c9cd]">Tempo de resposta</p>
                <p className="text-[11px] text-[#3e424a] mt-0.5">Últimas 24 horas</p>
              </div>
              {filledAvgs.some((v) => v > 0) && (
                <div className="flex items-center gap-5">
                  <div className="text-right">
                    <p className="text-[10px] text-[#3e424a]">Média</p>
                    <p className="text-[14px] font-bold text-[#e4e4e7] tabular-nums">{avgResponse}ms</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-[#3e424a]">Mín</p>
                    <p className="text-[14px] font-bold text-emerald-400 tabular-nums">{Math.round(minVal)}ms</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-[#3e424a]">Máx</p>
                    <p className="text-[14px] font-bold text-amber-400 tabular-nums">{Math.round(maxVal)}ms</p>
                  </div>
                </div>
              )}
            </div>
            <div className="relative h-[180px] w-full">
              {filledAvgs.every((v) => v === 0) ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-[12px] text-[#2e323a]">Sem dados de resposta ainda</p>
                </div>
              ) : (() => {
                const chartH = 180;
                const chartW = 1000;
                const padY = 12;
                const points = filledAvgs.map((v, i) => {
                  const x = (i / (bucketCount - 1)) * chartW;
                  const normalized = (v - scaleMin) / (scaleMax - scaleMin);
                  const y = padY + (1 - normalized) * (chartH - padY * 2);
                  return { x, y, val: v, original: avgs[i] };
                });
                const linePath = points.reduce((path, p, i) => {
                  if (i === 0) return `M ${p.x} ${p.y}`;
                  const prev = points[i - 1];
                  const cpx = (prev.x + p.x) / 2;
                  return `${path} C ${cpx} ${prev.y}, ${cpx} ${p.y}, ${p.x} ${p.y}`;
                }, '');
                const areaPath = `${linePath} L ${chartW} ${chartH} L 0 ${chartH} Z`;
                const yLabels = [Math.round(scaleMax), Math.round((scaleMax + scaleMin) / 2), Math.round(scaleMin)];

                return (
                  <>
                    <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between pointer-events-none" style={{ paddingTop: padY, paddingBottom: padY }}>
                      {yLabels.map((v, i) => (
                        <span key={i} className="text-[9px] text-[#2e323a] font-medium tabular-nums">{v >= 1000 ? `${(v / 1000).toFixed(1)}s` : `${v}ms`}</span>
                      ))}
                    </div>
                    <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="none">
                      {[0, 0.5, 1].map((pct, i) => (
                        <line key={i} x1="0" x2={chartW} y1={padY + pct * (chartH - padY * 2)} y2={padY + pct * (chartH - padY * 2)} stroke="#1e2128" strokeWidth="1" />
                      ))}
                    </svg>
                    <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="detailGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#34d399" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d={areaPath} fill="url(#detailGrad)" />
                      <path d={linePath} fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                    </svg>
                    <div className="absolute inset-0 flex">
                      {points.map((p, i) => (
                        <div key={i} className="flex-1 relative group cursor-crosshair">
                          {p.val > 0 && (
                            <>
                              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-[#e4e4e7]/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                              <div className="absolute left-1/2 -translate-x-1/2 w-[6px] h-[6px] rounded-full bg-emerald-400 border border-[#12141a] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ top: `${p.y}px` }} />
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
            <div className="flex justify-between mt-2 pl-7">
              {['24h atrás', '18h', '12h', '6h', 'Agora'].map((l) => (
                <span key={l} className="text-[10px] text-[#2e323a] font-medium">{l}</span>
              ))}
            </div>
          </div>

          {/* Recent checks + Incidents side by side */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Recent checks log */}
            <div className="rounded-xl border border-[#1e2128] bg-[#12141a] p-5">
              <p className="text-[13px] font-semibold text-[#c8c9cd] mb-1">Últimas verificações</p>
              <p className="text-[11px] text-[#3e424a] mb-4">Histórico detalhado</p>
              <div className="space-y-0 max-h-[300px] overflow-y-auto">
                {[...checks].reverse().slice(0, 20).map((c, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-[#1e2128]/50 last:border-0">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c.status === 'UP' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    <span className="text-[12px] text-[#80838a] font-mono tabular-nums flex-1">
                      {c.statusCode || '—'}
                    </span>
                    <span className="text-[12px] text-[#c8c9cd] font-bold tabular-nums">
                      {c.responseTime}ms
                    </span>
                    <span className="text-[10px] text-[#3e424a] tabular-nums">
                      {new Date(c.checkedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                ))}
                {checks.length === 0 && (
                  <p className="text-[12px] text-[#2e323a] text-center py-6">Nenhuma verificação ainda</p>
                )}
              </div>
            </div>

            {/* Incident log */}
            <div className="rounded-xl border border-[#1e2128] bg-[#12141a] p-5">
              <p className="text-[13px] font-semibold text-[#c8c9cd] mb-1">Incidentes</p>
              <p className="text-[11px] text-[#3e424a] mb-4">Histórico de quedas</p>
              <div className="space-y-0 max-h-[300px] overflow-y-auto">
                {incidents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/[0.06] flex items-center justify-center mb-2.5">
                      <svg className="w-4 h-4 text-emerald-400/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-[12px] text-[#3e424a] font-medium">Nenhum incidente registrado</p>
                  </div>
                ) : incidents.slice(0, 10).map((inc, i) => (
                  <div key={i} className="flex items-start gap-3 py-2.5 border-b border-[#1e2128]/50 last:border-0">
                    <div className="w-[15px] h-[15px] rounded-full bg-red-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-[7px] h-[7px] rounded-full bg-red-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-[#c8c9cd] font-medium">
                        {inc.end ? 'Resolvido' : 'Em andamento'}
                      </p>
                      <p className="text-[10px] text-[#3e424a] mt-0.5">
                        {formatDate(inc.start)}
                        {inc.duration && ` · Duração: ${formatDuration(inc.duration)}`}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      inc.end ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {inc.end ? 'Resolvido' : 'Ativo'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]" onClick={() => setShowEditModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-[91] p-4">
            <div className="w-full max-w-[440px] bg-[#12141a] border border-[#1e2128] rounded-2xl p-6" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>
              <div className="mb-5">
                <h2 className="text-[17px] font-semibold text-[#e4e4e7]">Editar monitor</h2>
                <p className="text-[13px] text-[#555b66] mt-1">Atualize as configurações</p>
              </div>
              <MonitorForm monitor={monitor} onSubmit={handleUpdate} onCancel={() => setShowEditModal(false)} />
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}