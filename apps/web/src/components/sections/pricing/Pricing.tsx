'use client';

import { useState } from 'react';
import { PricingCard } from './PricingCard';

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  // Preço anual = preço mensal com 15% de desconto
  const calculatePrice = (monthlyPrice: number) => {
    if (monthlyPrice === 0) return 0;
    return isAnnual ? Math.round(monthlyPrice * 0.85) : monthlyPrice;
  };

  const calculateOriginalPrice = (monthlyPrice: number) => {
    if (monthlyPrice === 0 || !isAnnual) return undefined;
    return monthlyPrice;
  };

  const plans = [
    {
      name: 'FREE',
      description: 'Para testes e projetos pessoais. Comece sem custos.',
      monthlyPrice: 0,
      ctaText: 'Começar grátis',
      ctaVariant: 'default' as const,
      features: [
        { text: 'Até 3 monitores', available: true },
        { text: 'Checagem a cada 5 minutos', available: true },
        { text: 'Alertas por email', available: true },
        { text: 'Dashboard completo', available: true },
        { text: 'Histórico de 7 dias', available: true },
        { text: 'Status page pública', available: true },
        { text: 'API Health Checking', available: false },
        { text: 'Alertas multicanal', available: false },
        { text: 'Port Monitoring', available: false },
      ],
    },
    {
      name: 'STARTER',
      description: 'Para desenvolvedores solo e pequenos projetos.',
      monthlyPrice: 20,
      ctaText: 'Assinar plano',
      ctaVariant: 'secondary' as const,
      features: [
        { text: 'Até 10 monitores', available: true },
        { text: 'Checagem a cada 60 seg', available: true },
        { text: 'Alertas por email', available: true },
        { text: 'API Health Checking', available: true },
        { text: 'Histórico de 7 dias', available: true },
        { text: 'Status page pública', available: true },
        { text: 'Suporte prioritário', available: true },
        { text: 'Alertas multicanal', available: false },
        { text: 'Histórico de 30 e 90 dias', available: false },
      ],
    },
    {
      name: 'PRO',
      description: 'Para SaaS, agências e múltiplos serviços.',
      monthlyPrice: 40,
      ctaText: 'Assinar plano',
      ctaVariant: 'primary' as const,
      popular: true,
      features: [
        { text: 'Até 30 monitores', available: true },
        { text: 'Checagem a cada 30 seg', available: true },
        { text: 'Alertas multicanal', available: true },
        { text: 'API Health + validações', available: true },
        { text: 'Histórico de 30 e 90 dias', available: true },
        { text: 'Port Monitoring', available: true },
        { text: 'Keyword Monitoring', available: true },
        { text: 'SSL & Domain Monitoring', available: true },
        { text: 'Suporte 24/7', available: true },
      ],
    },
    {
      name: 'BUSINESS',
      description: 'Para equipes e operações de larga escala.',
      monthlyPrice: 70,
      ctaText: 'Falar com vendas',
      ctaVariant: 'secondary' as const,
      features: [
        { text: 'Até 50 monitores', available: true },
        { text: 'Checagem a cada 30 seg', available: true },
        { text: 'Todos os recursos do PRO', available: true },
        { text: 'Onboarding personalizado', available: true },
        { text: 'Relatórios personalizados', available: true },
        { text: 'White-label (status pages)', available: true },
        { text: 'API completa', available: true },
        { text: 'SLA garantido 99.9%', available: true },
        { text: 'Gerente de conta dedicado', available: true },
      ],
    },
  ];

  return (
    <section id="pricing" className="py-16 bg-[#f3f2f1]">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tight text-slate-900">
            Planos para todos os tamanhos
          </h2>
          <p className="text-base text-slate-600 font-normal">
            Do freelancer ao enterprise. Escolha o plano ideal para você.
          </p>
        </div>

        {/* Toggle Mensal/Anual */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex bg-slate-100 rounded-xl p-1 border border-slate-200">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-lg text-sm transition-all ${
                !isAnnual
                  ? 'bg-white text-slate-900 shadow-md font-semibold'
                  : 'bg-transparent text-slate-600 hover:text-slate-900 font-normal'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                isAnnual
                  ? 'bg-white text-slate-900 shadow-md font-semibold'
                  : 'bg-transparent text-slate-600 hover:text-slate-900 font-normal'
              }`}
            >
              Anual
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-normal">
                Economize 15%
              </span>
            </button>
          </div>
        </div>

        {/* Grid de Preços */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <PricingCard
              key={plan.name}
              name={plan.name}
              description={plan.description}
              price={calculatePrice(plan.monthlyPrice)}
              originalPrice={calculateOriginalPrice(plan.monthlyPrice)}
              period={
                plan.monthlyPrice === 0
                  ? '/mês'
                  : isAnnual
                  ? '/mês por usuário'
                  : '/mês por usuário'
              }
              ctaText={plan.ctaText}
              ctaVariant={plan.ctaVariant}
              features={plan.features}
              popular={plan.popular}
            />
          ))}
        </div>
      </div>
    </section>
  );
}