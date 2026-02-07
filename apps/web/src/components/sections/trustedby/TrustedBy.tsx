export function TrustedBy() {
  return (
    <section className="relative w-full py-16 px-4 sm:px-6 lg:px-8 bg-[#f3f2f1]">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Título */}
        <div className="text-center mb-8">
          <p className="text-sm font-medium text-slate-600">
            Mais de 500+ empresas confiam no TheAlert
          </p>
        </div>

        {/* Container do Carrossel */}
        <div className="relative overflow-hidden">
          {/* Gradiente Esquerdo */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#f3f2f1] to-transparent z-10 pointer-events-none" />
          
          {/* Gradiente Direito */}
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#f3f2f1] to-transparent z-10 pointer-events-none" />

          {/* Logos em Loop Infinito */}
          <div className="flex gap-12 animate-scroll">
            {/* Primeiro Set de Logos */}
            <div className="flex items-center gap-12 shrink-0">
              <div className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 w-32 h-12 flex items-center justify-center">
                <svg width="128" height="48" viewBox="0 0 128 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <text x="50%" y="50%" fontSize="16" fontWeight="600" fill="currentColor" dominantBaseline="middle" textAnchor="middle">EMPRESA A</text>
                </svg>
              </div>

              <div className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 w-32 h-12 flex items-center justify-center">
                <svg width="128" height="48" viewBox="0 0 128 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <text x="50%" y="50%" fontSize="16" fontWeight="600" fill="currentColor" dominantBaseline="middle" textAnchor="middle">EMPRESA B</text>
                </svg>
              </div>

              <div className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 w-32 h-12 flex items-center justify-center">
                <svg width="128" height="48" viewBox="0 0 128 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <text x="50%" y="50%" fontSize="16" fontWeight="600" fill="currentColor" dominantBaseline="middle" textAnchor="middle">EMPRESA C</text>
                </svg>
              </div>

              <div className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 w-32 h-12 flex items-center justify-center">
                <svg width="128" height="48" viewBox="0 0 128 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <text x="50%" y="50%" fontSize="16" fontWeight="600" fill="currentColor" dominantBaseline="middle" textAnchor="middle">EMPRESA D</text>
                </svg>
              </div>

              <div className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 w-32 h-12 flex items-center justify-center">
                <svg width="128" height="48" viewBox="0 0 128 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <text x="50%" y="50%" fontSize="16" fontWeight="600" fill="currentColor" dominantBaseline="middle" textAnchor="middle">EMPRESA E</text>
                </svg>
              </div>

              <div className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 w-32 h-12 flex items-center justify-center">
                <svg width="128" height="48" viewBox="0 0 128 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <text x="50%" y="50%" fontSize="16" fontWeight="600" fill="currentColor" dominantBaseline="middle" textAnchor="middle">EMPRESA F</text>
                </svg>
              </div>
            </div>

            {/* Segundo Set de Logos (duplicado para loop seamless) */}
            <div className="flex items-center gap-12 shrink-0" aria-hidden="true">
              <div className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 w-32 h-12 flex items-center justify-center">
                <svg width="128" height="48" viewBox="0 0 128 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <text x="50%" y="50%" fontSize="16" fontWeight="600" fill="currentColor" dominantBaseline="middle" textAnchor="middle">EMPRESA A</text>
                </svg>
              </div>

              <div className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 w-32 h-12 flex items-center justify-center">
                <svg width="128" height="48" viewBox="0 0 128 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <text x="50%" y="50%" fontSize="16" fontWeight="600" fill="currentColor" dominantBaseline="middle" textAnchor="middle">EMPRESA B</text>
                </svg>
              </div>

              <div className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 w-32 h-12 flex items-center justify-center">
                <svg width="128" height="48" viewBox="0 0 128 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <text x="50%" y="50%" fontSize="16" fontWeight="600" fill="currentColor" dominantBaseline="middle" textAnchor="middle">EMPRESA C</text>
                </svg>
              </div>

              <div className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 w-32 h-12 flex items-center justify-center">
                <svg width="128" height="48" viewBox="0 0 128 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <text x="50%" y="50%" fontSize="16" fontWeight="600" fill="currentColor" dominantBaseline="middle" textAnchor="middle">EMPRESA D</text>
                </svg>
              </div>

              <div className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 w-32 h-12 flex items-center justify-center">
                <svg width="128" height="48" viewBox="0 0 128 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <text x="50%" y="50%" fontSize="16" fontWeight="600" fill="currentColor" dominantBaseline="middle" textAnchor="middle">EMPRESA E</text>
                </svg>
              </div>

              <div className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 w-32 h-12 flex items-center justify-center">
                <svg width="128" height="48" viewBox="0 0 128 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <text x="50%" y="50%" fontSize="16" fontWeight="600" fill="currentColor" dominantBaseline="middle" textAnchor="middle">EMPRESA F</text>
                </svg>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}