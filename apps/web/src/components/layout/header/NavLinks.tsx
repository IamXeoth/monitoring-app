import Link from 'next/link';

const navLinks = [
  { href: '/#features', label: 'Recursos' },
  { href: '/pricing', label: 'Preços' },
  { href: '/#faq', label: 'FAQ' },
];

export function NavLinks() {
  return (
    <nav className="hidden md:flex items-center gap-8">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}