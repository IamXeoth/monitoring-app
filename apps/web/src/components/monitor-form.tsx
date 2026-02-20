'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';

interface Monitor {
  id: string;
  name: string;
  url: string;
  checkType: string;
  interval: number;
  isActive: boolean;
}

interface CreateMonitorInput {
  name: string;
  url: string;
  type: string;
  interval: number;
  isActive?: boolean;
}

interface MonitorFormProps {
  monitor?: Monitor;
  onSubmit: (data: CreateMonitorInput) => Promise<void>;
  onCancel: () => void;
}

const PLAN_INTERVALS: Record<string, number[]> = {
  FREE: [300],
  STARTER: [180, 300],
  PRO: [30, 60, 180, 300],
  BUSINESS: [30, 60, 180, 300],
};

export function MonitorForm({ monitor, onSubmit, onCancel }: MonitorFormProps) {
  const { user } = useAuth();
  const [name, setName] = useState(monitor?.name || '');
  const [url, setUrl] = useState(monitor?.url || '');
  const [type, setType] = useState(monitor?.checkType || 'HTTPS');
  const [interval, setInterval] = useState(monitor?.interval || 300);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const plan = user?.subscription?.plan || 'FREE';
  const availableIntervals = PLAN_INTERVALS[plan] || PLAN_INTERVALS.FREE;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit({ name, url, type, interval, isActive: true });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao salvar monitor');
    } finally {
      setLoading(false);
    }
  };

  const formatInterval = (seconds: number) => {
    if (seconds < 60) return `${seconds} segundos`;
    return `${Math.floor(seconds / 60)} minutos`;
  };

  const handleUrlChange = (val: string) => {
    setUrl(val);
    if (val.startsWith('https://') || val.startsWith('https:')) {
      setType('HTTPS');
    } else if (val.startsWith('http://') || val.startsWith('http:')) {
      setType('HTTP');
    }
  };

  const handleUrlBlur = () => {
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      setUrl(`https://${url}`);
      setType('HTTPS');
    }
  };

  const inputBase = 'w-full h-11 bg-[#0a0b0f] border border-[#1e2128] rounded-xl text-[13px] text-[#e4e4e7] placeholder-[#2e323a] focus:outline-none focus:border-[#3e424a] focus:bg-[#0c0d11] transition-all';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error */}
      {error && (
        <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-red-500/[0.06] border border-red-500/10">
          <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-[12px] text-red-400 font-medium">{error}</p>
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-[11px] font-semibold text-[#555b66] uppercase tracking-[0.06em] mb-2">
          Nome do monitor
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Meu site principal"
          required
          autoFocus
          className={`${inputBase} px-4`}
        />
      </div>

      {/* URL */}
      <div>
        <label htmlFor="url" className="block text-[11px] font-semibold text-[#555b66] uppercase tracking-[0.06em] mb-2">
          URL para monitorar
        </label>
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-3.5 h-3.5 text-[#2e323a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <input
            id="url"
            type="text"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            onBlur={handleUrlBlur}
            placeholder="meusite.com.br"
            required
            className={`${inputBase} pl-10 pr-20 font-mono`}
          />
          {url && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider ${
                type === 'HTTPS'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/10'
              }`}>
                {type === 'HTTPS' && (
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
                {type}
              </span>
            </div>
          )}
        </div>
        {url && (
          <p className="text-[10px] text-[#2e323a] mt-1.5 ml-0.5">
            Protocolo detectado automaticamente
          </p>
        )}
      </div>

      {/* Interval */}
      <div>
        <label htmlFor="interval" className="block text-[11px] font-semibold text-[#555b66] uppercase tracking-[0.06em] mb-2">
          Intervalo de checagem
        </label>
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-3.5 h-3.5 text-[#2e323a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <select
            id="interval"
            value={interval}
            onChange={(e) => setInterval(Number(e.target.value))}
            className={`${inputBase} pl-10 pr-10 appearance-none cursor-pointer`}
          >
            {availableIntervals.map((int) => (
              <option key={int} value={int}>
                {formatInterval(int)}
              </option>
            ))}
          </select>
          <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2e323a] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Plan note */}
      {plan === 'FREE' && (
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#0a0b0f] border border-[#1e2128]">
          <svg className="w-3.5 h-3.5 text-[#3e424a] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-[10px] text-[#3e424a] font-medium">
            Plano FREE — checagens a cada 5 minutos.{' '}
            <span className="text-emerald-400/50 hover:text-emerald-400 cursor-pointer transition-colors">Fazer upgrade</span>
          </p>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-[#1e2128]/50 !mt-5 !mb-1" />

      {/* Actions */}
      <div className="flex items-center gap-2.5 !mt-4">
        <button
          type="submit"
          disabled={loading || !name || !url}
          className="flex-1 h-10 bg-[#e4e4e7] hover:bg-white text-[#0c0d11] rounded-xl text-[13px] font-semibold transition-all disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Salvando...
            </>
          ) : monitor ? (
            'Salvar alterações'
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Criar monitor
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="h-10 px-5 bg-transparent border border-[#1e2128] text-[#555b66] hover:text-[#80838a] hover:border-[#2a2e36] rounded-xl text-[13px] font-medium transition-all"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}