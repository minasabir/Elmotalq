import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CompaniesService } from '../../../core/services/companies.service';
import { Company } from '../../../core/models/company.model';

@Component({
    selector: 'app-company-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './company-detail.component.html',
    styleUrls: []
})
export class CompanyDetailComponent implements OnInit {
    company: Company | null = null;
    isLoading = true;
    error: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private companiesService: CompaniesService
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadCompany(id);
        } else {
            this.error = 'No company ID provided';
            this.isLoading = false;
        }
    }

    loadCompany(id: string): void {
        this.isLoading = true;
        this.companiesService.getCompany(id).subscribe({
            next: (data) => {
                this.company = data;
                this.isLoading = false;
            },
            error: (err) => {
                this.error = 'Error loading company details';
                this.isLoading = false;
                console.error(err);
            }
        });
    }
}
