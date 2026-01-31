import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
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
          <h1>Política de Privacidade</h1>
          <p className="text-muted-foreground">Última atualização: 31 de janeiro de 2026</p>

          <h2>1. Informações que Coletamos</h2>
          
          <h3>1.1 Informações de Conta</h3>
          <p>
            Quando você cria uma conta, coletamos:
          </p>
          <ul>
            <li>Nome completo</li>
            <li>Endereço de email</li>
            <li>Senha (armazenada de forma criptografada)</li>
          </ul>

          <h3>1.2 Informações de Monitoramento</h3>
          <p>
            Para fornecer o serviço, coletamos:
          </p>
          <ul>
            <li>URLs dos sites que você monitora</li>
            <li>Resultados das checagens (status, tempo de resposta, etc.)</li>
            <li>Histórico de incidents</li>
          </ul>

          <h3>1.3 Informações de Uso</h3>
          <p>
            Coletamos automaticamente:
          </p>
          <ul>
            <li>Endereço IP</li>
            <li>Navegador e sistema operacional</li>
            <li>Páginas acessadas e ações realizadas</li>
            <li>Data e hora de acesso</li>
          </ul>

          <h2>2. Como Usamos suas Informações</h2>
          <p>
            Usamos suas informações para:
          </p>
          <ul>
            <li>Fornecer e melhorar nosso serviço</li>
            <li>Enviar alertas sobre o status de seus monitores</li>
            <li>Comunicar atualizações e mudanças no serviço</li>
            <li>Processar pagamentos</li>
            <li>Prevenir fraudes e abusos</li>
            <li>Cumprir obrigações legais</li>
          </ul>

          <h2>3. Compartilhamento de Informações</h2>
          <p>
            Não vendemos suas informações pessoais. Podemos compartilhar informações com:
          </p>
          <ul>
            <li><strong>Provedores de Serviço:</strong> Empresas que nos ajudam a operar o serviço 
            (hospedagem, email, pagamentos)</li>
            <li><strong>Requisitos Legais:</strong> Quando exigido por lei ou para proteger nossos direitos</li>
          </ul>

          <h2>4. Segurança</h2>
          <p>
            Implementamos medidas de segurança para proteger suas informações, incluindo:
          </p>
          <ul>
            <li>Criptografia de senhas</li>
            <li>Conexões HTTPS</li>
            <li>Acesso restrito aos dados</li>
            <li>Backups regulares</li>
          </ul>
          <p>
            No entanto, nenhum método de transmissão ou armazenamento é 100% seguro.
          </p>

          <h2>5. Cookies e Tecnologias Similares</h2>
          <p>
            Usamos cookies para:
          </p>
          <ul>
            <li>Manter você conectado</li>
            <li>Lembrar suas preferências</li>
            <li>Analisar o uso do serviço</li>
          </ul>
          <p>
            Você pode desabilitar cookies nas configurações do navegador, mas isso pode afetar o 
            funcionamento do serviço.
          </p>

          <h2>6. Seus Direitos</h2>
          <p>
            Você tem o direito de:
          </p>
          <ul>
            <li>Acessar suas informações pessoais</li>
            <li>Corrigir informações incorretas</li>
            <li>Solicitar a exclusão de sua conta e dados</li>
            <li>Exportar seus dados</li>
            <li>Optar por não receber emails promocionais</li>
          </ul>

          <h2>7. Retenção de Dados</h2>
          <p>
            Mantemos suas informações enquanto sua conta estiver ativa ou conforme necessário para 
            fornecer o serviço. Após a exclusão da conta, mantemos alguns dados por até 90 dias para 
            fins de backup e conformidade legal.
          </p>

          <h2>8. Transferência Internacional de Dados</h2>
          <p>
            Seus dados são armazenados em servidores no Brasil. Se você acessa o serviço de outro país, 
            suas informações podem ser transferidas internacionalmente.
          </p>

          <h2>9. Privacidade de Menores</h2>
          <p>
            Nosso serviço não é destinado a menores de 18 anos. Não coletamos intencionalmente informações 
            de menores.
          </p>

          <h2>10. Mudanças nesta Política</h2>
          <p>
            Podemos atualizar esta política periodicamente. Notificaremos você sobre mudanças significativas 
            por email ou através do serviço.
          </p>

          <h2>11. Contato</h2>
          <p>
            Para questões sobre privacidade, entre em contato:{' '}
            <a href="mailto:privacidade@monitoring.app" className="text-primary hover:underline">
              privacidade@monitoring.app
            </a>
          </p>

          <h2>12. LGPD - Lei Geral de Proteção de Dados</h2>
          <p>
            Estamos comprometidos em cumprir a LGPD e proteger seus dados pessoais conforme estabelecido 
            pela legislação brasileira.
          </p>
        </div>
      </div>
    </div>
  );
}