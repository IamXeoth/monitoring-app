import { emailService } from './shared/email/email.service.js';

/**
 * Script de teste para emails do Resend
 * 
 * Como rodar:
 * 1. Certifique-se que o .env está configurado
 * 2. npm install ts-node -D (se ainda não tiver)
 * 3. npx ts-node src/test-emails.ts
 */

async function testEmails() {
  console.log('🧪 Iniciando testes de email...\n');

  // ========================================
  // CONFIGURAÇÃO: Coloque seu email aqui!
  // ========================================
  const YOUR_EMAIL = 'iamxeoth@gmail.com'; // ← MUDE AQUI!

  try {
    // ========================================
    // TESTE 1: Email de Monitor DOWN 🔴
    // ========================================
    console.log('📧 Enviando email de alerta DOWN...');
    
    await emailService.sendMonitorDownAlert(YOUR_EMAIL, {
      monitorName: 'Site Principal (TESTE)',
      monitorUrl: 'https://thealert.io',
      status: 'DOWN',
      timestamp: new Date(),
      userName: 'Vinícius',
      errorMessage: 'Connection timeout after 30 seconds. Unable to reach server.',
    });

    console.log('✅ Email DOWN enviado com sucesso!\n');

    // Aguardar 2 segundos antes do próximo
    await new Promise(resolve => setTimeout(resolve, 2000));

    // ========================================
    // TESTE 2: Email de Monitor UP 🟢
    // ========================================
    console.log('📧 Enviando email de recuperação UP...');
    
    await emailService.sendMonitorUpAlert(YOUR_EMAIL, {
      monitorName: 'Site Principal (TESTE)',
      monitorUrl: 'https://thealert.io',
      status: 'UP',
      timestamp: new Date(),
      userName: 'Vinícius',
      responseTime: 245,
    });

    console.log('✅ Email UP enviado com sucesso!\n');

    // Aguardar 2 segundos antes do próximo
    await new Promise(resolve => setTimeout(resolve, 2000));

    // ========================================
    // TESTE 3: Relatório Diário 📊
    // ========================================
    console.log('📧 Enviando relatório diário...');
    
    await emailService.sendDailyReport(YOUR_EMAIL, {
      userName: 'Vinícius',
      date: new Date(),
      totalMonitors: 5,
      upMonitors: 4,
      downMonitors: 1,
      avgUptime: 98.7,
      monitors: [
        {
          name: 'Site Principal',
          url: 'https://thealert.io',
          uptime: 99.9,
          avgResponseTime: 245,
        },
        {
          name: 'API Backend',
          url: 'https://api.thealert.io',
          uptime: 99.5,
          avgResponseTime: 180,
        },
        {
          name: 'Dashboard',
          url: 'https://dashboard.thealert.io',
          uptime: 98.2,
          avgResponseTime: 320,
        },
        {
          name: 'Blog',
          url: 'https://blog.thealert.io',
          uptime: 97.8,
          avgResponseTime: 450,
        },
        {
          name: 'CDN Assets',
          url: 'https://cdn.thealert.io',
          uptime: 94.5,
          avgResponseTime: 890,
        },
      ],
    });

    console.log('✅ Relatório diário enviado com sucesso!\n');

    // ========================================
    // RESUMO
    // ========================================
    console.log('🎉 TODOS OS TESTES CONCLUÍDOS!\n');
    console.log('📬 Verifique sua caixa de entrada em:', YOUR_EMAIL);
    console.log('📁 Verifique também a pasta de spam/lixo eletrônico\n');
    console.log('✅ 3 emails enviados:');
    console.log('   1. 🔴 Alerta DOWN');
    console.log('   2. 🟢 Recuperação UP');
    console.log('   3. 📊 Relatório Diário\n');

  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
    process.exit(1);
  }
}

// Executar testes
testEmails()
  .then(() => {
    console.log('✨ Script finalizado com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erro fatal:', error);
    process.exit(1);
  });