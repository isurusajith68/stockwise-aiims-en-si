import { useContext } from 'react';
import { LanguageContext } from '@/lib/language-context';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const inventoryData = [
  { month: 'Jan', stock: 120, sales: 85, forecast: 90 },
  { month: 'Feb', stock: 145, sales: 97, forecast: 105 },
  { month: 'Mar', stock: 150, sales: 110, forecast: 125 },
  { month: 'Apr', stock: 180, sales: 123, forecast: 140 },
  { month: 'May', stock: 210, sales: 165, forecast: 180 },
  { month: 'Jun', stock: 190, sales: 140, forecast: 155 },
  { month: 'Jul', stock: 176, sales: 152, forecast: 165 },
];

export function InventoryChart() {
  const { translations } = useContext(LanguageContext);

  return (
    <Tabs defaultValue="trends">
      <TabsList className="mb-4">
        <TabsTrigger value="trends">{translations.trends}</TabsTrigger>
        <TabsTrigger value="comparison">{translations.comparison}</TabsTrigger>
      </TabsList>
      <TabsContent value="trends" className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={inventoryData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--background)', 
                borderColor: 'var(--border)',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'  
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="stock" 
              name={translations.inventory}
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
            <Line 
              type="monotone" 
              dataKey="sales" 
              name={translations.sales}
              stroke="hsl(var(--chart-2))" 
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
            <Line 
              type="monotone" 
              dataKey="forecast" 
              name={translations.forecast}
              stroke="hsl(var(--chart-5))" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </TabsContent>
      <TabsContent value="comparison" className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={inventoryData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--background)', 
                borderColor: 'var(--border)',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'  
              }}
            />
            <Legend />
            <Bar 
              dataKey="stock" 
              name={translations.inventory}
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="sales" 
              name={translations.sales}
              fill="hsl(var(--chart-2))" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </TabsContent>
    </Tabs>
  );
}