import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeesService } from '../../../core/services/employees.service';
import { Employee, UpdateEmployeeRequest } from '../../../core/models/employee.model';

@Component({
    selector: 'app-employee-edit',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
    templateUrl: './employee-edit.component.html',
    styleUrls: []
})
export class EmployeeEditComponent implements OnInit {
    editForm: FormGroup;
    employeeId: string | null = null;
    isLoading = true;
    isSaving = false;
    error: string | null = null;
    successMessage: string | null = null;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private employeesService: EmployeesService
    ) {
        this.editForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phoneNumber: ['', Validators.required],
            role: ['', Validators.required],
            isActive: [true],
            salary: [0, [Validators.required, Validators.min(0)]]
        });
    }

    ngOnInit(): void {
        this.employeeId = this.route.snapshot.paramMap.get('id');
        if (this.employeeId) {
            this.loadEmployee(this.employeeId);
        } else {
            this.error = 'No employee ID provided';
            this.isLoading = false;
        }
    }

    loadEmployee(id: string): void {
        this.isLoading = true;
        this.employeesService.getEmployee(id).subscribe({
            next: (employee) => {
                this.editForm.patchValue({
                    name: employee.name,
                    email: employee.email,
                    phoneNumber: employee.phoneNumber,
                    role: employee.role,
                    isActive: employee.isActive,
                    salary: employee.salary
                });
                this.isLoading = false;
            },
            error: (err) => {
                this.error = 'Error loading employee data';
                this.isLoading = false;
            }
        });
    }

    onSubmit(): void {
        if (this.editForm.invalid || !this.employeeId) return;

        this.isSaving = true;
        this.error = null;
        this.successMessage = null;

        const request: UpdateEmployeeRequest = {
            name: this.editForm.value.name,
            email: this.editForm.value.email,
            phoneNumber: this.editForm.value.phoneNumber,
            role: this.editForm.value.role,
            isActive: this.editForm.value.isActive,
            salary: this.editForm.value.salary
        };

        this.employeesService.updateEmployee(this.employeeId, request).subscribe({
            next: () => {
                this.isSaving = false;
                this.successMessage = 'Employee updated successfully';
                setTimeout(() => this.router.navigate(['/employees', this.employeeId]), 2000);
            },
            error: (err) => {
                this.error = 'Error updating employee';
                this.isSaving = false;
            }
        });
    }
}
