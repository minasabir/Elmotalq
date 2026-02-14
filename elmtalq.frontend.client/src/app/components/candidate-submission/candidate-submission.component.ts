import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, EmailValidator } from '@angular/forms';
import { ApiService, CandidateCreateDto } from '../../services/api.service';

@Component({
  selector: 'app-candidate-submission',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './candidate-submission.component.html',
  styleUrl: './candidate-submission.component.scss'
})
export class CandidateSubmissionComponent implements OnInit {
  candidateForm!: FormGroup;
  isSubmitting = false;
  isSubmitted = false;
  uploadProgress = 0;
  resumeFile: File | null = null;
  
  // Form field configurations
  experienceLevels = [
    'Entry Level (0-2 years)',
    'Junior (2-5 years)',
    'Mid-Level (5-10 years)',
    'Senior (10+ years)',
    'Lead/Manager (15+ years)'
  ];

  educationLevels = [
    'High School',
    'Associate Degree',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'PhD/Doctorate',
    'Professional Certification'
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.candidateForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-Z\s\-']+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(255)
      ]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^[\+]?[0-9\s\-\(\)]{10,20}$/)
      ]],
      location: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(200)
      ]],
      jobTitle: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      experience: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(2000)
      ]],
      education: ['', [
        Validators.required,
        Validators.maxLength(100)
      ]],
      skills: ['', [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(1000)
      ]],
      resume: [null] // Optional file upload
    });
  }

  // Custom validators
  get name() { return this.candidateForm.get('name'); }
  get email() { return this.candidateForm.get('email'); }
  get phone() { return this.candidateForm.get('phone'); }
  get location() { return this.candidateForm.get('location'); }
  get jobTitle() { return this.candidateForm.get('jobTitle'); }
  get experience() { return this.candidateForm.get('experience'); }
  get education() { return this.candidateForm.get('education'); }
  get skills() { return this.candidateForm.get('skills'); }
  get resume() { return this.candidateForm.get('resume'); }

  // Field validation helpers
  isFieldInvalid(fieldName: string): boolean {
    const field = this.candidateForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.candidateForm.get(fieldName);
    if (!field || !field.errors) return '';

    const errors = field.errors;
    
    if (errors['required']) return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    if (errors['email']) return 'Please enter a valid email address';
    if (errors['minlength']) return `Minimum ${errors['minlength'].requiredLength} characters required`;
    if (errors['maxlength']) return `Maximum ${errors['maxlength'].requiredLength} characters allowed`;
    if (errors['pattern']) {
      if (fieldName === 'phone') return 'Please enter a valid phone number (e.g., +966 500 123456)';
      if (fieldName === 'name') return 'Only letters, spaces, hyphens, and apostrophes allowed';
    }
    
    return 'Invalid input';
  }

  // File upload handling
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF or Word document');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      this.resumeFile = file;
      this.resume?.setValue(file);
    }
  }

  removeResume(): void {
    this.resumeFile = null;
    this.resume?.setValue(null);
    const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  // Form submission
  onSubmit(): void {
    if (this.candidateForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.candidateForm.controls).forEach(key => {
        this.candidateForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    
    const formData: CandidateCreateDto = {
      ...this.candidateForm.value,
      resume: this.resumeFile || undefined
    };

    this.apiService.createCandidate(formData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.isSubmitted = true;
        console.log('Candidate submitted successfully:', response);
        
        // Reset form after successful submission
        setTimeout(() => {
          this.resetForm();
        }, 3000);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Submission error:', error);
        alert(`Error: ${error}`);
      }
    });
  }

  resetForm(): void {
    this.candidateForm.reset();
    this.resumeFile = null;
    this.isSubmitted = false;
    const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  // Progress simulation for file upload
  simulateUploadProgress(): void {
    if (this.resumeFile) {
      this.uploadProgress = 0;
      const interval = setInterval(() => {
        this.uploadProgress += 10;
        if (this.uploadProgress >= 100) {
          clearInterval(interval);
        }
      }, 100);
    }
  }

  // Utility methods
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getCharacterCount(fieldName: string): number {
    const field = this.candidateForm.get(fieldName);
    return field?.value?.length || 0;
  }

  getMaxCharacters(fieldName: string): number {
    const field = this.candidateForm.get(fieldName);
    const errors = field?.errors;
    return errors?.['maxlength']?.requiredLength || 1000;
  }
}
