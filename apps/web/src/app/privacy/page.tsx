import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ScrollToTop } from '@/components/ScrollToTop';

interface Section {
  id: string;
  title: string;
  subsections?: {
    id: string;
    title: string;
    content: string;
  }[];
  content?: string;
}

const sections: Section[] = [
  {
    id: 'introduction',
    title: '1) Introdução',
    content: 'Na TheAlert, levamos sua privacidade a sério. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais quando você utiliza nossa plataforma de monitoramento de uptime. Ao usar nossos serviços, você concorda com as práticas descritas nesta política. Nossa abordagem coloca a proteção de dados no centro de tudo o que fazemos, priorizando a confidencialidade e integridade de cada informação que você nos confia.'
  },
  {
    id: 'information',
    title: '2) Informações que Coletamos',
    subsections: [
      {
        id: 'information-account',
        title: '2.1 Informações de Conta',
        content: 'Coletamos informações quando você cria uma conta: nome completo, endereço de e-mail, senha criptografada, nome da empresa (opcional), cargo/função (opcional). Estas informações são essenciais para fornecer acesso à plataforma e personalizar sua experiência.'
      },
      {
        id: 'information-usage',
        title: '2.2 Dados de Uso',
        content: 'Coletamos automaticamente informações sobre como você interage com nossa plataforma: endereço IP, tipo de navegador e versão, sistema operacional, páginas visitadas e tempo gasto, ações realizadas (criação de monitores, alertas, etc.), data e hora de acesso. Estes dados nos ajudam a melhorar continuamente nossos serviços.'
      },
      {
        id: 'information-monitoring',
        title: '2.3 Dados de Monitoramento',
        content: 'Armazenamos informações relacionadas aos seus monitores: URLs e endpoints configurados, intervalos de verificação, histórico de uptime e downtime, dados de resposta (código de status, tempo de resposta), logs de incidentes. Estas informações são necessárias para fornecer o serviço de monitoramento.'
      },
      {
        id: 'information-payment',
        title: '2.4 Informações de Pagamento',
        content: 'Para planos pagos, processamos informações de pagamento através do Stripe. Não armazenamos dados completos de cartão de crédito em nossos servidores. Mantemos apenas: últimos 4 dígitos do cartão, data de expiração, histórico de transações, status da assinatura.'
      },
      {
        id: 'information-communication',
        title: '2.5 Comunicações',
        content: 'Quando você entra em contato conosco, armazenamos: conteúdo das mensagens, endereço de e-mail, histórico de tickets de suporte, feedback fornecido.'
      }
    ]
  },
  {
    id: 'usage',
    title: '3) Como Usamos Suas Informações',
    subsections: [
      {
        id: 'usage-service',
        title: '3.1 Fornecimento do Serviço',
        content: 'Utilizamos seus dados para: operar e manter a plataforma de monitoramento, processar e executar verificações de uptime, enviar alertas e notificações configuradas, gerenciar sua conta e autenticação, processar pagamentos e gerenciar assinaturas.'
      },
      {
        id: 'usage-improvement',
        title: '3.2 Melhoria e Desenvolvimento',
        content: 'Analisamos dados agregados e anonimizados para: identificar tendências de uso, melhorar funcionalidades existentes, desenvolver novos recursos, otimizar performance da plataforma, realizar testes A/B e experimentos.'
      },
      {
        id: 'usage-communication',
        title: '3.3 Comunicação',
        content: 'Podemos usar suas informações de contato para: enviar notificações sobre o serviço, informar sobre atualizações importantes, responder a solicitações de suporte, enviar newsletters (com seu consentimento), comunicar mudanças nos termos ou políticas.'
      },
      {
        id: 'usage-security',
        title: '3.4 Segurança e Conformidade',
        content: 'Utilizamos dados para: prevenir fraudes e abusos, detectar e investigar atividades suspeitas, cumprir obrigações legais, proteger direitos e propriedade da TheAlert e usuários, aplicar nossos Termos de Serviço.'
      }
    ]
  },
  {
    id: 'protection',
    title: '4) Proteção de Dados',
    subsections: [
      {
        id: 'protection-security',
        title: '4.1 Medidas de Segurança',
        content: 'Implementamos múltiplas camadas de segurança: criptografia SSL/TLS para dados em trânsito, criptografia AES-256 para dados em repouso, senhas com hash bcrypt, autenticação de dois fatores (2FA) disponível, firewalls e proteção contra DDoS, monitoramento 24/7 de segurança, auditorias de segurança regulares.'
      },
      {
        id: 'protection-access',
        title: '4.2 Controle de Acesso',
        content: 'Limitamos o acesso aos seus dados: apenas funcionários autorizados têm acesso, acesso baseado no princípio do menor privilégio, logs de auditoria de todos os acessos, revisões periódicas de permissões, treinamento obrigatório de segurança para equipe.'
      },
      {
        id: 'protection-infrastructure',
        title: '4.3 Infraestrutura',
        content: 'Hospedamos nossos serviços em provedores tier-1 certificados: certificações ISO 27001, SOC 2 Type II, backups diários automatizados, redundância geográfica de dados, plano de recuperação de desastres, uptime garantido de 99.9%.'
      }
    ]
  },
  {
    id: 'rights',
    title: '5) Seus Direitos (LGPD)',
    subsections: [
      {
        id: 'rights-access',
        title: '5.1 Direito de Acesso',
        content: 'Você tem o direito de solicitar e receber uma cópia de todos os dados pessoais que mantemos sobre você. Responderemos à sua solicitação em até 15 dias úteis.'
      },
      {
        id: 'rights-correction',
        title: '5.2 Direito de Correção',
        content: 'Você pode atualizar ou corrigir suas informações pessoais a qualquer momento através das configurações da conta ou entrando em contato conosco.'
      },
      {
        id: 'rights-deletion',
        title: '5.3 Direito ao Esquecimento',
        content: 'Você pode solicitar a exclusão de sua conta e dados pessoais. Importante: dados de monitoramento serão anonimizados, logs de segurança podem ser mantidos conforme exigido por lei, backups serão excluídos no próximo ciclo (90 dias).'
      },
      {
        id: 'rights-portability',
        title: '5.4 Portabilidade de Dados',
        content: 'Você pode exportar seus dados em formato estruturado (JSON, CSV) a qualquer momento através do painel de controle.'
      },
      {
        id: 'rights-opposition',
        title: '5.5 Direito de Oposição',
        content: 'Você pode se opor ao processamento de seus dados para fins de marketing direto ou outros fins legítimos.'
      },
      {
        id: 'rights-revocation',
        title: '5.6 Revogação de Consentimento',
        content: 'Onde o processamento é baseado em consentimento, você pode revogá-lo a qualquer momento através das configurações da conta.'
      }
    ]
  },
  {
    id: 'sharing',
    title: '6) Compartilhamento de Dados',
    subsections: [
      {
        id: 'sharing-service',
        title: '6.1 Provedores de Serviço',
        content: 'Compartilhamos dados apenas com parceiros confiáveis: Stripe (processamento de pagamentos), Vercel/AWS (hospedagem), Resend (serviço de e-mail), Upstash (cache e filas), Axiom (logs e analytics). Todos os fornecedores são obrigados contratualmente a proteger seus dados.'
      },
      {
        id: 'sharing-legal',
        title: '6.2 Requisitos Legais',
        content: 'Podemos divulgar informações quando exigido por lei: ordem judicial ou intimação, investigação governamental, proteger direitos e segurança, prevenir fraude ou abuso, conformidade com regulamentos aplicáveis.'
      },
      {
        id: 'sharing-business',
        title: '6.3 Transferências de Negócio',
        content: 'Em caso de fusão, aquisição ou venda de ativos, seus dados podem ser transferidos. Você será notificado via e-mail sobre qualquer mudança de propriedade.'
      },
      {
        id: 'sharing-no-sale',
        title: '6.4 Não Vendemos Dados',
        content: 'Nunca vendemos, alugamos ou comercializamos suas informações pessoais para terceiros. Seus dados são seus.'
      }
    ]
  },
  {
    id: 'cookies',
    title: '7) Cookies e Tecnologias de Rastreamento',
    subsections: [
      {
        id: 'cookies-essential',
        title: '7.1 Cookies Essenciais',
        content: 'Necessários para operação da plataforma: sessão de autenticação, preferências de idioma, tokens de segurança CSRF, configurações de interface. Estes não podem ser desativados.'
      },
      {
        id: 'cookies-functional',
        title: '7.2 Cookies Funcionais',
        content: 'Melhoram sua experiência: lembrar preferências, tema claro/escuro, últimas ações, configurações de dashboard.'
      },
      {
        id: 'cookies-analytics',
        title: '7.3 Cookies Analíticos',
        content: 'Nos ajudam a entender o uso (com seu consentimento): páginas mais visitadas, tempo de permanência, caminhos de navegação, taxas de conversão. Usamos analytics com privacidade preservada.'
      },
      {
        id: 'cookies-control',
        title: '7.4 Controle de Cookies',
        content: 'Você pode gerenciar cookies através: das configurações do navegador, do nosso painel de preferências de cookies, ferramentas de opt-out específicas. Note que desabilitar cookies pode afetar funcionalidades.'
      }
    ]
  },
  {
    id: 'retention',
    title: '8) Retenção de Dados',
    subsections: [
      {
        id: 'retention-account',
        title: '8.1 Dados de Conta',
        content: 'Mantidos enquanto sua conta estiver ativa. Após exclusão: dados pessoais removidos em 30 dias, dados anonimizados mantidos para analytics, backups deletados em 90 dias.'
      },
      {
        id: 'retention-monitoring',
        title: '8.2 Dados de Monitoramento',
        content: 'Períodos de retenção por plano: FREE - 7 dias, STARTER - 30 dias, PRO - 90 dias, BUSINESS - 1 ano. Após o período, dados são agregados e anonimizados.'
      },
      {
        id: 'retention-legal',
        title: '8.3 Obrigações Legais',
        content: 'Alguns dados podem ser mantidos por períodos mais longos quando exigido por lei: registros financeiros - 5 anos, logs de segurança - 1 ano, dados fiscais - conforme legislação aplicável.'
      }
    ]
  },
  {
    id: 'international',
    title: '9) Transferências Internacionais',
    subsections: [
      {
        id: 'international-location',
        title: '9.1 Localização de Dados',
        content: 'Nossos servidores principais estão localizados no Brasil e Estados Unidos. Dados podem ser processados em outras jurisdições por nossos provedores de serviço.'
      },
      {
        id: 'international-protection',
        title: '9.2 Proteções',
        content: 'Para transferências internacionais, garantimos: cláusulas contratuais padrão, certificações de adequação, nível equivalente de proteção, conformidade com LGPD e GDPR.'
      }
    ]
  },
  {
    id: 'children',
    title: '10) Proteção de Menores',
    content: 'Nossos serviços não são direcionados a menores de 18 anos. Não coletamos intencionalmente informações de crianças. Se tomarmos conhecimento de que coletamos dados de um menor, tomaremos medidas para deletá-los imediatamente. Pais ou responsáveis que acreditem que seu filho forneceu informações devem nos contactar.'
  },
  {
    id: 'changes',
    title: '11) Alterações nesta Política',
    content: 'Podemos atualizar esta Política de Privacidade periodicamente. Quando fizermos mudanças significativas: notificaremos você por e-mail, exibiremos um aviso na plataforma, atualizaremos a data "Última atualização" no topo. Mudanças entram em vigor 30 dias após a notificação. Seu uso continuado após mudanças constitui aceitação da nova política.'
  },
  {
    id: 'contact',
    title: '12) Contato e Encarregado de Dados',
    content: 'Para questões sobre privacidade, exercer seus direitos ou reportar preocupações, entre em contato:\n\nEncarregado de Dados (DPO): Carlos Eduardo Silva\nE-mail: privacidade@thealert.io\nTelefone: +55 (11) 98765-4321\n\nTheAlert Tecnologia Ltda.\nCNPJ: 12.345.678/0001-90\nEndereço: Rua das Flores, 123, São Paulo - SP, 01234-567\n\nTempo de resposta: até 15 dias úteis para solicitações relacionadas à LGPD.'
  }
];

const lastUpdated = 'Março 1, 2024';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f3f2f1]">
      <ScrollToTop />
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="sticky top-24">
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="block text-sm text-slate-600 hover:text-slate-900 transition-colors py-2 font-normal"
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              {/* Header */}
              <div className="mb-12">
                <p className="text-sm text-slate-500 font-normal mb-4">
                  Última atualização: {lastUpdated}
                </p>
                <h1 className="text-5xl md:text-6xl font-semibold text-slate-900 mb-6 tracking-tight">
                  Política de Privacidade
                </h1>
              </div>

              {/* Sections */}
              <div className="space-y-12">
                {sections.map((section) => (
                  <section key={section.id} id={section.id} className="scroll-mt-24">
                    <h2 className="text-2xl font-semibold text-slate-900 mb-4 tracking-tight">
                      {section.title}
                    </h2>
                    
                    {section.content && (
                      <p className="text-base text-slate-600 font-normal leading-relaxed whitespace-pre-line">
                        {section.content}
                      </p>
                    )}

                    {section.subsections && (
                      <div className="space-y-6 mt-6">
                        {section.subsections.map((subsection) => (
                          <div key={subsection.id} id={subsection.id} className="scroll-mt-24">
                            <h3 className="text-lg font-semibold text-slate-900 mb-3">
                              {subsection.title}
                            </h3>
                            <p className="text-base text-slate-600 font-normal leading-relaxed">
                              {subsection.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                ))}
              </div>

              {/* Footer Notice */}
              <div className="mt-16 p-6 bg-slate-100 rounded-2xl border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Perguntas sobre Privacidade?
                </h3>
                <p className="text-sm text-slate-600 font-normal mb-4">
                  Estamos aqui para ajudar. Entre em contato com nosso time de privacidade para qualquer dúvida.
                </p>
                <Link href="mailto:privacidade@thealert.io">
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#18181B] text-white rounded-xl font-medium text-sm hover:bg-[#18181B]/90 transition-all duration-200">
                    Contatar DPO
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </button>
                </Link>
              </div>
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}