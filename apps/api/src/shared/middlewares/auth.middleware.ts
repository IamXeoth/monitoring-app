import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken } from '../utils/jwt';

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return reply.status(401).send({
        error: 'Token não fornecido',
      });
    }

    const [, token] = authHeader.split(' ');

    if (!token) {
      return reply.status(401).send({
        error: 'Token malformatado',
      });
    }

    const decoded = verifyToken(token);

    // Adicionar userId ao request para usar nas rotas
    request.userId = decoded.userId;
  } catch (error) {
    return reply.status(401).send({
      error: 'Token inválido ou expirado',
    });
  }
}

// Adicionar tipo ao FastifyRequest
declare module 'fastify' {
  interface FastifyRequest {
    userId: string;
  }
}