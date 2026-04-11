'use client'; // Ensure this component is treated as a Client Component

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, TranslationKeys, getTranslation } from '@/shared/lib/i18n';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationKeys;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// Default locale for server rendering and initial client load
const defaultLocale: Locale = 'en';

export function LocaleProvider({ children }: { children: ReactNode }) {
  // 1. Initialize with a default value first
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  // Initialize 't' based on the default locale initially
  const [t, setT] = useState<TranslationKeys>(() => getTranslation(defaultLocale));

  // Why: Add a mounting state to prevent hydration mismatches.
  const [isMounted, setIsMounted] = useState(false);

  // 2. Use useEffect to read localStorage ONLY on the client
  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale;

    // Validate that the saved locale is actually supported to prevent crashes if localStorage is corrupted
    const initialLocale = ['en', 'es', 'tl'].includes(saved) ? saved : defaultLocale;

    if (initialLocale !== locale) {
      setLocaleState(initialLocale);
      setT(getTranslation(initialLocale));
    }

    // Why: Signal that it is now safe to render the translations.
    setIsMounted(true);
  }, []);


  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale); // This is fine (event handler context)
    setT(getTranslation(newLocale));
  };

  // This useEffect might be redundant now if setLocale always updates 't',
  // but it ensures 't' syncs if 'locale' were somehow changed externally.
  // Keep it unless you're sure setLocale is the ONLY way 'locale' state changes.
  // useEffect(() => {
  //   setT(getTranslation(locale));
  // }, [locale]);

  // Why: Do not render the application UI until we know what language the user actually wants. 
  // This prevents the "Flash of English" when a Spanish user refreshes the page.
  if (!isMounted) {
    return null; // Or return a highly generic loading spinner.
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}