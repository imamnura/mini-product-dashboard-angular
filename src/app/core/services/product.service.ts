import { Injectable, PLATFORM_ID, TransferState, inject, makeStateKey } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';
import { firstValueFrom, timeout } from 'rxjs';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

// TransferState keys
const ALL_PRODUCTS_KEY = makeStateKey<Product[]>('allProducts');
const CATEGORIES_KEY = makeStateKey<string[]>('categories');

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = 'https://fakestoreapi.com';
  private readonly requestTimeout = 10000; // 10 seconds

  // Cache storage
  private cacheAll?: Product[];
  private cacheById = new Map<number, Product>();
  private cacheByCategory = new Map<string, Product[]>();
  private cacheCategories?: string[];
  private cacheDuration = 5 * 60 * 1000; // 5 minutes
  private cacheTimestamp = new Map<string, number>();
  private readonly isServer = isPlatformServer(inject(PLATFORM_ID));

  constructor(private http: HttpClient, private transferState: TransferState) {}

  private isCacheValid(key: string): boolean {
    const timestamp = this.cacheTimestamp.get(key);
    if (!timestamp) return false;
    return Date.now() - timestamp < this.cacheDuration;
  }

  async getAllProducts(forceRefresh = false): Promise<Product[]> {
    // Check TransferState first (from SSR)
    const fromServer = this.transferState.get(ALL_PRODUCTS_KEY, null);
    if (fromServer && !forceRefresh) {
      console.log('🚀 Using TransferState from SSR');
      this.cacheAll = fromServer;
      this.cacheTimestamp.set('all', Date.now());
      this.transferState.remove(ALL_PRODUCTS_KEY); // Clean up
      return fromServer;
    }

    // Check memory cache
    if (!forceRefresh && this.cacheAll && this.isCacheValid('all')) {
      console.log('📦 Using cached all products');
      return this.cacheAll;
    }

    console.log('🌐 Fetching all products from API...');
    const res$ = this.http
      .get<Product[]>(`${this.apiUrl}/products`)
      .pipe(timeout(this.requestTimeout));
    this.cacheAll = await firstValueFrom(res$);
    this.cacheTimestamp.set('all', Date.now());
    console.log(`✅ Loaded ${this.cacheAll.length} products`);

    // Store in TransferState so the browser can reuse SSR data
    if (this.isServer) {
      this.transferState.set(ALL_PRODUCTS_KEY, this.cacheAll);
    }

    return this.cacheAll;
  }

  async getProductById(id: number, forceRefresh = false): Promise<Product> {
    // Check if we already have it in the 'all products' cache
    if (!forceRefresh && this.cacheAll) {
      const cachedProduct = this.cacheAll.find((p) => p.id === id);
      if (cachedProduct) {
        console.log(`📦 Using cached product #${id} from all products`);
        this.cacheById.set(id, cachedProduct);
        return cachedProduct;
      }
    }

    // Check individual product cache
    if (!forceRefresh && this.cacheById.has(id) && this.isCacheValid(`product-${id}`)) {
      console.log(`📦 Using cached product #${id}`);
      return this.cacheById.get(id)!;
    }

    console.log(`🌐 Fetching product #${id} from API...`);
    const res$ = this.http
      .get<Product>(`${this.apiUrl}/products/${id}`)
      .pipe(timeout(this.requestTimeout));
    const product = await firstValueFrom(res$);
    this.cacheById.set(id, product);
    this.cacheTimestamp.set(`product-${id}`, Date.now());
    return product;
  }

  async getCategories(forceRefresh = false): Promise<string[]> {
    // Check TransferState first (from SSR)
    const fromServer = this.transferState.get(CATEGORIES_KEY, null);
    if (fromServer && !forceRefresh) {
      console.log('🚀 Using TransferState categories from SSR');
      this.cacheCategories = fromServer;
      this.cacheTimestamp.set('categories', Date.now());
      this.transferState.remove(CATEGORIES_KEY); // Clean up
      return fromServer;
    }

    // Check memory cache
    if (!forceRefresh && this.cacheCategories && this.isCacheValid('categories')) {
      console.log('📦 Using cached categories');
      return this.cacheCategories;
    }

    console.log('🌐 Fetching categories from API...');
    const res$ = this.http
      .get<string[]>(`${this.apiUrl}/products/categories`)
      .pipe(timeout(this.requestTimeout));
    this.cacheCategories = await firstValueFrom(res$);
    this.cacheTimestamp.set('categories', Date.now());

    // Store in TransferState so the browser can reuse SSR data
    if (this.isServer) {
      this.transferState.set(CATEGORIES_KEY, this.cacheCategories);
    }

    return this.cacheCategories;
  }

  async getByCategory(category: string, forceRefresh = false): Promise<Product[]> {
    // Check if we can get it from 'all products' cache
    if (!forceRefresh && this.cacheAll) {
      const filtered = this.cacheAll.filter((p) => p.category === category);
      if (filtered.length > 0) {
        console.log(`📦 Using cached category '${category}' from all products`);
        this.cacheByCategory.set(category, filtered);
        return filtered;
      }
    }

    // Check category cache
    if (
      !forceRefresh &&
      this.cacheByCategory.has(category) &&
      this.isCacheValid(`category-${category}`)
    ) {
      console.log(`📦 Using cached category '${category}'`);
      return this.cacheByCategory.get(category)!;
    }

    console.log(`🌐 Fetching category '${category}' from API...`);
    const res$ = this.http
      .get<Product[]>(`${this.apiUrl}/products/category/${category}`)
      .pipe(timeout(this.requestTimeout));
    const products = await firstValueFrom(res$);
    this.cacheByCategory.set(category, products);
    this.cacheTimestamp.set(`category-${category}`, Date.now());
    return products;
  }

  clearCache(): void {
    this.cacheAll = undefined;
    this.cacheById.clear();
    this.cacheByCategory.clear();
    this.cacheCategories = undefined;
    this.cacheTimestamp.clear();
  }
}
