'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "./MobileMenu";
import { Logo } from "@/components/Logo";
import { useSmoothScroll } from './useSmoothScroll'

const navLinks = [
  { href: "/#features", label: "Recursos" },
  { href: "/pricing", label: "Preços" },
  { href: "/#faq", label: "FAQ" },
  { href: "/changelog", label: "Changelog" },
];

export function Header() {
  const { handleClick } = useSmoothScroll();

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent py-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-center">
          {/* Centered Container */}
          <div className="inline-flex items-center gap-1 px-1 py-1 rounded-[12px] border border-white/[0.08] dark:border-white/[0.15] bg-[#18181B]/95 dark:bg-[#18181B]/98 backdrop-blur-xl shadow-lg">

            {/* Logo - TheAlert animado */}
            <Link
              href="/"
              className="flex items-center group px-2 py-1.5 rounded-lg hover:bg-white/[0.06] transition-colors duration-200"
            >
              <div className="flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                <Logo />
              </div>
            </Link>

            {/* Divider */}
            <div className="h-5 w-px bg-white/[0.08] mx-1" />

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    // Só usa smooth scroll para âncoras (#)
                    if (link.href.startsWith('/#')) {
                      handleClick(e, link.href);
                    }
                  }}
                  className="text-[13px] font-medium text-white/80 hover:text-white hover:bg-white/[0.06] px-3 py-1.5 rounded-lg transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Divider */}
            <div className="hidden md:block h-5 w-px bg-white/[0.08] mx-1" />

            {/* Login */}
            <Link href="/login" className="hidden sm:block">
              <Button
                variant="ghost"
                size="sm"
                className="text-[13px] font-medium text-white/80 hover:text-white hover:bg-white/[0.06] h-8 px-3 rounded-lg transition-all duration-200"
              >
                Login
              </Button>
            </Link>

            {/* CTA */}
            <Link href="/register">
              <Button
                size="sm"
                className="
                  bg-white hover:bg-white/95
                  text-black
                  font-medium
                  tracking-tight
                  h-7
                  px-3.5
                  rounded-[14px]
                  text-[13px]
                  transition-all duration-200
                  group
                  relative
                  overflow-hidden
                  whitespace-nowrap
                "
              >
                <span className="inline-block group-hover:animate-brush-stroke">
                  Começar Grátis
                </span>
              </Button>
            </Link>

            {/* Mobile Menu */}
            <div className="md:hidden ml-1">
              <MobileMenu />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}