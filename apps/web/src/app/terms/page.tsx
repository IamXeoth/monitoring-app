import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
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
          <Link href="/">
            <Button variant="ghost">← Voltar</Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
          <h1>Termos de Uso</h1>
          <p className="text-muted-foreground">Última atualização: 31 de janeiro de 2026</p>

          <h2>1. Aceitação dos Termos</h2>
          <p>
            Ao acessar e usar o Monitoring App, você aceita e concorda em estar vinculado aos termos e 
            condições aqui estabelecidos. Se você não concorda com estes termos, não use nosso serviço.
          </p>

          <h2>2. Descrição do Serviço</h2>
          <p>
            O Monitoring App é um serviço de monitoramento de uptime que verifica a disponibilidade de 
            sites e serviços online e envia alertas quando detecta problemas.
          </p>

          <h2>3. Cadastro e Conta</h2>
          <p>
            Para usar o serviço, você deve criar uma conta fornecendo informações verdadeiras e completas. 
            Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que 
            ocorrem sob sua conta.
          </p>

          <h2>4. Planos e Pagamentos</h2>
          <p>
            Oferecemos um plano gratuito com recursos limitados e planos pagos com recursos adicionais. 
            Os preços estão especificados na página de preços. Você pode cancelar sua assinatura a qualquer 
            momento.
          </p>

          <h2>5. Uso Aceitável</h2>
          <p>Você concorda em não:</p>
          <ul>
            <li>Usar o serviço para fins ilegais ou não autorizados</li>
            <li>Tentar acessar áreas restritas do sistema</li>
            <li>Interferir ou interromper o serviço</li>
            <li>Usar o serviço para enviar spam ou conteúdo malicioso</li>
            <li>Fazer engenharia reversa do serviço</li>
          </ul>

          <h2>6. Limitação de Responsabilidade</h2>
          <p>
            O serviço é fornecido "como está" sem garantias de qualquer tipo. Não garantimos que o serviço 
            será ininterrupto ou livre de erros. Não somos responsáveis por quaisquer danos decorrentes do 
            uso ou incapacidade de usar o serviço.
          </p>

          <h2>7. Privacidade</h2>
          <p>
            Sua privacidade é importante para nós. Consulte nossa{' '}
            <Link href="/privacy" className="text-primary hover:underline">
              Política de Privacidade
            </Link>{' '}
            para entender como coletamos, usamos e protegemos suas informações.
          </p>

          <h2>8. Modificações dos Termos</h2>
          <p>
            Reservamos o direito de modificar estes termos a qualquer momento. Notificaremos você sobre 
            mudanças significativas por email ou através do serviço.
          </p>

          <h2>9. Cancelamento</h2>
          <p>
            Você pode cancelar sua conta a qualquer momento através das configurações. Reservamos o direito 
            de suspender ou encerrar contas que violem estes termos.
          </p>

          <h2>10. Lei Aplicável</h2>
          <p>
            Estes termos são regidos pelas leis do Brasil. Quaisquer disputas serão resolvidas nos 
            tribunais brasileiros.
          </p>

          <h2>11. Contato</h2>
          <p>
            Se você tiver dúvidas sobre estes termos, entre em contato conosco em:{' '}
            <a href="mailto:suporte@monitoring.app" className="text-primary hover:underline">
              suporte@monitoring.app
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}