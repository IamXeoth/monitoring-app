'use client';

import { useAuth } from '@/contexts/auth-context';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { api } from '@/lib/api';

interface StatusPageMonitor {
  id: string;
  monitorId: string;
  displayName: string;
  monitor: { id: string; name: string; url: string };
}

interface StatusPage {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isPublished: boolean;
  monitors: StatusPageMonitor[];
  createdAt: string;
}

export default function StatusPagesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [pages, setPages] = useState<StatusPage[]>([]);
  const [monitors, setMonitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPage, setEditingPage] = useState<StatusPage | undefined>();

  const plan = user?.subscription?.plan || 'FREE';

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    try {
      // Fetch independently so one failure doesn't block the other
      const monitorsRes = await api.get('/monitors').catch(() => ({ data: { data: [] } }));
      const pagesRes = await api.get('/status-pages').catch(() => ({ data: { data: [] } }));
      setMonitors(monitorsRes.data.data || []);
      setPages(pagesRes.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta status page?')) return;
    await api.delete(`/status-pages/${id}`);
    loadData();
  };

  const handleTogglePublish = async (page: StatusPage) => {
    await api.put(`/status-pages/${page.id}`, { isPublished: !page.isPublished });
    loadData();
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
        <div className="px-8 pt-8 pb-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4">
            <Link href="/dashboard" className="text-[11px] text-[#3e424a] hover:text-[#80838a] font-medium transition-colors">Dashboard</Link>
            <svg className="w-3 h-3 text-[#2e323a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-[11px] text-[#80838a] font-medium">Status Pages</span>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[22px] font-semibold text-[#e4e4e7] tracking-tight">Status Pages</h1>
              <p className="text-[13px] text-[#3e424a] mt-1">Páginas públicas mostrando o status dos seus serviços</p>
            </div>
            <button
              onClick={() => { setEditingPage(undefined); setShowCreateModal(true); }}
              className="inline-flex items-center gap-2 h-9 px-4 bg-[#e4e4e7] hover:bg-white text-[#0c0d11] rounded-lg text-[13px] font-semibold transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Nova status page
            </button>
          </div>
        </div>

        <div className="px-8 pb-8">
          {pages.length === 0 ? (
            <div className="rounded-xl border border-[#1e2128] bg-[#12141a] py-20 text-center">
              <div className="w-12 h-12 rounded-full bg-[#1e2128] flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-[#3e424a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-[14px] font-semibold text-[#555b66] mb-1">Nenhuma status page criada</p>
              <p className="text-[12px] text-[#3e424a] mb-5">Crie uma página pública para seus clientes acompanharem o status dos seus serviços</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 h-9 px-5 bg-[#e4e4e7] hover:bg-white text-[#0c0d11] rounded-lg text-[13px] font-semibold transition-all"
              >
                Criar primeira status page
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pages.map((page) => (
                <div key={page.id} className="rounded-xl border border-[#1e2128] bg-[#12141a] p-5 group">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2.5 mb-1">
                        <h3 className="text-[14px] font-semibold text-[#e4e4e7] truncate">{page.name}</h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold ${
                          page.isPublished
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                            : 'bg-[#1e2128] text-[#555b66] border border-[#2a2e36]'
                        }`}>
                          {page.isPublished ? 'Publicada' : 'Rascunho'}
                        </span>
                      </div>
                      {page.description && (
                        <p className="text-[11px] text-[#3e424a] line-clamp-1">{page.description}</p>
                      )}
                    </div>
                  </div>

                  {/* URL */}
                  <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-[#0a0b0f] border border-[#1e2128]">
                    <svg className="w-3 h-3 text-[#2e323a] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span className="text-[11px] font-mono text-[#555b66] truncate">
                      thealert.io/status/{page.slug}
                    </span>
                    {page.isPublished && (
                      <a
                        href={`/status/${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="ml-auto text-[10px] text-emerald-400/60 hover:text-emerald-400 font-medium transition-colors flex-shrink-0"
                      >
                        Abrir
                      </a>
                    )}
                  </div>

                  {/* Monitors count */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[11px] text-[#3e424a]">
                      {page.monitors.length} monitor{page.monitors.length !== 1 ? 'es' : ''} vinculado{page.monitors.length !== 1 ? 's' : ''}
                    </span>
                    <div className="flex -space-x-1">
                      {page.monitors.slice(0, 5).map((spm) => (
                        <div key={spm.id} className="w-5 h-5 rounded-full bg-[#1e2128] border border-[#12141a] flex items-center justify-center" title={spm.displayName}>
                          <span className="text-[7px] font-bold text-[#555b66] uppercase">{spm.displayName.charAt(0)}</span>
                        </div>
                      ))}
                      {page.monitors.length > 5 && (
                        <div className="w-5 h-5 rounded-full bg-[#1e2128] border border-[#12141a] flex items-center justify-center">
                          <span className="text-[7px] font-bold text-[#3e424a]">+{page.monitors.length - 5}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-[#1e2128]">
                    <button
                      onClick={() => handleTogglePublish(page)}
                      className={`h-8 px-3 rounded-lg text-[11px] font-semibold border transition-all ${
                        page.isPublished
                          ? 'border-amber-500/20 text-amber-400 hover:bg-amber-500/10'
                          : 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10'
                      }`}
                    >
                      {page.isPublished ? 'Despublicar' : 'Publicar'}
                    </button>
                    <button
                      onClick={() => { setEditingPage(page); setShowCreateModal(true); }}
                      className="h-8 px-3 bg-[#15171c] border border-[#1e2128] rounded-lg text-[11px] font-semibold text-[#80838a] hover:text-[#c8c9cd] hover:border-[#2a2e36] transition-all"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(page.id)}
                      className="h-8 px-3 bg-[#15171c] border border-[#1e2128] rounded-lg text-[11px] font-semibold text-red-400/60 hover:text-red-400 hover:border-red-500/20 transition-all"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <StatusPageFormModal
          page={editingPage}
          monitors={monitors}
          plan={plan}
          onClose={() => { setShowCreateModal(false); setEditingPage(undefined); }}
          onSave={loadData}
        />
      )}
    </DashboardLayout>
  );
}

// ─── Form Modal ───

function StatusPageFormModal({
  page,
  monitors,
  plan,
  onClose,
  onSave,
}: {
  page?: StatusPage;
  monitors: any[];
  plan: string;
  onClose: () => void;
  onSave: () => void;
}) {
  const isPaid = plan !== 'FREE';
  const generateRandomSlug = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'sp-';
    for (let i = 0; i < 8; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    return result;
  };

  const [name, setName] = useState(page?.name || '');
  const [slug, setSlug] = useState(page?.slug || (isPaid ? '' : generateRandomSlug()));
  const [description, setDescription] = useState(page?.description || '');
  const [publishNow, setPublishNow] = useState(false);
  const [selectedMonitors, setSelectedMonitors] = useState<{ id: string; displayName: string }[]>(
    page?.monitors.map((m) => ({ id: m.monitorId, displayName: m.displayName })) || []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-generate slug from name (paid plans only)
  const handleNameChange = (val: string) => {
    setName(val);
    if (!page && isPaid) {
      const generated = val
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setSlug(generated);
    }
  };

  const toggleMonitor = (m: any) => {
    const exists = selectedMonitors.find((sm) => sm.id === m.id);
    if (exists) {
      setSelectedMonitors(selectedMonitors.filter((sm) => sm.id !== m.id));
    } else {
      setSelectedMonitors([...selectedMonitors, { id: m.id, displayName: m.name }]);
    }
  };

  const handleSubmit = async () => {
    if (!name || !slug) return;
    setError('');
    setLoading(true);
    try {
      if (page) {
        await api.put(`/status-pages/${page.id}`, {
          name,
          description,
          isPublished: publishNow || page.isPublished,
          monitorIds: selectedMonitors,
        });
      } else {
        await api.post('/status-pages', {
          name,
          slug,
          description,
          isPublished: publishNow,
          monitorIds: selectedMonitors,
        });
      }
      onSave();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  };

  const inputBase = 'w-full h-11 bg-[#0a0b0f] border border-[#1e2128] rounded-xl text-[13px] text-[#e4e4e7] placeholder-[#2e323a] focus:outline-none focus:border-[#3e424a] focus:bg-[#0c0d11] transition-all px-4';

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[91] p-4">
        <div className="w-full max-w-[500px] bg-[#12141a] border border-[#1e2128] rounded-2xl overflow-hidden" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>
          {/* Header */}
          <div className="px-6 pt-6 pb-4">
            <h2 className="text-[17px] font-semibold text-[#e4e4e7]">{page ? 'Editar status page' : 'Criar status page'}</h2>
            <p className="text-[13px] text-[#555b66] mt-1">
              {page ? 'Atualize as configurações da página' : 'Configure uma página de status pública para seus clientes'}
            </p>
          </div>

          <div className="px-6 pb-4 space-y-4 max-h-[55vh] overflow-y-auto">
            {error && (
              <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-red-500/[0.06] border border-red-500/10">
                <p className="text-[12px] text-red-400 font-medium">{error}</p>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-[11px] font-semibold text-[#555b66] uppercase tracking-[0.06em] mb-2">Nome da página</label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ex: Acme Corp Status"
                autoFocus
                className={inputBase}
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-[11px] font-semibold text-[#555b66] uppercase tracking-[0.06em] mb-2">
                URL da página
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[11px] text-[#2e323a] font-mono pointer-events-none">
                  thealert.io/status/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => isPaid && setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder={isPaid ? 'minha-empresa' : ''}
                  disabled={!isPaid || !!page}
                  className={`${inputBase} pl-[145px] font-mono ${!isPaid || page ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              </div>
              {/* URL preview */}
              {slug && (
                <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-[#0a0b0f] border border-[#1e2128]">
                  <svg className="w-3 h-3 text-emerald-400/40 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span className="text-[11px] font-mono text-[#555b66]">
                    https://thealert.io/status/<span className="text-emerald-400">{slug}</span>
                  </span>
                </div>
              )}
              {!isPaid && (
                <p className="text-[10px] text-[#3e424a] mt-1.5 ml-0.5">
                  Plano FREE usa URL gerada automaticamente.{' '}
                  <span className="text-emerald-400/50 hover:text-emerald-400 cursor-pointer transition-colors">Fazer upgrade</span>{' '}
                  para personalizar.
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-semibold text-[#555b66] uppercase tracking-[0.06em] mb-2">
                Descrição <span className="text-[#2e323a] font-normal normal-case">(opcional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Status dos serviços em tempo real..."
                rows={2}
                className="w-full bg-[#0a0b0f] border border-[#1e2128] rounded-xl text-[13px] text-[#e4e4e7] placeholder-[#2e323a] focus:outline-none focus:border-[#3e424a] focus:bg-[#0c0d11] transition-all px-4 py-3 resize-none"
              />
            </div>

            {/* Monitor selection */}
            <div>
              <label className="block text-[11px] font-semibold text-[#555b66] uppercase tracking-[0.06em] mb-2">
                Monitores visíveis na página
                <span className="text-emerald-400 ml-1.5">({selectedMonitors.length})</span>
              </label>
              <div className="space-y-1 max-h-[180px] overflow-y-auto rounded-xl border border-[#1e2128] bg-[#0a0b0f] p-1.5">
                {monitors.length === 0 ? (
                  <div className="text-center py-6">
                    <svg className="w-5 h-5 text-[#2e323a] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="text-[11px] text-[#3e424a] font-medium">Nenhum monitor criado ainda</p>
                    <p className="text-[10px] text-[#2e323a] mt-0.5">Crie monitores no dashboard primeiro</p>
                  </div>
                ) : monitors.map((m) => {
                  const isSelected = selectedMonitors.some((sm) => sm.id === m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => toggleMonitor(m)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                        isSelected
                          ? 'bg-emerald-500/[0.06] border border-emerald-500/10'
                          : 'hover:bg-white/[0.02] border border-transparent'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border-[1.5px] flex items-center justify-center flex-shrink-0 transition-all ${
                        isSelected ? 'border-emerald-400 bg-emerald-400/15' : 'border-[#2a2e36]'
                      }`}>
                        {isSelected && (
                          <svg className="w-2.5 h-2.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-medium text-[#c8c9cd] truncate">{m.name}</p>
                        <p className="text-[10px] text-[#3e424a] font-mono truncate">{m.url}</p>
                      </div>
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        m.isActive ? 'bg-emerald-400' : 'bg-[#555b66]'
                      }`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Publish toggle */}
            {!page?.isPublished && (
              <div
                onClick={() => setPublishNow(!publishNow)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                  publishNow
                    ? 'bg-emerald-500/[0.04] border-emerald-500/15'
                    : 'bg-[#0a0b0f] border-[#1e2128] hover:border-[#2a2e36]'
                }`}
              >
                <div className={`w-9 h-5 rounded-full relative transition-all ${
                  publishNow ? 'bg-emerald-400' : 'bg-[#2a2e36]'
                }`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                    publishNow ? 'left-[18px]' : 'left-0.5'
                  }`} style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
                </div>
                <div>
                  <p className={`text-[12px] font-semibold ${publishNow ? 'text-emerald-400' : 'text-[#80838a]'}`}>
                    Publicar imediatamente
                  </p>
                  <p className="text-[10px] text-[#3e424a] mt-0.5">
                    A página ficará acessível publicamente após a criação
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[#1e2128] flex items-center gap-2.5">
            <button
              onClick={handleSubmit}
              disabled={loading || !name || !slug || selectedMonitors.length === 0}
              className="flex-1 h-10 bg-[#e4e4e7] hover:bg-white text-[#0c0d11] rounded-xl text-[13px] font-semibold transition-all disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Salvando...
                </>
              ) : page ? 'Salvar alterações' : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Criar status page
                </>
              )}
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