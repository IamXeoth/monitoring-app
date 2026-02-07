interface FeatureCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  interactive?: React.ReactNode;
}

export function FeatureCard({ 
  icon,
  title, 
  description, 
  badge,
  interactive 
}: FeatureCardProps) {
  return (
    <div className="relative bg-white border-2 border-slate-200 rounded-3xl p-6 h-full flex flex-col hover:border-slate-300 transition-all duration-200">
      {/* Badge fixo no topo direito */}
      {badge && (
        <div className="absolute top-5 right-5">
          <span className="text-[10px] font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider">
            {badge}
          </span>
        </div>
      )}

      {/* Conteúdo fixo */}
      <div className="flex-1">
        {/* Ícone + Título */}
        <div className="flex items-start gap-3 mb-3">
          {icon && (
            <div className="flex-shrink-0 mt-0.5">
              {icon}
            </div>
          )}
          <h3 className={`text-lg font-semibold text-slate-900 leading-tight tracking-tight ${badge ? 'pr-16' : ''}`}>
            {title}
          </h3>
        </div>

        {/* Descrição */}
        <p className="text-slate-600 text-sm leading-relaxed font-normal">
          {description}
        </p>
      </div>

      {/* Elemento Interativo sempre na base */}
      {interactive && (
        <div className="mt-6 pt-5 border-t border-slate-100">
          {interactive}
        </div>
      )}
    </div>
  );
}