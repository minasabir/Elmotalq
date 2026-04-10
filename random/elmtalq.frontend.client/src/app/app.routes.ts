import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout.component';

export class FeatureModule { } // Placeholder for lazy loading if needed later

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
            },
            {
                path: 'about',
                loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent)
            },
            {
                path: 'candidates',
                loadComponent: () => import('./features/candidates/candidate-apply/candidate-apply.component').then(m => m.CandidateApplyComponent)
            },
            {
                path: 'companies',
                loadComponent: () => import('./features/companies/company-request/company-request.component').then(m => m.CompanyRequestComponent)
            },
            {
                path: 'contact',
                loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent)
            }
        ]
    },
    { path: '**', redirectTo: '' }
];
