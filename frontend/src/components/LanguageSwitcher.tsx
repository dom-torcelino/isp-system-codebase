"use client";

import { Languages, Check } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useLocale } from '../contexts/LocaleContext';
import { Locale, localeNames } from '../lib/i18n';

const locales: Locale[] = ['en', 'es', 'tl'];

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" title={t.topBar.language}>
          <Languages className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => setLocale(loc)}
            className="flex items-center justify-between"
          >
            <span>{localeNames[loc]}</span>
            {locale === loc && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
