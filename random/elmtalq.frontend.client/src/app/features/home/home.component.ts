import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, HealthResponse } from '../../services/api.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
    health: HealthResponse | null = null;
    isLoading = true;
    error = '';
    services = [
        { title: 'خدمة 1', description: 'وصف الخدمة 1' },
        { title: 'خدمة 2', description: 'وصف الخدمة 2' },
        { title: 'خدمة 3', description: 'وصف الخدمة 3' }
    ];
    whyChooseUs = [
        { title: 'الميزة 1', description: 'وصف الميزة 1' },
        { title: 'الميزة 2', description: 'وصف الميزة 2' },
        { title: 'الميزة 3', description: 'وصف الميزة 3' }
    ];

    constructor(private apiService: ApiService) {
        this.apiService.getHealth().subscribe({
            next: (data) => {
                this.health = data;
                this.isLoading = false;
            },
            error: () => {
                this.error = 'فشل التحقق من حالة النظام. يرجى المحاولة لاحقاً.';
                this.isLoading = false;
            }
        });
    }
}
