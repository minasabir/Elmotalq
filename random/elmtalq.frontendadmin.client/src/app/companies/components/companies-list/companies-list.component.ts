import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CompaniesService } from '../../../core/services/companies.service';
import { Company } from '../../../core/models/company.model';

@Component({
  selector: 'app-companies-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './companies-list.component.html',
  styleUrls: []
})
export class CompaniesListComponent implements OnInit {
  companies: Company[] = [];
  filteredCompanies: Company[] = [];
  isLoading = false;
  searchTerm = '';
  selectedCompanies: string[] = [];
  showUnassignedOnly = false;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;

  constructor(private companiesService: CompaniesService) { }

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.isLoading = true;

    // Reset to page 1 if filtering by unassigned, as the count will change
    // Note: unassigned endpoint might not support pagination yet based on backend implementation
    // For now we'll assume main list is paginated

    if (this.showUnassignedOnly) {
      this.companiesService.getUnassignedCompanies().subscribe({
        next: (data) => {
          this.companies = data;
          this.filteredCompanies = data;
          this.totalItems = data.length;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading unassigned companies:', error);
          this.isLoading = false;
        }
      });
    } else {
      this.companiesService.getCompanies(this.currentPage, this.pageSize).subscribe({
        next: (pagedResult) => {
          this.companies = pagedResult.items;
          this.filteredCompanies = pagedResult.items;
          this.totalItems = pagedResult.totalCount;
          this.totalPages = pagedResult.totalPages;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading companies:', error);
          this.isLoading = false;
        }
      });
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadCompanies();
  }

  filterCompanies(): void {
    // Client-side filtering for current page only - ideally this should be server-side
    // For now, we'll keep it simple or we should implement server-side search
    if (!this.searchTerm) {
      this.filteredCompanies = this.companies;
      return;
    }

    this.filteredCompanies = this.companies.filter(company =>
      company.companyName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      company.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      company.contactPhone.includes(this.searchTerm)
    );
  }

  onSearchChange(): void {
    // For a real search, we should debounce and call the API with search params
    // But since we just added pagination to the main list, we'll stick to client-side filter of current page
    // OR ideally: reset to page 1 and reload
    // this.currentPage = 1;
    // this.loadCompanies(); // This would need search params in the API
    this.filterCompanies();
  }

  toggleUnassignedFilter(): void {
    this.showUnassignedOnly = !this.showUnassignedOnly;
    this.currentPage = 1;
    this.loadCompanies();
  }

  toggleCompanySelection(companyId: string): void {
    const index = this.selectedCompanies.indexOf(companyId);
    if (index > -1) {
      this.selectedCompanies.splice(index, 1);
    } else {
      this.selectedCompanies.push(companyId);
    }
  }

  selectAllCompanies(): void {
    if (this.selectedCompanies.length === this.filteredCompanies.length) {
      this.selectedCompanies = [];
    } else {
      this.selectedCompanies = this.filteredCompanies.map(c => c.id);
    }
  }

  deleteCompany(id: string): void {
    if (confirm('Are you sure you want to delete this company?')) {
      this.companiesService.deleteCompany(id).subscribe({
        next: () => {
          this.loadCompanies();
        },
        error: (error) => {
          console.error('Error deleting company:', error);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}
