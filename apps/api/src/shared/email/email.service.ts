import nodemailer from 'nodemailer';

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true para 465, false para outras portas
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMonitorDownAlert(
    userEmail: string,
    monitorName: string,
    monitorUrl: string,
    errorMessage?: string
  ) {
    const subject = `🔴 Monitor DOWN: ${monitorName}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ef4444; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
          .status { font-size: 24px; font-weight: bold; margin: 10px 0; }
          .info { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .label { font-weight: bold; color: #6b7280; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">⚠️ Alerta de Monitor</h1>
          </div>
          <div class="content">
            <div class="status">🔴 Monitor está DOWN</div>
            <div class="info">
              <p><span class="label">Monitor:</span> ${monitorName}</p>
              <p><span class="label">URL:</span> ${monitorUrl}</p>
              <p><span class="label">Data/Hora:</span> ${new Date().toLocaleString('pt-BR')}</p>
              ${errorMessage ? `<p><span class="label">Erro:</span> ${errorMessage}</p>` : ''}
            </div>
            <p>Seu monitor parou de responder. Estamos continuando a monitorá-lo e você será notificado quando voltar ao normal.</p>
          </div>
          <div class="footer">
            <p>Monitoring App - Sistema de Monitoramento de Uptime</p>
            <p>Você está recebendo este email porque configurou alertas para seus monitores.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'Monitoring App <noreply@monitoring.app>',
        to: userEmail,
        subject,
        html,
      });
      console.log(`[Email] Alert sent to ${userEmail}: Monitor DOWN - ${monitorName}`);
    } catch (error) {
      console.error(`[Email] Error sending alert:`, error);
    }
  }

  async sendMonitorUpAlert(
    userEmail: string,
    monitorName: string,
    monitorUrl: string,
    downtimeMinutes: number
  ) {
    const subject = `✅ Monitor UP: ${monitorName}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
          .status { font-size: 24px; font-weight: bold; margin: 10px 0; }
          .info { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .label { font-weight: bold; color: #6b7280; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">✅ Monitor Restaurado</h1>
          </div>
          <div class="content">
            <div class="status">🟢 Monitor está UP</div>
            <div class="info">
              <p><span class="label">Monitor:</span> ${monitorName}</p>
              <p><span class="label">URL:</span> ${monitorUrl}</p>
              <p><span class="label">Restaurado em:</span> ${new Date().toLocaleString('pt-BR')}</p>
              <p><span class="label">Tempo de inatividade:</span> ${downtimeMinutes} minutos</p>
            </div>
            <p>Seu monitor voltou a responder normalmente! 🎉</p>
          </div>
          <div class="footer">
            <p>Monitoring App - Sistema de Monitoramento de Uptime</p>
            <p>Você está recebendo este email porque configurou alertas para seus monitores.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'Monitoring App <noreply@monitoring.app>',
        to: userEmail,
        subject,
        html,
      });
      console.log(`[Email] Alert sent to ${userEmail}: Monitor UP - ${monitorName}`);
    } catch (error) {
      console.error(`[Email] Error sending alert:`, error);
    }
  }

  async sendTestEmail(userEmail: string) {
    const subject = '✅ Email de Teste - Monitoring App';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .content { background: #f9fafb; padding: 20px; border-radius: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <h2>✅ Configuração de Email OK!</h2>
            <p>Parabéns! Seu sistema de alertas por email está configurado corretamente.</p>
            <p>Você receberá notificações sempre que seus monitores mudarem de status.</p>
            <p><strong>Data/Hora do teste:</strong> ${new Date().toLocaleString('pt-BR')}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'Monitoring App <noreply@monitoring.app>',
        to: userEmail,
        subject,
        html,
      });
      console.log(`[Email] Test email sent to ${userEmail}`);
      return true;
    } catch (error) {
      console.error(`[Email] Error sending test email:`, error);
      return false;
    }
  }
}