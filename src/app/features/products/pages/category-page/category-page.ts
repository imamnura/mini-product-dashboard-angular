import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../../../core/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ProductCard } from '../../../../shared/components/product-card/product-card';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { ErrorState } from '../../../../shared/components/error-state/error-state';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [CommonModule, ProductCard, FormsModule, Pagination, LoadingSpinner, ErrorState],
  templateUrl: './category-page.html',
  styleUrl: './category-page.css',
})
export class CategoryPage implements OnInit {
  category!: string;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  visible: Product[] = [];
  isLoading = false;
  isError = false;

  currentPage = 1;
  itemsPerPage = 8;
  searchQuery = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private title: Title
  ) {}

  async ngOnInit(): Promise<void> {
    // Subscribe to route changes
    this.route.paramMap.subscribe(async (params) => {
      this.category = params.get('category') || '';
      this.title.setTitle(`${this.formatCategoryName(this.category)} - Orange Store`);

      // Try to get data from resolver first
      const resolvedProducts = this.route.snapshot.data['products'];

      if (resolvedProducts && resolvedProducts.length > 0) {
        console.log('⚡ Using pre-loaded category data from resolver');
        this.products = resolvedProducts;
        this.applyFilter();
      } else {
        console.log('🔄 Resolver data not available, loading manually');
        await this.loadProducts();
      }
    });
  }

  async loadProducts() {
    this.isLoading = true;
    this.isError = false;

    try {
      this.products = await this.productService.getByCategory(this.category);
      this.applyFilter();
    } catch (error) {
      this.isError = true;
      console.error('Failed to load products:', error);
    } finally {
      this.isLoading = false;
    }
  }

  onSearch() {
    this.currentPage = 1;
    this.applyFilter();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updateVisible();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private applyFilter() {
    this.filteredProducts = this.products.filter((product) =>
      product.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.updateVisible();
  }

  private updateVisible() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.visible = this.filteredProducts.slice(start, end);
  }

  private formatCategoryName(category: string): string {
    return category
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  retryLoad() {
    this.loadProducts();
  }
}
