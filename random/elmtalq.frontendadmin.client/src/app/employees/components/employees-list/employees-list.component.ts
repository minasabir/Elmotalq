import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EmployeesService } from '../../../core/services/employees.service';
import { Employee, CreateEmployeeRequest } from '../../../core/models/employee.model';

@Component({
  selector: 'app-employees-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './employees-list.component.html',
  styleUrls: []
})
export class EmployeesListComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  isLoading = false;
  isSaving = false;
  searchTerm = '';
  selectedEmployees: string[] = [];
  showCreateForm = false;
  employeeForm: FormGroup;
  errorMessage = '';

  constructor(
    private employeesService: EmployeesService,
    private fb: FormBuilder
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      role: [1, Validators.required], // Default to Secretary (1)
      password: ['', [Validators.required, Validators.minLength(6)]],
      salary: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.employeesService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.filteredEmployees = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.isLoading = false;
      }
    });
  }

  filterEmployees(): void {
    this.filteredEmployees = this.employees.filter(employee =>
      employee.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onSearchChange(): void {
    this.filterEmployees();
  }

  toggleEmployeeSelection(employeeId: string): void {
    const index = this.selectedEmployees.indexOf(employeeId);
    if (index > -1) {
      this.selectedEmployees.splice(index, 1);
    } else {
      this.selectedEmployees.push(employeeId);
    }
  }

  selectAllEmployees(): void {
    if (this.selectedEmployees.length === this.filteredEmployees.length) {
      this.selectedEmployees = [];
    } else {
      this.selectedEmployees = this.filteredEmployees.map(e => e.id);
    }
  }

  toggleEmployeeStatus(employee: Employee): void {
    const updatedEmployee = { ...employee, isActive: !employee.isActive };
    this.employeesService.updateEmployee(employee.id, updatedEmployee).subscribe({
      next: () => {
        this.loadEmployees();
      },
      error: (error) => {
        console.error('Error updating employee status:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) return;

    this.isSaving = true;
    this.errorMessage = '';
    const request: CreateEmployeeRequest = this.employeeForm.value;

    this.employeesService.createEmployee(request).subscribe({
      next: () => {
        this.isSaving = false;
        this.showCreateForm = false;
        this.employeeForm.reset({ role: 1, salary: 0 });
        this.loadEmployees();
      },
      error: (error) => {
        this.errorMessage = typeof error === 'string' ? error : 'Failed to create employee';
        this.isSaving = false;
      }
    });
  }

  resetCreateForm(): void {
    this.showCreateForm = false;
    this.employeeForm.reset({ role: 1, salary: 0 });
    this.errorMessage = '';
  }

  deleteEmployee(id: string): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      // Assuming deleteEmployee exists in service (I should check or add if missing)
      // Actually, looking at service, it doesn't have deleteEmployee.
      // I'll check the controller again for Delete endpoint.
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getRoleBadgeColor(role: string): string {
    const r = role.toString().toLowerCase();
    if (r === '0' || r === 'owner') return 'bg-red-100 text-red-800';
    if (r === '1' || r === 'secretary') return 'bg-green-100 text-green-800';
    if (r === '2' || r === 'staff') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  }
}
