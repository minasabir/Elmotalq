import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  activeTab = 'about';
  isSaving = false;
  saveMessage = '';

  aboutForm: FormGroup;
  contactForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.aboutForm = this.fb.group({
      companyName: ['Elmtalq'],
      description: ['Your Gateway to Global Opportunities'],
      mission: ['Connecting talent with opportunity worldwide'],
      vision: ['To be the leading recruitment platform in the region']
    });

    this.contactForm = this.fb.group({
      email: ['info@elmtalq.com'],
      phone: ['+966 12 345 6789'],
      address: ['Riyadh, Saudi Arabia'],
      website: ['https://elmtalq.com']
    });
  }

  ngOnInit(): void {
    // Load settings from API if needed
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  saveAboutSettings(): void {
    this.isSaving = true;
    this.saveMessage = '';

    // Simulate API call
    setTimeout(() => {
      this.isSaving = false;
      this.saveMessage = 'About settings saved successfully!';
      setTimeout(() => {
        this.saveMessage = '';
      }, 3000);
    }, 1000);
  }

  saveContactSettings(): void {
    this.isSaving = true;
    this.saveMessage = '';

    // Simulate API call
    setTimeout(() => {
      this.isSaving = false;
      this.saveMessage = 'Contact settings saved successfully!';
      setTimeout(() => {
        this.saveMessage = '';
      }, 3000);
    }, 1000);
  }

  resetForm(formName: string): void {
    if (formName === 'about') {
      this.aboutForm.reset();
    } else if (formName === 'contact') {
      this.contactForm.reset();
    }
  }
}
