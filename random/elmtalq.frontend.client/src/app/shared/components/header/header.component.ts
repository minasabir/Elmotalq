import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
    navItems = [
        { label: 'الرئيسية', path: '/' },
        { label: 'خدماتنا', path: '/services' },
        { label: 'عن الشركة', path: '/about' },
        { label: 'وظائف', path: '/candidates' },
        { label: 'اتصل بنا', path: '/contact' }
    ];
}
