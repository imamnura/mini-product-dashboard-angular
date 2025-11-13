import { Routes } from '@angular/router';
import { Home } from './features/products/pages/home/home';
import { ProductDetailPage } from './features/products/pages/detail/product-detail-page';
import { CategoryPage } from './features/products/pages/category-page/category-page';
import { NotFound } from './shared/pages/not-found/not-found';
import {
  productsResolver,
  productDetailResolver,
  categoryProductsResolver,
} from './features/products/resolvers/products.resolver';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Orange Store - Your Online Shopping Destination',
    resolve: {
      products: productsResolver,
    },
  },
  {
    path: 'product/:id',
    component: ProductDetailPage,
    resolve: {
      product: productDetailResolver,
    },
  },
  {
    path: 'category/:category',
    component: CategoryPage,
    resolve: {
      products: categoryProductsResolver,
    },
  },
  {
    path: '404',
    component: NotFound,
    title: '404 - Page Not Found | Orange Store',
  },
  {
    path: '**',
    component: NotFound,
  },
];
