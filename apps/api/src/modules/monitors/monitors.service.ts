import { prisma } from '../../shared/database/prisma';
import { getPlanLimits, validateInterval } from '../../shared/utils/plan-limits';
import type { CreateMonitorInput, UpdateMonitorInput } from './monitors.schemas';

export class MonitorsService {
  async create(userId: string, data: CreateMonitorInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
        monitors: true,
      },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const plan = user.subscription?.plan || 'FREE';
    const limits = getPlanLimits(plan);

    if (user.monitors.length >= limits.maxMonitors) {
      throw new Error(
        `Limite de ${limits.maxMonitors} monitores atingido para o plano ${plan}`
      );
    }

    if (!validateInterval(plan, data.interval)) {
      throw new Error(
        `Intervalo mínimo para o plano ${plan} é ${limits.minInterval} segundos`
      );
    }

    // Prisma usa 'checkType' no model que mapeia para 'type' no banco
    const monitor = await prisma.monitor.create({
      data: {
        userId,
        name: data.name,
        url: data.url,
        checkType: data.type,
        interval: data.interval,
        isActive: true,
      },
    });

    return monitor;
  }

  async findAll(userId: string) {
    const monitors = await prisma.monitor.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return monitors;
  }

  async findOne(userId: string, monitorId: string) {
    const monitor = await prisma.monitor.findFirst({
      where: {
        id: monitorId,
        userId,
      },
      include: {
        _count: {
          select: {
            checks: true,
            incidents: true,
          },
        },
      },
    });

    if (!monitor) {
      throw new Error('Monitor não encontrado');
    }

    return monitor;
  }

  async update(userId: string, monitorId: string, data: UpdateMonitorInput) {
    const existingMonitor = await prisma.monitor.findFirst({
      where: {
        id: monitorId,
        userId,
      },
    });

    if (!existingMonitor) {
      throw new Error('Monitor não encontrado');
    }

    if (data.interval !== undefined) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { subscription: true },
      });

      const plan = user?.subscription?.plan || 'FREE';

      if (!validateInterval(plan, data.interval)) {
        const limits = getPlanLimits(plan);
        throw new Error(
          `Intervalo mínimo para o plano ${plan} é ${limits.minInterval} segundos`
        );
      }
    }

    // Separar 'type' do resto dos dados para mapear corretamente
    const { type, ...rest } = data;
    const monitor = await prisma.monitor.update({
      where: { id: monitorId },
      data: {
        ...rest,
        ...(type !== undefined ? { checkType: type } : {}),
      },
    });

    return monitor;
  }

  async delete(userId: string, monitorId: string) {
    const existingMonitor = await prisma.monitor.findFirst({
      where: {
        id: monitorId,
        userId,
      },
    });

    if (!existingMonitor) {
      throw new Error('Monitor não encontrado');
    }

    await prisma.monitor.delete({
      where: { id: monitorId },
    });

    return { message: 'Monitor deletado com sucesso' };
  }

  async toggleActive(userId: string, monitorId: string) {
    const monitor = await this.findOne(userId, monitorId);

    const updated = await prisma.monitor.update({
      where: { id: monitorId },
      data: { isActive: !monitor.isActive },
    });

    return updated;
  }
}