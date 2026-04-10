import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CandidateService } from '../../../services/candidate.service';

@Component({
    selector: 'app-candidate-apply',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './candidate-apply.component.html',
    styleUrl: './candidate-apply.component.scss'
})
export class CandidateApplyComponent {
    applyForm: FormGroup;
    selectedCV: File | null = null;
    selectedPhoto: File | null = null;
    selectedVideo: File | null = null;
    isSubmitting = false;
    successMessage = '';
    errorMessage = '';

    constructor(private fb: FormBuilder, private candidateService: CandidateService) {
        this.applyForm = this.fb.group({
            fullName: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9+ ]+$/)]],
            jobTitle: ['', [Validators.required]],
            gender: [0, [Validators.required]], // 0 = Male, 1 = Female
            educationalQualification: [null],
            yearsOfExperience: [null],
            graduationYear: [null, [Validators.min(1900), Validators.max(2100)]],
            country: [''],
            governorate: ['']
        });
    }

    onCVSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedCV = file;
        }
    }

    onPhotoSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedPhoto = file;
        }
    }

    onVideoSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedVideo = file;
        }
    }

    onSubmit() {
        if (this.applyForm.valid) {
            this.isSubmitting = true;
            this.successMessage = '';
            this.errorMessage = '';

            const formData = {
                ...this.applyForm.value,
                gender: Number(this.applyForm.value.gender ?? 0),
                educationalQualification: this.applyForm.value.educationalQualification ? Number(this.applyForm.value.educationalQualification) : null,
                yearsOfExperience: this.applyForm.value.yearsOfExperience ? Number(this.applyForm.value.yearsOfExperience) : null,
                graduationYear: this.applyForm.value.graduationYear ? Number(this.applyForm.value.graduationYear) : null,
                cvFile: this.selectedCV,
                personalPhotoFile: this.selectedPhoto,
                introductionVideoFile: this.selectedVideo
            };

            this.candidateService.apply(formData).subscribe({
                next: (response) => {
                    this.successMessage = 'تم إرسال طلبك بنجاح. سنتواصل معك قريباً.';
                    this.applyForm.reset();
                    this.selectedCV = null;
                    this.selectedPhoto = null;
                    this.selectedVideo = null;
                    this.isSubmitting = false;
                },
                error: (err) => {
                    this.errorMessage = 'عذراً، حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.';
                    this.isSubmitting = false;
                }
            });
        } else {
            this.applyForm.markAllAsTouched();
        }
    }
}
