import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">M</span>
            </div>
            <span className="text-xl font-bold">Monitoring</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/#features" className="text-sm font-medium hover:text-primary">
              Recursos
            </Link>
            <Link href="/pricing" className="text-sm font-medium hover:text-primary">
              Preços
            </Link>
            <Link href="/#faq" className="text-sm font-medium hover:text-primary">
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button>Começar Grátis</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block">
              <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                🚀 Beta Fechado - Vagas Limitadas
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Monitore seus sites com{' '}
              <span className="text-primary">simplicidade</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Sistema brasileiro de monitoramento de uptime. Alertas instantâneos, preços justos em real, 
              sem surpresas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8 py-6">
                  Começar Grátis Agora
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Ver Planos
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              ✓ Sem cartão de crédito • ✓ Setup em 2 minutos • ✓ Cancele quando quiser
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Tudo que você precisa para monitorar
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Recursos poderosos em uma interface simples e intuitiva
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 text-4xl">⚡</div>
                <h3 className="text-xl font-semibold mb-2">Monitoramento em Tempo Real</h3>
                <p className="text-muted-foreground">
                  Checagens automáticas a cada 30 segundos até 5 minutos, dependendo do seu plano.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 text-4xl">📧</div>
                <h3 className="text-xl font-semibold mb-2">Alertas Instantâneos</h3>
                <p className="text-muted-foreground">
                  Receba emails imediatos quando seu site cair ou voltar ao normal.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 text-4xl">📊</div>
                <h3 className="text-xl font-semibold mb-2">Estatísticas Detalhadas</h3>
                <p className="text-muted-foreground">
                  Uptime, tempo de resposta, histórico completo de incidents e muito mais.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 text-4xl">🇧🇷</div>
                <h3 className="text-xl font-semibold mb-2">100% Brasileiro</h3>
                <p className="text-muted-foreground">
                  Preços em real, suporte em português, pagamento via PIX. Feito para brasileiros.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 text-4xl">🔒</div>
                <h3 className="text-xl font-semibold mb-2">Múltiplos Protocolos</h3>
                <p className="text-muted-foreground">
                  Monitore HTTP, HTTPS, certificados SSL, domínios e muito mais.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 text-4xl">💰</div>
                <h3 className="text-xl font-semibold mb-2">Preço Justo</h3>
                <p className="text-muted-foreground">
                  Planos acessíveis para todos os tamanhos de negócio. Comece grátis.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Como funciona?
            </h2>
            <p className="text-xl text-muted-foreground">
              Setup simples em 3 passos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl font-bold text-primary mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold">Crie sua conta</h3>
              <p className="text-muted-foreground">
                Cadastro rápido e gratuito. Sem cartão de crédito necessário.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl font-bold text-primary mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold">Adicione seus sites</h3>
              <p className="text-muted-foreground">
                Configure os monitores com a URL e frequência desejada.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl font-bold text-primary mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold">Relaxe</h3>
              <p className="text-muted-foreground">
                Nós monitoramos 24/7 e te avisamos se algo der errado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Planos para todos os tamanhos
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Do freelancer ao enterprise. Comece grátis e escale conforme cresce.
          </p>
          <Link href="/pricing">
            <Button size="lg" className="text-lg px-8 py-6">
              Ver Todos os Planos
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">
              Perguntas Frequentes
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Preciso de cartão de crédito para começar?
                </h3>
                <p className="text-muted-foreground">
                  Não! O plano FREE é totalmente gratuito e não requer cartão de crédito. 
                  Você pode começar a monitorar seus sites imediatamente.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Como funcionam os alertas?
                </h3>
                <p className="text-muted-foreground">
                  Quando detectamos que seu site está fora do ar, enviamos um email imediatamente. 
                  Quando volta ao normal, enviamos outro email confirmando.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Posso monitorar sites internos/localhost?
                </h3>
                <p className="text-muted-foreground">
                  Por enquanto, apenas sites públicos acessíveis pela internet. 
                  Monitoramento de redes privadas está no roadmap.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Qual a diferença entre os planos?
                </h3>
                <p className="text-muted-foreground">
                  A principal diferença é a quantidade de monitores e a frequência de checagem. 
                  Planos maiores também incluem features avançadas como API, relatórios e páginas de status.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Junte-se aos desenvolvedores e empresas que confiam no Monitoring App
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Criar Conta Grátis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <span className="text-lg font-bold text-primary-foreground">M</span>
                </div>
                <span className="text-xl font-bold">Monitoring</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Sistema brasileiro de monitoramento de uptime. Simples, confiável e acessível.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/#features" className="hover:text-foreground">Recursos</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground">Preços</Link></li>
                <li><Link href="/#faq" className="hover:text-foreground">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/terms" className="hover:text-foreground">Termos de Uso</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground">Privacidade</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contato</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>suporte@monitoring.app</li>
                <li>🇧🇷 Feito no Brasil</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <p className="text-center text-sm text-muted-foreground">
              © 2026 Monitoring App. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}