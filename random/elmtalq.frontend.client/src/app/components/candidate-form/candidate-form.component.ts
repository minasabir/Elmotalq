import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-candidate-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './candidate-form.component.html',
  styleUrl: './candidate-form.component.scss'
})
export class CandidateFormComponent {
  candidate = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    jobTitle: '',
    experience: '',
    education: '',
    skills: '',
    summary: '',
    linkedIn: '',
    portfolio: ''
  };

  isSubmitting = false;
  submitSuccess = false;

  onSubmit() {
    this.isSubmitting = true;
    
    // Simulate API call
    setTimeout(() => {
      console.log('Candidate submitted:', this.candidate);
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
    this.candidate = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      jobTitle: '',
      experience: '',
      education: '',
      skills: '',
      summary: '',
      linkedIn: '',
      portfolio: ''
    };
  }
}
