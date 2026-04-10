import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContentService } from '../../../core/services/content.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  activeTab = 'about';
  isLoading = true;
  isSaving = false;
  saveMessage = '';
  errorMessage = '';

  aboutForm: FormGroup;
  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private contentService: ContentService
  ) {
    this.aboutForm = this.fb.group({
      companyDescription: ['', Validators.required],
      officeLocation: ['', Validators.required]
    });

    this.contactForm = this.fb.group({
      contactEmail: ['', [Validators.required, Validators.email]],
      contactPhone: ['', Validators.required],
      whatsapp: [''],
      facebook: [''],
      instagram: [''],
      linkedin: ['']
    });
  }

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.isLoading = true;

    // Load About
    this.contentService.getAbout().subscribe({
      next: (about) => {
        this.aboutForm.patchValue({
          companyDescription: about.companyDescription,
          officeLocation: about.officeLocation
        });

        // Load Contact
        this.contentService.getContact().subscribe({
          next: (contact) => {
            this.contactForm.patchValue({
              contactEmail: contact.email,
              contactPhone: contact.phone,
              whatsapp: contact.whatsApp,
              facebook: contact.facebook,
              instagram: contact.instagram,
              linkedin: contact.linkedIn
            });
            this.isLoading = false;
          },
          error: (err) => {
            this.errorMessage = 'Failed to load contact info';
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        this.errorMessage = 'Failed to load about info';
        this.isLoading = false;
      }
    });
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  saveAboutSettings(): void {
    if (this.aboutForm.invalid) return;

    this.isSaving = true;
    this.saveMessage = '';
    this.errorMessage = '';

    this.contentService.updateAbout(this.aboutForm.value).subscribe({
      next: () => {
        this.isSaving = false;
        this.saveMessage = 'About settings saved successfully!';
        setTimeout(() => this.saveMessage = '', 3000);
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = 'Failed to save about settings';
      }
    });
  }

  saveContactSettings(): void {
    if (this.contactForm.invalid) return;

    this.isSaving = true;
    this.saveMessage = '';
    this.errorMessage = '';

    this.contentService.updateContact(this.contactForm.value).subscribe({
      next: () => {
        this.isSaving = false;
        this.saveMessage = 'Contact settings saved successfully!';
        setTimeout(() => this.saveMessage = '', 3000);
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = 'Failed to save contact settings';
      }
    });
  }

  resetForm(formName: string): void {
    if (formName === 'about') {
      this.aboutForm.reset();
    } else if (formName === 'contact') {
      this.contactForm.reset();
    }
  }
}
