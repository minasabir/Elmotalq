import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Employee, CreateEmployeeRequest, UpdateEmployeeRequest } from '../models/employee.model';
import { ApiResponse } from '../../shared/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<Employee[]> {
    return this.http
      .get<ApiResponse<Employee[]>>(`${this.apiUrl}/AdminElmtalq/Employees`)
      .pipe(
        map(response => response.data ?? []),
        catchError(this.handleError)
      );
  }

  getEmployee(id: string): Observable<Employee> {
    return this.http
      .get<ApiResponse<Employee>>(`${this.apiUrl}/AdminElmtalq/Employees/${id}`)
      .pipe(
        map(response => response.data as Employee),
        catchError(this.handleError)
      );
  }

  createEmployee(employee: CreateEmployeeRequest): Observable<Employee> {
    return this.http
      .post<ApiResponse<Employee>>(`${this.apiUrl}/AdminElmtalq/Employees`, employee)
      .pipe(
        map(response => response.data as Employee),
        catchError(this.handleError)
      );
  }

  updateEmployee(id: string, employee: UpdateEmployeeRequest): Observable<Employee> {
    return this.http
      .patch<ApiResponse<Employee>>(`${this.apiUrl}/AdminElmtalq/Employees/${id}`, employee)
      .pipe(
        map(response => response.data as Employee),
        catchError(this.handleError)
      );
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
