import { Plan } from '@/types/plan';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface PlanCardProps {
  plan: Plan;
  onSelect: (planId: string) => void;
  currentPlan?: string;
}

export function PlanCard({ plan, onSelect, currentPlan }: PlanCardProps) {
  const isCurrentPlan = currentPlan === plan.id;
  const isFree = plan.price === 0;

  return (
    <Card className={`relative ${plan.popular ? 'border-primary border-2' : ''}`}>
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Badge variant="default" className="px-4 py-1">
            Mais Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-8 pt-8">
        <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
        <div className="mt-4">
          <span className="text-4xl font-bold">
            {isFree ? 'Grátis' : `R$ ${plan.price.toFixed(2).replace('.', ',')}`}
          </span>
          {!isFree && <span className="text-muted-foreground">/mês</span>}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          onClick={() => onSelect(plan.id)}
          disabled={isCurrentPlan}
          className="w-full"
          variant={plan.popular ? 'default' : 'outline'}
        >
          {isCurrentPlan ? 'Plano Atual' : isFree ? 'Começar Grátis' : 'Em Breve'}
        </Button>

        {!isFree && (
          <p className="text-xs text-center text-muted-foreground">
            Disponível em breve na versão pública
          </p>
        )}
      </CardContent>
    </Card>
  );
}