'use client';

import { useAuth } from '@/contexts/auth-context';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { api } from '@/lib/api';

interface MaintenanceWindow {
  id: string;
  title: string;
  description?: string;
  monitorIds: string[];
  monitorNames: string[];
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  createdAt: string;
}

export default function MaintenancePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [windows, setWindows] = useState<MaintenanceWindow[]>([]);
  const [monitors, setMonitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingWindow, setEditingWindow] = useState<MaintenanceWindow | undefined>();

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const monitorsRes = await api.get('/monitors').catch(() => ({ data: { data: [] } }));
      setMonitors(monitorsRes.data.data || []);

      // TODO: Replace with real API when backend is ready
      // For now, use localStorage as temp storage
      const stored = localStorage.getItem('thealert_maintenance');
      if (stored) {
        const parsed = JSON.parse(stored) as MaintenanceWindow[];
        // Update isActive based on current time
        const now = Date.now();
        const updated = parsed.map((w) => ({
          ...w,
          isActive: now >= new Date(w.startsAt).getTime() && now <= new Date(w.endsAt).getTime(),
        }));
        setWindows(updated);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const saveWindows = (updated: MaintenanceWindow[]) => {
    setWindows(updated);
    localStorage.setItem('thealert_maintenance', JSON.stringify(updated));
  };

  const handleDelete = (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta janela de manutenção?')) return;
    saveWindows(windows.filter((w) => w.id !== id));
  };

  const handleSave = (data: MaintenanceWindow) => {
    if (editingWindow) {
      saveWindows(windows.map((w) => (w.id === editingWindow.id ? data : w)));
    } else {
      saveWindows([data, ...windows]);
    }
    setShowCreateModal(false);
    setEditingWindow(undefined);
  };

  // Categorize
  const now = Date.now();
  const active = windows.filter((w) => now >= new Date(w.startsAt).getTime() && now <= new Date(w.endsAt).getTime());
  const upcoming = windows.filter((w) => now < new Date(w.startsAt).getTime());
  const past = windows.filter((w) => now > new Date(w.endsAt).getTime());

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  const formatDuration = (start: string, end: string) => {
    const ms = new Date(end).getTime() - new Date(start).getTime();
    const mins = Math.floor(ms / 60000);
    if (mins < 60) return `${mins}min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ${mins % 60}min`;
    return `${Math.floor(hrs / 24)}d ${hrs % 24}h`;
  };

  const formatTimeUntil = (d: string) => {
    const diff = new Date(d).getTime() - now;
    if (diff <= 0) return 'Agora';
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `em ${mins}min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `em ${hrs}h`;
    const days = Math.floor(hrs / 24);
    return `em ${days}d`;
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
            <span className="text-[11px] text-[#80838a] font-medium">Manutenção</span>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[22px] font-semibold text-[#e4e4e7] tracking-tight">Manutenção</h1>
              <p className="text-[13px] text-[#3e424a] mt-1">Agende janelas de manutenção para evitar alertas falsos</p>
            </div>
            <button
              onClick={() => { setEditingWindow(undefined); setShowCreateModal(true); }}
              className="inline-flex items-center gap-2 h-9 px-4 bg-[#e4e4e7] hover:bg-white text-[#0c0d11] rounded-lg text-[13px] font-semibold transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Agendar manutenção
            </button>
          </div>
        </div>

        <div className="px-8 pb-8">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Em andamento', value: active.length, color: active.length > 0 ? 'text-amber-400' : 'text-[#e4e4e7]', dot: active.length > 0 ? 'bg-amber-400 animate-pulse' : 'bg-[#2e323a]' },
              { label: 'Agendadas', value: upcoming.length, color: 'text-[#e4e4e7]', dot: 'bg-blue-400' },
              { label: 'Concluídas', value: past.length, color: 'text-[#555b66]', dot: 'bg-[#2e323a]' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-[#1e2128] bg-[#12141a] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                  <p className="text-[10px] text-[#3e424a] font-semibold uppercase tracking-[0.08em]">{s.label}</p>
                </div>
                <p className={`text-[20px] font-bold tabular-nums ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {windows.length === 0 ? (
            /* Empty state */
            <div className="rounded-xl border border-[#1e2128] bg-[#12141a] py-20 text-center">
              <div className="w-12 h-12 rounded-full bg-[#1e2128] flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-[#3e424a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" />
                </svg>
              </div>
              <p className="text-[14px] font-semibold text-[#555b66] mb-1">Nenhuma manutenção agendada</p>
              <p className="text-[12px] text-[#3e424a] mb-5 max-w-xs mx-auto">Agende janelas de manutenção para que seus monitores não disparem alertas durante atualizações planejadas</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 h-9 px-5 bg-[#e4e4e7] hover:bg-white text-[#0c0d11] rounded-lg text-[13px] font-semibold transition-all"
              >
                Agendar primeira manutenção
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Active */}
              {active.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-amber-400 uppercase tracking-[0.08em] mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    Em andamento
                  </p>
                  <div className="space-y-2">
                    {active.map((w) => (
                      <WindowCard key={w.id} window={w} type="active" formatDate={formatDate} formatDuration={formatDuration} onEdit={() => { setEditingWindow(w); setShowCreateModal(true); }} onDelete={() => handleDelete(w.id)} />
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming */}
              {upcoming.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-blue-400 uppercase tracking-[0.08em] mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    Agendadas
                  </p>
                  <div className="space-y-2">
                    {upcoming.map((w) => (
                      <WindowCard key={w.id} window={w} type="upcoming" formatDate={formatDate} formatDuration={formatDuration} formatTimeUntil={formatTimeUntil} onEdit={() => { setEditingWindow(w); setShowCreateModal(true); }} onDelete={() => handleDelete(w.id)} />
                    ))}
                  </div>
                </div>
              )}

              {/* Past */}
              {past.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-[#3e424a] uppercase tracking-[0.08em] mb-3">Concluídas</p>
                  <div className="space-y-2">
                    {past.map((w) => (
                      <WindowCard key={w.id} window={w} type="past" formatDate={formatDate} formatDuration={formatDuration} onDelete={() => handleDelete(w.id)} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <MaintenanceFormModal
          window={editingWindow}
          monitors={monitors}
          onClose={() => { setShowCreateModal(false); setEditingWindow(undefined); }}
          onSave={handleSave}
        />
      )}
    </DashboardLayout>
  );
}

// ─── Window Card ───

function WindowCard({
  window: w,
  type,
  formatDate,
  formatDuration,
  formatTimeUntil,
  onEdit,
  onDelete,
}: {
  window: MaintenanceWindow;
  type: 'active' | 'upcoming' | 'past';
  formatDate: (d: string) => string;
  formatDuration: (s: string, e: string) => string;
  formatTimeUntil?: (d: string) => string;
  onEdit?: () => void;
  onDelete: () => void;
}) {
  return (
    <div className={`rounded-xl border bg-[#12141a] p-5 ${
      type === 'active' ? 'border-amber-500/20' : type === 'upcoming' ? 'border-blue-500/10 border-[#1e2128]' : 'border-[#1e2128] opacity-60'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5 mb-1">
            <h3 className="text-[14px] font-semibold text-[#e4e4e7] truncate">{w.title}</h3>
            {type === 'active' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/15">
                <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
                Em andamento
              </span>
            )}
            {type === 'upcoming' && formatTimeUntil && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/15">
                {formatTimeUntil(w.startsAt)}
              </span>
            )}
            {type === 'past' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold bg-[#1e2128] text-[#555b66] border border-[#2a2e36]">
                Concluída
              </span>
            )}
          </div>
          {w.description && (
            <p className="text-[11px] text-[#3e424a] line-clamp-1">{w.description}</p>
          )}
        </div>
        <div className="flex items-center gap-1.5 ml-3">
          {type !== 'past' && onEdit && (
            <button onClick={onEdit} className="w-7 h-7 rounded-md flex items-center justify-center text-[#3e424a] hover:text-[#80838a] hover:bg-[#1e2128] transition-all">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          )}
          <button onClick={onDelete} className="w-7 h-7 rounded-md flex items-center justify-center text-[#3e424a] hover:text-red-400 hover:bg-red-500/10 transition-all">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Time info */}
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5">
          <svg className="w-3 h-3 text-[#2e323a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-[11px] text-[#555b66] font-mono tabular-nums">{formatDate(w.startsAt)}</span>
        </div>
        <svg className="w-3 h-3 text-[#2e323a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
        <span className="text-[11px] text-[#555b66] font-mono tabular-nums">{formatDate(w.endsAt)}</span>
        <span className="text-[10px] text-[#3e424a] px-2 py-0.5 rounded bg-[#0a0b0f] border border-[#1e2128]">
          {formatDuration(w.startsAt, w.endsAt)}
        </span>
      </div>

      {/* Monitors */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {w.monitorNames.map((name, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#0a0b0f] border border-[#1e2128] text-[#80838a]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3e424a]" />
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Form Modal ───

function MaintenanceFormModal({
  window: win,
  monitors,
  onClose,
  onSave,
}: {
  window?: MaintenanceWindow;
  monitors: any[];
  onClose: () => void;
  onSave: (data: MaintenanceWindow) => void;
}) {
  const [title, setTitle] = useState(win?.title || '');
  const [description, setDescription] = useState(win?.description || '');
  const [startsAt, setStartsAt] = useState(win?.startsAt ? new Date(win.startsAt).toISOString().slice(0, 16) : '');
  const [endsAt, setEndsAt] = useState(win?.endsAt ? new Date(win.endsAt).toISOString().slice(0, 16) : '');
  const [selectedMonitorIds, setSelectedMonitorIds] = useState<string[]>(win?.monitorIds || []);

  const toggleMonitor = (id: string) => {
    setSelectedMonitorIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!title || !startsAt || !endsAt || selectedMonitorIds.length === 0) return;
    const now = Date.now();
    const start = new Date(startsAt).getTime();
    const end = new Date(endsAt).getTime();

    onSave({
      id: win?.id || `mw-${Date.now().toString(36)}`,
      title,
      description: description || undefined,
      monitorIds: selectedMonitorIds,
      monitorNames: selectedMonitorIds.map((id) => monitors.find((m) => m.id === id)?.name || '—'),
      startsAt: new Date(startsAt).toISOString(),
      endsAt: new Date(endsAt).toISOString(),
      isActive: now >= start && now <= end,
      createdAt: win?.createdAt || new Date().toISOString(),
    });
  };

  const inputBase = 'w-full h-11 bg-[#0a0b0f] border border-[#1e2128] rounded-xl text-[13px] text-[#e4e4e7] placeholder-[#2e323a] focus:outline-none focus:border-[#3e424a] focus:bg-[#0c0d11] transition-all px-4';

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[91] p-4">
        <div className="w-full max-w-[500px] bg-[#12141a] border border-[#1e2128] rounded-2xl overflow-hidden" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>
          {/* Header */}
          <div className="px-6 pt-6 pb-4">
            <h2 className="text-[17px] font-semibold text-[#e4e4e7]">{win ? 'Editar manutenção' : 'Agendar manutenção'}</h2>
            <p className="text-[13px] text-[#555b66] mt-1">Monitores afetados não dispararão alertas durante este período</p>
          </div>

          <div className="px-6 pb-4 space-y-4 max-h-[55vh] overflow-y-auto">
            {/* Title */}
            <div>
              <label className="block text-[11px] font-semibold text-[#555b66] uppercase tracking-[0.06em] mb-2">Título</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Atualização do servidor"
                autoFocus
                className={inputBase}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-semibold text-[#555b66] uppercase tracking-[0.06em] mb-2">
                Descrição <span className="text-[#2e323a] font-normal normal-case">(opcional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detalhes sobre a manutenção..."
                rows={2}
                className="w-full bg-[#0a0b0f] border border-[#1e2128] rounded-xl text-[13px] text-[#e4e4e7] placeholder-[#2e323a] focus:outline-none focus:border-[#3e424a] focus:bg-[#0c0d11] transition-all px-4 py-3 resize-none"
              />
            </div>

            {/* Date range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#555b66] uppercase tracking-[0.06em] mb-2">Início</label>
                <input
                  type="datetime-local"
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                  className={`${inputBase} text-[12px]`}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#555b66] uppercase tracking-[0.06em] mb-2">Fim</label>
                <input
                  type="datetime-local"
                  value={endsAt}
                  onChange={(e) => setEndsAt(e.target.value)}
                  min={startsAt}
                  className={`${inputBase} text-[12px]`}
                />
              </div>
            </div>

            {/* Monitor selection */}
            <div>
              <label className="block text-[11px] font-semibold text-[#555b66] uppercase tracking-[0.06em] mb-2">
                Monitores afetados
                <span className="text-amber-400 ml-1.5">({selectedMonitorIds.length})</span>
              </label>
              <div className="space-y-1 max-h-[160px] overflow-y-auto rounded-xl border border-[#1e2128] bg-[#0a0b0f] p-1.5">
                {monitors.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-[11px] text-[#3e424a] font-medium">Nenhum monitor criado ainda</p>
                  </div>
                ) : monitors.map((m) => {
                  const isSelected = selectedMonitorIds.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => toggleMonitor(m.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                        isSelected
                          ? 'bg-amber-500/[0.06] border border-amber-500/10'
                          : 'hover:bg-white/[0.02] border border-transparent'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border-[1.5px] flex items-center justify-center flex-shrink-0 transition-all ${
                        isSelected ? 'border-amber-400 bg-amber-400/15' : 'border-[#2a2e36]'
                      }`}>
                        {isSelected && (
                          <svg className="w-2.5 h-2.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-medium text-[#c8c9cd] truncate">{m.name}</p>
                        <p className="text-[10px] text-[#3e424a] font-mono truncate">{m.url}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[#1e2128] flex items-center gap-2.5">
            <button
              onClick={handleSubmit}
              disabled={!title || !startsAt || !endsAt || selectedMonitorIds.length === 0}
              className="flex-1 h-10 bg-[#e4e4e7] hover:bg-white text-[#0c0d11] rounded-xl text-[13px] font-semibold transition-all disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {win ? 'Salvar alterações' : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Agendar manutenção
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