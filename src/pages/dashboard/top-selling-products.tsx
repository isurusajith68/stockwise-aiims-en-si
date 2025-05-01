import { useContext } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LanguageContext } from '@/lib/language-context';
import { Separator } from '@/components/ui/separator';

const topProducts = [
  { 
    id: 1, 
    name: 'Rice (5kg)', 
    category: 'Groceries', 
    sales: 145, 
    trend: 12, 
    trend_direction: 'up' 
  },
  { 
    id: 2, 
    name: 'Milk Powder (400g)', 
    category: 'Dairy', 
    sales: 132, 
    trend: 5, 
    trend_direction: 'up' 
  },
  { 
    id: 3, 
    name: 'Flour (1kg)', 
    category: 'Baking', 
    sales: 98, 
    trend: 3, 
    trend_direction: 'down' 
  },
  { 
    id: 4, 
    name: 'Vegetable Oil (2L)', 
    category: 'Groceries', 
    sales: 85, 
    trend: 7, 
    trend_direction: 'up' 
  },
];

export function TopSellingProducts() {
  const { translations } = useContext(LanguageContext);
  
  return (
    <div className="space-y-4">
      {topProducts.map((product) => (
        <div key={product.id}>
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium">{product.name}</div>
              <div className="text-sm text-muted-foreground">{product.category}</div>
            </div>
            
            <div className="text-right">
              <div className="font-semibold">{product.sales} {translations.units}</div>
              <div className="flex items-center justify-end mt-1">
                {product.trend_direction === 'up' ? (
                  <TrendingUp className="h-3 w-3 mr-1 text-green-600 dark:text-green-400" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1 text-red-600 dark:text-red-400" />
                )}
                <span className={`text-xs ${product.trend_direction === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {product.trend}%
                </span>
              </div>
            </div>
          </div>
          
          {product.id !== topProducts.length && <Separator className="my-3" />}
        </div>
      ))}
    </div>
  );
}