'use client';

import { useAuth } from '@/contexts/auth-context';
import { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

type BillingCycle = 'monthly' | 'yearly';

const PLANS = [
  {
    key: 'FREE',
    name: 'Free',
    description: 'Para começar a monitorar',
    monthly: 0,
    yearly: 0,
    color: 'text-[#80838a]',
    bg: 'bg-[#1e2128]',
    border: 'border-[#1e2128]',
    borderHover: 'hover:border-[#2a2e36]',
    cta: 'Plano atual',
    ctaStyle: 'bg-[#1e2128] text-[#555b66] cursor-default',
    features: {
      monitors: '1',
      interval: '5 minutos',
      retention: '7 dias',
      statusPages: '1',
      statusPageSlug: 'Aleatório',
      emailAlerts: '1 destinatário',
      webhook: false,
      slack: false,
      discord: false,
      telegram: false,
      api: false,
      apiLimit: '—',
      auditLog: false,
      support: 'Comunidade',
    },
  },
  {
    key: 'STARTER',
    name: 'Starter',
    description: 'Para projetos em crescimento',
    monthly: 29,
    yearly: 24,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/15',
    borderHover: 'hover:border-blue-500/30',
    cta: 'Assinar Starter',
    ctaStyle: 'bg-blue-500 hover:bg-blue-400 text-white',
    features: {
      monitors: '10',
      interval: '3 minutos',
      retention: '30 dias',
      statusPages: '3',
      statusPageSlug: 'Personalizado',
      emailAlerts: '3 destinatários',
      webhook: true,
      slack: false,
      discord: false,
      telegram: false,
      api: true,
      apiLimit: '100 req/hora',
      auditLog: false,
      support: 'Email',
    },
  },
  {
    key: 'PRO',
    name: 'Pro',
    description: 'Para times que precisam de confiança',
    monthly: 79,
    yearly: 66,
    popular: true,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    borderHover: 'hover:border-emerald-500/40',
    cta: 'Assinar Pro',
    ctaStyle: 'bg-emerald-500 hover:bg-emerald-400 text-[#0c0d11] font-bold',
    features: {
      monitors: '50',
      interval: '30 segundos',
      retention: '90 dias',
      statusPages: '10',
      statusPageSlug: 'Personalizado',
      emailAlerts: 'Ilimitado',
      webhook: true,
      slack: true,
      discord: true,
      telegram: true,
      api: true,
      apiLimit: '1.000 req/hora',
      auditLog: true,
      support: 'Prioritário',
    },
  },
  {
    key: 'BUSINESS',
    name: 'Business',
    description: 'Para operações críticas',
    monthly: 199,
    yearly: 166,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/15',
    borderHover: 'hover:border-amber-500/30',
    cta: 'Assinar Business',
    ctaStyle: 'bg-amber-500 hover:bg-amber-400 text-[#0c0d11] font-bold',
    features: {
      monitors: '200',
      interval: '30 segundos',
      retention: '365 dias',
      statusPages: '50',
      statusPageSlug: 'Personalizado + Domínio',
      emailAlerts: 'Ilimitado',
      webhook: true,
      slack: true,
      discord: true,
      telegram: true,
      api: true,
      apiLimit: '10.000 req/hora',
      auditLog: true,
      support: 'Dedicado',
    },
  },
];

const FEATURE_ROWS: { key: keyof typeof PLANS[0]['features']; label: string; type: 'text' | 'boolean' }[] = [
  { key: 'monitors', label: 'Monitores', type: 'text' },
  { key: 'interval', label: 'Intervalo mínimo', type: 'text' },
  { key: 'retention', label: 'Retenção de dados', type: 'text' },
  { key: 'statusPages', label: 'Status Pages', type: 'text' },
  { key: 'statusPageSlug', label: 'URL da Status Page', type: 'text' },
  { key: 'emailAlerts', label: 'Alertas por email', type: 'text' },
  { key: 'webhook', label: 'Webhook', type: 'boolean' },
  { key: 'slack', label: 'Slack', type: 'boolean' },
  { key: 'discord', label: 'Discord', type: 'boolean' },
  { key: 'telegram', label: 'Telegram', type: 'boolean' },
  { key: 'api', label: 'Acesso à API', type: 'boolean' },
  { key: 'apiLimit', label: 'Limite da API', type: 'text' },
  { key: 'auditLog', label: 'Log de auditoria', type: 'boolean' },
  { key: 'support', label: 'Suporte', type: 'text' },
];

export default function UpgradePage() {
  const { user } = useAuth();
  const [billing, setBilling] = useState<BillingCycle>('monthly');
  const [showComparison, setShowComparison] = useState(false);
  const currentPlan = user?.subscription?.plan || 'FREE';

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0c0d11]">
        <div className="px-8 pt-8 pb-6">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/dashboard" className="text-[11px] text-[#3e424a] hover:text-[#80838a] font-medium transition-colors">Dashboard</Link>
            <svg className="w-3 h-3 text-[#2e323a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-[11px] text-[#80838a] font-medium">Upgrade</span>
          </div>

          {/* Header */}
          <div className="text-center max-w-lg mx-auto mb-8">
            <h1 className="text-[26px] font-semibold text-[#e4e4e7] tracking-tight mb-2">Escolha o plano ideal</h1>
            <p className="text-[14px] text-[#555b66]">
              Escale seu monitoramento com mais monitores, intervalos menores e integrações avançadas
            </p>
          </div>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex items-center bg-[#12141a] border border-[#1e2128] rounded-lg p-0.5">
              <button
                onClick={() => setBilling('monthly')}
                className={`px-4 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                  billing === 'monthly' ? 'bg-white/[0.07] text-[#e4e4e7]' : 'text-[#555b66] hover:text-[#80838a]'
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setBilling('yearly')}
                className={`px-4 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                  billing === 'yearly' ? 'bg-white/[0.07] text-[#e4e4e7]' : 'text-[#555b66] hover:text-[#80838a]'
                }`}
              >
                Anual
              </button>
            </div>
            {billing === 'yearly' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
                Economize 17%
              </span>
            )}
          </div>
        </div>

        {/* Plan Cards */}
        <div className="px-8 pb-6">
          <div className="grid grid-cols-4 gap-3 max-w-5xl mx-auto">
            {PLANS.map((plan) => {
              const isCurrent = plan.key === currentPlan;
              const isDowngrade = ['FREE', 'STARTER', 'PRO', 'BUSINESS'].indexOf(plan.key) < ['FREE', 'STARTER', 'PRO', 'BUSINESS'].indexOf(currentPlan);
              const price = billing === 'yearly' ? plan.yearly : plan.monthly;

              return (
                <div
                  key={plan.key}
                  className={`relative rounded-2xl border ${isCurrent ? plan.border : 'border-[#1e2128]'} ${plan.borderHover} bg-[#12141a] p-5 transition-all ${
                    plan.popular ? 'ring-1 ring-emerald-500/20' : ''
                  }`}
                >
                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500 text-[#0c0d11] uppercase tracking-wider">
                        Mais popular
                      </span>
                    </div>
                  )}

                  {/* Plan name */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-[15px] font-semibold ${plan.color}`}>{plan.name}</h3>
                      {isCurrent && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#1e2128] text-[#80838a] uppercase">
                          Atual
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#3e424a]">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-5">
                    {price === 0 ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-[28px] font-bold text-[#e4e4e7] tabular-nums">R$0</span>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="text-[11px] text-[#3e424a]">R$</span>
                        <span className="text-[28px] font-bold text-[#e4e4e7] tabular-nums">{price}</span>
                        <span className="text-[11px] text-[#3e424a]">/mês</span>
                      </div>
                    )}
                    {billing === 'yearly' && price > 0 && (
                      <p className="text-[10px] text-[#3e424a] mt-0.5">
                        R${price * 12}/ano · cobrado anualmente
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <button
                    disabled={isCurrent || isDowngrade}
                    className={`w-full h-10 rounded-xl text-[13px] font-semibold transition-all flex items-center justify-center ${
                      isCurrent
                        ? plan.ctaStyle
                        : isDowngrade
                          ? 'bg-[#1e2128] text-[#3e424a] cursor-not-allowed'
                          : plan.ctaStyle
                    } ${isCurrent || isDowngrade ? '' : 'shadow-sm'}`}
                  >
                    {isCurrent ? 'Plano atual' : isDowngrade ? 'Downgrade' : plan.cta}
                  </button>

                  {/* Key features */}
                  <div className="mt-5 pt-4 border-t border-[#1e2128] space-y-2.5">
                    {[
                      { val: plan.features.monitors, label: 'monitores' },
                      { val: plan.features.interval, label: 'intervalo' },
                      { val: plan.features.statusPages, label: 'status pages' },
                      { val: plan.features.emailAlerts, label: 'alertas email' },
                      { val: plan.features.support, label: 'suporte' },
                    ].map((f, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <svg className="w-3 h-3 text-emerald-400/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <span className="text-[11px] text-[#80838a]">
                          <span className="font-semibold text-[#c8c9cd]">{f.val}</span> {f.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Comparison toggle */}
        <div className="px-8 pb-2 text-center">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#555b66] hover:text-[#80838a] transition-colors"
          >
            {showComparison ? 'Esconder comparação detalhada' : 'Ver comparação detalhada'}
            <svg className={`w-3.5 h-3.5 transition-transform ${showComparison ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Feature comparison table */}
        {showComparison && (
          <div className="px-8 pb-8 pt-4">
            <div className="max-w-5xl mx-auto rounded-xl border border-[#1e2128] bg-[#12141a] overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-5 border-b border-[#1e2128]">
                <div className="px-4 py-3">
                  <span className="text-[11px] font-semibold text-[#3e424a] uppercase tracking-wider">Recurso</span>
                </div>
                {PLANS.map((p) => (
                  <div key={p.key} className={`px-4 py-3 text-center ${p.key === currentPlan ? 'bg-white/[0.02]' : ''}`}>
                    <span className={`text-[12px] font-bold ${p.color}`}>{p.name}</span>
                    {p.key === currentPlan && (
                      <span className="ml-1.5 inline-flex items-center px-1 py-0.5 rounded text-[7px] font-bold bg-[#1e2128] text-[#555b66] uppercase">Atual</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {FEATURE_ROWS.map((row, idx) => (
                <div key={row.key} className={`grid grid-cols-5 ${idx < FEATURE_ROWS.length - 1 ? 'border-b border-[#1e2128]/50' : ''}`}>
                  <div className="px-4 py-2.5 flex items-center">
                    <span className="text-[11px] text-[#80838a]">{row.label}</span>
                  </div>
                  {PLANS.map((p) => {
                    const val = p.features[row.key];
                    return (
                      <div key={p.key} className={`px-4 py-2.5 text-center flex items-center justify-center ${p.key === currentPlan ? 'bg-white/[0.02]' : ''}`}>
                        {row.type === 'boolean' ? (
                          val ? (
                            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          ) : (
                            <span className="text-[11px] text-[#2e323a]">—</span>
                          )
                        ) : (
                          <span className="text-[11px] text-[#c8c9cd] font-medium">{val as string}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ / Trust */}
        <div className="px-8 pb-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
                  title: 'Pagamento seguro',
                  desc: 'Processado via Stripe com criptografia de ponta a ponta',
                },
                {
                  icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" /></svg>,
                  title: 'Cancele quando quiser',
                  desc: 'Sem multa, sem burocracia. Cancele a qualquer momento',
                },
                {
                  icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>,
                  title: 'Preço em reais',
                  desc: 'Sem surpresas com câmbio. Tudo cobrado em R$ brasileiro',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-[#1e2128] bg-[#12141a] p-4 text-center">
                  <div className="w-10 h-10 rounded-xl bg-[#1e2128] flex items-center justify-center mx-auto mb-3 text-[#555b66]">
                    {item.icon}
                  </div>
                  <p className="text-[12px] font-semibold text-[#c8c9cd] mb-0.5">{item.title}</p>
                  <p className="text-[10px] text-[#3e424a]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}