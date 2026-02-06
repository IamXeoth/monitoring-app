'use client';

import { useEffect } from 'react';

export function ScrollToTop() {
  useEffect(() => {
    // Força scroll para o topo quando o componente montar
    window.scrollTo(0, 0);
    
    // Também força quando a página é recarregada
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  return null;
}