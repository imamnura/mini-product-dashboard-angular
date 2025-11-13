import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  @Output() search = new EventEmitter<string>();
  searchQuery = '';
  private searchSubject = new Subject<string>();

  constructor(private router: Router) {
    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe((query) => {
      if (query.trim()) {
        this.router.navigate(['/'], { queryParams: { search: query } });
      } else {
        this.router.navigate(['/']);
      }
      this.search.emit(query);
    });
  }

  onSearchInput(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery = query;
    this.searchSubject.next(query);
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }
}
