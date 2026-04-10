import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContentService, SearchResponse } from '../../../core/services/content.service';
import { Candidate } from '../../../core/models/candidate.model';
import { Company } from '../../../core/models/company.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  isSearching = false;
  candidates: Candidate[] = [];
  companies: Company[] = [];
  searchHistory: string[] = [];

  constructor(
    private fb: FormBuilder,
    private contentService: ContentService
  ) {
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

    this.contentService.search(query).subscribe({
      next: (response: SearchResponse) => {
        this.candidates = response.candidates;
        this.companies = response.companies;
        this.isSearching = false;
      },
      error: (error) => {
        console.error('Search failed', error);
        this.isSearching = false;
      }
    });
  }

  clearSearch(): void {
    this.searchForm.patchValue({ query: '' });
    this.candidates = [];
    this.companies = [];
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
