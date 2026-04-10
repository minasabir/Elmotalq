import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CandidatesService } from '../../../core/services/candidates.service';
import { Candidate, UpdateCandidateRequest } from '../../../core/models/candidate.model';

@Component({
    selector: 'app-candidate-edit',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
    templateUrl: './candidate-edit.component.html',
    styleUrls: []
})
export class CandidateEditComponent implements OnInit {
    editForm: FormGroup;
    candidateId: string | null = null;
    isLoading = true;
    isSaving = false;
    error: string | null = null;
    successMessage: string | null = null;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private candidatesService: CandidatesService
    ) {
        this.editForm = this.fb.group({
            fullName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phoneNumber: ['', Validators.required],
            jobTitle: ['', Validators.required],
            gender: [0, Validators.required],
            educationalQualification: [0],
            yearsOfExperience: [0],
            graduationYear: [null],
            country: [''],
            governorate: ['']
        });
    }

    ngOnInit(): void {
        this.candidateId = this.route.snapshot.paramMap.get('id');
        if (this.candidateId) {
            this.loadCandidate(this.candidateId);
        } else {
            this.error = 'No candidate ID provided';
            this.isLoading = false;
        }
    }

    loadCandidate(id: string): void {
        this.isLoading = true;
        this.candidatesService.getCandidate(id).subscribe({
            next: (candidate) => {
                this.editForm.patchValue({
                    fullName: candidate.fullName,
                    email: candidate.email,
                    phoneNumber: candidate.phoneNumber,
                    jobTitle: candidate.jobTitle,
                    gender: candidate.gender,
                    educationalQualification: candidate.educationalQualification,
                    yearsOfExperience: candidate.yearsOfExperience,
                    graduationYear: candidate.graduationYear,
                    country: candidate.country,
                    governorate: candidate.governorate
                });
                this.isLoading = false;
            },
            error: (err) => {
                this.error = 'Error loading candidate data';
                this.isLoading = false;
            }
        });
    }

    onSubmit(): void {
        if (this.editForm.invalid || !this.candidateId) return;

        this.isSaving = true;
        this.error = null;
        this.successMessage = null;

        const request: UpdateCandidateRequest = {
            fullName: this.editForm.value.fullName,
            email: this.editForm.value.email,
            phoneNumber: this.editForm.value.phoneNumber,
            city: this.editForm.value.governorate, // Map governorate to city if needed by backend DTO
            yearsOfExperience: this.editForm.value.yearsOfExperience,
            currentJobTitle: this.editForm.value.jobTitle, // Check backend property name for Update DTO
            educationalQualification: String(this.editForm.value.educationalQualification)
        };

        this.candidatesService.updateCandidate(this.candidateId, request).subscribe({
            next: () => {
                this.isSaving = false;
                this.successMessage = 'Candidate updated successfully';
                setTimeout(() => this.router.navigate(['/candidates', this.candidateId]), 2000);
            },
            error: (err) => {
                this.error = 'Error updating candidate';
                this.isSaving = false;
            }
        });
    }
}
