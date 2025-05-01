import { useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { LanguageContext } from '@/lib/language-context';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { language, toggleLanguage, translations } = useContext(LanguageContext);

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={toggleLanguage}
      className={cn("h-9 w-9", className)}
      aria-label={translations.toggleLanguage}
    >
      <Languages className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">{translations.toggleLanguage}</span>
    </Button>
  );
}