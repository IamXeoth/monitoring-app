'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSmoothScroll } from './useSmoothScroll'

const navLinks = [
  { href: '/#features', label: 'Recursos' },
  { href: '/pricing', label: 'Preços' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/changelog', label: 'Changelog' },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { handleClick } = useSmoothScroll();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Só usa smooth scroll para âncoras (#)
    if (href.startsWith('/#')) {
      handleClick(e, href);
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 -mr-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden py-4 border-t border-[#E4E4E7] dark:border-slate-700 absolute top-14 left-0 right-0 bg-background">
          <div className="container mx-auto px-4">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors py-2"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/login"
                className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors py-2 sm:hidden"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}