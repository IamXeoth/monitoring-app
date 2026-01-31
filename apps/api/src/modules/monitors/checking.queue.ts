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
    concurrency: 10, // Processar até 10 monitores em paralelo
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
  await checkingQueue.add(
    'check',
    { monitorId },
    {
      delay,
      jobId: `check-${monitorId}-${Date.now()}`,
    }
  );
}

// Função para inicializar o scheduler
export async function startCheckingScheduler() {
  console.log('[Scheduler] Starting monitor checking scheduler...');

  // A cada 30 segundos, buscar monitores ativos e agendar checks
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
        const timeSinceLastCheck = (now - lastCheckTime) / 1000; // em segundos

        // Se passou o intervalo, agendar check
        if (timeSinceLastCheck >= monitor.interval) {
          await scheduleMonitorCheck(monitor.id);
          console.log(`[Scheduler] Scheduled check for monitor ${monitor.id} (${monitor.name})`);
        }
      }
    } catch (error) {
      console.error('[Scheduler] Error scheduling checks:', error);
    }
  }, 30000); // Verificar a cada 30 segundos

  console.log('[Scheduler] Scheduler started!');
}

export { checkingQueue, worker };