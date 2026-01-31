import Fastify from 'fastify';
import cors from '@fastify/cors';
import 'dotenv/config';
import { authRoutes } from './modules/auth/auth.routes';

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
  // Registrar CORS
  await fastify.register(cors, {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Registrar rotas de autenticação
  await fastify.register(authRoutes);

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
        register: 'POST /auth/register',
        login: 'POST /auth/login',
        profile: 'GET /auth/me',
        logout: 'POST /auth/logout',
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
    `);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();