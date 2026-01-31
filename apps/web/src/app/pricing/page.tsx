'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PLANS } from '@/types/plan';
import { PlanCard } from '@/components/plan-card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';

export default function PricingPage() {
  const { user } = useAuth();
  const currentPlan = user?.subscription?.plan || 'FREE';

  const handleSelectPlan = (planId: string) => {
    if (planId === 'free') {
      // Redirecionar para registro
      window.location.href = '/register';
    } else {
      // Por enquanto, apenas mostrar mensagem
      alert('Planos pagos estarão disponíveis em breve! 🚀\n\nEstamos em beta fechado.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">M</span>
            </div>
            <span className="text-xl font-bold">Monitoring</span>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Entrar</Button>
                </Link>
                <Link href="/register">
                  <Button>Começar Grátis</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">
            Planos Simples e Transparentes
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Escolha o plano ideal para seu negócio. Todos os planos incluem alertas por email e suporte.
          </p>
          {user && (
            <p className="mt-4 text-sm text-muted-foreground">
              Seu plano atual: <span className="font-semibold text-foreground">{currentPlan}</span>
            </p>
          )}
        </div>
      </section>

      {/* Plans Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
            {PLANS.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onSelect={handleSelectPlan}
                currentPlan={currentPlan.toLowerCase()}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Perguntas Frequentes
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Posso mudar de plano a qualquer momento?</h3>
                <p className="text-muted-foreground">
                  Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. 
                  Mudanças entram em vigor imediatamente.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Como funciona o período de teste?</h3>
                <p className="text-muted-foreground">
                  Estamos em beta fechado. Por enquanto, todos os usuários têm acesso ao plano FREE. 
                  Planos pagos estarão disponíveis em breve.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Quais formas de pagamento são aceitas?</h3>
                <p className="text-muted-foreground">
                  Aceitaremos PIX, cartão de crédito e boleto bancário via Abacate Pay.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Posso cancelar a qualquer momento?</h3>
                <p className="text-muted-foreground">
                  Sim! Não há fidelidade. Você pode cancelar seu plano a qualquer momento e 
                  continuará tendo acesso até o final do período pago.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Pronto para monitorar seus sites?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Comece gratuitamente agora mesmo. Sem cartão de crédito necessário.
          </p>
          <Link href="/register">
            <Button size="lg" className="text-lg px-8 py-6">
              Começar Grátis Agora
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 Monitoring App. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                Termos de Uso
              </Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                Privacidade
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}