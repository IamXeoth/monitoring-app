'use client';

import { useAuth } from '@/contexts/auth-context';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { api } from '@/lib/api';

type Section = 'profile' | 'security' | 'plan' | 'preferences' | 'audit' | 'danger';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<Section>('profile');
  const plan = user?.subscription?.plan || 'FREE';
  const planIdx = ['FREE', 'STARTER', 'PRO', 'BUSINESS'].indexOf(plan);

  const sections: { key: Section; label: string; icon: JSX.Element; minPlan?: number }[] = [
    {
      key: 'profile', label: 'Perfil',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
    },
    {
      key: 'security', label: 'Segurança',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>,
    },
    {
      key: 'plan', label: 'Plano & Assinatura',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>,
    },
    {
      key: 'preferences', label: 'Preferências',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>,
    },
    {
      key: 'audit', label: 'Log de auditoria', minPlan: 2,
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>,
    },
    {
      key: 'danger', label: 'Zona de perigo',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>,
    },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0c0d11]">
        <div className="px-8 pt-8 pb-6">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/dashboard" className="text-[11px] text-[#3e424a] hover:text-[#80838a] font-medium transition-colors">Dashboard</Link>
            <svg className="w-3 h-3 text-[#2e323a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-[11px] text-[#80838a] font-medium">Configurações</span>
          </div>
          <h1 className="text-[22px] font-semibold text-[#e4e4e7] tracking-tight">Configurações</h1>
          <p className="text-[13px] text-[#3e424a] mt-1">Gerencie sua conta, segurança e preferências</p>
        </div>

        <div className="px-8 pb-8 flex gap-6">
          {/* Sidebar */}
          <div className="w-[200px] flex-shrink-0">
            <nav className="space-y-0.5 sticky top-8">
              {sections.map((s) => {
                const locked = s.minPlan !== undefined && planIdx < s.minPlan;
                return (
                  <button
                    key={s.key}
                    onClick={() => setActiveSection(s.key)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-[12px] font-medium transition-all ${
                      activeSection === s.key
                        ? 'bg-white/[0.06] text-[#e4e4e7]'
                        : s.key === 'danger'
                          ? 'text-red-400/50 hover:text-red-400 hover:bg-red-500/[0.03]'
                          : 'text-[#555b66] hover:text-[#80838a] hover:bg-white/[0.02]'
                    } ${locked ? 'opacity-50' : ''}`}
                  >
                    <span className={activeSection === s.key ? 'text-[#e4e4e7]' : s.key === 'danger' ? 'text-red-400/40' : 'text-[#3e424a]'}>{s.icon}</span>
                    {s.label}
                    {locked && (
                      <span className="ml-auto text-[8px] font-bold text-[#3e424a] bg-[#1e2128] px-1.5 py-0.5 rounded">PRO</span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 max-w-[600px]">
            {activeSection === 'profile' && <ProfileSection user={user} />}
            {activeSection === 'security' && <SecuritySection />}
            {activeSection === 'plan' && <PlanSection user={user} plan={plan} />}
            {activeSection === 'preferences' && <PreferencesSection />}
            {activeSection === 'audit' && <AuditSection plan={plan} planIdx={planIdx} />}
            {activeSection === 'danger' && <DangerSection user={user} />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// ─── Shared ───

const inputBase = 'w-full h-11 bg-[#0a0b0f] border border-[#1e2128] rounded-xl text-[13px] text-[#e4e4e7] placeholder-[#2e323a] focus:outline-none focus:border-[#3e424a] focus:bg-[#0c0d11] transition-all px-4';
const labelClass = 'block text-[11px] font-semibold text-[#555b66] uppercase tracking-[0.06em] mb-2';
const sectionTitle = 'text-[16px] font-semibold text-[#e4e4e7] mb-1';
const sectionDesc = 'text-[12px] text-[#3e424a] mb-5';

function SaveButton({ loading, disabled, label = 'Salvar alterações' }: { loading?: boolean; disabled?: boolean; label?: string }) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="h-10 px-5 bg-[#e4e4e7] hover:bg-white text-[#0c0d11] rounded-xl text-[13px] font-semibold transition-all disabled:opacity-20 disabled:cursor-not-allowed flex items-center gap-2"
    >
      {loading && (
        <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {label}
    </button>
  );
}

function ComingSoonBadge() {
  return <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold text-[#3e424a] bg-[#1e2128] uppercase ml-2">Em breve</span>;
}

// ─── Profile ───

function ProfileSection({ user }: { user: any }) {
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/auth/profile', { name });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {}
    setLoading(false);
  };

  const initials = (user?.name || 'U').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div>
      <h2 className={sectionTitle}>Perfil</h2>
      <p className={sectionDesc}>Informações básicas da sua conta</p>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-6 p-4 rounded-xl border border-[#1e2128] bg-[#12141a]">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/10 flex items-center justify-center">
          <span className="text-[16px] font-bold text-emerald-400">{initials}</span>
        </div>
        <div>
          <p className="text-[13px] font-semibold text-[#e4e4e7]">{user?.name}</p>
          <p className="text-[11px] text-[#3e424a] font-mono">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className={labelClass}>Nome</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputBase} />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input type="email" value={user?.email || ''} disabled className={`${inputBase} opacity-50 cursor-not-allowed`} />
          <p className="text-[10px] text-[#2e323a] mt-1.5">Alteração de email não disponível no momento</p>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <SaveButton loading={loading} disabled={name === user?.name} />
          {saved && <span className="text-[11px] text-emerald-400 font-medium">Salvo com sucesso</span>}
        </div>
      </form>
    </div>
  );
}

// ─── Security ───

function SecuritySection() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const passwordsMatch = newPassword === confirmPassword;
  const isValid = currentPassword && newPassword.length >= 6 && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    setMessage(null);
    try {
      await api.put('/auth/password', { currentPassword, newPassword });
      setMessage({ type: 'success', text: 'Senha alterada com sucesso' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Erro ao alterar senha' });
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 className={sectionTitle}>Segurança</h2>
      <p className={sectionDesc}>Gerencie sua senha e segurança da conta</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {message && (
          <div className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl border ${
            message.type === 'success' ? 'bg-emerald-500/[0.06] border-emerald-500/10' : 'bg-red-500/[0.06] border-red-500/10'
          }`}>
            <p className={`text-[12px] font-medium ${message.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>{message.text}</p>
          </div>
        )}

        <div>
          <label className={labelClass}>Senha atual</label>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" className={inputBase} />
        </div>
        <div>
          <label className={labelClass}>Nova senha</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mínimo 6 caracteres" className={inputBase} />
        </div>
        <div>
          <label className={labelClass}>Confirmar nova senha</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repita a nova senha" className={`${inputBase} ${confirmPassword && !passwordsMatch ? 'border-red-500/30' : ''}`} />
          {confirmPassword && !passwordsMatch && (
            <p className="text-[10px] text-red-400 mt-1.5">As senhas não coincidem</p>
          )}
        </div>
        <div className="pt-2">
          <SaveButton loading={loading} disabled={!isValid} label="Alterar senha" />
        </div>
      </form>

      {/* 2FA teaser */}
      <div className="mt-8 p-4 rounded-xl border border-[#1e2128] bg-[#12141a]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#1e2128] flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-[#3e424a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <div>
            <p className="text-[12px] font-semibold text-[#555b66]">Autenticação em duas etapas<ComingSoonBadge /></p>
            <p className="text-[10px] text-[#3e424a]">Adicione uma camada extra de segurança à sua conta</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Plan ───

function PlanSection({ user, plan }: { user: any; plan: string }) {
  const planConfig: Record<string, { label: string; color: string; bg: string; monitors: number; interval: string; statusPages: number; integrations: string; api: string }> = {
    FREE: { label: 'Free', color: 'text-[#80838a]', bg: 'bg-[#1e2128]', monitors: 1, interval: '5 min', statusPages: 1, integrations: 'Email', api: 'Sem acesso' },
    STARTER: { label: 'Starter', color: 'text-blue-400', bg: 'bg-blue-500/10', monitors: 10, interval: '3 min', statusPages: 3, integrations: 'Email + Webhook', api: '100 req/h' },
    PRO: { label: 'Pro', color: 'text-emerald-400', bg: 'bg-emerald-500/10', monitors: 50, interval: '30 seg', statusPages: 10, integrations: 'Todas', api: '1.000 req/h' },
    BUSINESS: { label: 'Business', color: 'text-amber-400', bg: 'bg-amber-500/10', monitors: 200, interval: '30 seg', statusPages: 50, integrations: 'Todas + Custom', api: '10.000 req/h' },
  };

  const cfg = planConfig[plan] || planConfig.FREE;

  // TODO: fetch real usage from API
  const usage = { monitors: 1, statusPages: 1 };

  const usageItems = [
    { label: 'Monitores', used: usage.monitors, limit: cfg.monitors },
    { label: 'Status Pages', used: usage.statusPages, limit: cfg.statusPages },
  ];

  return (
    <div>
      <h2 className={sectionTitle}>Plano & Assinatura</h2>
      <p className={sectionDesc}>Gerencie seu plano e acompanhe o uso</p>

      {/* Current plan */}
      <div className="rounded-xl border border-[#1e2128] bg-[#12141a] p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[12px] font-bold ${cfg.bg} ${cfg.color}`}>
              {cfg.label}
            </span>
            <span className="text-[12px] text-[#3e424a]">Plano atual</span>
          </div>
          <button className="h-8 px-4 rounded-lg text-[11px] font-semibold text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/5 transition-all">
            {plan === 'FREE' ? 'Fazer upgrade' : 'Gerenciar assinatura'}
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Intervalo mínimo', value: cfg.interval },
            { label: 'Integrações', value: cfg.integrations },
            { label: 'Status Pages', value: `Até ${cfg.statusPages}` },
            { label: 'API', value: cfg.api },
          ].map((f) => (
            <div key={f.label} className="px-3 py-2 rounded-lg bg-[#0a0b0f] border border-[#1e2128]">
              <p className="text-[9px] text-[#3e424a] font-semibold uppercase tracking-wider">{f.label}</p>
              <p className="text-[12px] text-[#c8c9cd] font-medium mt-0.5">{f.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Usage */}
      <div className="rounded-xl border border-[#1e2128] bg-[#12141a] p-5">
        <h3 className="text-[13px] font-semibold text-[#e4e4e7] mb-4">Uso atual</h3>
        <div className="space-y-4">
          {usageItems.map((item) => {
            const pct = Math.min((item.used / item.limit) * 100, 100);
            const isNearLimit = pct >= 80;
            return (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-[#80838a] font-medium">{item.label}</span>
                  <span className={`text-[11px] font-bold tabular-nums ${isNearLimit ? 'text-amber-400' : 'text-[#555b66]'}`}>
                    {item.used}/{item.limit}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#1e2128] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isNearLimit ? 'bg-amber-400' : 'bg-emerald-400'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Preferences ───

function PreferencesSection() {
  const [timezone, setTimezone] = useState('America/Sao_Paulo');

  const timezones = [
    { value: 'America/Sao_Paulo', label: 'Brasília (GMT-3)' },
    { value: 'America/Manaus', label: 'Manaus (GMT-4)' },
    { value: 'America/Belem', label: 'Belém (GMT-3)' },
    { value: 'America/Fortaleza', label: 'Fortaleza (GMT-3)' },
    { value: 'America/Recife', label: 'Recife (GMT-3)' },
    { value: 'America/Cuiaba', label: 'Cuiabá (GMT-4)' },
    { value: 'America/Rio_Branco', label: 'Rio Branco (GMT-5)' },
    { value: 'America/Noronha', label: 'Fernando de Noronha (GMT-2)' },
  ];

  return (
    <div>
      <h2 className={sectionTitle}>Preferências</h2>
      <p className={sectionDesc}>Personalize sua experiência</p>

      <div className="space-y-5">
        {/* Timezone */}
        <div>
          <label className={labelClass}>Fuso horário</label>
          <div className="relative">
            <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className={`${inputBase} appearance-none cursor-pointer pr-10`}>
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
            <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2e323a] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>

        {/* Language */}
        <div>
          <label className={labelClass}>Idioma</label>
          <div className="flex items-center gap-2">
            <div className={`${inputBase} flex items-center opacity-50 cursor-not-allowed`}>
              <span>Português (Brasil)</span>
            </div>
            <ComingSoonBadge />
          </div>
        </div>

        {/* Date format */}
        <div>
          <label className={labelClass}>Formato de data</label>
          <div className={`${inputBase} flex items-center opacity-50 cursor-not-allowed`}>
            <span>DD/MM/AAAA</span>
          </div>
          <p className="text-[10px] text-[#2e323a] mt-1.5">Padrão brasileiro</p>
        </div>

        {/* Theme */}
        <div>
          <label className={labelClass}>Tema</label>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-4 h-11 rounded-xl bg-[#0a0b0f] border border-[#1e2128]">
              <svg className="w-4 h-4 text-[#555b66]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
              <span className="text-[13px] text-[#e4e4e7]">Dark</span>
            </div>
            <ComingSoonBadge />
          </div>
        </div>

        <div className="pt-2">
          <SaveButton label="Salvar preferências" />
        </div>
      </div>
    </div>
  );
}

// ─── Audit Log ───

function AuditSection({ plan, planIdx }: { plan: string; planIdx: number }) {
  const isLocked = planIdx < 2;

  // Demo logs
  const demoLogs = [
    { id: '1', action: 'login', user: 'vinicius@email.com', detail: 'Login realizado', ip: '189.44.xx.xx', date: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
    { id: '2', action: 'monitor.create', user: 'vinicius@email.com', detail: 'Monitor "API Principal" criado', ip: '189.44.xx.xx', date: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
    { id: '3', action: 'monitor.edit', user: 'vinicius@email.com', detail: 'Monitor "Landing Page" editado — intervalo: 300s → 60s', ip: '189.44.xx.xx', date: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
    { id: '4', action: 'status_page.publish', user: 'vinicius@email.com', detail: 'Status Page "Acme Corp" publicada', ip: '189.44.xx.xx', date: new Date(Date.now() - 1000 * 60 * 300).toISOString() },
    { id: '5', action: 'integration.create', user: 'vinicius@email.com', detail: 'Integração Slack configurada', ip: '189.44.xx.xx', date: new Date(Date.now() - 1000 * 60 * 400).toISOString() },
    { id: '6', action: 'login', user: 'vinicius@email.com', detail: 'Login realizado', ip: '201.17.xx.xx', date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  ];

  const actionIcons: Record<string, { icon: JSX.Element; color: string }> = {
    login: { icon: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>, color: 'text-blue-400 bg-blue-500/10' },
    'monitor.create': { icon: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>, color: 'text-emerald-400 bg-emerald-500/10' },
    'monitor.edit': { icon: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>, color: 'text-amber-400 bg-amber-500/10' },
    'monitor.delete': { icon: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>, color: 'text-red-400 bg-red-500/10' },
    'status_page.publish': { icon: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945" /></svg>, color: 'text-violet-400 bg-violet-500/10' },
    'integration.create': { icon: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" /></svg>, color: 'text-cyan-400 bg-cyan-500/10' },
  };

  const formatDate = (d: string) => new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  if (isLocked) {
    return (
      <div>
        <h2 className={sectionTitle}>Log de auditoria</h2>
        <p className={sectionDesc}>Acompanhe todas as ações realizadas na sua conta</p>
        <div className="rounded-xl border border-amber-500/10 bg-amber-500/[0.03] py-12 text-center">
          <svg className="w-8 h-8 text-amber-400/30 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <p className="text-[14px] font-semibold text-[#80838a] mb-1">Recurso disponível no plano Pro</p>
          <p className="text-[12px] text-[#3e424a] mb-4">Veja quem fez o quê e quando na sua conta</p>
          <button className="h-9 px-5 rounded-lg text-[13px] font-semibold text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/5 transition-all">
            Fazer upgrade
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className={sectionTitle}>Log de auditoria</h2>
      <p className={sectionDesc}>Histórico de todas as ações realizadas na conta</p>

      <div className="rounded-xl border border-[#1e2128] bg-[#12141a] overflow-hidden">
        {demoLogs.map((log, idx) => {
          const ai = actionIcons[log.action] || actionIcons['monitor.edit'];
          return (
            <div key={log.id} className={`flex items-start gap-3 px-4 py-3 ${idx < demoLogs.length - 1 ? 'border-b border-[#1e2128]/70' : ''} hover:bg-white/[0.01] transition-colors`}>
              <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${ai.color}`}>
                {ai.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-[#c8c9cd]">{log.detail}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-[#3e424a] font-mono">{log.user}</span>
                  <span className="text-[10px] text-[#2e323a]">·</span>
                  <span className="text-[10px] text-[#3e424a] font-mono">{log.ip}</span>
                </div>
              </div>
              <span className="text-[10px] text-[#3e424a] flex-shrink-0 tabular-nums">{formatDate(log.date)}</span>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-[#2e323a] mt-2 text-center">Mostrando últimos 30 dias de atividade</p>
    </div>
  );
}

// ─── Danger Zone ───

function DangerSection({ user }: { user: any }) {
  const [confirmEmail, setConfirmEmail] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div>
      <h2 className="text-[16px] font-semibold text-red-400 mb-1">Zona de perigo</h2>
      <p className={sectionDesc}>Ações irreversíveis na sua conta</p>

      <div className="space-y-3">
        {/* Export */}
        <div className="rounded-xl border border-[#1e2128] bg-[#12141a] p-4 flex items-center justify-between">
          <div>
            <p className="text-[13px] font-semibold text-[#c8c9cd]">Exportar dados<ComingSoonBadge /></p>
            <p className="text-[11px] text-[#3e424a] mt-0.5">Baixe todos os seus dados em formato JSON</p>
          </div>
          <button disabled className="h-8 px-4 rounded-lg text-[11px] font-semibold text-[#555b66] border border-[#1e2128] opacity-40 cursor-not-allowed">
            Exportar
          </button>
        </div>

        {/* Delete account */}
        <div className="rounded-xl border border-red-500/15 bg-red-500/[0.02] p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[13px] font-semibold text-red-400">Desativar conta</p>
              <p className="text-[11px] text-[#3e424a] mt-0.5">Isso irá deletar permanentemente todos os seus dados</p>
            </div>
            <button
              onClick={() => setShowConfirm(!showConfirm)}
              className="h-8 px-4 rounded-lg text-[11px] font-semibold text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all"
            >
              Desativar conta
            </button>
          </div>

          {showConfirm && (
            <div className="pt-3 border-t border-red-500/10 space-y-3">
              <p className="text-[11px] text-red-400/70">
                Para confirmar, digite seu email <span className="font-mono font-bold text-red-400">{user?.email}</span> abaixo:
              </p>
              <input
                type="email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                placeholder={user?.email}
                className="w-full h-10 bg-[#0a0b0f] border border-red-500/20 rounded-xl text-[12px] text-[#e4e4e7] placeholder-[#2e323a] focus:outline-none focus:border-red-500/40 transition-all px-4 font-mono"
              />
              <button
                disabled={confirmEmail !== user?.email}
                className="w-full h-10 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[13px] font-semibold transition-all disabled:opacity-20 disabled:cursor-not-allowed"
              >
                Desativar minha conta permanentemente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}