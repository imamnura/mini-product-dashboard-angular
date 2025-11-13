import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Product, ProductService } from '../../../core/services/product.service';

export const productsResolver: ResolveFn<Product[]> = async () => {
  const productService = inject(ProductService);
  console.log('📋 Resolver: Pre-loading products...');
  return await productService.getAllProducts();
};

export const categoriesResolver: ResolveFn<string[]> = async () => {
  const productService = inject(ProductService);
  console.log('📋 Resolver: Pre-loading categories...');
  return await productService.getCategories();
};

export const productDetailResolver: ResolveFn<Product> = async (route) => {
  const productService = inject(ProductService);
  const id = Number(route.paramMap.get('id'));
  console.log(`📋 Resolver: Pre-loading product #${id}...`);
  return await productService.getProductById(id);
};

export const categoryProductsResolver: ResolveFn<Product[]> = async (route) => {
  const productService = inject(ProductService);
  const category = route.paramMap.get('category') || '';
  console.log(`📋 Resolver: Pre-loading category '${category}'...`);
  return await productService.getByCategory(category);
};
