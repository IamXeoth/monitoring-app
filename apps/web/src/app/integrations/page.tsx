'use client';

import { useAuth } from '@/contexts/auth-context';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { api } from '@/lib/api';

type Tab = 'integrations' | 'api';

// ─── Types ───

interface Integration {
  id: string;
  type: 'email' | 'webhook' | 'slack' | 'discord' | 'telegram';
  name: string;
  config: Record<string, string>;
  isEnabled: boolean;
  createdAt: string;
}

interface ApiKey {
  id: string;
  name: string;
  key: string; // only full on creation, then last 4
  lastUsed?: string;
  createdAt: string;
}

// ─── Integration configs ───

const INTEGRATION_DEFS = [
  {
    type: 'email' as const,
    name: 'Email',
    description: 'Receba alertas diretamente no seu email',
    minPlan: 'FREE',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/10',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    fields: [
      { key: 'emails', label: 'Emails destinatários', placeholder: 'email@empresa.com, outro@empresa.com', type: 'text' },
    ],
  },
  {
    type: 'webhook' as const,
    name: 'Webhook',
    description: 'Envie alertas via HTTP POST para qualquer endpoint',
    minPlan: 'STARTER',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/10',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    fields: [
      { key: 'url', label: 'URL do Webhook', placeholder: 'https://api.exemplo.com/webhook', type: 'url' },
      { key: 'secret', label: 'Secret (opcional)', placeholder: 'Chave para validar requests', type: 'password' },
    ],
  },
  {
    type: 'slack' as const,
    name: 'Slack',
    description: 'Notificações em canais do Slack via Incoming Webhook',
    minPlan: 'PRO',
    color: 'text-[#E01E5A]',
    bg: 'bg-[#E01E5A]/10',
    border: 'border-[#E01E5A]/10',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
      </svg>
    ),
    fields: [
      { key: 'webhookUrl', label: 'Webhook URL do Slack', placeholder: 'https://hooks.slack.com/services/...', type: 'url' },
      { key: 'channel', label: 'Canal (opcional)', placeholder: '#alertas', type: 'text' },
    ],
  },
  {
    type: 'discord' as const,
    name: 'Discord',
    description: 'Alertas em canais do Discord via Webhook',
    minPlan: 'PRO',
    color: 'text-[#5865F2]',
    bg: 'bg-[#5865F2]/10',
    border: 'border-[#5865F2]/10',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
    fields: [
      { key: 'webhookUrl', label: 'Webhook URL do Discord', placeholder: 'https://discord.com/api/webhooks/...', type: 'url' },
    ],
  },
  {
    type: 'telegram' as const,
    name: 'Telegram',
    description: 'Alertas via bot do Telegram direto no chat',
    minPlan: 'PRO',
    color: 'text-[#26A5E4]',
    bg: 'bg-[#26A5E4]/10',
    border: 'border-[#26A5E4]/10',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
    fields: [
      { key: 'botToken', label: 'Token do Bot', placeholder: '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11', type: 'password' },
      { key: 'chatId', label: 'Chat ID', placeholder: '-1001234567890', type: 'text' },
    ],
  },
];

const PLAN_ORDER = ['FREE', 'STARTER', 'PRO', 'BUSINESS'];

// ─── Main Page ───

export default function IntegrationsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('integrations');
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [configModal, setConfigModal] = useState<typeof INTEGRATION_DEFS[0] | null>(null);
  const [editingIntegration, setEditingIntegration] = useState<Integration | undefined>();
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [newKeyRevealed, setNewKeyRevealed] = useState<string | null>(null);

  const plan = user?.subscription?.plan || 'FREE';
  const planIdx = PLAN_ORDER.indexOf(plan);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    try {
      // TODO: Replace with real API calls
      const storedInt = localStorage.getItem('thealert_integrations');
      const storedKeys = localStorage.getItem('thealert_apikeys');
      if (storedInt) setIntegrations(JSON.parse(storedInt));
      if (storedKeys) setApiKeys(JSON.parse(storedKeys));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const saveIntegrations = (data: Integration[]) => {
    setIntegrations(data);
    localStorage.setItem('thealert_integrations', JSON.stringify(data));
  };

  const saveApiKeys = (data: ApiKey[]) => {
    setApiKeys(data);
    localStorage.setItem('thealert_apikeys', JSON.stringify(data));
  };

  const handleSaveIntegration = (type: string, config: Record<string, string>, isEnabled: boolean) => {
    const existing = integrations.find((i) => i.type === type);
    if (existing) {
      saveIntegrations(integrations.map((i) => i.type === type ? { ...i, config, isEnabled } : i));
    } else {
      saveIntegrations([...integrations, {
        id: `int-${Date.now().toString(36)}`,
        type: type as Integration['type'],
        name: INTEGRATION_DEFS.find((d) => d.type === type)?.name || type,
        config,
        isEnabled,
        createdAt: new Date().toISOString(),
      }]);
    }
    setConfigModal(null);
    setEditingIntegration(undefined);
  };

  const handleDeleteIntegration = (type: string) => {
    saveIntegrations(integrations.filter((i) => i.type !== type));
  };

  const handleCreateApiKey = (name: string) => {
    const key = 'ta_' + Array.from({ length: 32 }, () => 'abcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(Math.random() * 36))).join('');
    const newKey: ApiKey = {
      id: `key-${Date.now().toString(36)}`,
      name,
      key,
      createdAt: new Date().toISOString(),
    };
    saveApiKeys([newKey, ...apiKeys]);
    setNewKeyRevealed(key);
    setShowApiKeyModal(false);
  };

  const handleDeleteApiKey = (id: string) => {
    if (!confirm('Tem certeza? Esta ação não pode ser desfeita.')) return;
    saveApiKeys(apiKeys.filter((k) => k.id !== id));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-[#0c0d11] flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0c0d11]">
        <div className="px-8 pt-8 pb-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4">
            <Link href="/dashboard" className="text-[11px] text-[#3e424a] hover:text-[#80838a] font-medium transition-colors">Dashboard</Link>
            <svg className="w-3 h-3 text-[#2e323a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-[11px] text-[#80838a] font-medium">Integrações</span>
          </div>

          <h1 className="text-[22px] font-semibold text-[#e4e4e7] tracking-tight">Integrações & API</h1>
          <p className="text-[13px] text-[#3e424a] mt-1 mb-6">Conecte ferramentas externas e acesse seus dados via API</p>

          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-[#1e2128]">
            {([
              { key: 'integrations' as Tab, label: 'Integrações', count: integrations.filter((i) => i.isEnabled).length },
              { key: 'api' as Tab, label: 'API', count: apiKeys.length },
            ]).map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2.5 text-[13px] font-medium border-b-2 -mb-px transition-all ${
                  tab === t.key
                    ? 'border-[#e4e4e7] text-[#e4e4e7]'
                    : 'border-transparent text-[#555b66] hover:text-[#80838a]'
                }`}
              >
                {t.label}
                {t.count > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-[#1e2128] text-[9px] font-bold text-[#80838a] tabular-nums">
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="px-8 py-6">
          {tab === 'integrations' ? (
            <IntegrationsTab
              integrations={integrations}
              plan={plan}
              planIdx={planIdx}
              onConfigure={(def) => {
                setEditingIntegration(integrations.find((i) => i.type === def.type));
                setConfigModal(def);
              }}
              onDelete={handleDeleteIntegration}
              onToggle={(type) => {
                const int = integrations.find((i) => i.type === type);
                if (int) saveIntegrations(integrations.map((i) => i.type === type ? { ...i, isEnabled: !i.isEnabled } : i));
              }}
            />
          ) : (
            <ApiTab
              apiKeys={apiKeys}
              plan={plan}
              planIdx={planIdx}
              newKeyRevealed={newKeyRevealed}
              onDismissKey={() => setNewKeyRevealed(null)}
              onCreateKey={() => setShowApiKeyModal(true)}
              onDeleteKey={handleDeleteApiKey}
            />
          )}
        </div>
      </div>

      {/* Config Modal */}
      {configModal && (
        <IntegrationConfigModal
          def={configModal}
          existing={editingIntegration}
          onClose={() => { setConfigModal(null); setEditingIntegration(undefined); }}
          onSave={handleSaveIntegration}
        />
      )}

      {/* API Key Modal */}
      {showApiKeyModal && (
        <ApiKeyModal
          onClose={() => setShowApiKeyModal(false)}
          onCreate={handleCreateApiKey}
        />
      )}
    </DashboardLayout>
  );
}

// ─── Integrations Tab ───

function IntegrationsTab({
  integrations,
  plan,
  planIdx,
  onConfigure,
  onDelete,
  onToggle,
}: {
  integrations: Integration[];
  plan: string;
  planIdx: number;
  onConfigure: (def: typeof INTEGRATION_DEFS[0]) => void;
  onDelete: (type: string) => void;
  onToggle: (type: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {INTEGRATION_DEFS.map((def) => {
        const configured = integrations.find((i) => i.type === def.type);
        const minPlanIdx = PLAN_ORDER.indexOf(def.minPlan);
        const isLocked = planIdx < minPlanIdx;

        return (
          <div key={def.type} className={`rounded-xl border bg-[#12141a] p-5 transition-all ${
            configured?.isEnabled ? `${def.border} border-opacity-30` : 'border-[#1e2128]'
          } ${isLocked ? 'opacity-50' : ''}`}>
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`w-10 h-10 rounded-xl ${def.bg} flex items-center justify-center flex-shrink-0 ${def.color}`}>
                {def.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-[13px] font-semibold text-[#e4e4e7]">{def.name}</h3>
                  {configured?.isEnabled && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                  {isLocked && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#1e2128] text-[#555b66] border border-[#2a2e36] uppercase">
                      {def.minPlan}+
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#3e424a] mb-3">{def.description}</p>

                <div className="flex items-center gap-2">
                  {isLocked ? (
                    <button className="h-7 px-3 rounded-lg text-[11px] font-semibold text-emerald-400/60 border border-emerald-500/15 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all">
                      Fazer upgrade
                    </button>
                  ) : configured ? (
                    <>
                      <button
                        onClick={() => onToggle(def.type)}
                        className={`h-7 px-3 rounded-lg text-[11px] font-semibold border transition-all ${
                          configured.isEnabled
                            ? 'border-amber-500/15 text-amber-400 hover:bg-amber-500/5'
                            : 'border-emerald-500/15 text-emerald-400 hover:bg-emerald-500/5'
                        }`}
                      >
                        {configured.isEnabled ? 'Desativar' : 'Ativar'}
                      </button>
                      <button
                        onClick={() => onConfigure(def)}
                        className="h-7 px-3 rounded-lg text-[11px] font-semibold text-[#80838a] border border-[#1e2128] hover:text-[#c8c9cd] hover:border-[#2a2e36] transition-all"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onDelete(def.type)}
                        className="h-7 px-3 rounded-lg text-[11px] font-semibold text-red-400/50 border border-[#1e2128] hover:text-red-400 hover:border-red-500/15 transition-all"
                      >
                        Remover
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => onConfigure(def)}
                      className="h-7 px-3 rounded-lg text-[11px] font-semibold text-[#e4e4e7] bg-[#1e2128] hover:bg-[#2a2e36] transition-all"
                    >
                      Configurar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── API Tab ───

function ApiTab({
  apiKeys,
  plan,
  planIdx,
  newKeyRevealed,
  onDismissKey,
  onCreateKey,
  onDeleteKey,
}: {
  apiKeys: ApiKey[];
  plan: string;
  planIdx: number;
  newKeyRevealed: string | null;
  onDismissKey: () => void;
  onCreateKey: () => void;
  onDeleteKey: (id: string) => void;
}) {
  const isLocked = planIdx < 1; // FREE can't use API
  const [copiedKey, setCopiedKey] = useState(false);

  const limits: Record<string, string> = {
    FREE: 'Sem acesso',
    STARTER: '100 req/hora',
    PRO: '1.000 req/hora',
    BUSINESS: '10.000 req/hora',
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const endpoints = [
    { method: 'GET', path: '/api/v1/monitors', desc: 'Listar monitores' },
    { method: 'GET', path: '/api/v1/monitors/:id', desc: 'Detalhes do monitor' },
    { method: 'POST', path: '/api/v1/monitors', desc: 'Criar monitor' },
    { method: 'PUT', path: '/api/v1/monitors/:id', desc: 'Editar monitor' },
    { method: 'DELETE', path: '/api/v1/monitors/:id', desc: 'Deletar monitor' },
    { method: 'GET', path: '/api/v1/monitors/:id/checks', desc: 'Histórico de checks' },
    { method: 'GET', path: '/api/v1/monitors/:id/status', desc: 'Status atual' },
    { method: 'GET', path: '/api/v1/status-pages', desc: 'Listar status pages' },
  ];

  const methodColor: Record<string, string> = {
    GET: 'text-emerald-400 bg-emerald-500/10',
    POST: 'text-blue-400 bg-blue-500/10',
    PUT: 'text-amber-400 bg-amber-500/10',
    DELETE: 'text-red-400 bg-red-500/10',
  };

  return (
    <div className="space-y-6">
      {/* Locked state */}
      {isLocked && (
        <div className="rounded-xl border border-amber-500/10 bg-amber-500/[0.03] p-5 text-center">
          <svg className="w-8 h-8 text-amber-400/30 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <p className="text-[14px] font-semibold text-[#80838a] mb-1">API disponível a partir do plano Starter</p>
          <p className="text-[12px] text-[#3e424a] mb-4">Acesse seus dados de monitoramento via API REST</p>
          <button className="h-9 px-5 rounded-lg text-[13px] font-semibold text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/5 transition-all">
            Fazer upgrade
          </button>
        </div>
      )}

      {!isLocked && (
        <>
          {/* New key revealed */}
          {newKeyRevealed && (
            <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/[0.03] p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-emerald-400 mb-2">Chave criada! Copie agora — ela não será exibida novamente.</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 rounded-lg bg-[#0a0b0f] border border-[#1e2128] text-[11px] text-[#e4e4e7] font-mono truncate">
                      {newKeyRevealed}
                    </code>
                    <button
                      onClick={() => copyKey(newKeyRevealed)}
                      className="h-8 px-3 rounded-lg text-[11px] font-semibold bg-[#1e2128] text-[#e4e4e7] hover:bg-[#2a2e36] transition-all flex-shrink-0"
                    >
                      {copiedKey ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                  <button onClick={onDismissKey} className="text-[10px] text-[#3e424a] hover:text-[#80838a] mt-2 transition-colors">
                    Fechar aviso
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* API Keys section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-[14px] font-semibold text-[#e4e4e7]">Chaves de API</h3>
                <p className="text-[11px] text-[#3e424a] mt-0.5">Limite: {limits[plan]}</p>
              </div>
              <button
                onClick={onCreateKey}
                className="inline-flex items-center gap-1.5 h-8 px-3 bg-[#e4e4e7] hover:bg-white text-[#0c0d11] rounded-lg text-[11px] font-semibold transition-all"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Nova chave
              </button>
            </div>

            {apiKeys.length === 0 ? (
              <div className="rounded-xl border border-[#1e2128] bg-[#12141a] py-10 text-center">
                <p className="text-[12px] text-[#3e424a]">Nenhuma chave criada</p>
              </div>
            ) : (
              <div className="rounded-xl border border-[#1e2128] bg-[#12141a] overflow-hidden">
                {apiKeys.map((key, idx) => (
                  <div key={key.id} className={`flex items-center gap-4 px-4 py-3 ${idx < apiKeys.length - 1 ? 'border-b border-[#1e2128]/70' : ''}`}>
                    <div className="w-8 h-8 rounded-lg bg-[#1e2128] flex items-center justify-center flex-shrink-0">
                      <svg className="w-3.5 h-3.5 text-[#555b66]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-[#c8c9cd]">{key.name}</p>
                      <p className="text-[10px] text-[#3e424a] font-mono">ta_••••••••{key.key.slice(-4)}</p>
                    </div>
                    <p className="text-[10px] text-[#2e323a] flex-shrink-0">
                      {new Date(key.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </p>
                    <button
                      onClick={() => onDeleteKey(key.id)}
                      className="w-7 h-7 rounded-md flex items-center justify-center text-[#3e424a] hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Endpoints reference */}
          <div>
            <h3 className="text-[14px] font-semibold text-[#e4e4e7] mb-3">Referência de endpoints</h3>
            <div className="rounded-xl border border-[#1e2128] bg-[#12141a] overflow-hidden">
              {/* Auth header */}
              <div className="px-4 py-3 border-b border-[#1e2128] bg-[#0a0b0f]">
                <p className="text-[10px] text-[#3e424a] font-semibold uppercase tracking-[0.08em] mb-1.5">Autenticação</p>
                <code className="text-[11px] text-[#80838a] font-mono">
                  Authorization: Bearer <span className="text-emerald-400">ta_sua_chave_aqui</span>
                </code>
              </div>
              {endpoints.map((ep, idx) => (
                <div key={idx} className={`flex items-center gap-3 px-4 py-2.5 ${idx < endpoints.length - 1 ? 'border-b border-[#1e2128]/50' : ''} hover:bg-white/[0.01] transition-colors`}>
                  <span className={`inline-flex items-center justify-center w-14 h-5 rounded text-[9px] font-bold ${methodColor[ep.method]}`}>
                    {ep.method}
                  </span>
                  <code className="text-[11px] text-[#80838a] font-mono flex-1">{ep.path}</code>
                  <span className="text-[10px] text-[#3e424a] flex-shrink-0">{ep.desc}</span>
                </div>
              ))}
            </div>

            {/* Example */}
            <div className="mt-3 rounded-xl border border-[#1e2128] bg-[#0a0b0f] p-4">
              <p className="text-[10px] text-[#3e424a] font-semibold uppercase tracking-[0.08em] mb-2">Exemplo — cURL</p>
              <code className="text-[11px] text-[#80838a] font-mono leading-relaxed block whitespace-pre-wrap">{`curl -H "Authorization: Bearer ta_sua_chave" \\
  https://api.thealert.io/api/v1/monitors`}</code>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Integration Config Modal ───

function IntegrationConfigModal({
  def,
  existing,
  onClose,
  onSave,
}: {
  def: typeof INTEGRATION_DEFS[0];
  existing?: Integration;
  onClose: () => void;
  onSave: (type: string, config: Record<string, string>, isEnabled: boolean) => void;
}) {
  const [config, setConfig] = useState<Record<string, string>>(existing?.config || {});
  const [isEnabled, setIsEnabled] = useState(existing?.isEnabled ?? true);

  const updateField = (key: string, val: string) => setConfig({ ...config, [key]: val });

  const inputBase = 'w-full h-11 bg-[#0a0b0f] border border-[#1e2128] rounded-xl text-[13px] text-[#e4e4e7] placeholder-[#2e323a] focus:outline-none focus:border-[#3e424a] focus:bg-[#0c0d11] transition-all px-4';

  const allFilled = def.fields.filter((f) => !f.placeholder.includes('opcional')).every((f) => config[f.key]?.trim());

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[91] p-4">
        <div className="w-full max-w-[440px] bg-[#12141a] border border-[#1e2128] rounded-2xl overflow-hidden" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>
          {/* Header */}
          <div className="px-6 pt-6 pb-4 flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl ${def.bg} flex items-center justify-center flex-shrink-0 ${def.color}`}>
              {def.icon}
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-[#e4e4e7]">Configurar {def.name}</h2>
              <p className="text-[12px] text-[#3e424a] mt-0.5">{def.description}</p>
            </div>
          </div>

          <div className="px-6 pb-4 space-y-4">
            {def.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-[11px] font-semibold text-[#555b66] uppercase tracking-[0.06em] mb-2">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={config[field.key] || ''}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className={`${inputBase} ${field.type === 'password' ? 'font-mono text-[12px]' : ''}`}
                />
              </div>
            ))}

            {/* Enable toggle */}
            <div
              onClick={() => setIsEnabled(!isEnabled)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                isEnabled ? 'bg-emerald-500/[0.04] border-emerald-500/15' : 'bg-[#0a0b0f] border-[#1e2128]'
              }`}
            >
              <div className={`w-9 h-5 rounded-full relative transition-all ${isEnabled ? 'bg-emerald-400' : 'bg-[#2a2e36]'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${isEnabled ? 'left-[18px]' : 'left-0.5'}`} style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
              </div>
              <p className={`text-[12px] font-semibold ${isEnabled ? 'text-emerald-400' : 'text-[#555b66]'}`}>
                Ativar integração
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[#1e2128] flex items-center gap-2.5">
            <button
              onClick={() => onSave(def.type, config, isEnabled)}
              disabled={!allFilled}
              className="flex-1 h-10 bg-[#e4e4e7] hover:bg-white text-[#0c0d11] rounded-xl text-[13px] font-semibold transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            >
              {existing ? 'Salvar alterações' : 'Conectar'}
            </button>
            <button onClick={onClose} className="h-10 px-5 border border-[#1e2128] text-[#555b66] hover:text-[#80838a] hover:border-[#2a2e36] rounded-xl text-[13px] font-medium transition-all">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── API Key Modal ───

function ApiKeyModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (name: string) => void;
}) {
  const [name, setName] = useState('');

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[91] p-4">
        <div className="w-full max-w-[400px] bg-[#12141a] border border-[#1e2128] rounded-2xl overflow-hidden" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>
          <div className="px-6 pt-6 pb-4">
            <h2 className="text-[16px] font-semibold text-[#e4e4e7]">Criar chave de API</h2>
            <p className="text-[12px] text-[#3e424a] mt-1">Dê um nome descritivo para identificar onde esta chave será usada</p>
          </div>
          <div className="px-6 pb-4">
            <label className="block text-[11px] font-semibold text-[#555b66] uppercase tracking-[0.06em] mb-2">Nome da chave</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: CI/CD Pipeline, App Mobile"
              autoFocus
              className="w-full h-11 bg-[#0a0b0f] border border-[#1e2128] rounded-xl text-[13px] text-[#e4e4e7] placeholder-[#2e323a] focus:outline-none focus:border-[#3e424a] focus:bg-[#0c0d11] transition-all px-4"
            />
          </div>
          <div className="px-6 py-4 border-t border-[#1e2128] flex items-center gap-2.5">
            <button
              onClick={() => name.trim() && onCreate(name.trim())}
              disabled={!name.trim()}
              className="flex-1 h-10 bg-[#e4e4e7] hover:bg-white text-[#0c0d11] rounded-xl text-[13px] font-semibold transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            >
              Criar chave
            </button>
            <button onClick={onClose} className="h-10 px-5 border border-[#1e2128] text-[#555b66] hover:text-[#80838a] hover:border-[#2a2e36] rounded-xl text-[13px] font-medium transition-all">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}