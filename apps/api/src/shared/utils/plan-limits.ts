// Limites por plano de assinatura
export interface PlanLimits {
  maxMonitors: number;
  minInterval: number; // em segundos
  maxTeamMembers: number;
  hasEmailAlerts: boolean;
  hasSmsAlerts: boolean;
  hasSlackIntegration: boolean;
  hasDailyReport: boolean;
  retentionDays: number; // dias de retenção de histórico
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
    minInterval: 120, // 2 minutos
    maxTeamMembers: 3,
    hasEmailAlerts: true,
    hasSmsAlerts: false,
    hasSlackIntegration: false,
    hasDailyReport: true,
    retentionDays: 30,
  },
  PRO: {
    maxMonitors: 30,
    minInterval: 60, // 1 minuto
    maxTeamMembers: 10,
    hasEmailAlerts: true,
    hasSmsAlerts: true,
    hasSlackIntegration: true,
    hasDailyReport: true,
    retentionDays: 90,
  },
  BUSINESS: {
    maxMonitors: 100,
    minInterval: 30, // 30 segundos
    maxTeamMembers: 50,
    hasEmailAlerts: true,
    hasSmsAlerts: true,
    hasSlackIntegration: true,
    hasDailyReport: true,
    retentionDays: 365,
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
    BUSINESS: 'Business',
  };
  return names[plan] || 'Gratuito';
}