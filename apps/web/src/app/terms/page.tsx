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
    id: 'acceptance',
    title: '1) Aceitação dos Termos',
    content: 'Bem-vindo ao TheAlert! Estes Termos e Condições de Uso ("Termos") regem seu acesso e uso da plataforma de monitoramento de uptime TheAlert ("Serviço"), operada pela TheAlert Tecnologia Ltda. ("TheAlert", "nós", "nosso"). Ao criar uma conta, acessar ou usar nosso Serviço, você concorda em ficar vinculado a estes Termos. Se você não concorda com qualquer parte destes Termos, não deve usar nosso Serviço. Estes Termos constituem um acordo legal vinculante entre você (indivíduo ou entidade) e a TheAlert.'
  },
  {
    id: 'definitions',
    title: '2) Definições',
    subsections: [
      {
        id: 'definitions-service',
        title: '2.1 Serviço',
        content: 'Refere-se à plataforma TheAlert, incluindo o website, aplicação web, API, documentação e todos os recursos relacionados de monitoramento de uptime e disponibilidade.'
      },
      {
        id: 'definitions-user',
        title: '2.2 Usuário',
        content: 'Você, a pessoa física ou jurídica que cria uma conta e utiliza o Serviço.'
      },
      {
        id: 'definitions-account',
        title: '2.3 Conta',
        content: 'O perfil de usuário criado para acessar e utilizar o Serviço, incluindo todas as configurações, monitores e dados associados.'
      },
      {
        id: 'definitions-content',
        title: '2.4 Conteúdo',
        content: 'Todas as informações, dados, texto, software, música, som, fotografias, gráficos, vídeos, mensagens ou outros materiais.'
      },
      {
        id: 'definitions-monitor',
        title: '2.5 Monitor',
        content: 'Configuração de verificação de disponibilidade de um endpoint, URL ou serviço criada pelo Usuário na plataforma.'
      }
    ]
  },
  {
    id: 'eligibility',
    title: '3) Elegibilidade',
    content: 'Para usar o Serviço, você deve: ter pelo menos 18 anos de idade, ter capacidade legal para celebrar contratos vinculantes, não estar proibido de usar o Serviço sob as leis aplicáveis, fornecer informações verdadeiras, precisas e completas durante o registro. Se você está usando o Serviço em nome de uma organização, você declara e garante que tem autoridade para vincular essa organização a estes Termos.'
  },
  {
    id: 'account',
    title: '4) Conta e Registro',
    subsections: [
      {
        id: 'account-creation',
        title: '4.1 Criação de Conta',
        content: 'Para usar o Serviço, você deve criar uma conta fornecendo: endereço de e-mail válido, senha segura, nome completo, informações da empresa (opcional). Você pode se registrar diretamente ou através de provedores OAuth (Google, GitHub).'
      },
      {
        id: 'account-responsibility',
        title: '4.2 Responsabilidade pela Conta',
        content: 'Você é responsável por: manter a confidencialidade de suas credenciais, todas as atividades que ocorrem em sua conta, notificar-nos imediatamente sobre uso não autorizado, não compartilhar sua conta com terceiros, manter suas informações de contato atualizadas.'
      },
      {
        id: 'account-security',
        title: '4.3 Segurança',
        content: 'Você deve: usar uma senha forte e única, habilitar autenticação de dois fatores (2FA) quando disponível, não usar credenciais comprometidas, fazer logout de sessões não utilizadas.'
      },
      {
        id: 'account-termination',
        title: '4.4 Suspensão e Encerramento',
        content: 'Reservamo-nos o direito de suspender ou encerrar sua conta se: você violar estes Termos, detectarmos atividade fraudulenta ou abusiva, for necessário para cumprir obrigações legais, sua conta ficar inativa por mais de 12 meses (plano gratuito). Você pode encerrar sua conta a qualquer momento através das configurações.'
      }
    ]
  },
  {
    id: 'plans',
    title: '5) Planos e Pagamento',
    subsections: [
      {
        id: 'plans-types',
        title: '5.1 Tipos de Plano',
        content: 'Oferecemos diferentes planos de serviço: FREE (gratuito, recursos limitados), STARTER (R$ 20/mês), PRO (R$ 40/mês), BUSINESS (R$ 70/mês). Os recursos, limites e preços de cada plano estão descritos em nossa página de preços.'
      },
      {
        id: 'plans-billing',
        title: '5.2 Faturamento',
        content: 'Planos pagos são cobrados: mensalmente ou anualmente (com desconto), automaticamente no início de cada período, via cartão de crédito processado pelo Stripe. Você autoriza cobranças recorrentes.'
      },
      {
        id: 'plans-changes',
        title: '5.3 Mudanças de Plano',
        content: 'Você pode: fazer upgrade a qualquer momento (cobrado pro-rata), fazer downgrade (efeito no próximo ciclo), cancelar a qualquer momento (sem reembolso pro-rata). Ao fazer upgrade, você será cobrado imediatamente pela diferença proporcional.'
      },
      {
        id: 'plans-payment-failure',
        title: '5.4 Falha de Pagamento',
        content: 'Se um pagamento falhar: tentaremos cobrar novamente por até 3 vezes, você será notificado por e-mail, sua conta pode ser suspensa após 7 dias, monitores serão pausados após suspensão. Após 30 dias de não pagamento, sua conta pode ser encerrada.'
      },
      {
        id: 'plans-refund',
        title: '5.5 Política de Reembolso',
        content: 'Oferecemos reembolso total se: você cancelar dentro de 7 dias da primeira cobrança, houver erro comprovado em nosso sistema, conforme exigido por lei. Não oferecemos reembolsos pro-rata para cancelamentos após o período de garantia.'
      },
      {
        id: 'plans-price-changes',
        title: '5.6 Alterações de Preço',
        content: 'Podemos alterar preços com: 30 dias de aviso prévio por e-mail, novos preços aplicados no próximo ciclo de faturamento, opção de cancelar antes da mudança. Preços existentes são mantidos até o fim do período pago.'
      }
    ]
  },
  {
    id: 'usage',
    title: '6) Uso Aceitável',
    subsections: [
      {
        id: 'usage-permitted',
        title: '6.1 Usos Permitidos',
        content: 'Você pode usar o Serviço para: monitorar disponibilidade de seus próprios serviços, configurar alertas e notificações, gerar relatórios de uptime, integrar com ferramentas de terceiros via API, criar status pages públicas.'
      },
      {
        id: 'usage-prohibited',
        title: '6.2 Usos Proibidos',
        content: 'Você NÃO pode: usar o Serviço para atividades ilegais, violar direitos de propriedade intelectual, realizar ataques DDoS ou scans maliciosos, fazer engenharia reversa da plataforma, revender ou sublicenciar o Serviço, usar bots ou scraping não autorizado, sobrecarregar nossa infraestrutura, monitorar serviços sem autorização do proprietário, usar para spam ou phishing, burlar limites do plano, criar múltiplas contas gratuitas, compartilhar credenciais de acesso.'
      },
      {
        id: 'usage-monitoring-limits',
        title: '6.3 Limites de Monitoramento',
        content: 'Você deve respeitar: número máximo de monitores por plano, intervalo mínimo de verificação, limite de alertas por mês, taxa de uso da API. Uso excessivo pode resultar em throttling ou suspensão.'
      },
      {
        id: 'usage-fair-use',
        title: '6.4 Política de Uso Justo',
        content: 'Reservamos o direito de aplicar limites razoáveis de uso para proteger a qualidade do serviço para todos os usuários.'
      }
    ]
  },
  {
    id: 'content',
    title: '7) Conteúdo e Propriedade Intelectual',
    subsections: [
      {
        id: 'content-ownership',
        title: '7.1 Seu Conteúdo',
        content: 'Você mantém todos os direitos sobre seus dados e configurações. Ao usar o Serviço, você nos concede uma licença limitada, mundial, não exclusiva para: armazenar e processar seus dados, realizar as verificações de monitoramento, exibir estatísticas e relatórios, fazer backups. Esta licença termina quando você deleta seus dados ou encerra sua conta.'
      },
      {
        id: 'content-thealert',
        title: '7.2 Conteúdo da TheAlert',
        content: 'O Serviço e todo o conteúdo, recursos e funcionalidades são propriedade da TheAlert e protegidos por: direitos autorais, marcas registradas, patentes, segredos comerciais, outras leis de propriedade intelectual. Você não adquire nenhum direito sobre nossa propriedade intelectual, exceto o direito limitado de uso conforme estes Termos.'
      },
      {
        id: 'content-feedback',
        title: '7.3 Feedback',
        content: 'Se você fornecer sugestões, ideias ou feedback sobre o Serviço, você nos concede o direito de usar, modificar e incorporar esse feedback sem compensação ou atribuição.'
      },
      {
        id: 'content-dmca',
        title: '7.4 Denúncias de Violação',
        content: 'Se você acredita que seu conteúdo foi usado indevidamente, entre em contato: legal@thealert.io com descrição detalhada da violação.'
      }
    ]
  },
  {
    id: 'data',
    title: '8) Dados e Privacidade',
    subsections: [
      {
        id: 'data-collection',
        title: '8.1 Coleta de Dados',
        content: 'Coletamos e processamos dados conforme nossa Política de Privacidade, que é parte integrante destes Termos.'
      },
      {
        id: 'data-security',
        title: '8.2 Segurança de Dados',
        content: 'Implementamos medidas de segurança para proteger seus dados, mas não podemos garantir segurança absoluta. Você é responsável por: manter backups independentes de dados críticos, usar conexões seguras, proteger suas credenciais.'
      },
      {
        id: 'data-retention',
        title: '8.3 Retenção',
        content: 'Mantemos seus dados conforme descrito na Política de Privacidade. Após exclusão da conta: dados pessoais são removidos em 30 dias, dados de monitoramento são anonimizados, backups são excluídos em 90 dias.'
      },
      {
        id: 'data-export',
        title: '8.4 Portabilidade',
        content: 'Você pode exportar seus dados a qualquer momento em formato JSON ou CSV através do painel de controle.'
      }
    ]
  },
  {
    id: 'warranties',
    title: '9) Garantias e Isenções',
    subsections: [
      {
        id: 'warranties-service',
        title: '9.1 Nível de Serviço',
        content: 'Nos esforçamos para manter o Serviço disponível com 99.9% de uptime, mas: não garantimos operação ininterrupta, podemos realizar manutenções programadas, problemas podem ocorrer fora de nosso controle. Disponibilidade e SLA específicos variam por plano.'
      },
      {
        id: 'warranties-accuracy',
        title: '9.2 Precisão do Monitoramento',
        content: 'Fazemos o melhor para fornecer dados precisos, mas: não garantimos 100% de precisão, falsos positivos/negativos podem ocorrer, latência de rede pode afetar resultados, verificações são realizadas de localizações específicas. Você deve usar o Serviço como ferramenta auxiliar, não como única fonte de monitoramento crítico.'
      },
      {
        id: 'warranties-disclaimer',
        title: '9.3 Isenção de Garantias',
        content: 'O SERVIÇO É FORNECIDO "COMO ESTÁ" E "CONFORME DISPONÍVEL", SEM GARANTIAS DE QUALQUER TIPO, EXPRESSAS OU IMPLÍCITAS, INCLUINDO MAS NÃO LIMITADO A: COMERCIALIZAÇÃO, ADEQUAÇÃO A UM PROPÓSITO ESPECÍFICO, NÃO VIOLAÇÃO, PRECISÃO, CONFIABILIDADE, COMPLETUDE. Algumas jurisdições não permitem isenção de garantias implícitas, então esta isenção pode não se aplicar a você.'
      }
    ]
  },
  {
    id: 'liability',
    title: '10) Limitação de Responsabilidade',
    subsections: [
      {
        id: 'liability-indirect',
        title: '10.1 Danos Indiretos',
        content: 'EM NENHUMA CIRCUNSTÂNCIA SEREMOS RESPONSÁVEIS POR: DANOS INDIRETOS, INCIDENTAIS, ESPECIAIS, CONSEQUENCIAIS OU PUNITIVOS, PERDA DE LUCROS, RECEITA, DADOS OU USO, INTERRUPÇÃO DE NEGÓCIOS, FALHA EM DETECTAR DOWNTIME, NOTIFICAÇÕES NÃO ENTREGUES, ainda que tenhamos sido avisados da possibilidade de tais danos.'
      },
      {
        id: 'liability-cap',
        title: '10.2 Limite Máximo',
        content: 'Nossa responsabilidade total por todas as reclamações relacionadas ao Serviço está limitada ao valor que você pagou nos últimos 12 meses, ou R$ 100, o que for maior.'
      },
      {
        id: 'liability-exceptions',
        title: '10.3 Exceções',
        content: 'Estas limitações não se aplicam a: danos causados por nossa negligência grave ou dolo, violação de dados por nossa culpa exclusiva, responsabilidades que não podem ser limitadas por lei.'
      }
    ]
  },
  {
    id: 'indemnification',
    title: '11) Indenização',
    content: 'Você concorda em indenizar, defender e isentar a TheAlert, suas afiliadas, diretores, funcionários e agentes de todas as reclamações, perdas, responsabilidades, danos, custos e despesas (incluindo honorários advocatícios) decorrentes de: seu uso do Serviço, violação destes Termos, violação de direitos de terceiros, seu Conteúdo, atividades em sua conta.'
  },
  {
    id: 'api',
    title: '12) API e Integrações',
    subsections: [
      {
        id: 'api-access',
        title: '12.1 Acesso à API',
        content: 'Fornecemos acesso à API para planos elegíveis. Você deve: usar chaves de API válidas, respeitar limites de taxa (rate limits), não compartilhar chaves de API, implementar tratamento de erros adequado, seguir nossa documentação.'
      },
      {
        id: 'api-limits',
        title: '12.2 Limites',
        content: 'Limites de API variam por plano. Exceder limites pode resultar em: throttling temporário, suspensão de acesso à API, upgrade de plano necessário.'
      },
      {
        id: 'api-changes',
        title: '12.3 Alterações',
        content: 'Podemos modificar, deprecar ou descontinuar APIs com aviso prévio razoável (geralmente 90 dias para mudanças breaking).'
      }
    ]
  },
  {
    id: 'third-party',
    title: '13) Serviços de Terceiros',
    content: 'O Serviço pode integrar com ou conter links para serviços de terceiros: Stripe (pagamentos), OAuth providers (autenticação), webhooks externos, integrações (Slack, Discord, etc.). Não somos responsáveis por serviços de terceiros. Seu uso está sujeito aos termos desses serviços. Revise suas políticas de privacidade separadamente.'
  },
  {
    id: 'modifications',
    title: '14) Modificações do Serviço e Termos',
    subsections: [
      {
        id: 'modifications-service',
        title: '14.1 Modificações do Serviço',
        content: 'Podemos modificar, suspender ou descontinuar qualquer aspecto do Serviço a qualquer momento, com ou sem aviso. Não seremos responsáveis por modificações ou descontinuações.'
      },
      {
        id: 'modifications-terms',
        title: '14.2 Alterações dos Termos',
        content: 'Podemos revisar estes Termos periodicamente. Mudanças significativas serão notificadas: por e-mail para o endereço da conta, através de aviso na plataforma, com 30 dias de antecedência. Seu uso continuado após mudanças constitui aceitação. Se você não concordar, deve encerrar sua conta.'
      }
    ]
  },
  {
    id: 'termination',
    title: '15) Rescisão',
    subsections: [
      {
        id: 'termination-by-you',
        title: '15.1 Por Você',
        content: 'Você pode encerrar sua conta a qualquer momento através: das configurações da conta, ou contato com suporte. Cancelamentos de planos pagos são efetivos no fim do período de faturamento atual.'
      },
      {
        id: 'termination-by-us',
        title: '15.2 Por Nós',
        content: 'Podemos suspender ou encerrar seu acesso imediatamente, sem aviso, por: violação destes Termos, atividade fraudulenta ou ilegal, não pagamento (planos pagos), ordem judicial ou requisito legal. Faremos esforços razoáveis para permitir exportação de dados antes do encerramento, quando possível.'
      },
      {
        id: 'termination-effect',
        title: '15.3 Efeito da Rescisão',
        content: 'Após rescisão: seu acesso ao Serviço cessa imediatamente, monitores são pausados/deletados, você perde acesso aos dados (faça backup antes), obrigações de pagamento permanecem, seções que devem sobreviver continuam em vigor (Propriedade Intelectual, Limitação de Responsabilidade, Indenização, Resolução de Disputas).'
      }
    ]
  },
  {
    id: 'disputes',
    title: '16) Resolução de Disputas',
    subsections: [
      {
        id: 'disputes-informal',
        title: '16.1 Resolução Informal',
        content: 'Antes de iniciar qualquer procedimento formal, você concorda em tentar resolver a disputa informalmente entrando em contato: legal@thealert.io. Daremos 30 dias para resolução amigável.'
      },
      {
        id: 'disputes-governing-law',
        title: '16.2 Lei Aplicável',
        content: 'Estes Termos são regidos pelas leis da República Federativa do Brasil, sem considerar conflitos de disposições legais.'
      },
      {
        id: 'disputes-jurisdiction',
        title: '16.3 Jurisdição',
        content: 'Qualquer disputa decorrente destes Termos será submetida exclusivamente aos tribunais da Comarca de São Paulo, Estado de São Paulo, Brasil.'
      },
      {
        id: 'disputes-arbitration',
        title: '16.4 Arbitragem (Opcional)',
        content: 'As partes podem concordar mutuamente em submeter disputas à arbitragem conforme as regras da Câmara de Arbitragem.'
      }
    ]
  },
  {
    id: 'general',
    title: '17) Disposições Gerais',
    subsections: [
      {
        id: 'general-entire',
        title: '17.1 Acordo Integral',
        content: 'Estes Termos, juntamente com a Política de Privacidade, constituem o acordo integral entre você e a TheAlert.'
      },
      {
        id: 'general-waiver',
        title: '17.2 Renúncia',
        content: 'Nossa falha em exercer ou aplicar qualquer direito não constitui renúncia desse direito.'
      },
      {
        id: 'general-severability',
        title: '17.3 Separabilidade',
        content: 'Se qualquer disposição for considerada inválida, as demais disposições permanecerão em pleno vigor.'
      },
      {
        id: 'general-assignment',
        title: '17.4 Cessão',
        content: 'Você não pode ceder ou transferir estes Termos sem nosso consentimento. Podemos ceder livremente sem restrições.'
      },
      {
        id: 'general-notices',
        title: '17.5 Notificações',
        content: 'Notificações serão enviadas: para você - para o e-mail cadastrado, para nós - legal@thealert.io.'
      },
      {
        id: 'general-language',
        title: '17.6 Idioma',
        content: 'Estes Termos são redigidos em português. Versões em outros idiomas são apenas para conveniência. Em caso de conflito, a versão em português prevalece.'
      },
      {
        id: 'general-force-majeure',
        title: '17.7 Força Maior',
        content: 'Não seremos responsáveis por falhas ou atrasos devido a circunstâncias fora de nosso controle razoável.'
      }
    ]
  },
  {
    id: 'contact',
    title: '18) Informações de Contato',
    content: 'Para questões sobre estes Termos, entre em contato:\n\nTheAlert Tecnologia Ltda.\nCNPJ: 12.345.678/0001-90\nEndereço: Rua das Flores, 123, São Paulo - SP, 01234-567\n\nSuportes:\nE-mail: suporte@thealert.io\nJurídico: legal@thealert.io\nTelefone: +55 (11) 98765-4321\n\nHorário de atendimento: Segunda a Sexta, 9h às 18h (horário de Brasília)'
  }
];

const lastUpdated = 'Março 1, 2024';

export default function TermsPage() {
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
                  Termos e Condições
                </h1>
                <p className="text-lg text-slate-600 font-normal">
                  Leia atentamente antes de usar nossos serviços
                </p>
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

              {/* Important Notice */}
              <div className="mt-16 p-6 bg-blue-50 rounded-2xl border border-blue-200">
                <div className="flex gap-3">
                  <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                      Importante
                    </h3>
                    <p className="text-sm text-blue-800 font-normal mb-4">
                      Ao usar o TheAlert, você concorda com estes Termos e Condições. Se tiver dúvidas, entre em contato antes de usar o serviço.
                    </p>
                    <Link href="mailto:legal@thealert.io">
                      <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 transition-all duration-200">
                        Contatar Jurídico
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}