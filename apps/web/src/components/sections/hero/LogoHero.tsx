'use client';

import { useEffect, useRef } from 'react';

export function LogoHero({ className = "" }: { className?: string }) {
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

    // Inicia em stack, depois vai pra line
    setTimeout(() => {
      mark.classList.remove("stack");
      mark.classList.add("line");
    }, 700);

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

    // Inicia o ciclo após transição stack -> line
    const initialTimeout = setTimeout(cycle, 1700);

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className={`logo-hero-container ${className}`}>
      <div ref={markRef} className="logo-hero-mark stack" aria-label="TheAlert logo">
        <div className="logo-hero-bar"></div>
        <div className="logo-hero-bar"></div>
        <div className="logo-hero-bar"></div>
        <div className="logo-hero-wordmark">THE&nbsp;ALERT</div>
      </div>

      <style jsx>{`
        .logo-hero-container {
          --ok: rgba(90, 255, 185, 1);
          --warn: rgba(255, 210, 105, 1);
          --crit: rgba(255, 90, 110, 1);
          
          --gap: 20px;
          --text-gap: 16px;
          
          --bar-w: 6px;
          --bar-h: 52px;
          
          --glow-core: 16px;
          --glow-soft: 40px;
          
          --all-core: 12px;
          --all-soft: 28px;
        }

        .logo-hero-mark {
          position: relative;
          width: 280px;
          height: 80px;
          display: flex;
          align-items: center;
          user-select: none;
          padding-left: 5px;
        }

        .logo-hero-bar {
          position: absolute;
          width: var(--bar-w);
          height: var(--bar-h);
          border-radius: 999px;
          background: linear-gradient(180deg, #18181B, #27272A);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translate(var(--x, 0px), var(--y, 0px));
          transition: 
            transform 900ms cubic-bezier(0.2, 0.8, 0.2, 1),
            box-shadow 520ms ease,
            filter 520ms ease;
        }

        .logo-hero-wordmark {
          position: absolute;
          font-weight: 300;
          letter-spacing: 0.32em;
          font-size: 19px;
          text-transform: uppercase;
          white-space: nowrap;
          color: rgba(24, 24, 27, 0.92);
          transform: translate(var(--tx, 0px), var(--ty, 0px));
          transition: transform 900ms cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        /* Stack state */
        .logo-hero-mark.stack .logo-hero-bar:nth-child(1) {
          --x: 0px;
          --y: calc(var(--gap) * -1);
        }
        .logo-hero-mark.stack .logo-hero-bar:nth-child(2) {
          --x: 0px;
          --y: 0px;
        }
        .logo-hero-mark.stack .logo-hero-bar:nth-child(3) {
          --x: 0px;
          --y: var(--gap);
        }
        .logo-hero-mark.stack .logo-hero-wordmark {
          --tx: 56px;
          --ty: 0px;
        }

        /* Line state */
        .logo-hero-mark.line .logo-hero-bar:nth-child(1) {
          --x: 0px;
          --y: 0px;
        }
        .logo-hero-mark.line .logo-hero-bar:nth-child(2) {
          --x: 20px;
          --y: 0px;
        }
        .logo-hero-mark.line .logo-hero-bar:nth-child(3) {
          --x: 40px;
          --y: 0px;
        }
        .logo-hero-mark.line .logo-hero-wordmark {
          --tx: 72px;
          --ty: 0px;
        }

        /* Glow individual */
        .logo-hero-mark.glow-ok .logo-hero-bar:nth-child(1) {
          box-shadow: 
            0 4px 12px rgba(0, 0, 0, 0.15),
            0 0 var(--glow-core) var(--ok),
            0 0 var(--glow-soft) rgba(255, 255, 255, 0.14);
          filter: saturate(1.5) brightness(1.04);
        }

        .logo-hero-mark.glow-warn .logo-hero-bar:nth-child(2) {
          box-shadow: 
            0 4px 12px rgba(0, 0, 0, 0.15),
            0 0 var(--glow-core) var(--warn),
            0 0 var(--glow-soft) rgba(255, 255, 255, 0.14);
          filter: saturate(1.5) brightness(1.04);
        }

        .logo-hero-mark.glow-crit .logo-hero-bar:nth-child(3) {
          box-shadow: 
            0 4px 12px rgba(0, 0, 0, 0.15),
            0 0 var(--glow-core) var(--crit),
            0 0 var(--glow-soft) rgba(255, 255, 255, 0.14);
          filter: saturate(1.5) brightness(1.04);
        }

        /* Glow tri-color simultâneo */
        .logo-hero-mark.glow-all .logo-hero-bar:nth-child(1) {
          box-shadow: 
            0 4px 12px rgba(0, 0, 0, 0.15),
            0 0 var(--all-core) var(--ok),
            0 0 var(--all-soft) rgba(90, 255, 185, 0.18);
          filter: saturate(1.45) brightness(1.05);
        }

        .logo-hero-mark.glow-all .logo-hero-bar:nth-child(2) {
          box-shadow: 
            0 4px 12px rgba(0, 0, 0, 0.15),
            0 0 var(--all-core) var(--warn),
            0 0 var(--all-soft) rgba(255, 210, 105, 0.18);
          filter: saturate(1.45) brightness(1.05);
        }

        .logo-hero-mark.glow-all .logo-hero-bar:nth-child(3) {
          box-shadow: 
            0 4px 12px rgba(0, 0, 0, 0.15),
            0 0 var(--all-core) var(--crit),
            0 0 var(--all-soft) rgba(255, 90, 110, 0.18);
          filter: saturate(1.45) brightness(1.05);
        }

        @media (prefers-reduced-motion: reduce) {
          .logo-hero-bar,
          .logo-hero-wordmark {
            transition: none !important;
          }
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .logo-hero-container {
            --bar-h: 36px;
            --gap: 16px;
            --text-gap: 20px;
          }
          
          .logo-hero-mark {
            width: 220px;
            height: 60px;
            padding-left: 10px;
          }
          
          .logo-hero-wordmark {
            font-size: 14px;
          }
          
          .logo-hero-mark.stack .logo-hero-bar:nth-child(1) { --x: 0px; }
          .logo-hero-mark.stack .logo-hero-bar:nth-child(2) { --x: 0px; }
          .logo-hero-mark.stack .logo-hero-bar:nth-child(3) { --x: 0px; }
          .logo-hero-mark.stack .logo-hero-wordmark { --tx: 42px; }
          
          .logo-hero-mark.line .logo-hero-bar:nth-child(1) { --x: 0px; }
          .logo-hero-mark.line .logo-hero-bar:nth-child(2) { --x: 15px; }
          .logo-hero-mark.line .logo-hero-bar:nth-child(3) { --x: 30px; }
          .logo-hero-mark.line .logo-hero-wordmark { --tx: 56px; }
        }
      `}</style>
    </div>
  );
}