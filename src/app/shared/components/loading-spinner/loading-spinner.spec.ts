import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingSpinner } from './loading-spinner';

describe('LoadingSpinner', () => {
  let component: LoadingSpinner;
  let fixture: ComponentFixture<LoadingSpinner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSpinner],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSpinner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Loading...');
  });

  it('should display custom message', () => {
    component.message = 'Loading products...';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Loading products...');
  });

  it('should return correct size class for sm', () => {
    component.size = 'sm';
    expect(component.sizeClass).toBe('w-6 h-6');
  });

  it('should return correct size class for md', () => {
    component.size = 'md';
    expect(component.sizeClass).toBe('w-12 h-12');
  });

  it('should return correct size class for lg', () => {
    component.size = 'lg';
    expect(component.sizeClass).toBe('w-16 h-16');
  });
});
