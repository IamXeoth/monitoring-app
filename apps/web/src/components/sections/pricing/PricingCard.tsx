interface Feature {
  text: string;
  available: boolean;
}

interface PricingCardProps {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  period?: string;
  ctaText: string;
  ctaVariant?: 'default' | 'primary' | 'secondary';
  features: Feature[];
  popular?: boolean;
}

export function PricingCard({
  name,
  description,
  price,
  originalPrice,
  period = '/mês',
  ctaText,
  ctaVariant = 'default',
  features,
  popular = false,
}: PricingCardProps) {
  const ctaStyles = {
    default: 'bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-50',
    primary: 'bg-primary border-2 border-primary text-white hover:bg-primary/90',
    secondary: 'bg-slate-900 border-2 border-slate-900 text-white hover:bg-slate-800',
  };

  return (
    <div
      className={`relative bg-white rounded-3xl p-8 transition-all duration-200 ${
        popular
          ? 'border-2 border-slate-900 shadow-xl scale-105'
          : 'border-2 border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Badge "Mais popular" */}
      {popular && (
        <div className="absolute -top-5 left-0 right-0 flex justify-center">
          <div className="bg-slate-900 text-white text-xs font-medium px-6 py-2 rounded-full">
            Mais popular
          </div>
        </div>
      )}

      {/* Badge do plano */}
      <div className="mb-6">
        <div className="inline-flex items-center px-3 py-1 rounded-full border border-slate-300 bg-white">
          <span className="text-xs font-normal text-slate-700">{name}</span>
        </div>
      </div>

      {/* Descrição */}
      <div className="mb-6">
        <p className="text-sm text-slate-600 leading-relaxed font-normal">
          {description}
        </p>
      </div>

      {/* Preço */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1 mb-1">
          {originalPrice && (
            <span className="text-2xl font-normal text-slate-400 line-through tabular-nums mr-2">
              R$ {originalPrice}
            </span>
          )}
          <span className="text-4xl font-normal text-slate-900 tabular-nums">
            {price === 0 ? 'R$ 0' : `R$ ${price}`}
          </span>
          <span className="text-slate-500 text-xs font-normal ml-1">BRL</span>
        </div>
        <p className="text-xs text-slate-500 font-normal">{period}</p>
      </div>

      {/* CTA */}
      <button
        className={`w-full py-2.5 px-6 rounded-xl font-normal text-sm transition-all duration-200 mb-6 ${ctaStyles[ctaVariant]}`}
      >
        {ctaText}
      </button>

      {/* Features */}
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            {feature.available ? (
              <svg
                className="w-4 h-4 text-slate-900 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-slate-300 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            <span
              className={`text-sm leading-relaxed ${
                feature.available
                  ? 'text-slate-700 font-normal'
                  : 'text-slate-400 font-normal line-through'
              }`}
            >
              {feature.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}