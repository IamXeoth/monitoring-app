'use client';

import { useState, useEffect } from 'react';
import { Monitor, CreateMonitorInput } from '@/types/monitor';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select } from './ui/select';

interface MonitorFormProps {
  monitor?: Monitor;
  onSubmit: (data: CreateMonitorInput) => Promise<void>;
  onCancel: () => void;
}

const PLAN_INTERVALS = {
  FREE: [300], // 5 min
  STARTER: [60, 300], // 1 min, 5 min
  PRO: [30, 60, 300], // 30s, 1 min, 5 min
  BUSINESS: [30, 60, 300], // 30s, 1 min, 5 min
};

export function MonitorForm({ monitor, onSubmit, onCancel }: MonitorFormProps) {
  const [name, setName] = useState(monitor?.name || '');
  const [url, setUrl] = useState(monitor?.url || '');
  const [type, setType] = useState<CreateMonitorInput['type']>(monitor?.checkType || 'HTTPS');
  const [interval, setInterval] = useState(monitor?.interval || 300);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Por enquanto, assumir plano FREE (depois pegar do contexto)
  const availableIntervals = PLAN_INTERVALS.FREE;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit({ name, url, type, interval });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao salvar monitor');
    } finally {
      setLoading(false);
    }
  };

  const formatInterval = (seconds: number) => {
    if (seconds < 60) return `${seconds} segundos`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutos`;
    return `${Math.floor(seconds / 3600)} horas`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/20 p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-[#ef4444] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-[#ef4444]">{error}</p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name" className="text-[#f3f2f1] text-sm font-medium">
          Nome do Monitor
        </Label>
        <Input
          id="name"
          placeholder="Ex: Site Principal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="bg-[#0b0c10] border-[#27272a] text-[#f3f2f1] placeholder-[#71717a] focus:border-[#f3f2f1]/30 focus:ring-[#f3f2f1]/20 rounded-lg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="url" className="text-[#f3f2f1] text-sm font-medium">
          URL para Monitorar
        </Label>
        <Input
          id="url"
          type="url"
          placeholder="https://exemplo.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="bg-[#0b0c10] border-[#27272a] text-[#f3f2f1] placeholder-[#71717a] focus:border-[#f3f2f1]/30 focus:ring-[#f3f2f1]/20 rounded-lg font-mono text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type" className="text-[#f3f2f1] text-sm font-medium">
          Tipo de Monitor
        </Label>
        <Select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as CreateMonitorInput['type'])}
          className="bg-[#0b0c10] border-[#27272a] text-[#f3f2f1] focus:border-[#f3f2f1]/30 focus:ring-[#f3f2f1]/20 rounded-lg"
        >
          <option value="HTTP" className="bg-[#1a1b1e]">HTTP</option>
          <option value="HTTPS" className="bg-[#1a1b1e]">HTTPS</option>
          <option value="SSL" className="bg-[#1a1b1e]">SSL Certificate</option>
          <option value="DOMAIN" className="bg-[#1a1b1e]">Domain</option>
          <option value="PING" className="bg-[#1a1b1e]">Ping</option>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="interval" className="text-[#f3f2f1] text-sm font-medium">
          Intervalo de Checagem
        </Label>
        <Select
          id="interval"
          value={interval}
          onChange={(e) => setInterval(Number(e.target.value))}
          className="bg-[#0b0c10] border-[#27272a] text-[#f3f2f1] focus:border-[#f3f2f1]/30 focus:ring-[#f3f2f1]/20 rounded-lg"
        >
          {availableIntervals.map((int) => (
            <option key={int} value={int} className="bg-[#1a1b1e]">
              {formatInterval(int)}
            </option>
          ))}
        </Select>
        <p className="text-xs text-[#71717a] flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Plano FREE permite apenas checagens a cada 5 minutos
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <Button 
          type="submit" 
          disabled={loading} 
          className="flex-1 bg-[#f3f2f1] hover:bg-[#e5e4e2] text-[#18181B] font-medium rounded-lg disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Salvando...
            </span>
          ) : (
            monitor ? 'Atualizar Monitor' : 'Criar Monitor'
          )}
        </Button>
        <Button 
          type="button" 
          onClick={onCancel}
          className="bg-transparent border border-[#27272a] text-[#a1a1aa] hover:text-[#f3f2f1] hover:bg-[#27272a]/30 rounded-lg"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
