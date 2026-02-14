import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompaniesService } from '../../../core/services/companies.service';
import { Company } from '../../../core/models/company.model';

@Component({
  selector: 'app-companies-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './companies-list.component.html',
  styleUrls: ['./companies-list.component.scss']
})
export class CompaniesListComponent implements OnInit {
  companies: Company[] = [];
  filteredCompanies: Company[] = [];
  isLoading = false;
  searchTerm = '';
  selectedCompanies: string[] = [];
  showUnassignedOnly = false;

  constructor(private companiesService: CompaniesService) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.isLoading = true;
    const service = this.showUnassignedOnly 
      ? this.companiesService.getUnassignedCompanies()
      : this.companiesService.getCompanies();

    service.subscribe({
      next: (data) => {
        this.companies = data;
        this.filteredCompanies = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading companies:', error);
        this.isLoading = false;
      }
    });
  }

  filterCompanies(): void {
    this.filteredCompanies = this.companies.filter(company =>
      company.companyName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      company.companyEmail.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      company.contactPerson.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onSearchChange(): void {
    this.filterCompanies();
  }

  toggleUnassignedFilter(): void {
    this.showUnassignedOnly = !this.showUnassignedOnly;
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
