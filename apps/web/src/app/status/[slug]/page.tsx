'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';

// ─── Types ───

interface DayUptime {
  date: string;
  uptime: number;
  totalChecks: number;
}

interface Service {
  name: string;
  status: 'UP' | 'DOWN' | 'UNKNOWN';
  uptime: number;
  responseTime: number;
  dailyUptime: DayUptime[];
}

interface IncidentUpdate {
  id: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  message: string;
  createdAt: string;
}

interface PublicIncident {
  id: string;
  title: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  startedAt: string;
  resolvedAt?: string;
  updates: IncidentUpdate[];
}

interface StatusPageData {
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  overallStatus: 'UP' | 'DOWN' | 'UNKNOWN';
  services: Service[];
  incidents?: PublicIncident[];
}

type Theme = 'light' | 'dark';

// ─── Theme Tokens ───

const themes = {
  light: {
    bg: 'bg-[#fafafa]',
    bgAlt: 'bg-[#f5f5f5]',
    card: 'bg-white',
    cardBorder: 'border-[#ebebeb]',
    text: 'text-[#171717]',
    textSecondary: 'text-[#525252]',
    textMuted: 'text-[#a3a3a3]',
    textFaint: 'text-[#a3a3a3]',
    divider: 'border-[#ebebeb]',
    bannerUpBg: 'bg-emerald-50/80',
    bannerUpBorder: 'border-emerald-100',
    bannerUpText: 'text-emerald-600',
    bannerUpDot: 'bg-emerald-500',
    bannerDownBg: 'bg-red-50/80',
    bannerDownBorder: 'border-red-100',
    bannerDownText: 'text-red-600',
    bannerDownDot: 'bg-red-500',
    barEmpty: 'bg-[#e5e5e5]',
    barGreen: 'bg-emerald-500',
    barAmber: 'bg-amber-500',
    barRed: 'bg-red-500',
    tooltipBg: 'bg-[#171717]',
    tooltipBorder: 'border-[#2e2e2e]',
    tooltipText: 'text-white',
    toggleBg: 'bg-transparent',
    toggleActive: 'bg-[#f5f5f5]',
    toggleBorder: 'border-[#ebebeb]',
    incidentBg: 'bg-amber-50/60',
    incidentBorder: 'border-amber-100',
    timelineDot: 'bg-[#d4d4d4]',
    timelineLine: 'bg-[#e5e5e5]',
  },
  dark: {
    bg: 'bg-[#0a0b0f]',
    bgAlt: 'bg-[#0c0d11]',
    card: 'bg-[#12141a]',
    cardBorder: 'border-[#1e2128]',
    text: 'text-[#e4e4e7]',
    textSecondary: 'text-[#80838a]',
    textMuted: 'text-[#555b66]',
    textFaint: 'text-[#2e323a]',
    divider: 'border-[#1e2128]/60',
    bannerUpBg: 'bg-emerald-500/[0.08]',
    bannerUpBorder: 'border-emerald-500/15',
    bannerUpText: 'text-emerald-400',
    bannerUpDot: 'bg-emerald-400',
    bannerDownBg: 'bg-red-500/[0.08]',
    bannerDownBorder: 'border-red-500/15',
    bannerDownText: 'text-red-400',
    bannerDownDot: 'bg-red-400',
    barEmpty: 'bg-[#1e2128]',
    barGreen: 'bg-emerald-400',
    barAmber: 'bg-amber-400',
    barRed: 'bg-red-400',
    tooltipBg: 'bg-[#1a1d23]',
    tooltipBorder: 'border-[#2a2e36]',
    tooltipText: 'text-[#e4e4e7]',
    toggleBg: 'bg-[#1e2128]',
    toggleActive: 'bg-[#2a2e36]',
    toggleBorder: 'border-[#2a2e36]',
    incidentBg: 'bg-amber-500/[0.04]',
    incidentBorder: 'border-amber-500/10',
    timelineDot: 'bg-[#3e424a]',
    timelineLine: 'bg-[#1e2128]',
  },
};

// ─── Uptime Bar ───

function UptimeBar({ dailyUptime, uptime, t }: { dailyUptime: DayUptime[]; uptime: number; t: typeof themes.light }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouse = (idx: number, e: React.MouseEvent) => {
    setHoveredIdx(idx);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) setTooltipPos({ x: e.clientX - rect.left });
  };

  const formatBarDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex items-end gap-[2px] h-[34px]">
        {dailyUptime.map((day, i) => {
          let color = t.barEmpty;
          if (day.uptime >= 0) {
            if (day.uptime >= 99.5) color = t.barGreen;
            else if (day.uptime >= 95) color = t.barAmber;
            else color = t.barRed;
          }
          const isHovered = hoveredIdx === i;

          return (
            <div
              key={i}
              onMouseEnter={(e) => handleMouse(i, e)}
              onMouseMove={(e) => handleMouse(i, e)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="flex-1 h-full cursor-pointer"
            >
              <div
                className={`w-full h-full rounded-[1.5px] transition-all duration-100 ${color} ${
                  isHovered ? 'opacity-100 scale-y-110 origin-bottom' : day.uptime < 0 ? 'opacity-20' : 'opacity-70 hover:opacity-100'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Tooltip */}
      {hoveredIdx !== null && dailyUptime[hoveredIdx] && (
        <div
          className="absolute z-50 pointer-events-none"
          style={{
            left: `${Math.min(Math.max(tooltipPos.x, 70), (containerRef.current?.offsetWidth || 600) - 70)}px`,
            top: '-8px',
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className={`${t.tooltipBg} border ${t.tooltipBorder} rounded-lg px-3 py-2 whitespace-nowrap`} style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
            <p className={`text-[11px] font-semibold ${t.tooltipText} mb-0.5`}>{formatBarDate(dailyUptime[hoveredIdx].date)}</p>
            {dailyUptime[hoveredIdx].uptime < 0 ? (
              <p className={`text-[10px] ${t.textMuted}`}>Sem dados registrados</p>
            ) : (
              <>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    dailyUptime[hoveredIdx].uptime >= 99.5 ? t.barGreen : dailyUptime[hoveredIdx].uptime >= 95 ? t.barAmber : t.barRed
                  }`} />
                  <span className={`text-[11px] font-bold tabular-nums ${t.tooltipText}`}>
                    {dailyUptime[hoveredIdx].uptime.toFixed(2)}% uptime
                  </span>
                </div>
                <p className={`text-[9px] ${t.textMuted} mt-0.5`}>{dailyUptime[hoveredIdx].totalChecks} verificações</p>
              </>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 mt-2">
        <span className={`text-[10px] ${t.textMuted} text-left`}>90 dias atrás</span>
        <span className={`text-[10px] ${t.text} font-semibold tabular-nums opacity-60 text-center`}>{uptime.toFixed(2)}% uptime</span>
        <span className={`text-[10px] ${t.textMuted} text-right`}>Hoje</span>
      </div>
    </div>
  );
}

// ─── Incident Status Badge ───

const incidentStatusConfig = {
  investigating: { label: 'Investigando', color: 'text-red-500', dot: 'bg-red-500' },
  identified: { label: 'Identificado', color: 'text-amber-500', dot: 'bg-amber-500' },
  monitoring: { label: 'Monitorando', color: 'text-blue-500', dot: 'bg-blue-500' },
  resolved: { label: 'Resolvido', color: 'text-emerald-500', dot: 'bg-emerald-500' },
};

// ─── Main Page ───

export default function PublicStatusPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<StatusPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Check saved preference
    const saved = localStorage.getItem(`sp-theme-${slug}`);
    if (saved === 'dark') setTheme('dark');
  }, [slug]);

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 60000);
    return () => clearInterval(interval);
  }, [slug]);

  const loadStatus = async () => {
    try {
      const res = await api.get(`/s/${slug}`);
      setData(res.data.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = (t: Theme) => {
    setTheme(t);
    localStorage.setItem(`sp-theme-${slug}`, t);
  };

  const t = themes[theme];

  if (loading) {
    return (
      <div className={`min-h-screen ${themes.light.bg} flex items-center justify-center`}>
        <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={`min-h-screen ${t.bg} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
            theme === 'light' ? 'bg-[#f0f0f0]' : 'bg-[#1e2128]'
          }`}>
            <svg className={`w-6 h-6 ${t.textMuted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className={`text-[16px] font-semibold ${t.textSecondary}`}>Página não encontrada</p>
          <p className={`text-[13px] ${t.textMuted} mt-1`}>Esta status page não existe ou não está publicada</p>
        </div>
      </div>
    );
  }

  const isUp = data.overallStatus === 'UP';
  const isDown = data.overallStatus === 'DOWN';

  // Group incidents by date
  const activeIncidents = (data.incidents || []).filter((i) => i.status !== 'resolved');
  const recentResolved = (data.incidents || []).filter((i) => i.status === 'resolved').slice(0, 5);

  const formatIncidentDate = (date: string) =>
    new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

  const formatIncidentTime = (date: string) =>
    new Date(date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`min-h-screen ${t.bg} transition-colors duration-300`}>
      {/* Header */}
      <div className={`border-b ${t.divider}`}>
        <div className="max-w-[680px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {data.logoUrl ? (
                <img src={data.logoUrl} alt="" className="w-8 h-8 rounded-lg" />
              ) : (
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  theme === 'light' ? 'bg-[#f0f0f0]' : 'bg-[#1e2128]'
                }`}>
                  <span className={`text-[13px] font-bold ${t.textSecondary}`}>{data.name.charAt(0)}</span>
                </div>
              )}
              <h1 className={`text-[18px] font-semibold ${t.text} tracking-tight`}>{data.name}</h1>
            </div>

            {/* Theme toggle */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => toggleTheme('light')}
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                  theme === 'light' ? `${t.text}` : `${t.textMuted} hover:${t.textSecondary}`
                }`}
                title="Modo claro"
              >
                <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </button>
              <button
                onClick={() => toggleTheme('dark')}
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                  theme === 'dark' ? `${t.text}` : `${t.textMuted} hover:${t.textSecondary}`
                }`}
                title="Modo escuro"
              >
                <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </button>
            </div>
          </div>
          {data.description && (
            <p className={`text-[13px] ${t.textMuted} mt-2 ml-11`}>{data.description}</p>
          )}
        </div>
      </div>

      <div className="max-w-[680px] mx-auto px-6 py-8">
        {/* Overall status banner */}
        <div className={`rounded-xl border px-5 py-4 mb-8 ${
          isUp ? `${t.bannerUpBg} ${t.bannerUpBorder}` :
          isDown ? `${t.bannerDownBg} ${t.bannerDownBorder}` :
          `${t.toggleBg} ${t.cardBorder}`
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${
              isUp ? t.bannerUpDot : isDown ? `${t.bannerDownDot} animate-pulse` : t.textMuted
            }`} />
            <p className={`text-[14px] font-semibold ${
              isUp ? t.bannerUpText : isDown ? t.bannerDownText : t.textSecondary
            }`}>
              {isUp ? 'Todos os sistemas operacionais' : isDown ? 'Alguns sistemas com problemas' : 'Verificando status...'}
            </p>
          </div>
        </div>

        {/* Active incidents */}
        {activeIncidents.length > 0 && (
          <div className="mb-8 space-y-3">
            {activeIncidents.map((incident) => {
              const statusInfo = incidentStatusConfig[incident.status];
              return (
                <div key={incident.id} className={`rounded-xl border ${t.incidentBorder} ${t.incidentBg} px-5 py-4`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`w-2 h-2 rounded-full ${statusInfo.dot} animate-pulse`} />
                    <h3 className={`text-[14px] font-semibold ${t.text}`}>{incident.title}</h3>
                    <span className={`text-[10px] font-bold ${statusInfo.color} uppercase`}>{statusInfo.label}</span>
                  </div>
                  {/* Updates timeline */}
                  <div className="ml-1 space-y-0">
                    {incident.updates.map((update, idx) => {
                      const uStatus = incidentStatusConfig[update.status];
                      return (
                        <div key={update.id} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className={`w-2 h-2 rounded-full mt-1.5 ${uStatus.dot}`} />
                            {idx < incident.updates.length - 1 && <div className={`w-px flex-1 ${t.timelineLine} my-1`} />}
                          </div>
                          <div className="pb-3 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-[11px] font-bold ${uStatus.color}`}>{uStatus.label}</span>
                              <span className={`text-[10px] ${t.textMuted}`}>
                                {formatIncidentDate(update.createdAt)} às {formatIncidentTime(update.createdAt)}
                              </span>
                            </div>
                            <p className={`text-[12px] ${t.textSecondary} mt-0.5 leading-relaxed`}>{update.message}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Services */}
        <div className="space-y-3">
          {data.services.map((service, idx) => (
            <div key={idx} className={`rounded-xl border ${t.cardBorder} ${t.card} px-5 pt-4 pb-3`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    service.status === 'UP' ? t.barGreen : service.status === 'DOWN' ? `${t.barRed} animate-pulse` : t.textMuted
                  }`} />
                  <span className={`text-[13px] font-semibold ${t.text}`}>{service.name}</span>
                </div>
                <span className={`text-[12px] font-semibold ${
                  service.status === 'UP' ? 'text-emerald-500' : service.status === 'DOWN' ? 'text-red-500' : t.textMuted
                }`}>
                  {service.status === 'UP' ? 'Operacional' : service.status === 'DOWN' ? 'Fora do ar' : '—'}
                </span>
              </div>
              <UptimeBar dailyUptime={service.dailyUptime} uptime={service.uptime} t={t} />
            </div>
          ))}
        </div>

        {/* Past incidents */}
        {recentResolved.length > 0 && (
          <div className="mt-10">
            <h2 className={`text-[14px] font-semibold ${t.text} mb-4`}>Incidentes recentes</h2>
            <div className="space-y-3">
              {recentResolved.map((incident) => (
                <div key={incident.id} className={`rounded-xl border ${t.cardBorder} ${t.card} px-5 py-4`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-[13px] font-semibold ${t.text}`}>{incident.title}</h3>
                    <span className="text-[10px] font-bold text-emerald-500 uppercase">Resolvido</span>
                  </div>
                  <p className={`text-[11px] ${t.textMuted} mb-3`}>{formatIncidentDate(incident.startedAt)}</p>
                  {/* Compact timeline */}
                  <div className="ml-1 space-y-0">
                    {incident.updates.slice(0, 3).map((update, idx) => {
                      const uStatus = incidentStatusConfig[update.status];
                      return (
                        <div key={update.id} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${uStatus.dot}`} />
                            {idx < Math.min(incident.updates.length, 3) - 1 && <div className={`w-px flex-1 ${t.timelineLine} my-1`} />}
                          </div>
                          <div className="pb-2 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold ${uStatus.color}`}>{uStatus.label}</span>
                              <span className={`text-[9px] ${t.textMuted}`}>{formatIncidentTime(update.createdAt)}</span>
                            </div>
                            <p className={`text-[11px] ${t.textSecondary} mt-0.5`}>{update.message}</p>
                          </div>
                        </div>
                      );
                    })}
                    {incident.updates.length > 3 && (
                      <p className={`text-[10px] ${t.textMuted} ml-5`}>+{incident.updates.length - 3} atualizações anteriores</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No incidents message */}
        {activeIncidents.length === 0 && recentResolved.length === 0 && (
          <div className={`mt-8 rounded-xl border ${t.cardBorder} ${t.card} py-8 text-center`}>
            <svg className={`w-5 h-5 mx-auto mb-2 ${t.textMuted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className={`text-[13px] ${t.textSecondary}`}>Nenhum incidente nos últimos 14 dias</p>
          </div>
        )}

        {/* Footer */}
        <div className={`mt-10 pt-5 border-t ${t.divider} flex items-center justify-between`}>
          <p className={`text-[10px] ${t.textMuted}`}>
            Atualizado: {new Date().toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
          </p>
          <a href="https://www.thealert.io" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-1.5 text-[10px] ${t.textMuted} hover:opacity-70 transition-opacity`}>
            Monitorado por
            <span className={`font-bold ${t.textSecondary}`}>TheAlert</span>
          </a>
        </div>
      </div>
    </div>
  );
}