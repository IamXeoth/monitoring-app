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
  const [type, setType] = useState<CreateMonitorInput['type']>(monitor?.type || 'HTTPS');
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Nome do Monitor</Label>
        <Input
          id="name"
          placeholder="Ex: Site Principal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">URL para Monitorar</Label>
        <Input
          id="url"
          type="url"
          placeholder="https://exemplo.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Tipo de Monitor</Label>
        <Select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as CreateMonitorInput['type'])}
        >
          <option value="HTTP">HTTP</option>
          <option value="HTTPS">HTTPS</option>
          <option value="SSL">SSL Certificate</option>
          <option value="DOMAIN">Domain</option>
          <option value="PING">Ping</option>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="interval">Intervalo de Checagem</Label>
        <Select
          id="interval"
          value={interval}
          onChange={(e) => setInterval(Number(e.target.value))}
        >
          {availableIntervals.map((int) => (
            <option key={int} value={int}>
              {formatInterval(int)}
            </option>
          ))}
        </Select>
        <p className="text-xs text-muted-foreground">
          Plano FREE permite apenas checagens a cada 5 minutos
        </p>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Salvando...' : monitor ? 'Atualizar Monitor' : 'Criar Monitor'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}