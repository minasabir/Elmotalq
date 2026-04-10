import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EmployeesService } from '../../../core/services/employees.service';
import { Employee } from '../../../core/models/employee.model';

@Component({
    selector: 'app-employee-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './employee-detail.component.html',
    styleUrls: []
})
export class EmployeeDetailComponent implements OnInit {
    employee: Employee | null = null;
    isLoading = true;
    error: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private employeesService: EmployeesService
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadEmployee(id);
        } else {
            this.error = 'No employee ID provided';
            this.isLoading = false;
        }
    }

    loadEmployee(id: string): void {
        this.isLoading = true;
        this.employeesService.getEmployee(id).subscribe({
            next: (data) => {
                this.employee = data;
                this.isLoading = false;
            },
            error: (err) => {
                this.error = 'Error loading employee details';
                this.isLoading = false;
                console.error(err);
            }
        });
    }

    getRoleBadgeColor(role: string): string {
        switch (role?.toLowerCase()) {
            case 'admin': return 'bg-purple-100 text-purple-800';
            case 'secretary': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }
}
