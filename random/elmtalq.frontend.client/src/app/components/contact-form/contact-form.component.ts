import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss'
})
export class ContactFormComponent {
  contact = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  };

  isSubmitting = false;
  submitSuccess = false;

  inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'support', label: 'Technical Support' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'complaint', label: 'Complaint' }
  ];

  onSubmit() {
    this.isSubmitting = true;
    
    // Simulate API call
    setTimeout(() => {
      console.log('Contact form submitted:', this.contact);
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
    this.contact = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      inquiryType: 'general'
    };
  }
}
