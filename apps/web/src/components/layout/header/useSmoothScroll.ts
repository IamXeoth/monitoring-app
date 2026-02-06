'use client';

export function useSmoothScroll() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Ignora se não for uma âncora interna
    if (!href.startsWith('#') && !href.includes('/#')) return;

    e.preventDefault();

    // Extrai o ID da âncora
    const targetId = href.includes('/#') 
      ? href.split('/#')[1] 
      : href.substring(1);

    if (!targetId) {
      // Se não tem ID, volta ao topo
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(targetId);
    
    if (element) {
      const headerOffset = 80; // Altura do header fixo
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return { handleClick };
}