import { Component } from '@angular/core';
import { Product, ProductService } from '../../../../core/services/product.service';
import { ProductCard } from '../../../../shared/components/product-card/product-card';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { ErrorState } from '../../../../shared/components/error-state/error-state';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductCard, Pagination, LoadingSpinner, ErrorState],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  products: Product[] = [];
  allProducts: Product[] = []; // Store all products
  visibleProducts: Product[] = [];
  currentPage = 1;
  itemsPerPage = 8;
  categories: string[] = [];
  isLoading = false;
  isError = false;
  selectedCategory = 'all'; // Track selected category

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    // Subscribe to query params for category filter
    this.route.queryParams.subscribe(async (params) => {
      const category = params['category'] || 'all';
      this.selectedCategory = category;

      // Only load if we don't have data yet
      if (this.allProducts.length === 0) {
        const resolvedProducts = this.route.snapshot.data['products'];

        if (resolvedProducts && resolvedProducts.length > 0) {
          console.log('⚡ Using pre-loaded data from resolver');
          this.allProducts = resolvedProducts;
          await this.loadCategories();
        } else {
          console.log('🔄 Resolver data not available, loading manually');
          await this.loadProducts();
        }
      }

      // Apply filter
      this.filterByCategory(category);
    });
  }

  async loadCategories() {
    try {
      this.categories = await this.productService.getCategories();
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  }

  async loadProducts() {
    this.isLoading = true;
    this.isError = false;

    try {
      this.allProducts = await this.productService.getAllProducts();
      this.products = [...this.allProducts];
      this.categories = await this.productService.getCategories();
      this.updateVisible();
    } catch (error) {
      this.isError = true;
      console.error('Failed to load products:', error);
    } finally {
      this.isLoading = false;
    }
  }

  filterByCategory(category: string) {
    this.currentPage = 1;

    if (category === 'all') {
      this.products = [...this.allProducts];
    } else {
      this.products = this.allProducts.filter((p) => p.category === category);
    }

    this.updateVisible();
  }

  updateVisible() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.visibleProducts = this.products.slice(start, end);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updateVisible();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onCategoryChange(e: any) {
    const cat = e.target.value;
    // Use query params instead of navigate to /category
    if (cat === 'all') {
      this.router.navigate(['/'], { queryParams: {} });
    } else {
      this.router.navigate(['/'], { queryParams: { category: cat } });
    }
  }

  retryLoad() {
    this.loadProducts();
  }
}
