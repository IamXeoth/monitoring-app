import { Resend } from 'resend';
import { EmailOptions, MonitorAlertEmail, DailyReportEmail } from './email.types';

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@thealert.io';
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || 'TheAlert';

// ─── Shared design tokens ────────────────────────────────────────────────────
const COLORS = {
  bg: '#0a0a0a',
  surface: '#111111',
  surfaceElevated: '#1a1a1a',
  border: '#222222',
  borderSubtle: '#1c1c1c',
  text: '#e4e4e7',
  textMuted: '#71717a',
  textDim: '#3f3f46',
  green: '#22c55e',
  greenDim: '#166534',
  greenSubtle: '#052e16',
  red: '#ef4444',
  redDim: '#991b1b',
  redSubtle: '#2d0909',
  white: '#ffffff',
};

const baseStyles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background-color: ${COLORS.bg}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-text-size-adjust: 100%; }
`;

// ─── Base layout wrapper ─────────────────────────────────────────────────────
function wrapLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <style>${baseStyles}</style>
</head>
<body style="background-color: ${COLORS.bg}; margin: 0; padding: 0;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${COLORS.bg}; min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 48px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; width: 100%;">

          <!-- HEADER -->
          <tr>
            <td style="padding-bottom: 32px; text-align: center;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td style="padding-right: 10px; vertical-align: middle;">
                    <!-- Logo: três barras -->
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="height: 3px; width: 20px; background-color: ${COLORS.green}; border-radius: 2px; display: block;"></td>
                      </tr>
                      <tr><td style="height: 3px;"></td></tr>
                      <tr>
                        <td style="height: 3px; width: 14px; background-color: ${COLORS.text}; border-radius: 2px; display: block; opacity: 0.6;"></td>
                      </tr>
                      <tr><td style="height: 3px;"></td></tr>
                      <tr>
                        <td style="height: 3px; width: 8px; background-color: ${COLORS.text}; border-radius: 2px; display: block; opacity: 0.3;"></td>
                      </tr>
                    </table>
                  </td>
                  <td style="vertical-align: middle;">
                    <span style="color: ${COLORS.white}; font-size: 18px; font-weight: 600; letter-spacing: -0.3px;">TheAlert</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CARD BODY -->
          <tr>
            <td style="background-color: ${COLORS.surface}; border: 1px solid ${COLORS.border}; border-radius: 12px; overflow: hidden;">
              ${content}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding-top: 28px; text-align: center;">
              <p style="color: ${COLORS.textDim}; font-size: 12px; line-height: 1.6;">
                Enviado por TheAlert &mdash; Monitoramento de Uptime<br>
                <a href="https://thealert.io/dashboard" style="color: ${COLORS.textMuted}; text-decoration: none;">Dashboard</a>
                &nbsp;&middot;&nbsp;
                <a href="https://thealert.io/settings/notifications" style="color: ${COLORS.textMuted}; text-decoration: none;">Gerenciar alertas</a>
                &nbsp;&middot;&nbsp;
                <a href="https://thealert.io/unsubscribe" style="color: ${COLORS.textMuted}; text-decoration: none;">Cancelar</a>
              </p>
              <p style="color: ${COLORS.textDim}; font-size: 11px; margin-top: 12px;">&copy; ${new Date().getFullYear()} TheAlert. Todos os direitos reservados.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Status badge row ────────────────────────────────────────────────────────
function statusBadge(type: 'DOWN' | 'UP' | 'REPORT'): string {
  const configs = {
    DOWN: { dot: COLORS.red, label: 'MONITOR OFFLINE', bg: COLORS.redSubtle, border: COLORS.redDim },
    UP: { dot: COLORS.green, label: 'MONITOR ONLINE', bg: COLORS.greenSubtle, border: COLORS.greenDim },
    REPORT: { dot: '#a78bfa', label: 'RELATÓRIO DIÁRIO', bg: '#1a0a2e', border: '#4c1d95' },
  };
  const c = configs[type];

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
      <tr>
        <td style="background-color: ${c.bg}; border: 1px solid ${c.border}; border-radius: 6px; padding: 6px 14px;">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="width: 6px; height: 6px; background-color: ${c.dot}; border-radius: 50%; vertical-align: middle;"></td>
              <td style="width: 8px;"></td>
              <td style="color: ${c.dot}; font-size: 11px; font-weight: 600; letter-spacing: 1px; vertical-align: middle;">${c.label}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

// ─── Info row inside card ─────────────────────────────────────────────────────
function infoRow(label: string, value: string, last = false): string {
  return `
    <tr>
      <td style="padding: 14px 0; border-bottom: ${last ? 'none' : `1px solid ${COLORS.borderSubtle}`};">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="color: ${COLORS.textMuted}; font-size: 12px; font-weight: 500; letter-spacing: 0.3px; vertical-align: top; width: 40%;">${label}</td>
            <td style="color: ${COLORS.text}; font-size: 13px; vertical-align: top; text-align: right;">${value}</td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

export class EmailService {
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

      console.log(`[Email] Enviado: "${options.subject}" -> ${options.to}`);
    } catch (error) {
      console.error('[Email] Erro ao enviar:', error);
      throw error;
    }
  }

  /**
   * Envia email de teste
   */
  async sendTestEmail(to: string): Promise<boolean> {
    try {
      const html = wrapLayout(`
        <td style="padding: 40px 36px; text-align: center;">
          ${statusBadge('REPORT')}
          <h2 style="color: ${COLORS.text}; font-size: 20px; font-weight: 500; margin-top: 24px; letter-spacing: -0.3px;">Email de Teste</h2>
          <p style="color: ${COLORS.textMuted}; font-size: 14px; line-height: 1.7; margin-top: 12px;">
            As notificações do TheAlert estão configuradas corretamente. Você receberá alertas neste endereço quando seus monitores mudarem de status.
          </p>
          <p style="color: ${COLORS.textDim}; font-size: 12px; margin-top: 20px;">
            ${new Date().toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })}
          </p>
        </td>
      `);

      await this.sendEmail({
        to,
        subject: 'TheAlert — Configuracao de email confirmada',
        html,
        text: `TheAlert — Email de teste\n\nSuas notificacoes estao configuradas corretamente.\n\nData: ${new Date().toLocaleString('pt-BR')}`,
      });
      return true;
    } catch (error) {
      console.error('[Email] Erro no email de teste:', error);
      return false;
    }
  }

  /**
   * Envia alerta de monitor DOWN
   */
  async sendMonitorDownAlert(email: string, data: MonitorAlertEmail): Promise<void> {
    const timestamp = data.timestamp.toLocaleString('pt-BR', {
      weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

    const html = wrapLayout(`
      <!-- Status badge -->
      <tr>
        <td style="padding: 32px 36px 0 36px; text-align: center;">
          ${statusBadge('DOWN')}
        </td>
      </tr>

      <!-- Title -->
      <tr>
        <td style="padding: 24px 36px 0 36px; text-align: center;">
          <h1 style="color: ${COLORS.white}; font-size: 22px; font-weight: 500; letter-spacing: -0.4px; line-height: 1.3;">
            ${data.monitorName}
          </h1>
          <p style="color: ${COLORS.textMuted}; font-size: 13px; margin-top: 6px;">está fora do ar e requer sua atenção</p>
        </td>
      </tr>

      <!-- Divider -->
      <tr>
        <td style="padding: 24px 36px 0 36px;">
          <div style="height: 1px; background-color: ${COLORS.border};"></div>
        </td>
      </tr>

      <!-- Info table -->
      <tr>
        <td style="padding: 8px 36px 8px 36px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            ${infoRow('URL', `<a href="${data.monitorUrl}" style="color: ${COLORS.textMuted}; text-decoration: none; font-family: 'SFMono-Regular', Consolas, monospace; font-size: 12px;">${data.monitorUrl}</a>`)}
            ${infoRow('Detectado em', timestamp)}
            ${data.errorMessage
              ? infoRow('Erro', `<span style="font-family: 'SFMono-Regular', Consolas, monospace; font-size: 12px; color: ${COLORS.red};">${data.errorMessage}</span>`, true)
              : infoRow('Status HTTP', `<span style="color: ${COLORS.red};">Sem resposta</span>`, true)
            }
          </table>
        </td>
      </tr>

      <!-- Divider -->
      <tr>
        <td style="padding: 0 36px;">
          <div style="height: 1px; background-color: ${COLORS.border};"></div>
        </td>
      </tr>

      <!-- CTA -->
      <tr>
        <td style="padding: 28px 36px 32px 36px; text-align: center;">
          <a href="https://thealert.io/dashboard"
             style="display: inline-block; background-color: ${COLORS.surfaceElevated}; color: ${COLORS.text}; text-decoration: none; padding: 11px 28px; border-radius: 8px; font-size: 13px; font-weight: 500; border: 1px solid ${COLORS.border}; letter-spacing: 0.1px;">
            Ver no Dashboard
          </a>
          <p style="color: ${COLORS.textDim}; font-size: 11px; margin-top: 16px; line-height: 1.5;">
            Olá, ${data.userName}. Avisaremos quando o monitor se recuperar.
          </p>
        </td>
      </tr>
    `);

    await this.sendEmail({
      to: email,
      subject: `[OFFLINE] ${data.monitorName} esta fora do ar`,
      html,
      text: `[OFFLINE] ${data.monitorName}\n\nURL: ${data.monitorUrl}\nDetectado em: ${timestamp}\n${data.errorMessage ? `Erro: ${data.errorMessage}` : ''}\n\nAcesse o dashboard: https://thealert.io/dashboard`,
    });
  }

  /**
   * Envia alerta de monitor UP (recuperação)
   */
  async sendMonitorUpAlert(email: string, data: MonitorAlertEmail): Promise<void> {
    const timestamp = data.timestamp.toLocaleString('pt-BR', {
      weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

    const html = wrapLayout(`
      <!-- Status badge -->
      <tr>
        <td style="padding: 32px 36px 0 36px; text-align: center;">
          ${statusBadge('UP')}
        </td>
      </tr>

      <!-- Title -->
      <tr>
        <td style="padding: 24px 36px 0 36px; text-align: center;">
          <h1 style="color: ${COLORS.white}; font-size: 22px; font-weight: 500; letter-spacing: -0.4px; line-height: 1.3;">
            ${data.monitorName}
          </h1>
          <p style="color: ${COLORS.textMuted}; font-size: 13px; margin-top: 6px;">voltou a funcionar normalmente</p>
        </td>
      </tr>

      <!-- Divider -->
      <tr>
        <td style="padding: 24px 36px 0 36px;">
          <div style="height: 1px; background-color: ${COLORS.border};"></div>
        </td>
      </tr>

      <!-- Info table -->
      <tr>
        <td style="padding: 8px 36px 8px 36px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            ${infoRow('URL', `<a href="${data.monitorUrl}" style="color: ${COLORS.textMuted}; text-decoration: none; font-family: 'SFMono-Regular', Consolas, monospace; font-size: 12px;">${data.monitorUrl}</a>`)}
            ${infoRow('Recuperado em', timestamp)}
            ${data.responseTime !== undefined
              ? infoRow('Tempo de resposta', `<span style="color: ${COLORS.green}; font-weight: 600;">${data.responseTime}ms</span>`, true)
              : ''
            }
          </table>
        </td>
      </tr>

      <!-- Divider -->
      <tr>
        <td style="padding: 0 36px;">
          <div style="height: 1px; background-color: ${COLORS.border};"></div>
        </td>
      </tr>

      <!-- CTA -->
      <tr>
        <td style="padding: 28px 36px 32px 36px; text-align: center;">
          <a href="https://thealert.io/dashboard"
             style="display: inline-block; background-color: ${COLORS.surfaceElevated}; color: ${COLORS.text}; text-decoration: none; padding: 11px 28px; border-radius: 8px; font-size: 13px; font-weight: 500; border: 1px solid ${COLORS.border}; letter-spacing: 0.1px;">
            Ver no Dashboard
          </a>
          <p style="color: ${COLORS.textDim}; font-size: 11px; margin-top: 16px; line-height: 1.5;">
            Olá, ${data.userName}. Tudo voltou ao normal.
          </p>
        </td>
      </tr>
    `);

    await this.sendEmail({
      to: email,
      subject: `[ONLINE] ${data.monitorName} esta de volta`,
      html,
      text: `[ONLINE] ${data.monitorName}\n\nURL: ${data.monitorUrl}\nRecuperado em: ${timestamp}\n${data.responseTime ? `Tempo de resposta: ${data.responseTime}ms` : ''}\n\nAcesse o dashboard: https://thealert.io/dashboard`,
    });
  }

  /**
   * Envia relatório diário
   */
  async sendDailyReport(email: string, data: DailyReportEmail): Promise<void> {
    const dateFormatted = data.date.toLocaleDateString('pt-BR', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
    });

    const uptimeColor = data.avgUptime >= 99 ? COLORS.green : data.avgUptime >= 95 ? '#f59e0b' : COLORS.red;

    const monitorsRows = data.monitors
      ? data.monitors.map((m, i) => {
          const isLast = i === data.monitors!.length - 1;
          const statusColor = m.status === 'DOWN' ? COLORS.red : COLORS.green;
          const statusLabel = m.status === 'DOWN' ? 'OFFLINE' : 'ONLINE';
          return `
            <tr>
              <td style="padding: 12px 0; border-bottom: ${isLast ? 'none' : `1px solid ${COLORS.borderSubtle}`};">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="vertical-align: middle;">
                      <p style="color: ${COLORS.text}; font-size: 13px; font-weight: 500;">${m.name}</p>
                      <p style="color: ${COLORS.textDim}; font-size: 11px; margin-top: 2px; font-family: 'SFMono-Regular', Consolas, monospace;">${m.url}</p>
                    </td>
                    <td style="vertical-align: middle; text-align: right; white-space: nowrap; padding-left: 12px;">
                      <p style="color: ${uptimeColor}; font-size: 13px; font-weight: 600;">${m.uptime.toFixed(1)}%</p>
                      <p style="color: ${COLORS.textMuted}; font-size: 11px; margin-top: 2px;">${m.avgResponseTime}ms</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          `;
        }).join('')
      : '';

    const html = wrapLayout(`
      <!-- Status badge -->
      <tr>
        <td style="padding: 32px 36px 0 36px; text-align: center;">
          ${statusBadge('REPORT')}
        </td>
      </tr>

      <!-- Title -->
      <tr>
        <td style="padding: 24px 36px 0 36px; text-align: center;">
          <h1 style="color: ${COLORS.white}; font-size: 20px; font-weight: 500; letter-spacing: -0.3px;">Resumo do dia</h1>
          <p style="color: ${COLORS.textMuted}; font-size: 13px; margin-top: 6px; text-transform: capitalize;">${dateFormatted}</p>
        </td>
      </tr>

      <!-- Divider -->
      <tr>
        <td style="padding: 24px 36px 0 36px;">
          <div style="height: 1px; background-color: ${COLORS.border};"></div>
        </td>
      </tr>

      <!-- Uptime stat destaque -->
      <tr>
        <td style="padding: 28px 36px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="text-align: center; background-color: ${COLORS.surfaceElevated}; border: 1px solid ${COLORS.border}; border-radius: 10px; padding: 24px;">
                <p style="color: ${COLORS.textMuted}; font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">Disponibilidade Média</p>
                <p style="color: ${uptimeColor}; font-size: 48px; font-weight: 700; letter-spacing: -2px; margin-top: 8px; line-height: 1;">${data.avgUptime.toFixed(1)}%</p>
                <p style="color: ${COLORS.textDim}; font-size: 12px; margin-top: 10px;">
                  ${data.upMonitors} online &nbsp;&middot;&nbsp; ${data.downMonitors} offline &nbsp;&middot;&nbsp; ${data.totalMonitors} total
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      ${data.monitors && data.monitors.length > 0 ? `
        <!-- Monitor list -->
        <tr>
          <td style="padding: 0 36px;">
            <p style="color: ${COLORS.textMuted}; font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px;">Monitores</p>
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
              ${monitorsRows}
            </table>
          </td>
        </tr>

        <!-- Divider -->
        <tr>
          <td style="padding: 20px 36px 0 36px;">
            <div style="height: 1px; background-color: ${COLORS.border};"></div>
          </td>
        </tr>
      ` : ''}

      <!-- CTA -->
      <tr>
        <td style="padding: 28px 36px 32px 36px; text-align: center;">
          <a href="https://thealert.io/dashboard"
             style="display: inline-block; background-color: ${COLORS.surfaceElevated}; color: ${COLORS.text}; text-decoration: none; padding: 11px 28px; border-radius: 8px; font-size: 13px; font-weight: 500; border: 1px solid ${COLORS.border}; letter-spacing: 0.1px;">
            Ver relatório completo
          </a>
          <p style="color: ${COLORS.textDim}; font-size: 11px; margin-top: 16px;">
            Olá, ${data.userName}. Este relatório é enviado diariamente.
          </p>
        </td>
      </tr>
    `);

    await this.sendEmail({
      to: email,
      subject: `TheAlert — Resumo diario: ${data.avgUptime.toFixed(1)}% uptime`,
      html,
      text: `TheAlert — Resumo Diario\n${dateFormatted}\n\nDisponibilidade media: ${data.avgUptime.toFixed(1)}%\nMonitores: ${data.totalMonitors} total, ${data.upMonitors} online, ${data.downMonitors} offline\n\nDashboard: https://thealert.io/dashboard`,
    });
  }
}

export const emailService = new EmailService();