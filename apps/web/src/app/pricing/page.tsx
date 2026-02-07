'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ScrollToTop } from '@/components/ScrollToTop';
import { useState } from 'react';

const plans = [
  {
    name: 'FREE',
    price: 0,
    period: '/mês',
    description: 'Ideal para testar e pequenos projetos pessoais',
    cta: 'Começar grátis',
    ctaVariant: 'outline' as const,
    features: [
      'Até 3 monitores',
      'Verificações a cada 5 minutos',
      'Alertas por e-mail',
      'Histórico de 7 dias',
      'Status page público'
    ]
  },
  {
    name: 'STARTER',
    price: 20,
    period: '/mês',
    description: 'Para desenvolvedores e pequenas startups',
    cta: 'Começar teste grátis',
    ctaVariant: 'solid' as const,
    features: [
      'Até 10 monitores',
      'Verificações a cada 1 minuto',
      'Alertas multi-canal',
      'Histórico de 30 dias',
      'Status pages ilimitadas',
      'Suporte por e-mail'
    ]
  },
  {
    name: 'PRO',
    price: 40,
    period: '/mês',
    popular: true,
    description: 'Para equipes que precisam de confiabilidade',
    cta: 'Começar teste grátis',
    ctaVariant: 'solid' as const,
    features: [
      'Até 30 monitores',
      'Verificações a cada 30 segundos',
      'Alertas avançados',
      'Histórico de 90 dias',
      'Status pages customizadas',
      'Monitoramento SSL/TLS',
      'API access',
      'Suporte prioritário'
    ]
  },
  {
    name: 'BUSINESS',
    price: 70,
    period: '/mês',
    description: 'Para empresas que exigem o máximo',
    cta: 'Agendar demonstração',
    ctaVariant: 'outline' as const,
    features: [
      'Até 100 monitores',
      'Verificações a cada 30 segundos',
      'Alertas ilimitados',
      'Histórico de 1 ano',
      'White-label disponível',
      'Domínios customizados',
      'SLA 99.9%',
      'Suporte dedicado',
      'Onboarding personalizado'
    ]
  }
];

const comparisonFeatures = [
  {
    category: 'Monitoramento',
    features: [
      { name: 'Monitores', free: '3', starter: '10', pro: '30', business: '100' },
      { name: 'Intervalo de verificação', free: '5 min', starter: '1 min', pro: '30 seg', business: '30 seg' },
      { name: 'Tipos de monitor', free: 'HTTP/HTTPS', starter: 'HTTP/HTTPS/TCP', pro: 'Todos', business: 'Todos' },
      { name: 'Monitoramento SSL', free: false, starter: false, pro: true, business: true },
      { name: 'Port monitoring', free: false, starter: true, pro: true, business: true },
      { name: 'Keyword monitoring', free: false, starter: false, pro: true, business: true }
    ]
  },
  {
    category: 'Alertas',
    features: [
      { name: 'Alertas por e-mail', free: true, starter: true, pro: true, business: true },
      { name: 'Slack', free: false, starter: true, pro: true, business: true },
      { name: 'Discord', free: false, starter: true, pro: true, business: true },
      { name: 'Telegram', free: false, starter: true, pro: true, business: true },
      { name: 'Webhooks', free: false, starter: false, pro: true, business: true },
      { name: 'SMS', free: false, starter: false, pro: false, business: true }
    ]
  },
  {
    category: 'Status Pages',
    features: [
      { name: 'Status pages públicas', free: '1', starter: 'Ilimitadas', pro: 'Ilimitadas', business: 'Ilimitadas' },
      { name: 'Customização', free: 'Básica', starter: 'Básica', pro: 'Avançada', business: 'White-label' },
      { name: 'Domínio customizado', free: false, starter: false, pro: false, business: true }
    ]
  },
  {
    category: 'Dados e Relatórios',
    features: [
      { name: 'Histórico', free: '7 dias', starter: '30 dias', pro: '90 dias', business: '1 ano' },
      { name: 'Exportação de dados', free: false, starter: true, pro: true, business: true },
      { name: 'Relatórios PDF', free: false, starter: false, pro: true, business: true },
      { name: 'API access', free: false, starter: false, pro: true, business: true }
    ]
  },
  {
    category: 'Suporte',
    features: [
      { name: 'Documentação', free: true, starter: true, pro: true, business: true },
      { name: 'E-mail', free: 'Best effort', starter: '24h', pro: '12h', business: '4h' },
      { name: 'Chat', free: false, starter: false, pro: true, business: true },
      { name: 'Suporte dedicado', free: false, starter: false, pro: false, business: true },
      { name: 'SLA', free: false, starter: false, pro: '99.5%', business: '99.9%' }
    ]
  }
];

const faqs = [
  {
    question: 'Posso mudar de plano a qualquer momento?',
    answer: 'Sim! Você pode fazer upgrade imediatamente (cobramos pro-rata) ou downgrade que entra em vigor no próximo ciclo de faturamento.'
  },
  {
    question: 'Como funciona o período de teste?',
    answer: 'Todos os planos pagos oferecem 7 dias de teste grátis. Você não precisa inserir cartão de crédito para começar no plano FREE.'
  },
  {
    question: 'Vocês oferecem desconto anual?',
    answer: 'Sim! Ao optar pelo pagamento anual, você economiza 15% (equivalente a quase 2 meses grátis).'
  },
  {
    question: 'Posso cancelar quando quiser?',
    answer: 'Sim, sem multas ou taxas. Cancele a qualquer momento através do painel. Sua conta permanece ativa até o fim do período pago.'
  },
  {
    question: 'Que formas de pagamento vocês aceitam?',
    answer: 'Aceitamos PIX, cartão de crédito, boleto bancário e transferência. Todos os pagamentos são processados em reais (BRL).'
  },
  {
    question: 'O que acontece se eu exceder o limite de monitores?',
    answer: 'Você receberá uma notificação e terá opção de fazer upgrade ou remover monitores. Não cobramos taxas surpresa.'
  },
  {
    question: 'Vocês emitem nota fiscal?',
    answer: 'Sim! Emitimos nota fiscal brasileira (NF-e) automaticamente para todos os pagamentos.'
  },
  {
    question: 'Qual o uptime garantido?',
    answer: 'Nosso SLA varia por plano: PRO tem 99.5% e BUSINESS tem 99.9%. Planos FREE e STARTER não incluem SLA garantido.'
  }
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const getPrice = (monthlyPrice: number) => {
    if (billingPeriod === 'yearly') {
      // Desconto de 15% no anual (igual à home)
      return Math.round(monthlyPrice * 0.85);
    }
    return monthlyPrice;
  };

  return (
    <div className="min-h-screen bg-[#f3f2f1]">
      <ScrollToTop />
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-semibold text-slate-900 mb-4 tracking-tight">
            Preços simples e transparentes
          </h1>
          <p className="text-xl text-slate-600 font-normal max-w-3xl mx-auto mb-8">
            Comece grátis e faça upgrade quando crescer. Sem taxas escondidas, sem surpresas.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 p-1 bg-white rounded-xl border border-slate-200">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                billingPeriod === 'monthly'
                  ? 'bg-[#18181B] text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                billingPeriod === 'yearly'
                  ? 'bg-[#18181B] text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Anual
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                -15%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-2xl p-8 relative ${
                  plan.popular
                    ? 'border-2 border-primary shadow-xl'
                    : 'border border-slate-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                      Mais popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-semibold text-slate-900 tabular-nums">
                      R$ {getPrice(plan.price)}
                    </span>
                    <span className="text-slate-600 font-normal">{plan.period}</span>
                  </div>
                  <p className="text-sm text-slate-600 font-normal mt-2">
                    {plan.description}
                  </p>
                </div>

                <Link href={plan.name === 'BUSINESS' ? '/contact' : '/register'}>
                  <button
                    className={`w-full py-3 rounded-xl font-medium text-sm transition-all duration-200 mb-6 ${
                      plan.ctaVariant === 'solid'
                        ? plan.popular 
                          ? 'bg-primary text-white hover:bg-primary/90'
                          : 'bg-[#18181B] text-white hover:bg-[#18181B]/90'
                        : 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </Link>

                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-slate-600">
                      <svg
                        className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-semibold text-slate-900 mb-12 text-center tracking-tight">
            Compare todos os recursos
          </h2>

          {comparisonFeatures.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12 last:mb-0">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">
                {category.category}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-4 px-4 text-sm font-semibold text-slate-900">
                        Recurso
                      </th>
                      <th className="text-center py-4 px-4 text-sm font-semibold text-slate-900">
                        Free
                      </th>
                      <th className="text-center py-4 px-4 text-sm font-semibold text-slate-900">
                        Starter
                      </th>
                      <th className="text-center py-4 px-4 text-sm font-semibold text-slate-900">
                        Pro
                      </th>
                      <th className="text-center py-4 px-4 text-sm font-semibold text-slate-900">
                        Business
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.features.map((feature, featureIndex) => (
                      <tr key={featureIndex} className="border-b border-slate-100">
                        <td className="py-4 px-4 text-sm text-slate-600">
                          {feature.name}
                        </td>
                        {['free', 'starter', 'pro', 'business'].map((plan) => (
                          <td key={plan} className="py-4 px-4 text-center">
                            {typeof feature[plan as keyof typeof feature] === 'boolean' ? (
                              feature[plan as keyof typeof feature] ? (
                                <svg
                                  className="w-5 h-5 text-primary mx-auto"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  className="w-5 h-5 text-slate-300 mx-auto"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              )
                            ) : (
                              <span className="text-sm text-slate-900 font-medium">
                                {feature[plan as keyof typeof feature] as string}
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-semibold text-slate-900 mb-12 text-center tracking-tight">
            Perguntas frequentes
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <span className="text-base font-medium text-slate-900">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-slate-600 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#18181B] rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-semibold text-white mb-4 tracking-tight">
              Ainda tem dúvidas?
            </h2>
            <p className="text-lg text-slate-300 font-normal mb-8 max-w-2xl mx-auto">
              Fale com nosso time. Estamos aqui para ajudar você a escolher o melhor plano.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold text-base hover:bg-slate-100 transition-all duration-200">
                  Começar grátis
                </button>
              </Link>
              <Link href="mailto:contato@thealert.io">
                <button className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-base hover:bg-white/10 transition-all duration-200">
                  Falar com vendas
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}