import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  isSearching = false;
  searchResults: any[] = [];
  searchHistory: string[] = [];

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      query: [''],
      searchType: ['all'],
      dateRange: ['all']
    });
  }

  ngOnInit(): void {
    // Load search history from localStorage
    const history = localStorage.getItem('searchHistory');
    if (history) {
      this.searchHistory = JSON.parse(history);
    }
  }

  onSearch(): void {
    const query = this.searchForm.value.query?.trim();
    if (!query) return;

    this.isSearching = true;
    
    // Add to search history
    if (!this.searchHistory.includes(query)) {
      this.searchHistory.unshift(query);
      if (this.searchHistory.length > 10) {
        this.searchHistory.pop();
      }
      localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    }

    // Simulate search API call
    setTimeout(() => {
      this.searchResults = [];
      this.isSearching = false;
    }, 1000);
  }

  clearSearch(): void {
    this.searchForm.patchValue({ query: '' });
    this.searchResults = [];
  }

  selectHistoryItem(item: string): void {
    this.searchForm.patchValue({ query: item });
    this.onSearch();
  }

  clearHistory(): void {
    this.searchHistory = [];
    localStorage.removeItem('searchHistory');
  }

  getSearchTypeLabel(type: string): string {
    switch (type) {
      case 'candidates': return 'Candidates';
      case 'companies': return 'Companies';
      case 'employees': return 'Employees';
      default: return 'All';
    }
  }
}
