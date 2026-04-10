import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CandidatesService } from '../../../core/services/candidates.service';
import { Candidate } from '../../../core/models/candidate.model';

@Component({
  selector: 'app-candidates-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './candidates-list.component.html',
  styleUrls: ['./candidates-list.component.scss']
})
export class CandidatesListComponent implements OnInit {
  candidates: Candidate[] = [];
  filteredCandidates: Candidate[] = [];
  isLoading = false;
  searchTerm = '';
  selectedCandidates: string[] = [];
  showUnassignedOnly = false;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;

  constructor(private candidatesService: CandidatesService) { }

  ngOnInit(): void {
    this.loadCandidates();
  }

  loadCandidates(): void {
    this.isLoading = true;

    // Reset to page 1 if filtering by unassigned, as the count will change
    if (this.showUnassignedOnly) {
      this.candidatesService.getUnassignedCandidates().subscribe({
        next: (data) => {
          this.candidates = data;
          this.filteredCandidates = data;
          this.totalItems = data.length;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading unassigned candidates:', error);
          this.isLoading = false;
        }
      });
    } else {
      this.candidatesService.getCandidates(this.currentPage, this.pageSize).subscribe({
        next: (pagedResult) => {
          this.candidates = pagedResult.items;
          this.filteredCandidates = pagedResult.items;
          this.totalItems = pagedResult.totalCount;
          this.totalPages = pagedResult.totalPages;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading candidates:', error);
          this.isLoading = false;
        }
      });
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadCandidates();
  }

  filterCandidates(): void {
    // Client-side filtering for current page only
    if (!this.searchTerm) {
      this.filteredCandidates = this.candidates;
      return;
    }

    this.filteredCandidates = this.candidates.filter(candidate =>
      candidate.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      candidate.phoneNumber.includes(this.searchTerm)
    );
  }

  onSearchChange(): void {
    this.filterCandidates();
  }

  toggleUnassignedFilter(): void {
    this.showUnassignedOnly = !this.showUnassignedOnly;
    this.currentPage = 1;
    this.loadCandidates();
  }

  toggleCandidateSelection(candidateId: string): void {
    const index = this.selectedCandidates.indexOf(candidateId);
    if (index > -1) {
      this.selectedCandidates.splice(index, 1);
    } else {
      this.selectedCandidates.push(candidateId);
    }
  }

  selectAllCandidates(): void {
    if (this.selectedCandidates.length === this.filteredCandidates.length) {
      this.selectedCandidates = [];
    } else {
      this.selectedCandidates = this.filteredCandidates.map(c => c.id);
    }
  }

  deleteCandidate(id: string): void {
    if (confirm('Are you sure you want to delete this candidate?')) {
      this.candidatesService.deleteCandidate(id).subscribe({
        next: () => {
          this.loadCandidates();
        },
        error: (error) => {
          console.error('Error deleting candidate:', error);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getExperienceLevel(years?: number): string {
    if (years === undefined || years === null) return 'Not Specified';
    if (years < 2) return 'Junior';
    if (years < 5) return 'Mid-level';
    return 'Senior';
  }
}
