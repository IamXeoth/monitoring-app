'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

type Category = 'all' | 'getting-started' | 'monitors' | 'status-pages' | 'alerts' | 'integrations' | 'billing' | 'account';

interface Article {
  id: string;
  category: Category;
  question: string;
  answer: string;
  tags: string[];
}

const CATEGORIES: { key: Category; label: string; icon: JSX.Element }[] = [
  { key: 'all', label: 'Todos', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg> },
  { key: 'getting-started', label: 'Início rápido', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg> },
  { key: 'monitors', label: 'Monitores', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25h-13.5A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25h-13.5A2.25 2.25 0 013 12V5.25" /></svg> },
  { key: 'status-pages', label: 'Status Pages', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { key: 'alerts', label: 'Alertas', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg> },
  { key: 'integrations', label: 'Integrações', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg> },
  { key: 'billing', label: 'Planos & Cobrança', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg> },
  { key: 'account', label: 'Conta', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg> },
];

const ARTICLES: Article[] = [
  // Getting Started
  {
    id: 'gs-1',
    category: 'getting-started',
    question: 'Como começar a usar o TheAlert?',
    answer: 'Após criar sua conta, acesse o Dashboard e clique em "Novo monitor". Informe o nome, a URL do site que deseja monitorar e o intervalo de verificação. O TheAlert começará a verificar automaticamente e você será notificado caso algo saia do normal.',
    tags: ['início', 'primeiro', 'como', 'começar'],
  },
  {
    id: 'gs-2',
    category: 'getting-started',
    question: 'Qual a diferença entre os planos?',
    answer: 'O plano Free permite 1 monitor com verificação a cada 5 minutos. O Starter (R$29/mês) oferece 10 monitores com intervalo de 3 minutos e acesso à API. O Pro (R$79/mês) inclui 50 monitores, intervalo de 30 segundos e todas as integrações. O Business (R$199/mês) é ideal para operações críticas com 200 monitores e suporte dedicado. Veja todos os detalhes na página de Upgrade.',
    tags: ['planos', 'preço', 'diferença', 'free', 'pro'],
  },
  {
    id: 'gs-3',
    category: 'getting-started',
    question: 'Preciso instalar algo?',
    answer: 'Não! O TheAlert é 100% baseado na nuvem. Basta criar sua conta, adicionar seus monitores pela interface web e pronto. Não é necessário instalar nenhum software, agente ou plugin no seu servidor.',
    tags: ['instalar', 'setup', 'configurar'],
  },

  // Monitors
  {
    id: 'mon-1',
    category: 'monitors',
    question: 'Como criar um novo monitor?',
    answer: 'No Dashboard, clique em "Novo monitor". Preencha o nome do serviço, a URL completa (com https://), e selecione o intervalo de verificação disponível no seu plano. O monitor será criado e a primeira verificação acontece em segundos.',
    tags: ['criar', 'novo', 'monitor', 'adicionar'],
  },
  {
    id: 'mon-2',
    category: 'monitors',
    question: 'O que significa cada status do monitor?',
    answer: 'UP (verde) significa que o site respondeu com sucesso (status HTTP 2xx). DOWN (vermelho) indica que não houve resposta ou o status HTTP foi de erro (4xx/5xx). PAUSED (cinza) significa que o monitor foi pausado manualmente e não está sendo verificado.',
    tags: ['status', 'up', 'down', 'paused', 'significado'],
  },
  {
    id: 'mon-3',
    category: 'monitors',
    question: 'Qual o intervalo mínimo de verificação?',
    answer: 'Depende do seu plano: Free verifica a cada 5 minutos, Starter a cada 3 minutos, e Pro/Business a cada 30 segundos. Intervalos menores significam detecção mais rápida de problemas.',
    tags: ['intervalo', 'frequência', 'tempo', 'verificação'],
  },
  {
    id: 'mon-4',
    category: 'monitors',
    question: 'O que é o tempo de resposta mostrado no monitor?',
    answer: 'É o tempo em milissegundos que o servidor do seu site levou para responder à nossa requisição HTTP. Tempos abaixo de 500ms são considerados bons. Acima de 1000ms pode indicar lentidão. O gráfico de tempo de resposta mostra a variação ao longo do tempo.',
    tags: ['tempo', 'resposta', 'latência', 'ms', 'performance'],
  },
  {
    id: 'mon-5',
    category: 'monitors',
    question: 'Posso monitorar APIs e não apenas sites?',
    answer: 'Sim! Qualquer endpoint HTTP/HTTPS pode ser monitorado. Basta informar a URL da API. O TheAlert fará uma requisição GET e verificará se a resposta é bem-sucedida (status 2xx).',
    tags: ['api', 'endpoint', 'http', 'https'],
  },

  // Status Pages
  {
    id: 'sp-1',
    category: 'status-pages',
    question: 'O que é uma Status Page?',
    answer: 'É uma página pública onde seus clientes podem ver o status em tempo real dos seus serviços. Mostra se cada serviço está operacional, com barras de uptime dos últimos 90 dias. É acessível por qualquer pessoa sem necessidade de login.',
    tags: ['status', 'page', 'página', 'pública'],
  },
  {
    id: 'sp-2',
    category: 'status-pages',
    question: 'Posso personalizar a URL da minha Status Page?',
    answer: 'Nos planos pagos (Starter e acima), sim! Você pode escolher uma URL como thealert.io/status/sua-empresa. No plano Free, a URL é gerada automaticamente.',
    tags: ['url', 'slug', 'personalizar', 'customizar'],
  },
  {
    id: 'sp-3',
    category: 'status-pages',
    question: 'Quantas Status Pages posso criar?',
    answer: 'Depende do plano: Free permite 1 status page, Starter até 3, Pro até 10, e Business até 50. Cada status page pode exibir múltiplos monitores.',
    tags: ['quantas', 'limite', 'número'],
  },

  // Alerts
  {
    id: 'al-1',
    category: 'alerts',
    question: 'Como funcionam os alertas?',
    answer: 'Quando um monitor detecta que seu site está fora do ar, o TheAlert envia notificações pelos canais configurados (email, Slack, Discord, Telegram ou Webhook). Você pode configurar um atraso antes do alerta e a frequência de repetição enquanto o problema persistir.',
    tags: ['alertas', 'notificação', 'como', 'funciona'],
  },
  {
    id: 'al-2',
    category: 'alerts',
    question: 'Posso configurar alertas diferentes por monitor?',
    answer: 'Sim! Na página de Notificações, aba "Configurar alertas", cada monitor tem sua própria configuração de canais e timing. Você pode receber email para um monitor e Slack para outro, por exemplo.',
    tags: ['configurar', 'por monitor', 'individual', 'personalizar'],
  },
  {
    id: 'al-3',
    category: 'alerts',
    question: 'Posso definir um atraso antes de ser notificado?',
    answer: 'Sim! Na configuração de alertas de cada monitor, você pode definir um atraso de 1, 3, 5 ou 10 minutos antes do primeiro alerta. Isso evita notificações por quedas momentâneas que se resolvem sozinhas.',
    tags: ['atraso', 'delay', 'espera', 'falso positivo'],
  },

  // Integrations
  {
    id: 'int-1',
    category: 'integrations',
    question: 'Quais integrações estão disponíveis?',
    answer: 'Atualmente suportamos: Email (todos os planos), Webhook (Starter+), Slack, Discord e Telegram (Pro+). Cada integração é configurada na página Integrações & API e pode ser ativada/desativada por monitor.',
    tags: ['integrações', 'slack', 'discord', 'telegram', 'webhook'],
  },
  {
    id: 'int-2',
    category: 'integrations',
    question: 'Como configurar o Webhook?',
    answer: 'Na página Integrações, clique em "Configurar" no card Webhook. Informe a URL do seu endpoint que receberá as notificações. O TheAlert enviará um POST com payload JSON contendo o monitor, status, timestamp e detalhes do alerta.',
    tags: ['webhook', 'configurar', 'endpoint', 'json'],
  },
  {
    id: 'int-3',
    category: 'integrations',
    question: 'Como funciona a API?',
    answer: 'A API REST permite gerenciar monitores e consultar dados programaticamente. Crie uma chave na página Integrações & API, aba "API". Use o header Authorization: Bearer ta_sua_chave em todas as requisições. A documentação dos endpoints está disponível na mesma página.',
    tags: ['api', 'rest', 'chave', 'key', 'programático'],
  },

  // Billing
  {
    id: 'bil-1',
    category: 'billing',
    question: 'Como funciona a cobrança?',
    answer: 'A cobrança é feita mensalmente ou anualmente (com 17% de desconto) em reais brasileiro (R$) via Stripe. Você pode cancelar a qualquer momento sem multa. Ao cancelar, mantém acesso até o final do período pago.',
    tags: ['cobrança', 'pagamento', 'preço', 'cancelar'],
  },
  {
    id: 'bil-2',
    category: 'billing',
    question: 'Quais formas de pagamento são aceitas?',
    answer: 'Aceitamos cartão de crédito e débito (Visa, Mastercard, Elo, American Express) e Pix. Todos os pagamentos são processados pelo Stripe com segurança de nível bancário.',
    tags: ['pagamento', 'cartão', 'pix', 'formas'],
  },
  {
    id: 'bil-3',
    category: 'billing',
    question: 'Posso mudar de plano a qualquer momento?',
    answer: 'Sim! Você pode fazer upgrade a qualquer momento na página de Upgrade dentro do dashboard. O valor é calculado proporcionalmente ao período restante. Downgrade é aplicado no próximo ciclo de cobrança.',
    tags: ['mudar', 'trocar', 'upgrade', 'downgrade', 'plano'],
  },

  // Account
  {
    id: 'acc-1',
    category: 'account',
    question: 'Como alterar minha senha?',
    answer: 'Acesse Configurações > Segurança. Informe sua senha atual, a nova senha (mínimo 6 caracteres) e confirme. A alteração é imediata.',
    tags: ['senha', 'alterar', 'trocar', 'segurança'],
  },
  {
    id: 'acc-2',
    category: 'account',
    question: 'Posso excluir minha conta?',
    answer: 'Sim, em Configurações > Zona de perigo. A exclusão é permanente e apaga todos os seus dados, monitores, status pages e histórico. Você precisa digitar seu email para confirmar.',
    tags: ['excluir', 'deletar', 'apagar', 'conta'],
  },
  {
    id: 'acc-3',
    category: 'account',
    question: 'Os dados são armazenados no Brasil?',
    answer: 'Nossos servidores estão hospedados no Brasil, garantindo baixa latência para verificações de sites brasileiros e conformidade com a LGPD. Seus dados nunca saem do território nacional.',
    tags: ['dados', 'brasil', 'lgpd', 'servidor', 'privacidade'],
  },
];

const QUICK_LINKS = [
  { label: 'Criar primeiro monitor', href: '/monitors', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg> },
  { label: 'Configurar alertas', href: '/notifications', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg> },
  { label: 'Criar Status Page', href: '/status-pages', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945" /></svg> },
  { label: 'Conectar integrações', href: '/integrations', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" /></svg> },
  { label: 'Ver planos', href: '/upgrade', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3" /></svg> },
  { label: 'Configurações da conta', href: '/settings', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0" /></svg> },
];

export default function HelpPage() {
  const [category, setCategory] = useState<Category>('all');
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return ARTICLES
      .filter((a) => category === 'all' || a.category === category)
      .filter((a) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return a.question.toLowerCase().includes(q) || a.answer.toLowerCase().includes(q) || a.tags.some((t) => t.includes(q));
      });
  }, [category, search]);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0c0d11]">
        {/* Hero */}
        <div className="px-8 pt-8 pb-8">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/dashboard" className="text-[11px] text-[#3e424a] hover:text-[#80838a] font-medium transition-colors">Dashboard</Link>
            <svg className="w-3 h-3 text-[#2e323a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-[11px] text-[#80838a] font-medium">Central de ajuda</span>
          </div>

          <div className="text-center max-w-lg mx-auto mb-8">
            <h1 className="text-[26px] font-semibold text-[#e4e4e7] tracking-tight mb-2">Como podemos ajudar?</h1>
            <p className="text-[14px] text-[#555b66]">Encontre respostas rápidas ou entre em contato com nosso suporte</p>
          </div>

          {/* Search */}
          <div className="max-w-[480px] mx-auto relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2e323a] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar artigos, perguntas..."
              className="w-full h-12 bg-[#12141a] border border-[#1e2128] rounded-xl text-[14px] text-[#e4e4e7] placeholder-[#2e323a] pl-11 pr-4 focus:outline-none focus:border-[#3e424a] focus:bg-[#14161c] transition-all"
            />
            {search && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-[#3e424a] tabular-nums">
                {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Quick links */}
        {!search && category === 'all' && (
          <div className="px-8 pb-8">
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 max-w-4xl mx-auto">
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border border-[#1e2128] bg-[#12141a] hover:border-[#2a2e36] hover:bg-white/[0.02] transition-all text-center group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#1e2128] flex items-center justify-center text-[#555b66] group-hover:text-[#80838a] transition-colors">
                    {link.icon}
                  </div>
                  <span className="text-[10px] font-medium text-[#555b66] group-hover:text-[#80838a] transition-colors leading-tight">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="px-8 pb-8 flex gap-6 max-w-5xl mx-auto">
          {/* Category sidebar */}
          <div className="w-[180px] flex-shrink-0">
            <p className="text-[10px] font-semibold text-[#2e323a] uppercase tracking-wider mb-2 px-3">Categorias</p>
            <nav className="space-y-0.5">
              {CATEGORIES.map((cat) => {
                const count = cat.key === 'all' ? ARTICLES.length : ARTICLES.filter((a) => a.category === cat.key).length;
                return (
                  <button
                    key={cat.key}
                    onClick={() => { setCategory(cat.key); setOpenId(null); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-[12px] font-medium transition-all ${
                      category === cat.key
                        ? 'bg-white/[0.06] text-[#e4e4e7]'
                        : 'text-[#555b66] hover:text-[#80838a] hover:bg-white/[0.02]'
                    }`}
                  >
                    <span className={category === cat.key ? 'text-[#e4e4e7]' : 'text-[#3e424a]'}>{cat.icon}</span>
                    <span className="flex-1">{cat.label}</span>
                    <span className="text-[9px] tabular-nums opacity-40">{count}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Articles */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="rounded-xl border border-[#1e2128] bg-[#12141a] py-16 text-center">
                <div className="w-11 h-11 rounded-full bg-[#1e2128] flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-[#3e424a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <p className="text-[13px] font-semibold text-[#555b66] mb-1">Nenhum resultado encontrado</p>
                <p className="text-[11px] text-[#3e424a]">Tente termos diferentes ou entre em contato com o suporte</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {filtered.map((article) => {
                  const isOpen = openId === article.id;
                  const catInfo = CATEGORIES.find((c) => c.key === article.category);
                  return (
                    <div key={article.id} className={`rounded-xl border bg-[#12141a] transition-all ${isOpen ? 'border-[#2a2e36]' : 'border-[#1e2128]'}`}>
                      <button
                        onClick={() => setOpenId(isOpen ? null : article.id)}
                        className="w-full flex items-center gap-3 px-5 py-4 text-left"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-[#e4e4e7] leading-snug">{article.question}</p>
                          {category === 'all' && catInfo && (
                            <span className="inline-flex items-center gap-1 mt-1 text-[9px] font-medium text-[#3e424a]">
                              {catInfo.label}
                            </span>
                          )}
                        </div>
                        <svg className={`w-4 h-4 text-[#3e424a] transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4 -mt-1">
                          <p className="text-[12px] text-[#80838a] leading-relaxed">{article.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Contact support */}
            <div className="mt-8 rounded-xl border border-[#1e2128] bg-[#12141a] p-6 text-center">
              <div className="w-11 h-11 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
              </div>
              <h3 className="text-[14px] font-semibold text-[#e4e4e7] mb-1">Não encontrou o que procurava?</h3>
              <p className="text-[12px] text-[#3e424a] mb-4">Nossa equipe está pronta para ajudar</p>
              <div className="flex items-center justify-center gap-3">
                <a href="mailto:suporte@thealert.io" className="h-9 px-5 rounded-lg text-[12px] font-semibold bg-[#e4e4e7] hover:bg-white text-[#0c0d11] transition-all inline-flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Enviar email
                </a>
                <a href="https://wa.me/5500000000000" target="_blank" rel="noopener noreferrer" className="h-9 px-5 rounded-lg text-[12px] font-semibold border border-[#1e2128] text-[#80838a] hover:text-[#c8c9cd] hover:border-[#2a2e36] transition-all inline-flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}