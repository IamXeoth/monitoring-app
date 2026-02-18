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
  checkType: string;
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
  const [checkType, setCheckType] = useState(monitor?.checkType || 'HTTPS');
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
      await onSubmit({ name, url, checkType, interval, isActive: true });
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

  const inputClass =
    'w-full h-11 bg-[#0c0d11] border border-[#2a2e36] rounded-lg px-3.5 text-[13px] text-[#e4e4e7] placeholder-[#3e424a] focus:outline-none focus:border-[#555b66] focus:ring-1 focus:ring-[#555b66]/20 transition-all';
  const labelClass = 'block text-[12px] font-semibold text-[#80838a] uppercase tracking-[0.04em] mb-2';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error */}
      {error && (
        <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-lg bg-red-500/[0.06] border border-red-500/10">
          <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-[12px] text-red-400 font-medium">{error}</p>
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className={labelClass}>
          Nome do monitor
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Meu site principal"
          required
          className={inputClass}
        />
      </div>

      {/* URL */}
      <div>
        <label htmlFor="url" className={labelClass}>
          URL para monitorar
        </label>
        <input
          id="url"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://exemplo.com.br"
          required
          className={`${inputClass} font-mono`}
        />
      </div>

      {/* Type + Interval row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Type */}
        <div>
          <label htmlFor="checkType" className={labelClass}>
            Tipo
          </label>
          <div className="relative">
            <select
              id="checkType"
              value={checkType}
              onChange={(e) => setCheckType(e.target.value)}
              className={`${inputClass} appearance-none pr-9 cursor-pointer`}
            >
              <option value="HTTP">HTTP</option>
              <option value="HTTPS">HTTPS</option>
              <option value="PING">Ping</option>
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3e424a] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Interval */}
        <div>
          <label htmlFor="interval" className={labelClass}>
            Intervalo
          </label>
          <div className="relative">
            <select
              id="interval"
              value={interval}
              onChange={(e) => setInterval(Number(e.target.value))}
              className={`${inputClass} appearance-none pr-9 cursor-pointer`}
            >
              {availableIntervals.map((int) => (
                <option key={int} value={int}>
                  {formatInterval(int)}
                </option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3e424a] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Plan note */}
      {plan === 'FREE' && (
        <p className="flex items-center gap-2 text-[11px] text-[#3e424a] font-medium -mt-1">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Plano FREE permite checagens a cada 5 minutos
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2.5 pt-2">
        <button
          type="submit"
          disabled={loading || !name || !url}
          className="flex-1 h-10 bg-[#e4e4e7] hover:bg-white text-[#0c0d11] rounded-lg text-[13px] font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Salvando...
            </>
          ) : monitor ? (
            'Salvar alterações'
          ) : (
            'Criar monitor'
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="h-10 px-5 bg-transparent border border-[#2a2e36] text-[#80838a] hover:text-[#c8c9cd] hover:border-[#3e424a] rounded-lg text-[13px] font-medium transition-all"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}