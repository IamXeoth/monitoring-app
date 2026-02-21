'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';

interface Service {
  name: string;
  status: 'UP' | 'DOWN' | 'UNKNOWN';
  uptime: number;
  responseTime: number;
  dailyUptime: { date: string; uptime: number; totalChecks: number }[];
}

interface StatusPageData {
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  overallStatus: 'UP' | 'DOWN' | 'UNKNOWN';
  services: Service[];
}

export default function PublicStatusPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<StatusPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 60000); // Refresh every 60s
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
    UP: { label: 'Todos os sistemas operacionais', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/15', dot: 'bg-emerald-400' },
    DOWN: { label: 'Alguns sistemas com problemas', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/15', dot: 'bg-red-400' },
    UNKNOWN: { label: 'Verificando status...', color: 'text-[#80838a]', bg: 'bg-[#1e2128]', border: 'border-[#2a2e36]', dot: 'bg-[#555b66]' },
  };

  const overall = statusConfig[data.overallStatus];

  return (
    <div className="min-h-screen bg-[#0a0b0f]">
      {/* Header */}
      <div className="border-b border-[#1e2128]">
        <div className="max-w-3xl mx-auto px-6 py-6">
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
            <p className="text-[13px] text-[#3e424a] mt-2">{data.description}</p>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Overall status banner */}
        <div className={`rounded-xl ${overall.bg} border ${overall.border} p-5 mb-8`}>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${overall.dot} ${data.overallStatus === 'DOWN' ? 'animate-pulse' : ''}`} />
            <p className={`text-[15px] font-semibold ${overall.color}`}>{overall.label}</p>
          </div>
        </div>

        {/* Services */}
        <div className="space-y-1">
          {data.services.map((service, idx) => (
            <div key={idx} className="rounded-xl border border-[#1e2128] bg-[#12141a] p-5">
              {/* Service header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full ${
                    service.status === 'UP' ? 'bg-emerald-400' : service.status === 'DOWN' ? 'bg-red-400 animate-pulse' : 'bg-[#555b66]'
                  }`} />
                  <span className="text-[14px] font-semibold text-[#e4e4e7]">{service.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[11px] text-[#3e424a] font-mono tabular-nums">{service.responseTime}ms</span>
                  <span className={`text-[11px] font-bold ${
                    service.status === 'UP' ? 'text-emerald-400' : service.status === 'DOWN' ? 'text-red-400' : 'text-[#555b66]'
                  }`}>
                    {service.status === 'UP' ? 'Operacional' : service.status === 'DOWN' ? 'Fora do ar' : '—'}
                  </span>
                </div>
              </div>

              {/* 90-day uptime bar */}
              <div className="flex items-end gap-[1.5px] h-8 mb-2">
                {service.dailyUptime.map((day, i) => {
                  let color = 'bg-[#1e2128]'; // no data
                  if (day.uptime >= 0) {
                    if (day.uptime >= 99) color = 'bg-emerald-400';
                    else if (day.uptime >= 95) color = 'bg-amber-400';
                    else color = 'bg-red-400';
                  }
                  return (
                    <div key={i} className="flex-1 group relative">
                      <div
                        className={`w-full h-full rounded-[1px] ${color} transition-opacity hover:opacity-80`}
                        style={{ opacity: day.uptime < 0 ? 0.15 : 0.6 }}
                      />
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-10 pointer-events-none">
                        <div className="bg-[#1a1d23] border border-[#2a2e36] rounded-md px-2.5 py-1.5 whitespace-nowrap" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>
                          <p className="text-[10px] font-bold text-[#e4e4e7]">{day.date}</p>
                          <p className="text-[9px] text-[#3e424a] mt-0.5">
                            {day.uptime < 0 ? 'Sem dados' : `${day.uptime.toFixed(1)}% uptime`}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#2e323a]">90 dias atrás</span>
                <span className="text-[10px] text-[#3e424a] font-bold tabular-nums">{service.uptime.toFixed(2)}% uptime</span>
                <span className="text-[10px] text-[#2e323a]">Hoje</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-[#1e2128] flex items-center justify-between">
          <p className="text-[10px] text-[#2e323a]">
            Última atualização: {new Date().toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
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