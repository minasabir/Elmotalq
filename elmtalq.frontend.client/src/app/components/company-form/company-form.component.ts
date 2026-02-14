import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './company-form.component.html',
  styleUrl: './company-form.component.scss'
})
export class CompanyFormComponent {
  company = {
    name: '',
    industry: '',
    size: '',
    location: '',
    website: '',
    description: '',
    foundedYear: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    benefits: '',
    culture: ''
  };

  isSubmitting = false;
  submitSuccess = false;

  industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
    'Retail', 'Consulting', 'Media', 'Transportation', 'Other'
  ];

  companySizes = [
    '1-10 employees', '11-50 employees', '51-200 employees',
    '201-500 employees', '500+ employees'
  ];

  onSubmit() {
    this.isSubmitting = true;
    
    // Simulate API call
    setTimeout(() => {
      console.log('Company submitted:', this.company);
      this.submitSuccess = true;
      this.isSubmitting = false;
      
      // Reset form after 3 seconds
      setTimeout(() => {
        this.resetForm();
        this.submitSuccess = false;
      }, 3000);
    }, 2000);
  }

  resetForm() {
    this.company = {
      name: '',
      industry: '',
      size: '',
      location: '',
      website: '',
      description: '',
      foundedYear: '',
      contactPerson: '',
      contactEmail: '',
      contactPhone: '',
      benefits: '',
      culture: ''
    };
  }
}
