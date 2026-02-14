import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeesService } from '../../../core/services/employees.service';
import { Employee } from '../../../core/models/employee.model';

@Component({
  selector: 'app-employees-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss']
})
export class EmployeesListComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  isLoading = false;
  searchTerm = '';
  selectedEmployees: string[] = [];
  showCreateForm = false;

  constructor(private employeesService: EmployeesService) {}

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

  deleteEmployee(id: string): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      // Note: Assuming delete functionality exists in the service
      console.log('Delete employee:', id);
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getRoleBadgeColor(role: string): string {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'secretary':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
