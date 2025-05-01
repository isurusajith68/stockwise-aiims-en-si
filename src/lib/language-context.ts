import { createContext } from 'react';
import { Language, translations } from './translations';

interface LanguageContextType {
  language: Language;
  translations: any;
  toggleLanguage: () => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  translations: translations.en,
  toggleLanguage: () => {}
});