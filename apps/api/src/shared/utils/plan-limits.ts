export const PLAN_LIMITS = {
  FREE: {
    maxMonitors: 3,
    minInterval: 300, // 5 minutos em segundos
  },
  STARTER: {
    maxMonitors: 10,
    minInterval: 60, // 1 minuto
  },
  PRO: {
    maxMonitors: 30,
    minInterval: 30, // 30 segundos
  },
  BUSINESS: {
    maxMonitors: 50,
    minInterval: 30, // 30 segundos
  },
};

export function getPlanLimits(plan: string) {
  return PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.FREE;
}

export function validateInterval(plan: string, interval: number): boolean {
  const limits = getPlanLimits(plan);
  return interval >= limits.minInterval;
}