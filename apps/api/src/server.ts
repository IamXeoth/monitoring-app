import Fastify from 'fastify';
import cors from '@fastify/cors';
import 'dotenv/config';
import { authRoutes } from './modules/auth/auth.routes';
import { monitorsRoutes } from './modules/monitors/monitors.routes';
import { checkingRoutes } from './modules/monitors/checking.routes';
import { startCheckingScheduler } from './modules/monitors/checking.queue';
import { prisma } from './shared/database/prisma';
import { statusPagesRoutes } from './modules/status-pages/status-pages.routes';

// Adicionar prisma ao Fastify
declare module 'fastify' {
  interface FastifyInstance {
    prisma: typeof prisma;
  }
}

const fastify = Fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

// Inicialização assíncrona
const initializeServer = async () => {
  // Adicionar prisma ao fastify
  fastify.decorate('prisma', prisma);

  // Registrar CORS
  await fastify.register(cors, {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Registrar rotas
  await fastify.register(authRoutes);
  await fastify.register(monitorsRoutes);
  await fastify.register(checkingRoutes);
  await fastify.register(statusPagesRoutes);

  // Iniciar scheduler de checking
  startCheckingScheduler();

  // Health check route
  fastify.get('/health', async (request, reply) => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
    };
  });

  // Rota raiz
  fastify.get('/', async (request, reply) => {
    return {
      message: 'Monitoring API',
      version: '1.0.0',
      endpoints: {
        health: '/health',
        auth: {
          register: 'POST /auth/register',
          login: 'POST /auth/login',
          profile: 'GET /auth/me',
          logout: 'POST /auth/logout',
        },
        monitors: {
          list: 'GET /monitors',
          get: 'GET /monitors/:id',
          create: 'POST /monitors',
          update: 'PUT /monitors/:id',
          delete: 'DELETE /monitors/:id',
          toggle: 'PATCH /monitors/:id/toggle',
          status: 'GET /monitors/:id/status',
          stats: 'GET /monitors/:id/stats',
          check: 'POST /monitors/:id/check',
          checks: 'GET /monitors/:id/checks',
          incidents: 'GET /monitors/:id/incidents',
        },
      },
    };
  });
};

// Iniciar servidor
const start = async () => {
  try {
    await initializeServer();

    const port = Number(process.env.PORT) || 3001;
    await fastify.listen({ port, host: '0.0.0.0' });

    console.log(`
🚀 API rodando em http://localhost:${port}
📊 Health check: http://localhost:${port}/health
🔐 Endpoints de autenticação disponíveis
📡 Endpoints de monitores disponíveis
⏰ Scheduler de checking iniciado
    `);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();