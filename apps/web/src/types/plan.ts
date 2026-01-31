export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  maxMonitors: number;
  minInterval: number; // em segundos
  popular?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'FREE',
    price: 0,
    interval: 'monthly',
    maxMonitors: 3,
    minInterval: 300, // 5 minutos
    features: [
      'Até 3 monitores',
      'Checagem a cada 5 minutos',
      'Alertas por email',
      'Histórico de 30 dias',
      'Suporte por email',
    ],
  },
  {
    id: 'starter',
    name: 'STARTER',
    price: 29.90,
    interval: 'monthly',
    maxMonitors: 10,
    minInterval: 60, // 1 minuto
    features: [
      'Até 10 monitores',
      'Checagem a cada 1 minuto',
      'Alertas por email',
      'Histórico de 90 dias',
      'Suporte prioritário',
      'Relatórios básicos',
    ],
  },
  {
    id: 'pro',
    name: 'PRO',
    price: 79.90,
    interval: 'monthly',
    maxMonitors: 30,
    minInterval: 30, // 30 segundos
    popular: true,
    features: [
      'Até 30 monitores',
      'Checagem a cada 30 segundos',
      'Alertas por email e SMS',
      'Histórico ilimitado',
      'Suporte prioritário 24/7',
      'Relatórios avançados',
      'API de integração',
      'Páginas de status públicas',
    ],
  },
  {
    id: 'business',
    name: 'BUSINESS',
    price: 199.90,
    interval: 'monthly',
    maxMonitors: 100,
    minInterval: 30, // 30 segundos
    features: [
      'Até 100 monitores',
      'Checagem a cada 30 segundos',
      'Alertas multicanal (email, SMS, Slack, Discord)',
      'Histórico ilimitado',
      'Suporte dedicado 24/7',
      'Relatórios personalizados',
      'API completa',
      'Páginas de status white-label',
      'SLA garantido',
      'Gerente de conta dedicado',
    ],
  },
];