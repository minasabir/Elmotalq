import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompaniesService } from '../../../core/services/companies.service';
import { Company, UpdateCompanyRequest } from '../../../core/models/company.model';

@Component({
    selector: 'app-company-edit',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
    templateUrl: './company-edit.component.html',
    styleUrls: []
})
export class CompanyEditComponent implements OnInit {
    editForm: FormGroup;
    companyId: string | null = null;
    isLoading = true;
    isSaving = false;
    error: string | null = null;
    successMessage: string | null = null;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private companiesService: CompaniesService
    ) {
        this.editForm = this.fb.group({
            companyName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            contactPhone: ['', Validators.required],
            companyIndustry: ['', Validators.required],
            requiredJobTitle: ['', Validators.required],
            country: ['', Validators.required],
            city: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.companyId = this.route.snapshot.paramMap.get('id');
        if (this.companyId) {
            this.loadCompany(this.companyId);
        } else {
            this.error = 'No company ID provided';
            this.isLoading = false;
        }
    }

    loadCompany(id: string): void {
        this.isLoading = true;
        this.companiesService.getCompany(id).subscribe({
            next: (company) => {
                this.editForm.patchValue({
                    companyName: company.companyName,
                    email: company.email,
                    contactPhone: company.contactPhone,
                    companyIndustry: company.companyIndustry,
                    requiredJobTitle: company.requiredJobTitle,
                    country: company.country,
                    city: company.city
                });
                this.isLoading = false;
            },
            error: (err) => {
                this.error = 'Error loading company data';
                this.isLoading = false;
            }
        });
    }

    onSubmit(): void {
        if (this.editForm.invalid || !this.companyId) return;

        this.isSaving = true;
        this.error = null;
        this.successMessage = null;

        const request: UpdateCompanyRequest = {
            companyName: this.editForm.value.companyName,
            companyEmail: this.editForm.value.email, // Check backend property name for Update DTO
            phoneNumber: this.editForm.value.contactPhone, // Check backend property name for Update DTO
            industrySector: this.editForm.value.companyIndustry,
            jobTitleDescription: this.editForm.value.requiredJobTitle,
            estimatedHiringNeeds: '1' // Defaulting or adding to form if needed
        };

        this.companiesService.updateCompany(this.companyId, request).subscribe({
            next: () => {
                this.isSaving = false;
                this.successMessage = 'Company updated successfully';
                setTimeout(() => this.router.navigate(['/companies', this.companyId]), 2000);
            },
            error: (err) => {
                this.error = 'Error updating company';
                this.isSaving = false;
            }
        });
    }
}
