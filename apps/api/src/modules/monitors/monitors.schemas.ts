import { z } from 'zod';

export const createMonitorSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  url: z.string().url('URL inválida'),
  type: z.enum(['HTTP', 'HTTPS', 'SSL', 'DOMAIN', 'PING']),
  interval: z.number().int().positive('Intervalo deve ser positivo'),
});

export const updateMonitorSchema = z.object({
  name: z.string().min(3).optional(),
  url: z.string().url().optional(),
  type: z.enum(['HTTP', 'HTTPS', 'SSL', 'DOMAIN', 'PING']).optional(),
  interval: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
});

export type CreateMonitorInput = z.infer<typeof createMonitorSchema>;
export type UpdateMonitorInput = z.infer<typeof updateMonitorSchema>;