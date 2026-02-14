import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidatesService } from '../core/services/candidates.service';
import { CompaniesService } from '../core/services/companies.service';
import { EmployeesService } from '../core/services/employees.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats = {
    totalCandidates: 0,
    unassignedCandidates: 0,
    totalCompanies: 0,
    unassignedCompanies: 0,
    totalEmployees: 0,
    recentActivity: []
  };

  isLoading = true;

  constructor(
    private candidatesService: CandidatesService,
    private companiesService: CompaniesService,
    private employeesService: EmployeesService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    // Load all data in parallel
    Promise.all([
      this.candidatesService.getCandidates().toPromise(),
      this.candidatesService.getUnassignedCandidates().toPromise(),
      this.companiesService.getCompanies().toPromise(),
      this.companiesService.getUnassignedCompanies().toPromise(),
      this.employeesService.getEmployees().toPromise()
    ]).then(([candidates, unassignedCandidates, companies, unassignedCompanies, employees]) => {
      this.stats = {
        totalCandidates: candidates?.length || 0,
        unassignedCandidates: unassignedCandidates?.length || 0,
        totalCompanies: companies?.length || 0,
        unassignedCompanies: unassignedCompanies?.length || 0,
        totalEmployees: employees?.length || 0,
        recentActivity: []
      };
      this.isLoading = false;
    }).catch(error => {
      console.error('Error loading dashboard data:', error);
      this.isLoading = false;
    });
  }

  getPercentage(value: number, total: number): number {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  }
}
