import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ScrollToTop } from '@/components/ScrollToTop';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f3f2f1]">
      <ScrollToTop />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-green-400/10 to-green-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="max-w-4xl mx-auto relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6">
              {/* Logo TheAlert - 3 barras */}
              <div className="flex items-center gap-1">
                <div className="w-2 h-10 rounded-full bg-slate-900"></div>
                <div className="w-2 h-10 rounded-full bg-slate-900"></div>
                <div className="w-2 h-10 rounded-full bg-slate-900"></div>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold text-slate-900 mb-6 tracking-tight">
              Feito por brasileiros,
              <br />
              para brasileiros
            </h1>
            <p className="text-xl text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
              Monitoramento de uptime profissional, com preços justos em reais e suporte que fala a sua língua
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {/* Origin Story */}
            <div>
              <h2 className="text-3xl font-semibold text-slate-900 mb-6 tracking-tight">
                Como tudo começou
              </h2>
              <div className="space-y-4 text-base text-slate-600 leading-relaxed">
                <p>
                  Em 2024, cansados de pagar fortunas em dólar por ferramentas de monitoramento estrangeiras, decidimos criar algo diferente. Algo nosso. Algo que fizesse sentido para a realidade brasileira.
                </p>
                <p>
                  Éramos desenvolvedores e empreendedores que viviam o mesmo problema: todo mês, aquela dor de ver a fatura do cartão explodir por causa da variação cambial. Serviços essenciais custando 3x, 4x mais por conta do dólar. E o pior: suporte em inglês, horários incompatíveis, e uma sensação constante de estar pagando muito por features que nunca usávamos.
                </p>
                <p>
                  Foi aí que nasceu o <strong className="font-semibold text-slate-900">TheAlert</strong>. Um sistema de alertas vigilante, sempre atento, resistente. Exatamente o que seu sistema precisa ser. E mais importante: é nosso, é brasileiro.
                </p>
              </div>
            </div>

            {/* Mission */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4 tracking-tight">
                Nossa missão
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Democratizar o acesso a ferramentas profissionais de monitoramento para startups, PMEs e desenvolvedores brasileiros, sem que a cotação do dólar seja uma preocupação.
              </p>
            </div>

            {/* Why Brazil */}
            <div>
              <h2 className="text-3xl font-semibold text-slate-900 mb-6 tracking-tight">
                Por que 100% brasileiro importa?
              </h2>
              <div className="grid gap-6">
                {[
                  {
                    title: '💰 Preços justos em Real',
                    description: 'Sem surpresas na fatura. R$ 20 é R$ 20, não importa se o dólar está a R$ 5 ou R$ 6. Você planeja seu orçamento com previsibilidade.'
                  },
                  {
                    title: '🕐 Suporte no seu horário',
                    description: 'Nada de esperar 12 horas por uma resposta porque o suporte está do outro lado do mundo. Estamos aqui, no mesmo fuso horário, falando português.'
                  },
                  {
                    title: '🧾 Nota fiscal brasileira',
                    description: 'CNPJ, nota fiscal paulista, tudo certinho para sua contabilidade. Sem complicação com pagamentos internacionais ou IOF.'
                  },
                  {
                    title: '🏦 Pagamento local',
                    description: 'PIX, boleto, cartão brasileiro. Sem taxas absurdas de conversão ou problemas com cartões internacionais.'
                  },
                  {
                    title: '⚡ Servidores no Brasil',
                    description: 'Latência baixa, dados sob legislação brasileira (LGPD), e monitoramento de servidores brasileiros com muito mais precisão.'
                  },
                  {
                    title: '🤝 Entendemos sua realidade',
                    description: 'Sabemos o que é lidar com orçamento apertado, saber que cada real conta, e precisar de ferramentas profissionais sem pagar preço de gringo.'
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-white rounded-xl border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Values */}
            <div>
              <h2 className="text-3xl font-semibold text-slate-900 mb-6 tracking-tight">
                Nossos valores
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    Transparência absoluta
                  </h3>
                  <p className="text-base text-slate-600 leading-relaxed">
                    Sem pegadinhas, sem letras miúdas. O que você vê na página de preços é exatamente o que você paga. Status da plataforma público, changelog aberto, e comunicação direta.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    Foco no essencial
                  </h3>
                  <p className="text-base text-slate-600 leading-relaxed">
                    Não queremos ter 500 features que ninguém usa. Queremos fazer monitoramento de uptime absurdamente bem, com alertas confiáveis e relatórios claros. O resto é perfumaria.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    Crescimento sustentável
                  </h3>
                  <p className="text-base text-slate-600 leading-relaxed">
                    Não somos uma startup queimando dinheiro de VC. Somos bootstrapped, crescemos com a receita dos clientes, e isso significa que nosso sucesso está 100% alinhado com o seu. Se você cresce, crescemos juntos.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    Comunidade em primeiro lugar
                  </h3>
                  <p className="text-base text-slate-600 leading-relaxed">
                    Ouvimos nossos usuários de verdade. Muitas features que temos hoje vieram de sugestões da comunidade. Você não é só mais um número em um dashboard de métricas.
                  </p>
                </div>
              </div>
            </div>

            {/* For Who */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 p-8">
              <h2 className="text-3xl font-semibold text-slate-900 mb-6 tracking-tight">
                Para quem é o TheAlert?
              </h2>
              <div className="space-y-4 text-base text-slate-700 leading-relaxed">
                <p>
                  <strong className="font-semibold text-slate-900">Startups brasileiras</strong> que precisam de monitoramento profissional mas têm orçamento limitado e não podem depender do dólar.
                </p>
                <p>
                  <strong className="font-semibold text-slate-900">Desenvolvedores independentes</strong> que querem ter certeza que seus projetos estão no ar, sem pagar R$ 200+ por mês.
                </p>
                <p>
                  <strong className="font-semibold text-slate-900">PMEs</strong> que precisam de SLA, relatórios e alertas confiáveis para manter seus clientes felizes.
                </p>
                <p>
                  <strong className="font-semibold text-slate-900">Agências</strong> que gerenciam múltiplos clientes e precisam de visibilidade centralizada sem custo proibitivo.
                </p>
                <p>
                  <strong className="font-semibold text-slate-900">Empresas que valorizam suporte em português</strong>, transparência de preços em real, e facilidade de contratação sem burocracia internacional.
                </p>
              </div>
            </div>

            {/* Commitment */}
            <div>
              <h2 className="text-3xl font-semibold text-slate-900 mb-6 tracking-tight">
                Nosso compromisso
              </h2>
              <div className="space-y-4 text-base text-slate-600 leading-relaxed">
                <p>
                  Prometemos manter os preços acessíveis e previsíveis. Quando tivermos que aumentar (inflação, custos, etc.), avisaremos com 30 dias de antecedência. Nada de acordar com a conta 3x mais cara porque o dólar subiu.
                </p>
                <p>
                  Prometemos ser transparentes. Se a plataforma cair, você vai saber. Se tivermos um problema, vamos comunicar. Se fizermos besteira, vamos admitir e corrigir.
                </p>
                <p>
                  Prometemos continuar brasileiros. Mesmo se crescermos, mesmo se aparecerem propostas de investimento estrangeiro, nossa base, nossos preços e nosso compromisso com o mercado brasileiro não mudam.
                </p>
                <p className="text-lg font-medium text-slate-900 pt-4">
                  Porque no fim das contas, entendemos que cada real economizado em ferramenta é um real que você pode investir no que realmente importa: fazer seu negócio crescer.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { number: '100%', label: 'Brasileiro' },
                { number: 'R$', label: 'Em Reais' },
                { number: '99.9%', label: 'Uptime' },
                { number: '<2min', label: 'Suporte médio' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-slate-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-slate-600 font-normal">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Team Note */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              {/* Logo TheAlert - 3 barras */}
              <div className="flex items-center justify-center gap-1 mb-4">
                <div className="w-2 h-12 rounded-full bg-slate-900"></div>
                <div className="w-2 h-12 rounded-full bg-slate-900"></div>
                <div className="w-2 h-12 rounded-full bg-slate-900"></div>
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-3 tracking-tight">
                Feito com ❤️ em São Paulo
              </h3>
              <p className="text-base text-slate-600 font-normal mb-6 max-w-2xl mx-auto">
                Somos um time pequeno mas dedicado, focado em construir a melhor plataforma de monitoramento para o mercado brasileiro. Cada linha de código, cada feature, cada decisão de produto é pensada para você.
              </p>
              <div className="text-sm text-slate-500">
                São Paulo, SP • Brasil • 🇧🇷
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#18181B] rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-semibold text-white mb-4 tracking-tight">
              Pronto para começar?
            </h2>
            <p className="text-lg text-slate-300 font-normal mb-8 max-w-2xl mx-auto">
              Junte-se a centenas de empresas brasileiras que escolheram monitorar com transparência, em reais, e com suporte que entende você.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold text-base hover:bg-slate-100 transition-all duration-200">
                  Começar grátis
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </Link>
              <Link href="/#pricing">
                <button className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-base hover:bg-white/10 transition-all duration-200">
                  Ver preços
                </button>
              </Link>
            </div>
            <p className="text-sm text-slate-400 font-normal mt-6">
              Sem cartão de crédito • Cancele quando quiser • Suporte em português
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}