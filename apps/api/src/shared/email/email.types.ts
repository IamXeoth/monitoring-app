export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export interface MonitorAlertEmail {
  monitorName: string;
  monitorUrl: string;
  status: 'UP' | 'DOWN';
  timestamp: Date;
  userName: string;
  responseTime?: number;
  errorMessage?: string;
}

export interface DailyReportEmail {
  userName: string;
  date: Date;
  totalMonitors: number;
  upMonitors: number;
  downMonitors: number;
  avgUptime: number;
  monitors: Array<{
    name: string;
    url: string;
    uptime: number;
    avgResponseTime: number;
  }>;
}