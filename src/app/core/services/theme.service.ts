import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly key = 'theme';
  private platformId = inject(PLATFORM_ID);

  init() {
    // Only access localStorage in browser
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.key);
      if (saved === 'dark') {
        document.documentElement.classList.add('dark');
      }
    }
  }

  toggle() {
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.classList.toggle('dark');
      const mode = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      localStorage.setItem(this.key, mode);
    }
  }
}
