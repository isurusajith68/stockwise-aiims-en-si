import { useContext } from 'react';
import { PackageOpen, ShoppingCart, ClipboardCheck, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { LanguageContext } from '@/lib/language-context';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const activities = [
  { 
    id: 1, 
    type: 'stock_in', 
    description: 'Rice (5kg) - 50 units added', 
    time: '15 minutes ago',
    icon: ArrowUpRight,
  },
  { 
    id: 2, 
    type: 'stock_out', 
    description: 'Milk Powder (400g) - 12 units sold', 
    time: '45 minutes ago',
    icon: ArrowDownRight,
  },
  { 
    id: 3, 
    type: 'order', 
    description: 'New PO #2458 created for Supplier A', 
    time: '2 hours ago',
    icon: ShoppingCart,
  },
  { 
    id: 4, 
    type: 'alert', 
    description: 'Low stock alert: Cooking Oil (1L)', 
    time: '3 hours ago',
    icon: AlertCircle,
  },
  { 
    id: 5, 
    type: 'stock_in', 
    description: 'Flour (1kg) - 25 units added', 
    time: '5 hours ago',
    icon: ArrowUpRight,
  },
];

const typeColors = {
  stock_in: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  stock_out: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  order: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  alert: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export function RecentActivityList() {
  const { translations } = useContext(LanguageContext);
  
  const getActivityText = (type: string) => {
    switch (type) {
      case 'stock_in': return translations.stockIn;
      case 'stock_out': return translations.stockOut;
      case 'order': return translations.order;
      case 'alert': return translations.alert;
      default: return type;
    }
  };
  
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id}>
          <div className="flex items-start gap-3">
            <div className={`rounded-full p-1.5 ${typeColors[activity.type as keyof typeof typeColors]}`}>
              <activity.icon className="h-3.5 w-3.5" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs font-medium">
                  {getActivityText(activity.type)}
                </Badge>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
              <p className="mt-1 text-sm">{activity.description}</p>
            </div>
          </div>
          
          {activity.id !== activities.length && <Separator className="my-3" />}
        </div>
      ))}
    </div>
  );
}