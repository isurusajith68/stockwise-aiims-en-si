import { Package } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(66);
    }, 400);
    
    const timer2 = setTimeout(() => {
      setProgress(100);
    }, 1000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-background p-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="rounded-full bg-primary/10 p-3 text-primary animate-pulse">
          <Package className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mt-2">StockWise</h1>
        <p className="text-sm text-muted-foreground max-w-md">
          AI-Powered Inventory Management System
        </p>
      </div>
      <div className="w-full max-w-md mt-4">
        <Progress value={progress} className="h-1" />
      </div>
    </div>
  );
}