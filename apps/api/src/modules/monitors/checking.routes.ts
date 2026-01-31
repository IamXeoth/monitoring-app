import { FastifyInstance } from 'fastify';
import { CheckingService } from './checking.service';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';
import { scheduleMonitorCheck } from './checking.queue';

export async function checkingRoutes(fastify: FastifyInstance) {
  const checkingService = new CheckingService();

  // Todas as rotas precisam de autenticação
  fastify.addHook('preHandler', authMiddleware);

  // GET /monitors/:id/status - Buscar status atual
  fastify.get('/monitors/:id/status', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const status = await checkingService.getMonitorStatus(id);

      return reply.send({
        data: { status },
      });
    } catch (error: any) {
      return reply.status(500).send({
        error: error.message || 'Erro ao buscar status',
      });
    }
  });

  // GET /monitors/:id/stats - Buscar estatísticas
  fastify.get('/monitors/:id/stats', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const stats = await checkingService.getMonitorStats(id);

      return reply.send({
        data: stats,
      });
    } catch (error: any) {
      return reply.status(500).send({
        error: error.message || 'Erro ao buscar estatísticas',
      });
    }
  });

  // POST /monitors/:id/check - Forçar check manual
  fastify.post('/monitors/:id/check', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      
      // Agendar check imediato
      await scheduleMonitorCheck(id, 0);

      return reply.send({
        message: 'Check agendado com sucesso',
      });
    } catch (error: any) {
      return reply.status(500).send({
        error: error.message || 'Erro ao agendar check',
      });
    }
  });

  // GET /monitors/:id/checks - Buscar histórico de checks
  fastify.get('/monitors/:id/checks', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const { limit = '50' } = request.query as { limit?: string };

      const checks = await fastify.prisma.check.findMany({
        where: { monitorId: id },
        orderBy: { checkedAt: 'desc' },
        take: Number(limit),
      });

      return reply.send({
        data: checks,
      });
    } catch (error: any) {
      return reply.status(500).send({
        error: error.message || 'Erro ao buscar checks',
      });
    }
  });

  // GET /monitors/:id/incidents - Buscar incidents
  fastify.get('/monitors/:id/incidents', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };

      const incidents = await fastify.prisma.incident.findMany({
        where: { monitorId: id },
        orderBy: { startedAt: 'desc' },
        take: 20,
      });

      return reply.send({
        data: incidents,
      });
    } catch (error: any) {
      return reply.status(500).send({
        error: error.message || 'Erro ao buscar incidents',
      });
    }
  });
}