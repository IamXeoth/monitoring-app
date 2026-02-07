import { Logo } from "@/components/Logo";

export function CTA() {
  return (
    <section className="pt-12 pb-20 bg-[#f3f2f1]">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Card Principal */}
          <div className="bg-[#18181B] rounded-3xl px-12 py-14 md:px-24 md:py-16 text-center relative overflow-hidden border border-slate-800/50">
            {/* Logo no topo */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.08] border border-white/[0.12] backdrop-blur-sm">
                <Logo />
              </div>
            </div>

            {/* Título */}
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-4 tracking-tight leading-[1.15]">
              Comece a monitorar
              <br />
              seus serviços hoje
            </h2>

            {/* Subtitle */}
            <p className="text-base text-white/60 font-normal mb-8 max-w-lg mx-auto">
              Configure seu primeiro monitor em menos de 2 minutos.
            </p>

            {/* CTA Button */}
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-slate-900 rounded-xl font-medium text-sm hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              Experimente grátis
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>

            {/* Decorative subtle gradient */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}