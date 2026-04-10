import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService, ContactData } from '../../services/content.service';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './contact.component.html'
})
export class ContactComponent implements OnInit {
    contactData: ContactData | null = null;
    isLoading = true;
    error = '';

    constructor(private contentService: ContentService) { }

    ngOnInit(): void {
        this.contentService.getContact().subscribe({
            next: (data: ContactData) => {
                this.contactData = data;
                this.isLoading = false;
            },
            error: (err: any) => {
                this.error = 'فشل تحميل بيانات التواصل. يرجى المحاولة لاحقاً.';
                this.isLoading = false;
            }
        });
    }
}
