import { FeatureCard } from './FeatureCard';

export function Features() {
  return (
    <section id="features" className="py-20 bg-[#f3f2f1]">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tight text-slate-900">
            Tudo que você precisa para monitorar
          </h2>
          <p className="text-base text-slate-600 font-normal">
            Recursos essenciais para manter seus sites sempre online
          </p>
        </div>

        {/* Grid de Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          
          {/* 1. HTTP/HTTPS - SEM BADGE */}
          <FeatureCard
            icon={
              <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            }
            title="Monitoramento HTTP/HTTPS"
            description="Checagens automáticas com intervalos configuráveis. Detecção instantânea de quedas e alertas imediatos."
            interactive={
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-600 font-normal">FREE</span>
                  <span className="text-sm font-semibold text-slate-900 tabular-nums">5 min</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-600 font-normal">STARTER</span>
                  <span className="text-sm font-semibold text-slate-900 tabular-nums">1 min</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-xs text-emerald-700 font-normal">PRO</span>
                  <span className="text-sm font-semibold text-primary tabular-nums">30 seg</span>
                </div>
              </div>
            }
          />

          {/* 2. Alertas Email - SEM BADGE */}
          <FeatureCard
            icon={
              <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
            title="Alertas por Email"
            description="Notificações instantâneas quando seu site cair ou voltar ao normal. Templates profissionais e claros."
            interactive={
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 p-2.5 bg-red-50 rounded-xl border border-red-100">
                  <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-red-900">Site DOWN detectado</div>
                    <div className="text-[10px] text-red-600 font-normal">api.exemplo.com • timeout</div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 bg-green-50 rounded-xl border border-green-100">
                  <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-green-900">Site UP confirmado</div>
                    <div className="text-[10px] text-green-600 font-normal">api.exemplo.com • 5min downtime</div>
                  </div>
                </div>
              </div>
            }
          />

          {/* 3. Dashboard - SEM BADGE */}
          <FeatureCard
            icon={
              <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            title="Dashboard Completo"
            description="Visão centralizada de todos os monitores com métricas em tempo real e histórico detalhado."
            interactive={
              <div className="space-y-3">
                <div className="grid grid-cols-3 divide-x divide-slate-200 bg-white rounded-xl border border-slate-200 p-3">
                  <div className="text-center pr-2">
                    <div className="text-xl font-semibold text-primary tabular-nums">24</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-normal mt-1">Monitores</div>
                  </div>
                  <div className="text-center px-2">
                    <div className="text-xl font-semibold text-green-600 tabular-nums">99.9%</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-normal mt-1">Uptime</div>
                  </div>
                  <div className="text-center pl-2">
                    <div className="text-xl font-semibold text-slate-900 tabular-nums">156ms</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-normal mt-1">Resposta</div>
                  </div>
                </div>
              </div>
            }
          />

          {/* 4. Estatísticas - SEM BADGE */}
          <FeatureCard
            icon={
              <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            title="Estatísticas e SLA"
            description="Relatórios detalhados de uptime e performance. Gráficos de 7, 30 e 90 dias conforme o plano."
            interactive={
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-normal">Últimos 30 dias</span>
                  <span className="text-base font-semibold text-primary tabular-nums">99.87%</span>
                </div>
                <div className="flex items-end gap-[2px] h-8">
                  {Array.from({ length: 60 }).map((_, i) => {
                    const isDown = i === 12 || i === 13 || i === 42;
                    return (
                      <div
                        key={i}
                        className={`flex-1 rounded-sm ${
                          isDown ? 'bg-red-400' : 'bg-primary'
                        }`}
                        style={{ 
                          height: isDown ? '30%' : `${Math.random() * 40 + 60}%`,
                          minWidth: '2px'
                        }}
                      />
                    );
                  })}
                </div>
                <div className="flex items-center justify-between text-[10px] pt-1">
                  <span className="text-slate-500 font-normal">Downtime: <span className="font-semibold text-slate-900">56 min</span></span>
                  <span className="text-slate-500 font-normal">Incidents: <span className="font-semibold text-slate-900">2</span></span>
                </div>
              </div>
            }
          />

          {/* 5. Status Pages - SEM BADGE */}
          <FeatureCard
            icon={
              <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            title="Status Pages Públicas"
            description="Compartilhe o status dos seus serviços com clientes. Páginas públicas customizáveis e profissionais."
            interactive={
              <div className="space-y-2">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-semibold text-slate-900">status.seusite.com</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="text-[10px] text-green-600 font-semibold">Operational</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-600 font-normal">API</span>
                      <span className="text-[10px] text-green-600 font-semibold">100%</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-600 font-normal">Website</span>
                      <span className="text-[10px] text-green-600 font-semibold">99.9%</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-600 font-normal">Database</span>
                      <span className="text-[10px] text-green-600 font-semibold">100%</span>
                    </div>
                  </div>
                </div>
              </div>
            }
          />

          {/* 6. API Health - STARTER+ */}
          <FeatureCard
            icon={
              <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            }
            title="API Health Checking"
            description="Monitore endpoints REST com validação de status codes, response time e payload esperado."
            badge="STARTER+"
            interactive={
              <div className="space-y-1.5">
                <div className="flex items-center justify-between p-2 px-3 bg-white rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-slate-900">GET</span>
                    <span className="text-xs text-slate-600 font-normal">/api/users</span>
                  </div>
                  <span className="text-xs text-green-600 font-semibold tabular-nums">200</span>
                </div>
                <div className="flex items-center justify-between p-2 px-3 bg-white rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-slate-900">POST</span>
                    <span className="text-xs text-slate-600 font-normal">/api/auth</span>
                  </div>
                  <span className="text-xs text-green-600 font-semibold tabular-nums">201</span>
                </div>
                <div className="flex items-center justify-between p-2 px-3 bg-red-50 rounded-xl border border-red-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-slate-900">GET</span>
                    <span className="text-xs text-slate-600 font-normal">/api/data</span>
                  </div>
                  <span className="text-xs text-red-600 font-semibold tabular-nums">500</span>
                </div>
              </div>
            }
          />

          {/* 7. Response Time - PRO+ */}
          <FeatureCard
            icon={
              <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            title="Tempo de Resposta"
            description="Acompanhe performance dos seus serviços em tempo real. Identifique lentidão antes que vire problema."
            badge="PRO+"
            interactive={
              <div className="space-y-2.5">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-white rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-normal mb-0.5">Média</div>
                    <div className="text-base font-semibold text-slate-900 tabular-nums">58ms</div>
                  </div>
                  <div className="text-center p-2 bg-white rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-normal mb-0.5">Min</div>
                    <div className="text-base font-semibold text-green-600 tabular-nums">45ms</div>
                  </div>
                  <div className="text-center p-2 bg-white rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-normal mb-0.5">P95</div>
                    <div className="text-base font-semibold text-orange-600 tabular-nums">92ms</div>
                  </div>
                </div>
                <div className="flex items-end justify-between h-12 gap-[2px]">
                  {[45, 52, 48, 120, 58, 51, 49, 54, 62, 55, 48, 51, 47, 56, 60].map((ms, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end">
                      <div 
                        className={`w-full rounded-sm ${ms > 100 ? 'bg-orange-400' : 'bg-primary'}`}
                        style={{ height: `${(ms / 120) * 100}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            }
          />

          {/* 8. Alertas Multicanal - PRO+ */}
          <FeatureCard
            icon={
              <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            }
            title="Alertas Multicanal"
            description="Integre com ferramentas que sua equipe já usa. Receba alertas em tempo real onde você precisa."
            badge="PRO+"
            interactive={
              <div className="space-y-1.5">
                {[
                  { name: 'Slack', active: true, alerts: 24 },
                  { name: 'Discord', active: true, alerts: 18 },
                  { name: 'Telegram', active: true, alerts: 12 },
                  { name: 'Webhook', active: false, alerts: 0 },
                ].map((channel) => (
                  <div key={channel.name} className="flex items-center justify-between p-2 px-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${channel.active ? 'bg-green-500' : 'bg-slate-300'}`} />
                      <span className="text-xs text-slate-700 font-normal">{channel.name}</span>
                    </div>
                    {channel.active && (
                      <span className="text-[10px] text-slate-500 font-normal tabular-nums">{channel.alerts} alertas</span>
                    )}
                  </div>
                ))}
              </div>
            }
          />

          {/* 9. Port Monitoring - PÓS-BETA */}
          <FeatureCard
            icon={
              <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            }
            title="Port Monitoring"
            description="Verifique disponibilidade de portas TCP específicas. Essencial para infraestrutura, databases e servidores."
            badge="PÓS-BETA"
            interactive={
              <div className="space-y-1.5">
                {[
                  { port: '5432', service: 'PostgreSQL', status: true, ms: '12ms' },
                  { port: '3306', service: 'MySQL', status: true, ms: '8ms' },
                  { port: '6379', service: 'Redis', status: true, ms: '5ms' },
                  { port: '22', service: 'SSH', status: true, ms: '3ms' },
                ].map((item) => (
                  <div key={item.port} className="flex items-center justify-between p-2 px-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-slate-900 tabular-nums">{item.port}</span>
                      <span className="text-[10px] text-slate-500 font-normal">{item.service}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-normal tabular-nums">{item.ms}</span>
                      <div className={`w-2 h-2 rounded-full ${item.status ? 'bg-green-500' : 'bg-red-500'}`} />
                    </div>
                  </div>
                ))}
              </div>
            }
          />

          {/* 10. Keyword Monitoring - PÓS-BETA */}
          <FeatureCard
            icon={
              <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
            title="Keyword Monitoring"
            description="Monitore mudanças em conteúdo específico. Ideal para e-commerce, compliance e tracking de alterações."
            badge="PÓS-BETA"
            interactive={
              <div className="space-y-2">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 mb-1.5 uppercase tracking-wider font-normal">Palavra-chave</div>
                  <div className="text-xs font-mono text-slate-900 font-normal mb-2.5">"Produto em estoque"</div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-xs text-slate-600 font-normal">Status</span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Detectado
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="text-slate-500 mb-0.5 font-normal">Última checagem</div>
                    <div className="text-slate-900 font-semibold">há 2 min</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="text-slate-500 mb-0.5 font-normal">Mudanças hoje</div>
                    <div className="text-slate-900 font-semibold">0</div>
                  </div>
                </div>
              </div>
            }
          />

          {/* 11. SSL Certificate - PÓS-BETA */}
          <FeatureCard
            icon={
              <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
            title="SSL Certificate Monitoring"
            description="Rastreie validade de certificados SSL. Alertas proativos antes da expiração para evitar sites inseguros."
            badge="PÓS-BETA"
            interactive={
              <div className="space-y-2">
                <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-orange-900 mb-0.5">Certificado expirando</div>
                      <div className="text-[10px] text-orange-700 font-normal">seusite.com</div>
                    </div>
                    <div className="text-right pl-3">
                      <div className="text-xl font-semibold text-orange-600 tabular-nums leading-none">15</div>
                      <div className="text-[9px] text-orange-700 uppercase tracking-wider font-normal mt-0.5">dias</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-600 font-normal">Emitido por</span>
                  <span className="text-[10px] text-slate-900 font-semibold">Let's Encrypt</span>
                </div>
                <div className="text-[10px] text-slate-500 text-center font-normal">
                  Notificação enviada 30 dias antes
                </div>
              </div>
            }
          />

          {/* 12. Domain Expiration - PÓS-BETA */}
          <FeatureCard
            icon={
              <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="Domain Expiration"
            description="Controle renovação de domínios com alertas automáticos. Nunca perca um domínio por esquecimento."
            badge="PÓS-BETA"
            interactive={
              <div className="space-y-2">
                <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono text-green-900 font-semibold">seudominio.com</span>
                    <div className="text-right">
                      <div className="text-xl font-semibold text-green-600 tabular-nums leading-none">365</div>
                      <div className="text-[9px] text-green-700 uppercase tracking-wider font-normal mt-0.5">dias</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-500 mb-0.5 font-normal">Renova em</div>
                    <div className="text-xs text-slate-900 font-semibold">04 Fev 2027</div>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-500 mb-0.5 font-normal">Registrar</div>
                    <div className="text-xs text-slate-900 font-semibold">GoDaddy</div>
                  </div>
                </div>
              </div>
            }
          />

        </div>
      </div>
    </section>
  );
}