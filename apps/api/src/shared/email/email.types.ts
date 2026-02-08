export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export interface MonitorAlertEmail {
  monitorName: string;
  monitorUrl: string;
  status: 'UP' | 'DOWN' | 'DEGRADED';
  timestamp: Date;
  userName: string;
  errorMessage?: string;
  responseTime?: number;
}

export interface DailyReportEmail {
  date: Date;
  totalMonitors: number;
  upMonitors: number;
  downMonitors: number;
  avgUptime: number;
  monitors?: {
    name: string;
    url: string;
    uptime: number;
    avgResponseTime: number;
    status: 'UP' | 'DOWN';
  }[];
}