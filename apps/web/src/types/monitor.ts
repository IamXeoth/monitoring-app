export interface Monitor {
  id: string;
  userId: string;
  name: string;
  url: string;
  type: 'HTTP' | 'HTTPS' | 'SSL' | 'DOMAIN' | 'PING';
  interval: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Campos adicionais que vamos buscar
  currentStatus?: 'UP' | 'DOWN' | 'UNKNOWN';
  stats?: {
    uptime: string;
    avgResponseTime: number;
    totalChecks: number;
  };
}

export interface CreateMonitorInput {
  name: string;
  url: string;
  type: 'HTTP' | 'HTTPS' | 'SSL' | 'DOMAIN' | 'PING';
  interval: number;
}

export interface UpdateMonitorInput {
  name?: string;
  url?: string;
  type?: 'HTTP' | 'HTTPS' | 'SSL' | 'DOMAIN' | 'PING';
  interval?: number;
  isActive?: boolean;
}