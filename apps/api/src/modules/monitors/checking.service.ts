import axios from 'axios';
import { prisma } from '../../shared/database/prisma';

export interface CheckResult {
  status: 'UP' | 'DOWN' | 'DEGRADED';
  responseTime: number;
  statusCode?: number;
  errorMessage?: string;
}

export class CheckingService {
  async checkMonitor(monitorId: string): Promise<CheckResult> {
    const monitor = await prisma.monitor.findUnique({
      where: { id: monitorId },
    });

    if (!monitor) {
      throw new Error('Monitor não encontrado');
    }

    const startTime = Date.now();
    let result: CheckResult;

    try {
      if (monitor.type === 'HTTP' || monitor.type === 'HTTPS') {
        result = await this.checkHttp(monitor.url);
      } else if (monitor.type === 'PING') {
        result = await this.checkPing(monitor.url);
      } else if (monitor.type === 'SSL') {
        result = await this.checkSsl(monitor.url);
      } else {
        result = await this.checkHttp(monitor.url);
      }

      result.responseTime = Date.now() - startTime;
    } catch (error: any) {
      result = {
        status: 'DOWN',
        responseTime: Date.now() - startTime,
        errorMessage: error.message,
      };
    }

    // Salvar check no banco
    await this.saveCheck(monitorId, result);

    // Verificar se precisa criar/resolver incident
    await this.handleIncident(monitorId, result);

    return result;
  }

  private async checkHttp(url: string): Promise<CheckResult> {
    try {
      const response = await axios.get(url, {
        timeout: 10000,
        validateStatus: () => true, // Aceita qualquer status
      });

      const status = response.status >= 200 && response.status < 300 ? 'UP' : 'DEGRADED';

      return {
        status,
        responseTime: 0, // Será calculado no checkMonitor
        statusCode: response.status,
      };
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao fazer requisição HTTP');
    }
  }

  private async checkPing(url: string): Promise<CheckResult> {
    // Simplificado: fazer HTTP request
    return this.checkHttp(url);
  }

  private async checkSsl(url: string): Promise<CheckResult> {
    // Simplificado: verificar se HTTPS responde
    return this.checkHttp(url.replace('http://', 'https://'));
  }

  private async saveCheck(monitorId: string, result: CheckResult) {
    await prisma.check.create({
      data: {
        monitorId,
        status: result.status,
        responseTime: result.responseTime,
        statusCode: result.statusCode,
        checkedAt: new Date(),
      },
    });
  }

  private async handleIncident(monitorId: string, result: CheckResult) {
    // Buscar último incident aberto
    const openIncident = await prisma.incident.findFirst({
      where: {
        monitorId,
        resolvedAt: null,
      },
      orderBy: {
        startedAt: 'desc',
      },
    });

    if (result.status === 'DOWN') {
      // Se não existe incident aberto, criar um novo
      if (!openIncident) {
        await prisma.incident.create({
          data: {
            monitorId,
            status: 'DOWN',
            startedAt: new Date(),
            responseTime: result.responseTime,
            statusCode: result.statusCode,
            errorMessage: result.errorMessage,
          },
        });
      }
    } else {
      // Se está UP e tem incident aberto, resolver
      if (openIncident) {
        await prisma.incident.update({
          where: { id: openIncident.id },
          data: {
            status: 'UP',
            resolvedAt: new Date(),
          },
        });
      }
    }
  }

  async getMonitorStatus(monitorId: string): Promise<'UP' | 'DOWN' | 'UNKNOWN'> {
    // Buscar último check
    const lastCheck = await prisma.check.findFirst({
      where: { monitorId },
      orderBy: { checkedAt: 'desc' },
    });

    if (!lastCheck) return 'UNKNOWN';

    return lastCheck.status === 'UP' ? 'UP' : 'DOWN';
  }

  async getMonitorStats(monitorId: string) {
    // Últimos 100 checks
    const checks = await prisma.check.findMany({
      where: { monitorId },
      orderBy: { checkedAt: 'desc' },
      take: 100,
    });

    const upChecks = checks.filter((c) => c.status === 'UP').length;
    const totalChecks = checks.length;
    const uptime = totalChecks > 0 ? (upChecks / totalChecks) * 100 : 0;

    const avgResponseTime =
      checks.length > 0
        ? checks.reduce((sum, c) => sum + c.responseTime, 0) / checks.length
        : 0;

    return {
      uptime: uptime.toFixed(2),
      avgResponseTime: Math.round(avgResponseTime),
      totalChecks,
      lastCheck: checks[0],
    };
  }
}