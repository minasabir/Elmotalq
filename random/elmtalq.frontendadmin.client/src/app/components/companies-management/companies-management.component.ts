import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-companies-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './companies-management.component.html',
  styleUrl: './companies-management.component.scss'
})
export class CompaniesManagementComponent {
  companies = [
    {
      id: 1,
      name: 'Tech Solutions Inc.',
      industry: 'Technology',
      size: '201-500 employees',
      location: 'Riyadh, Saudi Arabia',
      website: 'https://techsolutions.com',
      contactPerson: 'Ahmed Al-Rashid',
      contactEmail: 'ahmed@techsolutions.com',
      contactPhone: '+966 500 123456',
      status: 'active',
      registeredDate: '2024-01-10',
      jobPostings: 12
    },
    {
      id: 2,
      name: 'HealthCare Plus',
      industry: 'Healthcare',
      size: '500+ employees',
      location: 'Jeddah, Saudi Arabia',
      website: 'https://healthcareplus.com',
      contactPerson: 'Dr. Fatima Al-Saud',
      contactEmail: 'fatima@healthcareplus.com',
      contactPhone: '+966 500 789012',
      status: 'active',
      registeredDate: '2024-01-08',
      jobPostings: 8
    },
    {
      id: 3,
      name: 'Finance Hub',
      industry: 'Finance',
      size: '51-200 employees',
      location: 'Dammam, Saudi Arabia',
      website: 'https://financehub.com',
      contactPerson: 'Mohammed Al-Qahtani',
      contactEmail: 'mohammed@financehub.com',
      contactPhone: '+966 500 345678',
      status: 'inactive',
      registeredDate: '2024-01-05',
      jobPostings: 15
    }
  ];

  searchTerm = '';
  selectedIndustry = 'all';
  selectedStatus = 'all';
  selectedCompany: any = null;
  showDetails = false;

  industries = ['All', 'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing'];

  get filteredCompanies() {
    return this.companies.filter(company => {
      const matchesSearch = !this.searchTerm || 
        company.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        company.contactPerson.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        company.location.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesIndustry = this.selectedIndustry === 'all' || company.industry === this.selectedIndustry;
      const matchesStatus = this.selectedStatus === 'all' || company.status === this.selectedStatus;
      
      return matchesSearch && matchesIndustry && matchesStatus;
    });
  }

  viewCompanyDetails(company: any) {
    this.selectedCompany = company;
    this.showDetails = true;
  }

  closeDetails() {
    this.showDetails = false;
    this.selectedCompany = null;
  }

  updateCompanyStatus(companyId: number, newStatus: string) {
    const company = this.companies.find(c => c.id === companyId);
    if (company) {
      company.status = newStatus;
    }
  }

  deleteCompany(companyId: number) {
    if (confirm('Are you sure you want to delete this company?')) {
      this.companies = this.companies.filter(c => c.id !== companyId);
      if (this.selectedCompany?.id === companyId) {
        this.closeDetails();
      }
    }
  }

  exportCompanies() {
    console.log('Exporting companies...');
  }

  addNewCompany() {
    console.log('Adding new company...');
  }
}
