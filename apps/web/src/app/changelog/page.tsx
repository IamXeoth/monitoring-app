import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ScrollToTop } from '@/components/ScrollToTop';

interface ChangelogEntry {
  date: string;
  tag: string;
  title: string;
  description: string;
  content?: string[];
  image?: React.ReactNode;
}

const changelogEntries: ChangelogEntry[] = [
  {
    date: 'Fev 6, 2026',
    tag: 'Feature',
    title: 'Sistema de alertas multicanal',
    description: 'Agora você pode receber alertas por Slack, Discord, Telegram e webhooks personalizados.',
    content: [
      'Configure múltiplos canais de notificação para cada monitor',
      'Integração nativa com Slack, Discord e Telegram',
      'Webhooks personalizados para integrar com suas próprias ferramentas',
      'Escalonamento automático de alertas baseado em severidade'
    ]
  },
  {
    date: 'Jan 30, 2026',
    tag: 'Improvement',
    title: 'Performance do dashboard melhorada',
    description: 'Otimizamos o carregamento do dashboard em 60%. Agora tudo carrega instantaneamente.',
    content: [
      'Redução de 60% no tempo de carregamento inicial',
      'Cache inteligente de dados de monitores',
      'Lazy loading de gráficos e estatísticas',
      'Prefetch de rotas mais acessadas'
    ],
    image: (
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl font-bold text-green-600 mb-2">60%</div>
          <div className="text-sm text-green-700 font-medium">Mais rápido</div>
        </div>
      </div>
    )
  },
  {
    date: 'Jan 22, 2026',
    tag: 'Feature',
    title: 'Status pages públicas',
    description: 'Crie páginas de status personalizadas para compartilhar o uptime dos seus serviços com seus clientes.',
    content: [
      'Design totalmente customizável com sua marca',
      'Domínios personalizados disponíveis',
      'Histórico de incidentes público',
      'Subscribe para receber atualizações por email'
    ],
    image: (
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Logo TheAlert - 3 barras */}
            <div className="flex items-center gap-0.5 p-2 bg-slate-900 rounded-xl">
              <div className="w-0.5 h-4 rounded-full bg-white"></div>
              <div className="w-0.5 h-4 rounded-full bg-white"></div>
              <div className="w-0.5 h-4 rounded-full bg-white"></div>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">Status do Sistema</div>
              <div className="text-xs text-slate-500">status.seusite.com</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Todos os sistemas operacionais
          </div>
        </div>
        <div className="space-y-2">
          {['API', 'Dashboard', 'Website'].map((service) => (
            <div key={service} className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-700">{service}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-green-600 font-medium">99.9%</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    date: 'Jan 15, 2026',
    tag: 'Design',
    title: 'Novo design do dashboard',
    description: 'Interface completamente redesenhada com foco em usabilidade e minimalismo.',
    content: [
      'Navegação mais intuitiva e rápida',
      'Dark mode disponível em todas as páginas',
      'Gráficos e visualizações mais claras',
      'Responsivo para todos os dispositivos'
    ]
  },
  {
    date: 'Jan 8, 2026',
    tag: 'Feature',
    title: 'Monitoramento de SSL/TLS',
    description: 'Receba alertas antes dos seus certificados SSL expirarem.',
    content: [
      'Verificação automática de certificados SSL',
      'Alertas 30, 15 e 7 dias antes do vencimento',
      'Validação de cadeia de certificados',
      'Suporte para certificados wildcard'
    ],
    image: (
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-semibold text-blue-900">Certificado SSL</div>
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-blue-700">Domínio</span>
            <span className="font-mono text-blue-900">thealert.io</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-blue-700">Expira em</span>
            <span className="font-semibold text-blue-900">89 dias</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-blue-700">Emissor</span>
            <span className="text-blue-900">Let's Encrypt</span>
          </div>
        </div>
      </div>
    )
  },
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-[#f3f2f1]">
      <ScrollToTop />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="max-w-4xl mx-auto relative">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-semibold text-slate-900 mb-4 tracking-tight">
              O que há de novo?
            </h1>
            <p className="text-lg text-slate-600 font-normal max-w-2xl mx-auto">
              Um registro de novos recursos, melhorias de design e anúncios importantes
            </p>
          </div>

          {/* Subscribe Button */}
          <div className="flex justify-center">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#18181B] text-white rounded-xl font-medium text-sm hover:bg-[#18181B]/90 transition-all duration-200">
              Assinar atualizações
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Changelog Entries */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-16">
            {changelogEntries.map((entry, index) => (
              <article key={index} className="relative">
                {/* Date & Tag */}
                <div className="flex items-center gap-4 mb-4">
                  <time className="text-sm text-slate-500 font-normal">
                    {entry.date}
                  </time>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                    entry.tag === 'Feature' 
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : entry.tag === 'Improvement'
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-purple-100 text-purple-700 border border-purple-200'
                  }`}>
                    {entry.tag}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-semibold text-slate-900 mb-3 tracking-tight">
                  {entry.title}
                </h2>

                {/* Description */}
                <p className="text-base text-slate-600 font-normal mb-6 leading-relaxed">
                  {entry.description}
                </p>

                {/* Content List */}
                {entry.content && (
                  <ul className="space-y-3 mb-6">
                    {entry.content.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                        <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Image/Visual */}
                {entry.image && (
                  <div className="mt-6">
                    {entry.image}
                  </div>
                )}

                {/* Divider */}
                {index < changelogEntries.length - 1 && (
                  <div className="mt-16 border-t border-slate-200"></div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <h3 className="text-2xl font-semibold text-slate-900 mb-3 tracking-tight">
              Junte-se a 1.000+ empresas
            </h3>
            <p className="text-base text-slate-600 font-normal mb-8">
              Comece a monitorar seus serviços gratuitamente hoje
            </p>
            <Link href="/register">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#18181B] text-white rounded-xl font-medium text-sm hover:bg-[#18181B]/90 transition-all duration-200">
                Começar grátis
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}