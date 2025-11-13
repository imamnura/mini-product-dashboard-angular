import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../../../core/services/product.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { ErrorState } from '../../../../shared/components/error-state/error-state';
import { ProductCard } from '../../../../shared/components/product-card/product-card';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinner, ErrorState, ProductCard],
  templateUrl: './product-detail-page.html',
  styleUrl: './product-detail-page.css',
})
export class ProductDetailPage implements OnInit {
  product?: Product;
  relatedProducts: Product[] = [];
  isLoading: boolean = false;
  isError: boolean = false;
  isLoadingRelated: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private title: Title,
    private meta: Meta
  ) {}

  async ngOnInit(): Promise<void> {
    // Try to get data from resolver first
    const resolvedProduct = this.route.snapshot.data['product'];

    if (resolvedProduct) {
      console.log('⚡ Using pre-loaded product from resolver');
      this.product = resolvedProduct;

      // Update SEO
      if (this.product) {
        this.updateSEO(this.product);
      }

      // Load related products in background
      this.loadRelatedProducts();
    } else {
      // Fallback to manual loading
      console.log('🔄 Resolver data not available, loading manually');
      const id = Number(this.route.snapshot.paramMap.get('id'));
      await this.loadProduct(id);
    }
  }

  private updateSEO(product: Product) {
    this.title.setTitle(`${product.title} - Orange Store`);
    this.meta.updateTag({
      name: 'description',
      content: product.description,
    });
    this.meta.updateTag({
      property: 'og:title',
      content: product.title,
    });
    this.meta.updateTag({
      property: 'og:description',
      content: product.description,
    });
    this.meta.updateTag({
      property: 'og:image',
      content: product.image,
    });
  }

  async loadProduct(id: number) {
    this.isLoading = true;
    this.isError = false;

    try {
      this.product = await this.productService.getProductById(id);

      if (this.product) {
        // Update SEO
        this.updateSEO(this.product);

        // Load related products in background (don't wait)
        this.loadRelatedProducts();
      }
    } catch (error) {
      this.isError = true;
      console.error('Failed to load product:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async loadRelatedProducts() {
    if (!this.product) return;

    this.isLoadingRelated = true;
    try {
      const categoryProducts = await this.productService.getByCategory(this.product.category);
      this.relatedProducts = categoryProducts.filter((p) => p.id !== this.product!.id).slice(0, 4);
    } catch (error) {
      console.error('Failed to load related products:', error);
    } finally {
      this.isLoadingRelated = false;
    }
  }

  goToCategory(category: string): void {
    if (!this.product) return;
    // Navigate to home with category filter OR to category page
    // Using home with query params for consistency
    this.router.navigate(['/'], { queryParams: { category: this.product.category } });
  }

  retryLoad() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProduct(id);
  }
}
