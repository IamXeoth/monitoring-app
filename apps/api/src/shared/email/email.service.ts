import { Resend } from 'resend';
import { EmailOptions, MonitorAlertEmail, DailyReportEmail } from './email.types';

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@thealert.io';
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || 'TheAlert';

export class EmailService {
  /**
   * Envia email genérico
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const result = await resend.emails.send({
        from: `${EMAIL_FROM_NAME} <${EMAIL_FROM}>`,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      console.log(`✅ Email enviado: ${options.subject} → ${options.to}`);
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);
      throw error;
    }
  }

  /**
   * Envia email de teste
   */
  async sendTestEmail(to: string): Promise<boolean> {
    try {
      await this.sendEmail({
        to,
        subject: '������ Email de teste - TheAlert',
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Email de teste do TheAlert</h2>
            <p>Se você está vendo este email, a configuração está funcionando corretamente!</p>
            <p>Data do teste: ${new Date().toLocaleString('pt-BR')}</p>
          </div>
        `,
        text: `Email de teste do TheAlert. Data: ${new Date().toLocaleString('pt-BR')}`,
      });
      return true;
    } catch (error) {
      console.error('Erro ao enviar email de teste:', error);
      return false;
    }
  }

  /**
   * Envia alerta de monitor DOWN
   */
  async sendMonitorDownAlert(email: string, data: MonitorAlertEmail): Promise<void> {
    const html = this.getMonitorDownTemplate(data);
    const text = `⚠️ ALERTA: ${data.monitorName} está DOWN!\n\nURL: ${data.monitorUrl}\nHorário: ${data.timestamp.toLocaleString('pt-BR')}\n\n${data.errorMessage || 'Sem detalhes do erro'}`;

    await this.sendEmail({
      to: email,
      subject: `������ ALERTA: ${data.monitorName} está DOWN`,
      html,
      text,
    });
  }

  /**
   * Envia alerta de monitor UP (recuperação)
   */
  async sendMonitorUpAlert(email: string, data: MonitorAlertEmail): Promise<void> {
    const html = this.getMonitorUpTemplate(data);
    const text = `✅ RECUPERADO: ${data.monitorName} voltou ao normal!\n\nURL: ${data.monitorUrl}\nHorário: ${data.timestamp.toLocaleString('pt-BR')}\nTempo de resposta: ${data.responseTime}ms`;

    await this.sendEmail({
      to: email,
      subject: `������ RECUPERADO: ${data.monitorName} está UP`,
      html,
      text,
    });
  }

  /**
   * Envia relatório diário
   */
  async sendDailyReport(email: string, data: DailyReportEmail): Promise<void> {
    const html = this.getDailyReportTemplate(data);
    const text = `Relatório Diário - ${data.date.toLocaleDateString('pt-BR')}\n\nTotal de Monitores: ${data.totalMonitors}\nAtivos: ${data.upMonitors}\nInativos: ${data.downMonitors}\nDisponibilidade Média: ${data.avgUptime.toFixed(1)}%`;

    await this.sendEmail({
      to: email,
      subject: `������ Relatório Diário - ${data.date.toLocaleDateString('pt-BR')}`,
      html,
      text,
    });
  }

  private getMonitorDownTemplate(data: MonitorAlertEmail): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f2f1;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #18181B 0%, #27272a 100%); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">TheAlert</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px; text-align: center;">
              <div style="display: inline-block; background-color: #fef2f2; border: 2px solid #ef4444; border-radius: 12px; padding: 16px 24px;">
                <h2 style="margin: 0; color: #ef4444; font-size: 20px; font-weight: 600;">������ MONITOR DOWN</h2>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <p style="margin: 0 0 24px 0; color: #18181B; font-size: 16px;">Olá <strong>${data.userName}</strong>,</p>
              <p style="margin: 0 0 24px 0; color: #18181B; font-size: 16px;">Detectamos que seu monitor <strong>${data.monitorName}</strong> está fora do ar.</p>
              <div style="background-color: #f8f9fa; border-left: 4px solid #ef4444; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <p style="margin: 0 0 12px 0; color: #64748b; font-size: 14px; font-weight: 500;">URL MONITORADA</p>
                <p style="margin: 0 0 16px 0; color: #18181B; font-size: 16px; word-break: break-all;">
                  <a href="${data.monitorUrl}" style="color: #22c55e; text-decoration: none;">${data.monitorUrl}</a>
                </p>
                <p style="margin: 0 0 12px 0; color: #64748b; font-size: 14px; font-weight: 500;">HORÁRIO</p>
                <p style="margin: 0 0 16px 0; color: #18181B; font-size: 16px;">
                  ${data.timestamp.toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })}
                </p>
                ${data.errorMessage ? `
                  <p style="margin: 0 0 12px 0; color: #64748b; font-size: 14px; font-weight: 500;">ERRO</p>
                  <p style="margin: 0; color: #18181B; font-size: 14px; font-family: monospace; background-color: #ffffff; padding: 12px; border-radius: 6px;">${data.errorMessage}</p>
                ` : ''}
              </div>
              <div style="text-align: center; margin-bottom: 24px;">
                <a href="https://thealert.io/dashboard" style="display: inline-block; background-color: #18181B; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 500; font-size: 16px;">Ver Dashboard</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8f9fa; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #64748b; font-size: 14px;">© ${new Date().getFullYear()} TheAlert</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  private getMonitorUpTemplate(data: MonitorAlertEmail): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f2f1;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #18181B 0%, #27272a 100%); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">TheAlert</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px; text-align: center;">
              <div style="display: inline-block; background-color: #f0fdf4; border: 2px solid #22c55e; border-radius: 12px; padding: 16px 24px;">
                <h2 style="margin: 0; color: #22c55e; font-size: 20px; font-weight: 600;">������ MONITOR RECUPERADO</h2>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <p style="margin: 0 0 24px 0; color: #18181B; font-size: 16px;">Ótimas notícias, <strong>${data.userName}</strong>!</p>
              <p style="margin: 0 0 24px 0; color: #18181B; font-size: 16px;">Seu monitor <strong>${data.monitorName}</strong> voltou a funcionar normalmente.</p>
              <div style="background-color: #f8f9fa; border-left: 4px solid #22c55e; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <p style="margin: 0 0 12px 0; color: #64748b; font-size: 14px; font-weight: 500;">URL MONITORADA</p>
                <p style="margin: 0 0 16px 0; color: #18181B; font-size: 16px; word-break: break-all;">
                  <a href="${data.monitorUrl}" style="color: #22c55e; text-decoration: none;">${data.monitorUrl}</a>
                </p>
                <p style="margin: 0 0 12px 0; color: #64748b; font-size: 14px; font-weight: 500;">RECUPERADO ÀS</p>
                <p style="margin: 0 0 16px 0; color: #18181B; font-size: 16px;">
                  ${data.timestamp.toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })}
                </p>
                ${data.responseTime ? `
                  <p style="margin: 0 0 12px 0; color: #64748b; font-size: 14px; font-weight: 500;">TEMPO DE RESPOSTA</p>
                  <p style="margin: 0; color: #22c55e; font-size: 24px; font-weight: 600;">${data.responseTime}ms</p>
                ` : ''}
              </div>
              <div style="text-align: center; margin-bottom: 24px;">
                <a href="https://thealert.io/dashboard" style="display: inline-block; background-color: #18181B; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 500; font-size: 16px;">Ver Dashboard</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8f9fa; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #64748b; font-size: 14px;">© ${new Date().getFullYear()} TheAlert</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  private getDailyReportTemplate(data: DailyReportEmail): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f2f1;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #18181B 0%, #27272a 100%); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">TheAlert</h1>
              <p style="margin: 8px 0 0 0; color: #a1a1aa; font-size: 14px;">Relatório Diário</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 32px 24px 32px; text-align: center;">
              <h2 style="margin: 0; color: #18181B; font-size: 20px; font-weight: 600;">
                ${data.date.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">DISPONIBILIDADE MÉDIA</p>
                <p style="margin: 0; color: #ffffff; font-size: 48px; font-weight: 700;">${data.avgUptime.toFixed(1)}%</p>
              </div>
              <p style="margin: 0; color: #64748b; font-size: 14px; text-align: center;">
                Total: ${data.totalMonitors} monitores | Ativos: ${data.upMonitors} | Inativos: ${data.downMonitors}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 32px 32px; text-align: center;">
              <a href="https://thealert.io/dashboard" style="display: inline-block; background-color: #18181B; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 500; font-size: 16px;">Ver Dashboard</a>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8f9fa; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #64748b; font-size: 14px;">© ${new Date().getFullYear()} TheAlert</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }
}

export const emailService = new EmailService();