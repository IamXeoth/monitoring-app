import { z } from 'zod';

// Schema para criação de monitor
export const createMonitorSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  url: z.string().url('URL inválida'),
  type: z.enum(['HTTP', 'HTTPS', 'PING', 'SSL']).default('HTTP'),
  interval: z.number().int().min(30, 'Intervalo mínimo é 30 segundos').max(300),
});

// Schema para atualização de monitor
export const updateMonitorSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  url: z.string().url('URL inválida').optional(),
  type: z.enum(['HTTP', 'HTTPS', 'PING', 'SSL']).optional(),
  interval: z.number().int().min(30).max(300).optional(),
  isActive: z.boolean().optional(),
});

// Tipos inferidos dos schemas
export type CreateMonitorInput = z.infer<typeof createMonitorSchema>;
export type UpdateMonitorInput = z.infer<typeof updateMonitorSchema>;