import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Employee, CreateEmployeeRequest, UpdateEmployeeRequest } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/AdminElmtalq/Employees`)
      .pipe(catchError(this.handleError));
  }

  createEmployee(employee: CreateEmployeeRequest): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}/AdminElmtalq/Employees`, employee)
      .pipe(catchError(this.handleError));
  }

  updateEmployee(id: string, employee: UpdateEmployeeRequest): Observable<Employee> {
    return this.http.patch<Employee>(`${this.apiUrl}/AdminElmtalq/Employees/${id}`, employee)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.message || `Server error: ${error.status}`;
    }
    return throwError(() => errorMessage);
  }
}
