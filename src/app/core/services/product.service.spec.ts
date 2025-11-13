import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all products', async () => {
    const mockProducts = [
      {
        id: 1,
        title: 'Product 1',
        price: 100,
        description: 'Test',
        category: 'electronics',
        image: 'test.jpg',
        rating: { rate: 4.5, count: 100 },
      },
    ];

    const promise = service.getAllProducts();
    const req = httpMock.expectOne('https://fakestoreapi.com/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);

    const products = await promise;
    expect(products).toEqual(mockProducts);
  });

  it('should cache products after first call', async () => {
    const mockProducts = [
      {
        id: 1,
        title: 'Product 1',
        price: 100,
        description: 'Test',
        category: 'electronics',
        image: 'test.jpg',
        rating: { rate: 4.5, count: 100 },
      },
    ];

    // First call
    const promise1 = service.getAllProducts();
    const req = httpMock.expectOne('https://fakestoreapi.com/products');
    req.flush(mockProducts);
    await promise1;

    // Second call should use cache (no HTTP request)
    const products2 = await service.getAllProducts();
    expect(products2).toEqual(mockProducts);
    httpMock.expectNone('https://fakestoreapi.com/products');
  });

  it('should fetch product by id', async () => {
    const mockProduct = {
      id: 1,
      title: 'Product 1',
      price: 100,
      description: 'Test',
      category: 'electronics',
      image: 'test.jpg',
      rating: { rate: 4.5, count: 100 },
    };

    const promise = service.getProductById(1);
    const req = httpMock.expectOne('https://fakestoreapi.com/products/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);

    const product = await promise;
    expect(product).toEqual(mockProduct);
  });

  it('should fetch categories', async () => {
    const mockCategories = ['electronics', 'jewelery', "men's clothing", "women's clothing"];

    const promise = service.getCategories();
    const req = httpMock.expectOne('https://fakestoreapi.com/products/categories');
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);

    const categories = await promise;
    expect(categories).toEqual(mockCategories);
  });

  it('should clear cache', async () => {
    const mockProducts = [
      {
        id: 1,
        title: 'Product 1',
        price: 100,
        description: 'Test',
        category: 'electronics',
        image: 'test.jpg',
        rating: { rate: 4.5, count: 100 },
      },
    ];

    // First call
    const promise1 = service.getAllProducts();
    const req1 = httpMock.expectOne('https://fakestoreapi.com/products');
    req1.flush(mockProducts);
    await promise1;

    // Clear cache
    service.clearCache();

    // Second call should make HTTP request again
    const promise2 = service.getAllProducts();
    const req2 = httpMock.expectOne('https://fakestoreapi.com/products');
    req2.flush(mockProducts);
    await promise2;
  });
});
