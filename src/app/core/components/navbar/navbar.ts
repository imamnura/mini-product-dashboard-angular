import { Component, PLATFORM_ID, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { Router, RouterLink } from '@angular/router';
import { SearchBar } from '../search-bar/search-bar';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, SearchBar],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  dark = false;
  private platformId = inject(PLATFORM_ID);

  constructor(private router: Router, private theme: ThemeService) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.theme.init();
      this.dark = document.documentElement.classList.contains('dark');
    }
  }

  onSearch(q: string) {
    if (!q) return;
    this.router.navigate(['/search'], { queryParams: { q } });
  }

  toggleTheme() {
    this.theme.toggle();
    this.dark = !this.dark;
  }
}
