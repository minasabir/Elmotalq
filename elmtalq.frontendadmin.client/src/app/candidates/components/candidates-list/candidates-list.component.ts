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

  constructor(private candidatesService: CandidatesService) {}

  ngOnInit(): void {
    this.loadCandidates();
  }

  loadCandidates(): void {
    this.isLoading = true;
    const service = this.showUnassignedOnly 
      ? this.candidatesService.getUnassignedCandidates()
      : this.candidatesService.getCandidates();

    service.subscribe({
      next: (data) => {
        this.candidates = data;
        this.filteredCandidates = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading candidates:', error);
        this.isLoading = false;
      }
    });
  }

  filterCandidates(): void {
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

  getExperienceLevel(years: number): string {
    if (years < 2) return 'Junior';
    if (years < 5) return 'Mid-level';
    return 'Senior';
  }
}
