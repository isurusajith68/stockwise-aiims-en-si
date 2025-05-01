import { useContext } from 'react';
import { AlertCircle, PackageOpen } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { LanguageContext } from '@/lib/language-context';

const lowStockItems = [
  { id: 1, name: 'Rice (5kg)', category: 'Groceries', level: 15, threshold: 20 },
  { id: 2, name: 'Milk Powder', category: 'Dairy', level: 5, threshold: 25 },
  { id: 3, name: 'Cooking Oil (1L)', category: 'Groceries', level: 12, threshold: 30 },
  { id: 4, name: 'Sugar', category: 'Groceries', level: 20, threshold: 40 },
];

export function LowStockAlert() {
  const { translations } = useContext(LanguageContext);
  
  return (
    <div className="space-y-4">
      {lowStockItems.map((item) => {
        const percentage = (item.level / item.threshold) * 100;
        const isVeryLow = percentage < 30;
        
        return (
          <div key={item.id}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <PackageOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">{item.name}</span>
              </div>
              <Badge variant={isVeryLow ? "destructive" : "outline"} className="ml-2">
                {isVeryLow ? translations.critical : translations.low}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
              <span>{item.category}</span>
              <span>{item.level} / {item.threshold}</span>
            </div>
            
            <Progress 
              value={percentage} 
              className={`h-2 ${isVeryLow ? 'bg-destructive/20' : 'bg-primary/20'}`}
              indicatorClassName={isVeryLow ? 'bg-destructive' : undefined}
            />
            
            {item.id !== lowStockItems.length && <Separator className="my-3" />}
          </div>
        );
      })}
    </div>
  );
}