import { FastifyInstance } from 'fastify';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';
import { prisma } from '../../shared/database/prisma';

export async function statusPagesRoutes(fastify: FastifyInstance) {

  // ─── Authenticated Routes ───

  // GET /status-pages - List user's status pages
  fastify.get('/status-pages', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const userId = (request as any).userId;
      const pages = await prisma.statusPage.findMany({
        where: { userId },
        include: {
          monitors: {
            include: { monitor: true },
            orderBy: { displayOrder: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      return reply.send({ data: pages });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // GET /status-pages/:id - Get single status page
  fastify.get('/status-pages/:id', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const userId = (request as any).userId;
      const { id } = request.params as { id: string };
      const page = await prisma.statusPage.findFirst({
        where: { id, userId },
        include: {
          monitors: {
            include: { monitor: true },
            orderBy: { displayOrder: 'asc' },
          },
        },
      });
      if (!page) return reply.status(404).send({ error: 'Status page não encontrada' });
      return reply.send({ data: page });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // POST /status-pages - Create status page
  fastify.post('/status-pages', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const userId = (request as any).userId;
      const { name, slug, description, isPublished, monitorIds } = request.body as {
        name: string;
        slug: string;
        description?: string;
        isPublished?: boolean;
        monitorIds?: { id: string; displayName: string }[];
      };

      // Validate slug
      const slugRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
      if (!slugRegex.test(slug) || slug.length < 3) {
        return reply.status(400).send({ error: 'Slug inválido. Use letras minúsculas, números e hifens (mín. 3 caracteres)' });
      }

      // Check unique slug
      const existing = await prisma.statusPage.findUnique({ where: { slug } });
      if (existing) {
        return reply.status(400).send({ error: 'Este slug já está em uso' });
      }

      const page = await prisma.statusPage.create({
        data: {
          userId,
          name,
          slug,
          description,
          isPublished: isPublished || false,
          monitors: monitorIds ? {
            create: monitorIds.map((m, idx) => ({
              monitorId: m.id,
              displayName: m.displayName,
              displayOrder: idx,
            })),
          } : undefined,
        },
        include: {
          monitors: { include: { monitor: true } },
        },
      });

      return reply.status(201).send({ data: page });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // PUT /status-pages/:id - Update status page
  fastify.put('/status-pages/:id', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const userId = (request as any).userId;
      const { id } = request.params as { id: string };
      const { name, description, isPublished, monitorIds } = request.body as {
        name?: string;
        description?: string;
        isPublished?: boolean;
        monitorIds?: { id: string; displayName: string }[];
      };

      const existing = await prisma.statusPage.findFirst({ where: { id, userId } });
      if (!existing) return reply.status(404).send({ error: 'Status page não encontrada' });

      // Update monitors if provided
      if (monitorIds) {
        await prisma.statusPageMonitor.deleteMany({ where: { statusPageId: id } });
        await prisma.statusPageMonitor.createMany({
          data: monitorIds.map((m, idx) => ({
            statusPageId: id,
            monitorId: m.id,
            displayName: m.displayName,
            displayOrder: idx,
          })),
        });
      }

      const page = await prisma.statusPage.update({
        where: { id },
        data: {
          ...(name !== undefined && { name }),
          ...(description !== undefined && { description }),
          ...(isPublished !== undefined && { isPublished }),
        },
        include: {
          monitors: {
            include: { monitor: true },
            orderBy: { displayOrder: 'asc' },
          },
        },
      });

      return reply.send({ data: page });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // DELETE /status-pages/:id
  fastify.delete('/status-pages/:id', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const userId = (request as any).userId;
      const { id } = request.params as { id: string };
      const existing = await prisma.statusPage.findFirst({ where: { id, userId } });
      if (!existing) return reply.status(404).send({ error: 'Status page não encontrada' });
      await prisma.statusPage.delete({ where: { id } });
      return reply.send({ message: 'Status page deletada com sucesso' });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // ─── Public Route ───

  // GET /s/:slug - Public status page data (no auth)
  fastify.get('/s/:slug', async (request, reply) => {
    try {
      const { slug } = request.params as { slug: string };
      const page = await prisma.statusPage.findUnique({
        where: { slug },
        include: {
          monitors: {
            include: {
              monitor: {
                include: {
                  checks: {
                    orderBy: { checkedAt: 'desc' },
                    take: 500,
                  },
                },
              },
            },
            orderBy: { displayOrder: 'asc' },
          },
        },
      });

      if (!page || !page.isPublished) {
        return reply.status(404).send({ error: 'Status page não encontrada' });
      }

      // Build public response (strip internal fields)
      const services = page.monitors.map((spm) => {
        const m = spm.monitor;
        const checks = m.checks || [];
        const latestCheck = checks[0];
        const status = latestCheck?.status === 'DOWN' ? 'DOWN' : checks.length > 0 ? 'UP' : 'UNKNOWN';

        // Uptime calculation (last 90 days)
        const h90d = 90 * 24 * 60 * 60 * 1000;
        const now = Date.now();
        const relevantChecks = checks.filter((c: any) => now - new Date(c.checkedAt).getTime() < h90d);
        const upChecks = relevantChecks.filter((c: any) => c.status === 'UP').length;
        const uptime = relevantChecks.length > 0 ? (upChecks / relevantChecks.length) * 100 : 100;

        // Daily uptime for last 90 days (for bars)
        const dailyUptime: { date: string; uptime: number; totalChecks: number }[] = [];
        for (let d = 89; d >= 0; d--) {
          const dayStart = new Date(now - d * 24 * 60 * 60 * 1000);
          dayStart.setHours(0, 0, 0, 0);
          const dayEnd = new Date(dayStart);
          dayEnd.setHours(23, 59, 59, 999);
          const dayChecks = relevantChecks.filter((c: any) => {
            const t = new Date(c.checkedAt).getTime();
            return t >= dayStart.getTime() && t <= dayEnd.getTime();
          });
          const dayUp = dayChecks.filter((c: any) => c.status === 'UP').length;
          dailyUptime.push({
            date: dayStart.toISOString().split('T')[0],
            uptime: dayChecks.length > 0 ? (dayUp / dayChecks.length) * 100 : -1, // -1 = no data
            totalChecks: dayChecks.length,
          });
        }

        return {
          name: spm.displayName,
          status,
          uptime: Math.round(uptime * 100) / 100,
          responseTime: latestCheck?.responseTime || 0,
          dailyUptime,
        };
      });

      const overallStatus = services.some((s) => s.status === 'DOWN')
        ? 'DOWN'
        : services.every((s) => s.status === 'UP')
          ? 'UP'
          : 'UNKNOWN';

      return reply.send({
        data: {
          name: page.name,
          slug: page.slug,
          description: page.description,
          logoUrl: page.logoUrl,
          overallStatus,
          services,
        },
      });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });
}