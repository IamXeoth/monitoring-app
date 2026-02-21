'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';

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

interface StatusPageData {
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  overallStatus: 'UP' | 'DOWN' | 'UNKNOWN';
  services: Service[];
}

// ─── Tooltip Component ───

function UptimeBar({ dailyUptime, uptime }: { dailyUptime: DayUptime[]; uptime: number }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (idx: number, e: React.MouseEvent) => {
    setHoveredIdx(idx);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = (idx: number, e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const formatBarDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Bars */}
      <div className="flex items-end gap-[2px] h-[34px]">
        {dailyUptime.map((day, i) => {
          let color = 'bg-[#1e2128]';
          if (day.uptime >= 0) {
            if (day.uptime >= 99.5) color = 'bg-emerald-400';
            else if (day.uptime >= 95) color = 'bg-amber-400';
            else if (day.uptime >= 0) color = 'bg-red-400';
          }
          const isHovered = hoveredIdx === i;

          return (
            <div
              key={i}
              onMouseEnter={(e) => handleMouseEnter(i, e)}
              onMouseMove={(e) => handleMouseMove(i, e)}
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
          <div className="bg-[#1a1d23] border border-[#2a2e36] rounded-lg px-3 py-2 whitespace-nowrap" style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
            <p className="text-[11px] font-semibold text-[#e4e4e7] mb-0.5">{formatBarDate(dailyUptime[hoveredIdx].date)}</p>
            {dailyUptime[hoveredIdx].uptime < 0 ? (
              <p className="text-[10px] text-[#3e424a]">Sem dados registrados</p>
            ) : (
              <>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    dailyUptime[hoveredIdx].uptime >= 99.5 ? 'bg-emerald-400' : dailyUptime[hoveredIdx].uptime >= 95 ? 'bg-amber-400' : 'bg-red-400'
                  }`} />
                  <span className={`text-[11px] font-bold tabular-nums ${
                    dailyUptime[hoveredIdx].uptime >= 99.5 ? 'text-emerald-400' : dailyUptime[hoveredIdx].uptime >= 95 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {dailyUptime[hoveredIdx].uptime.toFixed(2)}% uptime
                  </span>
                </div>
                <p className="text-[9px] text-[#3e424a] mt-0.5">{dailyUptime[hoveredIdx].totalChecks} verificações</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Labels */}
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-[10px] text-[#2e323a]">90 dias atrás</span>
        <span className="text-[10px] text-[#555b66] font-semibold tabular-nums">{uptime.toFixed(2)}% uptime</span>
        <span className="text-[10px] text-[#2e323a]">Hoje</span>
      </div>
    </div>
  );
}

// ─── Main Page ───

export default function PublicStatusPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<StatusPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0b0f] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0a0b0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-[#1e2128] flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-[#3e424a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-[16px] font-semibold text-[#555b66]">Página não encontrada</p>
          <p className="text-[13px] text-[#3e424a] mt-1">Esta status page não existe ou não está publicada</p>
        </div>
      </div>
    );
  }

  const statusConfig = {
    UP: { label: 'Todos os sistemas operacionais', color: 'text-emerald-400', bg: 'bg-emerald-500/[0.08]', border: 'border-emerald-500/15', dot: 'bg-emerald-400' },
    DOWN: { label: 'Alguns sistemas com problemas', color: 'text-red-400', bg: 'bg-red-500/[0.08]', border: 'border-red-500/15', dot: 'bg-red-400' },
    UNKNOWN: { label: 'Verificando status...', color: 'text-[#80838a]', bg: 'bg-[#12141a]', border: 'border-[#1e2128]', dot: 'bg-[#555b66]' },
  };

  const overall = statusConfig[data.overallStatus];

  return (
    <div className="min-h-screen bg-[#0a0b0f]">
      {/* Header */}
      <div className="border-b border-[#1e2128]/60">
        <div className="max-w-[680px] mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            {data.logoUrl ? (
              <img src={data.logoUrl} alt="" className="w-8 h-8 rounded-lg" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-[#1e2128] flex items-center justify-center">
                <span className="text-[12px] font-bold text-[#555b66]">{data.name.charAt(0)}</span>
              </div>
            )}
            <h1 className="text-[18px] font-semibold text-[#e4e4e7] tracking-tight">{data.name}</h1>
          </div>
          {data.description && (
            <p className="text-[13px] text-[#3e424a] mt-2 ml-11">{data.description}</p>
          )}
        </div>
      </div>

      <div className="max-w-[680px] mx-auto px-6 py-8">
        {/* Overall status banner */}
        <div className={`rounded-xl ${overall.bg} border ${overall.border} px-5 py-4 mb-8`}>
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${overall.dot} ${data.overallStatus === 'DOWN' ? 'animate-pulse' : ''}`} />
            <p className={`text-[14px] font-semibold ${overall.color}`}>{overall.label}</p>
          </div>
        </div>

        {/* Services */}
        <div className="space-y-3">
          {data.services.map((service, idx) => (
            <div key={idx} className="rounded-xl border border-[#1e2128] bg-[#12141a] px-5 pt-4 pb-3">
              {/* Service header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    service.status === 'UP' ? 'bg-emerald-400' : service.status === 'DOWN' ? 'bg-red-400 animate-pulse' : 'bg-[#555b66]'
                  }`} />
                  <span className="text-[13px] font-semibold text-[#e4e4e7]">{service.name}</span>
                </div>
                <span className={`text-[12px] font-semibold ${
                  service.status === 'UP' ? 'text-emerald-400' : service.status === 'DOWN' ? 'text-red-400' : 'text-[#555b66]'
                }`}>
                  {service.status === 'UP' ? 'Operacional' : service.status === 'DOWN' ? 'Fora do ar' : '—'}
                </span>
              </div>

              {/* 90-day uptime bars */}
              <UptimeBar dailyUptime={service.dailyUptime} uptime={service.uptime} />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 pt-5 border-t border-[#1e2128]/60 flex items-center justify-between">
          <p className="text-[10px] text-[#2e323a]">
            Atualizado: {new Date().toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
          </p>
          <a href="https://www.thealert.io" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px] text-[#2e323a] hover:text-[#555b66] transition-colors">
            Monitorado por
            <span className="font-bold text-[#3e424a]">TheAlert</span>
          </a>
        </div>
      </div>
    </div>
  );
}