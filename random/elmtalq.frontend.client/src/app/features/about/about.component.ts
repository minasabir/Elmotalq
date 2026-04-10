import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService, AboutData } from '../../services/content.service';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit {
    aboutData: AboutData | null = null;
    isLoading = true;
    error = '';

    constructor(private contentService: ContentService) { }

    ngOnInit(): void {
        this.contentService.getAbout().subscribe({
            next: (data: AboutData) => {
                this.aboutData = data;
                this.isLoading = false;
            },
            error: (err: any) => {
                this.error = 'فشل تحميل بيانات عن الشركة. يرجى المحاولة لاحقاً.';
                this.isLoading = false;
            }
        });
    }
}
