'use client';

import { Monitor } from '@/types/monitor';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface MonitorCardProps {
  monitor: Monitor;
  onEdit: (monitor: Monitor) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export function MonitorCard({ monitor, onEdit, onDelete, onToggle }: MonitorCardProps) {
  const formatInterval = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}min`;
    return `${Math.floor(seconds / 3600)}h`;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      HTTP: '🌐',
      HTTPS: '🔒',
      SSL: '🔐',
      DOMAIN: '🌍',
      PING: '📡',
    };
    return icons[type as keyof typeof icons] || '🌐';
  };

  const getStatusBadge = () => {
    if (!monitor.isActive) {
      return <Badge variant="secondary">Pausado</Badge>;
    }

    if (!monitor.currentStatus || monitor.currentStatus === 'UNKNOWN') {
      return <Badge variant="warning">Checando...</Badge>;
    }

    if (monitor.currentStatus === 'UP') {
      return <Badge variant="success">✓ UP</Badge>;
    }

    return <Badge variant="error">✗ DOWN</Badge>;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{getTypeIcon(monitor.type)}</span>
              <h3 className="text-lg font-semibold">{monitor.name}</h3>
              {getStatusBadge()}
            </div>
            <p className="text-sm text-muted-foreground mb-2">{monitor.url}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Tipo: {monitor.type}</span>
              <span>•</span>
              <span>Intervalo: {formatInterval(monitor.interval)}</span>
              {monitor.stats && (
                <>
                  <span>•</span>
                  <span>Uptime: {monitor.stats.uptime}%</span>
                  <span>•</span>
                  <span>Resp: {monitor.stats.avgResponseTime}ms</span>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggle(monitor.id)}
            >
              {monitor.isActive ? '⏸️ Pausar' : '▶️ Retomar'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(monitor)}
            >
              ✏️ Editar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(monitor.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
            >
              🗑️ Deletar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
