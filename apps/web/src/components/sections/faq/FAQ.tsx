'use client';

import { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 transition-colors">
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-center justify-between text-left group"
      >
        <h3 className="text-lg font-semibold text-slate-900 leading-tight pr-8">
          {question}
        </h3>
        <div className="flex-shrink-0">
          <svg
            className={`w-6 h-6 text-slate-900 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="px-6 pb-6">
          <p className="text-base text-slate-600 leading-relaxed font-normal">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Como funciona o monitoramento do TheAlert?',
      answer:
        'O TheAlert verifica seus sites e APIs em intervalos regulares (de 30 segundos a 5 minutos, dependendo do plano). Quando detectamos que seu serviço está fora do ar ou respondendo com erro, enviamos alertas instantâneos por email e outros canais configurados.',
    },
    {
      question: 'Posso monitorar APIs além de websites?',
      answer:
        'Sim! A partir do plano STARTER você pode monitorar endpoints de API REST, validar status codes específicos, verificar tempo de resposta e até mesmo validar o conteúdo do payload retornado.',
    },
    {
      question: 'Quantos monitores posso criar em cada plano?',
      answer:
        'No plano FREE você pode criar até 3 monitores. O STARTER permite até 10 monitores, o PRO até 30 monitores, e o BUSINESS até 50 monitores. Se precisar de mais, entre em contato para um plano customizado.',
    },
    {
      question: 'Como funcionam os alertas?',
      answer:
        'Todos os planos incluem alertas por email. A partir do plano PRO, você pode configurar alertas multicanal incluindo Slack, Discord, Telegram e webhooks personalizados. Os alertas são enviados instantaneamente quando detectamos problemas.',
    },
    {
      question: 'Vocês oferecem SLA ou garantia de uptime?',
      answer:
        'Sim! O plano BUSINESS inclui SLA garantido de 99.9% de uptime do nosso serviço de monitoramento. Todos os planos também fornecem relatórios detalhados de uptime dos seus próprios serviços.',
    },
    {
      question: 'Posso testar antes de assinar?',
      answer:
        'Com certeza! Nosso plano FREE é perfeito para testar o TheAlert sem compromisso. Você tem acesso a recursos essenciais de monitoramento e pode fazer upgrade a qualquer momento se precisar de mais funcionalidades.',
    },
    {
      question: 'Qual a diferença entre os planos PRO e BUSINESS?',
      answer:
        'O plano PRO é ideal para SaaS e agências com até 30 monitores, checagem a cada 30 segundos e alertas multicanal. Já o BUSINESS oferece até 50 monitores, SLA garantido de 99.9%, white-label em status pages, gerente de conta dedicado e onboarding personalizado.',
    },
    {
      question: 'Posso cancelar minha assinatura a qualquer momento?',
      answer:
        'Sim, você pode cancelar sua assinatura a qualquer momento sem multas ou taxas adicionais. Após o cancelamento, você ainda terá acesso aos recursos do seu plano até o fim do período pago.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-[#f3f2f1]">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tight text-slate-900">
              Perguntas frequentes
            </h2>
            <p className="text-base text-slate-600 font-normal">
              Respostas para as dúvidas mais comuns antes de começar
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>

          {/* CTA Footer */}
          <div className="mt-16 text-center">
            <p className="text-base text-slate-600 font-normal mb-4">
              Ainda tem dúvidas? Entre em contato com nossa equipe.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#18181B] text-white rounded-xl font-medium text-sm hover:bg-[#18181B]/90 transition-colors border-2 border-[#18181B]"
            >
              Falar com o suporte
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}