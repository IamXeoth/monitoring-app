import { Queue, Worker } from 'bullmq';
import { connection } from '../../shared/queue/redis';
import { CheckingService } from './checking.service';
import { prisma } from '../../shared/database/prisma';

const checkingQueue = new Queue('monitor-checking', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    // Evita jobs duplicados com mesmo ID
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
  },
});

const checkingService = new CheckingService();

// Worker que processa os jobs
const worker = new Worker(
  'monitor-checking',
  async (job) => {
    const { monitorId } = job.data;

    console.log(`[Worker] Checking monitor ${monitorId}...`);

    try {
      const result = await checkingService.checkMonitor(monitorId);
      console.log(`[Worker] Monitor ${monitorId}: ${result.status} (${result.responseTime}ms)`);
      return result;
    } catch (error: any) {
      console.error(`[Worker] Error checking monitor ${monitorId}:`, error.message);
      throw error;
    }
  },
  {
    connection,
    concurrency: 10,
  }
);

worker.on('completed', (job) => {
  console.log(`[Worker] Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`[Worker] Job ${job?.id} failed:`, err.message);
});

// Função para adicionar monitor na fila
export async function scheduleMonitorCheck(monitorId: string, delay = 0) {
  const jobId = `check-${monitorId}-${Date.now()}`;
  await checkingQueue.add(
    'check',
    { monitorId },
    {
      delay,
      jobId,
    }
  );
}

// Set para rastrear monitores já agendados neste ciclo
const scheduledInCycle = new Set<string>();

// Função para inicializar o scheduler
export async function startCheckingScheduler() {
  console.log('[Scheduler] Starting monitor checking scheduler...');

  setInterval(async () => {
    try {
      const monitors = await prisma.monitor.findMany({
        where: { isActive: true },
      });

      for (const monitor of monitors) {
        // Verificar quando foi o último check
        const lastCheck = await prisma.check.findFirst({
          where: { monitorId: monitor.id },
          orderBy: { checkedAt: 'desc' },
        });

        const now = Date.now();
        const lastCheckTime = lastCheck ? new Date(lastCheck.checkedAt).getTime() : 0;
        const timeSinceLastCheck = (now - lastCheckTime) / 1000;

        // Se passou o intervalo, agendar check
        if (timeSinceLastCheck >= monitor.interval) {
          // Evita agendar o mesmo monitor múltiplas vezes no mesmo ciclo
          if (!scheduledInCycle.has(monitor.id)) {
            await scheduleMonitorCheck(monitor.id);
            scheduledInCycle.add(monitor.id);
            console.log(`[Scheduler] Scheduled check for monitor ${monitor.id} (${monitor.name})`);

            // Limpa do set após o intervalo do monitor
            setTimeout(() => {
              scheduledInCycle.delete(monitor.id);
            }, monitor.interval * 1000);
          }
        }
      }
    } catch (error) {
      console.error('[Scheduler] Error scheduling checks:', error);
    }
  }, 30000);

  console.log('[Scheduler] Scheduler started!');
}

export { checkingQueue, worker };