import { FastifyInstance } from 'fastify';
import { MonitorsService } from './monitors.service';
import { createMonitorSchema, updateMonitorSchema } from './monitors.schemas';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';

export async function monitorsRoutes(fastify: FastifyInstance) {
  const monitorsService = new MonitorsService();

  // Todas as rotas precisam de autenticação
  fastify.addHook('preHandler', authMiddleware);

  // GET /monitors - Listar todos os monitores do usuário
  fastify.get('/monitors', async (request, reply) => {
    try {
      const monitors = await monitorsService.findAll(request.userId);

      return reply.send({
        data: monitors,
      });
    } catch (error: any) {
      return reply.status(500).send({
        error: error.message || 'Erro ao buscar monitores',
      });
    }
  });

  // GET /monitors/:id - Buscar um monitor específico
  fastify.get('/monitors/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const monitor = await monitorsService.findOne(request.userId, id);

      return reply.send({
        data: monitor,
      });
    } catch (error: any) {
      return reply.status(404).send({
        error: error.message || 'Monitor não encontrado',
      });
    }
  });

  // POST /monitors - Criar novo monitor
  fastify.post('/monitors', async (request, reply) => {
    try {
      const data = createMonitorSchema.parse(request.body);
      const monitor = await monitorsService.create(request.userId, data);

      return reply.status(201).send({
        message: 'Monitor criado com sucesso',
        data: monitor,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          error: 'Dados inválidos',
          details: error.errors,
        });
      }

      return reply.status(400).send({
        error: error.message || 'Erro ao criar monitor',
      });
    }
  });

  // PUT /monitors/:id - Atualizar monitor
  fastify.put('/monitors/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const data = updateMonitorSchema.parse(request.body);
      const monitor = await monitorsService.update(request.userId, id, data);

      return reply.send({
        message: 'Monitor atualizado com sucesso',
        data: monitor,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          error: 'Dados inválidos',
          details: error.errors,
        });
      }

      return reply.status(400).send({
        error: error.message || 'Erro ao atualizar monitor',
      });
    }
  });

  // DELETE /monitors/:id - Deletar monitor
  fastify.delete('/monitors/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const result = await monitorsService.delete(request.userId, id);

      return reply.send(result);
    } catch (error: any) {
      return reply.status(404).send({
        error: error.message || 'Erro ao deletar monitor',
      });
    }
  });

  // PATCH /monitors/:id/toggle - Ativar/Desativar monitor
  fastify.patch('/monitors/:id/toggle', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const monitor = await monitorsService.toggleActive(request.userId, id);

      return reply.send({
        message: `Monitor ${monitor.isActive ? 'ativado' : 'desativado'} com sucesso`,
        data: monitor,
      });
    } catch (error: any) {
      return reply.status(404).send({
        error: error.message || 'Erro ao alternar status do monitor',
      });
    }
  });
}