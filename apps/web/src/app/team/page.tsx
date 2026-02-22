'use client';

import { useAuth } from '@/contexts/auth-context';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'viewer';
  status: 'active' | 'pending';
  joinedAt: string;
}

const ROLE_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  owner: { label: 'Dono', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/10' },
  admin: { label: 'Admin', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/10' },
  viewer: { label: 'Visualizador', color: 'text-[#80838a]', bg: 'bg-[#1e2128] border-[#2a2e36]' },
};

export default function TeamPage() {
  const { user } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const plan = user?.subscription?.plan || 'FREE';
  const planIdx = ['FREE', 'STARTER', 'PRO', 'BUSINESS'].indexOf(plan);
  const isLocked = planIdx < 2; // PRO+ only
  const maxMembers: Record<string, number> = { FREE: 1, STARTER: 1, PRO: 3, BUSINESS: 10 };
  const limit = maxMembers[plan] || 1;

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = () => {
    // TODO: Replace with real API
    const stored = localStorage.getItem('thealert_team');
    if (stored) {
      setMembers(JSON.parse(stored));
    } else {
      // Owner is always present
      const owner: TeamMember = {
        id: user?.id || 'owner',
        name: user?.name || 'Usuário',
        email: user?.email || '',
        role: 'owner',
        status: 'active',
        joinedAt: user?.createdAt || new Date().toISOString(),
      };
      setMembers([owner]);
      localStorage.setItem('thealert_team', JSON.stringify([owner]));
    }
    setLoading(false);
  };

  const saveMembers = (data: TeamMember[]) => {
    setMembers(data);
    localStorage.setItem('thealert_team', JSON.stringify(data));
  };

  const handleInvite = (email: string, role: 'admin' | 'viewer') => {
    const newMember: TeamMember = {
      id: `mem-${Date.now().toString(36)}`,
      name: email.split('@')[0],
      email,
      role,
      status: 'pending',
      joinedAt: new Date().toISOString(),
    };
    saveMembers([...members, newMember]);
    setShowInviteModal(false);
  };

  const handleRemove = (id: string) => {
    if (!confirm('Remover este membro da equipe?')) return;
    saveMembers(members.filter((m) => m.id !== id));
  };

  const handleRoleChange = (id: string, role: 'admin' | 'viewer') => {
    saveMembers(members.map((m) => m.id === id ? { ...m, role } : m));
  };

  const canInvite = members.length < limit && !isLocked;

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
        <div className="px-8 pt-8 pb-6">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/dashboard" className="text-[11px] text-[#3e424a] hover:text-[#80838a] font-medium transition-colors">Dashboard</Link>
            <svg className="w-3 h-3 text-[#2e323a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-[11px] text-[#80838a] font-medium">Equipe</span>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[22px] font-semibold text-[#e4e4e7] tracking-tight">Equipe</h1>
              <p className="text-[13px] text-[#3e424a] mt-1">
                Gerencie membros e permissões · <span className="tabular-nums">{members.length}/{limit}</span> membros
              </p>
            </div>
            {!isLocked && (
              <button
                onClick={() => setShowInviteModal(true)}
                disabled={!canInvite}
                className="inline-flex items-center gap-2 h-9 px-4 bg-[#e4e4e7] hover:bg-white text-[#0c0d11] rounded-lg text-[13px] font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Convidar membro
              </button>
            )}
          </div>
        </div>

        <div className="px-8 pb-8">
          {/* Locked state */}
          {isLocked && (
            <div className="rounded-xl border border-amber-500/10 bg-amber-500/[0.03] p-6 text-center mb-6">
              <svg className="w-8 h-8 text-amber-400/30 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
              <p className="text-[14px] font-semibold text-[#80838a] mb-1">Equipes disponíveis a partir do plano Pro</p>
              <p className="text-[12px] text-[#3e424a] mb-4">Convide até 3 membros no Pro ou 10 no Business</p>
              <Link href="/upgrade" className="inline-flex h-9 px-5 rounded-lg text-[13px] font-semibold text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/5 transition-all items-center">
                Fazer upgrade
              </Link>
            </div>
          )}

          {/* Limit warning */}
          {!isLocked && members.length >= limit && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/[0.04] border border-amber-500/10 mb-5">
              <svg className="w-4 h-4 text-amber-400/60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-[12px] text-[#80838a]">
                Limite de <span className="font-semibold text-amber-400">{limit} membros</span> atingido no plano {plan}.{' '}
                <Link href="/upgrade" className="text-emerald-400/60 hover:text-emerald-400 font-medium transition-colors">Fazer upgrade</Link>
              </p>
            </div>
          )}

          {/* Members list */}
          <div className="rounded-xl border border-[#1e2128] bg-[#12141a] overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#1e2128] bg-[#0a0b0f]">
              <span className="col-span-5 text-[10px] font-semibold text-[#3e424a] uppercase tracking-wider">Membro</span>
              <span className="col-span-2 text-[10px] font-semibold text-[#3e424a] uppercase tracking-wider">Função</span>
              <span className="col-span-2 text-[10px] font-semibold text-[#3e424a] uppercase tracking-wider">Status</span>
              <span className="col-span-2 text-[10px] font-semibold text-[#3e424a] uppercase tracking-wider">Desde</span>
              <span className="col-span-1"></span>
            </div>

            {members.map((member, idx) => {
              const initials = member.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
              const roleInfo = ROLE_LABELS[member.role];
              const isOwner = member.role === 'owner';
              const colors = [
                'from-emerald-500/20 to-emerald-500/5 border-emerald-500/10 text-emerald-400',
                'from-blue-500/20 to-blue-500/5 border-blue-500/10 text-blue-400',
                'from-violet-500/20 to-violet-500/5 border-violet-500/10 text-violet-400',
                'from-amber-500/20 to-amber-500/5 border-amber-500/10 text-amber-400',
                'from-rose-500/20 to-rose-500/5 border-rose-500/10 text-rose-400',
              ];
              const colorClass = colors[idx % colors.length];

              return (
                <div key={member.id} className={`grid grid-cols-12 gap-4 px-5 py-3.5 items-center ${idx < members.length - 1 ? 'border-b border-[#1e2128]/60' : ''} hover:bg-white/[0.01] transition-colors`}>
                  {/* Member info */}
                  <div className="col-span-5 flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${colorClass} border flex items-center justify-center flex-shrink-0`}>
                      <span className="text-[10px] font-bold">{initials}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-[#e4e4e7] truncate">{member.name}</p>
                      <p className="text-[10px] text-[#3e424a] font-mono truncate">{member.email}</p>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="col-span-2">
                    {isOwner ? (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold border ${roleInfo.bg} ${roleInfo.color}`}>
                        {roleInfo.label}
                      </span>
                    ) : (
                      <select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value as 'admin' | 'viewer')}
                        className="h-6 bg-[#0a0b0f] border border-[#1e2128] rounded text-[10px] text-[#80838a] px-1.5 appearance-none cursor-pointer focus:outline-none"
                      >
                        <option value="admin">Admin</option>
                        <option value="viewer">Visualizador</option>
                      </select>
                    )}
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-medium ${
                      member.status === 'active' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        member.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
                      }`} />
                      {member.status === 'active' ? 'Ativo' : 'Pendente'}
                    </span>
                  </div>

                  {/* Joined */}
                  <div className="col-span-2">
                    <span className="text-[10px] text-[#3e424a] tabular-nums">
                      {new Date(member.joinedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex justify-end">
                    {!isOwner && (
                      <button
                        onClick={() => handleRemove(member.id)}
                        className="w-7 h-7 rounded-md flex items-center justify-center text-[#3e424a] hover:text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Permissions explanation */}
          <div className="mt-6 rounded-xl border border-[#1e2128] bg-[#12141a] p-5">
            <h3 className="text-[13px] font-semibold text-[#e4e4e7] mb-3">Permissões por função</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { role: 'Dono', color: 'text-amber-400', perms: ['Acesso total', 'Gerenciar equipe', 'Gerenciar plano', 'Excluir conta'] },
                { role: 'Admin', color: 'text-blue-400', perms: ['Criar/editar monitores', 'Gerenciar status pages', 'Configurar integrações', 'Ver logs'] },
                { role: 'Visualizador', color: 'text-[#80838a]', perms: ['Ver dashboard', 'Ver status pages', 'Ver notificações', 'Sem edição'] },
              ].map((r) => (
                <div key={r.role} className="px-4 py-3 rounded-lg bg-[#0a0b0f] border border-[#1e2128]">
                  <p className={`text-[11px] font-bold mb-2 ${r.color}`}>{r.role}</p>
                  <div className="space-y-1">
                    {r.perms.map((p) => (
                      <div key={p} className="flex items-center gap-1.5">
                        <svg className="w-2.5 h-2.5 text-[#2e323a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <span className="text-[10px] text-[#555b66]">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteModal
          onClose={() => setShowInviteModal(false)}
          onInvite={handleInvite}
          existingEmails={members.map((m) => m.email)}
        />
      )}
    </DashboardLayout>
  );
}

// ─── Invite Modal ───

function InviteModal({
  onClose,
  onInvite,
  existingEmails,
}: {
  onClose: () => void;
  onInvite: (email: string, role: 'admin' | 'viewer') => void;
  existingEmails: string[];
}) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'viewer'>('viewer');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!email.includes('@')) { setError('Email inválido'); return; }
    if (existingEmails.includes(email)) { setError('Este email já está na equipe'); return; }
    onInvite(email, role);
  };

  const inputBase = 'w-full h-11 bg-[#0a0b0f] border border-[#1e2128] rounded-xl text-[13px] text-[#e4e4e7] placeholder-[#2e323a] focus:outline-none focus:border-[#3e424a] focus:bg-[#0c0d11] transition-all px-4';

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[91] p-4">
        <div className="w-full max-w-[440px] bg-[#12141a] border border-[#1e2128] rounded-2xl overflow-hidden" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>
          <div className="px-6 pt-6 pb-4">
            <h2 className="text-[16px] font-semibold text-[#e4e4e7]">Convidar membro</h2>
            <p className="text-[12px] text-[#3e424a] mt-1">Envie um convite por email para adicionar à sua equipe</p>
          </div>

          <div className="px-6 pb-4 space-y-4">
            {error && (
              <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-red-500/[0.06] border border-red-500/10">
                <p className="text-[12px] text-red-400 font-medium">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-[#555b66] uppercase tracking-[0.06em] mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="membro@empresa.com"
                autoFocus
                className={inputBase}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#555b66] uppercase tracking-[0.06em] mb-2">Função</label>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { key: 'admin' as const, label: 'Admin', desc: 'Pode criar e editar monitores', color: 'text-blue-400', border: 'border-blue-500/20 bg-blue-500/[0.04]' },
                  { key: 'viewer' as const, label: 'Visualizador', desc: 'Apenas visualização', color: 'text-[#80838a]', border: 'border-[#2a2e36] bg-white/[0.02]' },
                ]).map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => setRole(r.key)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      role === r.key ? r.border : 'border-[#1e2128] hover:border-[#2a2e36]'
                    }`}
                  >
                    <p className={`text-[12px] font-semibold ${role === r.key ? r.color : 'text-[#555b66]'}`}>{r.label}</p>
                    <p className="text-[10px] text-[#3e424a] mt-0.5">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-[#1e2128] flex items-center gap-2.5">
            <button
              onClick={handleSubmit}
              disabled={!email}
              className="flex-1 h-10 bg-[#e4e4e7] hover:bg-white text-[#0c0d11] rounded-xl text-[13px] font-semibold transition-all disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
              Enviar convite
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