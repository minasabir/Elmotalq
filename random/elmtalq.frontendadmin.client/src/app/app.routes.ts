import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './auth/components/login/login.component';
import { MainLayoutComponent } from './shared/components/layout/main-layout/main-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CandidatesListComponent } from './candidates/components/candidates-list/candidates-list.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login - Elmtalq Admin'
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        title: 'Dashboard - Elmtalq Admin'
      },
      {
        path: 'candidates',
        component: CandidatesListComponent,
        title: 'Candidates - Elmtalq Admin'
      },
      {
        path: 'candidates/:id',
        loadComponent: () => import('./candidates/components/candidate-detail/candidate-detail.component').then(m => m.CandidateDetailComponent),
        title: 'Candidate Details - Elmtalq Admin'
      },
      {
        path: 'candidates/:id/edit',
        loadComponent: () => import('./candidates/components/candidate-edit/candidate-edit.component').then(m => m.CandidateEditComponent),
        title: 'Edit Candidate - Elmtalq Admin'
      },
      {
        path: 'companies',
        loadComponent: () => import('./companies/components/companies-list/companies-list.component').then(m => m.CompaniesListComponent),
        title: 'Companies - Elmtalq Admin'
      },
      {
        path: 'companies/:id',
        loadComponent: () => import('./companies/components/company-detail/company-detail.component').then(m => m.CompanyDetailComponent),
        title: 'Company Details - Elmtalq Admin'
      },
      {
        path: 'companies/:id/edit',
        loadComponent: () => import('./companies/components/company-edit/company-edit.component').then(m => m.CompanyEditComponent),
        title: 'Edit Company - Elmtalq Admin'
      },
      {
        path: 'employees',
        loadComponent: () => import('./employees/components/employees-list/employees-list.component').then(m => m.EmployeesListComponent),
        title: 'Employees - Elmtalq Admin'
      },
      {
        path: 'employees/:id',
        loadComponent: () => import('./employees/components/employee-detail/employee-detail.component').then(m => m.EmployeeDetailComponent),
        title: 'Employee Details - Elmtalq Admin'
      },
      {
        path: 'employees/:id/edit',
        loadComponent: () => import('./employees/components/employee-edit/employee-edit.component').then(m => m.EmployeeEditComponent),
        title: 'Edit Employee - Elmtalq Admin'
      },
      {
        path: 'search',
        loadComponent: () => import('./shared/components/search/search.component').then(m => m.SearchComponent),
        title: 'Search - Elmtalq Admin'
      },
      {
        path: 'settings',
        loadComponent: () => import('./shared/components/settings/settings.component').then(m => m.SettingsComponent),
        title: 'Settings - Elmtalq Admin'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
