import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CandidatesService } from '../../../core/services/candidates.service';
import { Candidate } from '../../../core/models/candidate.model';

@Component({
    selector: 'app-candidate-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './candidate-detail.component.html',
    styleUrls: []
})
export class CandidateDetailComponent implements OnInit {
    candidate: Candidate | null = null;
    isLoading = true;
    error: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private candidatesService: CandidatesService
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadCandidate(id);
        } else {
            this.error = 'No candidate ID provided';
            this.isLoading = false;
        }
    }

    loadCandidate(id: string): void {
        this.isLoading = true;
        this.candidatesService.getCandidate(id).subscribe({
            next: (data) => {
                this.candidate = data;
                this.isLoading = false;
            },
            error: (err) => {
                this.error = 'Error loading candidate details';
                this.isLoading = false;
                console.error(err);
            }
        });
    }

    getEducationalQualificationLabel(val?: number): string {
        const labels = ['High School', 'Diploma', 'Bachelor', 'Master', 'PhD', 'Other'];
        return (val !== undefined && val !== null) ? labels[val] : 'Not Specified';
    }

    getGenderLabel(val?: number): string {
        return val === 1 ? 'Female' : 'Male';
    }

    getFileUrl(path?: string): string {
        if (!path) return '';
        // Handle relative paths from the backend (assuming they are served from base URL)
        return path;
    }

    openUrl(url: string): void {
        if (url) {
            window.open(url, '_blank');
        }
    }
}
