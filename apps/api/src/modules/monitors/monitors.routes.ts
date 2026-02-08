import { FastifyInstance } from 'fastify';
import { MonitorsService } from './monitors.service';
import { createMonitorSchema, updateMonitorSchema } from './monitors.schemas';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';
import { scheduleMonitorCheck } from './checking.queue';

export async function monitorsRoutes(fastify: FastifyInstance) {
  const monitorsService = new MonitorsService();

  // Todas as rotas precisam de autenticação
  fastify.addHook('preHandler', authMiddleware);

  // GET /monitors - Listar todos os monitores do usuário
  fastify.get('/monitors', async (request, reply) => {
    try {
      const userId = (request as any).userId;
      const monitors = await monitorsService.findAll(userId);

      return reply.send({
        data: monitors,
      });
    } catch (error: any) {
      return reply.status(500).send({
        error: error.message || 'Erro ao listar monitores',
      });
    }
  });

  // GET /monitors/:id - Buscar monitor específico
  fastify.get('/monitors/:id', async (request, reply) => {
    try {
      const userId = (request as any).userId;
      const { id } = request.params as { id: string };
      const monitor = await monitorsService.findOne(userId, id);

      return reply.send({
        data: monitor,
      });
    } catch (error: any) {
      const statusCode = error.message === 'Monitor não encontrado' ? 404 : 500;
      return reply.status(statusCode).send({
        error: error.message,
      });
    }
  });

  // POST /monitors - Criar novo monitor
  fastify.post('/monitors', async (request, reply) => {
    try {
      const userId = (request as any).userId;
      const parsed = createMonitorSchema.safeParse(request.body);

      if (!parsed.success) {
        return reply.status(400).send({
          error: 'Dados inválidos',
          details: parsed.error.flatten().fieldErrors,
        });
      }

      const monitor = await monitorsService.create(userId, parsed.data);

      // Agendar primeiro check imediatamente
      await scheduleMonitorCheck(monitor.id, 0);

      return reply.status(201).send({
        data: monitor,
        message: 'Monitor criado com sucesso',
      });
    } catch (error: any) {
      const statusCode = error.message.includes('Limite') ? 403 : 500;
      return reply.status(statusCode).send({
        error: error.message,
      });
    }
  });

  // PUT /monitors/:id - Atualizar monitor
  fastify.put('/monitors/:id', async (request, reply) => {
    try {
      const userId = (request as any).userId;
      const { id } = request.params as { id: string };
      const parsed = updateMonitorSchema.safeParse(request.body);

      if (!parsed.success) {
        return reply.status(400).send({
          error: 'Dados inválidos',
          details: parsed.error.flatten().fieldErrors,
        });
      }

      const monitor = await monitorsService.update(userId, id, parsed.data);

      return reply.send({
        data: monitor,
        message: 'Monitor atualizado com sucesso',
      });
    } catch (error: any) {
      const statusCode = error.message === 'Monitor não encontrado' ? 404 : 500;
      return reply.status(statusCode).send({
        error: error.message,
      });
    }
  });

  // DELETE /monitors/:id - Deletar monitor
  fastify.delete('/monitors/:id', async (request, reply) => {
    try {
      const userId = (request as any).userId;
      const { id } = request.params as { id: string };
      const result = await monitorsService.delete(userId, id);

      return reply.send(result);
    } catch (error: any) {
      const statusCode = error.message === 'Monitor não encontrado' ? 404 : 500;
      return reply.status(statusCode).send({
        error: error.message,
      });
    }
  });

  // PATCH /monitors/:id/toggle - Ativar/Desativar monitor
  fastify.patch('/monitors/:id/toggle', async (request, reply) => {
    try {
      const userId = (request as any).userId;
      const { id } = request.params as { id: string };
      const monitor = await monitorsService.toggleActive(userId, id);

      return reply.send({
        data: monitor,
        message: `Monitor ${monitor.isActive ? 'ativado' : 'desativado'} com sucesso`,
      });
    } catch (error: any) {
      const statusCode = error.message === 'Monitor não encontrado' ? 404 : 500;
      return reply.status(statusCode).send({
        error: error.message,
      });
    }
  });
}