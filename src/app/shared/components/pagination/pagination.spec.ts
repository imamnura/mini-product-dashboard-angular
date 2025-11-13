import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pagination } from './pagination';

describe('Pagination', () => {
  let component: Pagination;
  let fixture: ComponentFixture<Pagination>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pagination],
    }).compileComponents();

    fixture = TestBed.createComponent(Pagination);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate total pages correctly', () => {
    component.totalItems = 100;
    component.itemsPerPage = 10;
    expect(component.totalPages).toBe(10);
  });

  it('should calculate total pages with remainder', () => {
    component.totalItems = 105;
    component.itemsPerPage = 10;
    expect(component.totalPages).toBe(11);
  });

  it('should emit page change event', () => {
    spyOn(component.pageChange, 'emit');
    component.currentPage = 1;
    component.totalItems = 100;
    component.itemsPerPage = 10;

    component.goToPage(2);

    expect(component.pageChange.emit).toHaveBeenCalledWith(2);
  });

  it('should not emit event if page is same as current', () => {
    spyOn(component.pageChange, 'emit');
    component.currentPage = 2;
    component.totalItems = 100;
    component.itemsPerPage = 10;

    component.goToPage(2);

    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });

  it('should not emit event if page is out of range', () => {
    spyOn(component.pageChange, 'emit');
    component.currentPage = 1;
    component.totalItems = 100;
    component.itemsPerPage = 10;

    component.goToPage(0); // Too low
    component.goToPage(11); // Too high

    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });

  it('should go to next page', () => {
    spyOn(component.pageChange, 'emit');
    component.currentPage = 2;
    component.totalItems = 100;
    component.itemsPerPage = 10;

    component.nextPage();

    expect(component.pageChange.emit).toHaveBeenCalledWith(3);
  });

  it('should go to previous page', () => {
    spyOn(component.pageChange, 'emit');
    component.currentPage = 3;
    component.totalItems = 100;
    component.itemsPerPage = 10;

    component.previousPage();

    expect(component.pageChange.emit).toHaveBeenCalledWith(2);
  });
});
