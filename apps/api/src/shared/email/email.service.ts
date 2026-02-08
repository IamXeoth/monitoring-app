import { Resend } from 'resend';
import { EmailOptions, MonitorAlertEmail, DailyReportEmail } from './email.types';

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@thealert.io';
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || 'TheAlert';

class EmailService {
  /**
   * Envia email genérico
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await resend.emails.send({
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
   * Envia alerta de monitor DOWN
   */
  async sendMonitorDownAlert(email: string, data: MonitorAlertEmail): Promise<void> {
    const html = this.getMonitorDownTemplate(data);
    const text = `⚠️ ALERTA: ${data.monitorName} está DOWN!\n\nURL: ${data.monitorUrl}\nHorário: ${data.timestamp.toLocaleString('pt-BR')}\n\n${data.errorMessage || 'Sem detalhes do erro'}`;

    await this.sendEmail({
      to: email,
      subject: `🔴 ALERTA: ${data.monitorName} está DOWN`,
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
      subject: `🟢 RECUPERADO: ${data.monitorName} está UP`,
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
      subject: `📊 Relatório Diário - ${data.date.toLocaleDateString('pt-BR')}`,
      html,
      text,
    });
  }

  /**
   * Template HTML para alerta DOWN
   */
  private getMonitorDownTemplate(data: MonitorAlertEmail): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alerta de Monitor</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f2f1;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #18181B 0%, #27272a 100%); padding: 32px; text-align: center;">
              <div style="display: inline-flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <div style="width: 4px; height: 20px; background-color: #22c55e; border-radius: 2px;"></div>
                <div style="width: 4px; height: 20px; background-color: #22c55e; border-radius: 2px;"></div>
                <div style="width: 4px; height: 20px; background-color: #22c55e; border-radius: 2px;"></div>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">TheAlert</h1>
            </td>
          </tr>

          <!-- Alert Badge -->
          <tr>
            <td style="padding: 32px; text-align: center;">
              <div style="display: inline-block; background-color: #fef2f2; border: 2px solid #ef4444; border-radius: 12px; padding: 16px 24px;">
                <div style="font-size: 48px; margin-bottom: 8px;">🔴</div>
                <h2 style="margin: 0; color: #ef4444; font-size: 20px; font-weight: 600;">MONITOR DOWN</h2>
              </div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <p style="margin: 0 0 24px 0; color: #18181B; font-size: 16px; line-height: 1.5;">
                Olá <strong>${data.userName}</strong>,
              </p>
              <p style="margin: 0 0 24px 0; color: #18181B; font-size: 16px; line-height: 1.5;">
                Detectamos que seu monitor <strong>${data.monitorName}</strong> está fora do ar.
              </p>

              <!-- Monitor Details -->
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
                  <p style="margin: 0; color: #18181B; font-size: 14px; font-family: monospace; background-color: #ffffff; padding: 12px; border-radius: 6px;">
                    ${data.errorMessage}
                  </p>
                ` : ''}
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin-bottom: 24px;">
                <a href="https://thealert.io/dashboard" style="display: inline-block; background-color: #18181B; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 500; font-size: 16px;">
                  Ver Dashboard
                </a>
              </div>

              <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.5; text-align: center;">
                Estamos monitorando continuamente e você receberá uma notificação quando o serviço voltar ao normal.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">
                © ${new Date().getFullYear()} TheAlert. Monitoramento feito por brasileiros para brasileiros.
              </p>
              <p style="margin: 0; color: #64748b; font-size: 12px;">
                <a href="https://thealert.io" style="color: #22c55e; text-decoration: none;">thealert.io</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }

  /**
   * Template HTML para alerta UP (recuperação)
   */
  private getMonitorUpTemplate(data: MonitorAlertEmail): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Monitor Recuperado</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f2f1;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #18181B 0%, #27272a 100%); padding: 32px; text-align: center;">
              <div style="display: inline-flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <div style="width: 4px; height: 20px; background-color: #22c55e; border-radius: 2px;"></div>
                <div style="width: 4px; height: 20px; background-color: #22c55e; border-radius: 2px;"></div>
                <div style="width: 4px; height: 20px; background-color: #22c55e; border-radius: 2px;"></div>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">TheAlert</h1>
            </td>
          </tr>

          <!-- Success Badge -->
          <tr>
            <td style="padding: 32px; text-align: center;">
              <div style="display: inline-block; background-color: #f0fdf4; border: 2px solid #22c55e; border-radius: 12px; padding: 16px 24px;">
                <div style="font-size: 48px; margin-bottom: 8px;">🟢</div>
                <h2 style="margin: 0; color: #22c55e; font-size: 20px; font-weight: 600;">MONITOR RECUPERADO</h2>
              </div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <p style="margin: 0 0 24px 0; color: #18181B; font-size: 16px; line-height: 1.5;">
                Ótimas notícias, <strong>${data.userName}</strong>!
              </p>
              <p style="margin: 0 0 24px 0; color: #18181B; font-size: 16px; line-height: 1.5;">
                Seu monitor <strong>${data.monitorName}</strong> voltou a funcionar normalmente.
              </p>

              <!-- Monitor Details -->
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
                  <p style="margin: 0; color: #22c55e; font-size: 24px; font-weight: 600;">
                    ${data.responseTime}ms
                  </p>
                ` : ''}
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin-bottom: 24px;">
                <a href="https://thealert.io/dashboard" style="display: inline-block; background-color: #18181B; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 500; font-size: 16px;">
                  Ver Dashboard
                </a>
              </div>

              <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.5; text-align: center;">
                Continuamos monitorando 24/7 para garantir que tudo funcione perfeitamente.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">
                © ${new Date().getFullYear()} TheAlert. Monitoramento feito por brasileiros para brasileiros.
              </p>
              <p style="margin: 0; color: #64748b; font-size: 12px;">
                <a href="https://thealert.io" style="color: #22c55e; text-decoration: none;">thealert.io</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }

  /**
   * Template HTML para relatório diário
   */
  private getDailyReportTemplate(data: DailyReportEmail): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório Diário</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f2f1;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #18181B 0%, #27272a 100%); padding: 32px; text-align: center;">
              <div style="display: inline-flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                <div style="width: 4px; height: 20px; background-color: #22c55e; border-radius: 2px;"></div>
                <div style="width: 4px; height: 20px; background-color: #22c55e; border-radius: 2px;"></div>
                <div style="width: 4px; height: 20px; background-color: #22c55e; border-radius: 2px;"></div>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">TheAlert</h1>
              <p style="margin: 8px 0 0 0; color: #a1a1aa; font-size: 14px;">Relatório Diário</p>
            </td>
          </tr>

          <!-- Date -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; text-align: center;">
              <h2 style="margin: 0; color: #18181B; font-size: 20px; font-weight: 600;">
                ${data.date.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </h2>
            </td>
          </tr>

          <!-- Stats -->
          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="width: 33.33%; padding: 16px; text-align: center; background-color: #f8f9fa; border-radius: 8px;">
                    <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px; font-weight: 500;">TOTAL</p>
                    <p style="margin: 0; color: #18181B; font-size: 32px; font-weight: 700;">${data.totalMonitors}</p>
                  </td>
                  <td style="width: 8px;"></td>
                  <td style="width: 33.33%; padding: 16px; text-align: center; background-color: #f0fdf4; border-radius: 8px;">
                    <p style="margin: 0 0 8px 0; color: #22c55e; font-size: 14px; font-weight: 500;">ATIVOS</p>
                    <p style="margin: 0; color: #22c55e; font-size: 32px; font-weight: 700;">${data.upMonitors}</p>
                  </td>
                  <td style="width: 8px;"></td>
                  <td style="width: 33.33%; padding: 16px; text-align: center; background-color: #fef2f2; border-radius: 8px;">
                    <p style="margin: 0 0 8px 0; color: #ef4444; font-size: 14px; font-weight: 500;">INATIVOS</p>
                    <p style="margin: 0; color: #ef4444; font-size: 32px; font-weight: 700;">${data.downMonitors}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Uptime -->
          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); border-radius: 12px; padding: 24px; text-align: center;">
                <p style="margin: 0 0 8px 0; color: rgba(255, 255, 255, 0.9); font-size: 14px; font-weight: 500;">DISPONIBILIDADE MÉDIA</p>
                <p style="margin: 0; color: #ffffff; font-size: 48px; font-weight: 700;">${data.avgUptime.toFixed(1)}%</p>
              </div>
            </td>
          </tr>

          <!-- Monitors List -->
          ${data.monitors.length > 0 ? `
            <tr>
              <td style="padding: 0 32px 32px 32px;">
                <h3 style="margin: 0 0 16px 0; color: #18181B; font-size: 16px; font-weight: 600;">Seus Monitores</h3>
                ${data.monitors.map(monitor => `
                  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
                    <p style="margin: 0 0 8px 0; color: #18181B; font-size: 15px; font-weight: 500;">${monitor.name}</p>
                    <p style="margin: 0 0 12px 0; color: #64748b; font-size: 13px; word-break: break-all;">${monitor.url}</p>
                    <div style="display: flex; gap: 16px;">
                      <div>
                        <p style="margin: 0 0 4px 0; color: #64748b; font-size: 11px; font-weight: 500;">UPTIME</p>
                        <p style="margin: 0; color: ${monitor.uptime >= 99 ? '#22c55e' : monitor.uptime >= 95 ? '#f59e0b' : '#ef4444'}; font-size: 16px; font-weight: 600;">${monitor.uptime.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p style="margin: 0 0 4px 0; color: #64748b; font-size: 11px; font-weight: 500;">TEMPO MÉD.</p>
                        <p style="margin: 0; color: #18181B; font-size: 16px; font-weight: 600;">${monitor.avgResponseTime}ms</p>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </td>
            </tr>
          ` : ''}

          <!-- CTA -->
          <tr>
            <td style="padding: 0 32px 32px 32px; text-align: center;">
              <a href="https://thealert.io/dashboard" style="display: inline-block; background-color: #18181B; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 500; font-size: 16px;">
                Ver Dashboard Completo
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">
                © ${new Date().getFullYear()} TheAlert. Monitoramento feito por brasileiros para brasileiros.
              </p>
              <p style="margin: 0; color: #64748b; font-size: 12px;">
                <a href="https://thealert.io" style="color: #22c55e; text-decoration: none;">thealert.io</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }
}

export const emailService = new EmailService();