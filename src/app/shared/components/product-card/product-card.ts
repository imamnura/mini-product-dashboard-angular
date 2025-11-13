import { AfterViewInit, Component, Input, PLATFORM_ID, inject } from '@angular/core';
import { Product } from '../../../core/services/product.service';
import { animate, inView } from 'motion';
import { RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard implements AfterViewInit {
  @Input() product!: Product;
  private platformId = inject(PLATFORM_ID);

  ngAfterViewInit(): void {
    // Only run animations in browser
    if (isPlatformBrowser(this.platformId)) {
      inView('.product-card', (target) => {
        animate(target, { opacity: [0, 1], y: [20, 0] }, { duration: 0.3 });
      });
    }
  }
}
