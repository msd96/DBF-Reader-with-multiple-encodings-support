import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private key = 'app-theme';
  current = 'light';

  constructor() {
    const saved = localStorage.getItem(this.key);
    this.current = saved === 'dark' ? 'dark' : 'light';
    this.apply();
  }

  toggle() {
    this.current = this.current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(this.key, this.current);
    this.apply();
  }

  apply() {
    const html = document.documentElement; // <html>

    if (this.current === 'dark')
      html.classList.add('dark');
    else
      html.classList.remove('dark');
  }
}
