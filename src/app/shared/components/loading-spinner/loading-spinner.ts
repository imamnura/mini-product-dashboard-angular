import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [],
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.css',
})
export class LoadingSpinner {
  @Input() message = 'Loading...';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  get sizeClass(): string {
    const sizes = {
      sm: 'w-6 h-6',
      md: 'w-12 h-12',
      lg: 'w-16 h-16',
    };
    return sizes[this.size];
  }
}
