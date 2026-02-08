import axios from 'axios';
import { prisma } from '../../shared/database/prisma';
import { emailService } from '../../shared/email/email.service';

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
        statusCode: result.statusCode,
        responseTime: result.responseTime,
        isUp: result.status === 'UP',
        errorMessage: result.errorMessage,
        checkedAt: new Date(),
      },
    });
  }

  private async handleIncident(monitorId: string, result: CheckResult) {
    // Buscar monitor com informações do usuário
    const monitor = await prisma.monitor.findUnique({
      where: { id: monitorId },
      include: {
        user: true,
      },
    });

    if (!monitor) return;

    // Buscar último incident aberto
    const openIncident = await prisma.incident.findFirst({
      where: {
        monitorId,
        isResolved: false,
      },
      orderBy: {
        startedAt: 'desc',
      },
    });

    if (result.status === 'DOWN') {
      // Se não existe incident aberto, criar um novo E enviar email
      if (!openIncident) {
        await prisma.incident.create({
          data: {
            monitorId,
            severity: 'HIGH',
            title: `${monitor.name} está DOWN`,
            description: result.errorMessage || 'Monitor fora do ar',
            startedAt: new Date(),
            isResolved: false,
          },
        });

        // Enviar email de alerta DOWN
        await emailService.sendMonitorDownAlert(monitor.user.email, {
          monitorName: monitor.name,
          monitorUrl: monitor.url,
          status: 'DOWN',
          timestamp: new Date(),
          userName: monitor.user.name,
          errorMessage: result.errorMessage,
        });
      }
    } else {
      // Se está UP e tem incident aberto, resolver E enviar email
      if (openIncident) {
        const resolvedAt = new Date();
        const downtimeMs = resolvedAt.getTime() - new Date(openIncident.startedAt).getTime();
        const downtimeMinutes = Math.round(downtimeMs / 1000 / 60);

        await prisma.incident.update({
          where: { id: openIncident.id },
          data: {
            severity: 'LOW',
            resolvedAt,
            isResolved: true,
          },
        });

        // Enviar email de alerta UP
        await emailService.sendMonitorUpAlert(monitor.user.email, {
          monitorName: monitor.name,
          monitorUrl: monitor.url,
          status: 'UP',
          timestamp: resolvedAt,
          userName: monitor.user.name,
          responseTime: result.responseTime,
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

    return lastCheck.isUp ? 'UP' : 'DOWN';
  }

  async getMonitorStats(monitorId: string) {
    // Últimos 100 checks
    const checks = await prisma.check.findMany({
      where: { monitorId },
      orderBy: { checkedAt: 'desc' },
      take: 100,
    });

    const upChecks = checks.filter((c) => c.isUp).length;
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
