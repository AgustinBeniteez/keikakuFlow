import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type AppLanguage = 'es' | 'en' | 'ja';

export interface LanguageOption {
  code: AppLanguage;
  label: string;
  short: string;
}

export const SUPPORTED_LANGUAGES: readonly LanguageOption[] = [
  { code: 'es', label: 'Español', short: 'ES' },
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'ja', label: '日本語', short: 'JA' },
] as const;

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly STORAGE_KEY = 'keikakuflow_lang';
  private readonly translate = inject(TranslateService);

  readonly languages = SUPPORTED_LANGUAGES;
  readonly currentLang = signal<AppLanguage>(this.getInitialLanguage());

  constructor() {
    this.translate.addLangs(this.languages.map((l) => l.code));
    this.translate.setFallbackLang('es');
    this.applyLanguage(this.currentLang());
  }

  setLanguage(lang: AppLanguage): void {
    if (lang === this.currentLang()) return;
    this.currentLang.set(lang);
    this.applyLanguage(lang);
  }

  private applyLanguage(lang: AppLanguage): void {
    this.translate.use(lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, lang);
    }
  }

  private getInitialLanguage(): AppLanguage {
    if (typeof window === 'undefined') return 'es';
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (this.isSupported(saved)) return saved;

    const browserLang = navigator.language?.slice(0, 2).toLowerCase();
    if (this.isSupported(browserLang)) return browserLang;

    return 'es';
  }

  private isSupported(lang: string | null | undefined): lang is AppLanguage {
    return lang === 'es' || lang === 'en' || lang === 'ja';
  }
}
