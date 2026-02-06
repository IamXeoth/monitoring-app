interface UseCaseItemProps {
  badge: string;
  title: string;
  description: string;
  visual: React.ReactNode;
  features: Array<{ text: string; highlight?: string }>;
}

function UseCaseItem({ badge, title, description, visual, features }: UseCaseItemProps) {
  return (
    <div className="grid md:grid-cols-2 gap-16 items-center">
      {/* Left: Content */}
      <div>
        {/* Badge */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200">
            <svg className="w-3.5 h-3.5 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span className="text-xs font-medium text-slate-700 uppercase tracking-wider">
              {badge}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4 leading-tight tracking-tight">
          {title}
        </h3>

        {/* Description */}
        <p className="text-base text-slate-600 leading-relaxed font-normal mb-8">
          {description}
        </p>

        {/* Features */}
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="text-sm text-slate-600 leading-relaxed font-normal">
              {feature.text}
              {feature.highlight && (
                <span className="font-semibold text-slate-900"> {feature.highlight}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right: Visual */}
      <div>
        {visual}
      </div>
    </div>
  );
}

export function UseCases() {
  return (
    <section className="py-20 bg-[#f3f2f1]">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tight text-slate-900">
            Monitoramento que se adapta ao seu momento
          </h2>
          <p className="text-base text-slate-600 font-normal">
            Do primeiro commit ao IPO. Esteja preparado para cada fase da sua jornada.
          </p>
        </div>

        <div className="max-w-7xl mx-auto space-y-32">
          
          {/* By Product */}
          <div id="usecases-by-product">
            <UseCaseItem
            badge="By Product"
            title="Tudo que você precisa em um só lugar"
            description="Uma plataforma completa de monitoramento que cresce com suas necessidades. Do básico ao avançado, sem complicação."
            features={[
              { 
                text: 'Monitore',
                highlight: 'HTTP, APIs REST, portas TCP, certificados SSL, domínios e DNS.'
              },
              { 
                text: 'Configure alertas inteligentes com múltiplos canais e regras de escalonamento personalizadas.',
              },
              { 
                text: 'Status pages públicas e brandable',
                highlight: 'para transparência total com clientes.'
              },
            ]}
            visual={
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6 pb-5 border-b border-slate-100">
                  <div className="text-xs text-slate-500 font-normal">Monitor overview</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs font-semibold text-slate-900">All operational</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-sm text-slate-600 font-normal">HTTP monitoring</span>
                    <span className="text-xs text-slate-900 font-semibold tabular-nums">24 active</span>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-sm text-slate-600 font-normal">API health checks</span>
                    <span className="text-xs text-slate-900 font-semibold tabular-nums">12 active</span>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-sm text-slate-600 font-normal">SSL certificates</span>
                    <span className="text-xs text-slate-900 font-semibold tabular-nums">8 tracked</span>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-sm text-slate-600 font-normal">Port monitoring</span>
                    <span className="text-xs text-slate-900 font-semibold tabular-nums">6 ports</span>
                  </div>
                </div>
                <div className="mt-5 pt-5 border-t border-slate-100">
                  <div className="text-xs text-slate-500 font-normal">Total checks this month: <span className="font-semibold text-slate-900">847,234</span></div>
                </div>
              </div>
            }
          />
          </div>

          {/* For Founders */}
          <div id="usecases-for-founders">
            <UseCaseItem
            badge="For Founders"
            title="Foque no produto, não na infraestrutura"
            description="Você tem código para escrever e usuários para conquistar. Deixe que a gente cuide de avisar quando algo quebrar."
            features={[
              { 
                text: 'Setup em minutos.',
                highlight: 'Cole a URL, configure email e pronto.'
              },
              { 
                text: 'Plano FREE com até 3 monitores, checagens a cada 5 minutos e alertas ilimitados.',
              },
              { 
                text: 'Upgrade instantâneo',
                highlight: 'quando seu projeto crescer.'
              },
            ]}
            visual={
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-900 mb-0.5">meu-projeto.dev</div>
                    <div className="text-xs text-slate-500 font-normal">FREE plan • Checking every 5min</div>
                  </div>
                </div>
                <div className="mb-5">
                  <div className="h-12 bg-slate-50 rounded-xl border border-slate-100 flex items-end px-1.5 pb-1.5 gap-[3px]">
                    {Array.from({ length: 24 }).map((_, i) => {
                      const isUp = Math.random() > 0.05;
                      const height = isUp ? Math.random() * 40 + 50 : 20;
                      return (
                        <div
                          key={i}
                          className={`flex-1 rounded-sm ${isUp ? 'bg-slate-300' : 'bg-red-400'}`}
                          style={{ height: `${height}%`, minWidth: '2px' }}
                        />
                      );
                    })}
                  </div>
                  <div className="text-[10px] text-slate-500 font-normal mt-2 text-center">Last 24 hours</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center py-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-sm font-semibold text-slate-900 tabular-nums mb-0.5">99.6%</div>
                    <div className="text-[10px] text-slate-500 font-normal uppercase tracking-wider">Uptime</div>
                  </div>
                  <div className="text-center py-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-sm font-semibold text-slate-900 tabular-nums mb-0.5">143ms</div>
                    <div className="text-[10px] text-slate-500 font-normal uppercase tracking-wider">Avg Response</div>
                  </div>
                </div>
              </div>
            }
          />
          </div>

          {/* For Startups */}
          <div id="usecases-for-startups">
            <UseCaseItem
            badge="For Startups"
            title="Confiabilidade que impressiona investidores"
            description="Quando cada segundo de downtime pode custar um cliente ou uma rodada de investimento. Monitore, previna e comprove."
            features={[
              { 
                text: 'Alertas em cascata.',
                highlight: 'Email primeiro, Slack depois de 5min, PagerDuty se crítico.'
              },
              { 
                text: 'Monitore staging, production e DR simultaneamente com checagens a cada 60 segundos.',
              },
              { 
                text: 'Relatórios de SLA profissionais',
                highlight: 'para board meetings e due diligence.'
              },
            ]}
            visual={
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-xs font-mono font-semibold text-slate-700 px-2.5 py-1 bg-white rounded-lg border border-slate-200">if</div>
                    <div className="flex-1 text-xs text-slate-600 font-normal">
                      status code <span className="font-semibold text-slate-900">≠ 200</span> then
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 ml-8">
                    <div className="text-xs font-mono font-semibold text-slate-700 px-2.5 py-1 bg-white rounded-lg border border-slate-200">→</div>
                    <div className="flex-1 text-xs text-slate-600 font-normal">
                      send alert to <span className="font-semibold text-slate-900">Slack #incidents</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 ml-8">
                    <div className="text-xs font-mono font-semibold text-slate-700 px-2.5 py-1 bg-white rounded-lg border border-slate-200">→</div>
                    <div className="flex-1 text-xs text-slate-600 font-normal">
                      after <span className="font-semibold text-slate-900">5min</span> escalate to PagerDuty
                    </div>
                  </div>
                </div>
                <div className="pt-5 border-t border-slate-100">
                  <div className="text-[11px] text-slate-500 font-normal uppercase tracking-wider mb-2">Automation status</div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Alertas são automaticamente roteados para o canal certo no momento certo, mantendo sua equipe informada sem spam.
                  </p>
                </div>
              </div>
            }
          />
          </div>

          {/* For Enterprise */}
          <div id="usecases-for-enterprise">
            <UseCaseItem
            badge="For Enterprise"
            title="Decisões estratégicas em tempo real"
            description="Para quem não pode se dar ao luxo de descobrir problemas pelos clientes. Visibilidade total, controle absoluto."
            features={[
              { 
                text: 'Dashboard executivo.',
                highlight: 'Acompanhe health score de toda infraestrutura em tempo real.'
              },
              { 
                text: 'Multi-região e multi-cloud. Monitore AWS, GCP, Azure e on-premise simultaneamente.',
              },
              { 
                text: 'White-label completo e API enterprise',
                highlight: 'para integrar com DataDog, New Relic e ferramentas internas.'
              },
            ]}
            visual={
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs text-slate-500 font-normal">Infrastructure health score</div>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <div className="text-3xl font-semibold text-slate-900 tabular-nums">98.4%</div>
                    <div className="text-sm font-semibold text-green-600">+0.2%</div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 font-normal">
                    <div>43 monitores <span className="font-semibold text-slate-900">online</span></div>
                    <div>2 <span className="font-semibold text-orange-600">warning</span></div>
                  </div>
                </div>
                <div className="space-y-2 pt-5 border-t border-slate-100">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                      <span className="text-xs text-slate-600 font-normal">AWS us-east-1</span>
                    </div>
                    <span className="text-xs text-slate-900 font-semibold">99.9%</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                      <span className="text-xs text-slate-600 font-normal">GCP europe-west1</span>
                    </div>
                    <span className="text-xs text-slate-900 font-semibold">98.1%</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-xs text-slate-600 font-normal">On-premise DC</span>
                    </div>
                    <span className="text-xs text-slate-900 font-semibold">97.8%</span>
                  </div>
                </div>
              </div>
            }
          />
          </div>

        </div>
      </div>
    </section>
  );
}