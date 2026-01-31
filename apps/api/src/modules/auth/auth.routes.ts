import { FastifyInstance } from 'fastify';
import { AuthService } from './auth.service';
import { registerSchema, loginSchema } from './auth.schemas';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';

export async function authRoutes(fastify: FastifyInstance) {
  const authService = new AuthService();

  // POST /auth/register
  fastify.post('/auth/register', async (request, reply) => {
    try {
      const data = registerSchema.parse(request.body);
      const result = await authService.register(data);

      return reply.status(201).send({
        message: 'Usuário criado com sucesso',
        data: result,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          error: 'Dados inválidos',
          details: error.errors,
        });
      }

      return reply.status(400).send({
        error: error.message || 'Erro ao criar usuário',
      });
    }
  });

  // POST /auth/login
  fastify.post('/auth/login', async (request, reply) => {
    try {
      const data = loginSchema.parse(request.body);
      const result = await authService.login(data);

      return reply.send({
        message: 'Login realizado com sucesso',
        data: result,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          error: 'Dados inválidos',
          details: error.errors,
        });
      }

      return reply.status(401).send({
        error: error.message || 'Erro ao fazer login',
      });
    }
  });

  // GET /auth/me (rota protegida)
  fastify.get(
    '/auth/me',
    { preHandler: authMiddleware },
    async (request, reply) => {
      try {
        const profile = await authService.getProfile(request.userId);

        return reply.send({
          data: profile,
        });
      } catch (error: any) {
        return reply.status(404).send({
          error: error.message || 'Erro ao buscar perfil',
        });
      }
    }
  );

  // POST /auth/logout (apenas invalida no frontend)
  fastify.post('/auth/logout', async (request, reply) => {
    return reply.send({
      message: 'Logout realizado com sucesso',
    });
  });
}