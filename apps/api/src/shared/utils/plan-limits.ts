// Limites por plano de assinatura
export interface PlanLimits {
  maxMonitors: number;
  minInterval: number; // em segundos
  maxTeamMembers: number;
  hasEmailAlerts: boolean;
  hasSmsAlerts: boolean;
  hasSlackIntegration: boolean;
  hasDailyReport: boolean;
  retentionDays: number;
}

const PLAN_LIMITS: Record<string, PlanLimits> = {
  FREE: {
    maxMonitors: 3,
    minInterval: 300, // 5 minutos
    maxTeamMembers: 1,
    hasEmailAlerts: true,
    hasSmsAlerts: false,
    hasSlackIntegration: false,
    hasDailyReport: false,
    retentionDays: 7,
  },
  STARTER: {
    maxMonitors: 10,
    minInterval: 60, // 1 minuto
    maxTeamMembers: 3,
    hasEmailAlerts: true,
    hasSmsAlerts: false,
    hasSlackIntegration: false,
    hasDailyReport: true,
    retentionDays: 30,
  },
  PRO: {
    maxMonitors: 30,
    minInterval: 30, // 30 segundos
    maxTeamMembers: 10,
    hasEmailAlerts: true,
    hasSmsAlerts: true,
    hasSlackIntegration: true,
    hasDailyReport: true,
    retentionDays: 90,
  },
  ENTERPRISE: {
    maxMonitors: -1, // ilimitado
    minInterval: 10, // adaptável, mínimo 10s
    maxTeamMembers: -1, // ilimitado
    hasEmailAlerts: true,
    hasSmsAlerts: true,
    hasSlackIntegration: true,
    hasDailyReport: true,
    retentionDays: 730,
  },
};

/**
 * Retorna os limites do plano
 */
export function getPlanLimits(plan: string): PlanLimits {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.FREE;
}

/**
 * Valida se o intervalo é permitido para o plano
 */
export function validateInterval(plan: string, interval: number): boolean {
  const limits = getPlanLimits(plan);
  return interval >= limits.minInterval;
}

/**
 * Valida se o usuário pode criar mais monitores
 */
export function canCreateMonitor(plan: string, currentCount: number): boolean {
  const limits = getPlanLimits(plan);
  if (limits.maxMonitors === -1) return true;
  return currentCount < limits.maxMonitors;
}

/**
 * Retorna o nome legível do plano
 */
export function getPlanDisplayName(plan: string): string {
  const names: Record<string, string> = {
    FREE: 'Gratuito',
    STARTER: 'Starter',
    PRO: 'Pro',
    ENTERPRISE: 'Enterprise',
  };
  return names[plan] || 'Gratuito';
}