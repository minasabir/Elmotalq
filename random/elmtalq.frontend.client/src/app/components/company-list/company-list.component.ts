import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './company-list.component.html',
  styleUrl: './company-list.component.scss'
})
export class CompanyListComponent {
  companies = [
    {
      id: 1,
      name: 'Tech Solutions Inc.',
      industry: 'Technology',
      size: '201-500 employees',
      location: 'Riyadh, Saudi Arabia',
      website: 'https://techsolutions.com',
      description: 'Leading technology company specializing in software development and digital transformation solutions.',
      foundedYear: '2010',
      benefits: 'Health insurance, flexible hours, remote work options, training programs',
      culture: 'Innovative, collaborative, and growth-oriented environment',
      logo: 'https://via.placeholder.com/150x150?text=TSI',
      rating: 4.5,
      openJobs: 12
    },
    {
      id: 2,
      name: 'HealthCare Plus',
      industry: 'Healthcare',
      size: '500+ employees',
      location: 'Jeddah, Saudi Arabia',
      website: 'https://healthcareplus.com',
      description: 'Premier healthcare provider offering comprehensive medical services across Saudi Arabia.',
      foundedYear: '2005',
      benefits: 'Comprehensive health coverage, professional development, work-life balance',
      culture: 'Patient-centered, compassionate, and professional environment',
      logo: 'https://via.placeholder.com/150x150?text=HCP',
      rating: 4.8,
      openJobs: 8
    },
    {
      id: 3,
      name: 'Finance Hub',
      industry: 'Finance',
      size: '51-200 employees',
      location: 'Dammam, Saudi Arabia',
      website: 'https://financehub.com',
      description: 'Innovative financial services company providing cutting-edge banking and investment solutions.',
      foundedYear: '2015',
      benefits: 'Performance bonuses, stock options, flexible work arrangements',
      culture: 'Dynamic, results-driven, and collaborative team environment',
      logo: 'https://via.placeholder.com/150x150?text=FH',
      rating: 4.2,
      openJobs: 15
    }
  ];

  selectedIndustry = '';
  selectedSize = '';
  searchTerm = '';

  industries = ['All', 'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing'];
  sizes = ['All', '1-10 employees', '11-50 employees', '51-200 employees', '201-500 employees', '500+ employees'];

  get filteredCompanies() {
    return this.companies.filter(company => {
      const matchesIndustry = this.selectedIndustry === 'All' || company.industry === this.selectedIndustry;
      const matchesSize = this.selectedSize === 'All' || company.size === this.selectedSize;
      const matchesSearch = !this.searchTerm || 
        company.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        company.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      return matchesIndustry && matchesSize && matchesSearch;
    });
  }

  viewCompanyDetails(companyId: number) {
    console.log('View company details:', companyId);
    // Navigate to company details page
  }
}
