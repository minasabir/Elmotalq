import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from '../../../services/company.service';

@Component({
    selector: 'app-company-request',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './company-request.component.html',
    styleUrl: './company-request.component.scss'
})
export class CompanyRequestComponent {
    requestForm: FormGroup;
    isSubmitting = false;
    successMessage = '';
    errorMessage = '';

    constructor(private fb: FormBuilder, private companyService: CompanyService) {
        this.requestForm = this.fb.group({
            companyName: ['', [Validators.required]],
            contactPhone: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            country: ['', [Validators.required]],
            city: ['', [Validators.required]],
            requiredJobTitle: ['', [Validators.required]],
            companyIndustry: ['', [Validators.required]]
        });
    }

    onSubmit() {
        if (this.requestForm.valid) {
            this.isSubmitting = true;
            this.successMessage = '';
            this.errorMessage = '';

            // The mapping is now handled in the service
            this.companyService.request(this.requestForm.value).subscribe({
                next: (response) => {
                    this.successMessage = 'تم إرسال طلبكم بنجاح. سنقوم بمراجعته والتواصل معكم قريباً.';
                    this.requestForm.reset();
                    this.isSubmitting = false;
                },
                error: (err) => {
                    this.errorMessage = 'عذراً، حدث خطأ أثناء إرسال الطلب. يرجى التأكد من البيانات والمحاولة مرة أخرى.';
                    this.isSubmitting = false;
                }
            });
        } else {
            this.requestForm.markAllAsTouched();
        }
    }
}
