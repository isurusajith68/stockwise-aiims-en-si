import { createContext } from 'react';
import { Language, translations } from './translations';

interface LanguageContextType {
  language: Language;
  translations: Record<string, string>;
  toggleLanguage: () => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  translations: translations.en,
  toggleLanguage: () => {}
});