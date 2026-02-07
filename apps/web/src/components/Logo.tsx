'use client';

import { useEffect, useRef } from 'react';

export function Logo({ className = "" }: { className?: string }) {
  const markRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mark = markRef.current;
    if (!mark) return;

    const sequence = ["glow-ok", "glow-warn", "glow-crit"];
    const stepMs = 1050;
    const allMs = 380;
    const idleMs = 620;
    let idx = 0;
    let timeoutId: NodeJS.Timeout;

    function cycle() {
      if (!mark) return;
      
      mark.classList.add(sequence[idx]);

      timeoutId = setTimeout(() => {
        mark.classList.remove(sequence[idx]);

        if (idx === sequence.length - 1) {
          mark.classList.add("glow-all");

          timeoutId = setTimeout(() => {
            mark.classList.remove("glow-all");

            timeoutId = setTimeout(() => {
              idx = 0;
              cycle();
            }, idleMs);
          }, allMs);
        } else {
          idx++;
          cycle();
        }
      }, stepMs);
    }

    // Inicia o ciclo após um delay inicial
    const initialTimeout = setTimeout(cycle, 800);

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className={`logo-container ${className}`}>
      <div ref={markRef} className="logo-mark" aria-label="TheAlert logo">
        <div className="logo-bar"></div>
        <div className="logo-bar"></div>
        <div className="logo-bar"></div>
      </div>

      <style jsx>{`
        .logo-container {
          --ok: rgba(90, 255, 185, 1);
          --warn: rgba(255, 210, 105, 1);
          --crit: rgba(255, 90, 110, 1);
          --bar-w: 3px;
          --bar-h: 18px;
          --bar-gap: 6px;
          --glow-core: 8px;
          --glow-soft: 16px;
          --all-core: 6px;
          --all-soft: 12px;
        }

        .logo-mark {
          position: relative;
          display: flex;
          align-items: center;
          gap: var(--bar-gap);
          width: fit-content;
          height: 24px;
        }

        .logo-bar {
          width: var(--bar-w);
          height: var(--bar-h);
          border-radius: 999px;
          background: linear-gradient(180deg, #f3f3f6, #cfd2da);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          transition: box-shadow 520ms ease, filter 520ms ease;
        }

        /* Glow individual */
        .logo-mark.glow-ok .logo-bar:nth-child(1) {
          box-shadow: 
            0 2px 6px rgba(0, 0, 0, 0.2),
            0 0 var(--glow-core) var(--ok),
            0 0 var(--glow-soft) rgba(255, 255, 255, 0.14);
          filter: saturate(1.5) brightness(1.04);
        }

        .logo-mark.glow-warn .logo-bar:nth-child(2) {
          box-shadow: 
            0 2px 6px rgba(0, 0, 0, 0.2),
            0 0 var(--glow-core) var(--warn),
            0 0 var(--glow-soft) rgba(255, 255, 255, 0.14);
          filter: saturate(1.5) brightness(1.04);
        }

        .logo-mark.glow-crit .logo-bar:nth-child(3) {
          box-shadow: 
            0 2px 6px rgba(0, 0, 0, 0.2),
            0 0 var(--glow-core) var(--crit),
            0 0 var(--glow-soft) rgba(255, 255, 255, 0.14);
          filter: saturate(1.5) brightness(1.04);
        }

        /* Glow tri-color simultâneo */
        .logo-mark.glow-all .logo-bar:nth-child(1) {
          box-shadow: 
            0 2px 6px rgba(0, 0, 0, 0.2),
            0 0 var(--all-core) var(--ok),
            0 0 var(--all-soft) rgba(90, 255, 185, 0.18);
          filter: saturate(1.45) brightness(1.05);
        }

        .logo-mark.glow-all .logo-bar:nth-child(2) {
          box-shadow: 
            0 2px 6px rgba(0, 0, 0, 0.2),
            0 0 var(--all-core) var(--warn),
            0 0 var(--all-soft) rgba(255, 210, 105, 0.18);
          filter: saturate(1.45) brightness(1.05);
        }

        .logo-mark.glow-all .logo-bar:nth-child(3) {
          box-shadow: 
            0 2px 6px rgba(0, 0, 0, 0.2),
            0 0 var(--all-core) var(--crit),
            0 0 var(--all-soft) rgba(255, 90, 110, 0.18);
          filter: saturate(1.45) brightness(1.05);
        }

        @media (prefers-reduced-motion: reduce) {
          .logo-bar {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}