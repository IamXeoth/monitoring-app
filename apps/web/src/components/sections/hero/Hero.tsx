'use client';

import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";

export function Hero() {
  return (
    <section className="relative w-full pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-[#f3f2f1]">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="max-w-full">
            {/* Announcement Badge */}
            <FadeIn delay={100}>
              <Link 
                href="/blog/announcing-beta" 
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-slate-300 transition-colors group mb-6"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-xs font-medium text-slate-700">Versão Beta</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </Link>
            </FadeIn>

            {/* Main Heading */}
            <FadeIn delay={200}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight text-slate-900 mb-6 max-w-4xl">
                Monitore seus sites
                <br />
                com total confiança
              </h1>
            </FadeIn>

            {/* Description */}
            <FadeIn delay={350}>
              <p className="text-base leading-relaxed text-slate-600 max-w-[500px] mb-8 font-normal">
                A plataforma completa de monitoramento
                de uptime feita para empresas que valorizam
                disponibilidade e performance.
              </p>
            </FadeIn>

            {/* CTA Buttons */}
            <FadeIn delay={500}>
              <div className="flex items-center gap-4 mb-6">
                {/* Primary CTA */}
                <Link href="/register">
                  <button className="inline-flex items-center justify-center gap-2 bg-[#18181B] hover:bg-[#18181B]/90 text-white font-semibold h-12 px-7 rounded-full text-[15px] transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap group">
                    <span className="inline-block group-hover:animate-brush-stroke">
                      Começar Grátis
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>

                {/* Secondary CTA */}
                <Link href="#usecases-by-product">
                  <button className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-slate-100 text-slate-900 font-medium h-12 px-6 rounded-full text-[15px] transition-all duration-200 whitespace-nowrap border border-slate-200 hover:border-slate-300">
                    Por que usar?
                  </button>
                </Link>
              </div>
            </FadeIn>

            {/* Social Proof */}
            <FadeIn delay={650}>
              <Link href="#about" className="inline-flex items-center gap-2 group cursor-pointer">
                <span className="text-sm font-medium text-slate-700">
                  Feito por brasileiros, para brasileiros
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </Link>
            </FadeIn>
          </div>

          {/* Right Column - Dashboard Preview */}
          <FadeIn delay={500} direction="left">
            <div className="relative">
              <div className="w-full h-[500px] bg-slate-100 rounded-3xl border-2 border-slate-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-200 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-500 font-normal">Dashboard Preview</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}